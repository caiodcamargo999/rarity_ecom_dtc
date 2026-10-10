"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Search,
  Download,
  LogOut,
  ChevronRight,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Flame,
  Calendar,
  Layers,
  Sparkles,
  MousePointer,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Target,
  Compass,
  Video,
  Play,
  PlayCircle,
  TrendingUp,
  MapPin,
  Crosshair,
  Maximize2,
  Building2,
  SlidersHorizontal,
  Navigation,
  ShieldCheck,
  BarChart3,
  Percent,
  Bot,
  Share2,
  Megaphone,
  Terminal,
  Copy,
  Check,
  Key,
  Code2,
  Server,
  Cpu,
} from "lucide-react";

interface OverviewStats {
  totalVisitors: number;
  uniqueVisitors: number;
  totalPageviews: number;
  avgDurationSeconds: number;
  avgScrollDepth: number;
  activeLiveVisitors: number;
  totalLeads: number;
  totalBookings: number;
  conversionRate: number;
  vturbPlays?: number;
}

interface PageMetric {
  pathname: string;
  title: string;
  pageviews: number;
  uniqueVisitors: number;
  avgDuration: number;
  avgScrollDepth: number;
  ctaClicks: number;
  videoPlays?: number;
  leadsCount: number;
  bookingsCount: number;
  conversionRate: number;
  bounceRate: number;
}

interface CountryMetric {
  country: string;
  countryCode: string;
  visitors: number;
  leads: number;
  bookings: number;
  conversionRate: number;
  pct: number;
}

interface StateMetric {
  state: string;
  stateCode: string;
  country: string;
  visitors: number;
  leads: number;
  bookings: number;
  conversionRate: number;
  pct: number;
}

interface CityMetric {
  city: string;
  state: string;
  country: string;
  visitors: number;
  leads: number;
}

interface ChannelMetric {
  channel: string;
  category: string;
  sessions: number;
  leads: number;
  bookings: number;
  conversionRate: number;
  pct: number;
}

interface LiveVisitor {
  visitor_id: string;
  current_page: string;
  device?: string;
  os?: string;
  browser?: string;
  city?: string;
  country?: string;
  channel?: string;
  dwellSeconds?: number;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  company_name?: string | null;
  last_seen_at?: string;
}

interface VisitorJourney {
  visitor_id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  detectedChannel?: string;
  first_touch_utm_source?: string;
  first_touch_utm_campaign?: string;
  first_touch_landing_page?: string;
  last_touch_landing_page?: string;
  total_pageviews?: number;
  first_seen_at?: string;
  last_seen_at?: string;
  scheduled_on_cal?: string;
}

interface UtmMetric {
  source: string;
  campaign: string;
  medium?: string;
  sessions: number;
  leads: number;
  conversionRate: number;
}

interface VturbStats {
  totalPlays: number;
  totalUnlocks: number;
  playRate: number;
  pitchUnlockRate: number;
  milestones: {
    m10s: number;
    m30s: number;
    m60s: number;
    m120s: number;
    m300s: number;
    m600s: number;
  };
}

interface HeatmapData {
  clicks: Array<{
    xPct: number;
    yPct: number;
    label: string;
    count: number;
    isBooking: boolean;
    section: string;
  }>;
  hotspots: Array<{
    label: string;
    section: string;
    count: number;
    isBooking: boolean;
  }>;
  scrollStats: {
    m25: number;
    m50: number;
    m75: number;
    m90: number;
    m100: number;
    totalViews: number;
  };
}

type TabType = "pages" | "channels" | "geo" | "heatmap" | "live" | "vturb" | "journeys" | "mcp";

