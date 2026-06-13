import type {
  AirQuality,
  CurrentWeather,
  WeatherBundle,
  WeatherDay,
  WeatherHour,
  WeatherMood,
} from "./types";

interface Seedable {
  name: string;
  country: string;
  lat: number;
  lon: number;
  baseTemp: number;
  mood?: WeatherMood;
}

const seeds: Record<string, Seedable> = {
  "San Francisco": {
    name: "San Francisco",
    country: "US",
    lat: 37.7749,
    lon: -122.4194,
    baseTemp: 17,
    mood: "clouds",
  },
  Tokyo: {
    name: "Tokyo",
    country: "JP",
    lat: 35.6762,
    lon: 139.6503,
    baseTemp: 22,
    mood: "rain",
  },
  London: {
    name: "London",
    country: "GB",
    lat: 51.5074,
    lon: -0.1278,
    baseTemp: 14,
    mood: "clouds",
  },
  Reykjavik: {
    name: "Reykjavik",
    country: "IS",
    lat: 64.1466,
    lon: -21.9426,
    baseTemp: 6,
    mood: "snow",
  },
  Dubai: {
    name: "Dubai",
    country: "AE",
    lat: 25.2048,
    lon: 55.2708,
    baseTemp: 36,
    mood: "clear",
  },
  Lagos: {
    name: "Lagos",
    country: "NG",
    lat: 6.5244,
    lon: 3.3792,
    baseTemp: 30,
    mood: "storm",
  },
  "Rio de Janeiro": {
    name: "Rio de Janeiro",
    country: "BR",
    lat: -22.9068,
    lon: -43.1729,
    baseTemp: 27,
    mood: "clear",
  },
  Sydney: {
    name: "Sydney",
    country: "AU",
    lat: -33.8688,
    lon: 151.2093,
    baseTemp: 21,
    mood: "clear",
  },
  Mumbai: {
    name: "Mumbai",
    country: "IN",
    lat: 19.076,
    lon: 72.8777,
    baseTemp: 31,
    mood: "rain",
  },
  Vancouver: {
    name: "Vancouver",
    country: "CA",
    lat: 49.2827,
    lon: -123.1207,
    baseTemp: 13,
    mood: "fog",
  },
};

