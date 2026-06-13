"use client";

import { AnimatedSky } from "@/components/ui/AnimatedSky";
import { TopBar } from "@/components/shell/TopBar";
import { SideRail } from "@/components/shell/SideRail";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { useWeather } from "@/components/shell/WeatherProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { bundle } = useWeather();

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <AnimatedSky condition={bundle?.current.condition ?? "clouds"} />

      <div className="relative z-10 flex min-h-screen">
        <SideRail />
        <div className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-10">
            {children}
          </main>
          <footer className="px-6 py-6 text-center text-xs text-muted">
            WeatherVerse · Lifestyle intelligence powered by weather. Demo data
            shown when no provider keys are configured.
          </footer>
        </div>
      </div>

      <CommandPalette />
    </div>
  );
}
