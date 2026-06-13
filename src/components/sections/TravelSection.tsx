"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Compass, Globe2, Sparkles, Users } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { TravelCity, WeatherMood } from "@/lib/types";
import { aqiLabel } from "@/lib/format";

const moodEmoji: Record<WeatherMood, string> = {
  clear: "☀️",
  clouds: "☁️",
  rain: "🌧️",
  snow: "❄️",
  storm: "⛈️",
  fog: "🌫️",
};

export function TravelSection() {
  const [cities, setCities] = useState<TravelCity[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "best" | "calm">("all");

  useEffect(() => {
    fetch("/api/travel")
      .then((r) => r.json())
      .then((d) => setCities(d.cities));
  }, []);

  const visible = useMemo(() => {
    if (filter === "best") return [...cities].sort((a, b) => b.tourismScore - a.tourismScore);
    if (filter === "calm") return [...cities].sort((a, b) => a.aqi - b.aqi);
    return cities;
  }, [cities, filter]);

  const focus = visible.find((c) => c.name === selected) ?? visible[0];

  return (
    <section>
      <SectionHeader
        id="travel"
        eyebrow="08 · Travel Weather Explorer"
        title="A globe of conditions"
        description="Tourist suitability, air quality, and crowd estimates for marquee destinations — at a glance."
        right={
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
            {(["all", "best", "calm"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-2.5 py-1 ${
                  filter === f
                    ? "bg-gradient-to-br from-verse-glow to-verse-aurora text-white"
                    : "text-muted hover:bg-white/5"
                }`}
              >
                {f === "all" ? "All" : f === "best" ? "Top tourism" : "Cleanest air"}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Globe cities={visible} focusName={focus?.name} onSelect={setSelected} />
        </div>

        <div className="lg:col-span-2">
          <div className="glass max-h-[420px] overflow-y-auto rounded-2xl p-3 scrollbar-thin">
            <ul className="space-y-2">
              {visible.map((c) => (
                <li key={c.name}>
                  <button
                    onClick={() => setSelected(c.name)}
                    className={`flex w-full items-center gap-3 rounded-xl border border-white/10 p-3 text-left transition ${
                      focus?.name === c.name ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="grid size-10 place-items-center rounded-xl bg-white/5 text-lg">
                      {moodEmoji[c.condition]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">
                          {c.name}{" "}
                          <span className="text-muted">· {c.country}</span>
                        </div>
                        <div className="text-sm">{Math.round(c.tempC)}°</div>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted">
                        <span>Tourism {c.tourismScore}</span>
                        <span>AQI {c.aqi} · {aqiLabel(c.aqi)}</span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="size-3" />
                          {c.crowdLevel}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {focus && (
            <motion.div
              key={focus.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass mt-3 rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                <Sparkles className="size-3.5" />
                Verse insight
              </div>
              <p className="mt-2 text-sm leading-relaxed">{focus.highlight}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function Globe({
  cities,
  focusName,
  onSelect,
}: {
  cities: TravelCity[];
  focusName?: string;
  onSelect: (n: string) => void;
}) {
  return (
    <div className="glass relative aspect-[16/10] w-full overflow-hidden rounded-2xl p-3">
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative aspect-square w-[78%] max-w-[520px] rounded-full">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-verse-glow/30 via-verse-aurora/30 to-verse-ember/30 blur-2xl" />
          <div className="absolute inset-2 rounded-full border border-white/20 bg-gradient-to-br from-indigo-700/40 via-sky-700/30 to-emerald-700/30 shadow-glass">
            <svg viewBox="0 0 200 200" className="absolute inset-0 size-full opacity-60">
              <defs>
                <radialGradient id="hl" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="60%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>
              {Array.from({ length: 9 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx="100"
                  cy="100"
                  rx={95 - i * 9}
                  ry="95"
                  stroke="rgba(255,255,255,0.08)"
                  fill="none"
                />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line
                  key={i}
                  x1="5"
                  y1={20 + i * 25}
                  x2="195"
                  y2={20 + i * 25}
                  stroke="rgba(255,255,255,0.07)"
                />
              ))}
              <circle cx="100" cy="100" r="95" fill="url(#hl)" />
            </svg>
          </div>

          {cities.map((c) => {
            const x = ((c.lon + 180) / 360) * 100;
            const y = ((90 - c.lat) / 180) * 100;
            const active = focusName === c.name;
            return (
              <button
                key={c.name}
                onClick={() => onSelect(c.name)}
                title={`${c.name} · ${Math.round(c.tempC)}°`}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span
                  className={`block size-2.5 rounded-full ring-2 transition ${
                    active
                      ? "bg-white ring-white/60 shadow-glow"
                      : "bg-verse-aurora ring-white/20 group-hover:bg-white"
                  }`}
                />
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/60 px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100">
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-muted">
        <Globe2 className="size-3.5" />
        Interactive globe · click a marker
      </div>
      <div className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-muted">
        <Compass className="size-3.5" /> {cities.length} destinations
      </div>
    </div>
  );
}
