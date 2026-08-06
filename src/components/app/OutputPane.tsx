import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Copy, Download, RefreshCw, AlertTriangle, Sparkle, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { markdownToHtml } from "@/lib/markdown";

export type ToolStatus = "idle" | "loading" | "success" | "error";

type Props = {
  status: ToolStatus;
  markdown: string;
  error?: string | null;
  onRetry?: () => void;
  filename: string;
  emptyHint: string;
};

export function OutputPane({ status, markdown, error, onRetry, filename, emptyHint }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && status === "success") {
      ref.current.innerHTML = markdownToHtml(markdown);
    }
  }, [markdown, status]);

  const text = () => ref.current?.innerText ?? "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text());
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Clipboard unavailable in this browser");
    }
  };

  const download = (ext: "txt" | "md") => {
    const body = ext === "md" ? markdown : text();
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filename}.${ext}`);
  };

  return (
    <section className="flex min-h-[520px] flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div>
          <h2 className="text-sm font-semibold">Live preview</h2>
          <p className="text-xs text-muted-foreground">Click the output to edit before export</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" disabled={status !== "success"} onClick={copy}>
            <Copy className="size-4" /> Copy
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={status !== "success"}
            onClick={() => download("txt")}
          >
            <Download className="size-4" /> .txt
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={status !== "success"}
            onClick={() => download("md")}
          >
            <FileDown className="size-4" /> .md
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-5 py-5">
        {status === "idle" && (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-secondary">
              <Sparkle className="size-5 text-primary" />
            </div>
            <p className="text-sm font-medium">Nothing generated yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}

        {status === "loading" && (
          <div className="space-y-4" aria-busy="true">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-9/12" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-10/12" />
            <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
              <RefreshCw className="size-4 animate-spin" /> Generating with AI…
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 text-destructive" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-destructive">Generation failed</p>
                <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                {onRetry && (
                  <Button size="sm" className="mt-3" onClick={onRetry}>
                    <RefreshCw className="size-4" /> Retry
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          ref={ref}
          contentEditable={status === "success"}
          suppressContentEditableWarning
          className={
            status === "success"
              ? "ai-output rounded-lg p-1 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring/40"
              : "hidden"
          }
        />
      </div>

      <footer className="border-t border-border px-5 py-3">
        <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning-surface px-3 py-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
          <p className="text-xs text-warning-foreground">
            AI-generated content may contain inaccuracies. Please review, edit, and verify all
            details prior to export.
          </p>
        </div>
      </footer>
    </section>
  );
}