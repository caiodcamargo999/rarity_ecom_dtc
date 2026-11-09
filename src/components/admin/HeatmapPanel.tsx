"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Flame, MousePointer, TrendingUp, ExternalLink, Smartphone, Monitor, MapPin } from "lucide-react";

export interface HeatClick {
  xPct: number;
  yPct: number;
  label: string;
  count: number;
  isBooking: boolean;
  section: string;
  device?: "mobile" | "desktop";
}

export interface HeatData {
  clicks: HeatClick[];
  hotspots: unknown[];
  scrollStats: { m25: number; m50: number; m75: number; m90: number; m100: number; totalViews: number };
}

const PAGES = [
  { path: "/growth-team", label: "Angle B: VSL (/growth-team)" },
  { path: "/growth-team-tsl", label: "Angle B: TSL (/growth-team-tsl)" },
  { path: "/", label: "Angle A: VSL (/)" },
  { path: "/lp2", label: "Angle A: TSL (/lp2)" },
  { path: "/free-audit", label: "Angle A: Clean Audit (/free-audit)" },
  { path: "/free-audit2", label: "Angle B: Clean Audit (/free-audit2)" },
  { path: "/onboarding", label: "Client Onboarding (/onboarding)" },
];


// Raw tracker labels are developer-ish ("Click in vid-6af11075..."). Show something a human reads.
function prettySection(s: string): string {
  const v = (s || "").toLowerCase();
  if (v.startsWith("vid-") || v.includes("vturb") || v.includes("player")) return "VSL video";
  if (v === "section" || v === "div" || v === "main") return "Page body";
  if (v === "header" || v === "nav") return "Header";
  if (v === "footer") return "Footer";
  if (v === "general" || v === "") return "Page background";
  return s.replace(/[-_]+/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function prettyLabel(label: string): string {
  const m = /^Click in (.+)$/.exec(label || "");
  if (!m) return label;
  const sec = prettySection(m[1]);
  if (sec === "VSL video") return "VSL video player";
  if (sec === "Page background" || sec === "Page body") return "Empty area (not a button)";
  return `${sec} area`;
}

const EMPTY: HeatData = { clicks: [], hotspots: [], scrollStats: { m25: 0, m50: 0, m75: 0, m90: 0, m100: 0, totalViews: 0 } };

// cold (blue) to hot (red)
const STOPS: [number, [number, number, number]][] = [
  [0, [40, 80, 255]],
  [0.3, [0, 200, 255]],
  [0.5, [40, 230, 110]],
  [0.72, [255, 225, 0]],
  [0.88, [255, 130, 0]],
  [1, [255, 30, 0]],
];

function colorAt(t: number): [number, number, number] {
  const v = Math.max(0, Math.min(1, t));
  for (let i = 1; i < STOPS.length; i++) {
    if (v <= STOPS[i][0]) {
      const [t0, c0] = STOPS[i - 1];
      const [t1, c1] = STOPS[i];
      const k = (v - t0) / (t1 - t0 || 1);
      return [c0[0] + (c1[0] - c0[0]) * k, c0[1] + (c1[1] - c0[1]) * k, c0[2] + (c1[2] - c0[2]) * k];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

const PALETTE = (() => {
  const p = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const [r, g, b] = colorAt(i / 255);
    p[i * 3] = r; p[i * 3 + 1] = g; p[i * 3 + 2] = b;
  }
  return p;
})();

const LEGEND = `linear-gradient(90deg, ${STOPS.map(([t, c]) => `rgb(${c.join(",")}) ${t * 100}%`).join(", ")})`;

export default function HeatmapPanel({
  data,
  page,
  onPageChange,
}: {
  data: Record<string, HeatData>;
  page: string;
  onPageChange: (p: string) => void;
}) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [mode, setMode] = useState<"heat" | "scroll">("heat");
  const [pins, setPins] = useState(true);
  const [boxW, setBoxW] = useState(800);
  const [docH, setDocH] = useState(3000);
  const [scrollTop, setScrollTop] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);

  const hm = data[page] || EMPTY;
  const clicks = useMemo(
    () => hm.clicks.filter((c) => (c.device || "desktop") === device),
    [hm.clicks, device]
  );
  const totalClicks = clicks.reduce((n, c) => n + c.count, 0);
  const bookingClicks = clicks.filter((c) => c.isBooking).reduce((n, c) => n + c.count, 0);
  const maxCount = Math.max(1, ...clicks.map((c) => c.count));
  const ranked = useMemo(() => {
    // one row per element (human name)
    const m = new Map<string, { name: string; section: string; isBooking: boolean; total: number; ySum: number; xSum: number }>();
    for (const c of clicks) {
      const name = prettyLabel(c.label);
      const x = m.get(name) || { name, section: prettySection(c.section), isBooking: false, total: 0, ySum: 0, xSum: 0 };
      x.total += c.count;
      x.ySum += c.yPct * c.count;
      x.xSum += c.xPct * c.count;
      x.isBooking = x.isBooking || c.isBooking;
      m.set(name, x);
    }
    return Array.from(m.values()).sort((a, b) => b.total - a.total);
  }, [clicks]);

  const VW = device === "desktop" ? 1280 : 390;
  const scale = Math.min(1, boxW / VW);
  const VH = Math.round(720 / scale);

  // container width
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxW(el.clientWidth || 800));
    ro.observe(el);
    setBoxW(el.clientWidth || 800);
    return () => ro.disconnect();
  }, []);

  const measure = useCallback(() => {
    try {
      const d = iframeRef.current?.contentDocument;
      if (!d) return;
      const h = Math.max(d.documentElement.scrollHeight, d.body?.scrollHeight || 0);
      if (h > 300) setDocH(h);
    } catch {
      /* cross-origin: keep default */
    }
  }, []);

  const onFrameLoad = useCallback(() => {
    setLoaded(true);
    measure();
    try {
      const w = iframeRef.current?.contentWindow;
      const d = iframeRef.current?.contentDocument;
      if (!w || !d) return;
      let raf = 0;
      w.addEventListener("scroll", () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setScrollTop(w.scrollY || d.documentElement.scrollTop || 0));
      }, { passive: true });
      // keep links from navigating the preview away
      d.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); }, true);
    } catch {
      /* ignore */
    }
    [800, 1800, 3500, 6000].forEach((ms) => setTimeout(measure, ms));
  }, [measure]);

  // reset when page/device changes
  useEffect(() => {
    setLoaded(false);
    setScrollTop(0);
  }, [page, device]);

  // paint heat / scroll layer
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const RES = 0.5;
    const cw = Math.max(1, Math.round(VW * RES));
    const ch = Math.max(1, Math.round(VH * RES));
    if (cv.width !== cw) cv.width = cw;
    if (cv.height !== ch) cv.height = ch;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cw, ch);

    if (mode === "heat") {
      if (!offRef.current) offRef.current = document.createElement("canvas");
      const off = offRef.current;
      off.width = cw; off.height = ch;
      const o = off.getContext("2d");
      if (!o) return;
      o.clearRect(0, 0, cw, ch);
      const radius = (device === "desktop" ? 104 : 62) * RES;
      for (const c of clicks) {
        const x = (c.xPct / 100) * cw;
        const y = ((c.yPct / 100) * docH - scrollTop) * RES;
        if (y < -radius || y > ch + radius) continue;
        const a = Math.min(1, 0.32 + 0.68 * (c.count / maxCount));
        const g = o.createRadialGradient(x, y, 0, x, y, radius);
        // gaussian-ish falloff: soft shoulder, no hard edge
        g.addColorStop(0, `rgba(0,0,0,${a})`);
        g.addColorStop(0.35, `rgba(0,0,0,${a * 0.62})`);
        g.addColorStop(0.7, `rgba(0,0,0,${a * 0.2})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        o.fillStyle = g;
        o.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
      const img = o.getImageData(0, 0, cw, ch);
      const px = img.data;
      for (let i = 0; i < px.length; i += 4) {
        const a = px[i + 3];
        if (!a) continue;
        px[i] = PALETTE[a * 3]; px[i + 1] = PALETTE[a * 3 + 1]; px[i + 2] = PALETTE[a * 3 + 2];
        px[i + 3] = Math.min(205, Math.pow(a / 255, 0.8) * 255 * 1.35);
      }
      ctx.putImageData(img, 0, 0);
    } else {
      const s = hm.scrollStats;
      const tv = Math.max(1, s.totalViews);
      const pts: [number, number][] = [
        [0, 100], [25, (s.m25 / tv) * 100], [50, (s.m50 / tv) * 100],
        [75, (s.m75 / tv) * 100], [90, (s.m90 / tv) * 100], [100, (s.m100 / tv) * 100],
      ];
      const reach = (pct: number) => {
        for (let i = 1; i < pts.length; i++) {
          if (pct <= pts[i][0]) {
            const [p0, v0] = pts[i - 1];
            const [p1, v1] = pts[i];
            return v0 + ((v1 - v0) * (pct - p0)) / (p1 - p0 || 1);
          }
        }
        return pts[pts.length - 1][1];
      };
      for (let y = 0; y < ch; y++) {
        const pct = Math.max(0, Math.min(100, (((y / RES) + scrollTop) / docH) * 100));
        const [r, g, b] = colorAt(reach(pct) / 100);
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},0.42)`;
        ctx.fillRect(0, y, cw, 1);
      }
    }
  }, [clicks, mode, scrollTop, docH, VW, VH, device, maxCount, hm.scrollStats]);

  const jumpTo = (yPct: number) => {
    try {
      iframeRef.current?.contentWindow?.scrollTo({ top: (yPct / 100) * docH - VH / 3, behavior: "smooth" });
    } catch {
      /* ignore */
    }
  };

  const tv = Math.max(1, hm.scrollStats.totalViews);
  const depth = [
    { zone: "Hero & headline", pct: 100 },
    { zone: "VSL player / hook", pct: Math.round((hm.scrollStats.m50 / tv) * 100) },
    { zone: "Proof & case studies", pct: Math.round((hm.scrollStats.m75 / tv) * 100) },
    { zone: "Offer & protocol", pct: Math.round((hm.scrollStats.m90 / tv) * 100) },
    { zone: "FAQ & footer", pct: Math.round((hm.scrollStats.m100 / tv) * 100) },
  ];

  const topPins = ranked.slice(0, 8);
  const marks = [25, 50, 75, 100];

  return (
    <div className="space-y-4">
      {/* header + controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-50 tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
            Heatmap
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">Where visitors click and how far they scroll, drawn on the real page.</p>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <select
            value={page}
            onChange={(e) => onPageChange(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
          >
            {PAGES.map((o) => (
              <option key={o.path} value={o.path}>{o.label}</option>
            ))}
          </select>
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/70 p-0.5">
            {([["desktop", Monitor, "Desktop"], ["mobile", Smartphone, "Mobile"]] as const).map(([id, Icon, label]) => (
              <button
                key={id}
                onClick={() => setDevice(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  device === id ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/70 p-0.5">
            {([["heat", MousePointer, "Click heat"], ["scroll", TrendingUp, "Scroll depth"]] as const).map(([id, Icon, label]) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  mode === id ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPins((p) => !p)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
              pins ? "border-zinc-600 bg-zinc-800 text-zinc-100" : "border-zinc-800 bg-zinc-900/70 text-zinc-400"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Pins
          </button>
        </div>
      </div>

      {/* KPI chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: "Clicks", v: totalClicks.toLocaleString(), s: `${device} visitors`, c: "from-orange-500/20" },
          { l: "Booking-intent clicks", v: bookingClicks.toLocaleString(), s: totalClicks ? `${Math.round((bookingClicks / totalClicks) * 100)}% of clicks` : "none yet", c: "from-emerald-500/20" },
          { l: "Hottest element", v: ranked[0]?.name || "-", s: ranked[0] ? `${ranked[0].total} clicks · ${ranked[0].section}` : "no clicks yet", small: true, c: "from-red-500/20" },
          { l: "Page views", v: hm.scrollStats.totalViews.toLocaleString(), s: "scroll tracked", c: "from-blue-500/20" },
        ].map((k) => (
          <div key={k.l} className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 min-w-0">
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b ${k.c} to-transparent`} />
            <p className="relative text-xs font-medium text-zinc-400">{k.l}</p>
            <p className={`relative mt-1.5 font-semibold text-zinc-50 truncate tracking-tight ${k.small ? "text-base leading-8" : "text-3xl"}`} title={k.v}>{k.v}</p>
            <p className="relative text-xs text-zinc-500 mt-0.5 truncate">{k.s}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* left: leaderboard + depth */}
        <div className="xl:col-span-4 space-y-4 order-2 xl:order-1">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> Hottest elements</h3>
              <span className="text-xs text-zinc-500">{ranked.length} elements</span>
            </div>
            {ranked.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-500">No clicks recorded on this page for {device} yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {ranked.map((r, i) => {
                  const [cr, cg, cb] = colorAt(r.total / ranked[0].total);
                  const col = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
                  return (
                    <button
                      key={r.name}
                      onClick={() => jumpTo(r.ySum / r.total)}
                      className="group w-full text-left rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 px-3.5 py-3 hover:border-zinc-600 transition-all hover:-translate-y-px"
                      style={i === 0 ? { boxShadow: `0 0 0 1px ${col}55, 0 8px 24px -12px ${col}` } : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center text-zinc-950 shrink-0 shadow" style={{ background: col }}>{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-zinc-100 truncate" title={r.name}>{r.name}</span>
                            {r.isBooking && <span className="text-[9px] font-bold tracking-wide rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 shrink-0">BOOKING</span>}
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{r.section}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-zinc-50 leading-none">{r.total}</p>
                          <p className="text-[10px] text-zinc-500 mt-1">{totalClicks ? Math.round((r.total / totalClicks) * 100) : 0}%</p>
                        </div>
                      </div>
                      <div className="mt-2.5 h-1.5 rounded-full bg-zinc-800/80 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(r.total / ranked[0].total) * 100}%`, background: `linear-gradient(90deg, ${col}99, ${col})` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-400" /> Scroll depth</h3>
              <span className="text-xs text-zinc-500">{hm.scrollStats.totalViews} views</span>
            </div>
            <div className="space-y-3">
              {depth.map((d) => {
                const [cr, cg, cb] = colorAt(d.pct / 100);
                return (
                  <div key={d.zone}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-400">{d.zone}</span>
                      <span className="text-zinc-100 font-medium">{d.pct}% reached</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-800/80 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(3, d.pct)}%`, background: `linear-gradient(90deg, rgb(${cr | 0},${cg | 0},${cb | 0})99, rgb(${cr | 0},${cg | 0},${cb | 0}))` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* right: live page with heat */}
        <div className="xl:col-span-8 order-1 xl:order-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-[0_20px_60px_-30px_rgba(249,115,22,0.35)]">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-zinc-800 bg-zinc-950/60">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 min-w-0 rounded-md bg-zinc-900 border border-zinc-800 px-3 py-1 text-[11px] text-zinc-400 truncate text-center">
              ecom.rarityagency.io{page}
            </div>
            <a href={page} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-orange-400 hover:underline shrink-0">
              Open <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div ref={boxRef} className="relative p-3 bg-zinc-950">
            <div className="mx-auto relative" style={{ width: VW * scale, height: VH * scale }}>
              <div
                className="absolute top-0 left-0 overflow-hidden rounded-md bg-white"
                style={{ width: VW, height: VH, transform: `scale(${scale})`, transformOrigin: "top left" }}
              >
                <iframe
                  key={`${page}-${device}`}
                  ref={iframeRef}
                  src={`${page}?heatmap_preview=1`}
                  title="Page preview"
                  onLoad={onFrameLoad}
                  style={{ width: VW, height: VH }}
                  className="border-0 block"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{ width: VW, height: VH }}
                />

                {mode === "scroll" &&
                  marks.map((m) => {
                    const y = (m / 100) * docH - scrollTop;
                    if (y < 0 || y > VH) return null;
                    const reach = Math.round(((m === 25 ? hm.scrollStats.m25 : m === 50 ? hm.scrollStats.m50 : m === 75 ? hm.scrollStats.m75 : hm.scrollStats.m100) / tv) * 100);
                    return (
                      <div key={m} className="absolute left-0 right-0 pointer-events-none" style={{ top: y }}>
                        <div className="border-t border-dashed border-black/50" />
                        <span className="absolute left-2 -top-3 rounded-md bg-zinc-950/90 text-white font-semibold px-2 py-0.5" style={{ fontSize: 13 / scale }}>
                          {m}% of page · {reach}% reached
                        </span>
                      </div>
                    );
                  })}

                {mode === "heat" && pins &&
                  topPins.map((r, i) => {
                    const x = r.xSum / (r.total || 1);
                    const y = (r.ySum / (r.total || 1) / 100) * docH - scrollTop;
                    if (y < -20 || y > VH + 20) return null;
                    const [cr, cg, cb] = colorAt(r.total / (ranked[0]?.total || 1));
                    return (
                      <div key={r.name} className="absolute pointer-events-none" style={{ left: `${x}%`, top: y, transform: "translate(-50%, -50%)" }}>
                        <span
                          className="flex items-center justify-center rounded-full text-white font-bold"
                          style={{
                            width: 28 / scale, height: 28 / scale, fontSize: 13 / scale,
                            background: "rgba(9,9,11,0.92)",
                            border: `${2.5 / scale}px solid rgb(${cr | 0},${cg | 0},${cb | 0})`,
                            boxShadow: `0 0 ${18 / scale}px rgba(${cr | 0},${cg | 0},${cb | 0},0.8)`,
                          }}
                        >
                          {i + 1}
                        </span>
                      </div>
                    );
                  })}

                {!loaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-zinc-500" style={{ fontSize: 16 / scale }}>
                    Loading page...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-zinc-800 bg-zinc-950/60">
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-zinc-500">{mode === "heat" ? "Fewer clicks" : "Fewer reached"}</span>
              <div className="h-2 w-40 rounded-full" style={{ background: LEGEND }} />
              <span className="text-[11px] text-zinc-500">{mode === "heat" ? "More clicks" : "More reached"}</span>
            </div>
            <span className="text-[11px] text-zinc-500">Scroll inside the page to move the heat with it · {device} layout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
