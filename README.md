# AI Career Assistant

ROLE & GOAL:
Act as a Principal Full-Stack Engineer and UX Designer. Build a modern, production-grade SaaS web application titled "AI Workplace Productivity & Career Assistant". The application helps professionals, job seekers, and teams automate workplace workflows and optimize career assets using Google Gemini LLM.

TECH STACK & INTEGRATIONS:
- LLM Provider: Google Gemini API (via `@google/genai` or standard REST API endpoints using `gemini-2.5-flash` or `gemini-1.5-pro`).

- Environment Setup: Include an API Key input module in the UI settings or access process.env.VITE_GEMINI_API_KEY with a clean fallback error handler if the key is missing.

- UI Framework: React, Tailwind CSS, Lucide Icons, and standard web APIs for clipboards/downloads.

VISUAL & UI DESIGN (SaaS Aesthetics):
- Theme: Clean, modern SaaS aesthetic with high-contrast typography, subtle slate/zinc borders. Ensure layout is responsive for both mobile and desktop. Colour scheme should be attractive, user-friendly, and  professional. 

- Layout Architecture: 
  - Left Sidebar Navigation: Fixed-width collapsible sidebar with active-state indicators and module icons.

  - Main Workspace: Dual-pane layout featuring an Input/Config Panel on the left and a Live Interactive Preview Pane on the right.

MODULES TO BUILD (6 Core Tools):
Build a dedicated view and system prompt pipeline for each of the following 6 tools:

1. ATS Resume Optimization & Builder (NEW):
   - Inputs: Current Resume Text, Target Job Title, Target Job Description, and Skill Highlights.

   - Gemini Task: Analyze the job description for target keywords and reformat/rewrite the resume into an ATS-friendly, single-column plain structure.

   - Output Sections: ATS Compliance Rating score (0-100%), Professional Summary, Core Competencies (bulleted), and Work Experience (quantified bullet points).

2. ✉️ Smart Email Generator:
   - Inputs: Context/Key Details, Tone dropdown (Formal, Informal, Persuasive), Target Audience dropdown (Manager, Client, Team).
   - Gemini Task: Draft structured email with Subject Line, Salutation, Body, and Sign-off.

3. 📝 Meeting Notes Summarizer:
   - Inputs: Raw meeting transcript or unstructured notes.
   - Gemini Task: Extract Executive Summary, Key Decisions, and an Action Items Table (Task, Assignee, Deadline).

4. 📅 AI Task Planner & Agenda Builder:
   - Inputs: Unstructured work goals, Timeframe selector (Daily/Weekly).
   - Gemini Task: Prioritize tasks using the Eisenhower Matrix (Urgent vs Important) and generate an hour-by-hour time-blocked schedule.

5. 🔍 AI Research Assistant:
   - Inputs: Long-form article text, report, or topic.
   - Gemini Task: Extract key takeaways, core recommendations, and a 3-bullet executive summary.

6. 💬 Interactive AI Chatbot Interface:
   - Interactive workplace assistant chat supporting streaming/conversational responses via Gemini API, message history UI, and suggested quick-prompt chips.

KEY TECHNICAL & UX REQUIREMENTS:
- Editable Output Preview: All AI outputs MUST render inside an inline rich-text/content-editable container allowing direct manual user edits before copying or exporting.

- One-Click Export & Action Bar: Add buttons for "Copy to Clipboard" (with toast notification) and " Export" (.txt and text-formatted file options).

- UI State Management: Fully handle 5 explicit states: Idle, Loading (animated skeleton screens and spinners), Success, Error (toast/alert banner with retry button), and Validation (highlighting missing inputs).

- Responsible AI Safeguard: Display a visible amber disclaimer banner below every AI generation: "AI-generated content may contain inaccuracies. Please review, edit, and verify all details prior to export."

- Design: Ensure that the application has a dashboard, displaying shortcuts to the AI Tools.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/05ba1e0d-0a98-419b-84e6-789f750a9fb4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
