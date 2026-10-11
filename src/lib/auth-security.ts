import crypto from "crypto";
import type { NextRequest } from "next/server";

// Secret key for HMAC signing. In production, provide ADMIN_SESSION_SECRET in .env
const SECRET_SEED =
  process.env.ADMIN_SESSION_SECRET ||
  (process.env.ADMIN_DASHBOARD_PASSWORD ? `${process.env.ADMIN_DASHBOARD_PASSWORD}_rarity_secure_salt_2026_x9k` : "rarity_vault_secure_salt_super_secret_key_2026_99");

export const ADMIN_PASSWORD = (process.env.ADMIN_DASHBOARD_PASSWORD || "rarity2025").trim();
export const AUTH_COOKIE_NAME = "rarity_analytics_auth";
export const LEGACY_COOKIE_NAME = "rarity_matrix_auth";

// Session lifespan: 7 days in seconds
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// Rate limiting in-memory store for brute-force protection
interface RateLimitEntry {
  attempts: number;
  lockoutUntil: number;
  lastAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const WINDOW_DURATION_MS = 15 * 60 * 1000; // 15 minutes window

// Clean up old rate limit entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((entry, ip) => {
      if (now > entry.lockoutUntil && now - entry.lastAttempt > WINDOW_DURATION_MS) {
        rateLimitMap.delete(ip);
      }
    });
  }, 10 * 60 * 1000);
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

/**
 * Check if an IP is currently rate-limited
 */
export function checkRateLimit(ip: string): { isLocked: boolean; remainingSeconds: number; attemptsLeft: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }

  if (entry.lockoutUntil > now) {
    const remainingSeconds = Math.ceil((entry.lockoutUntil - now) / 1000);
    return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
  }

  // If window expired, reset attempts
  if (now - entry.lastAttempt > WINDOW_DURATION_MS) {
    rateLimitMap.delete(ip);
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS };
  }

  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - entry.attempts);
  return { isLocked: false, remainingSeconds: 0, attemptsLeft };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(ip: string): { isLocked: boolean; remainingSeconds: number; attemptsLeft: number } {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);

  if (!entry || now - entry.lastAttempt > WINDOW_DURATION_MS) {
    entry = { attempts: 1, lockoutUntil: 0, lastAttempt: now };
  } else {
    entry.attempts += 1;
    entry.lastAttempt = now;
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockoutUntil = now + LOCKOUT_DURATION_MS;
    rateLimitMap.set(ip, entry);
    const remainingSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
    return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
  }

  rateLimitMap.set(ip, entry);
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - entry.attempts);
  return { isLocked: false, remainingSeconds: 0, attemptsLeft };
}

/**
 * Clear rate limit on successful authentication
 */
export function clearRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

/**
 * Constant-time password validation
 */
export function verifyPassword(input?: string): boolean {
  if (!input) return false;
  const cleanInput = input.trim();
  const expected = ADMIN_PASSWORD;

  // Primary password check using timing-safe buffer comparison
  if (cleanInput.length !== expected.length) {
    // Check fallback for default backward compatibility if configured
    if (cleanInput === "rarity2025" && expected !== "rarity2025") {
      return false; // Strict mode: only ADMIN_PASSWORD if customized
    }
    return false;
  }

  try {
    const bufA = Buffer.from(cleanInput, "utf-8");
    const bufB = Buffer.from(expected, "utf-8");
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Generate a cryptographically signed session token (HMAC-SHA256)
 */
export function generateSignedSessionToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + SESSION_MAX_AGE_SECONDS;
  const nonce = crypto.randomBytes(12).toString("hex");

  const payload = JSON.stringify({ role: "admin", iat: now, exp, nonce });
  const payloadB64 = Buffer.from(payload, "utf-8").toString("base64url");

  const signature = crypto
    .createHmac("sha256", SECRET_SEED)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verify signed session token
 */
export function verifySessionToken(token?: string): boolean {
  if (!token) return false;

  // 1. Check legacy sha256 hash for smooth transition without logging active users out
  const legacyHash = crypto.createHash("sha256").update(`rarity_analytics_${ADMIN_PASSWORD}`).digest("hex");
  const legacyMatrixHash = crypto.createHash("sha256").update(`rarity_matrix_${ADMIN_PASSWORD}`).digest("hex");
  if (token === legacyHash || token === legacyMatrixHash) {
    return true;
  }

  // 2. Validate HMAC token format: payload.signature
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_SEED)
      .update(payloadB64)
      .digest("base64url");

    if (signature.length !== expectedSignature.length) return false;

    const isSigValid = crypto.timingSafeEqual(
      Buffer.from(signature, "utf-8"),
      Buffer.from(expectedSignature, "utf-8")
    );

    if (!isSigValid) return false;

    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false; // Token expired
    }

    if (payload.role !== "admin") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Helper to check request authentication (cookie, API key, or Bearer token)
 */
export function isRequestAuthenticated(req: NextRequest): boolean {
  // 1. Check signed cookie
  const cookie = req.cookies.get(AUTH_COOKIE_NAME)?.value || req.cookies.get(LEGACY_COOKIE_NAME)?.value;
  if (cookie && verifySessionToken(cookie)) {
    return true;
  }

  // 2. Check x-api-key header
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKeyHeader && verifyPassword(apiKeyHeader)) {
    return true;
  }

  // 3. Check Authorization Bearer token
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (verifyPassword(token) || verifySessionToken(token)) {
      return true;
    }
  }

  // 4. Query param apiKey or key
  const url = new URL(req.url);
  const keyParam = url.searchParams.get("key") || url.searchParams.get("apiKey");
  if (keyParam && verifyPassword(keyParam)) {
    return true;
  }

  return false;
}
