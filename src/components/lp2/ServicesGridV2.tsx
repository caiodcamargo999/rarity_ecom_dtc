"use client";

import Image from "next/image";

const servicesList = [
  {
    icon: "/images/pilothouse/strategy.png",
    title: "Growth Strategy",
    description: "Align media, creative, and data to scale contribution margin & real profit",
  },
  {
    icon: "/images/pilothouse/meta-ads.svg",
    title: "Meta Advertising",
    description: "Consolidated Advantage+ architectures, broad targeting, and algorithmic scaling",
  },
  {
    icon: "/images/pilothouse/google-ads.svg",
    title: "Google & PMax Ads",
    description: "High-intent non-branded search dominance and margin-tiered shopping campaigns",
  },
  {
    icon: "/images/pilothouse/tiktok-ads.svg",
    title: "TikTok Advertising",
    description: "Capture attention with viral native creative and high-converting hooks",
  },
  {
    icon: "/images/pilothouse/creative.svg",
    title: "AI Creative & UGC Studio",
    description: "Deploy 30+ iterative hook tests and emotional angles every single month",
  },
  {
    icon: "/images/pilothouse/cro.svg",
    title: "Conversion Rate Optimization",
    description: "Landing page engineering and offer optimization to maximize every click",
  },
];

export default function ServicesGridV2() {
  return (
    <section id="services" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#00103A] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs sm:text-sm font-extrabold tracking-widest text-brand-teal uppercase block mb-2">
            SERVICES &amp; CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            What we do
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            We create the strategy to align media, creative, and data to scale what matters.
          </p>
        </div>

        {/* 6 Services Grid (3x2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesList.map((service, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#000c2e] border border-white/10 hover:border-brand-teal/50 hover:shadow-[0_10px_30px_rgba(15,227,179,0.15)] transition-all duration-300 group"
            >
              {/* Service Icon */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src={service.icon}
                  alt={service.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-teal transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
