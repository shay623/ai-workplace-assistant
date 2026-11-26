import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { runAI } from "@/lib/ai.functions";
import { PageHead } from "@/components/app-shell";
import { Disclaimer, ErrorNote, OutputBox } from "@/components/output-box";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [
    { title: "Smart Email Generator — AI Workplace Assistant" },
    { name: "description", content: "Generate complete professional emails in a formal, friendly or persuasive tone." },
    { property: "og:title", content: "Smart Email Generator — AI Workplace Assistant" },
    { property: "og:description", content: "Generate complete professional emails with AI." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: EmailPage,
});

const tones = ["Formal", "Friendly", "Persuasive"];

function EmailPage() {
  const ai = useServerFn(runAI);
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState("Formal");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const go = async () => {
    if (!details.trim()) return setErr("Please describe the purpose of your email.");
    setLoading(true); setErr("");
    try { const r = await ai({ data: { kind: "email", details, tone } }); setOut(r.text); }
    catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  };
  return (
    <div className="space-y-5">
      <PageHead title="Smart Email Generator" sub="Describe the purpose, recipient and key details." />
      <div className="panel space-y-4 p-5">
        <textarea className="field min-h-[140px]" placeholder="e.g. Follow up with Sarah from Northwind about the Q1 proposal we sent last week; ask for a call next Tuesday." value={details} onChange={(e) => setDetails(e.target.value)} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">Tone</span>
          {tones.map((t) => <button key={t} onClick={() => setTone(t)} className={`chip ${tone === t ? "chip-on" : ""}`}>{t}</button>)}
          <button className="btn-primary ml-auto" onClick={go} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />} {loading ? "Writing…" : out ? "Regenerate" : "Generate email"}
          </button>
        </div>
      </div>
      {err && <ErrorNote msg={err} />}
      {out && <OutputBox value={out} onChange={setOut} />}
      <Disclaimer />
    </div>
  );
}
