"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWeather } from "@/components/shell/WeatherProvider";
import { recommendActivities } from "@/lib/insights";
import type { MoodKey } from "@/lib/types";

const moods: { key: MoodKey; label: string; emoji: string; tone: string }[] = [
  { key: "adventurous", label: "Adventurous", emoji: "🧭", tone: "from-orange-400 to-rose-500" },
  { key: "romantic", label: "Romantic", emoji: "🌹", tone: "from-rose-400 to-pink-500" },
  { key: "productive", label: "Productive", emoji: "⚡", tone: "from-amber-300 to-yellow-500" },
  { key: "relaxing", label: "Relaxing", emoji: "🌿", tone: "from-emerald-400 to-teal-500" },
  { key: "active", label: "Active", emoji: "🏃", tone: "from-lime-300 to-emerald-500" },
];

export function MoodSection() {
  const { bundle } = useWeather();
  const [mood, setMood] = useState<MoodKey>("relaxing");

  const activities = useMemo(
    () => (bundle ? recommendActivities(bundle, mood) : []),
    [bundle, mood],
  );

  return (
    <section className="lg:col-span-2">
      <SectionHeader
        id="mood"
        eyebrow="02 · Mood-Based Weather"
        title="Pick a mood. We'll match it to the sky."
        description="The system blends conditions and your intent into a ranked set of activities — with a fit score for each."
      />

      <div className="glass rounded-2xl p-5">
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <button
              key={m.key}
              onClick={() => setMood(m.key)}
              className={`group relative overflow-hidden rounded-xl border border-white/10 px-3 py-2 text-sm transition ${
                mood === m.key
                  ? "bg-white/15 shadow-glow"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <span
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${m.tone} opacity-${
                  mood === m.key ? 30 : 0
                } transition-opacity group-hover:opacity-30`}
              />
              <span className="mr-1.5">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>

        <motion.div
          key={mood}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-5 grid gap-3 sm:grid-cols-2"
        >
          {activities.map((a) => (
            <div
              key={a.title}
              className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-verse-glow/30 to-verse-aurora/30 text-lg">
                {a.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{a.title}</div>
                  <div className="text-xs font-semibold text-verse-aurora">
                    {a.fitScore}/100
                  </div>
                </div>
                <p className="text-sm text-muted">{a.blurb}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
