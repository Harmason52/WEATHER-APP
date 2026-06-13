import { NextRequest, NextResponse } from "next/server";
import { openaiChat } from "@/lib/openai";
import { buildDemoBundle } from "@/lib/demoWeather";

export const runtime = "edge";

interface Plan {
  date: string;
  city: string;
  summary: string;
  bestWindows: { label: string; range: string; reason: string }[];
  activities: { title: string; emoji: string; note: string }[];
  travel: string;
  clothing: { name: string; emoji: string }[];
  source: "openai" | "local";
}

function localPlan(city: string, date: string, intent: string): Plan {
  const bundle = buildDemoBundle(city);
  const cool = bundle.current.tempC < 18;
  const wet = bundle.current.rainProb > 40 || bundle.current.condition === "rain";
  return {
    date,
    city,
    summary: `For "${intent}", ${city} on ${new Date(date).toLocaleDateString(undefined, {
      weekday: "long",
    })} looks ${wet ? "cooler with passing showers" : cool ? "cool and mostly mild" : "pleasant and bright"}. Mid-morning and early evening will deliver the best comfort windows.`,
    bestWindows: [
      {
        label: "Morning",
        range: "9:30 – 11:30",
        reason: "Lowest UV, calm winds, soft light for any setup or photos.",
      },
      {
        label: "Late afternoon",
        range: "16:00 – 18:00",
        reason: "Temperatures soften as the sun drops — golden hour will be flattering.",
      },
    ],
    activities: [
      { title: "Anchor activity", emoji: "🎯", note: `Plan your main "${intent}" block during the morning window.` },
      { title: "Backup move", emoji: "🌂", note: wet ? "Have a covered fallback — a café, gallery, or pavilion." : "Optional shade canopy if midday sun stretches long." },
      { title: "Energy reset", emoji: "🍵", note: "Schedule a 30-min hydration / snack break before the second peak." },
    ],
    travel: wet
      ? "Allow a 15-minute buffer for slower transit. Avoid low-lying routes if heavier showers move through."
      : "Smooth conditions for biking, walking, or driving. No advisories expected.",
    clothing: cool
      ? [
          { name: "Light jacket", emoji: "🧥" },
          { name: "Layered top", emoji: "👕" },
          { name: "Comfort shoes", emoji: "👟" },
        ]
      : wet
      ? [
          { name: "Waterproof shell", emoji: "🧥" },
          { name: "Quick-dry tee", emoji: "👕" },
          { name: "Grippy shoes", emoji: "👟" },
        ]
      : [
          { name: "Breathable layers", emoji: "👚" },
          { name: "Sunglasses", emoji: "🕶️" },
          { name: "Hat", emoji: "🧢" },
        ],
    source: "local",
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { city: string; date: string; intent: string };
  const local = localPlan(body.city, body.date, body.intent);

  const ai = await openaiChat(
    [
      {
        role: "system",
        content:
          "You are an event-aware weather planner. Return ONLY a strict JSON object that matches this TypeScript type: { summary: string; bestWindows: {label:string;range:string;reason:string}[]; activities: {title:string;emoji:string;note:string}[]; travel: string; clothing: {name:string;emoji:string}[] }. Use realistic climatology for the city and date. Keep all text concise.",
      },
      {
        role: "user",
        content: `City: ${body.city}\nDate: ${body.date}\nIntent: ${body.intent}\nReturn JSON only.`,
      },
    ],
    { temperature: 0.5, json: true, maxTokens: 700 },
  );

  if (ai) {
    try {
      const parsed = JSON.parse(ai);
      return NextResponse.json({
        ...local,
        ...parsed,
        date: body.date,
        city: body.city,
        source: "openai",
      });
    } catch {}
  }
  return NextResponse.json(local);
}
