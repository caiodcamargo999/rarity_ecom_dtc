"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ThreeLeversSection from "@/components/ThreeLeversSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import CreativeShowcaseSection from "@/components/CreativeShowcaseSection";
import AuditProcessSection from "@/components/AuditProcessSection";
import Footer from "@/components/Footer";
import AuditModal from "@/components/AuditModal";
import VideoModal from "@/components/VideoModal";

export default function Home() {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleOpenAudit = () => setIsAuditModalOpen(true);
  const handleCloseAudit = () => setIsAuditModalOpen(false);

  const handleOpenVideo = () => setIsVideoModalOpen(true);
  const handleCloseVideo = () => setIsVideoModalOpen(false);

  return (
    <main className="min-h-screen rarity-bg relative selection:bg-[#D80064] selection:text-white">
      {/* Top Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <HeroSection
        onOpenAudit={handleOpenAudit}
        onOpenVideo={handleOpenVideo}
      />

      {/* The Problem Section */}
      <ProblemSection onOpenAudit={handleOpenAudit} />

      {/* One Team. One Number. Three Levers. */}
      <ThreeLeversSection />

      {/* Case Studies & Testimonials */}
      <CaseStudiesSection onOpenAudit={handleOpenAudit} />

      {/* Real Client Ad Creatives 3D Showcase */}
      <CreativeShowcaseSection onOpenAudit={handleOpenAudit} />

      {/* The Free Growth Audit (What Actually Happens) */}
      <AuditProcessSection onOpenAudit={handleOpenAudit} />

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={handleCloseAudit}
      />
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideo}
        onOpenAudit={handleOpenAudit}
      />
    </main>
  );
}
