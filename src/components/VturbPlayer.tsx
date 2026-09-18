"use client";

import { useEffect } from "react";

interface VturbPlayerProps {
  videoId?: string;
  className?: string;
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
