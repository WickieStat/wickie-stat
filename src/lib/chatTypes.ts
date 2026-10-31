import type { PageKey } from "./config";

/** Something the chat UI can render as a button under a bot message. */
export type ChatAction =
  | { type: "page"; page: PageKey; label: string }
  | { type: "whatsapp"; label: string }
  | { type: "email"; label: string }
  | { type: "start_enquiry"; label: string; service?: string };

export type BotReply = {
  text: string;
  quickReplies?: string[];
  actions?: ChatAction[];
  /** Slug of the service the conversation is about, if any. */
  service?: string;
};

export type ChatTurn = { role: "user" | "assistant"; content: string };

/** What /api/chat returns. `mode` tells the UI whether to show the demo badge. */
export type ChatApiResponse = BotReply & { mode: "ai" | "demo" };

export const QUICK_REPLIES = [
  "Explore Your Services",
  "I Need Data Analysis",
  "I Need Python/R Programming",
  "I Need AI/ML Solutions",
  "I Need Research Support",
  "Request a Quotation",
  "Speak to Wicliff",
] as const;

export const WELCOME_MESSAGE =
  "Hello! Welcome to Wickie Stat Consultancy.\n\nI'm your virtual assistant. I can help you explore our services, understand how we work, and submit a project enquiry.\n\nHow can I assist you today?";
