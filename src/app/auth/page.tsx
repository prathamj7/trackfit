"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") || "/tracker";

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Basic validation
  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const nameValid = name.trim().length >= 2;
  const otpValid = /^\d{6}$/.test(otp);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSend = async () => {
    setError(null);
    setInfo(null);
    if (!nameValid || !emailValid) {
      setError("Please enter a valid name and email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send OTP");
      setInfo("We sent a 6-digit code to your email. It expires in 10 minutes.");
      setStep(2);
      setCooldown(30);
    } catch (e: any) {
      setError(e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setInfo(null);
    if (!otpValid) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: otp.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Verification failed");

      // Persist session token for future API calls
      localStorage.setItem("bearer_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setInfo("Success! Redirecting...");
      setTimeout(() => router.push(redirect), 400);
    } catch (e: any) {
      setError(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await handleSend();
  };

  return (
    <div className="min-h-[100dvh] grid place-items-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">💪</span>
            <h1 className="text-xl font-semibold tracking-tight">TrackFit</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Sign in securely with a one-time code sent to your email.</p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block text-muted-foreground">Full Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                placeholder="Jane Doe"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted-foreground">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                placeholder="jane@example.com"
              />
            </label>
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-foreground shadow disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              We sent a code to <span className="text-foreground font-medium">{email}</span>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block text-muted-foreground">Enter 6-digit code</span>
              <input
                inputMode="numeric"
                pattern="\\d{6}"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                className="w-full tracking-[0.5em] text-center text-lg rounded-lg border border-border bg-background px-3 py-2"
                placeholder="••••••"
              />
            </label>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-foreground shadow disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                className="underline-offset-2 hover:underline disabled:no-underline disabled:opacity-60"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
              <button onClick={() => setStep(1)} className="underline-offset-2 hover:underline">Change email</button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        {info && !error && (
          <div className="mt-4 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
            {info}
          </div>
        )}

        <div className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our terms. We never share your email.
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm underline underline-offset-4 hover:text-foreground"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}