export default function AdminAnalyticsDashboard() {
  const router = useRouter();
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("7d");
  const [activeTab, setActiveTab] = useState<TabType>("pages");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const handleCopyText = (key: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Geo State Filter
  const [selectedGeoFilter, setSelectedGeoFilter] = useState<"all" | "us" | "international">("us");

  // Heatmap interactive controls
  const [selectedHeatmapPage, setSelectedHeatmapPage] = useState<string>("/growth-team");
  const [heatmapViewMode, setHeatmapViewMode] = useState<"clicks" | "scroll">("clicks");

  // Production Real States
  const [overview, setOverview] = useState<OverviewStats>({
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
  });
  const [pagesPerformance, setPagesPerformance] = useState<PageMetric[]>([]);
  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>([]);
  const [recentJourneys, setRecentJourneys] = useState<VisitorJourney[]>([]);
  const [utmPerformance, setUtmPerformance] = useState<UtmMetric[]>([]);
  const [channelStats, setChannelStats] = useState<ChannelMetric[]>([]);
  const [geoStats, setGeoStats] = useState<{
    countries: CountryMetric[];
    states: StateMetric[];
    cities: CityMetric[];
  }>({
    countries: [],
    states: [],
    cities: [],
  });
  const [heatmapByPath, setHeatmapByPath] = useState<Record<string, HeatmapData>>({});
  const [vturbStats, setVturbStats] = useState<VturbStats>({
    totalPlays: 0,
    totalUnlocks: 0,
    playRate: 0,
    pitchUnlockRate: 0,
    milestones: { m10s: 0, m30s: 0, m60s: 0, m120s: 0, m300s: 0, m600s: 0 },
  });

  // Drilldown Inspector State
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [drilldownLoading, setDrilldownLoading] = useState(false);
  const [drilldownData, setDrilldownData] = useState<{
    visitor: any;
    timeline: any[];
    leads: any[];
  } | null>(null);

  // Fetch Real Data from Supabase
  const fetchData = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setIsLoading(true);
      else setIsRefreshing(true);

      try {
        const res = await fetch(`/api/admin/analytics?range=${range}&search=${encodeURIComponent(searchQuery)}`);

        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();
        if (res.ok) {
          setOverview(data.overview || {});
          setPagesPerformance(data.pagesPerformance || []);
          setLiveVisitors(data.liveVisitors || []);
          setRecentJourneys(data.recentJourneys || []);
          setUtmPerformance(data.utmPerformance || []);
          setChannelStats(data.channelStats || []);
          if (data.geoStats) {
            setGeoStats(data.geoStats);
          }
          if (data.heatmapByPath) {
            setHeatmapByPath(data.heatmapByPath);
          }
          if (data.vturbStats) {
            setVturbStats(data.vturbStats);
          }

          const pages = data.pagesPerformance || [];
          if (pages.length > 0) {
            if (!pages.some((p: any) => p.pathname === selectedHeatmapPage)) {
              setSelectedHeatmapPage(pages[0].pathname);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [range, searchQuery, router, selectedHeatmapPage]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval (every 10 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  // Drilldown visitor trail
  const handleOpenVisitorDrilldown = async (vid: string) => {
    setSelectedVisitorId(vid);
    setDrilldownLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?visitorId=${encodeURIComponent(vid)}`);
      const data = await res.json();
      if (res.ok) {
        setDrilldownData(data);
      }
    } catch (err) {
      console.error("Error fetching drilldown:", err);
    } finally {
      setDrilldownLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  // CSV Export
  const handleExportCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeTab === "pages") {
      csvContent += "Pathname,Title,Pageviews,Unique Visitors,Avg Duration (s),Avg Scroll %,CTA Clicks,VTurb Plays,Leads,Bookings,Conversion %,Bounce %\n";
      pagesPerformance.forEach((p) => {
        csvContent += `"${p.pathname}","${p.title}",${p.pageviews},${p.uniqueVisitors},${p.avgDuration},${p.avgScrollDepth}%,${p.ctaClicks},${p.videoPlays || 0},${p.leadsCount},${p.bookingsCount},${p.conversionRate}%,${p.bounceRate}%\n`;
      });
    } else if (activeTab === "channels") {
      csvContent += "Traffic Channel,Category,Sessions,Traffic Share %,Leads,Bookings,Conversion Rate %\n";
      channelStats.forEach((c) => {
        csvContent += `"${c.channel}","${c.category}",${c.sessions},${c.pct}%,${c.leads},${c.bookings},${c.conversionRate}%\n`;
      });
    } else if (activeTab === "geo") {
      csvContent += "State/Region,State Code,Country,Visitors,Leads,Bookings,Conversion Rate %\n";
      geoStats.states.forEach((s) => {
        csvContent += `"${s.state}","${s.stateCode}","${s.country}",${s.visitors},${s.leads},${s.bookings},${s.conversionRate}%\n`;
      });
    } else {
      csvContent += "Visitor ID,Full Name,Email,Phone,Company,Country,State/City,Channel,Source,Campaign,Entry Page,Last Page,Pageviews,Scheduled On Cal,Last Seen\n";
      recentJourneys.forEach((j) => {
        csvContent += `"${j.visitor_id}","${j.full_name || ""}","${j.email || ""}","${j.phone || ""}","${j.company_name || ""}","${j.country || ""}","${j.city || ""}","${j.detectedChannel || ""}","${j.first_touch_utm_source || ""}","${j.first_touch_utm_campaign || ""}","${j.first_touch_landing_page || ""}","${j.last_touch_landing_page || ""}",${j.total_pageviews || 1},"${j.scheduled_on_cal || "No"}","${j.last_seen_at || ""}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rarity_analytics_${activeTab}_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentHeatmap = useMemo(() => {
    return (
      heatmapByPath[selectedHeatmapPage] || {
        clicks: [],
        hotspots: [],
        scrollStats: { m25: 0, m50: 0, m75: 0, m90: 0, m100: 0, totalViews: 0 },
      }
    );
  }, [heatmapByPath, selectedHeatmapPage]);

  const filteredStates = useMemo(() => {
    if (selectedGeoFilter === "us") {
      return geoStats.states.filter((s) => s.country === "United States" || s.country === "US");
    }
    if (selectedGeoFilter === "international") {
      return geoStats.states.filter((s) => s.country !== "United States" && s.country !== "US");
    }
    return geoStats.states;
  }, [geoStats.states, selectedGeoFilter]);

  const filteredJourneys = useMemo(() => {
    if (!searchQuery.trim()) return recentJourneys;
    const q = searchQuery.toLowerCase();
    return recentJourneys.filter(
      (j) =>
        j.full_name?.toLowerCase().includes(q) ||
        j.email?.toLowerCase().includes(q) ||
        j.phone?.toLowerCase().includes(q) ||
        j.company_name?.toLowerCase().includes(q) ||
        j.visitor_id?.toLowerCase().includes(q) ||
        j.country?.toLowerCase().includes(q) ||
        j.city?.toLowerCase().includes(q) ||
        j.detectedChannel?.toLowerCase().includes(q) ||
        j.first_touch_utm_campaign?.toLowerCase().includes(q)
    );
  }, [recentJourneys, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500 selection:text-zinc-950 flex flex-col antialiased">
      {/* Subtle Ambient Vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Live status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shadow-sm">
            <Activity className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-zinc-100 font-mono">
                RARITY <span className="text-cyan-400 font-bold">ANALYTICS</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800 font-medium">
                Production Telemetry
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px] font-medium">
                {overview.activeLiveVisitors} Active Leads Right Now
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Controls: Range, Refresh, Search, Export, Logout */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            {(
              [
                { key: "today", label: "Today" },
                { key: "7d", label: "7D" },
                { key: "30d", label: "30D" },
                { key: "all", label: "All" },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setRange(item.key)}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  range === item.key
                    ? "bg-zinc-800 text-zinc-100 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            title="Auto-refresh every 10s"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
              autoRefresh
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/60"
                : "bg-zinc-900 text-zinc-400 border-zinc-800"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
            <span className="hidden md:inline">{autoRefresh ? "Live Sync ON" : "Paused"}</span>
          </button>

          {/* Connect to Claude & AI Modal Button */}
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/20 hover:from-orange-500/25 hover:to-orange-500/35 text-orange-300 hover:text-white border border-orange-500/40 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer shadow-sm group"
          >
            <Bot className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>Connect to Claude</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-zinc-100 text-xs font-medium border border-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-zinc-400 hover:text-rose-400 bg-zinc-900 hover:bg-rose-950/20 border border-zinc-800 hover:border-rose-900/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Unique Visitors */}
          <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-750 transition-colors">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Total Visitors</span>
              <Users className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-zinc-100 font-mono">
                {overview.totalVisitors.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {overview.totalPageviews.toLocaleString()} pageviews
              </div>
            </div>
          </div>

          {/* Card 2: Active Live Leads */}
          <div className="bg-zinc-900/60 border border-emerald-900/40 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-800/60 transition-colors relative overflow-hidden">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
              <span>Live Now</span>
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" strokeWidth={1.75} />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-emerald-400 font-mono flex items-center gap-1.5">
                {overview.activeLiveVisitors}
                <span className="text-xs font-normal text-emerald-400/70 font-sans">leads</span>
              </div>
              <div className="text-[11px] text-emerald-400/60 mt-0.5">Active in 5 min</div>
            </div>
          </div>

          {/* Card 3: Avg Dwell Time */}
          <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-750 transition-colors">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Avg Dwell Time</span>
              <Clock className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-zinc-100 font-mono">
                {formatDuration(overview.avgDurationSeconds)}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {overview.avgScrollDepth}% avg scroll
              </div>
            </div>
          </div>

          {/* Card 4: VTurb Video Plays */}
          <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-750 transition-colors">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>VTurb Plays</span>
              <PlayCircle className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-zinc-100 font-mono">
                {vturbStats.totalPlays}
              </div>
              <div className="text-[11px] text-cyan-400 mt-0.5 font-mono">
                {vturbStats.playRate}% play rate
              </div>
            </div>
          </div>

          {/* Card 5: Leads Generated */}
          <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-750 transition-colors">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Total Leads</span>
              <CheckCircle2 className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-zinc-100 font-mono">
                {overview.totalLeads}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                {overview.conversionRate}% conv. rate
              </div>
            </div>
          </div>

          {/* Card 6: Bookings */}
          <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-750 transition-colors">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Cal.com Calls</span>
              <Calendar className="w-4 h-4 text-zinc-400" strokeWidth={1.75} />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-zinc-100 font-mono">
                {overview.totalBookings}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Calls booked</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "pages", label: "Landing Pages", icon: Layers },
              { id: "channels", label: "Channels & Ads", icon: Target },
              { id: "geo", label: "Geo & US States", icon: Globe },
              { id: "heatmap", label: "Visual Heatmap", icon: Flame },
              { id: "live", label: `Live Radar (${liveVisitors.length})`, icon: Activity },
              { id: "vturb", label: "VTurb Retention", icon: PlayCircle },
              { id: "journeys", label: "Lead Journeys", icon: Compass },
              { id: "mcp", label: "Custom MCP & AI", icon: Bot },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "text-zinc-100 bg-zinc-850 border border-zinc-750 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-zinc-400"}`} strokeWidth={1.75} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Filter */}
          <div className="relative min-w-[220px] sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lead, channel, page, state..."
              className="w-full pl-8 pr-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: LANDING PAGES PERFORMANCE */}
        {activeTab === "pages" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 font-mono">
                  <Layers className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                  Landing Page Performance
                </h2>
                <p className="text-xs text-zinc-400">
                  Granular performance breakdown across public landing pages and funnels
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-400">{pagesPerformance.length} routes active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-zinc-950/60 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
                    <th className="py-3 px-4 sm:px-6">Landing Page Route</th>
                    <th className="py-3 px-3 font-medium">Views</th>
                    <th className="py-3 px-3 font-medium">Uniques</th>
                    <th className="py-3 px-3 font-medium">Avg Time</th>
                    <th className="py-3 px-3 font-medium">Avg Scroll</th>
                    <th className="py-3 px-3 font-medium">CTA Clicks</th>
                    <th className="py-3 px-3 font-medium">VTurb Plays</th>
                    <th className="py-3 px-3 font-medium">Leads</th>
                    <th className="py-3 px-3 font-medium">Bookings</th>
                    <th className="py-3 px-4 text-right font-medium">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {pagesPerformance.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-zinc-400 text-xs font-mono">
                        No telemetry events recorded yet for this timeframe.
                      </td>
                    </tr>
                  ) : (
                    pagesPerformance.map((page, idx) => (
                      <tr key={idx} className="hover:bg-zinc-850/40 transition-colors group">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-medium text-zinc-200 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                            <span className="font-mono text-xs text-zinc-400">#{idx + 1}</span>
                            <span className="font-mono text-xs sm:text-sm">{page.pathname}</span>
                            <a
                              href={page.pathname}
                              target="_blank"
                              rel="noreferrer"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-zinc-200"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate max-w-xs">{page.title}</div>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-medium text-zinc-200">{page.pageviews.toLocaleString()}</td>
                        <td className="py-3.5 px-3 font-mono text-zinc-400">{page.uniqueVisitors.toLocaleString()}</td>
                        <td className="py-3.5 px-3 font-mono text-xs text-zinc-300">
                          {formatDuration(page.avgDuration)}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-zinc-300">{page.avgScrollDepth}%</span>
                            <div className="w-12 bg-zinc-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="bg-cyan-500 h-full rounded-full"
                                style={{ width: `${page.avgScrollDepth}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-zinc-300 font-mono text-xs">
                          {page.ctaClicks}
                        </td>
                        <td className="py-3.5 px-3 text-cyan-400 font-mono text-xs">
                          {page.videoPlays || 0}
                        </td>
                        <td className="py-3.5 px-3 font-mono font-semibold text-zinc-100">{page.leadsCount}</td>
                        <td className="py-3.5 px-3 font-mono font-semibold text-zinc-100">{page.bookingsCount}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                              page.conversionRate > 0
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                                : "text-zinc-400"
                            }`}
                          >
                            {page.conversionRate}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CHANNELS & TRAFFIC SOURCES ATTRIBUTION */}
        {activeTab === "channels" && (
          <div className="space-y-6">
            {/* Top Channels Grid */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 font-mono">
                    <Target className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                    Traffic Channels & AI Search Attribution
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Auto-classified channels (ChatGPT & AI Search, Meta Ads, Google Ads, Instagram Organic, TikTok, SEO)
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400">{channelStats.length} channels tracked</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-zinc-950/60 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
                      <th className="py-3 px-4 sm:px-6 font-medium">Traffic Channel</th>
                      <th className="py-3 px-3 font-medium">Category</th>
                      <th className="py-3 px-3 font-medium">Traffic Share</th>
                      <th className="py-3 px-3 font-medium">Total Sessions</th>
                      <th className="py-3 px-3 font-medium">Leads Captured</th>
                      <th className="py-3 px-3 font-medium">Cal Bookings</th>
                      <th className="py-3 px-4 text-right font-medium">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {channelStats.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-zinc-400 text-xs font-mono">
                          No channel traffic recorded yet.
                        </td>
                      </tr>
                    ) : (
                      channelStats.map((item, idx) => (
                        <tr key={idx} className="hover:bg-zinc-850/40 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-2">
                              {item.category.includes("AI") ? (
                                <Bot className="w-4 h-4 text-cyan-400" />
                              ) : item.category.includes("Paid") ? (
                                <Megaphone className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Share2 className="w-4 h-4 text-zinc-400" />
                              )}
                              <span className="font-semibold text-zinc-100">{item.channel}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-[11px] font-mono text-zinc-300 border border-zinc-700">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 w-40">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${Math.max(5, item.pct)}%` }}
                                />
                              </div>
                              <span className="font-mono text-xs text-zinc-400">{item.pct}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-mono font-medium text-zinc-200">{item.sessions.toLocaleString()}</td>
                          <td className="py-3.5 px-3 font-mono font-semibold text-cyan-400">{item.leads}</td>
                          <td className="py-3.5 px-3 font-mono font-semibold text-emerald-400">{item.bookings}</td>
                          <td className="py-3.5 px-4 text-right">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${
                                item.conversionRate > 0
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                                  : "text-zinc-400"
                              }`}
                            >
                              {item.conversionRate}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Granular UTM Campaigns Table */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-zinc-800">
                <h3 className="text-xs font-semibold text-zinc-200 uppercase font-mono tracking-wider">
                  Granular UTM Campaigns & Ad Tracking
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-zinc-950/60 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
                      <th className="py-2.5 px-4 sm:px-6 font-medium">UTM Source</th>
                      <th className="py-2.5 px-3 font-medium">UTM Campaign</th>
                      <th className="py-2.5 px-3 font-medium">Sessions</th>
                      <th className="py-2.5 px-3 font-medium">Leads Captured</th>
                      <th className="py-2.5 px-4 text-right font-medium">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {utmPerformance.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-400 text-xs font-mono">
                          No UTM parameters recorded yet.
                        </td>
                      </tr>
                    ) : (
                      utmPerformance.map((item, idx) => (
                        <tr key={idx} className="hover:bg-zinc-850/40 transition-colors">
                          <td className="py-3 px-4 sm:px-6 font-mono font-medium text-zinc-200">
                            {item.source}
                          </td>
                          <td className="py-3 px-3 font-mono text-zinc-400">{item.campaign}</td>
                          <td className="py-3 px-3 font-mono font-medium text-zinc-200">{item.sessions.toLocaleString()}</td>
                          <td className="py-3 px-3 font-mono font-semibold text-zinc-100">{item.leads}</td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                                item.conversionRate > 0
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                                  : "text-zinc-400"
                              }`}
                            >
                              {item.conversionRate}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GEOLOCATION & US STATES */}
        {activeTab === "geo" && (
          <div className="space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 font-mono">
                  <Globe className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                  Geographic & US States Intelligence
                </h2>
                <p className="text-xs text-zinc-400">
                  Granular traffic, leads, and conversion telemetry broken down by US states and global regions
                </p>
              </div>

              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-xs">
                {(
                  [
                    { key: "us", label: "United States (States)" },
                    { key: "international", label: "International" },
                    { key: "all", label: "All Regions" },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setSelectedGeoFilter(f.key)}
                    className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      selectedGeoFilter === f.key
                        ? "bg-zinc-800 text-zinc-100 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    US States Axis Performance
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{filteredStates.length} states active</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-zinc-950/60 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
                        <th className="py-2.5 px-4 font-medium">State / Region</th>
                        <th className="py-2.5 px-3 font-medium">Code</th>
                        <th className="py-2.5 px-3 font-medium">Traffic Share</th>
                        <th className="py-2.5 px-3 font-medium">Visitors</th>
                        <th className="py-2.5 px-3 font-medium">Leads</th>
                        <th className="py-2.5 px-4 text-right font-medium">Conv. Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {filteredStates.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-zinc-400 text-xs font-mono">
                            No regional telemetry detected for this view.
                          </td>
                        </tr>
                      ) : (
                        filteredStates.map((item, idx) => (
                          <tr key={idx} className="hover:bg-zinc-850/40 transition-colors">
                            <td className="py-3 px-4 font-medium text-zinc-200 flex items-center gap-2">
                              <span className="font-mono text-xs text-zinc-400">#{idx + 1}</span>
                              <span>{item.state}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono text-zinc-300">
                                {item.stateCode}
                              </span>
                            </td>
                            <td className="py-3 px-3 w-40">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${Math.max(5, item.pct)}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs text-zinc-400">{item.pct}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-medium text-zinc-200">
                              {item.visitors.toLocaleString()}
                            </td>
                            <td className="py-3 px-3 font-mono font-semibold text-zinc-100">
                              {item.leads}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                                  item.conversionRate > 0
                                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                                    : "text-zinc-400"
                                }`}
                              >
                                {item.conversionRate}%
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 uppercase font-mono">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      Country Distribution
                    </span>
                    <span className="text-zinc-400">{geoStats.countries.length} countries</span>
                  </div>

                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {geoStats.countries.map((c, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-2.5 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-[10px] text-zinc-300">
                            {c.countryCode}
                          </span>
                          <span className="font-medium text-zinc-200">{c.country}</span>
                        </div>
                        <div className="text-right flex items-center gap-2 font-mono">
                          <span className="text-zinc-400">{c.visitors} visits</span>
                          <span className="text-cyan-400 font-semibold">{c.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 uppercase font-mono">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      Top Cities
                    </span>
                    <span className="text-zinc-400">{geoStats.cities.length} cities</span>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {geoStats.cities.length === 0 ? (
                      <div className="py-6 text-center text-zinc-400 text-xs font-mono">
                        No city telemetry captured yet.
                      </div>
                    ) : (
                      geoStats.cities.map((city, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-2 text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-medium text-zinc-200">{city.city}</span>
                            <span className="text-[10px] text-zinc-400 ml-1.5">({city.state})</span>
                          </div>
                          <span className="font-mono text-zinc-300">{city.visitors} visits</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VISUAL HEATMAP */}
        {activeTab === "heatmap" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 font-mono">
                  <Flame className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                  Visual Heatmap & Click Radar
                </h2>
                <p className="text-xs text-zinc-400">
                  Inspect exact coordinate click hotspots and vertical scroll drop-off milestones
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-400 font-mono">Page:</span>
                  <select
                    value={selectedHeatmapPage}
                    onChange={(e) => setSelectedHeatmapPage(e.target.value)}
                    className="bg-transparent text-zinc-100 font-mono text-xs font-medium focus:outline-none cursor-pointer"
                  >
                    {[
                      { path: "/growth-team", label: "Angle B: VSL (/growth-team)" },
                      { path: "/growth-team-tsl", label: "Angle B: TSL (/growth-team-tsl)" },
                      { path: "/", label: "Angle A: VSL (/)" },
                      { path: "/lp2", label: "Angle A: TSL (/lp2)" },
                      { path: "/free-audit", label: "Angle A: Clean Audit (/free-audit)" },
                      { path: "/free-audit2", label: "Angle B: Clean Audit (/free-audit2)" },
                      { path: "/onboarding", label: "Client Onboarding (/onboarding)" },
                    ].map((opt) => (
                      <option key={opt.path} value={opt.path} className="bg-zinc-900 text-zinc-100">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-xs">
                  <button
                    onClick={() => setHeatmapViewMode("clicks")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      heatmapViewMode === "clicks"
                        ? "bg-zinc-800 text-zinc-100"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <MousePointer className="w-3.5 h-3.5" />
                    <span>Click Radar</span>
                  </button>
                  <button
                    onClick={() => setHeatmapViewMode("scroll")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      heatmapViewMode === "scroll"
                        ? "bg-zinc-800 text-zinc-100"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Scroll Gradient</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 uppercase font-mono">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      Scroll Depth Drop-off
                    </span>
                    <span className="text-zinc-400 font-mono">
                      {currentHeatmap.scrollStats.totalViews} views
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { label: "Above Fold (0-25%)", zone: "Hero & Headline", pct: 100 },
                      {
                        label: "Top Section (25-50%)",
                        zone: "VSL Player / Hook",
                        pct: currentHeatmap.scrollStats.totalViews
                          ? Math.round(
                              (currentHeatmap.scrollStats.m50 / currentHeatmap.scrollStats.totalViews) * 100
                            )
                          : 0,
                      },
                      {
                        label: "Mid Page (50-75%)",
                        zone: "Proof & Case Studies",
                        pct: currentHeatmap.scrollStats.totalViews
                          ? Math.round(
                              (currentHeatmap.scrollStats.m75 / currentHeatmap.scrollStats.totalViews) * 100
                            )
                          : 0,
                      },
                      {
                        label: "Deep Funnel (75-90%)",
                        zone: "Offer & Protocol",
                        pct: currentHeatmap.scrollStats.totalViews
                          ? Math.round(
                              (currentHeatmap.scrollStats.m90 / currentHeatmap.scrollStats.totalViews) * 100
                            )
                          : 0,
                      },
                      {
                        label: "Page End (100%)",
                        zone: "FAQ & Footer",
                        pct: currentHeatmap.scrollStats.totalViews
                          ? Math.round(
                              (currentHeatmap.scrollStats.m100 / currentHeatmap.scrollStats.totalViews) * 100
                            )
                          : 0,
                      },
                    ].map((step, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-zinc-400">{step.zone}</span>
                          <span className="text-zinc-200 font-medium">{step.pct}% reached</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(5, step.pct))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 uppercase font-mono">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-cyan-400" />
                      Warm Click Leaderboard
                    </span>
                    <span className="text-zinc-400 font-mono">{currentHeatmap.clicks.length} hotspots</span>
                  </div>

                  {currentHeatmap.hotspots.length === 0 ? (
                    <div className="py-8 text-center text-zinc-400 text-xs font-mono">
                      No click coordinates recorded on this page yet.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                      {currentHeatmap.hotspots.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs flex items-center justify-between"
                        >
                          <div className="space-y-0.5 truncate max-w-[200px]">
                            <div className="font-medium text-zinc-200 truncate flex items-center gap-1.5">
                              <span className="font-mono text-[10px] text-zinc-400">#{idx + 1}</span>
                              <span className="truncate">{item.label}</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono truncate">
                              Section: {item.section}
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 font-mono text-xs font-semibold border border-zinc-700 shrink-0">
                            {item.count} {item.count === 1 ? "click" : "clicks"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Viewport Radar: <code className="text-zinc-200">{selectedHeatmapPage}</code>
                  </span>
                  <a
                    href={selectedHeatmapPage}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:underline"
                  >
                    Open Page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative w-full h-[620px] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                  <iframe
                    src={selectedHeatmapPage}
                    title="Landing Page Preview"
                    className="w-full h-full border-0 pointer-events-auto"
                  />

                  {heatmapViewMode === "clicks" && (
                    <div className="absolute inset-0 pointer-events-none z-20">
                      {currentHeatmap.clicks.map((click, idx) => (
                        <div
                          key={idx}
                          style={{
                            left: `${click.xPct}%`,
                            top: `${Math.min(95, Math.max(5, click.yPct))}%`,
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer"
                        >
                          <div className="relative flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-cyan-400 opacity-60"></span>
                            <span className="relative inline-flex items-center justify-center rounded-full h-6 w-6 bg-cyan-500 text-zinc-950 font-mono text-[10px] font-bold shadow-lg border border-zinc-950">
                              {click.count}
                            </span>
                          </div>

                          <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-md px-2.5 py-1 text-[11px] whitespace-nowrap shadow-xl z-30 font-mono">
                            <div className="font-semibold text-cyan-400">{click.label}</div>
                            <div className="text-[10px] text-zinc-400">
                              {click.count} clicks • Section: {click.section}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {heatmapViewMode === "scroll" && (
                    <div className="absolute inset-0 pointer-events-none z-20 flex">
                      <div className="w-10 h-full bg-zinc-950/70 border-r border-zinc-800 flex flex-col justify-between py-4 text-[10px] font-mono text-center text-zinc-300 font-semibold backdrop-blur-[2px]">
                        <span>100%</span>
                        <span>75%</span>
                        <span>50%</span>
                        <span>25%</span>
                        <span>0%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LIVE RADAR */}
        {activeTab === "live" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 font-mono">
                  <Activity className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
                  Live Lead Radar
                </h2>
                <p className="text-xs text-zinc-400">
                  Active visitors currently navigating your public landing pages in real time
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-0.5 rounded-md">
                Auto-syncing every 10s
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {liveVisitors.length === 0 ? (
                <div className="col-span-full py-16 text-center text-zinc-400 text-xs font-mono">
                  No active visitors detected in the last 5 minutes.
                </div>
              ) : (
                liveVisitors.map((visitor, idx) => (
                  <div
                    key={visitor.visitor_id || idx}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors cursor-pointer group"
                    onClick={() => handleOpenVisitorDrilldown(visitor.visitor_id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {visitor.device === "mobile" ? (
                          <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                        ) : (
                          <Laptop className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                        <span className="font-mono text-xs text-zinc-400 truncate max-w-[120px]">
                          {visitor.visitor_id}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-1.5 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                      </span>
                    </div>

                    {visitor.full_name || visitor.email ? (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 mb-3">
                        <div className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          {visitor.full_name || "Identified Lead"}
                        </div>
                        {visitor.email && (
                          <div className="text-[11px] text-zinc-400 truncate">{visitor.email}</div>
                        )}
                      </div>
                    ) : null}

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono text-zinc-400">Current Route</span>
                      <div className="font-mono text-xs text-cyan-400 bg-zinc-900 px-2.5 py-1.5 rounded-md truncate">
                        {visitor.current_page || "/"}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <span>{visitor.channel || "Direct"} • {visitor.city || visitor.country || "Global"}</span>
                      <span className="group-hover:text-zinc-200 flex items-center gap-1 transition-colors">
                        View Trail <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: VTURB VIDEO RETENTION */}
        {activeTab === "vturb" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-6 space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 font-mono">
                <PlayCircle className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                VTurb Video Retention & Engagement
              </h2>
              <p className="text-xs text-zinc-400">
                Client-side video playback telemetry, milestone watch times, and pitch CTA unlocks
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <span className="text-xs text-zinc-400 block font-medium">Total Video Plays</span>
                <span className="text-2xl font-bold font-mono text-zinc-100 mt-1 block">
                  {vturbStats.totalPlays}
                </span>
                <span className="text-[11px] text-cyan-400 font-mono mt-1 block">
                  {vturbStats.playRate}% start rate
                </span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <span className="text-xs text-zinc-400 block font-medium">Pitch Unlocks</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                  {vturbStats.totalUnlocks}
                </span>
                <span className="text-[11px] text-emerald-400/80 font-mono mt-1 block">
                  {vturbStats.pitchUnlockRate}% unlock rate
                </span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <span className="text-xs text-zinc-400 block font-medium">Watched &gt; 1 min</span>
                <span className="text-2xl font-bold font-mono text-zinc-100 mt-1 block">
                  {vturbStats.milestones.m60s}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono mt-1 block">High retention</span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <span className="text-xs text-zinc-400 block font-medium">Watched &gt; 5 min</span>
                <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                  {vturbStats.milestones.m300s}
                </span>
                <span className="text-[11px] text-cyan-400/80 font-mono mt-1 block">High-intent leads</span>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase font-mono tracking-wider">
                Watch Time Milestones
              </h3>

              <div className="space-y-3">
                {[
                  { label: "10 Seconds (Hook)", count: vturbStats.milestones.m10s },
                  { label: "30 Seconds", count: vturbStats.milestones.m30s },
                  { label: "1 Minute", count: vturbStats.milestones.m60s },
                  { label: "2 Minutes", count: vturbStats.milestones.m120s },
                  { label: "5 Minutes", count: vturbStats.milestones.m300s },
                  { label: "10 Minutes (Full VSL)", count: vturbStats.milestones.m600s },
                ].map((item, idx) => {
                  const percent = vturbStats.totalPlays
                    ? Math.round((item.count / vturbStats.totalPlays) * 100)
                    : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-zinc-400">{item.label}</span>
                        <span className="text-zinc-200 font-medium">
                          {item.count} viewers ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, percent)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: LEAD JOURNEYS */}
        {activeTab === "journeys" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 font-mono">
                  <Compass className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                  Lead Journeys & Visitor Trails
                </h2>
                <p className="text-xs text-zinc-400">
                  Chronological navigation paths taken by identified leads and visitors
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-400">{filteredJourneys.length} visitor trails</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-zinc-950/60 text-zinc-400 uppercase font-mono text-[11px] border-b border-zinc-800">
                    <th className="py-3 px-4 sm:px-6 font-medium">Lead / Visitor</th>
                    <th className="py-3 px-3 font-medium">Detected Channel</th>
                    <th className="py-3 px-3 font-medium">Location</th>
                    <th className="py-3 px-3 font-medium">Entry Page</th>
                    <th className="py-3 px-3 font-medium">Last Route</th>
                    <th className="py-3 px-3 font-medium">Cal Booked</th>
                    <th className="py-3 px-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredJourneys.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-zinc-400 text-xs font-mono">
                        No lead journeys recorded yet for this timeframe.
                      </td>
                    </tr>
                  ) : (
                    filteredJourneys.map((journey, idx) => (
                      <tr
                        key={idx}
                        onClick={() => handleOpenVisitorDrilldown(journey.visitor_id)}
                        className="hover:bg-zinc-850/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-medium text-zinc-200 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                            <span>{journey.full_name || "Anonymous Visitor"}</span>
                            {journey.scheduled_on_cal === "Yes" && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                                BOOKED
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono">{journey.email || journey.visitor_id}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300">
                            {journey.detectedChannel || journey.first_touch_utm_source || "Direct"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-xs text-zinc-400">
                          {journey.city ? `${journey.city}, ${journey.country}` : journey.country || "Global"}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-xs text-zinc-400">
                          {journey.first_touch_landing_page || "/"}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-xs text-cyan-400">
                          {journey.last_touch_landing_page || "/"}
                        </td>
                        <td className="py-3.5 px-3">
                          {journey.scheduled_on_cal === "Yes" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-xs font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                            </span>
                          ) : (
                            <span className="text-zinc-400 text-xs font-mono">No</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 rounded text-xs font-mono transition-colors cursor-pointer">
                            Inspect →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: CUSTOM MCP & AI INTEGRATIONS */}
        {activeTab === "mcp" && (
          <div className="space-y-6">
            {/* Top Overview Banner */}
            <div className="bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-indigo-950/40 border border-cyan-900/40 rounded-xl p-5 sm:p-6 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Model Context Protocol (MCP) & OpenAI Schema Ready
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">v1.0.0</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-100 font-mono tracking-tight flex items-center gap-2.5">
                    <Bot className="w-5 h-5 text-cyan-400" />
                    Custom MCP Server & AI Telemetry Bridge
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Conecte o <strong className="text-zinc-200 font-medium">Claude Desktop</strong>, <strong className="text-zinc-200 font-medium">Cursor IDE</strong> e o <strong className="text-zinc-200 font-medium">ChatGPT (Custom GPT Actions)</strong> diretamente à telemetria de tráfego, conversão de landing pages, canais (ChatGPT, Meta Ads, Google Ads) e estados dos EUA em tempo real.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="/api/openapi.json"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-750 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View OpenAPI 3.1 JSON</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                  <button
                    onClick={() => handleCopyText("api_url", "https://ecom.rarityagency.io/api/v1/analytics")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                  >
                    {copiedKey === "api_url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "api_url" ? "Copiado!" : "Copy REST API URL"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Two Column Setup Guides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box 1: Claude Remote MCP Link (Sem Arquivo de Configuração) */}
              <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-950/20 border border-orange-500/30 rounded-xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-lg">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-sm shadow-sm">
                        C
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-zinc-100 font-mono">
                            Claude Custom MCP (1-Click URL)
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-medium">
                            Direto • Sem arquivo
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Basta colar o link na sessão Custom MCP do Claude / Connectors
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Copie o link abaixo e cole no campo <strong className="text-white">Custom MCP Server URL</strong> no Claude:
                  </p>

                  <div className="bg-zinc-950 border border-orange-500/30 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                        URL Direta do Servidor MCP:
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">SSE / HTTP</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://ecom.rarityagency.io/api/mcp"
                        className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 select-all focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => handleCopyText("claude_link", "https://ecom.rarityagency.io/api/mcp")}
                        className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
                      >
                        {copiedKey === "claude_link" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "claude_link" ? "Copiado!" : "Copiar Link"}</span>
                      </button>
                    </div>

                    <div className="pt-1 text-[11px] text-zinc-400 flex items-center gap-2">
                      <span>Link alternativo SSE:</span>
                      <code className="text-zinc-300 font-mono text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded select-all">
                        https://ecom.rarityagency.io/api/mcp/sse
                      </code>
                    </div>
                  </div>

                  <div className="bg-zinc-950/60 border border-zinc-850 rounded-lg p-3 text-xs text-zinc-400 space-y-1">
                    <div className="text-zinc-200 font-medium text-[11px]">Como usar no Claude:</div>
                    <div className="text-[11px] text-zinc-400">1. No Claude, clique em <strong>Add Custom MCP</strong> ou <strong>Connectors</strong>.</div>
                    <div className="text-[11px] text-zinc-400">2. Cole a URL: <code className="text-orange-400 font-mono">https://ecom.rarityagency.io/api/mcp</code></div>
                    <div className="text-[11px] text-zinc-400">3. Pronto! As 7 ferramentas de analytics ficam disponíveis automaticamente.</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 7 ferramentas ativas
                  </span>
                  <span className="font-mono text-[11px] text-orange-400">Remote MCP Protocol</span>
                </div>
              </div>

              {/* Box 2: ChatGPT Custom GPT Actions Setup */}
              <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-lg">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm shadow-sm">
                        GPT
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-zinc-100 font-mono">
                            ChatGPT Custom GPT Action
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-medium">
                            OpenAPI 3.1
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Importação automática via URL no GPT Builder
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    No editor do Custom GPT (<strong>Actions ➔ Import from URL</strong>), cole:
                  </p>

                  <div className="space-y-2.5">
                    <div className="bg-zinc-950 border border-emerald-500/30 rounded-xl p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                        <span className="text-emerald-400 font-semibold">1. Schema URL (Import from URL):</span>
                        <button
                          onClick={() => handleCopyText("gpt_url", "https://ecom.rarityagency.io/api/openapi.json")}
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-mono text-[11px]"
                        >
                          {copiedKey === "gpt_url" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === "gpt_url" ? "Copiado" : "Copiar URL"}</span>
                        </button>
                      </div>
                      <div className="font-mono text-xs text-emerald-300 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg select-all break-all">
                        https://ecom.rarityagency.io/api/openapi.json
                      </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                        <span>2. Autenticação (API Key):</span>
                        <button
                          onClick={() => handleCopyText("gpt_key", "rarity2025")}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-mono text-[11px]"
                        >
                          {copiedKey === "gpt_key" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === "gpt_key" ? "Copiado" : "Copiar Chave"}</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-zinc-300 space-y-0.5 font-sans">
                        <div>• Auth Type: <strong className="text-zinc-100">API Key</strong></div>
                        <div>• Header Name: <strong className="text-cyan-400 font-mono">x-api-key</strong></div>
                        <div>• Key Value: <strong className="text-zinc-100 font-mono">rarity2025</strong></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> GPT-4o, o1 e GPT-4 Turbo
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400">REST API v1</span>
                </div>
              </div>
            </div>

            {/* Grid of 7 MCP Tools */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 font-mono flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    7 Ferramentas MCP & Ações Expostas à Inteligência Artificial
                  </h3>
                  <p className="text-xs text-zinc-400">
                    O Claude e o ChatGPT acionam essas ferramentas de forma autônoma para responder dúvidas analíticas.
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400">7 tools registradas</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  {
                    name: "get_analytics_overview",
                    label: "Executive KPIs Overview",
                    desc: "Visitantes totais, únicos, tempo médio, taxa de scroll, plays VTurb, leads e conversão.",
                    prompt: "Claude, me dê o resumo executivo de tráfego e conversão dos últimos 7 dias.",
                  },
                  {
                    name: "get_landing_pages_performance",
                    label: "Landing Pages Breakdown",
                    desc: "Métricas página a página (/growth-team, /lp2, etc.): views, cliques no CTA, retenção e leads.",
                    prompt: "Quais são as 2 landing pages com maior taxa de conversão em leads?",
                  },
                  {
                    name: "get_channels_attribution",
                    label: "Channels & Ads Attribution",
                    desc: "Atribuição de canais: ChatGPT / AI Search, Meta Ads, Google Ads, Instagram Orgânico e campanhas UTM.",
                    prompt: "Quantos leads e sessões vieram do Meta Ads em comparação com o ChatGPT?",
                  },
                  {
                    name: "get_us_states_and_geo",
                    label: "US States & Geolocation",
                    desc: "Tráfego por estados dos EUA (Califórnia, Flórida, Texas, NY, etc.) e países globais.",
                    prompt: "Mostre o ranking dos 5 estados americanos que mais geraram visitantes e leads.",
                  },
                  {
                    name: "get_live_visitors",
                    label: "Live Active Visitors Radar",
                    desc: "Visitantes navegando ao vivo nas landing pages neste exato minuto (últimos 5 minutos).",
                    prompt: "Quantas pessoas estão navegando na página agora e em quais rotas?",
                  },
                  {
                    name: "get_lead_journeys",
                    label: "Lead Journey Trails",
                    desc: "Trilha cronológica dos leads: primeiro canal de origem, landing page de entrada e agendamentos Cal.com.",
                    prompt: "Analise a jornada do lead mais recente e como ele chegou até o agendamento.",
                  },
                  {
                    name: "get_vturb_video_stats",
                    label: "VTurb Video Player Retention",
                    desc: "Retenção segundo a segundo do VTurb (marcos 10s, 30s, 60s, 120s, 300s, 600s) e liberação do pitch CTA.",
                    prompt: "Qual a taxa de retenção do vídeo nos primeiros 60 segundos e quantos chegaram ao pitch?",
                  },
                ].map((tool, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950/80 border border-zinc-850 hover:border-zinc-750 rounded-lg p-3.5 flex flex-col justify-between space-y-2.5 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-cyan-400">
                          {tool.name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">tool</span>
                      </div>
                      <div className="text-xs font-medium text-zinc-200">{tool.label}</div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{tool.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-zinc-500 truncate">
                        Prompt: &quot;{tool.prompt.slice(0, 32)}...&quot;
                      </span>
                      <button
                        onClick={() => handleCopyText(`prompt_${idx}`, tool.prompt)}
                        className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 rounded text-[10px] font-mono transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        {copiedKey === `prompt_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === `prompt_${idx}` ? "Copiado" : "Copiar Prompt"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* VISITOR TRAIL INSPECTOR DRAWER */}
      <AnimatePresence>
        {selectedVisitorId && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVisitorId(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-zinc-950 border-l border-zinc-800 h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl z-10"
            >
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      Visitor Telemetry Trail
                    </span>
                    <h3 className="text-lg font-semibold text-zinc-100 mt-0.5">
                      {drilldownData?.visitor?.full_name || "Visitor Intelligence"}
                    </h3>
                    <div className="text-xs font-mono text-zinc-400">{selectedVisitorId}</div>
                  </div>
                  <button
                    onClick={() => setSelectedVisitorId(null)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {drilldownLoading ? (
                  <div className="py-24 text-center">
                    <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-3" />
                    <p className="text-xs text-zinc-400 font-mono">Loading chronological trail...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {drilldownData?.visitor && (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                        <div className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                          Visitor Profile & Device
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-zinc-400 block text-[10px]">Email:</span>
                            <span className="text-zinc-200 font-medium truncate block">
                              {drilldownData.visitor.email || "Not identified"}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-400 block text-[10px]">Phone:</span>
                            <span className="text-zinc-200 font-medium block">
                              {drilldownData.visitor.phone || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-400 block text-[10px]">Company / Store:</span>
                            <span className="text-cyan-400 font-medium block">
                              {drilldownData.visitor.company_name || "—"}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-400 block text-[10px]">Location:</span>
                            <span className="text-zinc-300 block">
                              {drilldownData.visitor.city ? `${drilldownData.visitor.city}, ` : ""}
                              {drilldownData.visitor.country || "Global"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono flex items-center justify-between">
                        <span>Event Timeline</span>
                        <span className="text-zinc-400 font-normal">
                          {drilldownData?.timeline?.length || 0} events
                        </span>
                      </div>

                      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                        {(drilldownData?.timeline || []).map((step, idx) => (
                          <div key={idx} className="relative group">
                            <div
                              className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-zinc-950 ${
                                step.type === "cal_booked"
                                  ? "bg-emerald-400"
                                  : step.type === "lead_captured" || step.type === "lead_submission"
                                  ? "bg-cyan-400"
                                  : step.type === "vturb_play" || step.type === "vturb_milestone"
                                  ? "bg-amber-400"
                                  : "bg-zinc-600"
                              }`}
                            />
                            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-zinc-200">{step.title}</span>
                                <span className="font-mono text-zinc-400 text-[10px]">
                                  {step.timestamp
                                    ? new Date(step.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      })
                                    : ""}
                                </span>
                              </div>
                              <div className="text-zinc-400 font-mono text-[11px] truncate">
                                Route: {step.pathname}
                              </div>
                              {step.duration ? (
                                <div className="text-[10px] text-zinc-400">
                                  Dwell: {formatDuration(step.duration)} • Scroll: {step.scrollDepth}%
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800 mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedVisitorId(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Close Trail
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* CONNECT TO CLAUDE & CHATGPT POPUP MODAL (EXACT MATCH TO DESIGN) */}
        {isConnectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConnectModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 text-zinc-200 z-10 max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-zinc-850 pb-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider text-zinc-100 font-mono uppercase">
                    CONNECT TO CLAUDE
                  </h3>
                  <div className="text-xs text-zinc-500 font-sans mt-0.5">
                    Rarity Analytics · read-only
                  </div>
                </div>
                <button
                  onClick={() => setIsConnectModalOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CONNECTOR URL */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  CONNECTOR URL
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value="https://ecom.rarityagency.io/api/mcp"
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-3.5 pr-11 py-2.5 text-xs font-mono text-zinc-100 select-all focus:outline-none focus:border-zinc-700"
                  />
                  <button
                    onClick={() => handleCopyText("modal_url", "https://ecom.rarityagency.io/api/mcp")}
                    className="absolute right-2 p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                    title="Copy connector URL"
                  >
                    {copiedKey === "modal_url" ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* IN CLAUDE.AI OR THE CLAUDE APP */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  IN CLAUDE.AI OR THE CLAUDE APP
                </div>
                <ol className="space-y-1.5 text-zinc-300 font-sans leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="font-semibold text-zinc-400">1.</span>
                    <span>Open <strong>Customize → Connectors</strong> and choose <strong>Add custom connector</strong>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-semibold text-zinc-400">2.</span>
                    <span>Name it <strong>Rarity Analytics</strong> and paste the URL above. Leave the advanced settings empty.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-semibold text-zinc-400">3.</span>
                    <span>Click <strong>Add</strong>, then <strong>Connect</strong>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-semibold text-zinc-400">4.</span>
                    <span>Claude connects to Rarity Analytics: sign in if asked and click <strong>Authorize</strong>.</span>
                  </li>
                </ol>
                <p className="text-[11px] text-zinc-500 italic pt-1 leading-normal">
                  On a Team or Enterprise plan, an Owner adds it once in Organization settings → Connectors; everyone else only clicks Connect and signs in with their own account.
                </p>
              </div>

              {/* IN CLAUDE CODE */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  IN CLAUDE CODE
                </div>
                <div className="relative flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-2.5">
                  <code className="text-[11px] font-mono text-zinc-300 select-all pr-8 overflow-x-auto whitespace-nowrap">
                    claude mcp add --transport sse rarity https://ecom.rarityagency.io/api/mcp
                  </code>
                  <button
                    onClick={() =>
                      handleCopyText("modal_cli", "claude mcp add --transport sse rarity https://ecom.rarityagency.io/api/mcp")
                    }
                    className="absolute right-2 p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                  >
                    {copiedKey === "modal_cli" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500 font-sans">
                  Then run <code className="text-zinc-400 font-mono">/mcp</code> inside Claude Code to inspect available tools.
                </p>
              </div>

              {/* YOUR ACTIVE CONNECTIONS */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  YOUR ACTIVE CONNECTIONS
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-xs">
                      C
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-200 font-sans flex items-center gap-1.5">
                        <span>Claude · claude.ai</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Connected · SSE Remote Telemetry · rarity_telemetry_live
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-md">
                    Active
                  </span>
                </div>
              </div>

              {/* WHAT CLAUDE CAN READ */}
              <div className="space-y-2 pt-1 border-t border-zinc-850">
                <div className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  WHAT CLAUDE CAN READ
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-zinc-300 font-sans">
                  {[
                    "Funnel, KPIs, pageviews, dwell time and conversion rates",
                    "Granular Landing Page metrics (/growth-team, /lp2, /free-audit)",
                    "Traffic channel attribution (ChatGPT, Meta Ads, Google Ads, Organic)",
                    "Geolocation & US State breakdown (California, Florida, Texas, etc.)",
                    "Active live visitors radar in real time (last 5 minutes)",
                    "Lead journeys, contact details and Cal.com booked strategy calls",
                    "VTurb Video player retention milestones and CTA pitch unlock rate",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                      <span className="text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
