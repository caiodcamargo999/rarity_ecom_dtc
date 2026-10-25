import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { normalizeState, US_STATES_MAP } from "@/lib/analytics-data";
import { resolveCountry, safeDecode } from "@/lib/geo";

function detectChannelServer(referrer = "", utms: Record<string, string> = {}, channelOverride?: string): {
  channel: string;
  source: string;
  medium: string;
} {
  const ref = (referrer || "").toLowerCase();
  const utmSource = (utms.utm_source || "").toLowerCase();
  const utmMedium = (utms.utm_medium || "").toLowerCase();
  const hasFbclid = Boolean(utms.fbclid);
  const hasGclid = Boolean(utms.gclid);
  const hasTtclid = Boolean(utms.ttclid);

  // Safeguard: reject false Meta Ads override if no fbclid and no paid Meta UTMs
  if (
    channelOverride === "Meta Ads" &&
    !hasFbclid &&
    !utmSource.includes("meta") &&
    !utmSource.includes("facebook") &&
    !utmSource.includes("instagram") &&
    utmSource !== "fb" &&
    utmSource !== "ig"
  ) {
    channelOverride = undefined;
  }

  if (channelOverride) {
    return {
      channel: channelOverride,
      source: utms.utm_source || channelOverride,
      medium: utms.utm_medium || "tracked",
    };
  }

  // ChatGPT & AI Search
  if (
    ref.includes("chatgpt.com") ||
    ref.includes("chat.openai.com") ||
    ref.includes("openai.com") ||
    ref.includes("claude.ai") ||
    ref.includes("perplexity.ai") ||
    ref.includes("gemini.google.com") ||
    ref.includes("copilot.microsoft.com") ||
    utmSource.includes("chatgpt") ||
    utmSource.includes("openai") ||
    utmSource.includes("claude") ||
    utmSource.includes("perplexity")
  ) {
    let source = "ChatGPT";
    if (ref.includes("claude") || utmSource.includes("claude")) source = "Claude AI";
    else if (ref.includes("perplexity") || utmSource.includes("perplexity")) source = "Perplexity AI";
    else if (ref.includes("gemini") || utmSource.includes("gemini")) source = "Google Gemini";
    else if (ref.includes("copilot") || utmSource.includes("copilot")) source = "Microsoft Copilot";
    return { channel: "ChatGPT / AI Search", source, medium: "ai_search" };
  }

  // Meta Ads (requires explicit fbclid or paid UTMs)
  if (
    hasFbclid ||
    ((utmSource.includes("meta") || utmSource.includes("facebook") || utmSource.includes("instagram") || utmSource === "fb" || utmSource === "ig") &&
      (utmMedium.includes("cpc") || utmMedium.includes("paid") || utmMedium.includes("ad") || utmMedium.includes("feed") || utmMedium.includes("story") || utmMedium.includes("reels")))
  ) {
    return {
      channel: "Meta Ads",
      source: utmSource || (ref.includes("instagram") ? "Instagram Ads" : "Facebook Ads"),
      medium: utmMedium || "paid_social",
    };
  }

  // Google Ads
  if (
    hasGclid ||
    ((utmSource.includes("google") || utmSource.includes("adwords") || utmSource.includes("pmax")) &&
      (utmMedium.includes("cpc") || utmMedium.includes("ppc") || utmMedium.includes("ad") || utmMedium.includes("search") || utmMedium.includes("display")))
  ) {
    return { channel: "Google Ads", source: "Google Ads", medium: utmMedium || "cpc" };
  }

  // Instagram Organic
  if (ref.includes("instagram.com") || ref.includes("l.instagram.com") || utmSource === "instagram" || utmSource === "ig") {
    return { channel: "Instagram Organic", source: "Instagram", medium: utmMedium || "social_organic" };
  }

  // TikTok
  if (hasTtclid || ref.includes("tiktok.com") || utmSource.includes("tiktok")) {
    const isPaid = hasTtclid || utmMedium.includes("cpc") || utmMedium.includes("paid");
    return { channel: isPaid ? "TikTok Ads" : "TikTok Organic", source: "TikTok", medium: isPaid ? "paid_social" : "social_organic" };
  }

  // YouTube
  if (ref.includes("youtube.com") || ref.includes("youtu.be") || utmSource.includes("youtube")) {
    const isPaid = utmMedium.includes("cpc") || utmMedium.includes("paid") || utmMedium.includes("video_ad");
    return { channel: isPaid ? "YouTube Ads" : "YouTube Organic", source: "YouTube", medium: isPaid ? "video_ad" : "social_organic" };
  }

  // LinkedIn
  if (ref.includes("linkedin.com") || ref.includes("lnkd.in") || utmSource.includes("linkedin")) {
    const isPaid = utmMedium.includes("cpc") || utmMedium.includes("paid");
    return { channel: isPaid ? "LinkedIn Ads" : "LinkedIn Organic", source: "LinkedIn", medium: isPaid ? "paid_social" : "social_organic" };
  }

  // X / Twitter
  if (ref.includes("t.co") || ref.includes("twitter.com") || ref.includes("x.com") || utmSource.includes("twitter")) {
    return { channel: "X / Twitter", source: "X (Twitter)", medium: utmMedium || "social_organic" };
  }

  // Google Organic
  if (ref.includes("google.") || ref.includes("google.com")) {
    return { channel: "Google Organic", source: "Google Search", medium: "organic_search" };
  }

  // Email
  if (utmMedium.includes("email") || utmMedium.includes("newsletter") || utmSource.includes("klaviyo") || utmSource.includes("mailchimp")) {
    return { channel: "Email Marketing", source: utmSource || "Newsletter", medium: "email" };
  }

  if (!ref || ref === "direct") {
    return { channel: utmSource ? `Campaign (${utmSource})` : "Direct / Bookmarks", source: utmSource || "Direct", medium: utmMedium || "none" };
  }

  return { channel: utmSource || "Referral", source: utmSource || "Web Referral", medium: utmMedium || "referral" };
}

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
      channel,
      source,
      medium,
      campaign,
    } = body;

    // Ignore admin or internal pages
    if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/api"))) {
      return NextResponse.json({ success: true, ignored: true });
    }

    if (!visitorId || !sessionId) {
      return NextResponse.json({ success: false, error: "Missing visitor or session id" }, { status: 400 });
    }

    // Geolocation Resolution
    const { name: country, code: countryCode } = resolveCountry(
      body.country ||
        req.headers.get("x-vercel-ip-country") ||
        req.headers.get("cf-ipcountry") ||
        req.headers.get("x-country-code") ||
        "United States"
    );

    const regionRaw = safeDecode(
      body.region ||
        req.headers.get("x-vercel-ip-country-region") ||
        req.headers.get("cf-region-code") ||
        req.headers.get("cf-region") ||
        ""
    );

    // Vercel sends the city URL-encoded ("Moses%20Lake"); decode it.
    const city = safeDecode(
      body.city ||
        req.headers.get("x-vercel-ip-city") ||
        req.headers.get("cf-ipcity") ||
        ""
    );

    // Full state name for the US ("WA" -> "Washington"); raw region elsewhere.
    let state = "";
    if (regionRaw) {
      if (countryCode === "US") {
        const { stateCode } = normalizeState(regionRaw);
        state = US_STATES_MAP[stateCode] || "";
      } else {
        state = regionRaw;
      }
    }

    // Channel Detection
    const detected = detectChannelServer(referrer, utms, channel);

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: true, warning: "Supabase credentials not configured in env" });
    }

    const nowIso = new Date().toISOString();
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "";

    // 1. Handle PAGEVIEW event
    if (type === "pageview") {
      // Geo + device fields are refreshed on every pageview; only write the
      // geo keys we actually resolved so we never blank an existing value.
      const refreshFields = {
        last_touch_landing_page: pathname,
        device_type: device,
        browser,
        os,
        ip_address: clientIp,
        country,
        last_seen_at: nowIso,
        ...(city ? { city } : {}),
        ...(regionRaw ? { region: regionRaw } : {}),
        ...(state ? { state } : {}),
      };

      const { data: existingVisitor } = await supabaseAdmin
        .from("analytics_visitors")
        .select("visitor_id")
        .eq("visitor_id", visitorId)
        .maybeSingle();

      if (existingVisitor) {
        // Returning visitor: keep the original first-touch attribution.
        await supabaseAdmin.from("analytics_visitors").update(refreshFields).eq("visitor_id", visitorId);
      } else {
        await supabaseAdmin.from("analytics_visitors").insert({
          visitor_id: visitorId,
          first_touch_utm_source: detected.channel || utms?.utm_source || null,
          first_touch_utm_medium: detected.medium || utms?.utm_medium || null,
          first_touch_utm_campaign: campaign || utms?.utm_campaign || null,
          first_touch_utm_content: utms?.utm_content || null,
          first_touch_utm_term: utms?.utm_term || null,
          first_touch_referrer: referrer || null,
          first_touch_landing_page: pathname,
          ...refreshFields,
        });
      }

      // Upsert Session
      await supabaseAdmin.from("analytics_sessions").upsert(
        {
          session_id: sessionId,
          visitor_id: visitorId,
          started_at: nowIso,
          ended_at: nowIso,
          entry_path: pathname,
          exit_path: pathname,
          utm_source: detected.channel || utms?.utm_source || null,
          utm_medium: detected.medium || utms?.utm_medium || null,
          utm_campaign: campaign || utms?.utm_campaign || null,
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
        event_data: {
          title,
          searchParams,
          utms,
          device,
          country,
          state: state || regionRaw,
          city,
          channel: detected.channel,
          source: detected.source,
          medium: detected.medium,
        },
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

    // 3. Handle CUSTOM_EVENT
    else if (type === "custom_event") {
      await supabaseAdmin.from("analytics_events").insert({
        session_id: sessionId,
        visitor_id: visitorId,
        pathname,
        event_type: eventType || "custom",
        event_name: eventName || "Unnamed Event",
        event_data: {
          ...eventData,
          country,
          state: state || regionRaw,
          city,
          channel: detected.channel,
          source: detected.source,
        },
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
