"use client";

import { motion } from "framer-motion";

interface AuditProcessSectionProps {
  onOpenAudit: () => void;
}

const steps = [
  {
    number: "1",
    title: "Apply",
    description: "2-minute form, no cost.",
  },
  {
    number: "2",
    title: "Intro call",
    description:
      "15–20 minutes, we learn your numbers (CAC, MER, margin, current spend).",
  },
  {
    number: "3",
    title: "We audit\nyour account",
    description:
      "Media, creative, and funnel checked against your real P&L, not platform metrics. 2–4 business days.",
  },
  {
    number: "4",
    title: "Strategy call",
    description:
      "We walk you through exactly what we found and what we'd change first.",
  },
  {
    number: "5",
    title: "If it's a fit,\nwe start",
    description:
      "If it's not, we tell you — no pressure, no hard close.",
  },
];

export default function AuditProcessSection({ onOpenAudit }: AuditProcessSectionProps) {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* White Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-[28px] sm:rounded-[36px] md:rounded-[44px] p-6 sm:p-10 md:p-14 shadow-2xl relative text-[#001244]"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#001244] leading-tight">
              The{" "}
              <span className="font-serif italic font-normal text-brand-magenta text-[1.12em] tracking-normal">
                Free
              </span>
              <br />
              Growth Audit
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#001244]/80 mt-2 sm:mt-3">
              (What Actually Happens)
            </p>
          </div>

          {/* Steps Timeline Desktop / Tablet */}
          <div className="relative mt-12 sm:mt-16">
            {/* Connecting Horizontal Line (Desktop) */}
            <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-[#D80064]/40 -z-0" />

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-6 lg:gap-3 relative z-10">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Number Badge */}
                  <div className="w-12 h-12 rounded-full bg-[#001244] text-white font-extrabold text-lg flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-brand-magenta transition-all duration-300 ring-4 ring-white">
                    {step.number}
                  </div>

                  {/* Step Title */}
                  <h3 className="text-[#001244] font-extrabold text-base sm:text-[17px] mt-4 leading-tight whitespace-pre-line">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-[#001244]/75 text-xs sm:text-[13px] leading-relaxed mt-2 font-medium">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Button inside White Card */}
          <div className="flex justify-center mt-12 sm:mt-16">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
