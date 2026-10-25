import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { resolveCountry, safeDecode } from "@/lib/geo";

export const US_STATES_MAP: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
};

export function cleanGeoString(val?: string | null): string {
  if (!val) return "";
  try {
    let decoded = decodeURIComponent(val.replace(/\+/g, " "));
    if (decoded.includes("%")) {
      try {
        decoded = decodeURIComponent(decoded);
      } catch (e) {}
    }
    return decoded.trim();
  } catch (e) {
    return val.replace(/%20/g, " ").trim();
  }
}

export const CITY_TO_STATE_MAP: Record<string, { state: string; stateCode: string; country?: string }> = {
  "moses lake": { state: "Washington", stateCode: "WA", country: "United States" },
  "des moines": { state: "Iowa", stateCode: "IA", country: "United States" },
  "san jose": { state: "California", stateCode: "CA", country: "United States" },
  "boydton": { state: "Virginia", stateCode: "VA", country: "United States" },
  "ashburn": { state: "Virginia", stateCode: "VA", country: "United States" },
  "seattle": { state: "Washington", stateCode: "WA", country: "United States" },
  "toronto": { state: "Ontario", stateCode: "ON", country: "Canada" },
  "campinas": { state: "São Paulo", stateCode: "SP", country: "Brazil" },
  "florianopolis": { state: "Santa Catarina", stateCode: "SC", country: "Brazil" },
  "florianópolis": { state: "Santa Catarina", stateCode: "SC", country: "Brazil" },
  "curitiba": { state: "Paraná", stateCode: "PR", country: "Brazil" },
  "lulea": { state: "Norrbotten", stateCode: "BD", country: "Sweden" },
  "luleå": { state: "Norrbotten", stateCode: "BD", country: "Sweden" },
  "san francisco": { state: "California", stateCode: "CA", country: "United States" },
  "los angeles": { state: "California", stateCode: "CA", country: "United States" },
  "new york": { state: "New York", stateCode: "NY", country: "United States" },
  "austin": { state: "Texas", stateCode: "TX", country: "United States" },
  "dallas": { state: "Texas", stateCode: "TX", country: "United States" },
  "chicago": { state: "Illinois", stateCode: "IL", country: "United States" },
  "atlanta": { state: "Georgia", stateCode: "GA", country: "United States" },
  "miami": { state: "Florida", stateCode: "FL", country: "United States" },
  "phoenix": { state: "Arizona", stateCode: "AZ", country: "United States" },
  "denver": { state: "Colorado", stateCode: "CO", country: "United States" },
  "boston": { state: "Massachusetts", stateCode: "MA", country: "United States" },
  "boardman": { state: "Oregon", stateCode: "OR", country: "United States" },
  "council bluffs": { state: "Iowa", stateCode: "IA", country: "United States" },
};

const STATE_NAME_TO_CODE: Record<string, string> = {};
Object.entries(US_STATES_MAP).forEach(([code, name]) => {
  STATE_NAME_TO_CODE[name.toLowerCase()] = code;
  STATE_NAME_TO_CODE[code.toLowerCase()] = code;
});

export function normalizeState(rawState?: string): { state: string; stateCode: string } {
  if (!rawState) return { state: "Direct / Global", stateCode: "US" };
  const clean = cleanGeoString(rawState);
  if (!clean) return { state: "Direct / Global", stateCode: "US" };

  const upper = clean.toUpperCase();
  if (US_STATES_MAP[upper]) {
    return { state: US_STATES_MAP[upper], stateCode: upper };
  }
  const lower = clean.toLowerCase();
  if (STATE_NAME_TO_CODE[lower]) {
    const code = STATE_NAME_TO_CODE[lower];
    return { state: US_STATES_MAP[code] || clean, stateCode: code };
  }
  if (CITY_TO_STATE_MAP[lower]) {
    const mapped = CITY_TO_STATE_MAP[lower];
    return { state: mapped.state, stateCode: mapped.stateCode };
  }
  if (clean.length === 2) {
    return { state: upper, stateCode: upper };
  }
  return { state: clean, stateCode: clean.length <= 3 ? upper : "" };
}

