"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Camera, CheckCircle2, Image as ImageIcon, MessageSquare, ThumbsUp, Video } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { CommunityReport, WeatherMood } from "@/lib/types";
import { useWeather } from "@/components/shell/WeatherProvider";

const moodEmoji: Record<WeatherMood, string> = {
  clear: "☀️",
  clouds: "☁️",
  rain: "🌧️",
  snow: "❄️",
  storm: "⛈️",
  fog: "🌫️",
};

export function CommunitySection() {
  const { city } = useWeather();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch(`/api/community?city=${encodeURIComponent(city)}`)
      .then((r) => r.json())
      .then((d: CommunityReport[]) => setReports(d))
      .catch(() => {});
  }, [city]);

  const post = async () => {
    if (!draft.trim()) return;
    setPosting(true);
    const r: CommunityReport = {
      id: crypto.randomUUID(),
      user: { name: "You", handle: "you", avatarHue: 200 },
      place: city,
      posted: new Date().toISOString(),
      condition: "clouds",
      note: draft,
      trust: 60,
      likes: 0,
    };
    setReports((prev) => [r, ...prev]);
    setDraft("");
    setTimeout(() => setPosting(false), 500);
  };

  return (
    <section className="lg:col-span-2">
      <SectionHeader
        id="community"
        eyebrow="07 · Community Feed"
        title="Eyes on the sky, everywhere"
        description="People around the city report what they see — the system verifies and ranks trustworthy posts."
      />

      <div className="glass flex h-[460px] flex-col rounded-2xl">
        <div className="space-y-3 overflow-y-auto p-4 scrollbar-thin">
          {reports.length === 0 && (
            <div className="text-sm text-muted">
              No verified reports yet for {city}. Be the first to share what you see.
            </div>
          )}
          {reports.map((r) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="grid size-8 place-items-center rounded-full text-sm font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, hsl(${r.user.avatarHue} 80% 60%), hsl(${(r.user.avatarHue + 60) % 360} 80% 50%))`,
                  }}
                >
                  {r.user.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {r.user.name}{" "}
                    <span className="text-muted">@{r.user.handle}</span>
                  </div>
                  <div className="text-[11px] text-muted">
                    {r.place} · {new Date(r.posted).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                  </div>
                </div>
                <div className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-200">
                  <CheckCircle2 className="size-3" />
                  Trust {r.trust}
                </div>
              </div>

              {r.media && (
                <div
                  className="mt-2 aspect-video w-full overflow-hidden rounded-lg"
                  style={{ background: r.media.gradient }}
                >
                  <div className="flex h-full items-end justify-between p-2 text-[10px] uppercase text-white/80">
                    <span>{moodEmoji[r.condition]} {r.condition}</span>
                    <span className="inline-flex items-center gap-1">
                      {r.media.kind === "image" ? (
                        <ImageIcon className="size-3" />
                      ) : (
                        <Video className="size-3" />
                      )}
                      {r.media.kind}
                    </span>
                  </div>
                </div>
              )}

              <p className="mt-2 text-sm leading-relaxed">{r.note}</p>

              <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="size-3.5" /> {r.likes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="size-3.5" /> Reply
                </span>
                <span className="ml-auto">{moodEmoji[r.condition]} {r.condition}</span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <Camera className="size-4 opacity-70" />
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`What's the sky doing in ${city}?`}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
            />
            <button
              onClick={post}
              disabled={posting || !draft}
              className="rounded-lg bg-gradient-to-br from-verse-glow to-verse-aurora px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
