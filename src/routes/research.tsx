import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell, Field } from "@/components/app/ToolShell";
import { OutputPane } from "@/components/app/OutputPane";
import { useGeneration } from "@/hooks/use-generation";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content: "Distil long articles and reports into takeaways and recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Distil long articles and reports into takeaways and recommendations.",
      },
    ],
  }),
  component: ResearchPage,
});

const SYSTEM = `You are a research analyst producing briefing notes for busy executives.
Return markdown with exactly these sections:
## Executive Summary
Exactly 3 bullets.
## Key Takeaways
5-8 bullets, each a single dense insight.
## Core Recommendations
Numbered list of concrete, actionable recommendations.
## Caveats & Gaps
Bullets on what the source does not establish. Only use information present in the supplied material; if the input is a topic rather than a text, say so and clearly label general knowledge.`;

function ResearchPage() {
  const [source, setSource] = useState("");
  const [fieldError, setFieldError] = useState("");
  const { status, markdown, error, run, retry } = useGeneration();

  const submit = () => {
    if (!source.trim()) {
      setFieldError("Paste an article, report or topic to research.");
      return;
    }
    setFieldError("");
    void run(SYSTEM, `SOURCE MATERIAL OR TOPIC:\n${source}`);
  };

  return (
    <ToolShell
      icon={Search}
      title="AI Research Assistant"
      description="Long reports in, decision-ready briefing notes out."
      config={
        <>
          <Field label="Article, report or topic" error={fieldError}>
            <Textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              rows={16}
              placeholder="Paste the full text, or describe the topic you need briefed…"
              className={fieldError ? "border-destructive" : ""}
            />
          </Field>
          <Button className="w-full" onClick={submit} disabled={status === "loading"}>
            <Wand2 className="size-4" />
            {status === "loading" ? "Analysing…" : "Summarize & analyse"}
          </Button>
        </>
      }
      preview={
        <OutputPane
          status={status}
          markdown={markdown}
          error={error}
          onRetry={retry}
          filename="research-brief"
          emptyHint="Paste source material to get takeaways, recommendations and a 3-bullet summary."
        />
      }
    />
  );
}