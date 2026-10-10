import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      visitorId,
      sessionId,
      pathname = "/",
      title = "",
      searchParams = "",
      device = "desktop",
      os = "unknown",
      browser = "unknown",
      screenResolution = "",
      referrer = "",
      utms = {},
      eventType,
      eventName,
      eventData = {},
      durationSeconds = 0,
      maxScrollDepth = 0,
    } = body;

    // Ignore admin or internal pages
    if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/api"))) {
      return NextResponse.json({ success: true, ignored: true });
    }

    if (!visitorId || !sessionId) {
      return NextResponse.json({ success: false, error: "Missing visitor or session id" }, { status: 400 });
    }

    // Geolocation Resolution (Header or Client Payload)
    const country =
      body.country ||
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-country-code") ||
      "United States";

    const stateOrRegion =
      body.region ||
      req.headers.get("x-vercel-ip-country-region") ||
      req.headers.get("cf-region-code") ||
      req.headers.get("cf-region") ||
      "";

    const city =
      body.city ||
      req.headers.get("x-vercel-ip-city") ||
      req.headers.get("cf-ipcity") ||
      "";

    // If Supabase is not yet configured, gracefully acknowledge
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true, warning: "Supabase credentials not configured in env" });
    }

    const nowIso = new Date().toISOString();
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "";

    // 1. Handle PAGEVIEW event
    if (type === "pageview") {
      // Upsert Visitor
      await supabaseAdmin.from("analytics_visitors").upsert(
        {
          visitor_id: visitorId,
          first_touch_utm_source: utms?.utm_source || null,
          first_touch_utm_medium: utms?.utm_medium || null,
          first_touch_utm_campaign: utms?.utm_campaign || null,
          first_touch_utm_content: utms?.utm_content || null,
          first_touch_utm_term: utms?.utm_term || null,
          first_touch_referrer: referrer || null,
          first_touch_landing_page: pathname,
          last_touch_landing_page: pathname,
          device_type: device,
          browser,
          os,
          ip_address: clientIp,
          country,
          city: city || stateOrRegion || null,
          last_seen_at: nowIso,
        },
        { onConflict: "visitor_id", ignoreDuplicates: false }
      );

      // Upsert Session
      await supabaseAdmin.from("analytics_sessions").upsert(
        {
          session_id: sessionId,
          visitor_id: visitorId,
          started_at: nowIso,
          ended_at: nowIso,
          entry_path: pathname,
          exit_path: pathname,
          utm_source: utms?.utm_source || null,
          utm_medium: utms?.utm_medium || null,
          utm_campaign: utms?.utm_campaign || null,
          utm_content: utms?.utm_content || null,
          utm_term: utms?.utm_term || null,
          referrer,
          device,
          screen_resolution: screenResolution,
        },
        { onConflict: "session_id", ignoreDuplicates: false }
      );

      // Insert Pageview
      await supabaseAdmin.from("analytics_pageviews").insert({
        session_id: sessionId,
        visitor_id: visitorId,
        pathname,
        title,
        search_params: searchParams,
        referrer,
        scroll_depth_max: 0,
        duration_seconds: 0,
        created_at: nowIso,
      });

      // Insert Pageview event
      await supabaseAdmin.from("analytics_events").insert({
        session_id: sessionId,
        visitor_id: visitorId,
        pathname,
        event_type: "pageview",
        event_name: `Viewed ${pathname}`,
        event_data: { title, searchParams, utms, device, country, state: stateOrRegion, city },
        created_at: nowIso,
      });
    }

    // 2. Handle HEARTBEAT or PAGE_EXIT event
    else if (type === "heartbeat" || type === "page_exit") {
      await supabaseAdmin
        .from("analytics_sessions")
        .update({
          ended_at: nowIso,
          exit_path: pathname,
          duration_seconds: durationSeconds,
        })
        .eq("session_id", sessionId);

      await supabaseAdmin
        .from("analytics_visitors")
        .update({
          last_seen_at: nowIso,
          last_touch_landing_page: pathname,
        })
        .eq("visitor_id", visitorId);

      const { data: latestPageview } = await supabaseAdmin
        .from("analytics_pageviews")
        .select("id, scroll_depth_max, duration_seconds")
        .eq("session_id", sessionId)
        .eq("pathname", pathname)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestPageview) {
        await supabaseAdmin
          .from("analytics_pageviews")
          .update({
            duration_seconds: Math.max(latestPageview.duration_seconds || 0, durationSeconds),
            scroll_depth_max: Math.max(latestPageview.scroll_depth_max || 0, maxScrollDepth),
            is_bounce: durationSeconds < 10,
          })
          .eq("id", latestPageview.id);
      }
    }

    // 3. Handle CUSTOM_EVENT (Clicks, Milestones, VTurb plays)
    else if (type === "custom_event") {
      await supabaseAdmin.from("analytics_events").insert({
        session_id: sessionId,
        visitor_id: visitorId,
        pathname,
        event_type: eventType || "custom",
        event_name: eventName || "Unnamed Event",
        event_data: { ...eventData, country, state: stateOrRegion, city },
        created_at: nowIso,
      });

      await supabaseAdmin
        .from("analytics_visitors")
        .update({
          last_seen_at: nowIso,
          last_touch_landing_page: pathname,
        })
        .eq("visitor_id", visitorId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Telemetry ingestion error" }, { status: 500 });
  }
}
