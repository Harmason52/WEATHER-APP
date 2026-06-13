"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  CloudLightning,
  Droplets,
  Flame,
  ShieldAlert,
  Snowflake,
  Thermometer,
  Wind,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { DisasterAlert } from "@/lib/types";
import { useWeather } from "@/components/shell/WeatherProvider";

const sevTone: Record<DisasterAlert["severity"], string> = {
  info: "from-sky-400/40 to-sky-700/40 text-sky-100",
  watch: "from-amber-400/40 to-orange-600/40 text-amber-100",
  warning: "from-orange-500/50 to-rose-700/50 text-orange-100",
  critical: "from-rose-500/60 to-purple-800/60 text-rose-100",
};

const kindIcon: Record<DisasterAlert["kind"], React.ReactNode> = {
  flood: <Droplets className="size-4" />,
  storm: <Wind className="size-4" />,
  lightning: <CloudLightning className="size-4" />,
  air: <AlertTriangle className="size-4" />,
  heat: <Thermometer className="size-4" />,
  cold: <Snowflake className="size-4" />,
  wildfire: <Flame className="size-4" />,
};

export function DisasterSection() {
  const { city } = useWeather();
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/disasters?city=${encodeURIComponent(city)}`)
      .then((r) => r.json())
      .then((d) => setAlerts(d.alerts))
      .finally(() => setLoading(false));
  }, [city]);

  return (
    <section>
      <SectionHeader
        id="alerts"
        eyebrow="09 · Disaster Early Warning Center"
        title="Risk, visualized"
        description="Live watchpoints across flood, storm, lightning, air quality, heat, cold, and wildfire — with severity and area."
      />

      <div className="glass relative overflow-hidden rounded-2xl p-4">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <RiskMap alerts={alerts} />

          <div className="space-y-3">
            {loading && (
              <div className="text-sm text-muted">Sweeping alert feeds…</div>
            )}
            {!loading && alerts.length === 0 && (
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldAlert className="size-4" />
                  All clear in {city}
                </div>
                <p className="mt-1 text-emerald-100/80">
                  No active watches or warnings in your area right now.
                </p>
              </div>
            )}
            {alerts.map((a, i) => (
              <motion.article
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative overflow-hidden rounded-2xl border border-white/10 p-4`}
              >
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${sevTone[a.severity]} opacity-30`}
                />
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                    {kindIcon[a.kind]}
                    {a.kind}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/30 px-2 py-0.5">
                    <AlertOctagon className="size-3" />
                    {a.severity}
                  </span>
                  <span className="ml-auto text-[11px] text-white/70">{a.source}</span>
                </div>
                <h3 className="mt-2 text-sm font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/85">{a.body}</p>
                <div className="mt-2 text-[11px] text-white/70">
                  {a.area} · {new Date(a.startsAt).toLocaleString()} → {new Date(a.endsAt).toLocaleTimeString()}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskMap({ alerts }: { alerts: DisasterAlert[] }) {
  return (
    <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/40 to-slate-900/40">
      <svg viewBox="0 0 200 140" className="absolute inset-0 size-full">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" />
          </pattern>
        </defs>
        <rect width="200" height="140" fill="url(#grid)" />
        {/* abstract coastline */}
        <path
          d="M0,90 C40,80 60,100 90,85 S150,75 200,90 L200,140 L0,140 Z"
          fill="rgba(124,92,255,0.18)"
          stroke="rgba(124,92,255,0.4)"
        />
        <path
          d="M0,55 C30,60 60,40 100,55 S160,70 200,55"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeDasharray="2 2"
        />
        {alerts.slice(0, 6).map((a, i) => {
          const cx = 25 + (i * 35) % 160;
          const cy = 40 + ((i * 17) % 70);
          const r = a.severity === "critical" ? 18 : a.severity === "warning" ? 14 : 10;
          const fill =
            a.severity === "critical"
              ? "rgba(255,80,120,0.45)"
              : a.severity === "warning"
              ? "rgba(255,140,80,0.45)"
              : "rgba(120,200,255,0.45)";
          return (
            <g key={a.id}>
              <circle cx={cx} cy={cy} r={r + 10} fill={fill} opacity={0.18}>
                <animate attributeName="r" values={`${r + 6};${r + 16};${r + 6}`} dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r={r} fill={fill} stroke="white" strokeOpacity="0.3" />
              <text x={cx} y={cy + 1} textAnchor="middle" fontSize="6" fill="white">
                {a.kind[0].toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80">
        Risk overlay · {alerts.length} active
      </div>
    </div>
  );
}
