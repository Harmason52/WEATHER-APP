export type WeatherMood = "clear" | "clouds" | "rain" | "snow" | "storm" | "fog";

export interface WeatherHour {
  time: string;
  hour: number;
  tempC: number;
  feelsLikeC: number;
  rainProb: number;
  windKph: number;
  humidity: number;
  uv: number;
  cloudPct: number;
  pop: number;
  condition: WeatherMood;
  icon: string;
}

export interface WeatherDay {
  date: string;
  label: string;
  highC: number;
  lowC: number;
  rainProb: number;
  condition: WeatherMood;
  summary: string;
  uv: number;
  windKph: number;
}

export interface AirQuality {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  category: "Good" | "Moderate" | "Unhealthy" | "Hazardous";
}

export interface CurrentWeather {
  city: string;
  region?: string;
  country: string;
  lat: number;
  lon: number;
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  windKph: number;
  windDir: number;
  pressure: number;
  visibilityKm: number;
  uv: number;
  cloudPct: number;
  condition: WeatherMood;
  conditionLabel: string;
  icon: string;
  sunrise: string;
  sunset: string;
  updatedAt: string;
  rainProb: number;
}

export interface WeatherBundle {
  current: CurrentWeather;
  hourly: WeatherHour[];
  daily: WeatherDay[];
  air: AirQuality;
  source: "openweather" | "demo";
}

export type ScoreKey =
  | "outdoor"
  | "travel"
  | "health"
  | "fitness"
  | "photo"
  | "farming"
  | "solar";

export interface LifeScore {
  key: ScoreKey;
  label: string;
  emoji: string;
  score: number;
  band: "Poor" | "Fair" | "Good" | "Great" | "Peak";
  insight: string;
  drivers: string[];
  accent: string;
}

export type MoodKey =
  | "adventurous"
  | "romantic"
  | "productive"
  | "relaxing"
  | "active";

export interface MoodActivity {
  title: string;
  blurb: string;
  emoji: string;
  fitScore: number;
}

export interface DisasterAlert {
  id: string;
  kind:
    | "flood"
    | "storm"
    | "lightning"
    | "air"
    | "heat"
    | "cold"
    | "wildfire";
  severity: "info" | "watch" | "warning" | "critical";
  title: string;
  body: string;
  area: string;
  startsAt: string;
  endsAt: string;
  source: string;
}

export interface CommunityReport {
  id: string;
  user: { name: string; handle: string; avatarHue: number };
  place: string;
  posted: string;
  condition: WeatherMood;
  note: string;
  trust: number;
  likes: number;
  media?: { kind: "image" | "video"; gradient: string };
}

export interface TravelCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
  tempC: number;
  condition: WeatherMood;
  aqi: number;
  tourismScore: number;
  crowdLevel: "Low" | "Moderate" | "Heavy";
  highlight: string;
}
