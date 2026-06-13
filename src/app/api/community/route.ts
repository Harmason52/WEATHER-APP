import { NextRequest, NextResponse } from "next/server";
import type { CommunityReport, WeatherMood } from "@/lib/types";

export const runtime = "edge";

const sampleNotes = [
  "Sky just cleared on the east side — light wind, gorgeous.",
  "Mist rolling in fast over the bay, visibility dropping.",
  "Sun shower downtown — bright but raining, full rainbow on 4th.",
  "Hail-sized pellets near the park, take cover.",
  "Wind picked up suddenly, tree branches down on the avenue.",
  "Snow flurries are sticking on the hills, roads still clear.",
  "Heat shimmering off the asphalt — proper scorcher today.",
  "Lightning to the south, no thunder yet.",
];

const moods: WeatherMood[] = ["clear", "clouds", "rain", "snow", "storm", "fog"];

const gradients = [
  "linear-gradient(135deg,#ffd166,#ef476f)",
  "linear-gradient(135deg,#1d3557,#a8dadc)",
  "linear-gradient(135deg,#06d6a0,#118ab2)",
  "linear-gradient(135deg,#7c5cff,#5ce0ff)",
  "linear-gradient(135deg,#0f172a,#7c3aed)",
  "linear-gradient(135deg,#0ea5e9,#22d3ee)",
];

function rand(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function hash(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const names = [
  ["Mira", "mira"],
  ["Theo", "theo_o"],
  ["Anika", "ani.k"],
  ["Jules", "julesin"],
  ["Sora", "sora.x"],
  ["Kenji", "kenji.k"],
  ["Lena", "lena_w"],
  ["Diego", "diegoq"],
];

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") ?? "your city";
  const r = rand(hash(city));
  const out: CommunityReport[] = Array.from({ length: 8 }).map((_, i) => {
    const [name, handle] = names[Math.floor(r() * names.length)];
    const mood = moods[Math.floor(r() * moods.length)];
    const trust = 40 + Math.floor(r() * 55);
    return {
      id: `${city}-${i}-${Math.floor(r() * 9999)}`,
      user: { name, handle, avatarHue: Math.floor(r() * 360) },
      place: city,
      posted: new Date(Date.now() - Math.floor(r() * 1000 * 60 * 60 * 6)).toISOString(),
      condition: mood,
      note: sampleNotes[Math.floor(r() * sampleNotes.length)],
      trust,
      likes: Math.floor(r() * 220),
      media: r() > 0.5
        ? {
            kind: r() > 0.7 ? "video" : "image",
            gradient: gradients[Math.floor(r() * gradients.length)],
          }
        : undefined,
    };
  });
  return NextResponse.json(out.sort((a, b) => b.trust - a.trust));
}
