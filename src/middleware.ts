import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  // 1. Skip Next.js internals, static assets, APIs, and image files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/videos") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|xml|m3u8|ts|mp4|html)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Query param based A/B testing (?variant=b or ?v=3 or ?headline=growth-team)
  const variantParam = (
    url.searchParams.get("variant") ||
    url.searchParams.get("v") ||
    url.searchParams.get("ab") ||
    url.searchParams.get("headline") ||
    ""
  ).toLowerCase();

  if (variantParam === "b" || variantParam === "3" || variantParam === "growth-team" || variantParam === "team") {
    if (pathname === "/" || pathname === "") {
      url.pathname = "/growth-team";
      return NextResponse.rewrite(url);
    }
    if (pathname === "/2" || pathname === "/lp2" || pathname === "/v2" || pathname === "/rarityaudit" || pathname === "/tsl") {
      url.pathname = "/growth-team-tsl";
      return NextResponse.rewrite(url);
    }
  }

  // 3. Subdomain extraction
  // Handles:
  // - ecom.rarityagency.io -> apex domain for this landing page
  // - 2.ecom.rarityagency.io or 2.rarityagency.io -> subdomain "2"
  // - 3.ecom.rarityagency.io or 3.rarityagency.io -> subdomain "3"
  // - 4.ecom.rarityagency.io or 4.rarityagency.io -> subdomain "4"
  // - growth.ecom.rarityagency.io or growth.rarityagency.io -> subdomain "growth"
  // - team.ecom.rarityagency.io or team.rarityagency.io -> subdomain "team"
  const hostWithoutPort = hostname.split(":")[0].toLowerCase();
  
  let subdomain = "";
  const isLocalhost = hostWithoutPort.endsWith("localhost") || hostWithoutPort === "127.0.0.1";

  if (isLocalhost) {
    const parts = hostWithoutPort.split(".");
    if (parts.length > 1 && parts[0] !== "www") {
      subdomain = parts[0];
    }
  } else if (hostWithoutPort.endsWith("rarityagency.io")) {
    const prefix = hostWithoutPort.replace(".rarityagency.io", "");
    if (prefix && prefix !== "www" && prefix !== "ecom" && prefix !== "rarityagency.io") {
      // Handles 2.ecom, 3.ecom, growth.ecom, etc.
      subdomain = prefix.replace(".ecom", "");
    }
  } else if (hostWithoutPort.endsWith("rarityagency.com")) {
    const prefix = hostWithoutPort.replace(".rarityagency.com", "");
    if (prefix && prefix !== "www" && prefix !== "ecom" && prefix !== "rarityagency.com") {
      subdomain = prefix.replace(".ecom", "");
    }
  } else if (hostWithoutPort.includes(".")) {
    const parts = hostWithoutPort.split(".");
    if (parts.length >= 3 && parts[0] !== "www" && parts[0] !== "ecom") {
      subdomain = parts[0];
    }
  }

  // 4. Subdomain routing logic
  if (subdomain && subdomain !== "www" && subdomain !== "ecom") {
    // Subdomain "2" -> serves original TSL (Get Off The Ad Performance Rollercoaster)
    if (subdomain === "2" || subdomain === "tsl") {
      if (pathname === "/" || pathname === "") {
        url.pathname = "/lp2";
        return NextResponse.rewrite(url);
      }
    }

    // Subdomain "3" or "growth" or "team" or "offer" or "b" -> serves VSL Variant B ("A Full Growth Team For Less Than One Media Buyer")
    if (
      subdomain === "3" ||
      subdomain === "growth" ||
      subdomain === "team" ||
      subdomain === "offer" ||
      subdomain === "b" ||
      subdomain === "vsl2"
    ) {
      if (pathname === "/" || pathname === "") {
        url.pathname = "/growth-team";
        return NextResponse.rewrite(url);
      }
      if (
        pathname === "/tsl" ||
        pathname === "/lp2" ||
        pathname === "/v2" ||
        pathname === "/2" ||
        pathname === "/4"
      ) {
        url.pathname = "/growth-team-tsl";
        return NextResponse.rewrite(url);
      }
    }

    // Subdomain "4" -> serves TSL Variant B ("A Full Growth Team For Less Than One Media Buyer")
    if (subdomain === "4" || subdomain === "tsl2") {
      if (pathname === "/" || pathname === "") {
        url.pathname = "/growth-team-tsl";
        return NextResponse.rewrite(url);
      }
    }

    // General fallback for other custom subdomains
    if (pathname === "/" || pathname === "") {
      url.pathname = "/growth-team";
      return NextResponse.rewrite(url);
    }
    if (
      pathname === "/tsl" ||
      pathname === "/lp2" ||
      pathname === "/v2" ||
      pathname === "/text" ||
      pathname === "/audit" ||
      pathname === "/rarityaudit" ||
      pathname === "/rarity-landing-page-02"
    ) {
      url.pathname = "/growth-team-tsl";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except internal static assets
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
