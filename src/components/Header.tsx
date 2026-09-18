"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-center"
        >
          <a
            href="#"
            className="group block transition-transform duration-200 hover:scale-105"
            aria-label="Rarity Agency Home"
          >
            <div className="relative flex items-center justify-center">
              <Image
                src="/images/logo_rarity_azul_sem_fundo_zoom_in.png"
                alt="Rarity Agency"
                width={176}
                height={44}
                className="w-36 sm:w-44 h-auto object-contain"
                priority
              />
            </div>
          </a>
        </motion.div>
      </div>
    </header>
  );
}
