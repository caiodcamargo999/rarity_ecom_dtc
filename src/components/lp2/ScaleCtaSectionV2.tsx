"use client";

import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface ScaleCtaSectionV2Props {
  onOpenAudit: () => void;
}

const scaleGuarantees = [
  "No 12-Month Lock-in Contracts",
  "Full First-Party Data Ownership",
  "Blended MER & P&L Attribution",
  "Senior Strategist Direct Slack/WhatsApp Sync",
];

export default function ScaleCtaSectionV2({ onOpenAudit }: ScaleCtaSectionV2Props) {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#00103A] via-[#001244] to-[#000820] overflow-hidden text-center border-t border-white/10">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D80064]/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-teal/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.07] border border-white/15 text-brand-teal text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-sm mb-6 shadow-inner">
          <Sparkles className="w-4 h-4 text-brand-teal" />
          <span>Limited Monthly Capacity • 4 Free Growth Audits Available</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Ready to scale your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-tealLight font-serif italic font-normal">
            growth trajectory?
          </span>
        </h2>

        <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
          Let’s audit your ad accounts, diagnose creative fatigue, and map out your next scaling sprint with complete unit economic precision.
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <button
            onClick={onOpenAudit}
            className="px-10 py-5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-widest bg-[#D80064] hover:bg-[#BF0058] text-white shadow-[0_0_35px_rgba(216,0,100,0.6)] border-2 border-[#D80064] hover:border-brand-teal/60 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Claim Your Free Growth Audit</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Authentic Trust Strip */}
        <div className="mt-14 pt-8 w-full border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-white/75 font-medium">
          {scaleGuarantees.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
