import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutGrid, Mail, BookOpen, MessageSquare, Settings, Menu, X, NotebookPen } from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/meeting-notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const current = nav.find((n) => n.to === path)?.label ?? "";
  return (
    <div className="flex min-h-screen w-full">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between px-5">
          <span className="font-display text-lg leading-tight">AI Workplace Assistant<span className="text-sidebar-primary">.</span></span>
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="space-y-1 px-3">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={`nav-item ${path === n.to ? "nav-active" : ""}`}>
              <n.icon size={16} /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pt-3 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="nav-item w-full border border-sidebar-border text-sidebar-foreground"
          >
            <X size={16} /> Exit
          </button>
        </div>
        <p className="absolute bottom-5 left-5 right-5 text-xs text-sidebar-foreground/50">AI workplace productivity assistant</p>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/40 md:hidden" onClick={() => setOpen(false)} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <span className="text-sm text-muted-foreground">Workspace / <span className="text-foreground">{current}</span></span>
          <span className="ml-auto rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">AI ready</span>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
      <p className="mt-1 text-muted-foreground">{sub}</p>
    </div>
  );
}
