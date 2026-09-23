"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, X, ArrowUpRight } from "lucide-react";

interface VturbPlayerProps {
  videoId?: string;
  className?: string;
  delaySeconds?: number;
  enableFloatingOnScroll?: boolean;
  floatingPosition?: "bottom-right" | "bottom-left";
  floatingTitle?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onUnlock?: () => void;
}

export function pauseAllVturbVideos() {
  if (typeof window === "undefined") return;

  const executePause = () => {
    try {
      // 1. Traverse window.smartplayer global object & instances
      const sp = (window as any).smartplayer;
      if (sp) {
        if (typeof sp.pause === "function") sp.pause();
        if (typeof sp.playback?.pause === "function") sp.playback.pause();

        const instances = sp.instances
          ? Array.isArray(sp.instances)
            ? sp.instances
            : Object.values(sp.instances)
          : [];

        instances.forEach((inst: any) => {
          try {
            if (typeof inst?.playback?.pause === "function") inst.playback.pause();
            if (typeof inst?.player?.playback?.pause === "function") inst.player.playback.pause();
            if (typeof inst?.video?.pause === "function") inst.video.pause();
            if (typeof inst?.pause === "function") inst.pause();
            if (typeof inst?.player?.pause === "function") inst.player.pause();
          } catch (e) {}
        });
      }

      // 2. Target all <vturb-smartplayer> custom elements directly
      document.querySelectorAll("vturb-smartplayer").forEach((el: any) => {
        try {
          if (typeof el?.playback?.pause === "function") el.playback.pause();
          if (typeof el?.player?.playback?.pause === "function") el.player.playback.pause();
          if (typeof el?.video?.pause === "function") el.video.pause();
          if (typeof el?.pause === "function") el.pause();
          if (typeof el?.player?.pause === "function") el.player.pause();
          if (typeof el?.smartplayer?.playback?.pause === "function") el.smartplayer.playback.pause();
          if (typeof el?.smartplayer?.pause === "function") el.smartplayer.pause();
        } catch (e) {}

        if (el?.shadowRoot) {
          try {
            el.shadowRoot.querySelectorAll("video").forEach((v: HTMLVideoElement) => {
              try {
                v.pause();
              } catch (e) {}
            });
          } catch (e) {}
        }
      });

      // 3. Deep search all video elements in DOM and shadow roots
      const pauseAllVideosInTree = (root: Document | ShadowRoot | Element) => {
        try {
          root.querySelectorAll("video").forEach((v) => {
            try {
              v.pause();
            } catch (e) {}
          });
        } catch (e) {}

        try {
          root.querySelectorAll("*").forEach((child) => {
            if (child.shadowRoot) {
              pauseAllVideosInTree(child.shadowRoot);
            }
          });
        } catch (e) {}
      };

      pauseAllVideosInTree(document);

      // 4. Send postMessage to any iframes
      document.querySelectorAll("iframe").forEach((iframe) => {
        try {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
            "*"
          );
          iframe.contentWindow?.postMessage({ type: "pause" }, "*");
        } catch (e) {}
      });
    } catch (err) {
      console.error("Error pausing VTurb videos:", err);
    }
  };

  // Run immediately and repeatedly over 500ms to catch active playback frames
  executePause();
  setTimeout(executePause, 40);
  setTimeout(executePause, 120);
  setTimeout(executePause, 250);
  setTimeout(executePause, 500);
}

