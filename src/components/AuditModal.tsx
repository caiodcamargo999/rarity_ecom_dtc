"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cal, { getCalApi } from "@calcom/embed-react";

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditModal({ isOpen, onClose }: AuditModalProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "free-growth-audit" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#006ac8" },
          dark: { "cal-brand": "#111dd8" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });

      // Listen for Cal.com booking successful event
      cal("on", {
        action: "bookingSuccessful",
        callback: (e: any) => {
          const detail = e?.detail?.data || e?.data || {};
          const fullName = detail.name || detail.booking?.name || "";
          const nameParts = fullName.trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          const email = detail.email || detail.booking?.email || "";
          const phone = detail.phone || detail.phoneNumber || detail.booking?.phone || "";

          if (typeof window !== "undefined") {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              event: "bookingSuccessful",
              data: detail,
              name: fullName,
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone: phone,
              eventType: detail.eventType || "free-growth-audit",
              date: detail.date,
            });
            console.log("✅ [GTM] Dispatched bookingSuccessful event to dataLayer:", {
              name: fullName,
              email,
              phone,
            });
          }
        },
      });
    })();

    // Fallback listener for postMessage events from Cal iframe
    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (
          msg?.action === "bookingSuccessful" ||
          msg?.type === "cal:bookingSuccessful" ||
          msg?.event === "bookingSuccessful"
        ) {
          const detail = msg?.data || msg?.detail || {};
          const fullName = detail.name || "";
          const nameParts = fullName.trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          const email = detail.email || "";
          const phone = detail.phone || detail.phoneNumber || "";

          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: "bookingSuccessful",
            data: detail,
            name: fullName,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
          });
        }
      } catch (err) {
        // Not a JSON postMessage, ignore
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#000820]/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
          className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#00103A] border border-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 shadow-2xl z-10 my-auto flex flex-col overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 shrink-0">
            <div>
              <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                Schedule Your Free <span className="text-[#0FE3B3] italic font-serif font-normal">Growth Audit</span>
              </h3>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-3"
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
          </div>

          {/* Cal.com Embed Container */}
          <div className="flex-1 w-full h-full min-h-0 pt-2 overflow-hidden rounded-xl sm:rounded-2xl">
            <Cal
              namespace="free-growth-audit"
              calLink="caiodecamargo/free-growth-audit"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{
                layout: "month_view",
                useSlotsViewOnSmallScreen: "true",
              }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
