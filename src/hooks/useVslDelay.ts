"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseVslDelayOptions {
  delaySeconds?: number;
  storageKey?: string;
  progressStorageKey?: string;
}

export function useVslDelay({
  delaySeconds = 60,
  storageKey = "rarity_vsl_pitch_unlocked",
  progressStorageKey = "rarity_vsl_played_seconds",
}: UseVslDelayOptions = {}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedPlay, setHasStartedPlay] = useState(false);

  // Refs prevent stale closures in async tickers and event listeners
  const isUnlockedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const playedSecondsRef = useRef(0);
  const tickerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickTimeRef = useRef<number | null>(null);

  const saveProgress = useCallback(
    (seconds: number) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(progressStorageKey, String(Math.round(seconds * 10) / 10));
      } catch (e) {}
    },
    [progressStorageKey]
  );

  const unlock = useCallback(() => {
    isUnlockedRef.current = true;
    setIsUnlocked(true);
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, "true");
        localStorage.setItem(progressStorageKey, String(delaySeconds));
      } catch (e) {}
    }
  }, [delaySeconds, storageKey, progressStorageKey]);

  // Handle play / start playback (resumes countdown from current accumulated watch time)
  const startPlayback = useCallback(() => {
    setHasStartedPlay(true);
    if (isUnlockedRef.current) return;

    isPlayingRef.current = true;
    setIsPlaying(true);
    lastTickTimeRef.current = Date.now();

    // Start active ticker (ticks every 200ms to accumulate real played seconds)
    if (!tickerRef.current) {
      tickerRef.current = setInterval(() => {
        if (!isPlayingRef.current || isUnlockedRef.current) return;

        const now = Date.now();
        if (lastTickTimeRef.current) {
          const delta = (now - lastTickTimeRef.current) / 1000;
          playedSecondsRef.current += delta;
        }
        lastTickTimeRef.current = now;

        if (playedSecondsRef.current >= delaySeconds) {
          unlock();
        } else {
          saveProgress(playedSecondsRef.current);
        }
      }, 200);
    }
  }, [delaySeconds, saveProgress, unlock]);

  // Handle pause / halt playback (preserves elapsed progress so resuming doesn't start from 0)
  const pausePlayback = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    if (lastTickTimeRef.current && !isUnlockedRef.current) {
      const now = Date.now();
      const delta = (now - lastTickTimeRef.current) / 1000;
      playedSecondsRef.current += delta;
      lastTickTimeRef.current = null;
    }

    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }

    saveProgress(playedSecondsRef.current);

    if (playedSecondsRef.current >= delaySeconds) {
      unlock();
    }
  }, [delaySeconds, saveProgress, unlock]);

  // Handle timeupdate from VTurb or internal video element
  const handleTimeUpdate = useCallback(
    (currentTime: number) => {
      if (isUnlockedRef.current) return;

      if (currentTime > 0) {
        if (!isPlayingRef.current) {
          startPlayback();
        }
        // Sync with video's actual currentTime if it's further along
        if (currentTime > playedSecondsRef.current) {
          playedSecondsRef.current = currentTime;
        }
      }

      if (playedSecondsRef.current >= delaySeconds || currentTime >= delaySeconds) {
        unlock();
      }
    },
    [delaySeconds, startPlayback, unlock]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check URL parameters for instant preview / unlock bypass (?preview=true, ?unlock=true, ?cta=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get("preview") === "true" ||
      urlParams.get("unlock") === "true" ||
      urlParams.get("cta") === "true"
    ) {
      unlock();
      return;
    }

    // 2. Check localStorage if user already reached 60s in a previous session
    try {
      if (localStorage.getItem(storageKey) === "true") {
        isUnlockedRef.current = true;
        setIsUnlocked(true);
        return;
      }

      // Check for previously saved partial watch progress
      const storedProgress = parseFloat(localStorage.getItem(progressStorageKey) || "0");
      if (!isNaN(storedProgress) && storedProgress > 0) {
        playedSecondsRef.current = storedProgress;
        if (storedProgress >= delaySeconds) {
          unlock();
          return;
        }
      }
    } catch (e) {}

    // 3. Listen for global VTurb / custom events
    const onCustomPlay = () => startPlayback();
    const onCustomPause = () => pausePlayback();
    const onCustomTimeUpdate = (e: any) => {
      const time = e?.detail?.currentTime ?? e?.detail ?? 0;
      if (typeof time === "number") {
        handleTimeUpdate(time);
      }
    };
    const onCustomUnlock = () => unlock();

    window.addEventListener("rarity:video:play", onCustomPlay);
    window.addEventListener("rarity:video:pause", onCustomPause);
    window.addEventListener("rarity:video:timeupdate", onCustomTimeUpdate);
    window.addEventListener("rarity:video:unlock", onCustomUnlock);

    return () => {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
      window.removeEventListener("rarity:video:play", onCustomPlay);
      window.removeEventListener("rarity:video:pause", onCustomPause);
      window.removeEventListener("rarity:video:timeupdate", onCustomTimeUpdate);
      window.removeEventListener("rarity:video:unlock", onCustomUnlock);
    };
  }, [
    delaySeconds,
    handleTimeUpdate,
    pausePlayback,
    progressStorageKey,
    startPlayback,
    storageKey,
    unlock,
  ]);

  return {
    isUnlocked,
    isPlaying,
    hasStartedPlay,
    playedSeconds: playedSecondsRef.current,
    startPlayback,
    pausePlayback,
    handleTimeUpdate,
    unlock,
  };
}
