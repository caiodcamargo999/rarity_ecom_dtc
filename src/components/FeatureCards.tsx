"use client";

import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const features = [
  {
    icon: (
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9 text-[#001244]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M8 12h.01" />
        <path d="M12 12h.01" />
        <path d="M16 12h.01" />
      </svg>
    ),
    title: "US business\nhours coverage",
    description: "Real answers, not a\n24-hour lag.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9 text-[#001244]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="7.5" cy="15.5" r="4.5" />
        <path d="m21 3-9.5 9.5" />
        <path d="m15.5 8.5 2 2" />
        <path d="m18 6 2 2" />
      </svg>
    ),
    title: "You keep\nthe keys",
    description: "Your ad account, pixel,\nand lists stay yours.\nAlways.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9 text-[#001244]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
      </svg>
    ),
    title: "You talk to the\nperson running\nyour account",
    description: "not a junior swapped in\nafter month 3.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9 text-[#001244]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="4" />
        <path d="m10 8 5 4-5 4V8z" />
      </svg>
    ),
    title: "Free 15-minute\nvideo call",
    description: "before you commit to\nanything.",
  },
];

export default function FeatureCards() {
  return (
    <div className="w-full max-w-5xl mx-auto mt-12 sm:mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {features.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group min-h-[220px]"
          >
            <div className="mb-4 flex items-center justify-center text-[#001244] group-hover:scale-110 transition-transform duration-200">
              {item.icon}
            </div>
            <h3 className="text-[#001244] font-extrabold text-base sm:text-[17px] leading-tight whitespace-pre-line tracking-tight">
              {item.title}
            </h3>
            <p className="text-[#001244]/75 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line mt-2 font-medium">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
