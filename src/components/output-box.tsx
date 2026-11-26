import { useState } from "react";
import { Check, Copy, Pencil, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="btn-ghost"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* ignore */ }
      }}
    >
      {done ? <Check size={14} /> : <Copy size={14} />} {done ? "Copied" : "Copy"}
    </button>
  );
}

export function OutputBox({ value, onChange, markdown }: { value: string; onChange: (v: string) => void; markdown?: boolean }) {
  const [edit, setEdit] = useState(!markdown);
  return (
    <div className="panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="eyebrow">Result · editable</span>
        <div className="flex gap-1">
          {markdown && (
            <button className="btn-ghost" onClick={() => setEdit(!edit)}>
              {edit ? <Eye size={14} /> : <Pencil size={14} />} {edit ? "Preview" : "Edit"}
            </button>
          )}
          <CopyButton text={value} />
        </div>
      </div>
      {edit ? (
        <textarea className="field min-h-[360px] rounded-none border-0 font-mono text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <div className="prose-out p-5"><ReactMarkdown>{value}</ReactMarkdown></div>
      )}
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded-md border border-border bg-muted px-4 py-3 text-xs text-muted-foreground">
      <strong className="text-foreground">Responsible AI:</strong> outputs are AI-generated and may contain errors or omissions. Review, fact-check and edit before professional use. Avoid pasting confidential information.
    </p>
  );
}

export function ErrorNote({ msg }: { msg: string }) {
  return <p className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">{msg}</p>;
}
