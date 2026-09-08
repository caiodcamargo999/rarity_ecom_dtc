"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import DashboardPreview from "@/components/common/DashboardPreview";

interface CaseStudiesSectionProps {
  onOpenAudit: () => void;
}

const carouselCases = [
  {
    id: "meta-1",
    channel: "Meta Ads",
    channelColor: "bg-blue-600/20 border-blue-500/40 text-blue-400",
    tag: "Meta Ads • DTC Brand Scaling",
    title: "8.32x ROAS & $2.95M+ In Verified Revenue",
    image: "/images/cases/meta-ads-case-1.png",
    aspectRatio: "aspect-[16/7]",
    stats: [
      { label: "Total Revenue", value: "$2,959,895" },
      { label: "Ad Spend", value: "$355,659" },
      { label: "Avg ROAS", value: "8.32x" },
      { label: "Purchases", value: "7,641" },
    ],
    summary:
      "We restructured their campaign architecture from fragmented ad sets into a unified broad-targeting MER model with AI-native creative testing. CAC decreased by 34% while order volume scaled 4x.",
    strategy: [
      "Consolidated budget into unified Advantage+ and broad scaling campaigns",
      "Deployed 40+ AI creative variations testing new emotional angles",
      "Managed ad spend strictly against real contribution margin & MER",
    ],
  },
  {
    id: "meta-2",
    channel: "Meta Ads",
    channelColor: "bg-purple-600/20 border-purple-500/40 text-purple-400",
    tag: "Meta Ads • High-Velocity Sprints",
    title: "17.30x ROAS with Rapid Creative Iteration",
    image: "/images/cases/meta-ads-case-2.png",
    aspectRatio: "aspect-[16/7]",
    stats: [
      { label: "Purchase Value", value: "$431,782" },
      { label: "Ad Spend", value: "$24,956" },
      { label: "Avg ROAS", value: "17.30x" },
      { label: "Cost / Checkout", value: "$16.06" },
    ],
    summary:
      "Using our proprietary AI production pipeline, we launched 35 hook variations in 7 days, isolating 3 breakout winning creatives that delivered a record 17.3x return on ad spend.",
    strategy: [
      "Ultra-fast AI video iteration targeting high-intent cold audiences",
      "Separated testing campaigns from scaling budget to protect margins",
      "Optimized post-click presell flow to maximize checkout completion",
    ],
  },
  {
    id: "google-1",
    channel: "Google Ads",
    channelColor: "bg-emerald-600/20 border-emerald-500/40 text-emerald-400",
    tag: "Google Ads • Search & PMax Scale",
    title: "10.86x ROAS & $10.7M+ in Omnichannel Sales",
    image: "/images/cases/google-ads-case-1.png",
    aspectRatio: "aspect-[16/6]",
    stats: [
      { label: "Total Sales", value: "$10.7M+" },
      { label: "Total Cost", value: "$983k" },
      { label: "Conv. Value / Cost", value: "10.86x" },
      { label: "Impressions", value: "97.1M" },
    ],
    summary:
      "Captured high-intent search traffic and scaled Performance Max alongside Meta. Running both channels as one single budget against blended MER created unstoppable cross-channel momentum.",
    strategy: [
      "Search keyword intent clustering with high negative keyword sculpting",
      "Feed-level Performance Max optimization for best-seller margins",
      "Full attribution cross-check against Shopify net bank deposits",
    ],
  },
  {
    id: "google-2",
    channel: "Google Ads",
    channelColor: "bg-teal-600/20 border-teal-500/40 text-teal-400",
    tag: "Google Ads • High-Volume Acquisition",
    title: "9.52x ROAS & $29.83 Cost Per Acquisition",
    image: "/images/cases/google-ads-case-2.png",
    aspectRatio: "aspect-[16/6]",
    stats: [
      { label: "Sales Volume", value: "$989k+" },
      { label: "Ad Spend", value: "$104k" },
      { label: "Cost / Conv", value: "$29.83" },
      { label: "Value / Cost", value: "9.52x" },
    ],
    summary:
      "Optimized bidding strategy for high contribution margin SKU bundles, driving cost per conversion down while keeping ROAS consistently above 9.5x across all quarters.",
    strategy: [
      "Custom Smart Bidding tROAS adjustments aligned with inventory cycle",
      "Audience signal enrichment using top 5% repeat buyer lists",
      "Targeted product listing ad dominance in non-branded categories",
    ],
  },
];

