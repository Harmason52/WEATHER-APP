interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function openaiChat(
  messages: OpenAIMessage[],
  opts: { temperature?: number; json?: boolean; maxTokens?: number } = {},
): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens ?? 400,
        messages,
        response_format: opts.json ? { type: "json_object" } : undefined,
      }),
    });
    if (!res.ok) return null;
    const data: any = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}