function hash(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
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

function moodForHour(base: WeatherMood, hour: number, rand: () => number): WeatherMood {
  if (base === "storm" && hour >= 14 && hour <= 19) return "storm";
  if (base === "rain" && hour >= 6 && hour <= 22 && rand() < 0.6) return "rain";
  if (base === "snow" && rand() < 0.7) return "snow";
  if (base === "fog" && hour < 9) return "fog";
  if (hour >= 19 || hour <= 5) return rand() < 0.5 ? "clear" : base;
  return base;
}

function iconFor(c: WeatherMood, hour: number) {
  const day = hour >= 6 && hour <= 19;
  switch (c) {
    case "clear":
      return day ? "01d" : "01n";
    case "clouds":
      return day ? "03d" : "03n";
    case "rain":
      return day ? "10d" : "10n";
    case "snow":
      return "13d";
    case "storm":
      return "11d";
    case "fog":
      return "50d";
  }
}

function labelFor(c: WeatherMood) {
  switch (c) {
    case "clear":
      return "Clear sky";
    case "clouds":
      return "Partly cloudy";
    case "rain":
      return "Light rain";
    case "snow":
      return "Snow showers";
    case "storm":
      return "Thunderstorm";
    case "fog":
      return "Fog";
  }
}

export function buildDemoBundle(cityName: string): WeatherBundle {
  const seed = seeds[cityName] ?? {
    name: cityName,
    country: "—",
    lat: 0,
    lon: 0,
    baseTemp: 20,
    mood: "clouds" as WeatherMood,
  };
  const rand = rng(hash(cityName + new Date().toISOString().slice(0, 10)));
  const baseMood = seed.mood ?? "clouds";

  const now = new Date();
  const startHour = now.getHours();

  const hourly: WeatherHour[] = Array.from({ length: 24 }, (_, i) => {
    const hour = (startHour + i) % 24;
    const date = new Date(now.getTime() + i * 60 * 60 * 1000);
    const diurnal = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 4;
    const tempC = seed.baseTemp + diurnal + (rand() - 0.5) * 2;
    const cond = moodForHour(baseMood, hour, rand);
    const rainProb =
      cond === "rain" || cond === "storm"
        ? 50 + Math.floor(rand() * 40)
        : Math.floor(rand() * 20);
    return {
      time: date.toISOString(),
      hour,
      tempC: Math.round(tempC * 10) / 10,
      feelsLikeC: Math.round((tempC - 1 + (rand() - 0.5)) * 10) / 10,
      rainProb,
      pop: rainProb,
      windKph: Math.round(6 + rand() * 22),
      humidity: 40 + Math.floor(rand() * 50),
      uv: Math.max(0, Math.round(Math.sin(((hour - 6) / 12) * Math.PI) * 9)),
      cloudPct: cond === "clear" ? 10 + Math.floor(rand() * 20) : 60 + Math.floor(rand() * 40),
      condition: cond,
      icon: iconFor(cond, hour),
    };
  });

  const daily: WeatherDay[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const cond: WeatherMood =
      i === 0
        ? baseMood
        : (["clear", "clouds", "rain", "storm", "fog", "snow"] as WeatherMood[])[
            Math.floor(rand() * 6)
          ];
    const high = seed.baseTemp + 4 + (rand() - 0.5) * 4;
    const low = seed.baseTemp - 6 + (rand() - 0.5) * 4;
    return {
      date: d.toISOString(),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString(undefined, { weekday: "short" }),
      highC: Math.round(high),
      lowC: Math.round(low),
      rainProb: cond === "rain" || cond === "storm" ? 60 + Math.floor(rand() * 40) : Math.floor(rand() * 30),
      condition: cond,
      summary: labelFor(cond),
      uv: Math.round(rand() * 11),
      windKph: Math.round(8 + rand() * 22),
    };
  });

  const sunrise = new Date(now);
  sunrise.setHours(6, 12, 0, 0);
  const sunset = new Date(now);
  sunset.setHours(19, 48, 0, 0);

  const current: CurrentWeather = {
    city: seed.name,
    country: seed.country,
    lat: seed.lat,
    lon: seed.lon,
    tempC: hourly[0].tempC,
    feelsLikeC: hourly[0].feelsLikeC,
    humidity: hourly[0].humidity,
    windKph: hourly[0].windKph,
    windDir: Math.floor(rand() * 360),
    pressure: 1000 + Math.floor(rand() * 30),
    visibilityKm: hourly[0].condition === "fog" ? 2 : 10 + Math.floor(rand() * 6),
    uv: hourly[0].uv,
    cloudPct: hourly[0].cloudPct,
    condition: hourly[0].condition,
    conditionLabel: labelFor(hourly[0].condition),
    icon: hourly[0].icon,
    sunrise: sunrise.toISOString(),
    sunset: sunset.toISOString(),
    updatedAt: now.toISOString(),
    rainProb: hourly[0].rainProb,
  };

  const aqiBase =
    baseMood === "storm" || baseMood === "rain"
      ? 35
      : baseMood === "fog"
      ? 110
      : baseMood === "clear"
      ? 55
      : 75;

  const aqi = aqiBase + Math.floor(rand() * 30);
  const air: AirQuality = {
    aqi,
    pm25: Math.round(aqi * 0.4 * 10) / 10,
    pm10: Math.round(aqi * 0.6 * 10) / 10,
    o3: Math.round(20 + rand() * 60),
    no2: Math.round(10 + rand() * 40),
    category:
      aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : aqi <= 200 ? "Unhealthy" : "Hazardous",
  };

  return { current, hourly, daily, air, source: "demo" };
}

export const seedCities = Object.keys(seeds);
