"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Maximize2, X } from "lucide-react";
import Image from "next/image";

interface CreativeShowcaseSectionProps {
  onOpenAudit: () => void;
}

type FormatType = "feed" | "story";

interface CreativeItem {
  id: string;
  title: string;
  brand: string;
  niche: string;
  angle: string;
  image: string;
  aspectRatio: string;
  tag: string;
}

const feedCreatives: CreativeItem[] = [
  {
    id: "feed-1",
    title: "Approve Official • Liquida Drops",
    brand: "Approve Official",
    niche: "Streetwear DTC",
    angle: "Scarcity & Clearance Urgency Hook",
    image: "/images/creatives/feed/FEED-APPROVE-LIQUIDA.jpg",
    aspectRatio: "aspect-square",
    tag: "High-Volume Drop",
  },
  {
    id: "feed-2",
    title: "West Coast • 1 Year Anniversary",
    brand: "West Coast Footwear",
    niche: "Men's Footwear & Leather",
    angle: "Milestone Hook & Exclusive Offer",
    image: "/images/creatives/feed/FEED-1-ANO.jpg",
    aspectRatio: "aspect-square",
    tag: "Brand Milestone",
  },
  {
    id: "feed-3",
    title: "Zudi • Performance Collection",
    brand: "Zudi Apparel",
    niche: "DTC Lifestyle & Activewear",
    angle: "High-Contrast Product Aesthetic",
    image: "/images/creatives/feed/feed-zudi.jpg",
    aspectRatio: "aspect-square",
    tag: "Product Focus",
  },
  {
    id: "feed-4",
    title: "Kings Sneakers • Street Bundle",
    brand: "Kings Sneakers",
    niche: "Sneakers & Street Fashion",
    angle: "Direct-Response Bundle Offer",
    image: "/images/creatives/feed/feed-03.png",
    aspectRatio: "aspect-square",
    tag: "Offer Direct",
  },
  {
    id: "feed-5",
    title: "Free Shipping Frictionless Hook",
    brand: "Scale DTC Brand",
    niche: "E-Commerce Performance",
    angle: "Zero-Friction Conversion Trigger",
    image: "/images/creatives/feed/feed-frete-gratis.png",
    aspectRatio: "aspect-square",
    tag: "Frictionless CTA",
  },
  {
    id: "feed-6",
    title: "Premium Footwear Lifestyle",
    brand: "Leather Craft DTC",
    niche: "Fashion & Footwear",
    angle: "Premium Styling & Detail Zoom",
    image: "/images/creatives/feed/feed-01.jpg",
    aspectRatio: "aspect-square",
    tag: "Premium Lookbook",
  },
  {
    id: "feed-7",
    title: "Direct Conversion Ad Unit",
    brand: "Performance DTC",
    niche: "Multi-SKU E-com",
    angle: "CTR Optimization & Clear CTA",
    image: "/images/creatives/feed/feed-ads.png",
    aspectRatio: "aspect-square",
    tag: "Direct Conversion",
  },
  {
    id: "feed-8",
    title: "Urban Collection Seasonal Launch",
    brand: "Urban DTC",
    niche: "Apparel Collection",
    angle: "Trendy Lifestyle Framing",
    image: "/images/creatives/feed/feed-02.png",
    aspectRatio: "aspect-square",
    tag: "Collection Drop",
  },
];

const storyCreatives: CreativeItem[] = [
  {
    id: "story-1",
    title: "Kings Sneakers • Liquida Story",
    brand: "Kings Sneakers",
    niche: "Streetwear & Sneakers",
    angle: "Full-Screen Flash Sale & Swipe-Up",
    image: "/images/creatives/story/story-KINGS-LIQUIDA.jpg",
    aspectRatio: "aspect-[9/16]",
    tag: "Story Conversion",
  },
  {
    id: "story-2",
    title: "West Coast • Esquenta Black Friday",
    brand: "West Coast",
    niche: "Footwear DTC",
    angle: "High-Hype Pre-Black Friday Hook",
    image: "/images/creatives/story/story-esquenta-black-west-1080x1920.jpg",
    aspectRatio: "aspect-[9/16]",
    tag: "Q4 High Hype",
  },
  {
    id: "story-3",
    title: "Crafted Boots • Collection Angle",
    brand: "Footwear Specialist",
    niche: "Men's Leather Boots",
    angle: "Material Durability & Craftsmanship",
    image: "/images/creatives/story/story-boots-02.jpg",
    aspectRatio: "aspect-[9/16]",
    tag: "Craft & Detail",
  },
  {
    id: "story-4",
    title: "Father's Day Special Campaign",
    brand: "Lifestyle DTC",
    niche: "Seasonal Gifting",
    angle: "Emotional Hook & Gift Guide",
    image: "/images/creatives/story/story-dia-dos-pais.jpg",
    aspectRatio: "aspect-[9/16]",
    tag: "Seasonal Gifting",
  },
  {
    id: "story-5",
    title: "Flash Liquidação 28/02",
    brand: "DTC Apparel",
    niche: "Clearance Sprint",
    angle: "Countdown & Clearance Urgency",
    image: "/images/creatives/story/STORIE--GERAL-LIQUIDA-2802.jpg",
    aspectRatio: "aspect-[9/16]",
    tag: "Flash Clearance",
  },
  {
    id: "story-6",
    title: "Holiday Edition • Natal Special",
    brand: "Scale DTC",
    niche: "Q4 Holiday Gifting",
    angle: "Holiday Volume & Gift Motivation",
    image: "/images/creatives/story/STORY-NATAL.jpg",
    aspectRatio: "aspect-[9/16]",
    tag: "Holiday Edition",
  },
  {
    id: "story-7",
    title: "Free Shipping Mobile Hook",
    brand: "Direct Response",
    niche: "Mobile Shoppers",
    angle: "Instant Gratification Promo",
    image: "/images/creatives/story/story-frete-gratis.png",
    aspectRatio: "aspect-[9/16]",
    tag: "Mobile Hook",
  },
];

