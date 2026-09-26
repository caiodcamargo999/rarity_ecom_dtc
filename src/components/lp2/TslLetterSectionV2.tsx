"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileSearch,
  Zap,
  Target,
  BarChart3,
  ArrowRight,
} from "lucide-react";

interface TslLetterSectionV2Props {
  onOpenAudit: () => void;
}

export default function TslLetterSectionV2({ onOpenAudit }: TslLetterSectionV2Props) {
  return (
    <section id="framework" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#000820] overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-teal/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Letter Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#00103A] border border-white/15 rounded-3xl p-6 sm:p-12 shadow-2xl relative"
        >
          {/* Top Stamp */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-6 mb-8 text-xs font-mono text-white/50">
            <span className="text-brand-teal font-bold tracking-wider uppercase">
              • STRATEGIC GROWTH MEMORANDUM
            </span>
            <span>FOR DTC FOUNDERS &amp; HEADS OF GROWTH</span>
          </div>

          {/* Letter Headline */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Why Most DTC Brands Get Trapped On The{" "}
            <span className="font-serif italic font-normal text-brand-teal">
              Meta Rollercoaster
            </span>{" "}
            (And How to Break Free)
          </h2>

          <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed font-medium">
            If you are doing between $1M and $10M a year in DTC revenue, chances are you know the feeling all too well: one week you are crushing 4x ROAS, and the next week CPAs spike by 60%, ad creatives fatigue overnight, and your agency sends you a slide deck blaming the algorithm.
          </p>

          <div className="my-8 p-5 rounded-2xl bg-white/[0.04] border-l-4 border-[#D80064] text-white/90 text-sm sm:text-base leading-relaxed">
            <strong className="text-white font-bold block mb-1">The Harsh Reality in 2026:</strong>
            Media buying tactics alone won&apos;t save a brand with a sluggish creative pipeline or distorted attribution. The brands that win today operate with <strong>Creative Velocity</strong>, <strong>Blended MER</strong>, and <strong>Forensic Unit Economics</strong>.
          </div>

          {/* 3 Fatal Traps Breakdown */}
          <div className="space-y-6 my-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-brand-magenta" />
              The 3 Fatal Traps Holding E-Commerce Brands Back:
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D80064]/20 text-[#D80064] flex items-center justify-center text-xs font-mono font-bold">
                    01
                  </span>
                  Trusting In-Platform ROAS Instead of Net Contribution Margin
                </h4>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">
                  Meta and Google both claim credit for the same checkout, inflating reported ROAS while your actual bank balance tells a different story. If your agency isn&apos;t optimizing for blended MER and net margin, you&apos;re flying blind.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D80064]/20 text-[#D80064] flex items-center justify-center text-xs font-mono font-bold">
                    02
                  </span>
                  Slow Creative Output &amp; Angle Starvation
                </h4>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">
                  Meta&apos;s Andromeda and Advantage+ algorithms are content-hungry monsters. Delivering 2-3 ads a month is suicide. You need 30+ iterative hook tests, creator UGC, and AI-native angle variations running every single week.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D80064]/20 text-[#D80064] flex items-center justify-center text-xs font-mono font-bold">
                    03
                  </span>
                  Siloed Acquisition Channels
                </h4>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">
                  Running Meta Ads in isolation without synchronizing Google Search intent, TikTok viral testing, and dedicated high-converting landing page funnels creates massive leakages across the customer journey.
                </p>
              </div>
            </div>
          </div>

          {/* The Rarity Solution */}
          <div className="my-10 pt-8 border-t border-white/10">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              The Rarity Blended Growth Engine
            </h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6">
              When you partner with Rarity, you don&apos;t get a junior account manager tweaking bids. You get a dedicated growth squad aligned toward one single metric: <strong>profitable, scalable revenue in your bank account</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#000820] border border-brand-teal/30">
                <div className="flex items-center gap-2 text-brand-teal font-bold text-sm mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Creative Velocity Pipeline</span>
                </div>
                <p className="text-xs text-white/70">
                  30+ weekly hook and angle variations produced with creator networks and AI testing pipelines.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#000820] border border-brand-teal/30">
                <div className="flex items-center gap-2 text-brand-teal font-bold text-sm mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>MER-First Media Buying</span>
                </div>
                <p className="text-xs text-white/70">
                  Consolidated Advantage+ architectures managed against real contribution margin &amp; cash profit.
                </p>
              </div>
            </div>
          </div>

          {/* Growth Audit Breakdown */}
          <div className="my-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#000820] to-[#001754] border border-brand-teal/40">
            <div className="flex items-center gap-2 text-brand-teal text-xs font-bold uppercase tracking-widest mb-2">
              <FileSearch className="w-4 h-4" />
              <span>THE 4-PART FORENSIC AUDIT</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white mb-4">
              What Actually Happens In Your Free Growth Audit?
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-white/80">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <span><strong>1. Forensic Account Audit:</strong> We analyze your Meta &amp; Google ad architecture, identifying wasted spend and bidding leaks.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <span><strong>2. Creative Angle Diagnostic:</strong> We review your top creatives, hook drop-off rates, and identify 5 untapped psychological angles.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <span><strong>3. Unit Economics &amp; MER Model:</strong> We cross-reference ad spend against blended contribution margin and true repeat LTV.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <span><strong>4. 90-Day Scaling Roadmap:</strong> A step-by-step custom execution plan to break through your current revenue ceiling.</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-white/60 font-medium text-center sm:text-left">
                100% Free • No Obligation • Delivered in 48 Hours
              </span>
              <button
                onClick={onOpenAudit}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-[#D80064] hover:bg-[#BF0058] text-white shadow-[0_0_20px_rgba(216,0,100,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Claim Your Growth Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
