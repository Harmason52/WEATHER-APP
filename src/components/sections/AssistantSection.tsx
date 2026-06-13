"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWeather } from "@/components/shell/WeatherProvider";

interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
  source?: "openai" | "local";
}

const suggestions = [
  "Can I wash clothes today?",
  "Is it safe to travel?",
  "Best time to jog?",
  "Should I water my crops?",
  "What should I wear?",
];

export function AssistantSection() {
  const { bundle } = useWeather();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "intro",
      role: "assistant",
      text: "Ask me anything about today's conditions. I'll cross-reference the forecast and air quality for you.",
      source: "local",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    if (!text.trim() || !bundle) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: text,
          city: bundle.current.city,
          condition: bundle.current.conditionLabel,
          tempC: bundle.current.tempC,
          rainProb: bundle.current.rainProb,
          windKph: bundle.current.windKph,
          humidity: bundle.current.humidity,
          uv: bundle.current.uv,
          aqi: bundle.air.aqi,
        }),
      });
      const data = (await res.json()) as { answer: string; source: "openai" | "local" };
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: data.answer,
          source: data.source,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "I couldn't reach the model just now — try again in a moment.",
          source: "local",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="lg:col-span-3">
      <SectionHeader
        id="assistant"
        eyebrow="06 · Smart AI Assistant"
        title="Decisions, not data dumps"
        description="Ask in plain language. The assistant grounds answers in your live local conditions."
      />
      <div className="glass flex h-[460px] flex-col rounded-2xl">
        <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-verse-glow/40 to-verse-aurora/40">
                  <Bot className="size-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-verse-glow to-verse-aurora text-white"
                    : "border border-white/10 bg-white/5"
                }`}
              >
                {m.text}
                {m.role === "assistant" && m.source && (
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted">
                    <Sparkles className="size-3" />
                    {m.source === "openai" ? "GPT" : "Local engine"}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="text-xs text-muted">Thinking through the conditions…</div>
          )}
        </div>

        <div className="border-t border-white/10 px-4 py-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-muted hover:bg-white/10"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about today…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-verse-glow to-verse-aurora text-white hover:opacity-90"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
