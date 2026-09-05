"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full py-10 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-navy-950/60 backdrop-blur-sm text-center">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="relative w-28 h-8 opacity-80 hover:opacity-100 transition-opacity">
          <Image
            src="/images/logo_rarity_branco_sem_fundo_zoom_in.png"
            alt="Rarity Agency"
            fill
            className="object-contain"
          />
        </div>

        <p className="text-white/60 text-xs sm:text-sm font-medium">
          © {new Date().getFullYear()} Rarity Agency. All rights reserved.
        </p>

        <p className="text-white/40 text-[11px] max-w-md leading-relaxed">
          Built for high-growth DTC brands doing $1M–$10M/year. Performance Media • AI Creative • UGC Production.
        </p>
      </div>
    </footer>
  );
}
