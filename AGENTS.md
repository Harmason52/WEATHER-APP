# AGENTS.md

## Cursor Cloud specific instructions

WeatherVerse is a single Next.js 14 (App Router) + TypeScript web app/PWA. There is no database, backend service, or container — the only runtime is the Next.js dev server, which also hosts the API routes under `src/app/api/*`.

- Standard commands live in `package.json`: `npm run dev` (dev server on port 3000), `npm run lint`, `npm run build`, `npm run start`.
- All external API keys (OpenWeather, OpenAI, Mapbox) are optional. With no keys, the app falls back to a deterministic demo-data engine and every feature still works, so no secrets are required to run or test it. Optional keys go in `.env.local` (see `.env.example`).
- There is no automated test suite (no test script or test framework). Validate changes via `npm run lint` and manual interaction with the dev server.