// Visitors saved before the tracker started storing the state have no region,
// only a city. These are the US cities seen so far, used ONLY as a fallback for
// those older rows. New rows get the real state from Vercel's geo header.
const LEGACY_US_CITY_TO_STATE: Record<string, string> = {
  "moses lake": "WA",
  "des moines": "IA",
  "san jose": "CA",
  boydton: "VA",
  ashburn: "VA",
};

/**
 * Resolves the state for a visitor row. Never derives a state from the city
 * name's letters (that is what produced "MO" for Moses Lake).
 */
export function resolveVisitorState(
  visitor: { state?: string | null; region?: string | null; city?: string | null },
  countryCode: string
): { state: string; stateCode: string } {
  const rawRegion = safeDecode(visitor.state || visitor.region || "");

  if (countryCode === "US") {
    let code = "";
    if (rawRegion) {
      const n = normalizeState(rawRegion);
      if (US_STATES_MAP[n.stateCode]) code = n.stateCode;
    }
    if (!code) code = LEGACY_US_CITY_TO_STATE[safeDecode(visitor.city).toLowerCase()] || "";
    if (code) return { state: US_STATES_MAP[code], stateCode: code };
    return { state: "Unknown state", stateCode: "—" };
  }

  if (rawRegion) {
    return { state: rawRegion, stateCode: rawRegion.length <= 3 ? rawRegion.toUpperCase() : "—" };
  }
  return { state: "Unknown region", stateCode: "—" };
}

export function classifyChannel(source?: string, medium?: string, referrer?: string): { channel: string; category: string } {
  const s = (source || "").toLowerCase().trim();
  const m = (medium || "").toLowerCase().trim();
  const r = (referrer || "").toLowerCase().trim();

  // Guard against legacy false Meta Ads created by previous tracking bug
  if ((s === "meta ads" || s === "meta_ads") && (m === "tracked" || !m || m === "none")) {
    return { channel: "Direct / Typed URL", category: "Direct" };
  }

  // 1. ChatGPT / AI Search
  if (
    s.includes("chatgpt") ||
    r.includes("chatgpt") ||
    r.includes("openai") ||
    s.includes("claude") ||
    r.includes("claude") ||
    s.includes("perplexity") ||
    r.includes("perplexity") ||
    s.includes("gemini") ||
    r.includes("gemini") ||
    m === "ai_search"
  ) {
    let name = "ChatGPT / AI Search";
    if (s.includes("claude") || r.includes("claude")) name = "Claude AI";
    else if (s.includes("perplexity") || r.includes("perplexity")) name = "Perplexity AI";
    else if (s.includes("gemini") || r.includes("gemini")) name = "Google Gemini";
    return { channel: name, category: "AI Search & LLMs" };
  }

  // 2. Meta Ads
  if (
    (s.includes("meta") || s.includes("facebook") || (s.includes("instagram") && (m.includes("cpc") || m.includes("paid") || m.includes("ad"))) || s.includes("fb_") || s.includes("ig_") || m.includes("paid_social")) &&
    m !== "tracked"
  ) {
    return { channel: "Meta Ads (FB & IG)", category: "Paid Social" };
  }

  // 3. Google Ads
  if (
    s.includes("google") &&
    (m.includes("cpc") || m.includes("ppc") || m.includes("ad") || m.includes("search") || m.includes("pmax"))
  ) {
    return { channel: "Google Ads (PMax/Search)", category: "Paid Search" };
  }

  // 4. Instagram Organic
  if (s.includes("instagram") || r.includes("instagram.com") || m.includes("instagram")) {
    return { channel: "Instagram Organic", category: "Organic Social" };
  }

  // 5. TikTok
  if (s.includes("tiktok") || r.includes("tiktok.com")) {
    return {
      channel: m.includes("cpc") || m.includes("paid") ? "TikTok Ads" : "TikTok Organic",
      category: m.includes("cpc") ? "Paid Social" : "Organic Social",
    };
  }

  // 6. YouTube
  if (s.includes("youtube") || r.includes("youtube.com") || r.includes("youtu.be")) {
    return {
      channel: m.includes("cpc") || m.includes("ad") ? "YouTube Ads" : "YouTube Organic",
      category: "Video Social",
    };
  }

  // 7. LinkedIn
  if (s.includes("linkedin") || r.includes("linkedin.com") || r.includes("lnkd.in")) {
    return {
      channel: m.includes("cpc") || m.includes("paid") ? "LinkedIn Ads" : "LinkedIn Organic",
      category: "B2B Social",
    };
  }

  // 8. X / Twitter
  if (s.includes("twitter") || s.includes("x.com") || r.includes("t.co") || r.includes("twitter.com") || r.includes("x.com")) {
    return { channel: "X / Twitter", category: "Organic Social" };
  }

  // 9. Google SEO Search
  if (r.includes("google.com") || r.includes("google.") || m === "organic_search" || s === "google") {
    return { channel: "Google Organic Search", category: "SEO Search" };
  }

  // 10. Email Marketing
  if (m.includes("email") || s.includes("klaviyo") || s.includes("newsletter") || s.includes("mailchimp")) {
    return { channel: "Email Marketing", category: "Direct Marketing" };
  }

  // 11. Direct
  if (!s || s === "direct" || s === "none" || !r || r === "direct") {
    return { channel: "Direct / Typed URL", category: "Direct" };
  }

  return { channel: s.charAt(0).toUpperCase() + s.slice(1), category: "Referral / Other" };
}

