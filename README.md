# ⚡ Workplace AI Productivity & Career Assistant

An all-in-one AI-powered SaaS productivity workspace designed to automate repetitive workplace tasks, streamline career assets, and improve decision-making using structured AI prompts and real-time generation.

---

## 📌 Project Overview

Modern knowledge workers and job seekers often spend hours drafting routine communications, parsing unstructured meeting notes, organizing schedules, and tailoring resumes. The **Workplace AI Productivity & Career Assistant** solves these operational bottlenecks by providing specialized, context-aware AI tools in a unified, dual-pane interactive layout.

### Key Objectives
* **Workplace Automation:** Streamline email drafting, meeting summarization, research analysis, and task scheduling.
* **Career Acceleration:** Optimize resumes for Applicant Tracking Systems (ATS) with structured formatting and keyword alignment.
* **Responsible AI & Human-in-the-Loop:** Ensure all generated outputs render inside editable text containers with ethical disclaimers and multi-format export options.

---

## ✨ Features Implemented

1. **📄 ATS Resume Optimizer:** Rewrites and structures resumes for optimal parsing by Applicant Tracking Systems, outputting clean, single-column sections and keyword alignment.
2. **✉️ Smart Email Generator:** Context-aware email generator supporting tone adjustments (*Formal, Informal, Persuasive*) and target audience selection (*Manager, Client, Team*).
3. **📝 Meeting Notes Summarizer:** Converts unstructured transcripts into an Executive Summary, Key Decisions, and an Action Items Table (*Task, Assignee, Deadline*).
4. **📅 AI Task Planner & Agenda Builder:** Prioritizes tasks using the Eisenhower Matrix (*Urgent vs. Important*) and generates structured time-blocked schedules.
5. **🔍 AI Research Assistant:** Synthesizes dense topics, articles, or reports into executive summaries and structured key takeaways.
6. **💬 Interactive AI Chatbot Interface:** Real-time, streaming conversational workplace assistant powered by Server-Sent Events (SSE).

---

## 🛠️ Technologies & Tools Used

* **Frontend Framework:** React with Vite & TypeScript
* **Routing & Layout:** TanStack Router (File-based routing)
* **Styling & UI:** Tailwind CSS, Lucide Icons, Shadcn UI primitives
* **LLM Engine:** Google Gemini (`google/gemini-2.5-flash`)
* **API Architecture:** Server-side gateway proxy (JSON + SSE for chat streaming)
* **Build & Deployment:** Lovable.ai platform integration

---

## 🔒 Security & Architecture Note

> **Server-Side AI Gateway:** All AI calls are securely processed server-side through Lovable's proxy gateway (`google/gemini-2.5-flash`). **No API keys are exposed to the client**, and no user API key input is required.

---

## 📁 Repository File Structure

```text
src/
├── routes/
│   ├── __root.tsx            # Global layout, persistent sidebar, and providers
│   ├── index.tsx             # Main Dashboard Home
│   ├── resume.tsx            # ATS Resume Optimizer module
│   ├── email.tsx             # Smart Email Generator module
│   ├── notes.tsx             # Meeting Notes Summarizer module
│   ├── planner.tsx           # AI Task Planner module
│   ├── research.tsx          # AI Research Assistant module
│   ├── chat.tsx              # Interactive AI Chatbot (SSE streaming)
│   └── api/generate.ts       # Server-side Gemini proxy endpoint (JSON + SSE)
├── components/app/
│   ├── AppSidebar.tsx        # Navigation sidebar component
│   ├── ToolShell.tsx         # Dual-pane input/output workspace shell
│   └── OutputPane.tsx        # Content-editable preview, copy, .txt/.md export, disclaimer banner
├── hooks/
│   └── use-generation.ts     # Unified management for Idle, Loading, Success, and Error states
├── lib/
│   ├── ai-client.ts          # Client API caller functions (generate() & streamChat())
│   ├── tools.ts              # Tool configuration & metadata
│   └── markdown.ts           # Client-side Markdown-to-HTML parsing utility
├── styles.css                # Design tokens, variables, and global themes
└── router.tsx                # Application router entry point
