"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { getStoredUtms, UtmData } from "@/components/UtmTracker";
import { getTracker, getVisitorInfo } from "@/lib/tracker";

export const BOOKING_SECTION_ID = "book-a-call";
const CAL_NAMESPACE = "free-growth-audit";
const CAL_LINK = "caiodecamargo/free-growth-audit";

/** Smoothly scrolls to the inline calendar. Used by every CTA on the page. */
export function scrollToBooking() {
  if (typeof document === "undefined") return;
  try {
    getTracker().trackEvent("cta_click", "Scroll to inline calendar", {});
  } catch {
    // tracking must never block the scroll
  }
  const el = document.getElementById(BOOKING_SECTION_ID);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

interface BookingSectionProps {
  lang?: "en" | "pt";
  variant?: "dark" | "navy";
}

export default function BookingSection({ lang = "en", variant = "dark" }: BookingSectionProps) {
  const [utms, setUtms] = useState<UtmData>({});
  const utmsRef = useRef<UtmData>({});
  const handledRef = useRef(false);

  useEffect(() => {
    const captured = getStoredUtms();
    setUtms(captured);
    utmsRef.current = captured;
  }, []);

  const calLink = useMemo(() => {
    const params = new URLSearchParams();
    (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const).forEach((k) => {
      if (utms[k]) params.set(k, utms[k] as string);
    });
    const qs = params.toString();
    return qs ? `${CAL_LINK}?${qs}` : CAL_LINK;
  }, [utms]);

  const calConfig = useMemo(() => {
    const c: Record<string, string> = { layout: "month_view", useSlotsViewOnSmallScreen: "true" };
    (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "fbc", "fbp"] as const).forEach(
      (k) => {
        if (utms[k]) c[k] = utms[k] as string;
      }
    );
    return c;
  }, [utms]);

  useEffect(() => {
    const handleBookingComplete = (detail: any) => {
      if (handledRef.current) return;
      handledRef.current = true;

      const latestUtms = utmsRef.current;
      const booking = detail.booking || detail;
      const attendees = Array.isArray(booking.attendees)
        ? booking.attendees
        : Array.isArray(detail.attendees)
        ? detail.attendees
        : [];
      const primary = attendees[0] || {};
      const responses =
        booking.responses || detail.responses || booking.userFieldsResponses || detail.userFieldsResponses || {};

      const fullName = (
        detail.name || booking.name || primary.name || responses.name?.value || responses.name || ""
      ).toString();
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const email =
        detail.email || booking.email || primary.email || responses.email?.value || responses.email || "";
      const phone =
        detail.phone ||
        detail.phoneNumber ||
        booking.phone ||
        booking.phoneNumber ||
        primary.phoneNumber ||
        primary.phone ||
        responses.phone?.value ||
        responses.phone ||
        responses.phoneNumber?.value ||
        responses.phoneNumber ||
        "";
      const meetingDate = detail.date || detail.startTime || booking.startTime || booking.date || "";
      const timeZone = primary.timeZone || detail.timeZone || booking.timeZone || "America/Sao_Paulo";

      if (!email && !phone && !fullName) return;

      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "bookingSuccessful",
        data: detail,
        name: fullName,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        store: "Ecom Brand",
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

      const visitorInfo = getVisitorInfo();
      getTracker().identifyLead({
        fullName,
        email,
        phone,
        brandOrStore: "Ecom Brand",
        monthlyRevenue: "",
        monthlyAdSpend: "",
        bottleneck: "",
        role: "",
        scheduledOnCal: "Yes",
        meetingDate,
      });

      fetch("/api/audit-diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_booking_status",
          brandOrStore: "Ecom Brand",
          monthlyRevenue: "",
          monthlyAdSpend: "",
          bottleneck: "",
          role: "",
          fullName,
          email,
          phone,
          scheduledOnCal: "Yes",
          meetingDate,
          timeZone,
          utms: latestUtms,
          visitorId: visitorInfo.visitorId,
          sessionId: visitorInfo.sessionId,
        }),
        keepalive: true,
      }).catch((err) => console.error("Error syncing booking status:", err));
    };

    (async function () {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#D80064" },
          dark: { "cal-brand": "#D80064" },
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

    const onMessage = (event: MessageEvent) => {
      try {
        const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (
          msg?.action === "bookingSuccessful" ||
          msg?.type === "cal:bookingSuccessful" ||
          msg?.event === "bookingSuccessful"
        ) {
          handleBookingComplete(msg?.data || msg?.detail || {});
        }
      } catch {
        // ignore non-JSON messages
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const bg = variant === "navy" ? "bg-[#001244]" : "bg-black";

  return (
    <section
      id={BOOKING_SECTION_ID}
      className={`${bg} relative z-10 px-4 py-16 sm:py-20 scroll-mt-4`}
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="mb-8 text-center text-[26px] font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          {lang === "pt" ? "Quer ver se somos a escolha certa? Aplique aqui:" : "Want to see if we're a fit? Apply here:"}
        </h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
          <Cal
            namespace={CAL_NAMESPACE}
            calLink={calLink}
            style={{ width: "100%", minHeight: 620, overflow: "auto" }}
            config={calConfig}
          />
        </div>
      </div>
    </section>
  );
}
