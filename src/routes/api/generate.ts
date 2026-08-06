import { createFileRoute } from "@tanstack/react-router";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

type Body = {
  system?: unknown;
  prompt?: unknown;
  messages?: unknown;
  stream?: unknown;
};

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response(
            JSON.stringify({ error: "AI is not configured. Missing API key." }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }

        const messages = Array.isArray(body.messages)
          ? body.messages
          : [
              ...(typeof body.system === "string"
                ? [{ role: "system", content: body.system }]
                : []),
              { role: "user", content: String(body.prompt ?? "") },
            ];

        if (messages.length === 0) {
          return new Response(JSON.stringify({ error: "Nothing to send to the AI." }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const stream = body.stream === true;

        const res = await fetch(GATEWAY, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({ model: MODEL, messages, stream }),
        });

        if (!res.ok) {
          const text = await res.text();
          const message =
            res.status === 429
              ? "Rate limit reached. Please wait a moment and try again."
              : res.status === 402
                ? "AI credits exhausted. Please add credits to continue."
                : `AI request failed (${res.status}). ${text.slice(0, 300)}`;
          return new Response(JSON.stringify({ error: message }), {
            status: res.status,
            headers: { "content-type": "application/json" },
          });
        }

        if (stream) {
          return new Response(res.body, {
            headers: {
              "content-type": "text/event-stream",
              "cache-control": "no-cache",
            },
          });
        }

        const data = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const content = data.choices?.[0]?.message?.content ?? "";
        return new Response(JSON.stringify({ content }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});