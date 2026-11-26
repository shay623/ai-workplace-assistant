import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { runAI } from "@/lib/ai.functions";
import { PageHead } from "@/components/app-shell";
import { Disclaimer, ErrorNote, OutputBox } from "@/components/output-box";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [
    { title: "AI Research Assistant — AI Workplace Assistant" },
    { name: "description", content: "Summaries, key insights and practical recommendations from any topic, article or URL." },
    { property: "og:title", content: "AI Research Assistant — AI Workplace Assistant" },
    { property: "og:description", content: "Turn reading into structured, actionable notes." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ResearchPage,
});

const modes = { Topic: "e.g. Benefits and risks of a four-day work week", "Article text": "Paste the full article text here…", URL: "https://example.com/article" } as const;
type Mode = keyof typeof modes;

function ResearchPage() {
  const ai = useServerFn(runAI);
  const [mode, setMode] = useState<Mode>("Topic");
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const go = async () => {
    if (!src.trim()) return setErr("Please enter a topic, text or URL.");
    if (mode === "URL" && !/^https?:\/\/\S+$/.test(src.trim())) return setErr("Please enter a valid URL starting with http:// or https://");
    setLoading(true); setErr("");
    try { const r = await ai({ data: { kind: "research", source: src, mode } }); setOut(r.text); }
    catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  };
  return (
    <div className="space-y-5">
      <PageHead title="Research Assistant" sub="Get a summary, key insights, important points and recommendations." />
      <div className="panel space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(modes) as Mode[]).map((m) => <button key={m} onClick={() => setMode(m)} className={`chip ${mode === m ? "chip-on" : ""}`}>{m}</button>)}
        </div>
        {mode === "URL"
          ? <input className="field" placeholder={modes[mode]} value={src} onChange={(e) => setSrc(e.target.value)} />
          : <textarea className={`field ${mode === "Topic" ? "min-h-[90px]" : "min-h-[220px]"}`} placeholder={modes[mode]} value={src} onChange={(e) => setSrc(e.target.value)} />}
        <div className="flex justify-end">
          <button className="btn-primary" onClick={go} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} {loading ? "Analysing…" : "Analyse"}
          </button>
        </div>
      </div>
      {err && <ErrorNote msg={err} />}
      {out && <OutputBox value={out} onChange={setOut} markdown />}
      <Disclaimer />
    </div>
  );
}
