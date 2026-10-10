import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const redirectUri = url.searchParams.get("redirect_uri") || "https://claude.ai/api/connectors/oauth/callback";
  const state = url.searchParams.get("state") || "";
  const codeChallenge = url.searchParams.get("code_challenge") || "";

  const code = `code_${crypto.randomBytes(16).toString("hex")}`;

  const targetUrl = new URL(redirectUri);
  targetUrl.searchParams.set("code", code);
  if (state) targetUrl.searchParams.set("state", state);

  // Return HTML that automatically redirects and provides a button
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Authorizing Claude • Rarity Analytics</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #09090b; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
    <div class="flex items-center justify-center gap-3">
      <div class="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xl">
        C
      </div>
      <span class="text-zinc-600 text-xl font-mono">⇄</span>
      <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl">
        R
      </div>
    </div>

    <div>
      <h1 class="text-lg font-bold text-zinc-100 font-mono tracking-tight">
        Authorize Rarity Analytics
      </h1>
      <p class="text-xs text-zinc-400 mt-1">
        Connecting real-time landing page telemetry to your Claude session...
      </p>
    </div>

    <div class="bg-zinc-950 border border-zinc-850 rounded-xl p-3 text-left text-xs space-y-1 text-zinc-300">
      <div class="text-[11px] font-mono text-emerald-400 font-semibold uppercase">✓ Permissions Granted:</div>
      <div>• Read aggregate visitor telemetry & KPIs</div>
      <div>• Read UTM attribution & US States breakdown</div>
      <div>• Read lead journeys & VTurb video retention</div>
    </div>

    <div class="space-y-2">
      <a
        id="authBtn"
        href="${targetUrl.toString()}"
        class="block w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs font-mono rounded-xl transition-all shadow-lg text-center"
      >
        Click to Complete Authorization →
      </a>
      <p class="text-[11px] text-zinc-500">Redirecting automatically in 1 second...</p>
    </div>
  </div>

  <script>
    setTimeout(function() {
      window.location.href = "${targetUrl.toString()}";
    }, 800);
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
