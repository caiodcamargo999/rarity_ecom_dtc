"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

interface HeaderV2Props {
  onOpenAudit?: () => void;
}

export default function HeaderV2({ onOpenAudit }: HeaderV2Props = {}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#000c2e]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5"
          : "bg-[#00103A] border-b border-white/5 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {/* Centered Rarity Logo */}
        <a
          href="#"
          className="group block transition-transform duration-200 hover:scale-105"
          aria-label="Rarity Agency Home"
        >
          <div className="relative w-36 sm:w-44 h-8 sm:h-10">
            <Image
              src="/images/logo_rarity_branco_sem_fundo_zoom_in.png"
              alt="Rarity Agency"
              fill
              className="object-contain"
              priority
            />
          </div>
        </a>
      </div>
    </header>
  );
}
