"use client";

import { useState } from "react";
import HeaderV2 from "@/components/lp2/HeaderV2";
import HeroSectionV2 from "@/components/lp2/HeroSectionV2";
import RarityAdCarouselV2 from "@/components/lp2/RarityAdCarouselV2";
import CreativeShowcaseSection from "@/components/CreativeShowcaseSection";
import GrowthProtocolSectionV2 from "@/components/lp2/GrowthProtocolSectionV2";
import ServicesGridV2 from "@/components/lp2/ServicesGridV2";
import ScaleCtaSectionV2 from "@/components/lp2/ScaleCtaSectionV2";
import AuditModal from "@/components/AuditModal";

export default function RarityLandingPage02() {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const handleOpenAudit = () => setIsAuditModalOpen(true);
  const handleCloseAudit = () => setIsAuditModalOpen(false);

  return (
    <main className="min-h-screen bg-[#001244] text-white selection:bg-[#D80064] selection:text-white relative font-sans">
      {/* 1. Sticky Dark Blue Header */}
      <HeaderV2 onOpenAudit={handleOpenAudit} />

      {/* 2. Hero Section (Headline + Painted Brush + Wave BG + Dual Action Buttons + NPS + Badges) */}
      <HeroSectionV2 onOpenAudit={handleOpenAudit} />

      {/* 3. Rarity Ad Creative & Campaign Cases Carousel */}
      <RarityAdCarouselV2 onOpenAudit={handleOpenAudit} />

      {/* 3.1 Proprietary Creative Studio 3D Showcase */}
      <CreativeShowcaseSection onOpenAudit={handleOpenAudit} />

      {/* 4. The Rarity 4-Step Growth Protocol & Agency Comparison */}
      <GrowthProtocolSectionV2 onOpenAudit={handleOpenAudit} />

      {/* 5. What We Do (Services Grid with Custom Icons) */}
      <ServicesGridV2 />

      {/* 6. Ready to Scale (CTA Banner + Official Badges) */}
      <ScaleCtaSectionV2 onOpenAudit={handleOpenAudit} />

      {/* 7. Minimalist Footer */}
      <footer className="py-8 bg-[#000820] border-t border-white/10 text-center relative z-10">
        <p className="font-mono text-xs sm:text-sm text-white/60 tracking-wider">
          Rarity 2026 - all rights reserved
        </p>
      </footer>

      {/* Free Growth Audit Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={handleCloseAudit}
      />
    </main>
  );
}

