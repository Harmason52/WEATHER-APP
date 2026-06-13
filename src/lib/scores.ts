import type { LifeScore, ScoreKey, WeatherBundle } from "./types";
import { clamp } from "./format";

function band(score: number): LifeScore["band"] {
  if (score >= 90) return "Peak";
  if (score >= 75) return "Great";
  if (score >= 55) return "Good";
  if (score >= 35) return "Fair";
  return "Poor";
}

interface Recipe {
  key: ScoreKey;
  label: string;
  emoji: string;
  accent: string;
  insightTemplate: (s: number, drivers: string[]) => string;
  compute: (b: WeatherBundle) => { score: number; drivers: string[] };
}

function comfortPenalty(tempC: number, ideal = 22, span = 8) {
  const diff = Math.abs(tempC - ideal);
  return Math.max(0, 1 - diff / span);
}

const recipes: Recipe[] = [
  {
    key: "outdoor",
    label: "Outdoor Comfort",
    emoji: "🌤️",
    accent: "from-amber-300 to-rose-400",
    insightTemplate: (s) =>
      s >= 75
        ? "Conditions feel beautifully balanced — light layers and you're set."
        : s >= 50
        ? "Pleasant outdoors with a couple of caveats. Pack a backup layer."
        : "Outdoor time is doable but you'll feel the elements.",
    compute: (b) => {
      const { tempC, humidity, windKph } = b.current;
      const comfort = comfortPenalty(tempC, 22, 12) * 60;
      const rain = (100 - b.current.rainProb) * 0.2;
      const wind = clamp(100 - windKph * 1.6) * 0.15;
      const hum = clamp(100 - Math.abs(humidity - 55) * 1.4) * 0.05;
      const score = clamp(Math.round(comfort + rain + wind + hum));
      const drivers = [
        `${Math.round(tempC)}°C feels ${score >= 60 ? "ideal" : "off-ideal"}`,
        `${b.current.rainProb}% rain risk`,
        `${windKph} km/h wind`,
      ];
      return { score, drivers };
    },
  },
  {
    key: "travel",
    label: "Travel Conditions",
    emoji: "🛣️",
    accent: "from-sky-400 to-indigo-500",
    insightTemplate: (s) =>
      s >= 75
        ? "Roads, runways, and rails look open and smooth."
        : s >= 50
        ? "Travel is workable. Build in a small buffer for slowdowns."
        : "Expect delays — consider rescheduling or remote alternatives.",
    compute: (b) => {
      const fog = b.current.condition === "fog" ? 35 : 0;
      const storm = b.current.condition === "storm" ? 50 : 0;
      const rain = b.current.rainProb * 0.5;
      const wind = Math.max(0, b.current.windKph - 25) * 1.5;
      const visibility = Math.max(0, 10 - b.current.visibilityKm) * 4;
      const penalty = fog + storm + rain + wind + visibility;
      const score = clamp(Math.round(100 - penalty));
      return {
        score,
        drivers: [
          `${b.current.visibilityKm} km visibility`,
          `${b.current.windKph} km/h wind`,
          `${b.current.rainProb}% precipitation chance`,
        ],
      };
    },
  },
  {
    key: "health",
    label: "Health & Allergies",
    emoji: "🌿",
    accent: "from-emerald-400 to-teal-500",
    insightTemplate: (s) =>
      s >= 75
        ? "Air feels clean — gentle on lungs and sinuses."
        : s >= 50
        ? "Borderline air quality. Sensitive groups should keep meds handy."
        : "Air quality is poor. Limit prolonged outdoor exposure.",
    compute: (b) => {
      const aqi = b.air.aqi;
      const aqiScore = clamp(100 - aqi * 0.5);
      const pollen = b.current.condition === "clear" ? 25 : 10;
      const humidityPen = Math.max(0, b.current.humidity - 70) * 0.6;
      const score = clamp(Math.round(aqiScore - pollen + 20 - humidityPen));
      return {
        score,
        drivers: [
          `AQI ${aqi} (${b.air.category})`,
          `PM2.5 ${b.air.pm25} µg/m³`,
          `${b.current.humidity}% humidity`,
        ],
      };
    },
  },
  {
    key: "fitness",
    label: "Sports & Fitness",
    emoji: "🏃",
    accent: "from-lime-300 to-emerald-500",
    insightTemplate: (s) =>
      s >= 75
        ? "Prime conditions for a run, ride, or pickup match."
        : s >= 50
        ? "Workable — hydrate well and time it around showers."
        : "Push the workout indoors — outdoor effort will feel brutal.",
    compute: (b) => {
      const heat = b.current.tempC > 30 ? (b.current.tempC - 30) * 4 : 0;
      const cold = b.current.tempC < 5 ? (5 - b.current.tempC) * 4 : 0;
      const rain = b.current.rainProb * 0.4;
      const aqi = Math.max(0, b.air.aqi - 60) * 0.5;
      const wind = Math.max(0, b.current.windKph - 25) * 1.0;
      const score = clamp(Math.round(100 - heat - cold - rain - aqi - wind));
      return {
        score,
        drivers: [
          `${Math.round(b.current.feelsLikeC)}°C feels-like`,
          `AQI ${b.air.aqi}`,
          `${b.current.rainProb}% rain risk`,
        ],
      };
    },
  },
  {
    key: "photo",
    label: "Photography",
    emoji: "📸",
    accent: "from-fuchsia-400 to-purple-500",
    insightTemplate: (s) =>
      s >= 75
        ? "Magical light incoming — golden hour will be unreal."
        : s >= 50
        ? "Diffused light, moody scenes — great for portraits and architecture."
        : "Flat or harsh light. Lean into the abstract and the urban.",
    compute: (b) => {
      let score = 50;
      if (b.current.condition === "clouds") score += 25;
      if (b.current.condition === "clear") score += 20;
      if (b.current.condition === "storm") score += 15;
      if (b.current.condition === "rain") score += 10;
      if (b.current.condition === "fog") score += 30;
      score -= Math.max(0, b.air.aqi - 80) * 0.3;
      score -= Math.max(0, b.current.windKph - 30) * 0.8;
      return {
        score: clamp(Math.round(score)),
        drivers: [
          `${b.current.conditionLabel}`,
          `${b.current.cloudPct}% cloud cover`,
          `${Math.round(b.current.uv)} UV index`,
        ],
      };
    },
  },
  {
    key: "farming",
    label: "Farming",
    emoji: "🌾",
    accent: "from-yellow-300 to-lime-500",
    insightTemplate: (s) =>
      s >= 75
        ? "Field conditions are favorable — good window for irrigation and inspections."
        : s >= 50
        ? "Mixed conditions — prioritize sheltered tasks and monitor soil moisture."
        : "Hold off on planting and spraying. Focus on drainage and equipment checks.",
    compute: (b) => {
      let score = 60;
      if (b.current.condition === "rain") score -= 25;
      if (b.current.condition === "storm") score -= 45;
      if (b.current.condition === "clear") score += 10;
      if (b.current.tempC < 5 || b.current.tempC > 35) score -= 20;
      score -= Math.max(0, b.current.windKph - 30) * 1.2;
      if (b.current.humidity > 85) score -= 10;
      return {
        score: clamp(Math.round(score)),
        drivers: [
          `${Math.round(b.current.tempC)}°C, ${b.current.humidity}% humidity`,
          `${b.current.rainProb}% precipitation`,
          `${b.current.windKph} km/h wind`,
        ],
      };
    },
  },
  {
    key: "solar",
    label: "Solar Potential",
    emoji: "☀️",
    accent: "from-amber-300 to-yellow-500",
    insightTemplate: (s) =>
      s >= 75
        ? "Panels will hum today — peak generation expected midday."
        : s >= 50
        ? "Decent yield with intermittent dips behind clouds."
        : "Low generation window. Lean on the grid or storage today.",
    compute: (b) => {
      const cloud = 100 - b.current.cloudPct;
      const uv = b.current.uv * 8;
      const rainPen = b.current.rainProb * 0.4;
      const score = clamp(Math.round(cloud * 0.55 + uv * 0.45 - rainPen));
      return {
        score,
        drivers: [
          `${b.current.cloudPct}% cloud cover`,
          `UV ${b.current.uv}`,
          `${b.current.rainProb}% rain probability`,
        ],
      };
    },
  },
];

export function computeLifeScores(bundle: WeatherBundle): LifeScore[] {
  return recipes.map((r) => {
    const { score, drivers } = r.compute(bundle);
    return {
      key: r.key,
      label: r.label,
      emoji: r.emoji,
      score,
      band: band(score),
      insight: r.insightTemplate(score, drivers),
      drivers,
      accent: r.accent,
    };
  });
}
