"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseVslDelayOptions {
  delaySeconds?: number;
  storageKey?: string;
}

export function useVslDelay({
  delaySeconds = 60,
  storageKey = "rarity_vsl_pitch_unlocked",
}: UseVslDelayOptions = {}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasStartedPlay, setHasStartedPlay] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const unlock = useCallback(() => {
    setIsUnlocked(true);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, "true");
      } catch (e) {
        // Ignore localStorage errors (e.g. incognito restrictions)
      }
    }
  }, [storageKey]);

  const startPlayback = useCallback(() => {
    setHasStartedPlay(true);
    if (isUnlocked) return;

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        unlock();
      }, delaySeconds * 1000);
    }
  }, [delaySeconds, isUnlocked, unlock]);

  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      if (currentTime >= delaySeconds) {
        unlock();
      } else if (currentTime > 0 && !hasStartedPlay) {
        startPlayback();
      }
    },
    [delaySeconds, hasStartedPlay, startPlayback, unlock]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check URL parameters for instant preview / unlock
    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get("preview") === "true" ||
      urlParams.get("unlock") === "true" ||
      urlParams.get("cta") === "true"
    ) {
      unlock();
      return;
    }

    // 2. Check localStorage if user already watched in a previous session
    try {
      if (localStorage.getItem(storageKey) === "true") {
        setIsUnlocked(true);
        return;
      }
    } catch (e) {}

    // 3. Listen for global VTurb / custom events
    const onCustomPlay = () => startPlayback();
    const onCustomUnlock = () => unlock();

    window.addEventListener("rarity:video:play", onCustomPlay);
    window.addEventListener("rarity:video:unlock", onCustomUnlock);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("rarity:video:play", onCustomPlay);
      window.removeEventListener("rarity:video:unlock", onCustomUnlock);
    };
  }, [storageKey, unlock, startPlayback]);

  return {
    isUnlocked,
    hasStartedPlay,
    startPlayback,
    handleTimeUpdate,
    unlock,
  };
}
