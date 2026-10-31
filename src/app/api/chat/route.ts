import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PAGES, type PageKey } from "@/lib/config";
import type { ChatAction, ChatApiResponse } from "@/lib/chatTypes";
import { demoReply, scoreServices, type DemoContext } from "@/lib/demoBot";
import { SERVICES } from "@/lib/knowledge";
import { buildSystemPrompt, REPLY_SCHEMA } from "@/lib/prompt";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rateLimit";
import { ChatRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const SYSTEM_PROMPT = buildSystemPrompt();

/** Demo mode is stateless on the server: rebuild context from the history. */
function demoFromHistory(messages: { role: string; content: string }[]): ChatApiResponse {
  let ctx: DemoContext = {};
  const users = messages.filter((m) => m.role === "user");
  for (const m of users.slice(0, -1)) ctx = demoReply(m.content, ctx).ctx;
  return { ...demoReply(users[users.length - 1].content, ctx).reply, mode: "demo" };
}

/** Lets the widget show the demo badge before the first message. */
export function GET() {
  return NextResponse.json({ mode: openai ? "ai" : "demo" });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const limit = rateLimit(`chat:${clientIp(req)}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "You're sending messages a little quickly — please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const messages = parsed.data.messages.slice(-16); // keep context small; nothing is stored

  if (!openai) return NextResponse.json(demoFromHistory(messages));

  try {
    const completion = await openai.chat.completions.create(
      {
        model: MODEL,
        temperature: 0.4,
        max_tokens: 600,
        response_format: { type: "json_schema", json_schema: REPLY_SCHEMA as unknown as OpenAI.ResponseFormatJSONSchema["json_schema"] },
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      },
      { timeout: 20_000 },
    );
    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty completion");
    const out = JSON.parse(raw) as {
      reply: string; offer_enquiry: boolean; service: string | null; show_contact: boolean; pages: string[]; quick_replies: string[];
    };

    const service = SERVICES.find((s) => s.name === out.service) ?? scoreServices(` ${messages.at(-1)!.content.toLowerCase()} `)[0]?.service;
    const actions: ChatAction[] = [];
    if (out.offer_enquiry) actions.push({ type: "start_enquiry", label: "Start a project enquiry", service: service?.name });
    if (out.show_contact) actions.push({ type: "whatsapp", label: "Chat on WhatsApp" }, { type: "email", label: "Email Wicliff" });
    for (const p of out.pages.slice(0, 2)) {
      if (p in PAGES && p !== "home") actions.push({ type: "page", page: p as PageKey, label: `Open ${PAGES[p as PageKey].label}` });
    }

    const response: ChatApiResponse = {
      text: out.reply.slice(0, 2500),
      service: service?.slug,
      actions,
      quickReplies: out.quick_replies.filter((q) => q.length <= 60).slice(0, 3),
      mode: "ai",
    };
    return NextResponse.json(response);
  } catch (err) {
    // Log the failure (no message content) and fall back so the visitor still gets help.
    console.error("[chat] OpenAI request failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(demoFromHistory(messages));
  }
}
