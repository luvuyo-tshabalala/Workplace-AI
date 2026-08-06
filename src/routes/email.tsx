import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolShell, Field } from "@/components/app/ToolShell";
import { OutputPane } from "@/components/app/OutputPane";
import { useGeneration } from "@/hooks/use-generation";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content: "Draft structured, on-tone workplace emails with subject line and sign-off.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "Draft structured, on-tone workplace emails with subject line and sign-off.",
      },
    ],
  }),
  component: EmailPage,
});

const SYSTEM = `You are an executive communications specialist.
Draft a complete, ready-to-send workplace email in markdown with exactly these sections:
## Subject Line
## Salutation
## Body
(2-4 tight paragraphs; use bullets where it improves scanning; include a clear call to action)
## Sign-off
Match the requested tone and audience precisely. Never invent facts not present in the context; use [bracketed placeholders] instead.`;

function EmailPage() {
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("Formal");
  const [audience, setAudience] = useState("Manager");
  const [error1, setError1] = useState("");
  const { status, markdown, error, run, retry } = useGeneration();

  const submit = () => {
    if (!context.trim()) {
      setError1("Describe what the email should cover.");
      return;
    }
    setError1("");
    void run(
      SYSTEM,
      `TONE: ${tone}\nAUDIENCE: ${audience}\n\nCONTEXT / KEY DETAILS:\n${context}`,
    );
  };

  return (
    <ToolShell
      icon={Mail}
      title="Smart Email Generator"
      description="Turn rough notes into a structured, professional email in seconds."
      config={
        <>
          <Field label="Context / key details" error={error1}>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={9}
              placeholder="Ask the client for a 1 week extension on the design review; blocked by late assets…"
              className={error1 ? "border-destructive" : ""}
            />
          </Field>
          <Field label="Tone">
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Formal", "Informal", "Persuasive"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Target audience">
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Manager", "Client", "Team"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button className="w-full" onClick={submit} disabled={status === "loading"}>
            <Wand2 className="size-4" />
            {status === "loading" ? "Drafting…" : "Generate email"}
          </Button>
        </>
      }
      preview={
        <OutputPane
          status={status}
          markdown={markdown}
          error={error}
          onRetry={retry}
          filename="email-draft"
          emptyHint="Describe the situation and pick a tone — your draft appears here, fully editable."
        />
      }
    />
  );
}