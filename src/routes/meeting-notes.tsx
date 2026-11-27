import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, NotebookPen } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { runAI } from "@/lib/ai.functions";
import { PageHead } from "@/components/app-shell";
import { Disclaimer, ErrorNote, OutputBox } from "@/components/output-box";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({ meta: [
    { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
    { name: "description", content: "Summarize lengthy meeting notes and extract action items, decisions and deadlines." },
    { property: "og:title", content: "Meeting Notes Summarizer — AI Workplace Assistant" },
    { property: "og:description", content: "Turn long meeting notes into a summary, decisions, action items and deadlines." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MeetingNotesPage,
});

function MeetingNotesPage() {
  const ai = useServerFn(runAI);
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const go = async () => {
    if (!notes.trim()) return setErr("Please paste your meeting notes.");
    setLoading(true); setErr("");
    try { const r = await ai({ data: { kind: "notes", notes } }); setOut(r.text); }
    catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  };
  return (
    <div className="space-y-5">
      <PageHead title="Meeting Notes Summarizer" sub="Paste lengthy meeting notes — get a summary, decisions, action items and deadlines." />
      <div className="panel space-y-4 p-5">
        <textarea
          className="field min-h-[240px]"
          placeholder="Paste your meeting notes here… e.g. Attendees, what was discussed, anything decided, who is doing what and by when."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">{notes.trim() ? `${notes.trim().length} characters` : "Meeting notes"}</span>
          <button className="btn-primary" onClick={go} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <NotebookPen size={16} />} {loading ? "Summarizing…" : out ? "Regenerate" : "Summarize notes"}
          </button>
        </div>
      </div>
      {err && <ErrorNote msg={err} />}
      {out && <OutputBox value={out} onChange={setOut} markdown />}
      <Disclaimer />
    </div>
  );
}
