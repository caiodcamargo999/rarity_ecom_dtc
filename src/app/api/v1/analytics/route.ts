import { NextRequest, NextResponse } from "next/server";
import { getFullAnalyticsData } from "@/lib/analytics-data";
import crypto from "crypto";

const ADMIN_PASSWORD = (process.env.ADMIN_DASHBOARD_PASSWORD || "rarity2025").trim();
const AUTH_COOKIE_NAME = "rarity_analytics_auth";
const LEGACY_COOKIE_NAME = "rarity_matrix_auth";

function isAuthorized(req: NextRequest): boolean {
  // 1. Query parameter key
  const url = new URL(req.url);
  const keyParam = url.searchParams.get("key") || url.searchParams.get("apiKey");
  if (keyParam && keyParam.trim() === ADMIN_PASSWORD) return true;

  // 2. Check API Key Header
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKeyHeader && apiKeyHeader.trim() === ADMIN_PASSWORD) return true;

  // 3. Check Bearer token
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === ADMIN_PASSWORD) return true;
  }

  // 4. Check Cookie authentication
  const cookie = req.cookies.get(AUTH_COOKIE_NAME)?.value || req.cookies.get(LEGACY_COOKIE_NAME)?.value;
  const expected = crypto.createHash("sha256").update(`rarity_analytics_${ADMIN_PASSWORD}`).digest("hex");
  const legacyExpected = crypto.createHash("sha256").update(`rarity_matrix_${ADMIN_PASSWORD}`).digest("hex");
  if (cookie === expected || cookie === legacyExpected) return true;

  return false;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    },
  });
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Invalid or missing API key. Please pass 'x-api-key' header, ?key=rarity2025, or 'Authorization: Bearer <key>'.",
      },
      {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "7d";
  const visitorIdDrilldown = searchParams.get("visitorId") || "";

  try {
    const data = await getFullAnalyticsData(range, visitorIdDrilldown);
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    console.error("Error in API v1 analytics route:", err);
    return NextResponse.json(
      { error: err?.message || "Aggregation error" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