export default function CreativeShowcaseSection({ onOpenAudit }: CreativeShowcaseSectionProps) {
  const [selectedFormat, setSelectedFormat] = useState<FormatType>("feed");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [selectedCreative, setSelectedCreative] = useState<CreativeItem | null>(null);

  const creatives = selectedFormat === "feed" ? feedCreatives : storyCreatives;
  const total = creatives.length;

  // Reset index when format changes
  const handleFormatChange = (format: FormatType) => {
    setSelectedFormat(format);
    setCurrentIndex(0);
  };

  // Autoplay
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3800);
    return () => clearInterval(timer);
  }, [isAutoPlay, total]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  // Calculate position offset for 3D carousel
  const getCardStyle = (index: number) => {
    const diff = (index - currentIndex + total) % total;
    let position = diff;
    if (diff > total / 2) {
      position = diff - total;
    }

    if (position === 0) {
      // Active center card
      return {
        zIndex: 30,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        translateX: 0,
        filter: "brightness(1)",
        pointerEvents: "auto" as const,
      };
    } else if (position === 1) {
      // Immediate right card
      return {
        zIndex: 20,
        opacity: 0.75,
        scale: 0.86,
        rotateY: -22,
        translateX: selectedFormat === "feed" ? "68%" : "55%",
        filter: "brightness(0.7)",
        pointerEvents: "auto" as const,
      };
    } else if (position === -1) {
      // Immediate left card
      return {
        zIndex: 20,
        opacity: 0.75,
        scale: 0.86,
        rotateY: 22,
        translateX: selectedFormat === "feed" ? "-68%" : "-55%",
        filter: "brightness(0.7)",
        pointerEvents: "auto" as const,
      };
    } else if (position === 2) {
      // Far right
      return {
        zIndex: 10,
        opacity: 0.35,
        scale: 0.72,
        rotateY: -35,
        translateX: selectedFormat === "feed" ? "125%" : "105%",
        filter: "brightness(0.4)",
        pointerEvents: "none" as const,
      };
    } else if (position === -2) {
      // Far left
      return {
        zIndex: 10,
        opacity: 0.35,
        scale: 0.72,
        rotateY: 35,
        translateX: selectedFormat === "feed" ? "-125%" : "-105%",
        filter: "brightness(0.4)",
        pointerEvents: "none" as const,
      };
    } else {
      // Hidden cards
      return {
        zIndex: 0,
        opacity: 0,
        scale: 0.6,
        rotateY: 0,
        translateX: position > 0 ? "180%" : "-180%",
        filter: "brightness(0.2)",
        pointerEvents: "none" as const,
      };
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#000820] relative overflow-hidden border-t border-b border-white/10">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-[#D80064]/20 via-[#0052FF]/20 to-[#0FE3B3]/15 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0FE3B3]/10 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#D80064]/15 rounded-full blur-[100px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#0FE3B3]/30 backdrop-blur-md mb-4"
          >
            <Sparkles className="w-4 h-4 text-[#0FE3B3]" />
            <span className="text-[#0FE3B3] text-xs font-bold uppercase tracking-widest">
              Proprietary Creative Studio
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight"
          >
            Ad Creatives Engineered For{" "}
            <span className="bg-gradient-to-r from-[#0FE3B3] via-[#38bdf8] to-[#D80064] bg-clip-text text-transparent italic font-serif font-normal">
              Breakout Scale
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/70 text-sm sm:text-base md:text-lg mt-3.5 max-w-2xl mx-auto leading-relaxed"
          >
            We combine high-level direct-response copy, visual hooks, and platform-native formats to produce ad assets that stop the scroll and lower your blended CAC.
          </motion.p>

          {/* Format Switcher Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-7 p-1.5 rounded-full bg-white/5 border border-white/10 w-fit mx-auto backdrop-blur-xl shadow-lg"
          >
            <button
              onClick={() => handleFormatChange("feed")}
              className={`relative px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                selectedFormat === "feed"
                  ? "text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {selectedFormat === "feed" && (
                <motion.div
                  layoutId="activeFormatPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D80064] to-[#0052FF]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm border border-current"></span>
                Feed Ads (1:1 Square)
              </span>
            </button>

            <button
              onClick={() => handleFormatChange("story")}
              className={`relative px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                selectedFormat === "story"
                  ? "text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {selectedFormat === "story" && (
                <motion.div
                  layoutId="activeFormatPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D80064] to-[#0052FF]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="w-2 h-3 rounded-sm border border-current"></span>
                Stories &amp; Reels (9:16)
              </span>
            </button>
          </motion.div>
        </div>

        {/* 3D Carousel Stage */}
        <div
          className="relative max-w-5xl mx-auto h-[380px] sm:h-[460px] md:h-[520px] flex items-center justify-center my-6"
          style={{ perspective: "1200px" }}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {creatives.map((item, index) => {
            const style = getCardStyle(index);
            const isCenter = index === currentIndex;

            return (
              <motion.div
                key={item.id}
                animate={style}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                  mass: 0.8,
                }}
                onClick={() => {
                  if (isCenter) {
                    setSelectedCreative(item);
                  } else {
                    setCurrentIndex(index);
                  }
                }}
                className={`absolute cursor-pointer transition-shadow select-none ${
                  selectedFormat === "feed"
                    ? "w-[260px] sm:w-[340px] md:w-[410px] aspect-square"
                    : "w-[180px] sm:w-[240px] md:w-[280px] aspect-[9/16]"
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 relative group shadow-2xl ${
                    isCenter
                      ? "border-white/40 ring-4 ring-[#0FE3B3]/20 shadow-[#00103A]/80 shadow-2xl"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  {/* Creative Image */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 300px, 450px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    priority={index < 3}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-[#000820]/90 via-transparent to-black/20 transition-opacity duration-300 ${
                      isCenter ? "opacity-90" : "opacity-60 group-hover:opacity-80"
                    }`}
                  />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 rounded-full bg-[#00103A]/80 border border-white/20 text-white font-bold text-[10px] sm:text-xs backdrop-blur-md">
                      {item.tag}
                    </span>
                    {isCenter && (
                      <span className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors shadow">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Bottom Info for Center Card */}
                  {isCenter && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 text-left">
                      <div className="flex items-center gap-1.5 text-[#0FE3B3] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0FE3B3]"></span>
                        {item.brand} • {item.niche}
                      </div>
                      <h4 className="text-white text-sm sm:text-base md:text-lg font-extrabold leading-snug line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-white/75 text-[11px] sm:text-xs mt-1 line-clamp-1">
                        🎯 {item.angle}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute -left-2 sm:left-2 md:left-6 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#00103A]/80 border border-white/20 text-white hover:bg-white/20 hover:border-[#0FE3B3] hover:text-[#0FE3B3] flex items-center justify-center transition-all shadow-xl backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Previous Creative"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute -right-2 sm:right-2 md:right-6 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#00103A]/80 border border-white/20 text-white hover:bg-white/20 hover:border-[#0FE3B3] hover:text-[#0FE3B3] flex items-center justify-center transition-all shadow-xl backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Next Creative"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Carousel Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {creatives.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentIndex
                  ? "w-8 bg-gradient-to-r from-[#0FE3B3] to-[#38bdf8]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedCreative && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCreative(null)}
              className="fixed inset-0 bg-[#000820]/90 backdrop-blur-xl cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#00103A] border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl z-10 flex flex-col md:flex-row gap-6 overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCreative(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Creative Image Preview */}
              <div
                className={`relative w-full md:w-1/2 rounded-2xl overflow-hidden border border-white/20 shrink-0 ${
                  selectedFormat === "feed" ? "aspect-square" : "aspect-[9/16] max-h-[460px]"
                }`}
              >
                <Image
                  src={selectedCreative.image}
                  alt={selectedCreative.title}
                  fill
                  className="object-cover object-center"
                />
              </div>

              {/* Details and CTA */}
              <div className="flex-1 flex flex-col justify-between pt-2">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#0FE3B3]/20 border border-[#0FE3B3]/40 text-[#0FE3B3] text-xs font-bold uppercase tracking-wider">
                    {selectedCreative.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-3">
                    {selectedCreative.title}
                  </h3>

                  <div className="space-y-2.5 mt-5 text-sm">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white/50 text-xs uppercase font-bold block">
                        Brand / Client
                      </span>
                      <span className="text-white font-semibold">
                        {selectedCreative.brand} ({selectedCreative.niche})
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white/50 text-xs uppercase font-bold block">
                        Direct-Response Angle
                      </span>
                      <span className="text-[#0FE3B3] font-semibold">
                        {selectedCreative.angle}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white/50 text-xs uppercase font-bold block">
                        Production Format
                      </span>
                      <span className="text-white font-mono">
                        {selectedFormat === "feed" ? "1:1 Square Feed (1080x1080)" : "9:16 Vertical Story / Reels (1080x1920)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-white/70 text-xs mb-3">
                    Want high-converting creative sprints tailored specifically to your DTC brand?
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCreative(null);
                      onOpenAudit();
                    }}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D80064] to-[#0052FF] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Claim Free Growth Audit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
