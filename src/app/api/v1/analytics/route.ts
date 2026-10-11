import { NextRequest, NextResponse } from "next/server";
import { getFullAnalyticsData } from "@/lib/analytics-data";
import { isRequestAuthenticated } from "@/lib/auth-security";

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
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Invalid or missing API key. Please pass 'x-api-key' header, or 'Authorization: Bearer <key>'.",
      },
      {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, no-cache, must-revalidate, private",
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "7d";
  const customStart = searchParams.get("startDate") || searchParams.get("customStart") || undefined;
  const customEnd = searchParams.get("endDate") || searchParams.get("customEnd") || undefined;
  const visitorIdDrilldown = searchParams.get("visitorId") || "";

  try {
    const data = await getFullAnalyticsData(range, visitorIdDrilldown, customStart, customEnd);
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: any) {
    console.error("Error in API v1 analytics route:", err);
    return NextResponse.json(
      { error: err?.message || "Aggregation error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, no-cache, must-revalidate, private",
        },
      }
    );
  }
}
