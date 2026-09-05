"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import FeatureCards from "./FeatureCards";

interface HeroSectionProps {
  onOpenAudit: () => void;
  onOpenVideo: () => void;
}

export default function HeroSection({ onOpenAudit, onOpenVideo }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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

        {/* Video Placeholder with Landscape Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full max-w-3xl mt-8 sm:mt-12 group cursor-pointer relative"
          onClick={onOpenVideo}
        >
          <div className="relative aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-navy-950/80 transition-all duration-300 group-hover:border-brand-teal/60 group-hover:shadow-[0_0_40px_rgba(15,227,179,0.25)]">
            {/* Auto-playing Landscape Video */}
            <video
              ref={videoRef}
              src="/videos/landscape.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Dark gradient overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 pointer-events-none" />

            {/* Center Play/Pause Trigger */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative flex items-center justify-center">
                {!isPlaying && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-xl">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-[#001244] ml-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Video Controls / Badges */}
            <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-6 flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-2 text-xs font-semibold text-white/90">
                <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                Landscape Video Preview
              </div>

              {/* Mute/Unmute Button */}
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/80 transition-all"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>

              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/80 transition-all"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Click to expand badge */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-6 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white/90 group-hover:bg-brand-teal group-hover:text-black transition-colors">
              Click to Expand ↗
            </div>
          </div>
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

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 sm:mt-10"
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

        {/* 4 Feature Cards */}
        <FeatureCards />
      </div>
    </section>
  );
}