export default function VturbPlayer({
  videoId = "vid-6aad51ea85641ef58dd2f744",
  className = "",
  delaySeconds = 0,
  enableFloatingOnScroll = false,
  floatingPosition = "bottom-right",
  floatingTitle = "Rarity Growth VSL",
  onPlay,
  onPause,
  onTimeUpdate,
  onUnlock,
}: VturbPlayerProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Dynamically inject player script if not already present
    const scriptId = "vturb-player-js-6aad51ea85641ef58dd2f744";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src =
        "https://scripts.converteai.net/09142a2a-f8a3-4494-907a-9caa59d978dd/players/6aad51ea85641ef58dd2f744/v4/player.js";
      s.async = true;
      document.head.appendChild(s);
    }

    const playerEl = document.getElementById(videoId);

    const triggerPlay = () => {
      onPlay?.();
      window.dispatchEvent(new CustomEvent("rarity:video:play"));
    };

    const triggerPause = () => {
      onPause?.();
      window.dispatchEvent(new CustomEvent("rarity:video:pause"));
    };

    const triggerTimeUpdate = (currentTime: number) => {
      onTimeUpdate?.(currentTime);
      window.dispatchEvent(
        new CustomEvent("rarity:video:timeupdate", { detail: { currentTime } })
      );
      if (delaySeconds > 0 && currentTime >= delaySeconds) {
        triggerUnlock();
      }
    };

    const triggerUnlock = () => {
      onUnlock?.();
      window.dispatchEvent(new CustomEvent("rarity:video:unlock"));
    };

    const handlePlayerReady = () => {
      // Use VTurb's native displayHiddenElements method if supported and delaySeconds is positive
      try {
        const el: any = document.getElementById(videoId);
        if (el && typeof el.displayHiddenElements === "function" && delaySeconds > 0) {
          el.displayHiddenElements(delaySeconds, [".vsl-delayed-cta", ".esconder"], {
            persist: true,
          });
        }
      } catch (e) {}
    };

    const onTimeUpdateListener = (e: any) => {
      const time = e?.target?.currentTime || 0;
      triggerTimeUpdate(time);
    };

    if (playerEl) {
      playerEl.addEventListener("player:ready", handlePlayerReady);
      playerEl.addEventListener("play", triggerPlay);
      playerEl.addEventListener("playing", triggerPlay);
      playerEl.addEventListener("pause", triggerPause);
      playerEl.addEventListener("ended", triggerPause);
      playerEl.addEventListener("waiting", triggerPause);
      playerEl.addEventListener("timeupdate", onTimeUpdateListener);
    }

    // 2. Poll window.smartplayer instances to attach timeupdate, play, and pause hooks
    let pollInterval = setInterval(() => {
      try {
        const sp = (window as any).smartplayer;
        if (sp && sp.instances) {
          const instances = Array.isArray(sp.instances)
            ? sp.instances
            : Object.values(sp.instances);

          instances.forEach((inst: any) => {
            if (!inst.__hasDelayListeners) {
              inst.__hasDelayListeners = true;

              if (typeof inst.on === "function") {
                inst.on("play", triggerPlay);
                inst.on("playing", triggerPlay);
                inst.on("pause", triggerPause);
                inst.on("ended", triggerPause);
                inst.on("timeupdate", () => {
                  const curr =
                    inst?.video?.currentTime ??
                    inst?.playback?.currentTime ??
                    inst?.player?.currentTime ??
                    0;
                  triggerTimeUpdate(curr);
                });
              }

              if (inst.video) {
                inst.video.addEventListener("play", triggerPlay);
                inst.video.addEventListener("playing", triggerPlay);
                inst.video.addEventListener("pause", triggerPause);
                inst.video.addEventListener("ended", triggerPause);
                inst.video.addEventListener("timeupdate", () => {
                  const curr = inst.video.currentTime || 0;
                  triggerTimeUpdate(curr);
                });
              }
            }
          });
        }

        // Also check shadowRoot video elements directly
        if (playerEl && (playerEl as any).shadowRoot) {
          (playerEl as any).shadowRoot.querySelectorAll("video").forEach((v: HTMLVideoElement) => {
            if (!(v as any).__hasDelayListeners) {
              (v as any).__hasDelayListeners = true;
              v.addEventListener("play", triggerPlay);
              v.addEventListener("playing", triggerPlay);
              v.addEventListener("pause", triggerPause);
              v.addEventListener("ended", triggerPause);
              v.addEventListener("timeupdate", () => {
                triggerTimeUpdate(v.currentTime || 0);
              });
            }
          });
        }
      } catch (e) {}
    }, 400);

    return () => {
      clearInterval(pollInterval);
      if (playerEl) {
        playerEl.removeEventListener("player:ready", handlePlayerReady);
        playerEl.removeEventListener("play", triggerPlay);
        playerEl.removeEventListener("playing", triggerPlay);
        playerEl.removeEventListener("pause", triggerPause);
        playerEl.removeEventListener("ended", triggerPause);
        playerEl.removeEventListener("waiting", triggerPause);
        playerEl.removeEventListener("timeupdate", onTimeUpdateListener);
      }
    };
  }, [videoId, delaySeconds, onPlay, onPause, onTimeUpdate, onUnlock]);

  // 3. Setup IntersectionObserver for scroll-triggered floating video toggle
  useEffect(() => {
    if (!enableFloatingOnScroll || !anchorRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Check if the hero video container has scrolled above the viewport
        const isScrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;

        if (isScrolledPast) {
          setIsFloating(true);
        } else if (entry.isIntersecting) {
          setIsFloating(false);
          // Reset dismissed state when returning back to hero view
          setIsDismissed(false);
        }
      },
      {
        threshold: [0, 0.1],
        rootMargin: "-20px 0px 0px 0px",
      }
    );

    observer.observe(anchorRef.current);

    return () => {
      observer.disconnect();
    };
  }, [enableFloatingOnScroll]);

  const handleContainerClick = () => {
    onPlay?.();
    window.dispatchEvent(new CustomEvent("rarity:video:play"));
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
  };

  const handleScrollToHero = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const isActuallyFloating = enableFloatingOnScroll && isFloating && !isDismissed;

  const positionClasses =
    floatingPosition === "bottom-left"
      ? "bottom-4 left-4 sm:bottom-6 sm:left-6"
      : "bottom-4 right-4 sm:bottom-6 sm:right-6";

  return (
    <div ref={anchorRef} className={`relative w-full ${className}`}>
      {/* Stationary placeholder when floating to eliminate layout shift (CLS) */}
      {isActuallyFloating && (
        <div
          className="w-full pb-[56.25%] rounded-2xl sm:rounded-3xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center cursor-pointer transition-all hover:border-brand-teal/40"
          onClick={handleScrollToHero}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 hover:text-brand-teal gap-2 transition-colors">
            <span className="text-xs font-mono uppercase tracking-wider">
              Video Playing in Floating Corner
            </span>
            <span className="text-xs text-brand-teal font-semibold flex items-center gap-1">
              Click to return here <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* Main Player Container (switches to fixed in floating mode without unmounting DOM) */}
      <div
        onClick={handleContainerClick}
        className={
          isActuallyFloating
            ? `fixed ${positionClasses} z-40 w-[230px] xs:w-[270px] sm:w-[360px] md:w-[400px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(15,227,179,0.35)] border-2 border-brand-teal bg-[#000c2e] backdrop-blur-xl transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-6 group`
            : `relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black transition-all duration-300 hover:border-[#0FE3B3]/60 hover:shadow-[0_0_40px_rgba(15,227,179,0.25)]`
        }
      >
        {/* Floating Mini-Player Header */}
        {isActuallyFloating && (
          <div className="flex items-center justify-between px-3 py-2 bg-[#00103A]/95 border-b border-brand-teal/30 select-none text-white text-xs">
            <button
              onClick={handleScrollToHero}
              className="flex items-center gap-2 hover:text-brand-teal transition-colors font-semibold truncate max-w-[70%] text-left"
              title="Click to scroll back to video"
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
              </span>
              <span className="truncate text-[11px] sm:text-xs font-mono tracking-tight text-white/95">
                {floatingTitle}
              </span>
            </button>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Expand button */}
              <button
                onClick={handleScrollToHero}
                className="p-1 rounded-md bg-white/10 hover:bg-brand-teal hover:text-black text-white/90 transition-all cursor-pointer"
                aria-label="Expand video / Scroll to top"
                title="Scroll back to video"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="p-1 rounded-md bg-white/10 hover:bg-red-500/80 hover:text-white text-white/90 transition-all cursor-pointer"
                aria-label="Close floating video"
                title="Dismiss mini player"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* @ts-ignore */}
        <vturb-smartplayer
          id={videoId}
          style={{ display: "block", margin: "0 auto", width: "100%" }}
        >
          <div
            className="vturb-player-placeholder"
            style={{
              position: "relative",
              width: "100%",
              padding: "56.25% 0 0",
              zIndex: 0,
              backgroundColor: "black",
            }}
          />
        {/* @ts-ignore */}
        </vturb-smartplayer>

        {/* Floating Mini-Player Bottom Bar */}
        {isActuallyFloating && (
          <div
            onClick={handleScrollToHero}
            className="px-3 py-1.5 bg-[#000820]/95 hover:bg-brand-teal/20 text-center cursor-pointer border-t border-white/10 transition-colors flex items-center justify-center gap-1.5 select-none"
          >
            <span className="text-[10px] sm:text-[11px] font-extrabold text-brand-teal tracking-wider uppercase flex items-center gap-1">
              <span>Back to Top View</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

