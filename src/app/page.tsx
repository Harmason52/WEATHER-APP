"use client";

import { HeroCurrent } from "@/components/sections/HeroCurrent";
import { LifeScoresSection } from "@/components/sections/LifeScoresSection";
import { MoodSection } from "@/components/sections/MoodSection";
import { StorySection } from "@/components/sections/StorySection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { AssistantSection } from "@/components/sections/AssistantSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { TravelSection } from "@/components/sections/TravelSection";
import { DisasterSection } from "@/components/sections/DisasterSection";
import { PlannerSection } from "@/components/sections/PlannerSection";
import { useWeather } from "@/components/shell/WeatherProvider";
import { SkeletonHero } from "@/components/ui/Skeleton";

export default function Page() {
  const { bundle, loading } = useWeather();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      {loading && !bundle ? <SkeletonHero /> : <HeroCurrent />}
      <LifeScoresSection />
      <div className="grid gap-8 lg:grid-cols-3">
        <MoodSection />
        <StorySection />
      </div>
      <TimelineSection />
      <div className="grid gap-8 lg:grid-cols-5">
        <AssistantSection />
        <CommunitySection />
      </div>
      <TravelSection />
      <DisasterSection />
      <PlannerSection />
    </div>
  );
}
