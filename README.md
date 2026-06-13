# WeatherVerse

> Lifestyle intelligence powered by weather. Not a forecast — a decision engine.

WeatherVerse is a next-generation weather platform that answers the only question that matters:

> **"How will today's weather affect my life?"**

Instead of one big number, the app translates atmosphere into seven contextual life scores, a mood-driven activity engine, a dynamic narrative forecast, a hyper-visual sky, a smart assistant, a community feed, a travel explorer, a disaster early-warning center, and an AI future-day planner.

---

## Feature map

| # | Feature | What it does |
| --- | --- | --- |
| 01 | **AI Daily Life Score** | Live 0–100 scores for Outdoor Comfort, Travel, Health & Allergies, Sports & Fitness, Photography, Farming, and Solar Potential — each with the drivers behind the number. |
| 02 | **Mood-Based Weather** | Pick a mood (Adventurous, Romantic, Productive, Relaxing, Active) and get a ranked, fit-scored list of activities. |
| 03 | **Dynamic Weather Story** | Generates a three-act narrative of the day (local engine + optional GPT). |
| 04 | **Hyper-Visual Interface** | Animated sky with stars, drifting clouds, real rainfall, snow, storms, fog, and a sun arc — color-themed to conditions. Glassmorphism throughout. |
| 05 | **Weather Timeline** | The day as a scrolling journey: Morning → Afternoon → Evening → Night, with micro-forecasts and suggested actions. |
| 06 | **Smart AI Assistant** | Plain-language questions ("Can I wash clothes today?", "Best time to jog?") grounded in live conditions. |
| 07 | **Community Weather Feed** | User-shared sightings with trust scores and verification badges. |
| 08 | **Travel Weather Explorer** | Interactive globe with temperature, AQI, tourist suitability, and crowd estimates for marquee cities. |
| 09 | **Disaster Early Warning Center** | Risk overlay map + alert cards for flood, storm, lightning, air, heat, cold, and wildfire. |
| 10 | **AI Future Day Planner** | Pick a date and intent — get best windows, activities, clothing, and travel guidance. |

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with custom glassmorphism, animated sky, and theme variables
- **Framer Motion** for transitions and reactive UI
- **lucide-react** for iconography
- **OpenWeather API** for live data (optional)
- **OpenAI** for story, assistant, and planner intelligence (optional)
- **Mapbox** token wired for future map layers (optional)
- **Progressive Web App** — installable with offline-friendly manifest and adaptive theme color

The app works fully without keys — a built-in, deterministic demo data engine produces high-fidelity weather for a curated set of seed cities so every feature is showcased out of the box.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in any keys you want; all optional
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment variables

All keys are optional. Without them, WeatherVerse falls back to a richly seeded demo intelligence engine.

| Variable | Purpose |
| --- | --- |
| `OPENWEATHER_API_KEY` | Live current, hourly, and air-quality data |
| `OPENAI_API_KEY` | Powers Story, Assistant, and Planner with GPT |
| `OPENAI_MODEL` | Override the default `gpt-4o-mini` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Reserved for future map overlays |

---

## Design language

- Inspired by Tesla, Apple Vision Pro, and modern space dashboards
- Glassmorphism with crisp 1px hairlines and soft, layered shadows
- Adaptive color palette per condition — sunny gold, deep-sea blue, dramatic purple, frost cyan
- Smooth, choreographed transitions with motion respecting user reduce-motion preferences
- Fully responsive, mobile-first, with desktop side rail and command palette (⌘/Ctrl + K)
- Dark and light mode

---

## Project structure

```
src/
├─ app/
│  ├─ api/
│  │  ├─ weather/route.ts        # OpenWeather proxy with demo fallback
│  │  ├─ ai/story/route.ts       # GPT-powered narrative forecast
│  │  ├─ ai/assistant/route.ts   # Grounded chat answers
│  │  ├─ ai/planner/route.ts     # Future-day plan JSON
│  │  ├─ community/route.ts      # Seeded community reports
│  │  ├─ travel/route.ts         # Global cities snapshot
│  │  └─ disasters/route.ts      # Live alert fusion
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ shell/                     # AppShell, TopBar, SideRail, theme + weather providers
│  ├─ sections/                  # All ten feature sections
│  └─ ui/                        # AnimatedSky, SectionHeader, Skeleton
└─ lib/                          # types, formatting, scoring, demo data, OpenAI client
```

---

## Roadmap

- Live Mapbox layers for radar and pollution drift
- Real community uploads with content moderation
- Apple Wallet pass for daily life-score summary
- Wearable integration (Health, Garmin) for personalized fitness windows
- Multilingual narrative engine

---

WeatherVerse is built to feel **premium, futuristic, addictive, and unlike any other weather app**.
