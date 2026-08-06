import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { generate } from "@/lib/ai-client";
import type { ToolStatus } from "@/components/app/OutputPane";

export function useGeneration() {
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState<string | null>(null);
  const last = useRef<{ system: string; prompt: string } | null>(null);

  const run = useCallback(async (system: string, prompt: string) => {
    last.current = { system, prompt };
    setStatus("loading");
    setError(null);
    try {
      const content = await generate(system, prompt);
      setMarkdown(content);
      setStatus("success");
      toast.success("Generated successfully");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setError(message);
      setStatus("error");
      toast.error(message);
    }
  }, []);

  const retry = useCallback(() => {
    if (last.current) void run(last.current.system, last.current.prompt);
  }, [run]);

  return { status, markdown, error, run, retry };
}