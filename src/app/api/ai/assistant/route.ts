import { NextRequest, NextResponse } from "next/server";
import { openaiChat } from "@/lib/openai";

export const runtime = "edge";

interface Ctx {
  question: string;
  city: string;
  condition: string;
  tempC: number;
  rainProb: number;
  windKph: number;
  humidity: number;
  uv: number;
  aqi: number;
}

function localAnswer(c: Ctx): string {
  const q = c.question.toLowerCase();
  const wet = c.rainProb > 40 || /rain|storm/i.test(c.condition);
  if (q.includes("wash") && q.includes("cloth")) {
    return wet
      ? `Risky. ${c.rainProb}% chance of rain in ${c.city} — line-drying could get caught out. Use the dryer or wait for the late-afternoon dry window.`
      : `Yes — ${c.humidity}% humidity and ${c.condition} should give you a solid drying window. Hang them out before mid-afternoon.`;
  }
  if (q.includes("travel") || q.includes("drive")) {
    if (/storm/i.test(c.condition))
      return `Hold off on long drives if you can — thunderstorms are active around ${c.city}. Local trips are okay with lights on and extra following distance.`;
    return wet
      ? `Travel is fine with caution. Expect glare-reducing overcast and patchy showers, so add a 10-minute buffer.`
      : `Travel looks clean today in ${c.city}. Light winds (${c.windKph} km/h), good visibility, no major delays expected.`;
  }
  if (q.includes("jog") || q.includes("run") || q.includes("workout")) {
    if (c.aqi > 120)
      return `Skip the outdoor run — air quality (AQI ${c.aqi}) is rough. Move it indoors or pick an easier session.`;
    if (c.tempC > 30)
      return `Early morning (before 8am) or after 7pm is best — midday will be hot at ${Math.round(c.tempC)}°C. Hydrate hard.`;
    return `Good window now or in the next 2 hours. ${Math.round(
      c.tempC,
    )}°C, ${c.windKph} km/h wind, ${c.rainProb}% rain risk — comfortable conditions.`;
  }
  if (q.includes("water") && q.includes("crop")) {
    return wet
      ? `No — rain is expected (${c.rainProb}%). Hold irrigation and check drainage instead.`
      : `Yes — water early morning to reduce evaporation losses. ${c.condition}, ${c.humidity}% humidity.`;
  }
  if (q.includes("wear") || q.includes("dress")) {
    if (c.tempC < 8) return `Layer up — base, mid, light shell. It's ${Math.round(c.tempC)}°C in ${c.city}.`;
    if (c.tempC > 28) return `Breathable everything — linen, light cotton, UV-protective layer. ${Math.round(c.tempC)}°C and UV ${c.uv}.`;
    return `A light long-sleeve and a thin shell will cover the day. ${c.condition}, ${Math.round(c.tempC)}°C.`;
  }
  return `Right now in ${c.city}: ${c.condition}, ${Math.round(
    c.tempC,
  )}°C, ${c.rainProb}% rain risk, AQI ${c.aqi}. Ask me about commuting, exercise, laundry, gardening, or what to wear.`;
}

export async function POST(req: NextRequest) {
  const ctx = (await req.json()) as Ctx;
  const ai = await openaiChat(
    [
      {
        role: "system",
        content:
          "You are WeatherVerse, a concise weather lifestyle assistant. Answer in 2-4 sentences. Use the conditions provided. Recommend a clear action.",
      },
      {
        role: "user",
        content: `Conditions in ${ctx.city}: ${ctx.condition}, ${Math.round(
          ctx.tempC,
        )}°C, rain ${ctx.rainProb}%, wind ${ctx.windKph} km/h, humidity ${ctx.humidity}%, UV ${ctx.uv}, AQI ${ctx.aqi}.\nQuestion: ${ctx.question}`,
      },
    ],
    { temperature: 0.5, maxTokens: 220 },
  );

  if (ai) return NextResponse.json({ answer: ai.trim(), source: "openai" });
  return NextResponse.json({ answer: localAnswer(ctx), source: "local" });
}
