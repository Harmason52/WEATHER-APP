"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light" | "system";
type Mode = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: Mode;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [resolved, setResolved] = useState<Mode>("dark");

  useEffect(() => {
    const saved = (typeof window !== "undefined"
      ? (localStorage.getItem("wv-theme") as Theme | null)
      : null) ?? "dark";
    setTheme(saved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const mode: Mode =
        theme === "system" ? (mq.matches ? "dark" : "light") : theme;
      setResolved(mode);
      document.documentElement.dataset.theme = mode;
      document.documentElement.classList.toggle("dark", mode === "dark");
      localStorage.setItem("wv-theme", theme);
    };
    apply();
    if (theme === "system") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, resolved }), [theme, resolved]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
