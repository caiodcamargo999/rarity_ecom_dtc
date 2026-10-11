import { NextRequest, NextResponse } from "next/server";
import { getFullAnalyticsData } from "@/lib/analytics-data";
import { isRequestAuthenticated } from "@/lib/auth-security";

export async function GET(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json(
      { error: "Unauthorized access to production telemetry" },
      {
        status: 401,
        headers: {
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
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  } catch (err: any) {
    console.error("Error in admin analytics route:", err);
    return NextResponse.json(
      { error: err?.message || "Aggregation error" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, private",
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  }
}
