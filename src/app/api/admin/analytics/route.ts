import { NextRequest, NextResponse } from "next/server";
import { getFullAnalyticsData } from "@/lib/analytics-data";
import crypto from "crypto";

const ADMIN_PASSWORD = (process.env.ADMIN_DASHBOARD_PASSWORD || "rarity2025").trim();
const AUTH_COOKIE_NAME = "rarity_analytics_auth";
const LEGACY_COOKIE_NAME = "rarity_matrix_auth";

function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME)?.value || req.cookies.get(LEGACY_COOKIE_NAME)?.value;
  const expected = crypto.createHash("sha256").update(`rarity_analytics_${ADMIN_PASSWORD}`).digest("hex");
  const legacyExpected = crypto.createHash("sha256").update(`rarity_matrix_${ADMIN_PASSWORD}`).digest("hex");
  return cookie === expected || cookie === legacyExpected;
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "7d";
  const customStart = searchParams.get("startDate") || searchParams.get("customStart") || undefined;
  const customEnd = searchParams.get("endDate") || searchParams.get("customEnd") || undefined;
  const visitorIdDrilldown = searchParams.get("visitorId") || "";

  try {
    const data = await getFullAnalyticsData(range, visitorIdDrilldown, customStart, customEnd);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error in admin analytics route:", err);
    return NextResponse.json({ error: err?.message || "Aggregation error" }, { status: 500 });
  }
}
