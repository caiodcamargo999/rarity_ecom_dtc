"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const levers = [
  {
    title: "Performance Media",
    description:
      "Meta & Google, run as one budget against MER — flat fee, never a percentage of your spend.",
  },
  {
    title: "AI-Native Creative",
    description:
      "Ad creative produced through our own AI production pipeline. More variations, faster iteration, a fraction of traditional production cost.",
  },
  {
    title: "UGC Production",
    description:
      "Real creators, real content, briefed and edited to convert. Not raw clips dumped in a folder.",
  },
];

export default function ThreeLeversSection() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Watermark Symbol */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[650px] h-[650px] pointer-events-none opacity-15 -z-10 translate-x-1/3">
        <Image
          src="/images/symbol-logo.png"
          alt=""
          width={650}
          height={650}
          className="object-contain"
        />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="space-y-1 sm:space-y-2"
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
            <span className="block">
              <span className="font-serif italic font-normal text-brand-teal text-[1.15em] mr-2 drop-shadow-[0_2px_15px_rgba(15,227,179,0.35)]">
                One
              </span>
              Team.
            </span>
            <span className="block">
              <span className="font-serif italic font-normal text-brand-teal text-[1.15em] mr-2 drop-shadow-[0_2px_15px_rgba(15,227,179,0.35)]">
                One
              </span>
              Number.
            </span>
            <span className="block">
              <span className="font-serif italic font-normal text-brand-teal text-[1.15em] mr-2 drop-shadow-[0_2px_15px_rgba(15,227,179,0.35)]">
                Three
              </span>
              Levers.
            </span>
          </h2>
        </motion.div>

        {/* 3 Levers Columns */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-8 mt-14 sm:mt-20">
          {levers.map((lever, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              {/* Pill Header */}
              <div className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-full border-[1.5px] border-sky-400/80 bg-blue-900/30 backdrop-blur-sm text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all duration-300 hover:border-brand-teal hover:shadow-[0_0_20px_rgba(15,227,179,0.3)]">
                {lever.title}
              </div>

              {/* Description Paragraph */}
              <p className="mt-5 text-white/85 text-sm sm:text-base font-medium leading-relaxed max-w-xs mx-auto">
                {lever.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
