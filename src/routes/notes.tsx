import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NotebookPen, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell, Field } from "@/components/app/ToolShell";
import { OutputPane } from "@/components/app/OutputPane";
import { useGeneration } from "@/hooks/use-generation";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content: "Turn raw transcripts into decisions, summaries and an action-item table.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI" },
      {
        property: "og:description",
        content: "Turn raw transcripts into decisions, summaries and an action-item table.",
      },
    ],
  }),
  component: NotesPage,
});

const SYSTEM = `You are a chief of staff who writes flawless meeting minutes.
From the supplied transcript or messy notes, produce markdown with exactly these sections:
## Executive Summary
3-5 sentences.
## Key Decisions
Bulleted list of decisions actually made.
## Action Items
A markdown table with columns: Task | Assignee | Deadline. Use "Unassigned" or "TBD" when not stated.
## Open Questions
Bulleted list. Never invent attendees, decisions or dates.`;

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [fieldError, setFieldError] = useState("");
  const { status, markdown, error, run, retry } = useGeneration();

  const submit = () => {
    if (!notes.trim()) {
      setFieldError("Paste the meeting transcript or notes.");
      return;
    }
    setFieldError("");
    void run(SYSTEM, `MEETING NOTES / TRANSCRIPT:\n${notes}`);
  };

  return (
    <ToolShell
      icon={NotebookPen}
      title="Meeting Notes Summarizer"
      description="Decisions, owners and deadlines extracted from any messy transcript."
      config={
        <>
          <Field label="Raw transcript or notes" error={fieldError}>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={16}
              placeholder="Paste the meeting transcript, Otter export or your scribbled notes…"
              className={fieldError ? "border-destructive" : ""}
            />
          </Field>
          <Button className="w-full" onClick={submit} disabled={status === "loading"}>
            <Wand2 className="size-4" />
            {status === "loading" ? "Summarizing…" : "Summarize meeting"}
          </Button>
        </>
      }
      preview={
        <OutputPane
          status={status}
          markdown={markdown}
          error={error}
          onRetry={retry}
          filename="meeting-summary"
          emptyHint="Paste any transcript and get a summary, decisions and an action-item table."
        />
      }
    />
  );
}