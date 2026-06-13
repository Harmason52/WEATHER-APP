"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Command, Search } from "lucide-react";
import { seedCities } from "@/lib/demoWeather";
import { useWeather } from "./WeatherProvider";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { setCity } = useWeather();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = seedCities.filter((c) => c.toLowerCase().includes(q.toLowerCase()));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-start bg-black/50 px-4 pt-[12vh] backdrop-blur"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-xl overflow-hidden rounded-2xl shadow-ring"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="size-4 opacity-70" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Jump to city, score, mood…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
              />
              <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] uppercase text-muted">
                <Command className="mr-1 inline size-3" />K
              </span>
            </div>
            <ul className="max-h-72 overflow-y-auto py-1 scrollbar-thin">
              {filtered.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => {
                      setCity(c);
                      setOpen(false);
                      setQ("");
                    }}
                    className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm hover:bg-white/5"
                  >
                    <span>{c}</span>
                    <span className="text-[11px] text-muted">Jump</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
