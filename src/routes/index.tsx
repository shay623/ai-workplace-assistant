import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpen, MessageSquare, ArrowRight } from "lucide-react";
import { Disclaimer } from "@/components/output-box";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Dashboard — AI Workplace Assistant" },
    { name: "description", content: "Write emails, summarise research and get workplace answers with AI." },
    { property: "og:title", content: "AI Workplace Assistant" },
    { property: "og:description", content: "Write emails, summarise research and get workplace answers with AI." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", text: "Describe what you need and pick a tone — get a complete, polished email." },
  { to: "/research", icon: BookOpen, title: "Research Assistant", text: "Summaries, key insights and recommendations from a topic, article or URL." },
  { to: "/chat", icon: MessageSquare, title: "Workplace Chat", text: "Ask anything about work — planning, writing, meetings, careers." },
] as const;

function Index() {
  return (
    <div className="space-y-8">
      <section className="panel p-6 md:p-10">
        <span className="eyebrow">Good to see you</span>
        <h1 className="mt-2 max-w-2xl font-display text-3xl leading-tight md:text-5xl">Your quiet partner for sharper, faster work.</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">AI Workplace Assistant drafts emails, distils research and answers workplace questions — so you spend time deciding, not typing.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="panel group flex flex-col p-5 transition-colors hover:border-ring">
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary"><t.icon size={18} /></span>
            <h2 className="font-semibold">{t.title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{t.text}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">Open <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </section>
      <section className="panel grid gap-6 p-6 md:grid-cols-3">
        {[["Draft", "Formal, friendly or persuasive emails in seconds."], ["Distil", "Turn long reading into structured, actionable notes."], ["Discuss", "A context-aware assistant for everyday work questions."]].map(([a, b]) => (
          <div key={a}><p className="font-display text-xl">{a}</p><p className="text-sm text-muted-foreground">{b}</p></div>
        ))}
      </section>
      <Disclaimer />
    </div>
  );
}
