import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD || "rarity2025";
const AUTH_COOKIE_NAME = "rarity_analytics_auth";
const LEGACY_COOKIE_NAME = "rarity_matrix_auth";

function getExpectedToken(): string {
  return crypto.createHash("sha256").update(`rarity_analytics_${ADMIN_PASSWORD}`).digest("hex");
}

function getLegacyToken(): string {
  return crypto.createHash("sha256").update(`rarity_matrix_${ADMIN_PASSWORD}`).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || password.trim() !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "Invalid access key / password" }, { status: 401 });
    }

    const token = getExpectedToken();
    const res = NextResponse.json({ success: true, message: "Authentication successful" });

    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Auth error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME)?.value || req.cookies.get(LEGACY_COOKIE_NAME)?.value;
  const expected = getExpectedToken();
  const legacy = getLegacyToken();

  if (cookie && (cookie === expected || cookie === legacy)) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.delete(AUTH_COOKIE_NAME);
  res.cookies.delete(LEGACY_COOKIE_NAME);
  return res;
}
