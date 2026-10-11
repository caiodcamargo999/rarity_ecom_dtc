import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  verifySessionToken,
  generateSignedSessionToken,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  getClientIp,
  AUTH_COOKIE_NAME,
  LEGACY_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth-security";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Check rate limit
  const rateLimitStatus = checkRateLimit(ip);
  if (rateLimitStatus.isLocked) {
    return NextResponse.json(
      {
        success: false,
        error: "RATE_LIMITED",
        message: `Too many failed login attempts. Security lock active for ${rateLimitStatus.remainingSeconds}s.`,
        retryAfter: rateLimitStatus.remainingSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimitStatus.remainingSeconds.toString(),
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { password, _hp_sec } = body;

    // 2. Anti-bot honeypot check: If the hidden honeypot field is filled, reject silently
    if (_hp_sec && typeof _hp_sec === "string" && _hp_sec.length > 0) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. Constant-time password validation
    const isValid = verifyPassword(password);

    if (!isValid) {
      const record = recordFailedAttempt(ip);
      const msg = record.isLocked
        ? `Too many failed attempts. Security lock active for ${record.remainingSeconds}s.`
        : `Invalid access key. ${record.attemptsLeft} attempt(s) remaining before lockout.`;

      return NextResponse.json(
        {
          success: false,
          message: msg,
          attemptsLeft: record.attemptsLeft,
          isLocked: record.isLocked,
        },
        {
          status: record.isLocked ? 429 : 401,
          headers: {
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff",
          },
        }
      );
    }

    // 4. Success: Clear rate limit & issue cryptographically signed session token
    clearRateLimit(ip);
    const sessionToken = generateSignedSessionToken();

    const res = NextResponse.json(
      { success: true, message: "Authentication successful" },
      {
        headers: {
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "no-store, no-cache, must-revalidate, private",
        },
      }
    );

    res.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || "Auth error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const cookie =
    req.cookies.get(AUTH_COOKIE_NAME)?.value ||
    req.cookies.get(LEGACY_COOKIE_NAME)?.value;

  const isAuth = verifySessionToken(cookie);

  return NextResponse.json(
    { authenticated: isAuth },
    {
      status: isAuth ? 200 : 401,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}

export async function DELETE() {
  const res = NextResponse.json(
    { success: true, message: "Logged out" },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );

  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  res.cookies.set(LEGACY_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return res;
}