const founderTestimonials = [
  {
    quote:
      "We were struggling for two years to reach that $500k month. After three months with Rarity's MER structure, we hit $1.2M, then $1.3M with healthy contribution margin.",
    name: "Marcus Vance",
    role: "Founder & CEO",
    company: "Peak Nutrition",
    niche: "Supplements",
    metric: "+$800k/mo Net Scale",
    metricSub: "3.8x Blended MER",
    initials: "MV",
    color: "from-blue-500 to-cyan-500",
  },
  {
    quote:
      "Platform ROAS looked fine on Meta reports (2.1x), but our bank account told a different story. Rarity came in, rebuilt our creative testing pipeline and fixed our blend. We doubled spend while increasing profit.",
    name: "Elena Rostova",
    role: "Co-Founder & Head of Brand",
    company: "Lumina Skincare",
    niche: "Beauty & Cosmetics",
    metric: "$45k → $280k/mo",
    metricSub: "Meta + Google Unified",
    initials: "ER",
    color: "from-pink-500 to-rose-500",
  },
  {
    quote:
      "Most agencies give you junior buyers who have never run a real P&L. With Rarity, we talk directly to senior operators who actually understand inventory, contribution margin, and cash flow.",
    name: "David Sterling",
    role: "CEO & Co-Founder",
    company: "Aura DTC Apparel",
    niche: "Fashion & Lifestyle",
    metric: "+145% YoY Profit",
    metricSub: "Zero Agency BS",
    initials: "DS",
    color: "from-emerald-500 to-teal-500",
  },
  {
    quote:
      "Their AI-native creative pipeline gave us 40+ high-converting variations a week at a fraction of traditional production cost. That alone unlocked $3.2M+ in profitable new customer acquisition.",
    name: "Sophia Chen",
    role: "Chief Marketing Officer",
    company: "Terra Living",
    niche: "Home & Wellness",
    metric: "+$3.2M Added Rev",
    metricSub: "AI Creative Pipeline",
    initials: "SC",
    color: "from-purple-500 to-indigo-500",
  },
  {
    quote:
      "We got much more out of what we were already working with. What deterred us earlier was thinking our ad spend was too small. In 90 days, our customer acquisition cost dropped 38%.",
    name: "Thomas Wright",
    role: "Founder & Operator",
    company: "Apex Tactical Gear",
    niche: "Outdoor & Gear",
    metric: "-38% Blended CAC",
    metricSub: "Scaled to $4.5M/yr",
    initials: "TW",
    color: "from-amber-500 to-orange-500",
  },
  {
    quote:
      "We stopped burning cash on dead weeks and guessing games. Having one unified budget across Meta and Google managed against MER changed everything for our cash flow.",
    name: "Arthur Bennett",
    role: "Managing Partner",
    company: "Veloce Labs",
    niche: "Health & Performance",
    metric: "4.1x Blended MER",
    metricSub: "Predictable Cash Flow",
    initials: "AB",
    color: "from-cyan-500 to-blue-600",
  },
];

const stats = [
  { value: "$15M+", label: "Ad Spend Managed" },
  { value: "3.4x", label: "Average Blended MER" },
  { value: "150+", label: "Winning Creative Sprints" },
  { value: "0%", label: "Hidden Spend Percentage" },
];

