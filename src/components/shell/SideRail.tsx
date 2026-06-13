"use client";

import {
  Activity,
  BarChart3,
  BookOpenText,
  Calendar,
  Camera,
  Cloud,
  Globe2,
  Heart,
  Home,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";

const items = [
  { icon: Home, label: "Today", id: "today" },
  { icon: BarChart3, label: "Life Scores", id: "scores" },
  { icon: Sparkles, label: "Mood", id: "mood" },
  { icon: BookOpenText, label: "Story", id: "story" },
  { icon: Activity, label: "Timeline", id: "timeline" },
  { icon: Heart, label: "Assistant", id: "assistant" },
  { icon: Users, label: "Community", id: "community" },
  { icon: Globe2, label: "Travel", id: "travel" },
  { icon: ShieldAlert, label: "Alerts", id: "alerts" },
  { icon: Calendar, label: "Planner", id: "planner" },
];

export function SideRail() {
  return (
    <aside className="sticky top-0 z-20 hidden h-screen w-[84px] flex-col items-center gap-2 border-r border-white/10 bg-black/20 py-4 backdrop-blur-xl lg:flex">
      <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-verse-glow to-verse-aurora p-2.5 text-white shadow-glow">
        <Cloud className="size-5" />
      </div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        Verse
      </div>
      <nav className="mt-4 flex flex-col items-center gap-1">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className="group relative flex h-12 w-12 items-center justify-center rounded-xl border border-transparent text-muted transition hover:border-white/10 hover:bg-white/5 hover:text-white"
            title={it.label}
          >
            <it.icon className="size-5" />
            <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md border border-white/10 bg-black/70 px-2 py-1 text-[11px] text-white shadow-ring group-hover:block">
              {it.label}
            </span>
          </a>
        ))}
      </nav>
      <div className="mt-auto flex flex-col items-center gap-1 text-[10px] text-muted">
        <Camera className="size-4" />
        <span>v0.1</span>
      </div>
    </aside>
  );
}
