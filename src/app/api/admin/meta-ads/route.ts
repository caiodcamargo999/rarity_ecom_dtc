import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth-security";

// Per-ad delivery metrics from the Meta Marketing API (CTR, hook rate, spend).
// Needs two env vars on Vercel:
//   META_ACCESS_TOKEN     system-user token with ads_read
//   META_AD_ACCOUNT_ID    numeric ad account id (no "act_" prefix)
// Without them the route answers { configured: false } and the dashboard ranks by conversions only.

const HEADERS = { "Cache-Control": "no-store, no-cache, must-revalidate, private" };

function datePreset(range: string): string {
  switch (range) {
    case "today": return "today";
    case "yesterday": return "yesterday";
    case "7d": case "7d_excl": case "last_7d": case "last_7d_excl": return "last_7d";
    case "this_month": return "this_month";
    case "last_month": return "last_month";
    case "3m": case "last_3m": case "90d": return "last_90d";
    case "all": return "maximum";
    default: return "last_7d";
  }
}

const num = (v: unknown) => Number(v) || 0;
const actionValue = (list: { action_type: string; value: string }[] | undefined, type: string) =>
  num(list?.find((a) => a.action_type === type)?.value);

export async function GET(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: HEADERS });
  }
  const token = process.env.META_ACCESS_TOKEN;
  const account = (process.env.META_AD_ACCOUNT_ID || "").replace(/^act_/, "");
  if (!token || !account) {
    return NextResponse.json({ configured: false, ads: [] }, { headers: HEADERS });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "7d";
  const since = searchParams.get("startDate");
  const until = searchParams.get("endDate");

  const params = new URLSearchParams({
    level: "ad",
    fields: "campaign_name,adset_name,ad_name,impressions,inline_link_clicks,spend,actions",
    limit: "500",
    access_token: token,
  });
  if (range === "custom" && since) {
    params.set("time_range", JSON.stringify({ since: since.slice(0, 10), until: (until || since).slice(0, 10) }));
  } else {
    params.set("date_preset", datePreset(range));
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/act_${account}/insights?${params}`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { configured: true, error: json?.error?.message || "Meta API error", ads: [] },
        { status: 502, headers: HEADERS }
      );
    }

    // One row per campaign + ad set + ad name (the same creative can sit in several ad sets).
    const rows = new Map<string, { campaign: string; adSet: string; ad: string; impressions: number; spend: number; linkClicks: number; lpViews: number; plays3s: number; videoImpressions: number }>();
    for (const r of json.data || []) {
      const campaign = String(r.campaign_name || "").trim();
      const adSet = String(r.adset_name || "").trim();
      const ad = String(r.ad_name || "").trim();
      const key = `${campaign}|${adSet}|${ad}`;
      const x = rows.get(key) || { campaign, adSet, ad, impressions: 0, spend: 0, linkClicks: 0, lpViews: 0, plays3s: 0, videoImpressions: 0 };
      const plays = actionValue(r.actions, "video_view"); // 3-second video plays
      x.impressions += num(r.impressions);
      x.spend += num(r.spend);
      x.linkClicks += num(r.inline_link_clicks);
      x.lpViews += actionValue(r.actions, "landing_page_view");
      x.plays3s += plays;
      if (plays > 0) x.videoImpressions += num(r.impressions); // hook rate only makes sense for video
      rows.set(key, x);
    }
    const ads = Array.from(rows.values()).map((x) => ({ ...x, spend: Math.round(x.spend * 100) / 100 }));
    return NextResponse.json({ configured: true, ads }, { headers: HEADERS });
  } catch (e: any) {
    return NextResponse.json({ configured: true, error: e?.message || "Meta fetch failed", ads: [] }, { status: 502, headers: HEADERS });
  }
}
