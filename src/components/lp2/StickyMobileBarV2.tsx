"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface StickyMobileBarV2Props {
  onOpenAudit: () => void;
}

export default function StickyMobileBarV2({ onOpenAudit }: StickyMobileBarV2Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero (approx 350px)
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#000820]/95 backdrop-blur-lg border-t border-white/15 md:hidden shadow-2xl"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex flex-col pl-1">
              <span className="text-[10px] uppercase tracking-wider text-brand-teal font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Growth Audit
              </span>
              <span className="text-xs font-bold text-white">Ready to Scale?</span>
            </div>

            <button
              onClick={onOpenAudit}
              className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#D80064] hover:bg-[#BF0058] text-white shadow-[0_0_15px_rgba(216,0,100,0.6)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>See What’s Possible</span>
              <ArrowUpRight className="w-4 h-4 text-brand-teal" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
