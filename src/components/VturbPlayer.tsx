"use client";

import { useEffect } from "react";

interface VturbPlayerProps {
  videoId?: string;
  className?: string;
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
