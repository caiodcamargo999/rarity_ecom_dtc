import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  // 1. Zero-Trust Admin Route Protection at the Edge
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const authCookie =
      request.cookies.get("rarity_analytics_auth")?.value ||
      request.cookies.get("rarity_matrix_auth")?.value;
    const hasAuth = Boolean(authCookie && authCookie.length >= 32);

    // If attempting to access protected admin views without valid session, redirect immediately to login
    if (!isLoginPage && !hasAuth) {
      const loginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("redirect", pathname);
      }
      const res = NextResponse.redirect(loginUrl);
      res.headers.set("X-Frame-Options", "DENY");
      res.headers.set("X-Content-Type-Options", "nosniff");
      res.headers.set("Cache-Control", "no-store, private");
      return res;
    }

    // If already logged in and visiting /admin/login, redirect to /admin/analytics
    if (isLoginPage && hasAuth) {
      const analyticsUrl = new URL("/admin/analytics", request.url);
      return NextResponse.redirect(analyticsUrl);
    }

    const res = NextResponse.next();
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set("Cache-Control", "no-store, private");
    return res;
  }

  // 2. Skip Next.js internals, static assets, APIs, and image files
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

  // 3. Query param based A/B testing (?variant=b or ?v=3 or ?headline=growth-team)
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

  // 4. Subdomain extraction
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

  // 5. Subdomain routing logic
  if (subdomain && subdomain !== "www" && subdomain !== "ecom") {
    if (subdomain === "2" || subdomain === "tsl") {
      if (pathname === "/" || pathname === "") {
        url.pathname = "/lp2";
        return NextResponse.rewrite(url);
      }
    }

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

    if (subdomain === "4" || subdomain === "tsl2") {
      if (pathname === "/" || pathname === "") {
        url.pathname = "/growth-team-tsl";
        return NextResponse.rewrite(url);
      }
    }

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

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