export async function getFullAnalyticsData(
  range: string = "7d",
  visitorIdDrilldown: string = "",
  customStart?: string,
  customEnd?: string
) {
  const now = new Date();
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (range === "today") {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
  } else if (range === "yesterday") {
    startDate = new Date();
    startDate.setDate(now.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date();
    endDate.setDate(now.getDate() - 1);
    endDate.setHours(23, 59, 59, 999);
  } else if (range === "7d_excl" || range === "last_7d_excl") {
    startDate = new Date();
    startDate.setDate(now.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date();
    endDate.setDate(now.getDate() - 1);
    endDate.setHours(23, 59, 59, 999);
  } else if (range === "7d") {
    startDate = new Date();
    startDate.setDate(now.getDate() - 7);
  } else if (range === "this_month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  } else if (range === "last_month") {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else if (range === "3m" || range === "last_3m" || range === "90d") {
    startDate = new Date();
    startDate.setDate(now.getDate() - 90);
  } else if (range === "custom" && customStart) {
    startDate = new Date(customStart);
    if (customEnd) {
      endDate = new Date(customEnd);
      if (customEnd.length <= 10) {
        endDate.setHours(23, 59, 59, 999);
      }
    }
  } else if (range === "all") {
    startDate = null; // No date filter - pulls all time since site creation!
    endDate = null;
  }

  if (visitorIdDrilldown) {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return { error: "Supabase not connected" };
    }

    const [visitorRes, pageviewsRes, eventsRes, leadsRes] = await Promise.all([
      supabaseAdmin.from("analytics_visitors").select("*").eq("visitor_id", visitorIdDrilldown).maybeSingle(),
      supabaseAdmin
        .from("analytics_pageviews")
        .select("*")
        .eq("visitor_id", visitorIdDrilldown)
        .order("created_at", { ascending: true }),
      supabaseAdmin
        .from("analytics_events")
        .select("*")
        .eq("visitor_id", visitorIdDrilldown)
        .order("created_at", { ascending: true }),
      supabaseAdmin
        .from("analytics_leads")
        .select("*")
        .eq("visitor_id", visitorIdDrilldown)
        .order("created_at", { ascending: true }),
    ]);

    const timeline: any[] = [];

    (pageviewsRes.data || []).forEach((pv) => {
      timeline.push({
        id: pv.id,
        type: "pageview",
        title: `Visited ${pv.pathname}`,
        pathname: pv.pathname,
        timestamp: pv.created_at,
        duration: pv.duration_seconds,
        scrollDepth: pv.scroll_depth_max,
        referrer: pv.referrer,
      });
    });

    (eventsRes.data || []).forEach((ev) => {
      timeline.push({
        id: ev.id,
        type: ev.event_type,
        title: ev.event_name,
        pathname: ev.pathname,
        timestamp: ev.created_at,
        data: ev.event_data,
      });
    });

    (leadsRes.data || []).forEach((lead) => {
      timeline.push({
        id: lead.id,
        type: "lead_submission",
        title: lead.scheduled_on_cal === "Yes" ? "Booked Strategy Call" : "Submitted Audit Form",
        pathname: lead.source,
        timestamp: lead.created_at,
        leadDetails: lead,
      });
    });

    timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return {
      visitor: visitorRes.data || null,
      timeline,
      leads: leadsRes.data || [],
    };
  }

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return {
      isDemo: false,
      timeframe: range,
      overview: {
        totalVisitors: 0,
        uniqueVisitors: 0,
        totalPageviews: 0,
        avgDurationSeconds: 0,
        avgScrollDepth: 0,
        activeLiveVisitors: 0,
        totalLeads: 0,
        totalBookings: 0,
        conversionRate: 0,
        vturbPlays: 0,
      },
      pagesPerformance: [],
      liveVisitors: [],
      recentJourneys: [],
      utmPerformance: [],
      channelStats: [],
      geoStats: { countries: [], states: [], cities: [] },
      heatmapByPath: {},
      vturbStats: {
        totalPlays: 0,
        totalUnlocks: 0,
        playRate: 0,
        pitchUnlockRate: 0,
        milestones: { m10s: 0, m30s: 0, m60s: 0, m120s: 0, m300s: 0, m600s: 0 },
      },
    };
  }

  const fiveMinutesAgoIso = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  // 1. Fetch live visitors
  const { data: liveData } = await supabaseAdmin
    .from("analytics_visitors")
    .select("visitor_id, full_name, email, phone, company_name, device_type, os, browser, country, state, region, city, first_touch_utm_source, first_touch_utm_medium, last_touch_landing_page, last_seen_at")
    .gte("last_seen_at", fiveMinutesAgoIso)
    .order("last_seen_at", { ascending: false })
    .limit(50);

  // 2. Fetch pageviews with date boundaries
  let pvQuery = supabaseAdmin
    .from("analytics_pageviews")
    .select("id, visitor_id, session_id, pathname, title, duration_seconds, scroll_depth_max, is_bounce, created_at");
  if (startDate) pvQuery = pvQuery.gte("created_at", startDate.toISOString());
  if (endDate) pvQuery = pvQuery.lte("created_at", endDate.toISOString());
  const { data: pageviewsData } = await pvQuery;

  // 3. Fetch events with date boundaries
  let evQuery = supabaseAdmin
    .from("analytics_events")
    .select("id, visitor_id, pathname, event_type, event_name, event_data, created_at");
  if (startDate) evQuery = evQuery.gte("created_at", startDate.toISOString());
  if (endDate) evQuery = evQuery.lte("created_at", endDate.toISOString());
  const { data: eventsData } = await evQuery;

  // 4. Fetch leads with date boundaries
  let ldQuery = supabaseAdmin
    .from("analytics_leads")
    .select("*");
  if (startDate) ldQuery = ldQuery.gte("created_at", startDate.toISOString());
  if (endDate) ldQuery = ldQuery.lte("created_at", endDate.toISOString());
  const { data: leadsData } = await ldQuery;

  // 5. Fetch sessions with date boundaries
  let sesQuery = supabaseAdmin
    .from("analytics_sessions")
    .select("*");
  if (startDate) sesQuery = sesQuery.gte("started_at", startDate.toISOString());
  if (endDate) sesQuery = sesQuery.lte("started_at", endDate.toISOString());
  const { data: sessionsData } = await sesQuery;

  // 6. Fetch visitors list with date boundaries
  let visQuery = supabaseAdmin
    .from("analytics_visitors")
    .select("*")
    .order("last_seen_at", { ascending: false });
  if (startDate) visQuery = visQuery.gte("last_seen_at", startDate.toISOString());
  if (endDate) visQuery = visQuery.lte("last_seen_at", endDate.toISOString());
  const { data: visitorsList } = await visQuery.limit(500);

  const allPageviews = (pageviewsData || []).filter((p) => !p.pathname?.startsWith("/admin") && !p.pathname?.startsWith("/api"));
  const allEvents = eventsData || [];
  const allLeads = leadsData || [];
  const allSessions = sessionsData || [];
  const allVisitors = visitorsList || [];

  const totalVisitors = new Set(allPageviews.map((p) => p.visitor_id)).size || allVisitors.length;
  const totalPageviews = allPageviews.length;
  const totalDuration = allPageviews.reduce((acc, p) => acc + (p.duration_seconds || 0), 0);
  const avgDurationSeconds = totalPageviews ? Math.round(totalDuration / totalPageviews) : 0;
  const avgScrollDepth = totalPageviews
    ? Math.round(allPageviews.reduce((acc, p) => acc + (p.scroll_depth_max || 0), 0) / totalPageviews)
    : 0;

  const totalLeads = allLeads.length;
  const totalBookings = allLeads.filter((l) => l.scheduled_on_cal === "Yes").length;
  const conversionRate = totalVisitors ? Number(((totalLeads / totalVisitors) * 100).toFixed(2)) : 0;

  // VTurb Video Analytics
  let vturbPlays = 0;
  let vturbUnlocks = 0;
  const vturbMilestones = {
    m10s: 0,
    m30s: 0,
    m60s: 0,
    m120s: 0,
    m300s: 0,
    m600s: 0,
  };

  for (const ev of allEvents) {
    if (ev.event_type === "vturb_play") {
      vturbPlays += 1;
    } else if (ev.event_type === "vturb_unlock") {
      vturbUnlocks += 1;
    } else if (ev.event_type === "vturb_milestone") {
      const secs = ev.event_data?.secondsWatched;
      if (secs >= 600) vturbMilestones.m600s += 1;
      else if (secs >= 300) vturbMilestones.m300s += 1;
      else if (secs >= 120) vturbMilestones.m120s += 1;
      else if (secs >= 60) vturbMilestones.m60s += 1;
      else if (secs >= 30) vturbMilestones.m30s += 1;
      else if (secs >= 10) vturbMilestones.m10s += 1;
    }
  }

  const vturbPlayRate = totalVisitors ? Number(((vturbPlays / totalVisitors) * 100).toFixed(1)) : 0;
  const vturbPitchUnlockRate = vturbPlays ? Number(((vturbUnlocks / vturbPlays) * 100).toFixed(1)) : 0;

  // Group Pageviews by Pathname
  const pageMap: Record<string, any> = {};
  for (const pv of allPageviews) {
    const path = pv.pathname || "/";
    if (!pageMap[path]) {
      pageMap[path] = {
        pathname: path,
        title: pv.title || path,
        pageviews: 0,
        visitorsSet: new Set<string>(),
        totalDuration: 0,
        totalScroll: 0,
        bounces: 0,
        ctaClicks: 0,
        videoPlays: 0,
        leadsCount: 0,
        bookingsCount: 0,
      };
    }
    pageMap[path].pageviews += 1;
    pageMap[path].visitorsSet.add(pv.visitor_id);
    pageMap[path].totalDuration += pv.duration_seconds || 0;
    pageMap[path].totalScroll += pv.scroll_depth_max || 0;
    if (pv.is_bounce) pageMap[path].bounces += 1;
  }

  for (const ev of allEvents) {
    const path = ev.pathname || "/";
    if (pageMap[path]) {
      if (ev.event_type === "cta_click") {
        pageMap[path].ctaClicks += 1;
      } else if (ev.event_type === "vturb_play") {
        pageMap[path].videoPlays += 1;
      }
    }
  }

  for (const l of allLeads) {
    const path = l.source || "/";
    if (pageMap[path]) {
      pageMap[path].leadsCount += 1;
      if (l.scheduled_on_cal === "Yes") {
        pageMap[path].bookingsCount += 1;
      }
    }
  }

  const pagesPerformance = Object.values(pageMap).map((p: any) => {
    const uniqueVisitors = p.visitorsSet.size;
    return {
      pathname: p.pathname,
      title: p.title,
      pageviews: p.pageviews,
      uniqueVisitors,
      avgDuration: p.pageviews ? Math.round(p.totalDuration / p.pageviews) : 0,
      avgScrollDepth: p.pageviews ? Math.round(p.totalScroll / p.pageviews) : 0,
      ctaClicks: p.ctaClicks,
      videoPlays: p.videoPlays,
      leadsCount: p.leadsCount,
      bookingsCount: p.bookingsCount,
      conversionRate: uniqueVisitors ? Number(((p.leadsCount / uniqueVisitors) * 100).toFixed(2)) : 0,
      bounceRate: p.pageviews ? Number(((p.bounces / p.pageviews) * 100).toFixed(1)) : 0,
    };
  });
  pagesPerformance.sort((a, b) => b.pageviews - a.pageviews);

  // Geolocation & US States Breakdown
  const countryMap: Record<string, { country: string; countryCode: string; visitors: number; leads: number; bookings: number }> = {};
  const stateMap: Record<string, { state: string; stateCode: string; country: string; visitors: number; leads: number; bookings: number }> = {};
  const cityMap: Record<string, { city: string; state: string; country: string; visitors: number; leads: number }> = {};

  const leadByVisitor = new Map<string, any>();
  allLeads.forEach((l) => {
    if (l.visitor_id) leadByVisitor.set(l.visitor_id, l);
  });

  for (const visitor of allVisitors) {
    const { name: countryName, code: countryCode } = resolveCountry(visitor.country);
    const visitorCity = safeDecode(visitor.city);

    const hasLead = leadByVisitor.has(visitor.visitor_id);
    const isBooking = hasLead && leadByVisitor.get(visitor.visitor_id)?.scheduled_on_cal === "Yes";

    if (!countryMap[countryName]) {
      countryMap[countryName] = {
        country: countryName,
        countryCode,
        visitors: 0,
        leads: 0,
        bookings: 0,
      };
    }
    countryMap[countryName].visitors += 1;
    if (hasLead) countryMap[countryName].leads += 1;
    if (isBooking) countryMap[countryName].bookings += 1;

    const { state, stateCode } = resolveVisitorState(visitor, countryCode);
    const stateKey = `${countryName}___${state}`;

    if (!stateMap[stateKey]) {
      stateMap[stateKey] = {
        state,
        stateCode,
        country: countryName,
        visitors: 0,
        leads: 0,
        bookings: 0,
      };
    }
    stateMap[stateKey].visitors += 1;
    if (hasLead) stateMap[stateKey].leads += 1;
    if (isBooking) stateMap[stateKey].bookings += 1;

    if (visitorCity) {
      const cityKey = `${visitorCity}___${state}___${countryName}`;
      if (!cityMap[cityKey]) {
        cityMap[cityKey] = {
          city: visitorCity,
          state,
          country: countryName,
          visitors: 0,
          leads: 0,
        };
      }
      cityMap[cityKey].visitors += 1;
      if (hasLead) cityMap[cityKey].leads += 1;
    }
  }

  const totalGeoVisitors = allVisitors.length || 1;

  const countriesList = Object.values(countryMap).map((c) => ({
    ...c,
    conversionRate: c.visitors ? Number(((c.leads / c.visitors) * 100).toFixed(1)) : 0,
    pct: Number(((c.visitors / totalGeoVisitors) * 100).toFixed(1)),
  }));
  countriesList.sort((a, b) => b.visitors - a.visitors);

  const statesList = Object.values(stateMap).map((s) => ({
    ...s,
    conversionRate: s.visitors ? Number(((s.leads / s.visitors) * 100).toFixed(1)) : 0,
    pct: Number(((s.visitors / totalGeoVisitors) * 100).toFixed(1)),
  }));
  statesList.sort((a, b) => b.visitors - a.visitors);

  const citiesList = Object.values(cityMap);
  citiesList.sort((a, b) => b.visitors - a.visitors);

  // Channels & Traffic Sources
  const channelMap: Record<string, { channel: string; category: string; sessions: number; leads: number; bookings: number }> = {};
  const utmMap: Record<string, any> = {};

  for (const s of allSessions) {
    const detected = classifyChannel(s.utm_source, s.utm_medium, s.referrer);
    const chKey = detected.channel;

    if (!channelMap[chKey]) {
      channelMap[chKey] = {
        channel: detected.channel,
        category: detected.category,
        sessions: 0,
        leads: 0,
        bookings: 0,
      };
    }
    channelMap[chKey].sessions += 1;

    const isFalseMeta = (s.utm_source === "Meta Ads" || s.utm_source === "meta_ads") && (!s.utm_campaign || s.utm_campaign === "none");
    const effectiveSource = isFalseMeta ? detected.channel : (s.utm_source || detected.channel);
    const effectiveCampaign = isFalseMeta ? "none" : (s.utm_campaign || "none");
    const effectiveMedium = isFalseMeta ? detected.category : (s.utm_medium || detected.category);

    const utmKey = `${effectiveSource}___${effectiveCampaign}`;
    if (!utmMap[utmKey]) {
      utmMap[utmKey] = {
        source: effectiveSource,
        campaign: effectiveCampaign,
        medium: effectiveMedium,
        sessions: 0,
        leads: 0,
      };
    }
    utmMap[utmKey].sessions += 1;
  }

  for (const l of allLeads) {
    const detected = classifyChannel(l.utm_source, l.utm_medium, l.source);
    const chKey = detected.channel;

    if (!channelMap[chKey]) {
      channelMap[chKey] = {
        channel: detected.channel,
        category: detected.category,
        sessions: 0,
        leads: 0,
        bookings: 0,
      };
    }
    channelMap[chKey].leads += 1;
    if (l.scheduled_on_cal === "Yes") {
      channelMap[chKey].bookings += 1;
    }

    const utmKey = `${l.utm_source || detected.channel}___${l.utm_campaign || "none"}`;
    if (utmMap[utmKey]) {
      utmMap[utmKey].leads += 1;
    }
  }

  const totalChannelSessions = allSessions.length || 1;
  const channelStats = Object.values(channelMap).map((c) => ({
    ...c,
    conversionRate: c.sessions ? Number(((c.leads / c.sessions) * 100).toFixed(1)) : 0,
    pct: Number(((c.sessions / totalChannelSessions) * 100).toFixed(1)),
  }));
  channelStats.sort((a, b) => b.sessions - a.sessions);

  const utmPerformance = Object.values(utmMap).map((u: any) => ({
    ...u,
    conversionRate: u.sessions ? Number(((u.leads / u.sessions) * 100).toFixed(2)) : 0,
  }));
  utmPerformance.sort((a, b) => b.sessions - a.sessions);

  // Heatmap Aggregations
  const heatmapByPath: Record<string, {
    clicks: Array<{ xPct: number; yPct: number; label: string; count: number; isBooking: boolean; section: string }>;
    hotspots: Array<{ label: string; section: string; count: number; isBooking: boolean }>;
    scrollStats: { m25: number; m50: number; m75: number; m90: number; m100: number; totalViews: number };
  }> = {};

  for (const pv of allPageviews) {
    const path = pv.pathname || "/";
    if (!heatmapByPath[path]) {
      heatmapByPath[path] = {
        clicks: [],
        hotspots: [],
        scrollStats: { m25: 0, m50: 0, m75: 0, m90: 0, m100: 0, totalViews: 0 },
      };
    }
    heatmapByPath[path].scrollStats.totalViews += 1;
    const s = pv.scroll_depth_max || 0;
    if (s >= 25) heatmapByPath[path].scrollStats.m25 += 1;
    if (s >= 50) heatmapByPath[path].scrollStats.m50 += 1;
    if (s >= 75) heatmapByPath[path].scrollStats.m75 += 1;
    if (s >= 90) heatmapByPath[path].scrollStats.m90 += 1;
    if (s >= 100) heatmapByPath[path].scrollStats.m100 += 1;
  }

  const clickGroups: Record<string, Record<string, any>> = {};
  for (const ev of allEvents) {
    if (ev.event_type === "cta_click" || ev.event_type === "warm_click") {
      const path = ev.pathname || "/";
      if (!clickGroups[path]) clickGroups[path] = {};

      const data = ev.event_data || {};
      const label = ev.event_name || data.label || "Click";
      const section = data.section || "general";
      const xPct = typeof data.xPct === "number" ? data.xPct : 50;
      const yPct = typeof data.yPct === "number" ? data.yPct : 50;
      const isBooking = Boolean(data.isBooking);

      const key = `${label}___${Math.round(xPct)}___${Math.round(yPct)}`;
      if (!clickGroups[path][key]) {
        clickGroups[path][key] = {
          label,
          section,
          xPct,
          yPct,
          count: 0,
          isBooking,
        };
      }
      clickGroups[path][key].count += 1;
    }
  }

  for (const [path, items] of Object.entries(clickGroups)) {
    if (!heatmapByPath[path]) {
      heatmapByPath[path] = {
        clicks: [],
        hotspots: [],
        scrollStats: { m25: 0, m50: 0, m75: 0, m90: 0, m100: 0, totalViews: 0 },
      };
    }
    const clickList = Object.values(items);
    clickList.sort((a, b) => b.count - a.count);
    heatmapByPath[path].clicks = clickList;
    heatmapByPath[path].hotspots = clickList.slice(0, 15);
  }

  return {
    isDemo: false,
    timeframe: range,
    overview: {
      totalVisitors,
      uniqueVisitors: totalVisitors,
      totalPageviews,
      avgDurationSeconds,
      avgScrollDepth,
      activeLiveVisitors: (liveData || []).length,
      totalLeads,
      totalBookings,
      conversionRate,
      vturbPlays,
    },
    pagesPerformance,
    liveVisitors: (liveData || []).map((v) => ({
      ...v,
      city: safeDecode(v.city),
      country: v.country ? resolveCountry(v.country).name : v.country,
      current_page: v.last_touch_landing_page,
      channel: classifyChannel(v.first_touch_utm_source, v.first_touch_utm_medium).channel,
    })),
    recentJourneys: allVisitors.map((v) => {
      const geoCountry = resolveCountry(v.country);
      const geoState = resolveVisitorState(v, geoCountry.code);
      return {
        ...v,
        city: safeDecode(v.city),
        country: v.country ? geoCountry.name : v.country,
        state: geoState.state,
        stateCode: geoState.stateCode,
        detectedChannel: classifyChannel(v.first_touch_utm_source, v.first_touch_utm_medium, v.first_touch_referrer).channel,
      };
    }),
    utmPerformance,
    channelStats,
    geoStats: {
      countries: countriesList,
      states: statesList,
      cities: citiesList.slice(0, 20),
    },
    heatmapByPath,
    vturbStats: {
      totalPlays: vturbPlays,
      totalUnlocks: vturbUnlocks,
      playRate: vturbPlayRate,
      pitchUnlockRate: vturbPitchUnlockRate,
      milestones: vturbMilestones,
    },
  };
}
