"use client";

import { motion } from "framer-motion";

const partners = [
  { name: "Meta Business Partner", badge: "Verified Meta Partner", tag: "Advantage+ & CBO Scaling" },
  { name: "Google Premier Partner 2026", badge: "Google Partner Premier", tag: "Search & Performance Max" },
  { name: "Shopify Plus Ecosystem", badge: "Shopify Plus", tag: "DTC Checkout & CRO" },
  { name: "TikTok Ads Partner", badge: "TikTok For Business", tag: "Spark Ads & Creative Sprints" },
  { name: "Triple Whale / Northbeam", badge: "Attribution Partner", tag: "Blended MER & Data Modeling" },
  { name: "Server-Side CAPI & GTM", badge: "Tracking Architecture", tag: "First-Party Data Signals" },
];

export default function PartnerLogosV2() {
  return (
    <section className="relative py-10 bg-[#000820] border-y border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold tracking-widest text-white/50 uppercase mb-8">
          Trusted Ecosystem & Platform Certifications
        </p>

        {/* Partner Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-center justify-center">
          {partners.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-brand-teal/40 transition-all duration-300 text-center"
            >
              <span className="text-sm font-bold text-white group-hover:text-brand-teal transition-colors">
                {partner.badge}
              </span>
              <span className="text-[11px] text-white/50 mt-1 font-medium group-hover:text-white/75 transition-colors">
                {partner.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
