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
import { pauseAllVturbVideos } from "@/components/VturbPlayer";
import { useVslDelay } from "@/hooks/useVslDelay";

export default function Home() {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // 1-minute (60 seconds) delay from video play
  const { isUnlocked, startPlayback, handleTimeUpdate, unlock } = useVslDelay({
    delaySeconds: 60,
  });

  const handleOpenAudit = () => {
    pauseAllVturbVideos();
    setIsAuditModalOpen(true);
  };
  const handleCloseAudit = () => setIsAuditModalOpen(false);

  const handleOpenVideo = () => setIsVideoModalOpen(true);
  const handleCloseVideo = () => setIsVideoModalOpen(false);

  return (
    <main className="min-h-screen rarity-bg relative selection:bg-[#D80064] selection:text-white">
      {/* Top Navigation Bar */}
      <Header />

      {/* Hero Section with VTurb Video & Delayed CTA Button */}
      <HeroSection
        onOpenAudit={handleOpenAudit}
        onOpenVideo={handleOpenVideo}
        isCtaVisible={isUnlocked}
        onPlay={startPlayback}
        onTimeUpdate={handleTimeUpdate}
        onUnlock={unlock}
      />

      {/* The Problem Section */}
      <ProblemSection
        onOpenAudit={handleOpenAudit}
        isCtaVisible={isUnlocked}
      />

      {/* One Team. One Number. Three Levers. */}
      <ThreeLeversSection />

      {/* Case Studies & Testimonials */}
      <CaseStudiesSection
        onOpenAudit={handleOpenAudit}
        isCtaVisible={isUnlocked}
      />

      {/* Real Client Ad Creatives 3D Showcase */}
      <CreativeShowcaseSection
        onOpenAudit={handleOpenAudit}
        isCtaVisible={isUnlocked}
      />

      {/* The Free Growth Audit (What Actually Happens) */}
      <AuditProcessSection
        onOpenAudit={handleOpenAudit}
        isCtaVisible={isUnlocked}
      />

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
