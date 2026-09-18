"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cal, { getCalApi } from "@calcom/embed-react";
import { getStoredUtms, UtmData } from "@/components/UtmTracker";
import { pauseAllVturbVideos } from "@/components/VturbPlayer";

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuizAnswers {
  brandOrStore: string;
  monthlyRevenue: string;
  monthlyAdSpend: string;
  bottleneck: string;
  role: string;
  fullName: string;
  email: string;
  phone: string;
}

const INITIAL_ANSWERS: QuizAnswers = {
  brandOrStore: "",
  monthlyRevenue: "",
  monthlyAdSpend: "",
  bottleneck: "",
  role: "",
  fullName: "",
  email: "",
  phone: "",
};

const REVENUE_OPTIONS = [
  { key: "A", label: "Less than $30k / month", sub: "Emerging DTC brand" },
  { key: "B", label: "$30k – $100k / month", sub: "Scaling brand hitting first ceiling" },
  { key: "C", label: "$100k – $300k / month", sub: "7-Figure brand scaling profitably" },
  { key: "D", label: "$300k – $1M+ / month", sub: "High-growth 8-Figure category leader" },
];

const AD_SPEND_OPTIONS = [
  { key: "A", label: "Less than $10k / month", sub: "Testing initial product-market fit" },
  { key: "B", label: "$10k – $30k / month", sub: "Scaling core winning creatives" },
  { key: "C", label: "$30k – $75k / month", sub: "Aggressive multi-channel media scale" },
  { key: "D", label: "$75k+ / month", sub: "High-volume ad account spending" },
];

const ROLE_OPTIONS = [
  { key: "A", label: "Founder / CEO / Co-Founder", sub: "Primary executive & business owner" },
  { key: "B", label: "Head of Growth / CMO / VP of Marketing", sub: "Leading marketing & paid media strategy" },
  { key: "C", label: "E-Commerce Director / Marketing Manager", sub: "Managing day-to-day operations & channels" },
];

const COUNTRY_CODES = [
  { flag: "🇺🇸", code: "+1", name: "United States", iso: "US" },
  { flag: "🇨🇦", code: "+1", name: "Canada", iso: "CA" },
  { flag: "🇬🇧", code: "+44", name: "United Kingdom", iso: "GB" },
  { flag: "🇦🇺", code: "+61", name: "Australia", iso: "AU" },
  { flag: "🇧🇷", code: "+55", name: "Brazil", iso: "BR" },
  { flag: "🇩🇪", code: "+49", name: "Germany", iso: "DE" },
  { flag: "🇫🇷", code: "+33", name: "France", iso: "FR" },
  { flag: "🇪🇸", code: "+34", name: "Spain", iso: "ES" },
  { flag: "🇮🇹", code: "+39", name: "Italy", iso: "IT" },
  { flag: "🇳🇱", code: "+31", name: "Netherlands", iso: "NL" },
  { flag: "🇲🇽", code: "+52", name: "Mexico", iso: "MX" },
  { flag: "🇦🇪", code: "+971", name: "United Arab Emirates", iso: "AE" },
  { flag: "🇸🇬", code: "+65", name: "Singapore", iso: "SG" },
  { flag: "🇳🇿", code: "+64", name: "New Zealand", iso: "NZ" },
  { flag: "🇮🇪", code: "+353", name: "Ireland", iso: "IE" },
  { flag: "🇨🇭", code: "+41", name: "Switzerland", iso: "CH" },
  { flag: "🇸🇪", code: "+46", name: "Sweden", iso: "SE" },
  { flag: "🇵🇹", code: "+351", name: "Portugal", iso: "PT" },
  { flag: "🇮🇱", code: "+972", name: "Israel", iso: "IL" },
];

const TOTAL_STEPS = 6;

