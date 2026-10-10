import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const clientId = `claude_${crypto.randomBytes(8).toString("hex")}`;
    const clientSecret = `sec_${crypto.randomBytes(16).toString("hex")}`;

    const clientMetadata = {
      client_id: clientId,
      client_secret: clientSecret,
      client_name: body.client_name || "Claude",
      redirect_uris: body.redirect_uris || ["https://claude.ai/api/connectors/oauth/callback"],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "client_secret_post",
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_secret_expires_at: 0,
    };

    return NextResponse.json(clientMetadata, {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "invalid_client_metadata", error_description: err?.message || "Failed to register client" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
