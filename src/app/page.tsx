"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type LogEntry = {
  id: number;
  date: string; // YYYY-MM-DD
  exercise: string;
  sets: number;
  reps: number;
  weight: number; // in kg
};

const seed: LogEntry[] = [
  { id: 1, date: "2025-09-01", exercise: "Bench Press", sets: 4, reps: 8, weight: 60 },
  { id: 2, date: "2025-09-04", exercise: "Squat", sets: 5, reps: 5, weight: 90 },
  { id: 3, date: "2025-09-08", exercise: "Deadlift", sets: 3, reps: 5, weight: 110 },
  { id: 4, date: "2025-09-12", exercise: "Bench Press", sets: 4, reps: 6, weight: 70 },
  { id: 5, date: "2025-09-15", exercise: "Squat", sets: 5, reps: 3, weight: 110 },
];

function epley1RM(weight: number, reps: number) {
  return Math.round(weight * (1 + reps / 30));
}

function totalVolume(entry: LogEntry) {
  return entry.sets * entry.reps * entry.weight;
}

function useSmoothScroll() {
  const scrollTo = (el: HTMLElement | null) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return scrollTo;
}

export default function LandingPage() {
  const demoRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const scrollTo = useSmoothScroll();

  // Theme toggle (persisted)
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("theme") as "dark" | "light" | null)) || null;
    const initial = saved || "dark";
    setTheme(initial);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", initial === "dark");
    }
  }, []);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") localStorage.setItem("theme", next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Animated Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[20%] opacity-30 blur-3xl">
          <motion.div
            initial={{ scale: 1, rotate: 0 }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="size-full rounded-[40%] bg-gradient-to-br from-[oklch(0.88_0.14_264)] via-[oklch(0.92_0.08_180)] to-[oklch(0.94_0.08_112)] dark:from-[oklch(0.42_0.18_264)] dark:via-[oklch(0.32_0.08_240)] dark:to-[oklch(0.32_0.1_112)]"
          />
        </div>
        <motion.div
          className="absolute right-10 top-16 text-7xl select-none"
          initial={{ y: -10 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🏋️
        </motion.div>
        <motion.div
          className="absolute left-8 bottom-10 text-6xl select-none"
          initial={{ y: 0 }}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          🥇
        </motion.div>
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">💪</span>
          <span className="text-lg font-semibold tracking-tight">TrackFit</span>
        </div>
        <nav className="hidden gap-6 text-sm md:flex">
          <button className="hover:opacity-80" onClick={() => scrollTo(featuresRef.current)}>Features</button>
          <a className="hover:opacity-80" href="#footer">Contact</a>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm">
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          <a href="/auth" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90">Get Started</a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-6 pt-10 md:grid-cols-2 md:pt-20">
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl"
          >
            Track your lifts. See your progress. Own your story.
          </motion.h1>
          <p className="text-pretty text-muted-foreground md:text-lg">
            TrackFit is your focused companion for logging workouts, visualizing progress, and building unstoppable momentum—one rep at a time.
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row">
            <a
              href="/auth"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-primary-foreground shadow-md transition hover:opacity-90"
            >
              Get Started
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <button
              onClick={() => scrollTo(featuresRef.current)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 text-foreground/90 hover:bg-accent"
            >
              Explore Features
            </button>
          </div>
          <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><span className="text-lg">✅</span> No fluff, just gains</div>
            <div className="flex items-center gap-2"><span className="text-lg">🔒</span> Privacy-first</div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop"
            alt="Athlete training with barbell"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl ring-1 ring-border/60"
          />
          <div className="absolute -bottom-4 left-4 right-4 rounded-xl border border-border bg-card/80 p-4 backdrop-blur">
            <p className="text-sm text-muted-foreground">"Every workout is a vote for the person you want to become."</p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">Everything you need to train with intent</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Exercise Tracking",
              desc: "Log sets, reps, weight, RPE—fast. Create custom movements that fit your program.",
              emoji: "📋",
            },
            {
              title: "Progress Analytics",
              desc: "Spot plateaus and PRs with volume, intensity, and 1RM trends at a glance.",
              emoji: "📈",
            },
            {
              title: "Workout Logging",
              desc: "Templates and timers keep you focused in-session—less tapping, more training.",
              emoji: "⏱️",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="text-3xl">{f.emoji}</div>
              <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Momentum looks good on you</h2>
          <p className="mt-2 text-muted-foreground">Real training. Real progress. Real people.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Alex", progress: "+35kg Bench", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop", quote: "The charts made it obvious where to push and when to recover.",
            },
            {
              name: "Sam", progress: "+60kg Deadlift", img: "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?q=80&w=1200&auto=format&fit=crop", quote: "Logging became addictive—in the best way.",
            },
            {
              name: "Rina", progress: "3x BW Squat", img: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=1200&auto=format&fit=crop", quote: "I finally know if I'm actually progressing week to week.",
            },
          ].map((t) => (
            <figure key={t.name} className="overflow-hidden rounded-2xl border border-border bg-card">
              <img src={t.img} alt={t.name} className="h-44 w-full object-cover" />
              <div className="space-y-2 p-5">
                <figcaption className="flex items-center justify-between">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400">{t.progress}</span>
                </figcaption>
                <blockquote className="text-sm text-muted-foreground">" {t.quote} "</blockquote>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="relative z-10 border-t border-border/60 bg-card/60 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h3 className="text-lg font-semibold">Ready to build momentum?</h3>
            <p className="text-sm text-muted-foreground">Start tracking today—future you says thanks.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/auth" className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow">Get Started</a>
            <a href="#" className="rounded-xl border border-border bg-secondary px-5 py-3 text-sm">Get Updates</a>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TrackFit</p>
          <div className="flex items-center gap-4">
            <a className="hover:text-foreground" href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
            <a className="hover:text-foreground" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a className="hover:text-foreground" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}