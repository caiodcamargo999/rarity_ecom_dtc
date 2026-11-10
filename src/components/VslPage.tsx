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
import BookingSection, { scrollToBooking } from "@/components/BookingSection";
import VideoModal from "@/components/VideoModal";
import { pauseAllVturbVideos } from "@/components/VturbPlayer";

interface VslPageProps {
  headlineVariant?: "default" | "growth-team";
}

export default function VslPage({ headlineVariant = "default" }: VslPageProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleOpenAudit = () => {
    pauseAllVturbVideos();
    setIsVideoModalOpen(false);
    scrollToBooking();
  };

  const handleOpenVideo = () => setIsVideoModalOpen(true);
  const handleCloseVideo = () => setIsVideoModalOpen(false);

  return (
    <main className="min-h-screen rarity-bg relative selection:bg-[#D80064] selection:text-white">
      {/* Top Navigation Bar */}
      <Header />

      {/* Hero Section with VTurb Video & CTA Button */}
      <HeroSection
        onOpenAudit={handleOpenAudit}
        onOpenVideo={handleOpenVideo}
        isCtaVisible={true}
        headlineVariant={headlineVariant}
      />

      {/* The Problem Section */}
      <ProblemSection
        onOpenAudit={handleOpenAudit}
        isCtaVisible={true}
      />

      {/* One Team. One Number. Three Levers. */}
      <ThreeLeversSection />

      {/* Case Studies & Testimonials */}
      <CaseStudiesSection
        onOpenAudit={handleOpenAudit}
        isCtaVisible={true}
      />

      {/* Real Client Ad Creatives 3D Showcase */}
      <CreativeShowcaseSection
        onOpenAudit={handleOpenAudit}
        isCtaVisible={true}
      />

      {/* The Free Growth Audit (What Actually Happens) */}
      <AuditProcessSection
        onOpenAudit={handleOpenAudit}
        isCtaVisible={true}
      />

      {/* Inline Cal.com booking calendar */}
      <BookingSection />

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideo}
        onOpenAudit={handleOpenAudit}
      />
    </main>
  );
}
