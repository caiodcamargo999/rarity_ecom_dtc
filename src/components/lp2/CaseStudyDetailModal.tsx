"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import DashboardPreview from "@/components/common/DashboardPreview";

export interface CaseStudyDetail {
  id: string;
  category: string;
  title: string;
  highlightText: string;
  image: string;
  dashboardId?: string;
  stats: { label: string; value: string }[];
  problem: string;
  solution: string[];
  results: string;
}

interface CaseStudyDetailModalProps {
  caseStudy: CaseStudyDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAudit: () => void;
}

export default function CaseStudyDetailModal({
  caseStudy,
  isOpen,
  onClose,
  onOpenAudit,
}: CaseStudyDetailModalProps) {
  if (!isOpen || !caseStudy) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#000820]/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-[#00103A] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <span className="px-3 py-1 rounded-full bg-brand-teal/20 border border-brand-teal/40 text-brand-teal text-xs font-bold uppercase tracking-wider">
              {caseStudy.category}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-tight">
              {caseStudy.title}
            </h3>
            <p className="text-brand-teal font-semibold text-sm sm:text-base mt-1">
              {caseStudy.highlightText}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
            {caseStudy.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-teal font-mono">
                  {stat.value}
                </div>
                <div className="text-xs text-white/60 font-medium uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* High-Definition Dashboard Preview */}
          <div className="w-full my-6 overflow-hidden rounded-xl">
            <DashboardPreview caseId={caseStudy.dashboardId || "meta-1"} />
          </div>

          {/* Content Breakdown */}
          <div className="space-y-4 text-sm sm:text-base text-white/80">
            <div>
              <h4 className="text-white font-bold text-base sm:text-lg flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#D80064]" />
                The Challenge
              </h4>
              <p className="leading-relaxed pl-4 text-white/75">{caseStudy.problem}</p>
            </div>

            <div>
              <h4 className="text-white font-bold text-base sm:text-lg flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-brand-teal" />
                The Rarity Playbook
              </h4>
              <ul className="space-y-2 pl-4">
                {caseStudy.solution.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-white/80">
                    <CheckCircle className="w-4 h-4 text-brand-teal shrink-0 mt-1" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <h4 className="text-white font-bold text-base sm:text-lg flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-brand-teal" />
                The Outcome
              </h4>
              <p className="leading-relaxed pl-4 text-brand-teal font-medium">
                {caseStudy.results}
              </p>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-white/60 text-center sm:text-left">
              Ready to replicate this scaling framework for your brand?
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenAudit();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-[#D80064] hover:bg-[#BF0058] text-white shadow-[0_0_20px_rgba(216,0,100,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Free Growth Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
