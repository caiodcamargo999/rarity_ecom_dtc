// Shared rules for deciding whether Meta (Facebook / Instagram) traffic is a paid ad click.
// fbclid alone is NOT proof of an ad: Facebook and Instagram append it to every outbound
// link click (organic posts, bio links, stories, DMs, shares).

const PAID_MEDIUM = /(^|[^a-z])(cpc|ppc|paid|ads?|feed|stories|story|reels|display)([^a-z]|$)/;

export function isPaidMetaMedium(medium?: string): boolean {
  return PAID_MEDIUM.test((medium || "").toLowerCase());
}

export function isMetaSource(source?: string): boolean {
  const s = (source || "").toLowerCase();
  return s.includes("meta") || s.includes("facebook") || s === "fb" || s === "ig" || s.startsWith("fb_") || s.startsWith("ig_") || s.includes("instagram");
}

// Meta link-preview / crawler user agents; these fetch URLs that carry fbclid but are not visitors.
export const META_BOT_UA = /facebookexternalhit|facebot|meta-externalagent|meta-externalfetcher|facebookcatalog/i;

// ---------------------------------------------------------------------------
// Bot network detection.
// Meta's ad review, link preview and quality bots load the page in a real headless
// Chrome (so the user-agent looks human) from Meta's own data centres
// (Clonee, Prineville, Lulea, Forest City, Altoona...). They are not people.
// A few scanners also come from raw AWS ranges. Both are excluded from analytics.
// ---------------------------------------------------------------------------
const BOT_V4_CIDRS = [
  // Meta / Facebook (AS32934)
  "31.13.24.0/21", "31.13.64.0/18", "45.64.40.0/22", "66.220.144.0/20", "69.63.176.0/20",
  "69.171.224.0/19", "102.132.96.0/20", "129.134.0.0/16", "147.75.208.0/20", "157.240.0.0/16",
  "173.252.64.0/18", "179.60.192.0/22", "185.89.218.0/23", "199.201.64.0/22", "204.15.20.0/22",
  // AWS us-west-1 ranges seen scanning the landing page
  "54.183.0.0/16", "13.57.0.0/16",
].map((c) => {
  const [ip, bits] = c.split("/");
  const n = ip.split(".").reduce((a, o) => a * 256 + Number(o), 0);
  const mask = bits === "0" ? 0 : (0xffffffff << (32 - Number(bits))) >>> 0;
  return { net: (n & mask) >>> 0, mask };
});

export function isBotIp(ip?: string | null): boolean {
  if (!ip) return false;
  const v = ip.trim().toLowerCase();
  if (v.includes(":")) return v.startsWith("2a03:2880:") || v.startsWith("2a03:83e0:");
  const parts = v.split(".");
  if (parts.length !== 4 || parts.some((p) => p === "" || isNaN(Number(p)))) return false;
  const n = parts.reduce((a, o) => a * 256 + Number(o), 0) >>> 0;
  return BOT_V4_CIDRS.some((c) => ((n & c.mask) >>> 0) === c.net);
}
