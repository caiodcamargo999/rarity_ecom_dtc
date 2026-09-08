"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const reviewsData = [
  {
    id: 1,
    name: "Adam Hutton",
    role: "Senior Manager Digital Growth, Benchmade",
    logo: "/images/pilothouse/logo-benchmade.svg",
    photo: "/images/pilothouse/adam-hutton.webp",
    quote:
      "Since Rarity started managing our Meta campaigns, we've seen Meta revenue increase by over 200%. Our new customer CPA decreased by 25%, and our new customer ROAS increased by 48%. Working with Rarity feels like an extension of our team rather than like an outside agency where we can really lean on them, give them a call, and we're able to just work really well together in that way.",
  },
  {
    id: 2,
    name: "Rick Cadotte",
    role: "Head of Growth at Four Sigmatic",
    logo: "/images/pilothouse/logo-foursigmatic.svg",
    photo: "/images/pilothouse/rick-cadotte.webp",
    quote:
      "What's unique about Rarity is it works more like an internal team than it does an external team. Anyone considering working with Rarity: the retention rate is ridiculously high, and they know the brands they work with very well because they've been with them for years. That's the differentiator with Rarity.",
  },
  {
    id: 3,
    name: "Steph Chen",
    role: "Co-founder of Anyday",
    logo: "/images/pilothouse/logo-anyday.svg",
    photo: "/images/pilothouse/steph-chen.webp",
    quote:
      "The level of thoroughness and speed with which Rarity executes feedback is unreal. They're in tune with what's going on with our consumers, they read the reviews, they see the news, they subscribe to our emails. I really feel quite astounded at the level of team integration into the Anyday team that Rarity provides.",
  },
];

export default function ReviewsSectionV2() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
  };

  const current = reviewsData[currentIndex];

  return (
    <section id="reviews" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#121212] overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#FFD100] uppercase block mb-2">
            REVIEWS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Partner perspective
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              {/* Client Photo / Headshot */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#333333] shadow-2xl z-10 -mb-20 sm:-mb-24 bg-[#333333]">
                <Image
                  src={current.photo}
                  alt={current.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Dark Rounded Container (Pilothouse Card) */}
              <div className="w-full bg-[#333333] rounded-[2.5rem] sm:rounded-[3rem] pt-24 sm:pt-28 pb-10 sm:pb-12 px-6 sm:px-12 text-center shadow-2xl border border-white/5">
                <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-normal italic max-w-2xl mx-auto">
                  &ldquo;{current.quote}&rdquo;
                </p>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {current.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 italic mt-0.5">
                    {current.role}
                  </p>

                  {/* Brand Logo */}
                  <div className="relative h-6 sm:h-8 w-32 mt-4">
                    <Image
                      src={current.logo}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 max-w-xs mx-auto">
            <button
              onClick={prevReview}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFD100] text-white hover:text-[#121212] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {reviewsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? "w-7 bg-[#FFD100]"
                      : "w-2.5 bg-[#c6c6c6] hover:bg-white"
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFD100] text-white hover:text-[#121212] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
