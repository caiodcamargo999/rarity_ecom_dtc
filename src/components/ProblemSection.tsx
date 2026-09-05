"use client";

import { motion } from "framer-motion";

interface ProblemSectionProps {
  onOpenAudit: () => void;
}

export default function ProblemSection({ onOpenAudit }: ProblemSectionProps) {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Section Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-serif italic text-brand-teal text-3xl sm:text-4xl md:text-5xl lg:text-[44px] leading-tight font-normal drop-shadow-[0_2px_15px_rgba(15,227,179,0.35)]">
            The Problem Isn&apos;t Your Ads.
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mt-3 sm:mt-4">
            <span className="block">It&apos;s That Nobody Owns The</span>
            <span className="block mt-1">Number That Matters.</span>
          </h2>
        </motion.div>

        {/* Narrative Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 sm:mt-10 max-w-3xl text-base sm:text-lg text-white/90 font-medium leading-relaxed"
        >
          Your media buyer is chasing ROAS. Your creative vendor is chasing &ldquo;engaging.&rdquo;
          Nobody&apos;s looking at contribution margin, and nobody&apos;s in the same room. Platform ROAS
          looks fine on the report. Your bank account tells a different story — a couple of good days,
          then a dead week, then you&apos;re back to guessing. That&apos;s not a traffic problem.
          That&apos;s a structure problem.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 sm:mt-12"
        >
          <button
            onClick={onOpenAudit}
            className="btn-magenta-glow group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 rounded-full bg-brand-magenta text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:bg-brand-magentaHover hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
          >
            <span>GET YOUR FREE GROWTH AUDIT</span>
            <svg
              className="w-4 h-4 ml-2.5 transition-transform duration-200 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
