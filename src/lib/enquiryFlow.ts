/**
 * Conversational enquiry collection — a small, framework-free state machine
 * shared by the React chat widget and the static preview.
 *
 * Collects: full name, email, WhatsApp number, service, project description,
 * timeline, optional budget — then a review step where the visitor gives
 * consent before anything is sent or stored.
 */
import { SERVICE_NAMES } from "./knowledge";

export type EnquiryData = {
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  description: string;
  timeline: string;
  budget: string;
};

export type FlowStep = "name" | "email" | "whatsapp" | "service" | "description" | "timeline" | "budget" | "review";

export type FlowState = { step: FlowStep; data: Partial<EnquiryData>; prefilledService: boolean };

export type FlowPrompt = {
  text: string;
  quickReplies?: string[];
  placeholder?: string;
  inputMode?: "text" | "email" | "tel";
};

const ORDER: FlowStep[] = ["name", "email", "whatsapp", "service", "description", "timeline", "budget", "review"];

export const TIMELINE_OPTIONS = ["Within a week", "1–2 weeks", "2–4 weeks", "1–3 months", "Flexible"];
export const BUDGET_SKIP = "Skip this question";
export const NOT_SURE = "Not sure yet";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

export function startFlow(service?: string): FlowState {
  const known = service && SERVICE_NAMES.includes(service) ? service : undefined;
  return { step: "name", data: known ? { service: known } : {}, prefilledService: !!known };
}

function nextStep(state: FlowState): FlowStep {
  let i = ORDER.indexOf(state.step) + 1;
  while (ORDER[i] === "service" && state.prefilledService) i++;
  return ORDER[Math.min(i, ORDER.length - 1)];
}

export function flowPrompt(state: FlowState): FlowPrompt {
  const first = state.data.name?.split(" ")[0];
  switch (state.step) {
    case "name":
      return { text: "Great — let's get your enquiry to Wicliff. First, what's your full name?\n\n(You can type “cancel” at any time.)", placeholder: "Your full name" };
    case "email":
      return { text: `Thanks${first ? `, ${first}` : ""}. What's the best email address to reach you?`, placeholder: "name@example.com", inputMode: "email" };
    case "whatsapp":
      return { text: "And your WhatsApp number, including the country code?", placeholder: "+254 7XX XXX XXX", inputMode: "tel" };
    case "service":
      return { text: "Which service do you need?", quickReplies: [...SERVICE_NAMES, NOT_SURE] };
    case "description":
      return { text: "Briefly describe your project — what you need done and what data or materials you have. A few sentences is perfect.", placeholder: "Describe your project…" };
    case "timeline":
      return { text: "When would you ideally like this completed?", quickReplies: TIMELINE_OPTIONS, placeholder: "e.g. by 15 December" };
    case "budget":
      return { text: "Do you have a budget range in mind? This is optional.", quickReplies: [BUDGET_SKIP], placeholder: "e.g. KES 15,000–25,000 or £200–300" };
    case "review":
      return { text: "Here's a summary of your enquiry. Please check it, then confirm below." };
  }
}

/** Apply the visitor's answer. Returns the new state, or an error message to show. */
export function flowAnswer(state: FlowState, raw: string): { state: FlowState; error?: string } {
  const v = raw.trim();
  const set = (patch: Partial<EnquiryData>) => {
    const s: FlowState = { ...state, data: { ...state.data, ...patch } };
    return { state: { ...s, step: nextStep(s) } };
  };
  switch (state.step) {
    case "name":
      if (v.length < 2 || v.length > 100 || !/[a-zA-ZÀ-ɏ]/.test(v)) return { state, error: "Please enter your full name (2–100 characters)." };
      return set({ name: v });
    case "email":
      if (!EMAIL_RE.test(v) || v.length > 200) return { state, error: "That doesn't look like a valid email address — could you check it?" };
      return set({ email: v.toLowerCase() });
    case "whatsapp": {
      const digits = v.replace(/\D/g, "");
      if (!PHONE_RE.test(v) || digits.length < 7 || digits.length > 15) return { state, error: "Please enter a valid WhatsApp number with its country code, e.g. +254 712 345 678." };
      return set({ whatsapp: v });
    }
    case "service":
      if (v.length < 2 || v.length > 120) return { state, error: "Please choose a service from the list, or type it in." };
      return set({ service: v });
    case "description":
      if (v.length < 10) return { state, error: "Could you add a little more detail? At least a sentence helps Wicliff prepare an accurate quotation." };
      if (v.length > 2000) return { state, error: "That's a bit long for the chat — please keep it under 2,000 characters. You can share files later." };
      return set({ description: v });
    case "timeline":
      if (v.length < 2 || v.length > 100) return { state, error: "Please give a rough timeline, or pick an option." };
      return set({ timeline: v });
    case "budget":
      if (v.length > 100) return { state, error: "Please keep the budget range short (under 100 characters)." };
      return set({ budget: v === BUDGET_SKIP ? "" : v });
    case "review":
      return { state };
  }
}

export const isCancel = (v: string) => /^(cancel|stop|exit|quit|nevermind|never mind)$/i.test(v.trim());

export const SUMMARY_FIELDS: { key: keyof EnquiryData; label: string }[] = [
  { key: "name", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "service", label: "Service" },
  { key: "description", label: "Project" },
  { key: "timeline", label: "Timeline" },
  { key: "budget", label: "Budget" },
];

/** Plain-text version of an enquiry — used for WhatsApp/email fallbacks. */
export function enquiryAsText(d: Partial<EnquiryData>): string {
  return [
    "Hello Wicliff, I'd like to request a quotation.",
    "",
    ...SUMMARY_FIELDS.map((f) => `${f.label}: ${d[f.key] || (f.key === "budget" ? "Not specified" : "—")}`),
  ].join("\n");
}

export const CONSENT_TEXT =
  "I agree that Wickie Stat Consultancy may store and use these details to respond to my enquiry, as described in the Privacy notice.";
export const TRANSCRIPT_CONSENT_TEXT = "Also include this chat conversation with my enquiry (optional).";
