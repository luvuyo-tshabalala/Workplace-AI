import {
  FileText,
  Mail,
  NotebookPen,
  CalendarClock,
  Search,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

export type ToolDef = {
  id: string;
  path: string;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
};

export const TOOLS: ToolDef[] = [
  {
    id: "resume",
    path: "/resume",
    name: "ATS Resume Optimizer",
    short: "Resume",
    description: "Rewrite your resume for ATS parsing and score keyword compliance.",
    icon: FileText,
  },
  {
    id: "email",
    path: "/email",
    name: "Smart Email Generator",
    short: "Email",
    description: "Draft polished, on-tone emails for managers, clients or teams.",
    icon: Mail,
  },
  {
    id: "notes",
    path: "/notes",
    name: "Meeting Notes Summarizer",
    short: "Notes",
    description: "Turn transcripts into decisions and a clear action-item table.",
    icon: NotebookPen,
  },
  {
    id: "planner",
    path: "/planner",
    name: "Task Planner & Agenda",
    short: "Planner",
    description: "Prioritize with the Eisenhower Matrix and time-block your day.",
    icon: CalendarClock,
  },
  {
    id: "research",
    path: "/research",
    name: "AI Research Assistant",
    short: "Research",
    description: "Distil long reports into takeaways and recommendations.",
    icon: Search,
  },
  {
    id: "chat",
    path: "/chat",
    name: "Workplace Chatbot",
    short: "Chat",
    description: "Streaming conversational assistant for everyday work questions.",
    icon: MessagesSquare,
  },
];