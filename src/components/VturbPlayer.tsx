"use client";

import { useEffect } from "react";

interface VturbPlayerProps {
  videoId?: string;
  className?: string;
}

export function pauseAllVturbVideos() {
  if (typeof window === "undefined") return;

  try {
    // 1. Pause via VTurb global smartplayer instances
    const sp = (window as any).smartplayer;
    if (sp && sp.instances && Array.isArray(sp.instances)) {
      sp.instances.forEach((inst: any) => {
        try {
          if (typeof inst?.pause === "function") inst.pause();
        } catch (e) {}
      });
    }

    // 2. Pause all native HTML5 video elements in document
    document.querySelectorAll("video").forEach((v) => {
      try {
        v.pause();
      } catch (e) {}
    });

    // 3. Pause vturb-smartplayer custom elements and shadow roots
    document.querySelectorAll("vturb-smartplayer").forEach((el: any) => {
      try {
        if (typeof el?.pause === "function") el.pause();
        if (el?.player && typeof el.player.pause === "function") el.player.pause();
        if (el?.shadowRoot) {
          el.shadowRoot.querySelectorAll("video").forEach((v: HTMLVideoElement) => {
            try {
              v.pause();
            } catch (e) {}
          });
        }
      } catch (e) {}
    });
  } catch (err) {
    console.error("Error pausing VTurb videos:", err);
  }
}

export default function VturbPlayer({
  videoId = "vid-6aad51ea85641ef58dd2f744",
  className = "",
}: VturbPlayerProps) {
  useEffect(() => {
    // Dynamically inject player script if not already present
    const scriptId = "vturb-player-js-6aad51ea85641ef58dd2f744";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src =
        "https://scripts.converteai.net/09142a2a-f8a3-4494-907a-9caa59d978dd/players/6aad51ea85641ef58dd2f744/v4/player.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black transition-all duration-300 hover:border-[#0FE3B3]/60 hover:shadow-[0_0_40px_rgba(15,227,179,0.25)] ${className}`}
    >
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
    </div>
  );
}
