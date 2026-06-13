"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CalendarDays, Clock, Shirt, Sparkles, Wand2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWeather } from "@/components/shell/WeatherProvider";

interface PlanResult {
  date: string;
  city: string;
  summary: string;
  bestWindows: { label: string; range: string; reason: string }[];
  activities: { title: string; emoji: string; note: string }[];
  travel: string;
  clothing: { name: string; emoji: string }[];
  source: "openai" | "local";
}

export function PlannerSection() {
  const { city } = useWeather();
  const [date, setDate] = useState(() =>
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const [intent, setIntent] = useState("Outdoor team picnic for ~12 people");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanResult | null>(null);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ city, date, intent }),
      });
      const data: PlanResult = await res.json();
      setPlan(data);
    } catch {
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <SectionHeader
        id="planner"
        eyebrow="10 · AI Future Day Planner"
        title="Plan a day that hasn't happened yet"
        description="Tell us when and what — we'll back-solve the conditions into an event-ready plan."
      />

      <div className="glass grid gap-4 rounded-2xl p-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-widest text-muted">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-widest text-muted">
            What's the plan?
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              rows={4}
              className="mt-1 block w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
            />
          </label>
          <button
            onClick={generate}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-verse-glow to-verse-aurora px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition disabled:opacity-60"
          >
            <Wand2 className="size-4" />
            {loading ? "Planning…" : "Generate plan"}
          </button>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-muted">
            City: <span className="text-white">{city}</span> · The planner blends
            climatology with current forecasts and your intent.
          </div>
        </div>

        <div className="min-h-[280px] rounded-2xl border border-white/10 bg-white/5 p-5">
          {!plan && !loading && (
            <div className="grid h-full place-items-center text-sm text-muted">
              Generate a plan to see windows, activities, travel, and clothing.
            </div>
          )}
          {loading && (
            <div className="grid h-full place-items-center text-sm text-muted">
              Modeling {city} on {new Date(date).toLocaleDateString()}…
            </div>
          )}
          {plan && (
            <motion.div
              key={plan.date + plan.summary}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                <CalendarDays className="size-3.5" />
                {new Date(plan.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {plan.city}
                <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                  <Sparkles className="size-3" /> {plan.source === "openai" ? "GPT" : "Verse"}
                </span>
              </div>
              <p className="text-balance text-base leading-relaxed">{plan.summary}</p>

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Best windows
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {plan.bestWindows.map((w) => (
                    <div key={w.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Clock className="size-3.5" /> {w.label}
                      </div>
                      <div className="text-xs text-muted">{w.range}</div>
                      <p className="mt-1 text-sm">{w.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Activities
                  </div>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {plan.activities.map((a) => (
                      <li key={a.title} className="flex gap-2">
                        <span>{a.emoji}</span>
                        <span>
                          <span className="font-medium">{a.title}.</span>{" "}
                          <span className="text-muted">{a.note}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Wear
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {plan.clothing.map((c) => (
                      <span
                        key={c.name}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm"
                      >
                        <span>{c.emoji}</span>
                        {c.name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-xs text-muted">
                    <Shirt className="size-3.5" /> Adjusted for predicted feel
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                <span className="font-semibold">Travel:</span>{" "}
                <span className="text-muted">{plan.travel}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
