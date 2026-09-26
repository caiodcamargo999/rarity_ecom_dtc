"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from "lucide-react";

export default function FooterV2() {
  return (
    <footer className="bg-[#000820] border-t border-white/10 text-white/70 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Logo & Mission */}
          <div className="space-y-4">
            <div className="relative w-36 h-9">
              <Image
                src="/images/logo_rarity_branco_sem_fundo_zoom_in.png"
                alt="Rarity Agency"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              We acquire customers at scale for high growth DTC companies while driving profitable returns on millions of dollars in ad spend.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#cases" className="text-white hover:text-brand-teal transition-colors">
                  Ad Cases
                </a>
              </li>
              <li>
                <a href="#performance" className="text-white hover:text-brand-teal transition-colors">
                  Client Results
                </a>
              </li>
              <li>
                <a href="#services" className="text-white hover:text-brand-teal transition-colors">
                  Services
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-2 text-sm text-white/80">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Direct Contact
            </h4>
            <p className="font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-teal" />
              +1 (800) 963-RARITY
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-teal" />
              <a
                href="mailto:partnerships@rarityagency.com"
                className="hover:text-brand-teal transition-colors"
              >
                partnerships@rarityagency.com
              </a>
            </p>
            <p className="text-xs text-white/60 pt-1 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
              Miami, FL &bull; São Paulo &bull; Global Remote
            </p>
          </div>

          {/* Col 4: Social & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-teal text-white hover:text-[#00103A] flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-teal text-white hover:text-[#00103A] flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-brand-teal text-white hover:text-[#00103A] flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            <p className="text-xs text-white/60">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy &bull; Terms of Service
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 text-center text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Rarity Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
