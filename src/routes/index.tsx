import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Six AI tools for resumes, emails, meeting notes, planning, research and workplace chat.",
      },
      { property: "og:title", content: "Dashboard — Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Automate workplace workflows and optimise your career assets with AI.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8">
      <section
        className="relative overflow-hidden rounded-3xl px-6 py-10 text-primary-foreground md:px-10 md:py-14"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
          <Zap className="size-3.5" /> Powered by Gemini
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          AI Workplace Productivity &amp; Career Assistant
        </h1>
        <p className="mt-3 max-w-xl text-sm text-primary-foreground/85 md:text-base">
          Optimise your resume, draft sharper emails, summarise meetings, plan your week and
          research faster — all in one editable workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5"
          >
            Optimize my resume <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Ask the assistant
          </Link>
        </div>
      </section>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        AI tools
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)]"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{tool.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{tool.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning-surface px-4 py-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
        <p className="text-xs text-warning-foreground">
          AI-generated content may contain inaccuracies. Please review, edit, and verify all
          details prior to export.
        </p>
      </div>
    </div>
  );
}
