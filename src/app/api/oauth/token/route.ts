import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = `rarity_token_${crypto.randomBytes(16).toString("hex")}`;
    const refreshToken = `rarity_ref_${crypto.randomBytes(16).toString("hex")}`;

    const tokenResponse = {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 315360000, // 10 years
      refresh_token: refreshToken,
      scope: "read analytics",
    };

    return NextResponse.json(tokenResponse, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Pragma": "no-cache",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "invalid_request", error_description: err?.message || "Token generation failed" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
