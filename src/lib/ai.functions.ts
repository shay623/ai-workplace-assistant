import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "user" | "assistant"; content: string };
type Input =
  | { kind: "email"; details: string; tone: string }
  | { kind: "research"; source: string; mode: string }
  | { kind: "chat"; messages: Msg[] };

const SYSTEM = {
  email:
    "You are an expert business writer. Write a complete, ready-to-send professional email. Output in plain text: first line 'Subject: ...', blank line, then greeting, well-structured body paragraphs, a clear call to action, and a sign-off with [Your Name]. Match the requested tone precisely. Do not add commentary before or after the email.",
  research:
    "You are a senior research analyst. Analyse the provided material and respond in Markdown with exactly these sections: '## Summary' (one concise paragraph), '## Key Insights' (4-6 bullets), '## Important Points' (4-6 bullets with facts, figures or caveats), '## Practical Recommendations' (3-5 actionable bullets for professionals). If only a URL is given and you cannot access it, say so briefly and analyse based on what the URL and your general knowledge suggest, clearly flagged. Be accurate; never invent statistics.",
  chat:
    "You are Atelier, a knowledgeable workplace productivity assistant for professionals. Give practical, specific, well-structured answers (use Markdown headings, bullets and short paragraphs where helpful). Cover communication, planning, management, careers, writing, meetings and tools. Ask a clarifying question when a request is ambiguous. Be concise, honest about uncertainty, and never fabricate facts.",
};

function extractText(res: unknown): string {
  const r = res as { output_text?: string; output?: Array<{ type: string; content?: Array<{ type: string; text?: string }> }> };
  if (r.output_text) return r.output_text;
  return (r.output ?? [])
    .filter((o) => o.type === "message")
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text ?? "")
    .join("");
}

export const runAI = createServerFn({ method: "POST" })
  .inputValidator((d: Input) => d)
  .handler(async ({ data }) => {
    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    let instructions: string;
    let input: Msg[];
    if (data.kind === "email") {
      if (!data.details.trim()) throw new Error("Please describe the email.");
      instructions = SYSTEM.email;
      input = [{ role: "user", content: `Tone: ${data.tone}\n\nPurpose and details:\n${data.details.slice(0, 6000)}` }];
    } else if (data.kind === "research") {
      if (!data.source.trim()) throw new Error("Please provide a topic, text or URL.");
      instructions = SYSTEM.research;
      input = [{ role: "user", content: `Input type: ${data.mode}\n\n${data.source.slice(0, 20000)}` }];
    } else {
      instructions = SYSTEM.chat;
      input = data.messages.slice(-20).map((m) => ({ role: m.role, content: m.content.slice(0, 8000) }));
    }
    try {
      const res = await generateResponse({ model: "openai/gpt-6-astra", instructions, input });
      const text = extractText(res).trim();
      if (!text) throw new Error("The AI returned an empty response. Please try again.");
      return { text };
    } catch (e) {
      if (e instanceof GatewayError) {
        if (e.httpStatus === 429) throw new Error("Too many requests right now. Please wait a moment and try again.");
        if (e.httpStatus === 402) throw new Error("AI credits are exhausted. Please top up your workspace credits.");
        throw new Error("The AI service could not complete this request. Please try again.");
      }
      throw e;
    }
  });
