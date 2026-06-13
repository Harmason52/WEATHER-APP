import type { MoodActivity, MoodKey, WeatherBundle } from "./types";
import { moodLabel } from "./format";

const moodLibrary: Record<MoodKey, MoodActivity[]> = {
  adventurous: [
    { title: "Trail Run", emoji: "🥾", blurb: "Lace up — the loop you've been saving is calling.", fitScore: 0 },
    { title: "Urban Photo Walk", emoji: "📷", blurb: "Hit the side streets while the light is doing interesting things.", fitScore: 0 },
    { title: "Kayak Loop", emoji: "🛶", blurb: "Calm winds, low wake — paddle out to the headland.", fitScore: 0 },
    { title: "Rooftop Sunset", emoji: "🌇", blurb: "Skybar plan. The cloud deck will make it cinematic.", fitScore: 0 },
  ],
  romantic: [
    { title: "Coffee Date", emoji: "☕", blurb: "Window seat, slow morning, two flat whites.", fitScore: 0 },
    { title: "Picnic Hour", emoji: "🧺", blurb: "Pack the blanket — the park is at its best right now.", fitScore: 0 },
    { title: "Stargazing", emoji: "🌌", blurb: "Drive 30 minutes out. Sky will be a clean canvas tonight.", fitScore: 0 },
    { title: "Slow Dinner", emoji: "🕯️", blurb: "Reserve the corner table. Long, lit, unhurried.", fitScore: 0 },
  ],
  productive: [
    { title: "Library Sprint", emoji: "📚", blurb: "Two deep blocks, no notifications. You'll close three tabs.", fitScore: 0 },
    { title: "Café Block", emoji: "💻", blurb: "Bring the heavy ticket. Hum + steam is your unlock.", fitScore: 0 },
    { title: "Walk-and-Talk", emoji: "🚶", blurb: "Take that 1:1 mobile. Standing meetings move ideas faster.", fitScore: 0 },
    { title: "Inbox Zero", emoji: "📥", blurb: "Knock the queue, then reward yourself with the patio.", fitScore: 0 },
  ],
  relaxing: [
    { title: "Reading Nook", emoji: "📖", blurb: "Tea, a chapter, no screen. Rest counts as work.", fitScore: 0 },
    { title: "Bath + Album", emoji: "🛁", blurb: "Run the bath, queue a 47-minute record, decompress.", fitScore: 0 },
    { title: "Slow Stroll", emoji: "🌳", blurb: "Aim for a leafy block. 25 minutes is the magic number.", fitScore: 0 },
    { title: "Movie Matinee", emoji: "🎬", blurb: "Indoor reset. The big screen + cool seats sound perfect.", fitScore: 0 },
  ],
  active: [
    { title: "Bike Loop", emoji: "🚴", blurb: "Tailwind on the back half — pace it negative split.", fitScore: 0 },
    { title: "Pickup Match", emoji: "⚽", blurb: "Conditions hold for the whole game window.", fitScore: 0 },
    { title: "Open Swim", emoji: "🏊", blurb: "Pool's quiet at this hour. Hit your lap count.", fitScore: 0 },
    { title: "HIIT Outdoors", emoji: "🏋️", blurb: "Twenty minutes, four rounds, the park bench is your gym.", fitScore: 0 },
  ],
};

export function recommendActivities(
  bundle: WeatherBundle,
  mood: MoodKey,
): MoodActivity[] {
  const c = bundle.current;
  const base = moodLibrary[mood];
  return base
    .map((a) => {
      let fit = 70;
      if (c.condition === "storm") fit -= 30;
      if (c.condition === "rain") fit -= 15;
      if (c.condition === "snow") fit -= 10;
      if (c.condition === "clear") fit += 10;
      if (c.tempC > 32 || c.tempC < 5) fit -= 10;
      if (mood === "active" && c.rainProb > 60) fit -= 15;
      if (mood === "relaxing" && c.condition === "rain") fit += 12;
      if (mood === "romantic" && c.condition === "clouds") fit += 6;
      if (mood === "adventurous" && c.condition === "clear") fit += 8;
      if (mood === "productive" && c.condition !== "clear") fit += 5;
      fit = Math.max(15, Math.min(99, fit));
      return { ...a, fitScore: fit };
    })
    .sort((a, b) => b.fitScore - a.fitScore);
}

export function buildLocalStory(b: WeatherBundle): string {
  const morning = b.hourly.find((h) => h.hour >= 7 && h.hour <= 10) ?? b.hourly[0];
  const noon = b.hourly.find((h) => h.hour >= 12 && h.hour <= 14) ?? b.hourly[4];
  const eve = b.hourly.find((h) => h.hour >= 17 && h.hour <= 19) ?? b.hourly[8];
  const night = b.hourly.find((h) => h.hour >= 20 && h.hour <= 23) ?? b.hourly[12];
  const m = (label: string, h: typeof morning) =>
    `${label} brings ${Math.round(h.tempC)}°C with ${moodLabel(h.condition).toLowerCase()}`;
  return `${m("Morning", morning)}. ${m("Midday", noon)} as the sky settles into its rhythm. ${m(
    "Evening",
    eve,
  )}, fading into a ${moodLabel(night.condition).toLowerCase()} night around ${Math.round(
    night.tempC,
  )}°C.`;
}
