"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const UTM_STORAGE_KEY = "rarity_utms";

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  fbc?: string;
  fbp?: string;
  [key: string]: string | undefined;
}

export function getStoredUtms(): UtmData {
  if (typeof window === "undefined") return {};

  try {
    const sessionData = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (sessionData) return JSON.parse(sessionData);

    const localData = localStorage.getItem(UTM_STORAGE_KEY);
    if (localData) return JSON.parse(localData);
  } catch (e) {
    // Ignore storage parse errors
  }

  return {};
}

function TrackerInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "gclid",
      "fbc",
      "fbp",
    ];

    const captured: UtmData = { ...getStoredUtms() };
    let hasNewData = false;

    for (const key of utmKeys) {
      const val = searchParams.get(key);
      if (val) {
        captured[key] = val;
        hasNewData = true;
      }
    }

    // Capture _fbc / _fbp cookies if present
    const cookies = document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k && v) acc[k] = decodeURIComponent(v);
      return acc;
    }, {} as Record<string, string>);

    if (cookies["_fbc"] && !captured.fbc) {
      captured.fbc = cookies["_fbc"];
      hasNewData = true;
    }
    if (cookies["_fbp"] && !captured.fbp) {
      captured.fbp = cookies["_fbp"];
      hasNewData = true;
    }

    if (hasNewData) {
      try {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
        localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
        console.log("✅ [Attribution] UTMs and Click IDs captured:", captured);
      } catch (e) {
        // Storage quota / privacy error
      }
    }
  }, [searchParams]);

  return null;
}

export default function UtmTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}
