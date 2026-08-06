import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function ToolShell({
  icon: Icon,
  title,
  description,
  config,
  preview,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  config: ReactNode;
  preview: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-8">
      <header className="mb-6 flex items-start gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          {config}
        </div>
        {preview}
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}