"use client";

import { motion, AnimatePresence } from "framer-motion";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAudit: () => void;
}

export default function VideoModal({ isOpen, onClose, onOpenAudit }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-navy-950/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
          className="relative w-full max-w-4xl bg-[#00103A] border border-white/20 rounded-3xl overflow-hidden shadow-2xl z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close video"
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

          {/* Video Player Box */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            <video
              src="/videos/landscape.mp4"
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Bar in Modal */}
          <div className="p-5 sm:p-6 bg-[#000c2e] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
            <div>
              <p className="text-white font-bold text-sm sm:text-base">
                Ready to stop burning cash on useless agency reports?
              </p>
              <p className="text-white/70 text-xs mt-0.5">
                We audit your media, creative, and MER for free.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAudit();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-magenta text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-magentaHover transition-all whitespace-nowrap cursor-pointer"
            >
              Get Free Audit
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
