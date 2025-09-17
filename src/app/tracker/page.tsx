"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// Quick Log only (no charts, no volume, no 1RM)

type LogEntry = {
  id: number;
  date: string; // YYYY-MM-DD
  exercise: string;
  sets: number;
  reps: number;
  weight: number; // base in kg
};

export default function TrackerPage() {
  const router = useRouter();

  // Gate behind simple token check
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
    if (!token) {
      router.replace("/auth?redirect=/tracker");
    }
  }, [router]);

  // Local-only quick log state
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [form, setForm] = useState<Omit<LogEntry, "id">>({
    date: new Date().toISOString().slice(0, 10),
    exercise: "Bench Press",
    sets: 3,
    reps: 8,
    weight: 50,
  });

  const convertDisplay = (wKg: number) => (unit === "kg" ? wKg : Math.round(wKg * 2.20462));

  const canSubmit = useMemo(() => {
    return (
      form.exercise.trim().length > 0 &&
      form.sets > 0 &&
      form.reps > 0 &&
      form.weight > 0 &&
      /\d{4}-\d{2}-\d{2}/.test(form.date)
    );
  }, [form]);

  const addEntry = () => {
    if (!canSubmit) return;
    setEntries((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, ...form },
    ]);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">💪</span>
          <h1 className="text-lg font-semibold tracking-tight">TrackFit</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          <button onClick={() => router.push("/")} className="hover:text-foreground">Home</button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Quick Log</h2>
          <p className="mt-1 text-sm text-muted-foreground">Log your sets fast. Charts and analytics coming later.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Logger Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Add Set</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="hidden sm:inline">Units</span>
                <div className="inline-flex overflow-hidden rounded-lg border border-border">
                  <button
                    className={`px-3 py-1 ${unit === "kg" ? "bg-primary text-primary-foreground" : "bg-background"}`}
                    onClick={() => setUnit("kg")}
                  >kg</button>
                  <button
                    className={`px-3 py-1 ${unit === "lb" ? "bg-primary text-primary-foreground" : "bg-background"}`}
                    onClick={() => setUnit("lb")}
                  >lb</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <label className="col-span-2 text-sm sm:col-span-3">
                <span className="mb-1 block text-muted-foreground">Exercise</span>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.exercise}
                  onChange={(e) => setForm((f) => ({ ...f, exercise: e.target.value }))}
                >
                  <option value="Bench Press">Bench Press</option>
                  <option value="Squat">Squat</option>
                  <option value="Deadlift">Deadlift</option>
                  <option value="Overhead Press">Overhead Press</option>
                  <option value="Bent-Over Row">Bent-Over Row</option>
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Date</span>
                <input
                  type="date"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Sets</span>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.sets}
                  onChange={(e) => setForm((f) => ({ ...f, sets: Number(e.target.value) }))}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Reps</span>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.reps}
                  onChange={(e) => setForm((f) => ({ ...f, reps: Number(e.target.value) }))}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-muted-foreground">Weight ({unit})</span>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={convertDisplay(form.weight)}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setForm((f) => ({ ...f, weight: unit === "kg" ? v : Math.round(v / 2.20462) }));
                  }}
                />
              </label>
              <div className="col-span-2 sm:col-span-3">
                <button
                  onClick={addEntry}
                  disabled={!canSubmit}
                  className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow disabled:opacity-70"
                >
                  Add Set
                </button>
              </div>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 font-semibold">Recent Sets</h3>
            <div className="max-h-72 overflow-auto rounded-lg border border-border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-secondary text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Exercise</th>
                    <th className="px-3 py-2 font-medium">Sets×Reps</th>
                    <th className="px-3 py-2 font-medium">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                        No sets logged yet. Add your first set!
                      </td>
                    </tr>
                  ) : (
                    entries.map((e) => (
                      <tr key={e.id} className="border-t border-border/60">
                        <td className="px-3 py-2">{e.date}</td>
                        <td className="px-3 py-2">{e.exercise}</td>
                        <td className="px-3 py-2">{e.sets}×{e.reps}</td>
                        <td className="px-3 py-2">{convertDisplay(e.weight)} {unit}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}