"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditModal({ isOpen, onClose }: AuditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    monthlySpend: "$20k - $50k/mo",
    mainGoal: "Improve MER & Real Profit",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D80064", "#0FE3B3", "#ffffff", "#38bdf8"],
      });
    }, 800);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/85 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
          className="relative w-full max-w-lg bg-[#00103A] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          {!isSubmitted ? (
            <div>
              {/* Header */}
              <div className="text-center mb-6">
                <span className="px-3 py-1 rounded-full bg-brand-teal/20 border border-brand-teal/40 text-brand-teal text-xs font-bold uppercase tracking-wider">
                  2-Minute Application • Zero Cost
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-tight">
                  Get Your Free{" "}
                  <span className="font-serif italic font-normal text-brand-teal">
                    Growth Audit
                  </span>
                </h3>
                <p className="text-white/75 text-xs sm:text-sm mt-1.5 font-medium">
                  We check your media, creative, and MER against your real P&amp;L.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@yourbrand.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Brand Website / Store URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://yourbrand.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Monthly Ad Spend
                    </label>
                    <select
                      value={formData.monthlySpend}
                      onChange={(e) => setFormData({ ...formData, monthlySpend: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl bg-[#00174a] border border-white/20 text-white focus:outline-none focus:border-brand-teal text-sm"
                    >
                      <option value="$10k - $30k/mo">$10k - $30k/mo</option>
                      <option value="$30k - $100k/mo">$30k - $100k/mo</option>
                      <option value="$100k - $300k/mo">$100k - $300k/mo</option>
                      <option value="$300k+/mo">$300k+/mo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Current Focus
                    </label>
                    <select
                      value={formData.mainGoal}
                      onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl bg-[#00174a] border border-white/20 text-white focus:outline-none focus:border-brand-teal text-sm"
                    >
                      <option value="Improve MER & Profit">Improve MER &amp; Profit</option>
                      <option value="Scale Past Plateau">Scale Past Plateau</option>
                      <option value="Fix Creative Bottleneck">Fix Creative Bottleneck</option>
                      <option value="Replace Current Agency">Replace Current Agency</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 btn-magenta-glow py-4 rounded-full bg-brand-magenta text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:bg-brand-magentaHover hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? "Submitting Application..." : "Claim Free Growth Audit"}
                </button>

                <p className="text-center text-[11px] text-white/60 mt-3">
                  🔒 100% Confidential. No high-pressure sales calls.
                </p>
              </form>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center mx-auto mb-4 border border-brand-teal/40">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>

              <h3 className="text-2xl font-extrabold text-white">
                Application Received!
              </h3>
              <p className="text-white/80 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                Thanks, <span className="text-brand-teal font-bold">{formData.name}</span>. Our growth team is reviewing <span className="text-white font-semibold">{formData.website}</span>. We&apos;ll be in touch within 24 business hours to coordinate your intro call.
              </p>

              <button
                onClick={handleReset}
                className="mt-6 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Close Window
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
