import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner & Agenda Builder — Workplace AI" },
      {
        name: "description",
        content: "Prioritise with the Eisenhower Matrix and build a time-blocked schedule.",
      },
      { property: "og:title", content: "AI Task Planner & Agenda Builder — Workplace AI" },
      {
        property: "og:description",
        content: "Prioritise with the Eisenhower Matrix and build a time-blocked schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

const SYSTEM = `You are a productivity coach specialising in the Eisenhower Matrix and time-blocking.
Return markdown with exactly these sections:
## Priority Matrix
A markdown table with columns: Quadrant | Task | Rationale. Quadrants: Do First (urgent+important), Schedule (important), Delegate (urgent), Eliminate.
## Time-Blocked Schedule
A markdown table with columns: Time | Focus Block | Output. Use realistic hour or 30-minute blocks across the working hours provided, including breaks and buffer time.
## Daily Focus Rules
3 short bullets. Keep the plan achievable — do not overload the day.`;

function PlannerPage() {
  const [goals, setGoals] = useState("");
  const [timeframe, setTimeframe] = useState("Daily");
  const [hours, setHours] = useState("09:00 – 17:00");
  const [fieldError, setFieldError] = useState("");
  const { status, markdown, error, run, retry } = useGeneration();

  const submit = () => {
    if (!goals.trim()) {
      setFieldError("List the work goals or tasks to plan.");
      return;
    }
    setFieldError("");
    void run(
      SYSTEM,
      `TIMEFRAME: ${timeframe}\nWORKING HOURS: ${hours || "09:00 – 17:00"}\n\nGOALS / TASKS:\n${goals}`,
    );
  };

  return (
    <ToolShell
      icon={CalendarClock}
      title="AI Task Planner & Agenda Builder"
      description="Sort the noise into priorities, then block them into a realistic schedule."
      config={
        <>
          <Field label="Work goals & tasks" error={fieldError}>
            <Textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={10}
              placeholder="Finish Q3 deck, reply to vendor, prep 1:1s, fix onboarding bug…"
              className={fieldError ? "border-destructive" : ""}
            />
          </Field>
          <Field label="Timeframe">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Daily", "Weekly"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Working hours" hint="Used to build your time blocks.">
            <Input value={hours} onChange={(e) => setHours(e.target.value)} />
          </Field>
          <Button className="w-full" onClick={submit} disabled={status === "loading"}>
            <Wand2 className="size-4" />
            {status === "loading" ? "Planning…" : "Build my plan"}
          </Button>
        </>
      }
      preview={
        <OutputPane
          status={status}
          markdown={markdown}
          error={error}
          onRetry={retry}
          filename="work-plan"
          emptyHint="Dump your task list and get a prioritised, time-blocked agenda."
        />
      }
    />
  );
}