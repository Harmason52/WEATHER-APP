import { NextResponse } from "next/server";
import type { TravelCity, WeatherMood } from "@/lib/types";

export const runtime = "edge";

const base: Omit<TravelCity, "highlight" | "tempC" | "condition" | "aqi" | "tourismScore" | "crowdLevel">[] = [
  { name: "San Francisco", country: "US", lat: 37.77, lon: -122.42 },
  { name: "Tokyo", country: "JP", lat: 35.68, lon: 139.65 },
  { name: "London", country: "GB", lat: 51.5, lon: -0.13 },
  { name: "Reykjavik", country: "IS", lat: 64.13, lon: -21.94 },
  { name: "Dubai", country: "AE", lat: 25.2, lon: 55.27 },
  { name: "Lagos", country: "NG", lat: 6.52, lon: 3.38 },
  { name: "Rio de Janeiro", country: "BR", lat: -22.9, lon: -43.17 },
  { name: "Sydney", country: "AU", lat: -33.87, lon: 151.21 },
  { name: "Mumbai", country: "IN", lat: 19.07, lon: 72.88 },
  { name: "Vancouver", country: "CA", lat: 49.28, lon: -123.12 },
  { name: "Cape Town", country: "ZA", lat: -33.92, lon: 18.42 },
  { name: "Singapore", country: "SG", lat: 1.35, lon: 103.82 },
];

const moods: WeatherMood[] = ["clear", "clouds", "rain", "storm", "snow", "fog"];

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

export async function GET() {
  const cities: TravelCity[] = base.map((c, i) => {
    const tempC = Math.round(10 + Math.sin(c.lat / 30) * 18 + ((i * 7) % 11));
    const condition = pick(moods, i + Math.abs(Math.round(c.lat)));
    const aqi = 30 + ((i * 23) % 160);
    const tourism = Math.max(20, 95 - aqi / 3 - (condition === "storm" ? 30 : 0));
    const crowd: TravelCity["crowdLevel"] =
      tourism > 75 ? "Heavy" : tourism > 55 ? "Moderate" : "Low";
    const highlight =
      condition === "clear"
        ? `${c.name} is in a postcard mood right now — sun, low haze, and tourism conditions are at their seasonal best.`
        : condition === "rain"
        ? `Pack an umbrella for ${c.name}. Café-and-museum loops outperform open-air sightseeing today.`
        : condition === "storm"
        ? `Avoid open-water excursions in ${c.name} — storm activity is unsettling normally calm itineraries.`
        : condition === "snow"
        ? `${c.name} is at its romantic best — bring traction footwear and lean into the indoor-outdoor flow.`
        : condition === "fog"
        ? `Moody, dreamlike conditions in ${c.name}. Great for photography, less great for skyline observation decks.`
        : `Comfortable, low-drama weather in ${c.name}. Plan ambitious routes — you've got the runway for it.`;
    return {
      ...c,
      tempC,
      condition,
      aqi,
      tourismScore: Math.round(tourism),
      crowdLevel: crowd,
      highlight,
    };
  });
  return NextResponse.json({ cities });
}