export default function AuditModal({ isOpen, onClose }: AuditModalProps) {
  const [utms, setUtms] = useState<UtmData>({});
  const [stage, setStage] = useState<"quiz" | "calendar">("quiz");
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // US as default standard
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [phoneRaw, setPhoneRaw] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close country dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Capture UTMs on mount and when modal opens
  useEffect(() => {
    if (typeof window !== "undefined") {
      const captured = getStoredUtms();
      setUtms(captured);
    }
  }, [isOpen]);

  // Reset modal state and pause videos when opened
  useEffect(() => {
    if (isOpen) {
      setStage("quiz");
      setCurrentStep(1);
      setErrorMsg("");

      // Automatically pause any running video playback
      pauseAllVturbVideos();
      const timer = setTimeout(() => {
        pauseAllVturbVideos();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-focus input/textarea on step change
  useEffect(() => {
    if (isOpen && stage === "quiz") {
      const timer = setTimeout(() => {
        if (currentStep === 4) {
          textareaRef.current?.focus();
        } else if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentStep, stage, isOpen]);

  // Build Cal link & prefilled parameters
  const calLink = useMemo(() => {
    const base = "caiodecamargo/free-growth-audit";
    const params = new URLSearchParams();

    if (answers.fullName) params.set("name", answers.fullName);
    if (answers.email) params.set("email", answers.email);
    if (answers.phone) params.set("phone", answers.phone);
    if (answers.brandOrStore) params.set("store", answers.brandOrStore);
    if (answers.monthlyRevenue) params.set("revenue", answers.monthlyRevenue);
    if (answers.monthlyAdSpend) params.set("spend", answers.monthlyAdSpend);
    if (answers.bottleneck) params.set("bottleneck", answers.bottleneck);
    if (answers.role) params.set("role", answers.role);

    // Build diagnostic summary for Cal notes
    const notesSummary = [
      answers.brandOrStore ? `Brand/Store: ${answers.brandOrStore}` : "",
      answers.monthlyRevenue ? `Revenue: ${answers.monthlyRevenue}` : "",
      answers.monthlyAdSpend ? `Ad Spend: ${answers.monthlyAdSpend}` : "",
      answers.bottleneck ? `Bottleneck: ${answers.bottleneck}` : "",
      answers.role ? `Role: ${answers.role}` : "",
      answers.phone ? `Phone: ${answers.phone}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    if (notesSummary) params.set("notes", notesSummary);

    if (utms.utm_source) params.set("utm_source", utms.utm_source);
    if (utms.utm_medium) params.set("utm_medium", utms.utm_medium);
    if (utms.utm_campaign) params.set("utm_campaign", utms.utm_campaign);
    if (utms.utm_content) params.set("utm_content", utms.utm_content);
    if (utms.utm_term) params.set("utm_term", utms.utm_term);
    if (utms.fbclid) params.set("fbclid", utms.fbclid);

    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }, [utms, answers]);

  // Cal.com embed configuration
  const calConfig = useMemo(() => {
    const baseConfig: Record<string, any> = {
      layout: "month_view",
      useSlotsViewOnSmallScreen: "true",
      name: answers.fullName || undefined,
      email: answers.email || undefined,
      notes: [
        answers.brandOrStore ? `Brand/Store: ${answers.brandOrStore}` : "",
        answers.monthlyRevenue ? `Revenue: ${answers.monthlyRevenue}` : "",
        answers.monthlyAdSpend ? `Ad Spend: ${answers.monthlyAdSpend}` : "",
        answers.bottleneck ? `Bottleneck: ${answers.bottleneck}` : "",
        answers.role ? `Role: ${answers.role}` : "",
        answers.phone ? `Phone: ${answers.phone}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
      store: answers.brandOrStore || undefined,
      revenue: answers.monthlyRevenue || undefined,
      spend: answers.monthlyAdSpend || undefined,
      bottleneck: answers.bottleneck || undefined,
      role: answers.role || undefined,
      phone: answers.phone || undefined,
    };

    if (utms.utm_source) baseConfig.utm_source = utms.utm_source;
    if (utms.utm_medium) baseConfig.utm_medium = utms.utm_medium;
    if (utms.utm_campaign) baseConfig.utm_campaign = utms.utm_campaign;
    if (utms.utm_content) baseConfig.utm_content = utms.utm_content;
    if (utms.utm_term) baseConfig.utm_term = utms.utm_term;
    if (utms.fbclid) baseConfig.fbclid = utms.fbclid;
    if (utms.fbc) baseConfig.fbc = utms.fbc;
    if (utms.fbp) baseConfig.fbp = utms.fbp;

    return baseConfig;
  }, [utms, answers]);

  // Listen for Cal.com booking successful event
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "free-growth-audit" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#0FE3B3" },
          dark: { "cal-brand": "#0FE3B3" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });

      cal("on", {
        action: "bookingSuccessful",
        callback: (e: any) => {
          const detail = e?.detail?.data || e?.data || {};
          const fullName = detail.name || detail.booking?.name || answers.fullName || "";
          const nameParts = fullName.trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          const email = detail.email || detail.booking?.email || answers.email || "";
          const phone =
            detail.phone || detail.phoneNumber || detail.booking?.phone || answers.phone || "";

          if (typeof window !== "undefined") {
            const currentUtms = getStoredUtms();
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              event: "bookingSuccessful",
              data: detail,
              name: fullName,
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone: phone,
              store: answers.brandOrStore,
              revenue: answers.monthlyRevenue,
              ad_spend: answers.monthlyAdSpend,
              bottleneck: answers.bottleneck,
              role: answers.role,
              eventType: detail.eventType || "free-growth-audit",
              date: detail.date,
              utm_source: currentUtms.utm_source || "",
              utm_medium: currentUtms.utm_medium || "",
              utm_campaign: currentUtms.utm_campaign || "",
              utm_content: currentUtms.utm_content || "",
              utm_term: currentUtms.utm_term || "",
              fbclid: currentUtms.fbclid || "",
            });
            console.log("✅ [GTM] Dispatched bookingSuccessful event with quiz data & UTMs:", {
              name: fullName,
              email,
              phone,
              brand: answers.brandOrStore,
              utms: currentUtms,
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
          const fullName = detail.name || answers.fullName || "";
          const nameParts = fullName.trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          const email = detail.email || answers.email || "";
          const phone = detail.phone || detail.phoneNumber || answers.phone || "";
          const currentUtms = getStoredUtms();

          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
            event: "bookingSuccessful",
            data: detail,
            name: fullName,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            store: answers.brandOrStore,
            revenue: answers.monthlyRevenue,
            ad_spend: answers.monthlyAdSpend,
            bottleneck: answers.bottleneck,
            role: answers.role,
            utm_source: currentUtms.utm_source || "",
            utm_medium: currentUtms.utm_medium || "",
            utm_campaign: currentUtms.utm_campaign || "",
            utm_content: currentUtms.utm_content || "",
            utm_term: currentUtms.utm_term || "",
            fbclid: currentUtms.fbclid || "",
          });
        }
      } catch (err) {
        // Ignore non-JSON postMessages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [answers]);

  // Handle keyboard shortcuts (A, B, C, D, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (stage === "quiz") {
        const key = e.key.toUpperCase();

        if (currentStep === 2) {
          const matched = REVENUE_OPTIONS.find((o) => o.key === key);
          if (matched) {
            handleSelectOption("monthlyRevenue", matched.label);
          }
        } else if (currentStep === 3) {
          const matched = AD_SPEND_OPTIONS.find((o) => o.key === key);
          if (matched) {
            handleSelectOption("monthlyAdSpend", matched.label);
          }
        } else if (currentStep === 5) {
          const matched = ROLE_OPTIONS.find((o) => o.key === key);
          if (matched) {
            handleSelectOption("role", matched.label);
          }
        } else if (e.key === "Enter" && currentStep === 1) {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, stage, currentStep, answers]);

  // Step Validation & Navigation
  const validateCurrentStep = (): boolean => {
    setErrorMsg("");

    if (currentStep === 1) {
      if (!answers.brandOrStore.trim()) {
        setErrorMsg("Please enter your Brand Name or Store URL to proceed.");
        return false;
      }
    } else if (currentStep === 2) {
      if (!answers.monthlyRevenue) {
        setErrorMsg("Please select an option.");
        return false;
      }
    } else if (currentStep === 3) {
      if (!answers.monthlyAdSpend) {
        setErrorMsg("Please select an option.");
        return false;
      }
    } else if (currentStep === 4) {
      if (!answers.bottleneck.trim()) {
        setErrorMsg("Please describe your primary growth bottleneck.");
        return false;
      }
    } else if (currentStep === 5) {
      if (!answers.role) {
        setErrorMsg("Please select an option.");
        return false;
      }
    } else if (currentStep === 6) {
      if (!answers.fullName.trim()) {
        setErrorMsg("Please enter your full name.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!answers.email.trim() || !emailRegex.test(answers.email.trim())) {
        setErrorMsg("Please enter a valid work email address.");
        return false;
      }
      if (!answers.phone.trim() || answers.phone.trim().length < 6) {
        setErrorMsg("Please enter a valid phone or WhatsApp number.");
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Step 6 completed: Submit quiz & Transition to Calendar
      await handleSubmitQuiz();
    }
  };

  const handleBack = () => {
    setErrorMsg("");
    if (stage === "calendar") {
      setStage("quiz");
      setCurrentStep(TOTAL_STEPS);
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSelectOption = (field: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setErrorMsg("");

    // Auto advance after slight delay for smooth visual feedback
    setTimeout(() => {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 220);
  };

  const handleSubmitQuiz = async () => {
    setIsSubmittingQuiz(true);
    try {
      // Send diagnostic data to our backend API to save prospect
      await fetch("/api/audit-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          utms,
        }),
      });
    } catch (err) {
      console.error("Error syncing quiz diagnostic:", err);
    } finally {
      setIsSubmittingQuiz(false);
      setStage("calendar");
    }
  };

  if (!isOpen) return null;

  const progressPercent = stage === "calendar" ? 100 : Math.round(((currentStep - 1) / TOTAL_STEPS) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#000820]/90 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.45, bounce: 0.1 }}
          className="relative w-full max-w-4xl h-[92vh] max-h-[850px] bg-[#00103A] border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl z-10 my-auto flex flex-col overflow-hidden text-white"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              {(currentStep > 1 || stage === "calendar") && (
                <button
                  onClick={handleBack}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
              <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
                Free DTC <span className="text-[#0FE3B3] italic font-serif font-normal">Growth Diagnostic</span>
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {stage === "quiz" && (
                <span className="text-xs font-mono text-white/50 hidden sm:inline-block">
                  Step {currentStep} of {TOTAL_STEPS}
                </span>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/10 shrink-0 relative overflow-hidden rounded-full my-2">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0FE3B3] to-[#D80064]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          {/* Body Content Area */}
          <div className="flex-1 w-full h-full min-h-0 overflow-y-auto pt-2 flex flex-col">
            {stage === "quiz" ? (
              <div className="flex-1 flex flex-col justify-between max-w-2xl mx-auto w-full py-4 sm:py-6 px-1">
                <AnimatePresence mode="wait">
                  {/* Step 1: Brand & Store URL */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-center"
                    >
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0FE3B3] uppercase tracking-wider mb-2">
                        <span>01</span>
                        <span>•</span>
                        <span>Brand Information</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                        What is your Brand Name & Store URL?
                      </h4>
                      <p className="text-sm sm:text-base text-white/70 mb-6">
                        We perform a forensic analysis of your store, ads, and allowable CPA prior to our call.
                      </p>

                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={answers.brandOrStore}
                          onChange={(e) => {
                            setAnswers({ ...answers, brandOrStore: e.target.value });
                            setErrorMsg("");
                          }}
                          placeholder="e.g., LuxeAura • luxeaura.com"
                          className="w-full bg-white/[0.05] border-2 border-white/20 focus:border-[#0FE3B3] rounded-xl px-4 py-3.5 text-base sm:text-lg text-white placeholder-white/40 outline-none transition-all duration-200 shadow-inner"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Monthly Revenue */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-center"
                    >
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0FE3B3] uppercase tracking-wider mb-2">
                        <span>02</span>
                        <span>•</span>
                        <span>Current Scale</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2">
                        What is your current monthly revenue?
                      </h4>
                      <p className="text-sm text-white/70 mb-5">
                        Select one option (or press A, B, C, D on keyboard)
                      </p>

                      <div className="grid grid-cols-1 gap-2.5">
                        {REVENUE_OPTIONS.map((opt) => {
                          const isSelected = answers.monthlyRevenue === opt.label;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleSelectOption("monthlyRevenue", opt.label)}
                              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? "bg-[#0FE3B3]/15 border-[#0FE3B3] text-white shadow-[0_0_20px_rgba(15,227,179,0.2)]"
                                  : "bg-white/[0.04] border-white/15 hover:border-white/40 hover:bg-white/[0.07] text-white/90"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border transition-colors ${
                                    isSelected
                                      ? "bg-[#0FE3B3] text-[#00103A] border-[#0FE3B3]"
                                      : "bg-white/10 text-white/70 border-white/20"
                                  }`}
                                >
                                  {opt.key}
                                </span>
                                <div>
                                  <div className="text-sm sm:text-base font-bold text-white">{opt.label}</div>
                                  <div className="text-xs text-white/60">{opt.sub}</div>
                                </div>
                              </div>
                              {isSelected && (
                                <svg className="w-5 h-5 text-[#0FE3B3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Monthly Ad Spend */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-center"
                    >
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0FE3B3] uppercase tracking-wider mb-2">
                        <span>03</span>
                        <span>•</span>
                        <span>Paid Media Investment</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2">
                        How much do you invest in paid ads monthly?
                      </h4>
                      <p className="text-sm text-white/70 mb-5">
                        Combined Meta, Google PMax, TikTok & other channels.
                      </p>

                      <div className="grid grid-cols-1 gap-2.5">
                        {AD_SPEND_OPTIONS.map((opt) => {
                          const isSelected = answers.monthlyAdSpend === opt.label;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleSelectOption("monthlyAdSpend", opt.label)}
                              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? "bg-[#0FE3B3]/15 border-[#0FE3B3] text-white shadow-[0_0_20px_rgba(15,227,179,0.2)]"
                                  : "bg-white/[0.04] border-white/15 hover:border-white/40 hover:bg-white/[0.07] text-white/90"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border transition-colors ${
                                    isSelected
                                      ? "bg-[#0FE3B3] text-[#00103A] border-[#0FE3B3]"
                                      : "bg-white/10 text-white/70 border-white/20"
                                  }`}
                                >
                                  {opt.key}
                                </span>
                                <div>
                                  <div className="text-sm sm:text-base font-bold text-white">{opt.label}</div>
                                  <div className="text-xs text-white/60">{opt.sub}</div>
                                </div>
                              </div>
                              {isSelected && (
                                <svg className="w-5 h-5 text-[#0FE3B3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Primary Bottleneck (Open Text Field) */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-center"
                    >
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0FE3B3] uppercase tracking-wider mb-2">
                        <span>04</span>
                        <span>•</span>
                        <span>Scaling Challenge</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2">
                        What is your #1 growth bottleneck?
                      </h4>
                      <p className="text-sm text-white/70 mb-5">
                        Tell us what is currently holding back your brand from scaling profitably.
                      </p>

                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          rows={4}
                          value={answers.bottleneck}
                          onChange={(e) => {
                            setAnswers({ ...answers, bottleneck: e.target.value });
                            setErrorMsg("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleNext();
                            }
                          }}
                          placeholder="e.g., Creative fatigue on Meta, rising customer acquisition costs (CAC), plateauing at $80k/mo, attribution clarity, or need for senior media buyers..."
                          className="w-full bg-white/[0.05] border-2 border-white/20 focus:border-[#0FE3B3] focus:shadow-[0_0_20px_rgba(15,227,179,0.15)] rounded-xl p-4 text-base sm:text-lg text-white placeholder-white/35 outline-none transition-all duration-200 resize-none"
                        />
                        <div className="text-[11px] text-white/40 mt-2 flex items-center justify-between">
                          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-mono text-[10px]">Enter ↵</kbd> to continue (or Shift + Enter for new line)</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Role */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-center"
                    >
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0FE3B3] uppercase tracking-wider mb-2">
                        <span>05</span>
                        <span>•</span>
                        <span>Your Role</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2">
                        What is your role at the brand?
                      </h4>
                      <p className="text-sm text-white/70 mb-5">
                        We tailor the call agenda to your specific decision-making level.
                      </p>

                      <div className="grid grid-cols-1 gap-2.5">
                        {ROLE_OPTIONS.map((opt) => {
                          const isSelected = answers.role === opt.label;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleSelectOption("role", opt.label)}
                              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? "bg-[#0FE3B3]/15 border-[#0FE3B3] text-white shadow-[0_0_20px_rgba(15,227,179,0.2)]"
                                  : "bg-white/[0.04] border-white/15 hover:border-white/40 hover:bg-white/[0.07] text-white/90"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border transition-colors ${
                                    isSelected
                                      ? "bg-[#0FE3B3] text-[#00103A] border-[#0FE3B3]"
                                      : "bg-white/10 text-white/70 border-white/20"
                                  }`}
                                >
                                  {opt.key}
                                </span>
                                <div>
                                  <div className="text-sm sm:text-base font-bold text-white">{opt.label}</div>
                                  <div className="text-xs text-white/60">{opt.sub}</div>
                                </div>
                              </div>
                              {isSelected && (
                                <svg className="w-5 h-5 text-[#0FE3B3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6: Contact Information */}
                  {currentStep === 6 && (
                    <motion.div
                      key="step6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-center"
                    >
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0FE3B3] uppercase tracking-wider mb-2">
                        <span>06</span>
                        <span>•</span>
                        <span>Final Step</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2">
                        Where should we send your Diagnostic?
                      </h4>
                      <p className="text-sm text-white/70 mb-5">
                        Enter your contact details to unlock calendar slots with our senior operators.
                      </p>

                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                            Full Name *
                          </label>
                          <input
                            ref={inputRef}
                            type="text"
                            value={answers.fullName}
                            onChange={(e) => setAnswers({ ...answers, fullName: e.target.value })}
                            placeholder="e.g., Alex Johnson"
                            className="w-full bg-white/[0.05] border-2 border-white/20 focus:border-[#0FE3B3] rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-white/40 outline-none transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                            Work Email *
                          </label>
                          <input
                            type="email"
                            value={answers.email}
                            onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                            placeholder="alex@brandname.com"
                            className="w-full bg-white/[0.05] border-2 border-white/20 focus:border-[#0FE3B3] rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-white/40 outline-none transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                            Phone / WhatsApp *
                          </label>
                          <div className="relative" ref={countryDropdownRef}>
                            <div className="flex items-center w-full bg-white/[0.05] border-2 border-white/20 focus-within:border-[#0FE3B3] focus-within:shadow-[0_0_20px_rgba(15,227,179,0.15)] rounded-xl transition-all duration-200">
                              {/* Country Code Toggle Button (US default) */}
                              <button
                                type="button"
                                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                className="h-[46px] sm:h-[50px] px-3.5 bg-white/[0.06] hover:bg-white/[0.12] border-r border-white/15 rounded-l-[10px] flex items-center gap-2 text-white transition-colors cursor-pointer shrink-0 select-none"
                                aria-label="Select Country Code"
                              >
                                <span className="text-xl leading-none">{selectedCountry.flag}</span>
                                <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                                  {selectedCountry.code}
                                </span>
                                <svg
                                  className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${
                                    isCountryDropdownOpen ? "rotate-180 text-[#0FE3B3]" : ""
                                  }`}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <path d="M6 9l6 6 6-6" />
                                </svg>
                              </button>

                              {/* Phone Text Input */}
                              <input
                                type="tel"
                                value={phoneRaw}
                                onChange={(e) => {
                                  let val = e.target.value;
                                  // Clean leading dial code if pasted
                                  if (val.startsWith(selectedCountry.code)) {
                                    val = val.slice(selectedCountry.code.length).trim();
                                  } else if (val.startsWith("+1") && selectedCountry.code === "+1") {
                                    val = val.slice(2).trim();
                                  }
                                  setPhoneRaw(val);
                                  const fullNumber = val.trim() ? `${selectedCountry.code} ${val.trim()}` : "";
                                  setAnswers((prev) => ({ ...prev, phone: fullNumber }));
                                  setErrorMsg("");
                                }}
                                placeholder="(555) 000-0000"
                                className="w-full h-[46px] sm:h-[50px] bg-transparent px-3.5 text-sm sm:text-base text-white placeholder-white/35 outline-none rounded-r-[10px]"
                              />
                            </div>

                            {/* Country Dropdown Menu */}
                            {isCountryDropdownOpen && (
                              <div className="absolute top-full left-0 mt-1.5 w-72 max-h-60 bg-[#000e2e] border border-white/20 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] overflow-y-auto z-50 p-1.5 divide-y divide-white/5 backdrop-blur-2xl">
                                <div className="px-2 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                                  Select Country Code
                                </div>
                                {COUNTRY_CODES.map((c) => (
                                  <button
                                    key={c.iso + c.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setIsCountryDropdownOpen(false);
                                      const fullNumber = phoneRaw.trim() ? `${c.code} ${phoneRaw.trim()}` : "";
                                      setAnswers((prev) => ({ ...prev, phone: fullNumber }));
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors cursor-pointer ${
                                      selectedCountry.iso === c.iso && selectedCountry.code === c.code
                                        ? "bg-[#0FE3B3]/20 text-[#0FE3B3] font-bold"
                                        : "hover:bg-white/10 text-white/85"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-lg leading-none">{c.flag}</span>
                                      <span className="font-medium text-white">{c.name}</span>
                                    </div>
                                    <span className="font-mono text-xs text-white/60 font-semibold">{c.code}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                {errorMsg && (
                  <div className="mt-3 text-xs sm:text-sm font-semibold text-[#D80064] flex items-center gap-1.5">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errorMsg}
                  </div>
                )}

                {/* Bottom Navigation CTA */}
                <div className="pt-5 border-t border-white/10 flex items-center justify-between mt-auto">
                  <div className="text-xs text-white/50 hidden sm:block">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-mono text-[11px]">Enter ↵</kbd> to continue
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmittingQuiz}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#D80064] to-[#BF0058] hover:from-[#BF0058] hover:to-[#9F0048] text-white text-sm sm:text-base font-bold tracking-wide shadow-[0_0_25px_rgba(216,0,100,0.35)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ml-auto"
                  >
                    {isSubmittingQuiz ? (
                      <span>Unlocking Calendar...</span>
                    ) : currentStep === TOTAL_STEPS ? (
                      <>
                        <span>Select Date & Time</span>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Stage 2: Cal.com Calendar Embed */
              <div className="flex-1 w-full h-full min-h-0 flex flex-col overflow-hidden">
                <div className="bg-white/[0.04] border border-[#0FE3B3]/30 rounded-xl p-3 mb-2 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#0FE3B3]/20 text-[#0FE3B3] flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div className="text-xs sm:text-sm text-white/90">
                      <span className="font-bold text-white">Diagnostic saved for {answers.fullName || "you"}!</span> Pick your time slot below:
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setStage("quiz");
                      setCurrentStep(TOTAL_STEPS);
                    }}
                    className="text-xs text-[#0FE3B3] hover:underline font-semibold cursor-pointer hidden sm:inline"
                  >
                    Edit Info
                  </button>
                </div>

                <div className="flex-1 w-full h-full min-h-0 overflow-hidden rounded-xl sm:rounded-2xl">
                  <Cal
                    key={calLink}
                    namespace="free-growth-audit"
                    calLink={calLink}
                    style={{ width: "100%", height: "100%", overflow: "scroll" }}
                    config={calConfig}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