export default function CaseStudiesSection({ onOpenAudit }: CaseStudiesSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const currentCase = carouselCases[activeSlide];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % carouselCases.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + carouselCases.length) % carouselCases.length);
  };

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/10">
      {/* Background Watermark Symbol */}
      <div className="absolute top-1/4 left-0 -translate-y-1/2 w-[750px] h-[750px] pointer-events-none opacity-15 -z-10 -translate-x-1/3">
        <Image
          src="/images/symbol-logo.png"
          alt=""
          width={750}
          height={750}
          className="object-contain"
        />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl"
        >
          <p className="font-serif italic text-brand-teal text-3xl sm:text-4xl md:text-5xl leading-tight font-normal drop-shadow-[0_2px_15px_rgba(15,227,179,0.35)]">
            Don&apos;t Take Our Word For It.
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mt-3">
            Real Proof. Real Dashboards. <br className="hidden sm:inline" />
            Real Profit Numbers.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-white/85 font-medium leading-relaxed">
            Here is what happens when you stop managing channels in silos and align Meta, Google, and
            AI creative against one single number: <strong>Contribution Margin</strong>.
          </p>
        </motion.div>

        {/* Interactive Case Studies Carousel */}
        <div className="w-full mt-10 sm:mt-12">
          <motion.div
            key={currentCase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-3xl bg-navy-950/80 border border-white/20 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Top Bar of Active Slide */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${currentCase.channelColor}`}
                >
                  {currentCase.tag}
                </span>
                <span className="hidden sm:inline-flex items-center text-xs font-semibold text-brand-teal">
                  <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse mr-1.5" />
                  Verified Agency Account Data
                </span>
              </div>

              {/* Slide Counter & Nav Arrows */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60 font-semibold mr-2">
                  {activeSlide + 1} of {carouselCases.length}
                </span>
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous case study"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next case study"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Case Title */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-6 leading-tight">
              {currentCase.title}
            </h3>

            {/* Metrics KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
              {currentCase.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center"
                >
                  <div className="text-xl sm:text-2xl font-black text-brand-teal tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/70 font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* High-Definition Dashboard Preview */}
            <div className="mt-8 relative group">
              <div
                onClick={() => setSelectedImage(currentCase.id)}
                className="relative w-full rounded-2xl overflow-hidden border border-white/20 bg-black/50 shadow-xl cursor-zoom-in transition-all duration-300 group-hover:border-brand-teal/60"
              >
                <DashboardPreview caseId={currentCase.id} />

                {/* Dark gradient overlay & zoom prompt on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-brand-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                    Expand Dashboard View
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown & Explanation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 pt-6 border-t border-white/10">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-2">
                  The Case Breakdown
                </h4>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed font-medium">
                  {currentCase.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-magenta mb-2">
                  Installed Growth System
                </h4>
                <ul className="space-y-2">
                  {currentCase.strategy.map((item, idx) => (
                    <li key={idx} className="flex items-start text-xs sm:text-sm text-white/85 font-medium">
                      <span className="text-brand-teal font-bold mr-2 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-white/10">
              {carouselCases.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? "w-8 bg-brand-teal" : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-14 p-6 sm:p-8 rounded-3xl bg-navy-950/70 border border-white/15 backdrop-blur-md"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl sm:text-4xl font-extrabold text-brand-teal tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-white/70 font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Founder Testimonials & Case Quotes Header */}
        <div className="text-center mt-20 mb-10">
          <p className="font-serif italic text-brand-teal text-2xl sm:text-3xl font-normal">
            Founder Word of Mouth
          </p>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            What Founders Say When They Own The System
          </h3>
        </div>

        {/* Testimonials & Case Study Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6">
          {founderTestimonials.map((study, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white text-[#001244] shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/40 group"
            >
              {/* Top Tag & Metric Badge */}
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-gray-100">
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 text-[11px] font-bold tracking-wide uppercase">
                  {study.niche}
                </span>
                <div className="text-right">
                  <span className="block text-xs font-black text-[#D80064] tracking-tight">
                    {study.metric}
                  </span>
                  <span className="block text-[10px] text-gray-500 font-semibold">
                    {study.metricSub}
                  </span>
                </div>
              </div>

              {/* Quote Sentence in Box */}
              <div className="my-5 flex-grow">
                <div className="text-gray-400 font-serif text-3xl leading-none select-none mb-1">
                  “
                </div>
                <p className="text-[#001244] text-sm sm:text-[14.5px] font-semibold leading-relaxed">
                  {study.quote}
                </p>
              </div>

              {/* Person Info */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-tr ${study.color} text-white flex items-center justify-center font-black text-xs shadow-sm`}
                >
                  {study.initials}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#001244] leading-tight">
                    {study.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {study.role} • <span className="font-semibold text-gray-700">{study.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 sm:mt-16 text-center"
        >
          <button
            onClick={onOpenAudit}
            className="btn-magenta-glow group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 rounded-full bg-brand-magenta text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:bg-brand-magentaHover hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
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
          <p className="text-white/60 text-xs mt-3 font-medium">
            Join high-growth DTC founders who scaled against MER and real profit.
          </p>
        </motion.div>
      </div>

      {/* Lightbox Modal for Zooming Screenshots */}
      <AnimatePresence>
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-navy-950 border border-white/20 rounded-2xl overflow-hidden p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close zoom"
              >
                ✕
              </button>
              <div className="w-full pt-8 pb-4 px-2 sm:px-4 overflow-y-auto max-h-[80vh]">
                <DashboardPreview caseId={selectedImage} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
