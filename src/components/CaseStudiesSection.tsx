"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface CaseStudiesSectionProps {
  onOpenAudit: () => void;
}

const caseStudies = [
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
  { value: "$100M+", label: "Ad Spend Managed" },
  { value: "3.4x", label: "Average Blended MER" },
  { value: "400+", label: "Winning Creative Sprints" },
  { value: "0%", label: "Hidden Spend Percentage" },
];

export default function CaseStudiesSection({ onOpenAudit }: CaseStudiesSectionProps) {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-white/10">
      {/* Background Watermark Symbol */}
      <div className="absolute top-1/3 left-0 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-15 -z-10 -translate-x-1/3">
        <Image
          src="/images/symbol-logo.png"
          alt=""
          width={700}
          height={700}
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
            Real DTC Brands. <br className="hidden sm:inline" />
            Real Profit Numbers.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-white/85 font-medium leading-relaxed">
            The most useful proof for you isn&apos;t a 9-figure giant with a budget you don&apos;t have —
            it&apos;s a founder who was stuck where you are and broke through to sustainable, profitable scale.
          </p>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-navy-950/70 border border-white/15 backdrop-blur-md"
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

        {/* Testimonials & Case Study Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 mt-10 sm:mt-12">
          {caseStudies.map((study, idx) => (
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
            Join 400+ DTC founders who scaled against MER and real profit.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
