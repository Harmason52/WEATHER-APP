import { NextRequest, NextResponse } from "next/server";
import type { DisasterAlert } from "@/lib/types";
import { buildDemoBundle } from "@/lib/demoWeather";

export const runtime = "edge";

function hash(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") ?? "your area";
  const bundle = buildDemoBundle(city);
  const r = rng(hash(city + new Date().toISOString().slice(0, 10)));

  const alerts: DisasterAlert[] = [];
  const now = Date.now();
  const push = (a: Omit<DisasterAlert, "id" | "startsAt" | "endsAt" | "area" | "source">) =>
    alerts.push({
      ...a,
      id: `${a.kind}-${alerts.length}`,
      area: `${city} metro area`,
      startsAt: new Date(now + r() * 1000 * 60 * 30).toISOString(),
      endsAt: new Date(now + (4 + r() * 8) * 1000 * 60 * 60).toISOString(),
      source: "WeatherVerse risk fusion",
    });

  if (bundle.current.condition === "storm") {
    push({
      kind: "storm",
      severity: "warning",
      title: "Thunderstorm advisory",
      body: "Strong gusts and frequent lightning likely through late afternoon. Secure outdoor furniture, avoid open spaces.",
    });
    push({
      kind: "lightning",
      severity: "watch",
      title: "Cloud-to-ground lightning probable",
      body: "Pause rooftop, pool, and tall-equipment activity until the cell clears.",
    });
  }
  if (bundle.current.condition === "rain" && bundle.current.rainProb > 60) {
    push({
      kind: "flood",
      severity: "watch",
      title: "Localized flooding watch",
      body: "Heavy bursts could overwhelm storm drains in low-lying neighborhoods. Avoid underpasses if water is present.",
    });
  }
  if (bundle.air.aqi >= 120) {
    push({
      kind: "air",
      severity: bundle.air.aqi > 200 ? "warning" : "watch",
      title: `Air quality ${bundle.air.aqi > 200 ? "warning" : "watch"} (AQI ${bundle.air.aqi})`,
      body: "Sensitive groups should limit prolonged outdoor exertion. Consider an N95 if you must be outside.",
    });
  }
  if (bundle.current.tempC > 34) {
    push({
      kind: "heat",
      severity: bundle.current.tempC > 40 ? "critical" : "warning",
      title: "Heat advisory",
      body: "Sustained high temperatures expected. Hydrate aggressively, check on vulnerable neighbors, plan exertion before 10am.",
    });
  }
  if (bundle.current.tempC < 0) {
    push({
      kind: "cold",
      severity: "watch",
      title: "Cold exposure watch",
      body: "Sub-freezing conditions can cause frostbite within 30 minutes of unprotected exposure. Layer thoughtfully.",
    });
  }

  // Always include an info bullet for variety
  if (alerts.length === 0) {
    push({
      kind: "air",
      severity: "info",
      title: "All clear",
      body: "No active hazards. Sensors will alert you the moment any condition crosses threshold.",
    });
  }

  return NextResponse.json({ alerts });
}
