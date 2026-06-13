"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { LifeScore, WeatherBundle } from "@/lib/types";
import { computeLifeScores } from "@/lib/scores";

interface State {
  bundle: WeatherBundle | null;
  scores: LifeScore[];
  loading: boolean;
  city: string;
  unit: "metric" | "imperial";
  error: string | null;
}

interface WeatherCtx extends State {
  setCity: (city: string) => void;
  setUnit: (u: "metric" | "imperial") => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<WeatherCtx | null>(null);

async function fetchBundle(city: string): Promise<WeatherBundle> {
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({
    bundle: null,
    scores: [],
    loading: true,
    city: "San Francisco",
    unit: "metric",
    error: null,
  });

  const load = useCallback(async (city: string) => {
    setState((s) => ({ ...s, loading: true, error: null, city }));
    try {
      const bundle = await fetchBundle(city);
      const scores = computeLifeScores(bundle);
      setState((s) => ({ ...s, bundle, scores, loading: false }));
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : "Unknown error",
      }));
    }
  }, []);

  useEffect(() => {
    const savedCity =
      (typeof window !== "undefined" && localStorage.getItem("wv-city")) ||
      "San Francisco";
    const savedUnit =
      ((typeof window !== "undefined" &&
        localStorage.getItem("wv-unit")) as "metric" | "imperial" | null) ||
      "metric";
    setState((s) => ({ ...s, city: savedCity, unit: savedUnit }));
    load(savedCity);
  }, [load]);

  const setCity = useCallback(
    (city: string) => {
      localStorage.setItem("wv-city", city);
      load(city);
    },
    [load],
  );

  const setUnit = useCallback((unit: "metric" | "imperial") => {
    localStorage.setItem("wv-unit", unit);
    setState((s) => ({ ...s, unit }));
  }, []);

  const refresh = useCallback(() => load(state.city), [load, state.city]);

  const value = useMemo<WeatherCtx>(
    () => ({ ...state, setCity, setUnit, refresh }),
    [state, setCity, setUnit, refresh],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWeather() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWeather must be used inside WeatherProvider");
  return c;
}
