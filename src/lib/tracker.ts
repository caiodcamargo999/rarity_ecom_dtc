"use client";

export const VISITOR_ID_KEY = "rarity_vid";
export const SESSION_ID_KEY = "rarity_sid";
export const SESSION_TIME_KEY = "rarity_sid_time";
export const UTM_STORAGE_KEY = "rarity_utms";
export const GEO_STORAGE_KEY = "rarity_geo";

export interface ChannelAttribution {
  channel: string;
  source: string;
  medium: string;
  campaign: string;
}

export interface VisitorInfo {
  visitorId: string;
  sessionId: string;
  device: string;
  os: string;
  browser: string;
  screenResolution: string;
  referrer: string;
  utms: Record<string, string>;
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  channelInfo: ChannelAttribution;
}

export interface LeadIdentificationPayload {
  email?: string;
  phone?: string;
  fullName?: string;
  brandOrStore?: string;
  monthlyRevenue?: string;
  monthlyAdSpend?: string;
  bottleneck?: string;
  role?: string;
  scheduledOnCal?: string;
  meetingDate?: string;
  customData?: Record<string, any>;
}

// Ignore internal admin & dev paths
export function isIgnoredPath(pathname?: string): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.includes("/_next") ||
    pathname.includes("favicon")
  );
}

