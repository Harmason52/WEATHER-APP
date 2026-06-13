"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWeather } from "@/components/shell/WeatherProvider";
import { buildLocalStory } from "@/lib/insights";

export function StorySection() {
  const { bundle, city } = useWeather();
  const [story, setStory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"local" | "openai">("local");

  const gen = useCallback(async () => {
    if (!bundle) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/story", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          city: bundle.current.city,
          condition: bundle.current.conditionLabel,
          tempC: bundle.current.tempC,
          rainProb: bundle.current.rainProb,
          windKph: bundle.current.windKph,
          hourly: bundle.hourly.slice(0, 12).map((h) => ({
            hour: h.hour,
            condition: h.condition,
            tempC: h.tempC,
            rainProb: h.rainProb,
          })),
        }),
      });
      const data = (await res.json()) as { story: string; source: "openai" | "local" };
      setStory(data.story);
      setSource(data.source);
    } catch {
      setStory(buildLocalStory(bundle));
      setSource("local");
    } finally {
      setLoading(false);
    }
  }, [bundle]);

  useEffect(() => {
    if (bundle) {
      setStory(buildLocalStory(bundle));
      gen();
    }
  }, [bundle, city, gen]);

  return (
    <section>
      <SectionHeader
        id="story"
        eyebrow="03 · Dynamic Weather Story"
        title="A narrative, not a forecast"
        description="The day, written like a chapter."
      />
      <div className="glass relative overflow-hidden rounded-2xl p-5">
        <div className="absolute -right-12 -top-12 size-44 rounded-full bg-verse-glow/30 blur-3xl" />
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            <Sparkles className="size-3.5" />
            {source === "openai" ? "AI · GPT" : "Local narrative engine"}
          </div>
          <button
            onClick={gen}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Rewrite
          </button>
        </div>

        <motion.p
          key={story}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-balance text-lg leading-relaxed text-white/90"
        >
          {story || "Composing today's story…"}
        </motion.p>

        <div className="mt-5 flex flex-wrap gap-2">
          {["Morning", "Midday", "Evening", "Night"].map((seg) => (
            <span
              key={seg}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted"
            >
              {seg}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
