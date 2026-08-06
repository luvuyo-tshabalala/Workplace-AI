import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell, Field } from "@/components/app/ToolShell";
import { OutputPane } from "@/components/app/OutputPane";
import { useGeneration } from "@/hooks/use-generation";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "ATS Resume Optimizer — Workplace AI" },
      {
        name: "description",
        content: "Rewrite your resume into an ATS-friendly format and score keyword compliance.",
      },
      { property: "og:title", content: "ATS Resume Optimizer — Workplace AI" },
      {
        property: "og:description",
        content: "Rewrite your resume into an ATS-friendly format and score keyword compliance.",
      },
    ],
  }),
  component: ResumePage,
});

const SYSTEM = `You are a senior technical recruiter and certified resume writer specialising in Applicant Tracking Systems (ATS).
Analyse the target job description for keywords, then rewrite the candidate's resume into a single-column, plain-structure, ATS-friendly document.
Return GitHub-flavoured markdown with EXACTLY these sections in this order:
## ATS Compliance Rating
A score out of 100 as "Score: NN/100", then 3 bullets explaining the score and the top missing keywords.
## Professional Summary
3-4 sentence keyword-rich summary.
## Core Competencies
Bulleted list of 10-14 skills using the exact terminology from the job description.
## Work Experience
Each role as "**Title — Company** (dates)" followed by 3-5 quantified achievement bullets starting with strong action verbs.
## Education & Certifications
Never invent employers or credentials. Where a metric is unknown, use a clearly bracketed placeholder like [X%].`;

function ResumePage() {
  const [resume, setResume] = useState("");
  const [title, setTitle] = useState("");
  const [jd, setJd] = useState("");
  const [skills, setSkills] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { status, markdown, error, run, retry } = useGeneration();

  const submit = () => {
    const next: Record<string, string> = {};
    if (!resume.trim()) next["resume"] = "Paste your current resume text.";
    if (!title.trim()) next["title"] = "Add the target job title.";
    if (!jd.trim()) next["jd"] = "Paste the target job description.";
    setErrors(next);
    if (Object.keys(next).length) return;
    void run(
      SYSTEM,
      `TARGET JOB TITLE:\n${title}\n\nTARGET JOB DESCRIPTION:\n${jd}\n\nSKILL HIGHLIGHTS:\n${skills || "(none supplied)"}\n\nCURRENT RESUME:\n${resume}`,
    );
  };

  const err = (k: string) => (errors[k] ? "border-destructive" : "");

  return (
    <ToolShell
      icon={FileText}
      title="ATS Resume Optimization & Builder"
      description="Reformat your resume around the keywords a target role actually screens for."
      config={
        <>
          <Field label="Target job title" error={errors["title"]}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Senior Product Manager"
              className={err("title")}
            />
          </Field>
          <Field label="Target job description" error={errors["jd"]}>
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={6}
              placeholder="Paste the full job posting…"
              className={err("jd")}
            />
          </Field>
          <Field label="Current resume text" error={errors["resume"]}>
            <Textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={8}
              placeholder="Paste your existing resume…"
              className={err("resume")}
            />
          </Field>
          <Field label="Skill highlights" hint="Optional — comma separated strengths to emphasise.">
            <Textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              rows={3}
              placeholder="Roadmapping, SQL, stakeholder management…"
            />
          </Field>
          <Button className="w-full" onClick={submit} disabled={status === "loading"}>
            <Wand2 className="size-4" />
            {status === "loading" ? "Optimizing…" : "Optimize resume"}
          </Button>
        </>
      }
      preview={
        <OutputPane
          status={status}
          markdown={markdown}
          error={error}
          onRetry={retry}
          filename="ats-resume"
          emptyHint="Add your resume and a target job description, then generate an ATS-optimised rewrite."
        />
      }
    />
  );
}