// Generate unique ID
function generateId(prefix: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${ts}_${rand}`;
}

// Cookie helper
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, val: string, days = 365) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(val)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

// Device & OS detection
function getDeviceAndOS() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { device: "desktop", os: "unknown", browser: "unknown" };
  }

  const ua = navigator.userAgent;
  let device = "desktop";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = "mobile";
  } else if (/ipad|tablet/i.test(ua)) {
    device = "tablet";
  }

  let os = "other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "other";
  if (/chrome|crios/i.test(ua) && !/edge|opr\//i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/opr\//i.test(ua)) browser = "Opera";

  return { device, os, browser };
}

// Geolocation state & async cache
let cachedGeo: { country?: string; countryCode?: string; region?: string; city?: string } | null = null;

function getCachedGeo() {
  if (cachedGeo) return cachedGeo;
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(GEO_STORAGE_KEY) || localStorage.getItem(GEO_STORAGE_KEY);
      if (stored) {
        cachedGeo = JSON.parse(stored);
        return cachedGeo!;
      }
    } catch (e) {}
  }
  return {};
}

async function resolveGeoAsync() {
  if (typeof window === "undefined") return;
  if (cachedGeo && cachedGeo.country) return;

  try {
    const res = await fetch("https://get.geojs.io/v1/ip/geo.json", { cache: "force-cache" });
    if (res.ok) {
      const data = await res.json();
      cachedGeo = {
        country: data.country || "United States",
        countryCode: data.country_code || "US",
        region: data.region || "",
        city: data.city || "",
      };
      try {
        sessionStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(cachedGeo));
        localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(cachedGeo));
      } catch (e) {}
    }
  } catch (err) {}
}

// Channel Detection Algorithm
export function detectTrafficChannel(referrer = "", utms: Record<string, string> = {}): ChannelAttribution {
  const ref = (referrer || "").toLowerCase();
  const utmSource = (utms.utm_source || "").toLowerCase();
  const utmMedium = (utms.utm_medium || "").toLowerCase();
  const utmCampaign = utms.utm_campaign || "none";
  // Only a real click id counts as an ad click. _fbp is the Meta Pixel's
  // browser cookie and exists for EVERY visitor on a pixel-enabled site, so it
  // must never be used to attribute traffic to Meta Ads.
  const hasFbclid = Boolean(utms.fbclid);
  const hasGclid = Boolean(utms.gclid);
  const hasTtclid = Boolean(utms.ttclid);

  // 1. ChatGPT & AI Search (OpenAI, Claude, Perplexity, Gemini, Copilot)
  if (
    ref.includes("chatgpt.com") ||
    ref.includes("chat.openai.com") ||
    ref.includes("openai.com") ||
    ref.includes("claude.ai") ||
    ref.includes("perplexity.ai") ||
    ref.includes("gemini.google.com") ||
    ref.includes("bard.google.com") ||
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

    return {
      channel: "ChatGPT / AI Search",
      source,
      medium: "ai_search",
      campaign: utmCampaign,
    };
  }

  // 2. Meta Ads (Facebook & Instagram Paid Ads)
  if (
    hasFbclid ||
    ((utmSource.includes("meta") || utmSource.includes("facebook") || utmSource.includes("instagram") || utmSource.includes("fb") || utmSource.includes("ig")) &&
      (utmMedium.includes("cpc") || utmMedium.includes("paid") || utmMedium.includes("ad") || utmMedium.includes("feed") || utmMedium.includes("story") || utmMedium.includes("reels")))
  ) {
    return {
      channel: "Meta Ads",
      source: utmSource || (ref.includes("instagram") ? "Instagram Ads" : "Facebook Ads"),
      medium: utmMedium || "paid_social",
      campaign: utmCampaign,
    };
  }

  // 3. Google Ads (Search, PMax, Display)
  if (
    hasGclid ||
    ((utmSource.includes("google") || utmSource.includes("adwords") || utmSource.includes("pmax")) &&
      (utmMedium.includes("cpc") || utmMedium.includes("ppc") || utmMedium.includes("ad") || utmMedium.includes("search") || utmMedium.includes("display")))
  ) {
    return {
      channel: "Google Ads",
      source: "Google Ads",
      medium: utmMedium || "cpc",
      campaign: utmCampaign,
    };
  }

  // 4. Instagram Organic
  if (
    ref.includes("instagram.com") ||
    ref.includes("l.instagram.com") ||
    utmSource === "instagram" ||
    utmSource === "ig"
  ) {
    return {
      channel: "Instagram Organic",
      source: "Instagram",
      medium: utmMedium || "social_organic",
      campaign: utmCampaign,
    };
  }

  // 5. TikTok (Ads or Organic)
  if (hasTtclid || ref.includes("tiktok.com") || utmSource.includes("tiktok")) {
    const isPaid = hasTtclid || utmMedium.includes("cpc") || utmMedium.includes("paid");
    return {
      channel: isPaid ? "TikTok Ads" : "TikTok Organic",
      source: "TikTok",
      medium: isPaid ? "paid_social" : "social_organic",
      campaign: utmCampaign,
    };
  }

  // 6. YouTube (Organic or Ads)
  if (ref.includes("youtube.com") || ref.includes("youtu.be") || utmSource.includes("youtube")) {
    const isPaid = utmMedium.includes("cpc") || utmMedium.includes("paid") || utmMedium.includes("video_ad");
    return {
      channel: isPaid ? "YouTube Ads" : "YouTube Organic",
      source: "YouTube",
      medium: isPaid ? "video_ad" : "social_organic",
      campaign: utmCampaign,
    };
  }

  // 7. LinkedIn (Organic or Ads)
  if (ref.includes("linkedin.com") || ref.includes("lnkd.in") || utmSource.includes("linkedin")) {
    const isPaid = utmMedium.includes("cpc") || utmMedium.includes("paid");
    return {
      channel: isPaid ? "LinkedIn Ads" : "LinkedIn Organic",
      source: "LinkedIn",
      medium: isPaid ? "paid_social" : "social_organic",
      campaign: utmCampaign,
    };
  }

  // 8. Twitter / X
  if (ref.includes("t.co") || ref.includes("twitter.com") || ref.includes("x.com") || utmSource.includes("twitter")) {
    return {
      channel: "X / Twitter",
      source: "X (Twitter)",
      medium: utmMedium || "social_organic",
      campaign: utmCampaign,
    };
  }

  // 9. Google Organic Search
  if (ref.includes("google.") || ref.includes("google.com")) {
    return {
      channel: "Google Organic",
      source: "Google Search",
      medium: "organic_search",
      campaign: "seo",
    };
  }

  // 10. Email Marketing
  if (utmMedium.includes("email") || utmMedium.includes("newsletter") || utmSource.includes("klaviyo") || utmSource.includes("mailchimp")) {
    return {
      channel: "Email Marketing",
      source: utmSource || "Newsletter",
      medium: "email",
      campaign: utmCampaign,
    };
  }

  // 11. Direct
  if (!ref || ref === "direct" || (typeof window !== "undefined" && ref.includes(window.location.hostname))) {
    return {
      channel: utmSource ? `Campaign (${utmSource})` : "Direct / Bookmarks",
      source: utmSource || "Direct",
      medium: utmMedium || "none",
      campaign: utmCampaign,
    };
  }

  // Fallback referral
  try {
    const urlObj = new URL(ref);
    return {
      channel: `Referral (${urlObj.hostname})`,
      source: urlObj.hostname,
      medium: "referral",
      campaign: utmCampaign,
    };
  } catch (e) {
    return {
      channel: utmSource || "Direct / Unknown",
      source: utmSource || "Direct",
      medium: utmMedium || "none",
      campaign: utmCampaign,
    };
  }
}

// Get or initialize persistent visitor ID
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "server";

  let vid = localStorage.getItem(VISITOR_ID_KEY) || getCookie(VISITOR_ID_KEY);
  if (!vid) {
    vid = generateId("vid");
    try {
      localStorage.setItem(VISITOR_ID_KEY, vid);
      setCookie(VISITOR_ID_KEY, vid, 730); // 2 years
    } catch (e) {}
  }
  return vid;
}

// Get or initialize session ID (30 min timeout)
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server";

  const now = Date.now();
  const lastTime = parseInt(sessionStorage.getItem(SESSION_TIME_KEY) || "0", 10);
  let sid = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sid || (lastTime && now - lastTime > 30 * 60 * 1000)) {
    sid = generateId("sid");
    try {
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    } catch (e) {}
  }

  try {
    sessionStorage.setItem(SESSION_TIME_KEY, now.toString());
  } catch (e) {}

  return sid;
}

// Extract UTMs & Click IDs from URL & storage
export function captureAndGetUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
    "ttclid",
    "fbc",
    "fbp",
  ];

  let stored: Record<string, string> = {};
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY) || sessionStorage.getItem(UTM_STORAGE_KEY);
    if (raw) stored = JSON.parse(raw);
  } catch (e) {}

  let updated = false;
  for (const k of utmKeys) {
    const val = params.get(k);
    if (val) {
      stored[k] = val;
      updated = true;
    }
  }

  const fbc = getCookie("_fbc");
  if (fbc && !stored.fbc) {
    stored.fbc = fbc;
    updated = true;
  }
  const fbp = getCookie("_fbp");
  if (fbp && !stored.fbp) {
    stored.fbp = fbp;
    updated = true;
  }

  if (updated) {
    try {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(stored));
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(stored));
    } catch (e) {}
  }

  return stored;
}

// Get comprehensive visitor metadata
export function getVisitorInfo(): VisitorInfo {
  const { device, os, browser } = getDeviceAndOS();
  const screenResolution =
    typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "unknown";
  const referrer = typeof document !== "undefined" ? document.referrer || "direct" : "direct";
  const geo = getCachedGeo();
  const utms = captureAndGetUtms();
  const channelInfo = detectTrafficChannel(referrer, utms);

  return {
    visitorId: getOrCreateVisitorId(),
    sessionId: getOrCreateSessionId(),
    device,
    os,
    browser,
    screenResolution,
    referrer,
    utms,
    country: geo.country,
    countryCode: geo.countryCode,
    region: geo.region,
    city: geo.city,
    channelInfo,
  };
}

// Send telemetry payload safely
async function sendPayload(endpoint: string, payload: any) {
  if (typeof window === "undefined") return;

  const url = `/api/track/${endpoint}`;
  const data = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([data], { type: "application/json" });
    const success = navigator.sendBeacon(url, blob);
    if (success) return;
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
      keepalive: true,
    });
  } catch (err) {}
}

// Master Tracker Class
export class RarityTracker {
  private pageStartTime: number = Date.now();
  private maxScrollDepth: number = 0;
  private scrollMilestonesReported: Set<number> = new Set();
  private currentPathname: string = "";
  private heartbeatTimer: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init() {
    this.currentPathname = window.location.pathname;
    this.pageStartTime = Date.now();

    resolveGeoAsync();

    document.addEventListener("click", this.handleClick.bind(this), { capture: true });
    window.addEventListener("scroll", this.handleScroll.bind(this), { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flushCurrentPageMetrics();
      }
    });
    window.addEventListener("pagehide", () => this.flushCurrentPageMetrics());
    window.addEventListener("beforeunload", () => this.flushCurrentPageMetrics());

    this.startHeartbeat();
    window.addEventListener("message", this.handleVideoMessage.bind(this));
  }

  public trackPageView(pathname: string, title?: string) {
    if (typeof window === "undefined") return;
    if (isIgnoredPath(pathname)) return;

    if (this.currentPathname && this.currentPathname !== pathname && !isIgnoredPath(this.currentPathname)) {
      this.flushCurrentPageMetrics();
    }

    this.currentPathname = pathname;
    this.pageStartTime = Date.now();
    this.maxScrollDepth = 0;
    this.scrollMilestonesReported.clear();

    const info = getVisitorInfo();
    const searchParams = window.location.search;

    sendPayload("event", {
      type: "pageview",
      pathname,
      title: title || document.title,
      searchParams,
      visitorId: info.visitorId,
      sessionId: info.sessionId,
      device: info.device,
      os: info.os,
      browser: info.browser,
      screenResolution: info.screenResolution,
      referrer: info.referrer,
      utms: info.utms,
      country: info.country,
      countryCode: info.countryCode,
      region: info.region,
      city: info.city,
      channel: info.channelInfo.channel,
      source: info.channelInfo.source,
      medium: info.channelInfo.medium,
      campaign: info.channelInfo.campaign,
      timestamp: new Date().toISOString(),
    });
  }

  public trackEvent(eventType: string, eventName: string, eventData: Record<string, any> = {}) {
    const currentPath = this.currentPathname || (typeof window !== "undefined" ? window.location.pathname : "/");
    if (isIgnoredPath(currentPath)) return;

    const info = getVisitorInfo();
    sendPayload("event", {
      type: "custom_event",
      eventType,
      eventName,
      pathname: currentPath,
      visitorId: info.visitorId,
      sessionId: info.sessionId,
      country: info.country,
      countryCode: info.countryCode,
      region: info.region,
      city: info.city,
      channel: info.channelInfo.channel,
      source: info.channelInfo.source,
      eventData,
      timestamp: new Date().toISOString(),
    });
  }

  public identifyLead(lead: LeadIdentificationPayload) {
    const currentPath = this.currentPathname || (typeof window !== "undefined" ? window.location.pathname : "/");
    if (isIgnoredPath(currentPath)) return;

    const info = getVisitorInfo();
    sendPayload("identify", {
      visitorId: info.visitorId,
      sessionId: info.sessionId,
      pathname: currentPath,
      country: info.country,
      countryCode: info.countryCode,
      region: info.region,
      city: info.city,
      channel: info.channelInfo.channel,
      source: info.channelInfo.source,
      medium: info.channelInfo.medium,
      campaign: info.channelInfo.campaign,
      ...lead,
      utms: info.utms,
    });
  }

  private handleClick(e: MouseEvent) {
    try {
      const currentPath = this.currentPathname || window.location.pathname;
      if (isIgnoredPath(currentPath)) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest("button, a, [data-track], [data-cta], input[type='submit'], [role='button']");
      
      const docWidth = document.documentElement.scrollWidth || window.innerWidth || 1;
      const docHeight = document.documentElement.scrollHeight || window.innerHeight || 1;
      const xPct = Math.min(100, Math.max(0, Math.round((e.pageX / docWidth) * 1000) / 10));
      const yPct = Math.min(100, Math.max(0, Math.round((e.pageY / docHeight) * 1000) / 10));

      const sectionEl = target.closest("section, header, footer, [id], [data-section]");
      const sectionName =
        sectionEl?.getAttribute("data-section") ||
        sectionEl?.getAttribute("id") ||
        sectionEl?.tagName.toLowerCase() ||
        "general";

      if (clickable) {
        const tag = clickable.tagName.toLowerCase();
        const ctaLabel =
          clickable.getAttribute("data-track") ||
          clickable.getAttribute("data-cta") ||
          clickable.getAttribute("aria-label") ||
          (clickable as HTMLElement).innerText?.trim().substring(0, 80) ||
          clickable.textContent?.trim().substring(0, 80) ||
          clickable.getAttribute("title") ||
          tag;

        const href = clickable.getAttribute("href") || "";
        const isBooking = href.includes("cal.com") || ctaLabel.toLowerCase().includes("audit") || ctaLabel.toLowerCase().includes("book");

        this.trackEvent("cta_click", ctaLabel, {
          tag,
          href,
          isBooking,
          xPct,
          yPct,
          section: sectionName,
          classes: clickable.className?.toString().substring(0, 100),
        });
      } else {
        this.trackEvent("warm_click", `Click in ${sectionName}`, {
          xPct,
          yPct,
          section: sectionName,
          targetTag: target.tagName.toLowerCase(),
        });
      }
    } catch (err) {}
  }

  private handleScroll() {
    try {
      const currentPath = this.currentPathname || window.location.pathname;
      if (isIgnoredPath(currentPath)) return;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));

      if (scrollPercent > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercent;
      }

      const milestones = [25, 50, 75, 90, 100];
      for (const m of milestones) {
        if (scrollPercent >= m && !this.scrollMilestonesReported.has(m)) {
          this.scrollMilestonesReported.add(m);
          this.trackEvent("scroll_milestone", `Scroll ${m}%`, { depth: m });
        }
      }
    } catch (err) {}
  }

  private handleVideoMessage(event: MessageEvent) {
    try {
      if (!event.data) return;
      const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

      if (data.type?.includes("smartplayer") || data.event?.includes("vturb") || data.event === "play" || data.event === "timeupdate") {
        if (data.event === "play" || data.status === "play") {
          this.trackEvent("vturb_play", "VTurb Video Started", { time: data.currentTime || 0 });
        }
      }
    } catch (e) {}
  }

  private startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      const currentPath = this.currentPathname || window.location.pathname;
      if (isIgnoredPath(currentPath)) return;

      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        const dwellSeconds = Math.round((Date.now() - this.pageStartTime) / 1000);
        const info = getVisitorInfo();
        sendPayload("event", {
          type: "heartbeat",
          pathname: currentPath,
          visitorId: info.visitorId,
          sessionId: info.sessionId,
          durationSeconds: dwellSeconds,
          maxScrollDepth: this.maxScrollDepth,
          country: info.country,
          region: info.region,
          city: info.city,
        });
      }
    }, 15000);
  }

  public flushCurrentPageMetrics() {
    const currentPath = this.currentPathname || window.location.pathname;
    if (isIgnoredPath(currentPath)) return;

    const dwellSeconds = Math.max(1, Math.round((Date.now() - this.pageStartTime) / 1000));
    const info = getVisitorInfo();

    sendPayload("event", {
      type: "page_exit",
      pathname: currentPath,
      visitorId: info.visitorId,
      sessionId: info.sessionId,
      durationSeconds: dwellSeconds,
      maxScrollDepth: this.maxScrollDepth,
      country: info.country,
      region: info.region,
      city: info.city,
    });
  }
}

let globalTracker: RarityTracker | null = null;

export function getTracker(): RarityTracker {
  if (typeof window === "undefined") {
    return new RarityTracker();
  }
  if (!globalTracker) {
    globalTracker = new RarityTracker();
    (window as any).rarityTracker = globalTracker;
  }
  return globalTracker;
}
