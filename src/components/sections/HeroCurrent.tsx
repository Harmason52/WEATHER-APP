"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  CloudRain,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";
import { useWeather } from "@/components/shell/WeatherProvider";
import { cToF, compass, fmtTime, kphToMph, moodAccent } from "@/lib/format";

export function HeroCurrent() {
  const { bundle, unit } = useWeather();
  if (!bundle) return null;
  const c = bundle.current;
  const accent = moodAccent(c.condition);

  const temp = unit === "metric" ? Math.round(c.tempC) : cToF(c.tempC);
  const feels = unit === "metric" ? Math.round(c.feelsLikeC) : cToF(c.feelsLikeC);
  const wind = unit === "metric" ? `${c.windKph} km/h` : `${kphToMph(c.windKph)} mph`;
  const today = bundle.daily[0];

  return (
    <section
      id="today"
      className="relative overflow-hidden rounded-3xl border border-white/10 shadow-ring"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent.from} ${accent.via} ${accent.to}`}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-10 bottom-0 size-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative grid gap-8 p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            <span className="inline-block size-1.5 animate-pulseSoft rounded-full bg-white/80" />
            {bundle.source === "openweather" ? "Live · OpenWeather" : "Demo intelligence"}
          </div>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {c.city}
            <span className="ml-2 text-base font-medium text-white/70">
              {c.country}
            </span>
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Updated {fmtTime(c.updatedAt)} · Lat {c.lat.toFixed(2)}, Lon {c.lon.toFixed(2)}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex items-end gap-5"
          >
            <div className="text-[88px] font-semibold leading-none tracking-tighter md:text-[120px]">
              {temp}°
            </div>
            <div className="pb-3">
              <div className="text-xl font-medium">{c.conditionLabel}</div>
              <div className="text-sm text-white/70">
                Feels like {feels}° · H {unit === "metric" ? today.highC : cToF(today.highC)}°
                / L {unit === "metric" ? today.lowC : cToF(today.lowC)}°
              </div>
            </div>
          </motion.div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={<Wind className="size-4" />} label="Wind" value={`${wind} · ${compass(c.windDir)}`} />
            <Stat icon={<Droplets className="size-4" />} label="Humidity" value={`${c.humidity}%`} />
            <Stat icon={<Gauge className="size-4" />} label="Pressure" value={`${c.pressure} hPa`} />
            <Stat icon={<Eye className="size-4" />} label="Visibility" value={`${c.visibilityKm} km`} />
          </div>
        </div>

        <div className="relative flex flex-col gap-3">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Sunrise className="size-4" /> Sunrise
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="size-4" /> Sunset
              </div>
            </div>
            <div className="mt-1 flex items-baseline justify-between text-lg font-medium">
              <div>{fmtTime(c.sunrise)}</div>
              <div>{fmtTime(c.sunset)}</div>
            </div>
            <SunArc sunrise={c.sunrise} sunset={c.sunset} now={c.updatedAt} />
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CloudRain className="size-4" /> Precipitation outlook
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {bundle.hourly.slice(0, 14).map((h) => (
                <div key={h.time} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-md bg-white/15"
                    style={{ height: 28 }}
                  >
                    <div
                      className="rounded-md bg-gradient-to-t from-sky-400 to-cyan-200"
                      style={{ height: `${Math.max(4, h.rainProb)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-white/70">
                    {new Date(h.time).getHours()}h
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="text-sm font-medium">7-day rhythm</div>
            <div className="mt-2 flex items-end gap-2">
              {bundle.daily.map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1 text-center">
                  <div className="text-[10px] text-white/70">{d.label}</div>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowUp className="size-3 opacity-70" />
                    {unit === "metric" ? d.highC : cToF(d.highC)}°
                  </div>
                  <div
                    className="w-1.5 rounded-full bg-gradient-to-b from-amber-200 via-rose-300 to-indigo-400"
                    style={{ height: 16 + Math.max(8, d.highC - d.lowC) * 2 }}
                  />
                  <div className="flex items-center gap-1 text-xs text-white/70">
                    <ArrowDown className="size-3 opacity-70" />
                    {unit === "metric" ? d.lowC : cToF(d.lowC)}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-2xl p-3">
      <div className="flex items-center gap-2 text-xs text-white/70">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-base font-semibold">{value}</div>
    </div>
  );
}

function SunArc({
  sunrise,
  sunset,
  now,
}: {
  sunrise: string;
  sunset: string;
  now: string;
}) {
  const sr = new Date(sunrise).getTime();
  const ss = new Date(sunset).getTime();
  const n = new Date(now).getTime();
  const t = Math.max(0, Math.min(1, (n - sr) / (ss - sr)));
  const x = 10 + t * 80;
  const y = 60 - Math.sin(t * Math.PI) * 45;
  return (
    <svg viewBox="0 0 100 60" className="mt-3 h-16 w-full">
      <defs>
        <linearGradient id="arc" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffd166" />
          <stop offset="50%" stopColor="#ff7a59" />
          <stop offset="100%" stopColor="#7c5cff" />
        </linearGradient>
      </defs>
      <path
        d="M 5 55 Q 50 -10 95 55"
        fill="none"
        stroke="url(#arc)"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <circle cx={x} cy={y} r="3.2" fill="#fff" />
      <circle cx={x} cy={y} r="6" fill="#fff" opacity="0.2" />
    </svg>
  );
}
