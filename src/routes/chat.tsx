import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2, Pencil, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { runAI } from "@/lib/ai.functions";
import { PageHead } from "@/components/app-shell";
import { CopyButton, Disclaimer, ErrorNote } from "@/components/output-box";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [
    { title: "AI Workplace Chat — Atelier" },
    { name: "description", content: "Ask workplace questions and get dynamic, practical AI answers." },
    { property: "og:title", content: "AI Workplace Chat — Atelier" },
    { property: "og:description", content: "A workplace assistant for everyday professional questions." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };
const starters = ["How do I run a productive 30-minute team meeting?", "Help me prioritise a week with too many deadlines", "How should I give constructive feedback to a peer?"];

function ChatPage() {
  const ai = useServerFn(runAI);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const send = async (history: Msg[]) => {
    setMsgs(history); setLoading(true); setErr("");
    try { const r = await ai({ data: { kind: "chat", messages: history } }); setMsgs([...history, { role: "assistant", content: r.text }]); }
    catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  };
  const submit = (q = text) => { if (!q.trim() || loading) return; setText(""); send([...msgs, { role: "user", content: q.trim() }]); };
  const saveEdit = (i: number) => {
    const m = msgs[i]; if (!m || !draft.trim()) return;
    setEditing(null);
    if (m.role === "user") send([...msgs.slice(0, i), { role: "user", content: draft.trim() }]);
    else setMsgs(msgs.map((x, j) => (j === i ? { ...x, content: draft } : x)));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <PageHead title="Workplace Chat" sub="Ask anything about your work. Edit any message to refine." />
        {msgs.length > 0 && <button className="btn-ghost" onClick={() => { setMsgs([]); setErr(""); }}><Trash2 size={14} /> Clear</button>}
      </div>
      <div className="panel flex h-[60vh] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
          {msgs.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="font-display text-2xl">What are you working on?</p>
              <div className="flex flex-wrap justify-center gap-2">{starters.map((s) => <button key={s} className="chip text-left" onClick={() => submit(s)}>{s}</button>)}</div>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`group flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={m.role === "user" ? "max-w-[85%] rounded-lg bg-primary px-4 py-2.5 text-primary-foreground" : "w-full max-w-[95%]"}>
                {editing === i ? (
                  <div className="space-y-2">
                    <textarea className="field min-h-[100px] text-foreground" value={draft} onChange={(e) => setDraft(e.target.value)} />
                    <div className="flex gap-2"><button className="btn-primary" onClick={() => saveEdit(i)}>{m.role === "user" ? "Save & resend" : "Save"}</button><button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button></div>
                  </div>
                ) : m.role === "user" ? <p className="whitespace-pre-wrap">{m.content}</p> : <div className="prose-out"><ReactMarkdown>{m.content}</ReactMarkdown></div>}
                {editing !== i && (
                  <div className={`mt-1 flex gap-1 opacity-60 group-hover:opacity-100 ${m.role === "user" ? "justify-end [&_button]:text-primary-foreground [&_button:hover]:bg-primary-foreground/10" : ""}`}>
                    <button className="btn-ghost" onClick={() => { setEditing(i); setDraft(m.content); }}><Pencil size={13} /> Edit</button>
                    <CopyButton text={m.content} />
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Thinking…</p>}
          <div ref={end} />
        </div>
        {err && <div className="px-4 pb-2"><ErrorNote msg={err} /></div>}
        <div className="flex items-end gap-2 border-t border-border p-3">
          <textarea className="field max-h-40 min-h-[48px] resize-none" rows={1} placeholder="Ask a workplace question…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }} />
          <button className="btn-primary h-12 w-12 justify-center p-0" onClick={() => submit()} disabled={loading || !text.trim()} aria-label="Send"><ArrowUp size={18} /></button>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}
