"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Command,
  Compass,
  MapPin,
  Moon,
  RefreshCw,
  Search,
  SunMedium,
  Thermometer,
} from "lucide-react";
import { useTheme } from "@/components/shell/ThemeProvider";
import { useWeather } from "@/components/shell/WeatherProvider";
import { seedCities } from "@/lib/demoWeather";

export function TopBar() {
  const { city, setCity, unit, setUnit, refresh, loading, bundle } = useWeather();
  const { resolved, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = seedCities.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="glass-strong flex items-center gap-3 rounded-2xl px-3 py-2 shadow-ring">
        <div className="hidden items-center gap-2 pl-1 pr-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted sm:flex">
          <Compass className="size-3.5" /> WeatherVerse
        </div>

        <div className="relative flex-1">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm transition hover:bg-white/10"
          >
            <Search className="size-4 opacity-70" />
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 opacity-70" />
              <span className="font-medium">{city}</span>
              {bundle ? (
                <span className="text-muted">
                  · {bundle.current.conditionLabel} · {Math.round(bundle.current.tempC)}°
                  {unit === "metric" ? "C" : "F"}
                </span>
              ) : null}
            </span>
            <span className="ml-auto hidden items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] uppercase text-muted sm:flex">
              <Command className="size-3" />K
            </span>
          </button>

          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-white/10 bg-verse-ink/90 shadow-ring backdrop-blur-xl"
            >
              <div className="border-b border-white/10 px-3 py-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search cities, neighborhoods, airports…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filtered[0]) {
                      setCity(filtered[0]);
                      setOpen(false);
                      setQuery("");
                    }
                    if (e.key === "Escape") setOpen(false);
                  }}
                />
              </div>
              <ul className="max-h-72 overflow-y-auto py-1 scrollbar-thin">
                {filtered.length === 0 && (
                  <li className="px-3 py-3 text-sm text-muted">
                    No match — try one of the curated seed cities.
                  </li>
                )}
                {filtered.map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => {
                        setCity(c);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/5"
                    >
                      <MapPin className="size-3.5 opacity-70" />
                      <span>{c}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/10 px-3 py-2 text-[11px] text-muted">
                Tip: configure <code className="text-white/80">OPENWEATHER_API_KEY</code> for live data.
              </div>
            </motion.div>
          )}
        </div>

        <button
          onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
          className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 sm:flex"
          title="Toggle temperature unit"
        >
          <Thermometer className="size-4" />
          °{unit === "metric" ? "C" : "F"}
        </button>

        <button
          onClick={refresh}
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-sm hover:bg-white/10"
          title="Refresh"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
        </button>

        <button
          onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-sm hover:bg-white/10"
          title="Toggle theme"
        >
          {resolved === "dark" ? (
            <SunMedium className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
