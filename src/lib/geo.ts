// Geo helpers shared by the tracker ingestion route and the analytics reader.

/**
 * Vercel sends x-vercel-ip-city URL-encoded (e.g. "Moses%20Lake").
 * Decode it so the dashboard shows "Moses Lake" instead of "Moses%20Lake".
 */
export function safeDecode(value?: string | null): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value).replace(/\+/g, " ").trim();
  } catch {
    return String(value).trim();
  }
}

let regionNames: Intl.DisplayNames | null | undefined;
let nameToCode: Record<string, string> | null = null;

function getRegionNames(): Intl.DisplayNames | null {
  if (regionNames !== undefined) return regionNames;
  try {
    regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    regionNames = null;
  }
  return regionNames;
}

function getNameToCode(): Record<string, string> {
  if (nameToCode) return nameToCode;
  nameToCode = {};
  const names = getRegionNames();
  if (names) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const a of letters) {
      for (const b of letters) {
        const code = a + b;
        try {
          const name = names.of(code);
          if (name && name !== code) nameToCode[name.toLowerCase()] = code;
        } catch {}
      }
    }
  }
  nameToCode["usa"] = "US";
  nameToCode["united states of america"] = "US";
  return nameToCode;
}

/**
 * Accepts either an ISO code ("US", "BR") or a full name ("United States")
 * and always returns both, so "CA" can never be confused between Canada and
 * California, and "Brazil" and "BR" land in the same bucket.
 */
export function resolveCountry(raw?: string | null): { name: string; code: string } {
  const value = (raw || "").trim();
  if (!value) return { name: "United States", code: "US" };

  if (/^[A-Za-z]{2}$/.test(value)) {
    const code = value.toUpperCase();
    let name = code;
    try {
      name = getRegionNames()?.of(code) || code;
    } catch {}
    return { name, code };
  }

  const code = getNameToCode()[value.toLowerCase()];
  return { name: value, code: code || value.substring(0, 2).toUpperCase() };
}
