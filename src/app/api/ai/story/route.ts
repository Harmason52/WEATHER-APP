import { NextRequest, NextResponse } from "next/server";
import { openaiChat } from "@/lib/openai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    city: string;
    condition: string;
    tempC: number;
    rainProb: number;
    windKph: number;
    hourly: { hour: number; condition: string; tempC: number; rainProb: number }[];
  };

  const ai = await openaiChat(
    [
      {
        role: "system",
        content:
          "You are a weather storyteller. Write a vivid, three-sentence narrative of today's weather for a city. Cinematic but factual. Avoid emojis.",
      },
      {
        role: "user",
        content: `City: ${body.city}\nNow: ${body.condition}, ${Math.round(body.tempC)}°C, ${body.rainProb}% rain, ${body.windKph} km/h wind.\nNext 12 hours: ${body.hourly
          .map((h) => `${h.hour}h ${h.condition} ${Math.round(h.tempC)}°`)
          .join(", ")}.`,
      },
    ],
    { temperature: 0.8, maxTokens: 220 },
  );

  if (ai) return NextResponse.json({ story: ai.trim(), source: "openai" });

  const morning = body.hourly[0];
  const noon = body.hourly[Math.min(4, body.hourly.length - 1)];
  const eve = body.hourly[Math.min(8, body.hourly.length - 1)];
  const story = `Morning in ${body.city} opens at ${Math.round(
    morning.tempC,
  )}°C with ${morning.condition}. Midday settles into ${noon.condition} as temperatures move toward ${Math.round(
    noon.tempC,
  )}°C. By evening the sky leans ${eve.condition}, closing the day around ${Math.round(eve.tempC)}°C.`;
  return NextResponse.json({ story, source: "local" });
}
