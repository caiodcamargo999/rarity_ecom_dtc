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
