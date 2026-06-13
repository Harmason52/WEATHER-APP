"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWeather } from "@/components/shell/WeatherProvider";
import type { LifeScore } from "@/lib/types";

export function LifeScoresSection() {
  const { scores, loading } = useWeather();

  return (
    <section>
      <SectionHeader
        id="scores"
        eyebrow="01 · AI Daily Life Score"
        title="How will today actually feel?"
        description="Seven contextual scores rendered live from weather, air, and time-of-day signals — each with the drivers behind the number."
        right={
          <div className="hidden items-center gap-2 text-xs text-muted md:flex">
            <span className="inline-block size-2 rounded-full bg-emerald-400" />
            Updated in real time
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading && scores.length === 0
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="glass h-44 animate-pulse rounded-2xl"
              />
            ))
          : scores.map((s, i) => <ScoreCard key={s.key} score={s} index={i} />)}
      </div>
    </section>
  );
}

function ScoreCard({ score, index }: { score: LifeScore; index: number }) {
  const dash = 2 * Math.PI * 36;
  const offset = dash * (1 - score.score / 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-ring backdrop-blur-md transition-colors hover:bg-white/[0.06]"
    >
      <div
        className={`absolute -right-12 -top-10 size-44 rounded-full bg-gradient-to-br ${score.accent} opacity-30 blur-2xl transition-opacity group-hover:opacity-60`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {score.label}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{score.score}</span>
            <span className="text-sm text-muted">/ 100</span>
          </div>
          <div className="mt-1 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-wider">
            {score.band}
          </div>
        </div>
        <div className="relative grid size-20 place-items-center">
          <svg viewBox="0 0 80 80" className="-rotate-90">
            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeOpacity="0.1" strokeWidth="6" fill="none" />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke={`url(#g-${score.key})`}
              strokeDasharray={dash}
              initial={{ strokeDashoffset: dash }}
              whileInView={{ strokeDashoffset: offset }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <defs>
              <linearGradient id={`g-${score.key}`} x1="0" x2="1">
                <stop offset="0%" stopColor="#7c5cff" />
                <stop offset="100%" stopColor="#5ce0ff" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-xl">{score.emoji}</div>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed">{score.insight}</p>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {score.drivers.map((d) => (
          <span
            key={d}
            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted"
          >
            {d}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
