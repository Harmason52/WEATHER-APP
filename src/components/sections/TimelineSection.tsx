"use client";

import { motion } from "framer-motion";
import { CloudRain, Droplets, Sun, Wind } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWeather } from "@/components/shell/WeatherProvider";
import { cToF, kphToMph, uvLabel } from "@/lib/format";

const segments = [
  { key: "morning", label: "Morning", emoji: "🌅", hours: [6, 11], suggest: "Coffee outdoors, a light walk, school commute window" },
  { key: "afternoon", label: "Afternoon", emoji: "🌤️", hours: [12, 16], suggest: "Best deep-work block, errands, midday workout" },
  { key: "evening", label: "Evening", emoji: "🌇", hours: [17, 20], suggest: "Golden hour photos, dinner patio, social plans" },
  { key: "night", label: "Night", emoji: "🌌", hours: [21, 5], suggest: "Stargazing, indoor reset, sleep prep" },
];

export function TimelineSection() {
  const { bundle, unit } = useWeather();
  if (!bundle) return null;

  const hourBuckets = segments.map((s) => {
    const [a, b] = s.hours;
    const slice = bundle.hourly.filter((h) => {
      if (a <= b) return h.hour >= a && h.hour <= b;
      return h.hour >= a || h.hour <= b;
    });
    const sample = slice[Math.floor(slice.length / 2)] ?? bundle.hourly[0];
    return { ...s, sample, slice };
  });

  return (
    <section>
      <SectionHeader
        id="timeline"
        eyebrow="05 · Weather Timeline"
        title="Today as a journey"
        description="Scroll the day. Each segment is its own micro-forecast with the activities it unlocks."
      />

      <div className="glass relative overflow-hidden rounded-2xl p-5">
        <div className="absolute -left-10 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {hourBuckets.map((b, i) => {
            const uv = uvLabel(b.sample.uv);
            const temp =
              unit === "metric" ? Math.round(b.sample.tempC) : cToF(b.sample.tempC);
            const wind =
              unit === "metric"
                ? `${b.sample.windKph} km/h`
                : `${kphToMph(b.sample.windKph)} mph`;
            return (
              <motion.div
                key={b.key}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{b.emoji}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted">
                    {b.hours[0]}h — {b.hours[1]}h
                  </div>
                </div>
                <div className="mt-2 text-lg font-semibold">{b.label}</div>
                <div className="text-4xl font-semibold leading-none tracking-tight">
                  {temp}°
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <Mini icon={<CloudRain className="size-3.5" />} label={`${b.sample.rainProb}% rain`} />
                  <Mini icon={<Wind className="size-3.5" />} label={wind} />
                  <Mini icon={<Sun className="size-3.5" />} label={`UV ${b.sample.uv} · ${uv.label}`} />
                  <Mini icon={<Droplets className="size-3.5" />} label={`${b.sample.humidity}%`} />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted">{b.suggest}</p>

                <div className="mt-3 flex h-6 items-end gap-0.5">
                  {b.slice.map((h) => (
                    <div
                      key={h.time}
                      title={`${h.hour}h ${Math.round(h.tempC)}°`}
                      className="flex-1 rounded-sm bg-gradient-to-t from-verse-glow/40 to-verse-aurora/70"
                      style={{ height: `${Math.max(10, Math.min(100, (h.tempC + 5) * 2.5))}%` }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Mini({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-muted">
      {icon}
      <span>{label}</span>
    </div>
  );
}
