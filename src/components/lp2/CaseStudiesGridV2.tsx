"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import DashboardPreview from "@/components/common/DashboardPreview";
import CaseStudyDetailModal, { CaseStudyDetail } from "./CaseStudyDetailModal";

interface CaseStudiesGridV2Props {
  onOpenAudit: () => void;
}

const detailedCases: CaseStudyDetail[] = [
  {
    id: "case-1",
    category: "META ADS SCALING",
    title: "DTC Lifestyle Brand",
    highlightText: "Boost Sales by 78% and Scaled Order Volume 2.4x",
    image: "/images/cases/meta-ads-case-1.png",
    dashboardId: "meta-1",
    stats: [
      { label: "Net Sales", value: "+78%" },
      { label: "Store CVR", value: "+32%" },
      { label: "Orders Increase", value: "+139%" },
    ],
    problem:
      "The client was stuck on a revenue plateau with fluctuating Meta ROAS, high customer acquisition costs, and ad creative fatigue hitting every 4-5 days.",
    solution: [
      "Replaced disjointed ad sets with a unified Broad Advantage+ account structure.",
      "Launched weekly AI-assisted creative sprint deploying 35+ emotional hooks & UGC angles.",
      "Optimized the pre-purchase PDP flow to increase Average Order Value (AOV) by 24%.",
      "Managed ad spend strictly against real contribution margin (MER) rather than platform metrics.",
    ],
    results:
      "Within 90 days, net sales climbed 78%, customer acquisition cost dropped 34%, and total order volume grew by 139% with zero budget waste.",
  },
  {
    id: "case-2",
    category: "OMNICHANNEL SEARCH & PMAX",
    title: "Omnichannel DTC Category Leader",
    highlightText: "Scaled to $10.7M+ Omnichannel Sales with 10.86x ROAS",
    image: "/images/cases/google-ads-case-1.png",
    dashboardId: "google-1",
    stats: [
      { label: "Total Sales", value: "$10.7M+" },
      { label: "Value / Cost", value: "10.86x" },
      { label: "Impressions", value: "97.1M" },
    ],
    problem:
      "Search and shopping campaigns were competing against each other, driving up branded CPCs while non-branded cold acquisition remained unprofitable.",
    solution: [
      "Restructured Google Performance Max with strict margin-tiered asset groups.",
      "Synchronized Meta video hook testing with Google Search high-intent search query volume.",
      "Engineered custom high-converting landing page funnels with direct checkout upsells.",
      "Implemented server-side conversion tracking for 100% attribution accuracy against net bank deposits.",
    ],
    results:
      "Omnichannel revenue scaled past $10.7M+, blended ROAS held strong at 10.86x, and subscription retention surged over 6 consecutive months.",
  },
  {
    id: "case-3",
    category: "HIGH-VELOCITY CREATIVE SPRINTS",
    title: "Rapid Hook Testing Engine",
    highlightText: "17.30x Peak ROAS Sprint with Rapid Creative Iteration",
    image: "/images/cases/meta-ads-case-2.png",
    dashboardId: "meta-2",
    stats: [
      { label: "Purchase Value", value: "$431k+" },
      { label: "Peak ROAS", value: "17.30x" },
      { label: "Cost / Checkout", value: "$16.06" },
    ],
    problem:
      "The brand's campaigns were optimizing for cheap, low-intent clicks that generated one-off low-margin sales with poor 90-day repeat purchase rates.",
    solution: [
      "Re-engineered creative angles specifically tailored to affluent, high-intent buyer personas.",
      "Segmented bid strategies to prioritize premium SKU bundles and multi-pack offers.",
      "Implemented rigorous creative fatigue monitoring with rapid 7-day iteration cycles.",
    ],
    results:
      "Delivered a record-breaking 17.30x peak ROAS sprint and lowered cost per checkout to $16.06 during peak scaling season.",
  },
];

export default function CaseStudiesGridV2({ onOpenAudit }: CaseStudiesGridV2Props) {
  const [selectedCase, setSelectedCase] = useState<CaseStudyDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenStudy = (caseItem: CaseStudyDetail) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  const handleCloseStudy = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  return (
    <section id="performance" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#001244] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs sm:text-sm font-extrabold tracking-widest text-brand-teal uppercase block mb-2">
            PROOF IN PERFORMANCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Documented Client Results
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            Real brands. Real unit economics. Real verified bank-deposit results.
          </p>
        </div>

        {/* 3 Structured Case Cards */}
        <div className="space-y-10">
          {detailedCases.map((caseItem, idx) => (
            <div
              key={caseItem.id}
              className="bg-[#000c2e] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl hover:border-brand-teal/40 transition-all duration-300"
            >
              <span className="text-xs font-bold tracking-widest text-brand-teal uppercase block mb-2">
                {caseItem.category}
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                {caseItem.title}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-tealLight italic font-serif font-normal">
                  {caseItem.highlightText}
                </span>
              </h3>

              {/* Metric Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 pt-6 border-t border-white/10">
                {caseItem.stats.map((stat, i) => (
                  <div key={i} className="border-b border-brand-teal/60 sm:border-b-0 sm:border-l-2 sm:border-brand-teal sm:pl-4 pb-3 sm:pb-0">
                    <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/70 uppercase font-semibold mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action and Visual Showcase */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleOpenStudy(caseItem)}
                  className="px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-transparent hover:bg-brand-teal text-brand-teal hover:text-[#00103A] border-2 border-brand-teal transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>See Detailed Study</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <div 
                  onClick={() => handleOpenStudy(caseItem)}
                  className="relative w-full md:w-96 rounded-xl overflow-hidden border border-white/20 bg-slate-900 shadow-md cursor-pointer hover:border-brand-teal/60 transition-all group scale-95 hover:scale-100"
                >
                  <div className="pointer-events-none transform origin-top-left scale-[0.65] w-[150%]">
                    <DashboardPreview caseId={caseItem.dashboardId || "meta-1"} />
                  </div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-end justify-end p-2">
                    <span className="text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded backdrop-blur">
                      Click to inspect
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore More Banner */}
        <div className="mt-16 text-center bg-white/[0.03] border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">
              Explore More Verified Ad Campaigns
            </h4>
            <p className="text-xs sm:text-sm text-white/60 mt-0.5">
              Over $25M+ in verified e-commerce revenue generated across Meta, Google &amp; TikTok.
            </p>
          </div>

          <button
            onClick={onOpenAudit}
            className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-[#D80064] hover:bg-[#BF0058] text-white shadow-[0_0_20px_rgba(216,0,100,0.5)] transition-all cursor-pointer whitespace-nowrap"
          >
            Claim Your Free Growth Audit
          </button>
        </div>
      </div>

      {/* Case Study Detail Modal */}
      <CaseStudyDetailModal
        caseStudy={selectedCase}
        isOpen={isModalOpen}
        onClose={handleCloseStudy}
        onOpenAudit={onOpenAudit}
      />
    </section>
  );
}
