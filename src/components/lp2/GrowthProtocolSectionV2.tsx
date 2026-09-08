"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from "lucide-react";

interface GrowthProtocolSectionV2Props {
  onOpenAudit: () => void;
}

const protocolSteps = [
  {
    step: "01",
    phase: "DAY 1 – 7",
    icon: Search,
    title: "Unit Economics & Funnel Leak Diagnostic",
    subtitle: "Identify CAC Bleed & Define True Allowable CPA",
    description:
      "We run a deep-dive forensic audit on your ad accounts, pixel tracking, customer retention cohorts, and Shopify contribution margin to eliminate wasted ad spend.",
    deliverables: [
      "Attribution & server-side tracking audit",
      "Historical CAC & cohort LTV analysis",
      "True allowable CPA & MER benchmark roadmap",
    ],
  },
  {
    step: "02",
    phase: "DAY 7 – 14",
    icon: Layers,
    title: "Algorithmic Account Restructuring",
    subtitle: "Consolidated Advantage+ & Broad Architectures",
    description:
      "We dismantle fragmented ad sets and overlapping audiences, rebuilding clean Advantage+ Shopping and Broad CBO scaling structures that unlock algorithmic efficiency.",
    deliverables: [
      "Consolidated Advantage+ campaign architecture",
      "Dynamic creative testing sandboxes",
      "Bid cap & cost cap guardrails to protect margins",
    ],
  },
  {
    step: "03",
    phase: "MONTHLY ITERATION",
    icon: Sparkles,
    title: "High-Velocity AI & Creator Creative Lab",
    subtitle: "30+ Fresh Hook Tests & Psychological Angles Monthly",
    description:
      "Creative fatigue is the #1 killer of ad performance. Our in-house creative lab produces native UGC, visual hooks, and objection-busting scripts every single month.",
    deliverables: [
      "3-second thumbstop hook optimization (>40%)",
      "Creator UGC & dynamic motion graphics",
      "Psychology-backed angle variations per persona",
    ],
  },
  {
    step: "04",
    phase: "CONTINUOUS SCALE",
    icon: TrendingUp,
    title: "Omnichannel MER Scaling & Funnel CRO",
    subtitle: "Synchronized Search Intent & High-Converting PDPs",
    description:
      "When cold Meta ads generate brand awareness, we capture high-intent demand on Google Search and route traffic to bespoke pre-purchase advertorials and checkout funnels.",
    deliverables: [
      "Google PMax & non-branded search dominance",
      "Dedicated pre-purchase advertorial landing pages",
      "Real bank-deposit MER budget scaling rules",
    ],
  },
];

const comparisonPoints = [
  {
    feature: "Account Management",
    traditional: "Junior media buyers learning on your dime",
    rarity: "Senior growth operators with direct Slack / WhatsApp access",
  },
  {
    feature: "Performance Metric",
    traditional: "Vanity in-platform ROAS (often misleading)",
    rarity: "Net contribution margin & blended MER in your bank account",
  },
  {
    feature: "Creative Output",
    traditional: "2–3 generic creatives per month",
    rarity: "30+ monthly iterative hook tests, UGC, and AI angles",
  },
  {
    feature: "Channel Strategy",
    traditional: "Siloed Meta and Google teams competing for credit",
    rarity: "Unified omnichannel acquisition engine acting as one budget",
  },
  {
    feature: "Communication",
    traditional: "Slow 24–48 hour ticketing & email lag",
    rarity: "Real-time sync during US business hours",
  },
  {
    feature: "Account Ownership",
    traditional: "Agency-held data and proprietary black boxes",
    rarity: "You own 100% of accounts, pixels, creatives, and data forever",
  },
];

export default function GrowthProtocolSectionV2({ onOpenAudit }: GrowthProtocolSectionV2Props) {
  return (
    <section id="performance" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#001244] overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-teal/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#D80064]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-xs sm:text-sm font-extrabold tracking-widest text-brand-teal uppercase block mb-2">
            THE RARITY GROWTH ENGINE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How We Scale DTC Brands Beyond The Plateau
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            A proven, battle-tested 4-step execution blueprint engineered to scale your contribution margin and real net profit.
          </p>
        </div>

        {/* 4-Step Growth Protocol Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-20">
          {protocolSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-[#000c2e] border border-white/10 hover:border-brand-teal/40 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 relative group flex flex-col justify-between"
              >
                {/* Top Step Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-brand-teal/15 text-brand-teal border border-brand-teal/30">
                      PHASE {step.step} • {step.phase}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] group-hover:bg-brand-teal/20 text-brand-teal flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-brand-teal transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-teal font-semibold mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6 font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Deliverables Bullet Points */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider block mb-2">
                    Key Execution Deliverables
                  </span>
                  {step.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Why Brands Switch: Traditional Agency vs Rarity Matrix */}
        <div className="bg-[#000c2e] border border-white/15 rounded-3xl p-5 sm:p-10 shadow-2xl overflow-hidden relative">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-extrabold tracking-widest text-brand-magenta uppercase block mb-1">
              THE HARD TRUTH ABOUT AGENCIES
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Founders Fire Their Agency &amp; Switch To Rarity
            </h3>
          </div>

          {/* MOBILE VIEW: High-Impact Comparison Cards (Perfect for 360px-430px screens) */}
          <div className="sm:hidden space-y-3.5">
            {comparisonPoints.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    {item.feature}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-brand-teal bg-brand-teal/15 border border-brand-teal/30 px-2 py-0.5 rounded-full">
                    Rarity Standard
                  </span>
                </div>

                {/* Traditional Agency */}
                <div className="bg-red-950/30 border border-red-500/25 rounded-xl p-3 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-red-400/90 mb-0.5">
                      Traditional Agency
                    </div>
                    <div className="text-xs text-white/70 leading-relaxed">
                      {item.traditional}
                    </div>
                  </div>
                </div>

                {/* The Rarity Growth Engine */}
                <div className="bg-brand-teal/[0.1] border border-brand-teal/40 rounded-xl p-3 flex items-start gap-2.5 shadow-[0_0_15px_rgba(15,227,179,0.08)]">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-brand-teal mb-0.5">
                      The Rarity Growth Engine
                    </div>
                    <div className="text-xs text-white font-bold leading-relaxed">
                      {item.rarity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Full Side-by-Side Comparison Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-white/60 font-semibold w-1/3">Area</th>
                  <th className="py-3.5 px-4 text-red-400/90 font-bold w-1/3 bg-red-950/20 rounded-t-xl">
                    Traditional Agency
                  </th>
                  <th className="py-3.5 px-4 text-brand-teal font-extrabold w-1/3 bg-brand-teal/10 rounded-t-xl">
                    The Rarity Growth Engine
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                {comparisonPoints.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 text-white/65 bg-red-950/10">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium bg-brand-teal/[0.04]">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                        <span className="font-semibold text-white">{row.rarity}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
