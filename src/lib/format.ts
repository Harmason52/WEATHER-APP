import type { WeatherMood } from "./types";

export function cToF(c: number) {
  return Math.round((c * 9) / 5 + 32);
}

export function kphToMph(k: number) {
  return Math.round(k * 0.621371);
}

export function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export function moodLabel(m: WeatherMood) {
  switch (m) {
    case "clear":
      return "Clear sky";
    case "clouds":
      return "Cloudy";
    case "rain":
      return "Rainy";
    case "snow":
      return "Snowy";
    case "storm":
      return "Stormy";
    case "fog":
      return "Foggy";
  }
}

export function moodAccent(m: WeatherMood): {
  name: string;
  from: string;
  via: string;
  to: string;
  ring: string;
  text: string;
} {
  switch (m) {
    case "clear":
      return {
        name: "Gold",
        from: "from-amber-300/30",
        via: "via-orange-400/25",
        to: "to-rose-400/20",
        ring: "ring-amber-300/40",
        text: "text-amber-200",
      };
    case "clouds":
      return {
        name: "Mist",
        from: "from-slate-300/20",
        via: "via-indigo-400/20",
        to: "to-slate-500/20",
        ring: "ring-slate-300/30",
        text: "text-slate-200",
      };
    case "rain":
      return {
        name: "Deep Sea",
        from: "from-sky-500/30",
        via: "via-indigo-700/30",
        to: "to-blue-900/40",
        ring: "ring-sky-300/40",
        text: "text-sky-200",
      };
    case "snow":
      return {
        name: "Frost",
        from: "from-cyan-200/25",
        via: "via-sky-300/20",
        to: "to-indigo-300/20",
        ring: "ring-cyan-200/40",
        text: "text-cyan-100",
      };
    case "storm":
      return {
        name: "Tempest",
        from: "from-purple-700/40",
        via: "via-indigo-900/40",
        to: "to-fuchsia-700/30",
        ring: "ring-purple-400/40",
        text: "text-purple-200",
      };
    case "fog":
      return {
        name: "Veil",
        from: "from-zinc-300/20",
        via: "via-slate-400/20",
        to: "to-zinc-500/20",
        ring: "ring-zinc-300/30",
        text: "text-zinc-100",
      };
  }
}

export function uvLabel(uv: number) {
  if (uv < 3) return { label: "Low", tone: "text-emerald-300" };
  if (uv < 6) return { label: "Moderate", tone: "text-amber-300" };
  if (uv < 8) return { label: "High", tone: "text-orange-300" };
  if (uv < 11) return { label: "Very High", tone: "text-rose-300" };
  return { label: "Extreme", tone: "text-fuchsia-300" };
}

export function aqiLabel(aqi: number) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "Unhealthy";
  return "Hazardous";
}

export function compass(deg: number) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fmtHour(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric" });
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
