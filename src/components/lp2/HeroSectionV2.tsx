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
    <section className="relative pt-14 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#000c2e] via-[#001244] to-[#00103A] overflow-hidden text-center">
      {/* Dynamic Cybernetic Grid Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:22px_22px] sm:[background-size:32px_32px] pointer-events-none opacity-60 z-0" />

      {/* Luminous Mobile-Optimized Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[700px] h-[340px] sm:h-[700px] bg-gradient-to-b from-brand-teal/25 via-brand-teal/10 to-transparent blur-[80px] sm:blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 sm:right-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-gradient-to-b from-[#D80064]/25 via-[#D80064]/10 to-transparent blur-[70px] sm:blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 left-1/4 w-[240px] sm:w-[450px] h-[240px] sm:h-[450px] bg-blue-600/20 blur-[90px] rounded-full pointer-events-none z-0" />

      {/* Background Radiating Wave Lines (High Visibility on Mobile) */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[450px] sm:h-[540px] pointer-events-none opacity-40 sm:opacity-25 select-none z-0">
        <Image
          src="/images/hero-wave-bg.svg"
          alt=""
          fill
          className="object-cover object-bottom"
          priority
        />
      </div>

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
        {/* Main Headline (Authentic Rarity Value Proposition) */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]"
        >
          <span className="block">Get Off The Ad Performance Rollercoaster.</span>
          <span className="relative inline-block mt-2 sm:mt-3">
            <span>Scale What Actually Drives Profit.</span>
            {/* Painted Brush Stroke */}
            <div className="relative w-full h-3.5 sm:h-5 -mt-1 sm:-mt-2 pointer-events-none">
              <Image
                src="/images/brush-accent.svg"
                alt=""
                fill
                className="object-contain"
                priority
              />
            </div>
          </span>
        </motion.h1>

        {/* Subtitle Paragraph with Bold Keywords */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 text-sm sm:text-base md:text-lg text-white/85 max-w-2xl leading-relaxed font-normal"
        >
          We help ambitious DTC brands <strong className="text-white font-bold underline decoration-brand-teal/50 underline-offset-4">break through revenue plateaus</strong> and{" "}
          <strong className="text-white font-bold underline decoration-brand-teal/50 underline-offset-4">scale profitably</strong> by aligning Meta Ads, Google PMax, and 30+ monthly AI creative sprints around one single metric: <strong className="text-brand-teal font-bold">real contribution margin</strong>.
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
