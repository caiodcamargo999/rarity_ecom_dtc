"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Activity, AlertCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin/analytics";

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) {
      setError(`Security lockout active. Please wait ${lockoutSeconds} seconds.`);
      return;
    }

    if (!password.trim()) {
      setError("Please enter your access key.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password.trim(),
          _hp_sec: honeypot, // Honeypot field for bot trapping
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push(redirectTarget);
      } else {
        if (data.retryAfter) {
          setLockoutSeconds(Number(data.retryAfter) || 900);
        }
        setError(data.message || "Invalid access key. Access denied.");
      }
    } catch {
      setError("Secure gateway connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full max-w-sm bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
    >
      {/* Header Icon */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-zinc-850 border border-zinc-750 flex items-center justify-center text-cyan-400 mb-3.5 shadow-md">
          <Activity className="w-6 h-6" strokeWidth={2} />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 mb-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-zinc-300 uppercase font-semibold">
            Rarity Security Gateway
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-zinc-100 font-mono">
          Executive Portal
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Zero-trust authenticated access to live telemetry, revenue & heatmaps.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Invisible Honeypot field (bots fill this, humans don't) */}
        <div className="hidden opacity-0 pointer-events-none absolute -left-[9999px]" aria-hidden="true">
          <input
            type="text"
            name="_hp_sec"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 uppercase tracking-wider font-mono">
            Access Key
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              disabled={lockoutSeconds > 0}
              className="w-full pl-9 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono disabled:opacity-50"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-start gap-2 font-medium">
              {lockoutSeconds > 0 ? (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>
                {error}
                {lockoutSeconds > 0 && ` (Lockout: ${lockoutSeconds}s)`}
              </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || lockoutSeconds > 0}
          className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md active:scale-[0.99]"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
          ) : (
            <>
              <span>Enter Analytics Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Footer info */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          HMAC-SHA256 Shield
        </span>
        <span className="text-zinc-400">Rate Limiter Active</span>
      </div>
    </motion.div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans antialiased">
      {/* Subtle Radial Vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))] pointer-events-none -z-10" />

      <Suspense fallback={<div className="w-full max-w-sm h-80 bg-zinc-900/40 rounded-2xl animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
