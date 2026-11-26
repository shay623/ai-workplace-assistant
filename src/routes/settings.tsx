import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/app-shell";
import { Disclaimer } from "@/components/output-box";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings — AI Workplace Assistant" },
    { name: "description", content: "About your AI workplace assistant and how your data is handled." },
    { property: "og:title", content: "Settings — AI Workplace Assistant" },
    { property: "og:description", content: "About your AI workplace assistant." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SettingsPage,
});

function SettingsPage() {
  const rows = [
    ["AI model", "Managed AI model, tuned prompts per tool"],
    ["Data storage", "None — nothing is saved. Refreshing the page clears your work."],
    ["Account", "No sign-in required"],
    ["Version", "1.0"],
  ];
  return (
    <div className="space-y-5">
      <PageHead title="Settings" sub="How AI Workplace Assistant works and handles your information." />
      <div className="panel divide-y divide-border">
        {rows.map(([k, v]) => <div key={k} className="flex flex-col gap-1 p-4 sm:flex-row sm:justify-between"><span className="font-medium">{k}</span><span className="text-sm text-muted-foreground">{v}</span></div>)}
      </div>
      <Disclaimer />
    </div>
  );
}
