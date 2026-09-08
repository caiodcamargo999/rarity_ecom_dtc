"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, KeyRound, UserCheck, BarChart3, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface HeroSectionV2Props {
  onOpenAudit: () => void;
}

const rarityGuarantees = [
  {
    icon: Clock,
    title: "US Business Hours Coverage",
    description: "Real answers and real-time team sync, not a 24-hour communication lag.",
  },
  {
    icon: KeyRound,
    title: "You Keep 100% Ownership",
    description: "Your ad accounts, pixels, creatives, and customer lists stay yours. Always.",
  },
  {
    icon: UserCheck,
    title: "Direct Senior Strategist Access",
    description: "Talk to the expert actively running your account, not a junior rep swapped in later.",
  },
  {
    icon: BarChart3,
    title: "MER & Real Profit Scaling",
    description: "We optimize against contribution margin and real cash, not vanity platform ROAS.",
  },
];

export default function HeroSectionV2({ onOpenAudit }: HeroSectionV2Props) {
  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-[#00103A] overflow-hidden text-center">
      {/* Dynamic Cybernetic Dot Grid Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:32px_32px] pointer-events-none opacity-65 z-0" />

      {/* Lateral Vignette Overlays (Darker at left & right borders, open in center) */}
      <div className="absolute inset-y-0 left-0 w-1/4 sm:w-1/3 bg-gradient-to-r from-[#000820] via-[#000820]/75 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-y-0 right-0 w-1/4 sm:w-1/3 bg-gradient-to-l from-[#000820] via-[#000820]/75 to-transparent pointer-events-none z-0" />

      {/* Luminous Central Ambient Spotlight (Illuminated in the center) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[360px] sm:w-[800px] h-[360px] sm:h-[550px] bg-gradient-to-b from-brand-teal/20 via-brand-teal/8 to-transparent blur-[90px] sm:blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] sm:w-[500px] h-[280px] sm:h-[400px] bg-[#D80064]/15 blur-[80px] sm:blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Rarity Watermark Symbol with Soft Ambient Backlight */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[380px] sm:w-[600px] h-[380px] sm:h-[600px] pointer-events-none opacity-15 sm:opacity-10 select-none z-0">
        <Image
          src="/images/symbol-logo.png"
          alt=""
          width={600}
          height={600}
          className="object-contain"
          priority
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Main Headline (Authentic Rarity Value Proposition with Non-Condensed Serif & Brand Palette) */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]"
        >
          <span className="block">
            Get Off The Ad Performance{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-tealLight drop-shadow-[0_0_25px_rgba(15,227,179,0.35)]">
              Rollercoaster
            </span>
            .
          </span>
          <span className="block mt-2 sm:mt-3 text-white">
            Scale What Actually Drives{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-brand-tealLight via-white to-brand-teal drop-shadow-[0_0_25px_rgba(15,227,179,0.35)]">
              Real Profit
            </span>
            .
          </span>
        </motion.h1>

        {/* Subtitle Paragraph with Clean Bold & Teal Keywords */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 text-sm sm:text-base md:text-lg text-white/85 max-w-2xl leading-relaxed font-normal"
        >
          We help ambitious DTC brands <strong className="text-white font-bold">break through revenue plateaus</strong> and{" "}
          <strong className="text-white font-bold">scale profitably</strong> by aligning Meta Ads, Google PMax, and 30+ monthly AI creative sprints around one single metric: <strong className="text-brand-teal font-bold">real contribution margin</strong>.
        </motion.p>

        {/* Dual CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA (Magenta Glow Pill) */}
          <button
            onClick={onOpenAudit}
            className="w-full sm:w-auto px-8 py-4 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-[#D80064] hover:bg-[#BF0058] text-white shadow-[0_0_25px_rgba(216,0,100,0.5)] border-2 border-[#D80064] hover:border-brand-teal/60 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>SEE WHAT’S POSSIBLE</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary CTA (Teal Outline Pill) */}
          <a
            href="#cases"
            className="w-full sm:w-auto px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white border-2 border-white/20 hover:border-brand-teal transition-all cursor-pointer text-center"
          >
            VIEW ALL CASE STUDIES
          </a>
        </motion.div>

        {/* Authentic Rarity Core Operational Guarantees (Replacing generic NPS / fake badges) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-8 w-full border-t border-white/10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rarityGuarantees.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-brand-teal/40 transition-all duration-300 flex flex-col items-center text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/15 text-brand-teal flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
