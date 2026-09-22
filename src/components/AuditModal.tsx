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

// Temporary mode: skip questionnaire questions and show the Cal.com embed directly
const DIRECT_CALENDAR_MODE = true;

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
  const [stage, setStage] = useState<"quiz" | "calendar">(
    DIRECT_CALENDAR_MODE ? "calendar" : "quiz"
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const answersRef = useRef<QuizAnswers>(answers);
  answersRef.current = answers;

  const utmsRef = useRef<UtmData>(utms);
  utmsRef.current = utms;

  const bookingHandledRef = useRef(false);

  // Reset modal state and pause videos when opened
  useEffect(() => {
    if (isOpen) {
      setStage(DIRECT_CALENDAR_MODE ? "calendar" : "quiz");
      setCurrentStep(1);
      setErrorMsg("");
      bookingHandledRef.current = false;

      // Automatically pause any running video playback
      pauseAllVturbVideos();
      const timer = setTimeout(() => {
        pauseAllVturbVideos();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-focus input/textarea on step change (when quiz mode is active)
  useEffect(() => {
    if (isOpen && stage === "quiz" && !DIRECT_CALENDAR_MODE) {
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

    // Build diagnostic summary for Cal notes if available
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
        .join(" | ") || undefined,
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

  // Listen for Cal.com booking successful event & preload calendar (MOUNT ONCE)
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "free-growth-audit" });
      cal("preload", { calLink: "caiodecamargo/free-growth-audit" });
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
          const detail = e?.detail?.data || e?.data || e?.detail || {};
          handleBookingComplete(detail);
        },
      });
    })();

    const handleBookingComplete = (detail: any) => {
      // Guard against multiple firings
      if (bookingHandledRef.current) return;
      bookingHandledRef.current = true;

      const latestAnswers = answersRef.current;
      const latestUtms = utmsRef.current;

      const booking = detail.booking || detail;
      const attendees = Array.isArray(booking.attendees)
        ? booking.attendees
        : Array.isArray(detail.attendees)
        ? detail.attendees
        : [];
      const primaryAttendee = attendees[0] || {};
      const responses =
        booking.responses ||
        detail.responses ||
        booking.userFieldsResponses ||
        detail.userFieldsResponses ||
        {};

      const fullName =
        detail.name ||
        booking.name ||
        primaryAttendee.name ||
        responses.name?.value ||
        responses.name ||
        latestAnswers.fullName ||
        "";

      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const email =
        detail.email ||
        booking.email ||
        primaryAttendee.email ||
        responses.email?.value ||
        responses.email ||
        latestAnswers.email ||
        "";

      const phone =
        detail.phone ||
        detail.phoneNumber ||
        booking.phone ||
        booking.phoneNumber ||
        primaryAttendee.phoneNumber ||
        primaryAttendee.phone ||
        responses.phone?.value ||
        responses.phone ||
        responses.phoneNumber?.value ||
        responses.phoneNumber ||
        latestAnswers.phone ||
        "";

      const meetingDate =
        detail.date ||
        detail.startTime ||
        booking.startTime ||
        booking.date ||
        "";

      const timeZone =
        primaryAttendee.timeZone ||
        detail.timeZone ||
        booking.timeZone ||
        "America/Sao_Paulo";

      if (!email && !phone && !fullName) return;

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
          store: latestAnswers.brandOrStore || "Ecom Brand",
          revenue: latestAnswers.monthlyRevenue,
          ad_spend: latestAnswers.monthlyAdSpend,
          bottleneck: latestAnswers.bottleneck,
          role: latestAnswers.role,
          eventType: detail.eventType || "free-growth-audit",
          date: meetingDate,
          timeZone,
          utm_source: latestUtms.utm_source || "",
          utm_medium: latestUtms.utm_medium || "",
          utm_campaign: latestUtms.utm_campaign || "",
          utm_content: latestUtms.utm_content || "",
          utm_term: latestUtms.utm_term || "",
          fbclid: latestUtms.fbclid || "",
        });
        console.log("✅ [GTM] Dispatched bookingSuccessful event with Cal.com data & UTMs:", {
          name: fullName,
          email,
          phone,
          meetingDate,
          utms: latestUtms,
        });
      }

      // Immediately sync to Quo CRM & Google Sheets: mark scheduledOnCal as "Yes" and write Name, Email, Phone, Meeting Date
      fetch("/api/audit-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_booking_status",
          brandOrStore: latestAnswers.brandOrStore || "Ecom Brand",
          monthlyRevenue: latestAnswers.monthlyRevenue,
          monthlyAdSpend: latestAnswers.monthlyAdSpend,
          bottleneck: latestAnswers.bottleneck,
          role: latestAnswers.role,
          fullName,
          email,
          phone,
          scheduledOnCal: "Yes",
          meetingDate,
          timeZone,
          utms: latestUtms,
        }),
        keepalive: true,
      }).catch((err) => {
        console.error("Background error syncing booking status to Quo & Sheets:", err);
      });
    };

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
          handleBookingComplete(detail);
        }
      } catch (err) {
        // Ignore non-JSON postMessages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (stage === "quiz" && !DIRECT_CALENDAR_MODE) {
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

  // Step Validation & Navigation (for quiz mode)
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
      handleSubmitQuiz();
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

    setTimeout(() => {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
      }
    }, 220);
  };

  const handleSubmitQuiz = () => {
    setStage("calendar");
    fetch("/api/audit-diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...answers,
        utms,
      }),
      keepalive: true,
    }).catch((err) => {
      console.error("Background error syncing quiz diagnostic:", err);
    });
  };

  const progressPercent =
    stage === "calendar" ? 100 : Math.round(((currentStep - 1) / TOTAL_STEPS) * 100);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden transition-all duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto visible"
          : "opacity-0 pointer-events-none invisible"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-[#000820]/90 backdrop-blur-md cursor-pointer transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-4xl h-[92vh] max-h-[850px] bg-[#00103A] border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl z-10 my-auto flex flex-col overflow-hidden text-white transition-all duration-300 ease-out transform ${
          isOpen
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
      >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              {!DIRECT_CALENDAR_MODE && (currentStep > 1 || stage === "calendar") && (
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
              <div className="flex flex-col">
                <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Free DTC</span>
                  <span className="text-[#0FE3B3] italic font-serif font-normal">Growth Audit</span>
                </h3>
                {DIRECT_CALENDAR_MODE && (
                  <p className="text-xs text-white/60 hidden sm:block">
                    Select your preferred date & time for our 1-on-1 strategy session
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!DIRECT_CALENDAR_MODE && stage === "quiz" && (
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

          {/* Progress Bar (Visible only in multi-step quiz mode) */}
          {!DIRECT_CALENDAR_MODE && (
            <div className="w-full h-1 bg-white/10 shrink-0 relative overflow-hidden rounded-full my-2">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0FE3B3] to-[#D80064]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          )}

          {/* Body Content Area */}
          <div className="flex-1 w-full h-full min-h-0 overflow-y-auto pt-2 flex flex-col">
            {/* Stage 1: Diagnostic Quiz (rendered only if DIRECT_CALENDAR_MODE is false) */}
            {!DIRECT_CALENDAR_MODE && (
              <div
                className={`flex-1 flex-col justify-between max-w-2xl mx-auto w-full py-4 sm:py-6 px-1 ${
                  stage === "quiz" ? "flex" : "hidden"
                }`}
              >
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
                          placeholder="e.g. MyBrand.com"
                          className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#0FE3B3] transition-colors text-base sm:text-lg"
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
                        <span>Revenue Scale</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                        What is your current monthly online revenue?
                      </h4>
                      <div className="grid grid-cols-1 gap-3 mt-2">
                        {REVENUE_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => handleSelectOption("monthlyRevenue", opt.label)}
                            className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              answers.monthlyRevenue === opt.label
                                ? "bg-[#0FE3B3]/20 border-[#0FE3B3] text-white"
                                : "bg-white/5 border-white/10 hover:border-white/30 text-white/90 hover:bg-white/10"
                            }`}
                          >
                            <div>
                              <div className="font-bold text-base sm:text-lg">{opt.label}</div>
                              <div className="text-xs sm:text-sm text-white/60">{opt.sub}</div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-mono font-bold text-xs">
                              {opt.key}
                            </div>
                          </button>
                        ))}
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
                        <span>Paid Media Spend</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                        What is your monthly paid media spend?
                      </h4>
                      <div className="grid grid-cols-1 gap-3 mt-2">
                        {AD_SPEND_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => handleSelectOption("monthlyAdSpend", opt.label)}
                            className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              answers.monthlyAdSpend === opt.label
                                ? "bg-[#0FE3B3]/20 border-[#0FE3B3] text-white"
                                : "bg-white/5 border-white/10 hover:border-white/30 text-white/90 hover:bg-white/10"
                            }`}
                          >
                            <div>
                              <div className="font-bold text-base sm:text-lg">{opt.label}</div>
                              <div className="text-xs sm:text-sm text-white/60">{opt.sub}</div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-mono font-bold text-xs">
                              {opt.key}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Primary Bottleneck */}
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
                        <span>Current Bottleneck</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                        What is the #1 bottleneck preventing you from scaling?
                      </h4>
                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          rows={4}
                          value={answers.bottleneck}
                          onChange={(e) => {
                            setAnswers({ ...answers, bottleneck: e.target.value });
                            setErrorMsg("");
                          }}
                          placeholder="e.g. Ad fatigue, high CPA, low creative velocity, poor ROAS on Meta..."
                          className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#0FE3B3] transition-colors text-base resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Role in Brand */}
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
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                        What is your role in the brand?
                      </h4>
                      <div className="grid grid-cols-1 gap-3 mt-2">
                        {ROLE_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => handleSelectOption("role", opt.label)}
                            className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              answers.role === opt.label
                                ? "bg-[#0FE3B3]/20 border-[#0FE3B3] text-white"
                                : "bg-white/5 border-white/10 hover:border-white/30 text-white/90 hover:bg-white/10"
                            }`}
                          >
                            <div>
                              <div className="font-bold text-base sm:text-lg">{opt.label}</div>
                              <div className="text-xs sm:text-sm text-white/60">{opt.sub}</div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-mono font-bold text-xs">
                              {opt.key}
                            </div>
                          </button>
                        ))}
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
                        <span>Your Contact Details</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-4">
                        Where should we send your growth analysis?
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-white/70 mb-1">Full Name</label>
                          <input
                            ref={inputRef}
                            type="text"
                            value={answers.fullName}
                            onChange={(e) => {
                              setAnswers({ ...answers, fullName: e.target.value });
                              setErrorMsg("");
                            }}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#0FE3B3] transition-colors text-sm sm:text-base"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-white/70 mb-1">Work Email</label>
                          <input
                            type="email"
                            value={answers.email}
                            onChange={(e) => {
                              setAnswers({ ...answers, email: e.target.value });
                              setErrorMsg("");
                            }}
                            placeholder="john@yourbrand.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#0FE3B3] transition-colors text-sm sm:text-base"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-white/70 mb-1">Phone / WhatsApp</label>
                          <div className="flex gap-2 relative" ref={countryDropdownRef}>
                            <button
                              type="button"
                              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                              className="px-3 py-3 bg-white/5 border border-white/20 rounded-xl text-white flex items-center gap-1.5 shrink-0 hover:bg-white/10 transition-colors cursor-pointer text-sm"
                            >
                              <span>{selectedCountry.flag}</span>
                              <span className="font-mono text-xs text-white/80">{selectedCountry.code}</span>
                            </button>
                            {isCountryDropdownOpen && (
                              <div className="absolute top-full left-0 mt-1 w-64 max-h-48 overflow-y-auto bg-[#00103A] border border-white/20 rounded-xl shadow-xl z-50 p-1">
                                {COUNTRY_CODES.map((c) => (
                                  <button
                                    key={c.name}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setIsCountryDropdownOpen(false);
                                      setAnswers({ ...answers, phone: `${c.code} ${phoneRaw}`.trim() });
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs text-white hover:bg-white/10 rounded-lg flex items-center justify-between"
                                  >
                                    <span>
                                      {c.flag} {c.name}
                                    </span>
                                    <span className="font-mono text-white/60">{c.code}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                            <input
                              type="tel"
                              value={phoneRaw}
                              onChange={(e) => {
                                setPhoneRaw(e.target.value);
                                setAnswers({
                                  ...answers,
                                  phone: `${selectedCountry.code} ${e.target.value}`.trim(),
                                });
                                setErrorMsg("");
                              }}
                              placeholder="Phone or WhatsApp"
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#0FE3B3] transition-colors text-sm sm:text-base"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mt-3 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs sm:text-sm font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Footer Next Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#D80064] to-[#BF0058] hover:from-[#BF0058] hover:to-[#9F0048] text-white text-sm sm:text-base font-bold shadow-[0_0_25px_rgba(216,0,100,0.35)] transition-all duration-200 hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                  >
                    <span>{currentStep === TOTAL_STEPS ? "Select Date & Time" : "Continue"}</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Direct Cal.com Calendar Embed View */}
            <div
              className={`flex-1 w-full h-full min-h-0 flex-col overflow-hidden relative ${
                DIRECT_CALENDAR_MODE || stage === "calendar" ? "flex" : "hidden"
              }`}
            >
              {/* Sleek branded fallback loader behind iframe */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#00103A] z-0 pointer-events-none">
                <div className="w-10 h-10 border-2 border-[#0FE3B3]/20 border-t-[#0FE3B3] rounded-full animate-spin mb-3" />
                <p className="text-sm font-semibold text-white/80 tracking-wide">
                  Loading Growth Audit Calendar...
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Connecting to real-time available time slots
                </p>
              </div>

              <div className="relative z-10 flex-1 w-full h-full min-h-0 overflow-hidden rounded-xl sm:rounded-2xl">
                <Cal
                  namespace="free-growth-audit"
                  calLink={calLink}
                  style={{ width: "100%", height: "100%", overflow: "scroll" }}
                  config={calConfig}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
