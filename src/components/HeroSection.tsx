"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import FeatureCards from "./FeatureCards";
import VturbPlayer from "./VturbPlayer";

interface HeroSectionProps {
  onOpenAudit: () => void;
  onOpenVideo?: () => void;
  isCtaVisible?: boolean;
  onPlay?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onUnlock?: () => void;
}

export default function HeroSection({
  onOpenAudit,
  isCtaVisible = true,
  onPlay,
  onTimeUpdate,
  onUnlock,
}: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Watermark Symbol */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none opacity-20 -z-10">
        <Image
          src="/images/symbol-logo.png"
          alt=""
          width={800}
          height={800}
          className="object-contain"
          priority
        />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            <span className="block">Get Off The</span>
            <span className="block mt-1">
              Meta{" "}
              <span className="font-serif italic font-normal text-brand-teal text-[1.12em] tracking-normal drop-shadow-[0_2px_15px_rgba(15,227,179,0.3)]">
                Rollercoaster
              </span>
            </span>
          </h1>
        </motion.div>

        {/* VTurb Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full max-w-3xl mt-8 sm:mt-12"
        >
          <VturbPlayer
            delaySeconds={60}
            onPlay={onPlay}
            onTimeUpdate={onTimeUpdate}
            onUnlock={onUnlock}
          />
        </motion.div>

        {/* Subtitle Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 max-w-2xl text-base sm:text-lg text-white/90 font-medium leading-relaxed"
        >
          Media, creative, and UGC team that runs your growth against MER and real profit — not platform
          ROAS. Built for DTC brands doing $1M–$10M/year who are done being burned by agencies.
        </motion.p>

        {/* Primary CTA Button (Appears 1 min after video play or if unlocked) */}
        <AnimatePresence>
          {isCtaVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.25 }}
              className="mt-8 sm:mt-10 vsl-delayed-cta"
            >
              <button
                onClick={onOpenAudit}
                className="btn-magenta-glow group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-4 rounded-full bg-brand-magenta text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:bg-brand-magentaHover hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
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
          )}
        </AnimatePresence>

        {/* 4 Feature Cards */}
        <FeatureCards />
      </div>
    </section>
  );
}
