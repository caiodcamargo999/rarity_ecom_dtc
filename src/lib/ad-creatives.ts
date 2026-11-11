// Creative thumbnails for the analytics dashboard, matched by ad name (utm_content).
// Files live in /public/ad-creatives. Meta image URLs are signed and expire, so we keep copies.
// To add a new ad: drop its image in public/ad-creatives and add one line below,
// keyed by the Meta ad name (case and punctuation are ignored: "AD01 Static" = "ad01+static").

const CREATIVES: Record<string, string> = {
  "AD01 Static": "/ad-creatives/ad01-static.jpg",
  "AD02 Static": "/ad-creatives/ad02-static.jpg",
  "AD03 Static": "/ad-creatives/ad03-static.jpg",
  "AD04 Static": "/ad-creatives/ad04-static.jpg",
  "AD05 Static": "/ad-creatives/ad05-static.jpg",
  // Portuguese (BRL account) ads
  "ad01 Diego Video": "/ad-creatives/ad01-diego-video.jpg",
  "ad02 Static A | Como a Rarity escala": "/ad-creatives/ad02-static-a-como-a-rarity-escala.jpg",
  "ad03 Static B | Escalamos no lucro": "/ad-creatives/ad03-static-b-escalamos-no-lucro.jpg",
  "ad04 Static C | 3 vagas CAC -20%": "/ad-creatives/ad04-static-c-3-vagas-cac.jpg",
  "ad05 Static D | Buscamos 3 donos": "/ad-creatives/ad05-static-d-buscamos-3-donos.jpg",
  // Older Portuguese statics reuse the same artwork as the English ones
  "AD01 Estático": "/ad-creatives/ad01-static.jpg",
  "AD02 Estático": "/ad-creatives/ad02-static.jpg",
  "AD03 Estático": "/ad-creatives/ad03-static.jpg",
  "AD04 Estático": "/ad-creatives/ad04-static.jpg",
  "AD05 Estático": "/ad-creatives/ad05-static.jpg",
  "Caio Ads 1": "/ad-creatives/caio-ads-1.jpg",
  "Caio Ads 2": "/ad-creatives/caio-ads-2.jpg",
  "Caio Ads 3": "/ad-creatives/caio-ads-3.jpg",
};

const key = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

const INDEX = new Map(Object.entries(CREATIVES).map(([name, url]) => [key(name), url]));

export function getAdCreative(adName: string): string | null {
  return INDEX.get(key(adName)) ?? null;
}
