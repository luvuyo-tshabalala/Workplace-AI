import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Bot, RefreshCw, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { markdownToHtml } from "@/lib/markdown";
import { streamChat, type ChatMessage } from "@/lib/ai-client";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Workplace AI Chatbot — Workplace AI" },
      {
        name: "description",
        content: "Streaming conversational assistant for everyday workplace questions.",
      },
      { property: "og:title", content: "Workplace AI Chatbot — Workplace AI" },
      {
        property: "og:description",
        content: "Streaming conversational assistant for everyday workplace questions.",
      },
    ],
  }),
  component: ChatPage,
});

const SYSTEM: ChatMessage = {
  role: "system",
  content:
    "You are a pragmatic workplace productivity and career assistant. Give concise, actionable answers in markdown. Ask a clarifying question when the request is ambiguous. Never fabricate facts about the user's employer, colleagues or data.",
};

const CHIPS = [
  "Help me prep for a salary negotiation",
  "Write a polite follow-up to an unanswered email",
  "How do I run a better weekly standup?",
  "Rewrite my LinkedIn headline for a PM role",
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content) {
      toast.error("Type a message first");
      return;
    }
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      await streamChat([SYSTEM, ...history], (delta) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "assistant") {
            next[next.length - 1] = { role: "assistant", content: last.content + delta };
          }
          return next;
        });
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unexpected error";
      setError(message);
      toast.error(message);
      setMessages((prev) => prev.filter((m, i) => !(i === prev.length - 1 && !m.content)));
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const retry = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      setMessages((prev) => prev.slice(0, prev.findLastIndex((m) => m.role === "user")));
      void send(lastUser.content);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col px-4 py-6 md:px-8">
      <header className="mb-5 flex items-start gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          <Bot className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Interactive AI Chatbot
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Streaming workplace assistant with full conversation memory.
          </p>
        </div>
      </header>

      <div className="flex min-h-[60vh] flex-1 flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
          {messages.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">How can I help with work today?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a quick prompt or ask anything.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => void send(chip)}
                    className="rounded-full border border-border bg-secondary px-3.5 py-2 text-xs text-secondary-foreground transition-colors hover:border-primary/40 hover:bg-accent/15"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <div
                className={
                  m.role === "user"
                    ? "flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
                    : "flex size-8 shrink-0 items-center justify-center rounded-lg text-primary-foreground"
                }
                style={
                  m.role === "assistant" ? { backgroundImage: "var(--gradient-brand)" } : undefined
                }
              >
                {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {m.role === "user" ? "You" : "Assistant"}
                </p>
                {m.role === "user" ? (
                  <div className="inline-block max-w-full whitespace-pre-wrap rounded-xl bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                    {m.content}
                  </div>
                ) : m.content ? (
                  <div
                    className="ai-output text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(m.content) }}
                  />
                ) : (
                  <p className="animate-pulse text-sm text-muted-foreground">Thinking…</p>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
              <Button size="sm" variant="outline" onClick={retry}>
                <RefreshCw className="size-4" /> Retry
              </Button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!busy) void send(input);
                }
              }}
              rows={2}
              placeholder="Ask about emails, meetings, career moves…"
              className="min-h-[52px] resize-none"
            />
            <Button
              size="icon"
              className="size-11 shrink-0"
              disabled={busy}
              onClick={() => void send(input)}
            >
              {busy ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning-surface px-3 py-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
            <p className="text-xs text-warning-foreground">
              AI-generated content may contain inaccuracies. Please review, edit, and verify all
              details prior to export.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}