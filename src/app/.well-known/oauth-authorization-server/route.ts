import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function GET() {
  const metadata = {
    issuer: "https://ecom.rarityagency.io",
    authorization_endpoint: "https://ecom.rarityagency.io/api/oauth/authorize",
    token_endpoint: "https://ecom.rarityagency.io/api/oauth/token",
    registration_endpoint: "https://ecom.rarityagency.io/api/oauth/register",
    userinfo_endpoint: "https://ecom.rarityagency.io/api/oauth/userinfo",
    response_types_supported: ["code", "token"],
    grant_types_supported: ["authorization_code", "refresh_token", "client_credentials"],
    token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post", "none"],
    code_challenge_methods_supported: ["S256", "plain"],
    scopes_supported: ["read", "analytics", "offline_access"],
  };

  return NextResponse.json(metadata, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
