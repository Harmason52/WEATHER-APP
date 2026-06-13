"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { WeatherMood } from "@/lib/types";

interface Props {
  condition: WeatherMood;
}

const palettes: Record<
  WeatherMood,
  { base: string; aurora: string; accent: string; mood: string }
> = {
  clear: {
    base:
      "radial-gradient(1200px 600px at 80% 10%, rgba(255,213,128,0.45), transparent 60%), radial-gradient(900px 500px at 20% 30%, rgba(255,140,90,0.30), transparent 60%)",
    aurora: "conic-gradient(from 220deg, rgba(255,180,90,0.30), rgba(255,90,150,0.20), rgba(255,220,120,0.30))",
    accent: "rgba(255, 200, 110, 0.5)",
    mood: "Sunlit",
  },
  clouds: {
    base:
      "radial-gradient(1200px 600px at 80% 0%, rgba(180,200,255,0.30), transparent 60%), radial-gradient(900px 500px at 20% 30%, rgba(140,160,220,0.25), transparent 60%)",
    aurora: "conic-gradient(from 200deg, rgba(120,140,200,0.30), rgba(200,210,255,0.25), rgba(80,100,160,0.30))",
    accent: "rgba(160, 180, 230, 0.5)",
    mood: "Overcast",
  },
  rain: {
    base:
      "radial-gradient(1200px 600px at 80% 0%, rgba(60,110,200,0.55), transparent 60%), radial-gradient(900px 500px at 20% 30%, rgba(20,40,120,0.55), transparent 60%)",
    aurora: "conic-gradient(from 180deg, rgba(40,80,200,0.30), rgba(60,160,255,0.20), rgba(20,40,120,0.30))",
    accent: "rgba(80, 140, 255, 0.6)",
    mood: "Deep Sea",
  },
  snow: {
    base:
      "radial-gradient(1200px 600px at 80% 0%, rgba(190,220,255,0.45), transparent 60%), radial-gradient(900px 500px at 20% 30%, rgba(220,235,255,0.40), transparent 60%)",
    aurora: "conic-gradient(from 200deg, rgba(190,220,255,0.30), rgba(160,200,255,0.25), rgba(230,240,255,0.30))",
    accent: "rgba(200, 225, 255, 0.6)",
    mood: "Frost",
  },
  storm: {
    base:
      "radial-gradient(1200px 600px at 80% 0%, rgba(120,40,180,0.55), transparent 60%), radial-gradient(900px 500px at 20% 30%, rgba(60,30,120,0.55), transparent 60%)",
    aurora: "conic-gradient(from 180deg, rgba(120,40,200,0.30), rgba(60,20,140,0.30), rgba(200,80,255,0.30))",
    accent: "rgba(180, 120, 255, 0.6)",
    mood: "Tempest",
  },
  fog: {
    base:
      "radial-gradient(1200px 600px at 80% 0%, rgba(200,200,210,0.45), transparent 60%), radial-gradient(900px 500px at 20% 30%, rgba(160,160,180,0.40), transparent 60%)",
    aurora: "conic-gradient(from 200deg, rgba(200,200,220,0.25), rgba(170,170,200,0.25), rgba(220,220,235,0.25))",
    accent: "rgba(210, 210, 220, 0.5)",
    mood: "Veil",
  },
};

export function AnimatedSky({ condition }: Props) {
  const p = palettes[condition];

  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 60,
        delay: Math.random() * 4,
        size: 0.5 + Math.random() * 1.5,
      })),
    [],
  );

  const drops = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 0.7 + Math.random() * 1.2,
      })),
    [],
  );

  const flakes = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 6,
        size: 3 + Math.random() * 6,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        key={condition + "-base"}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{ background: p.base }}
      />
      <motion.div
        key={condition + "-aurora"}
        className="absolute inset-[-15%] blur-3xl"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 2 }}
        style={{ background: p.aurora }}
      />

      {(condition === "clear" || condition === "clouds") && (
        <div className="absolute inset-0">
          {stars.map((s) => (
            <span
              key={s.id}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                opacity: 0.7,
                animationDelay: `${s.delay}s`,
                filter: "blur(0.3px)",
              }}
            />
          ))}
        </div>
      )}

      {condition === "clouds" || condition === "fog" ? (
        <div className="absolute inset-0">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute h-40 w-[60vw] rounded-full bg-white/10 blur-2xl animate-drift"
              style={{
                top: `${10 + i * 18}%`,
                left: `${-20 + i * 25}%`,
                animationDelay: `${i * 4}s`,
                animationDuration: `${20 + i * 6}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      {condition === "rain" || condition === "storm" ? (
        <div className="absolute inset-0">
          {drops.map((d) => (
            <span
              key={d.id}
              className="rain-drop"
              style={{
                left: `${d.x}%`,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.duration}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      {condition === "storm" && (
        <motion.div
          className="absolute inset-0 bg-white/40 mix-blend-overlay"
          animate={{ opacity: [0, 0, 0.6, 0, 0.4, 0, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}

      {condition === "snow" && (
        <div className="absolute inset-0">
          {flakes.map((f) => (
            <span
              key={f.id}
              className="snow-flake"
              style={{
                left: `${f.x}%`,
                width: f.size,
                height: f.size,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* sun / moon glow */}
      <motion.div
        className="absolute right-[-6%] top-[-6%] h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: p.accent }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.85, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
