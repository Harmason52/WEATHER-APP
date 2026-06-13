import { NextRequest, NextResponse } from "next/server";
import { buildDemoBundle } from "@/lib/demoWeather";
import type {
  AirQuality,
  CurrentWeather,
  WeatherBundle,
  WeatherDay,
  WeatherHour,
  WeatherMood,
} from "@/lib/types";

export const runtime = "edge";

function mapCondition(main: string): WeatherMood {
  const m = main.toLowerCase();
  if (m.includes("thunder")) return "storm";
  if (m.includes("snow")) return "snow";
  if (m.includes("rain") || m.includes("drizzle")) return "rain";
  if (m.includes("cloud")) return "clouds";
  if (m.includes("mist") || m.includes("fog") || m.includes("haze") || m.includes("smoke"))
    return "fog";
  return "clear";
}

async function ow(path: string, params: Record<string, string>) {
  const url = new URL(`https://api.openweathermap.org${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`OpenWeather ${res.status}`);
  return res.json();
}

function aqiCategory(aqi: number): AirQuality["category"] {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "Unhealthy";
  return "Hazardous";
}

async function loadFromOpenWeather(city: string): Promise<WeatherBundle> {
  const key = process.env.OPENWEATHER_API_KEY!;
  const geo = await ow("/geo/1.0/direct", { q: city, limit: "1", appid: key });
  if (!Array.isArray(geo) || geo.length === 0) {
    throw new Error("No geocoding results");
  }
  const { lat, lon, name, country } = geo[0] as {
    lat: number;
    lon: number;
    name: string;
    country: string;
  };

  const [now, forecast, air] = await Promise.all([
    ow("/data/2.5/weather", {
      lat: String(lat),
      lon: String(lon),
      appid: key,
      units: "metric",
    }),
    ow("/data/2.5/forecast", {
      lat: String(lat),
      lon: String(lon),
      appid: key,
      units: "metric",
    }),
    ow("/data/2.5/air_pollution", {
      lat: String(lat),
      lon: String(lon),
      appid: key,
    }).catch(() => null),
  ]);

  const condition = mapCondition(now.weather?.[0]?.main ?? "Clear");
  const current: CurrentWeather = {
    city: name,
    country,
    lat,
    lon,
    tempC: now.main?.temp ?? 20,
    feelsLikeC: now.main?.feels_like ?? 20,
    humidity: now.main?.humidity ?? 50,
    windKph: Math.round((now.wind?.speed ?? 0) * 3.6),
    windDir: now.wind?.deg ?? 0,
    pressure: now.main?.pressure ?? 1013,
    visibilityKm: Math.round(((now.visibility ?? 10000) / 1000) * 10) / 10,
    uv: 0,
    cloudPct: now.clouds?.all ?? 0,
    condition,
    conditionLabel: now.weather?.[0]?.description ?? "—",
    icon: now.weather?.[0]?.icon ?? "01d",
    sunrise: new Date((now.sys?.sunrise ?? Date.now() / 1000) * 1000).toISOString(),
    sunset: new Date((now.sys?.sunset ?? Date.now() / 1000) * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    rainProb: 0,
  };

  const hourly: WeatherHour[] = (forecast.list ?? [])
    .slice(0, 24)
    .map((entry: any) => {
      const date = new Date(entry.dt * 1000);
      const cond = mapCondition(entry.weather?.[0]?.main ?? "Clear");
      const popPct = Math.round((entry.pop ?? 0) * 100);
      return {
        time: date.toISOString(),
        hour: date.getHours(),
        tempC: entry.main?.temp ?? 20,
        feelsLikeC: entry.main?.feels_like ?? 20,
        rainProb: popPct,
        pop: popPct,
        windKph: Math.round((entry.wind?.speed ?? 0) * 3.6),
        humidity: entry.main?.humidity ?? 50,
        uv: 0,
        cloudPct: entry.clouds?.all ?? 0,
        condition: cond,
        icon: entry.weather?.[0]?.icon ?? "01d",
      } satisfies WeatherHour;
    });

  if (hourly[0]) current.rainProb = hourly[0].rainProb;

  const dailyMap = new Map<string, WeatherHour[]>();
  for (const h of hourly) {
    const key = h.time.slice(0, 10);
    if (!dailyMap.has(key)) dailyMap.set(key, []);
    dailyMap.get(key)!.push(h);
  }
  const daily: WeatherDay[] = Array.from(dailyMap.entries())
    .slice(0, 7)
    .map(([key, list], i) => {
      const high = Math.max(...list.map((h) => h.tempC));
      const low = Math.min(...list.map((h) => h.tempC));
      const rainProb = Math.max(...list.map((h) => h.rainProb));
      const cond = list.reduce((acc, h) => {
        acc.set(h.condition, (acc.get(h.condition) ?? 0) + 1);
        return acc;
      }, new Map<WeatherMood, number>());
      const condition = [...cond.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const d = new Date(key);
      return {
        date: d.toISOString(),
        label:
          i === 0
            ? "Today"
            : i === 1
            ? "Tomorrow"
            : d.toLocaleDateString(undefined, { weekday: "short" }),
        highC: Math.round(high),
        lowC: Math.round(low),
        rainProb,
        condition,
        summary: condition,
        uv: 0,
        windKph: Math.round(list.reduce((s, h) => s + h.windKph, 0) / list.length),
      };
    });

  let aqi: AirQuality = {
    aqi: 50,
    pm25: 10,
    pm10: 18,
    o3: 30,
    no2: 12,
    category: "Good",
  };
  if (air && air.list?.[0]) {
    const a = air.list[0];
    const idx = a.main?.aqi ?? 1;
    const aqiVal = [25, 75, 125, 175, 250][Math.max(1, Math.min(5, idx)) - 1];
    aqi = {
      aqi: aqiVal,
      pm25: a.components?.pm2_5 ?? 0,
      pm10: a.components?.pm10 ?? 0,
      o3: a.components?.o3 ?? 0,
      no2: a.components?.no2 ?? 0,
      category: aqiCategory(aqiVal),
    };
  }

  return { current, hourly, daily, air: aqi, source: "openweather" };
}

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") ?? "San Francisco";
  const key = process.env.OPENWEATHER_API_KEY;
  if (key) {
    try {
      const bundle = await loadFromOpenWeather(city);
      return NextResponse.json(bundle);
    } catch (e) {
      // Fall back to demo on any provider error
    }
  }
  return NextResponse.json(buildDemoBundle(city));
}
