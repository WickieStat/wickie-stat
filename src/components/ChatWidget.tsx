"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACTIVE_WHATSAPP_LINES, BUSINESS, EMAIL_SUBJECT, PAGES, mailtoLink, whatsappLink } from "@/lib/config";
import { QUICK_REPLIES, WELCOME_MESSAGE, type ChatAction, type ChatApiResponse, type ChatTurn } from "@/lib/chatTypes";
import {
  CONSENT_TEXT, SUMMARY_FIELDS, TRANSCRIPT_CONSENT_TEXT, enquiryAsText, flowAnswer, flowPrompt, isCancel, startFlow,
  type EnquiryData, type FlowState,
} from "@/lib/enquiryFlow";
import { SERVICES } from "@/lib/knowledge";
import { ChatIcon, CloseIcon, MaxIcon, MinIcon, RestoreIcon, SendIcon } from "./Icons";

type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: ChatAction[];
  /** Personal details typed into the enquiry flow — never sent to the AI. */
  private?: boolean;
  tone?: "error" | "success";
  review?: Partial<EnquiryData>;
};

const STORE_KEY = "wsc-chat-v1";
const uid = () => Math.random().toString(36).slice(2, 10);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ChatWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [maximised, setMaximised] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [quick, setQuick] = useState<string[]>([...QUICK_REPLIES]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<"ai" | "demo" | null>(null);
  const [flow, setFlow] = useState<FlowState | null>(null);
  const [service, setService] = useState<string | undefined>();
  const [consent, setConsent] = useState(false);
  const [shareTranscript, setShareTranscript] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [seen, setSeen] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const busy = typing || submitting;

  // ── Session history (cleared when the browser tab closes) ──────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { messages: Msg[]; service?: string };
        if (Array.isArray(saved.messages) && saved.messages.length) {
          setMessages(saved.messages.filter((m) => !m.review));
          setService(saved.service);
          setSeen(true);
          return;
        }
      }
    } catch { /* storage unavailable — start fresh */ }
    setMessages([{ id: uid(), role: "assistant", text: WELCOME_MESSAGE }]);
  }, []);

  useEffect(() => {
    try {
      // Personal details from the enquiry flow are not persisted.
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ messages: messages.filter((m) => !m.private && !m.review), service }));
    } catch { /* ignore */ }
  }, [messages, service]);

  useEffect(() => {
    fetch("/api/chat").then((r) => r.json()).then((d) => setMode(d.mode)).catch(() => setMode("demo"));
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open, minimised]);

  const push = useCallback((m: Omit<Msg, "id">) => setMessages((prev) => [...prev, { ...m, id: uid() }]), []);

  const botSay = useCallback(
    async (m: Omit<Msg, "id" | "role">, delay = 450) => {
      setTyping(true);
      await wait(delay);
      setTyping(false);
      push({ role: "assistant", ...m });
    },
    [push],
  );

  // ── Enquiry flow ───────────────────────────────────────────────────
  const beginEnquiry = useCallback(
    async (svc?: string) => {
      const state = startFlow(svc ?? SERVICES.find((s) => s.slug === service)?.name);
      setFlow(state);
      setConsent(false);
      setShareTranscript(false);
      const p = flowPrompt(state);
      setQuick(p.quickReplies ?? []);
      await botSay({ text: p.text });
      inputRef.current?.focus();
    },
    [botSay, service],
  );

  const cancelEnquiry = useCallback(async () => {
    setFlow(null);
    setQuick([...QUICK_REPLIES]);
    await botSay({ text: "No problem — I've cancelled that enquiry and discarded the details. Is there anything else I can help with?" });
  }, [botSay]);

  const handleFlowInput = useCallback(
    async (text: string) => {
      if (!flow) return;
      push({ role: "user", text, private: true });
      if (isCancel(text)) return cancelEnquiry();
      const { state, error } = flowAnswer(flow, text);
      if (error) return botSay({ text: error, tone: "error" }, 250);
      setFlow(state);
      const p = flowPrompt(state);
      setQuick(p.quickReplies ?? []);
      if (state.step === "review") return botSay({ text: p.text, review: state.data });
      await botSay({ text: p.text }, 300);
    },
    [flow, push, botSay, cancelEnquiry],
  );

  const submitEnquiry = useCallback(async () => {
    if (!flow || !consent || submitting) return;
    setSubmitting(true);
    const transcript: ChatTurn[] = messages
      .filter((m) => !m.private && !m.review && m.text !== WELCOME_MESSAGE)
      .map((m) => ({ role: m.role, content: m.text.slice(0, 2000) }))
      .slice(-40);
    const d = flow.data as EnquiryData;
    try {
      setTyping(true);
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, budget: d.budget ?? "", consent: true, includeTranscript: shareTranscript, transcript: shareTranscript ? transcript : undefined, source: "chatbot", company_website: "" }),
      });
      const out = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; error?: string };
      setTyping(false);
      setMessages((prev) => prev.filter((m) => !m.review));
      if (res.ok && out.ok && out.reference) {
        // Only here — after the server confirms delivery — do we say it was submitted.
        setFlow(null);
        setQuick(["Explore Your Services", "Speak to Wicliff"]);
        push({
          role: "assistant",
          tone: "success",
          text: `✓ Your enquiry has been submitted. Your reference is ${out.reference}.\n\n${BUSINESS.ownerFirstName} will review your project and get back to you by email or WhatsApp. If it's urgent, you can also message him directly.`,
          actions: [{ type: "whatsapp", label: "Message on WhatsApp" }],
        });
      } else {
        push({
          role: "assistant",
          tone: "error",
          text: `I'm sorry — your enquiry was not submitted. ${out.error ?? "Something went wrong on our side."}\n\nYou can send exactly the same details to Wicliff directly — they're already filled in:`,
          actions: [{ type: "whatsapp", label: "Send via WhatsApp" }, { type: "email", label: "Send via email" }],
        });
      }
    } catch {
      setTyping(false);
      setMessages((prev) => prev.filter((m) => !m.review));
      push({
        role: "assistant",
        tone: "error",
        text: "I'm sorry — I couldn't reach the server, so your enquiry was not submitted. Please check your connection, or send the same details directly:",
        actions: [{ type: "whatsapp", label: "Send via WhatsApp" }, { type: "email", label: "Send via email" }],
      });
    } finally {
      setSubmitting(false);
    }
  }, [flow, consent, submitting, messages, shareTranscript, push]);

  // ── Free conversation ──────────────────────────────────────────────
  const ask = useCallback(
    async (text: string) => {
      push({ role: "user", text });
      setQuick([]);
      const history: ChatTurn[] = [...messages, { role: "user" as const, text, private: false } as Msg]
        .filter((m) => !m.private && !m.review)
        .map((m) => ({ role: m.role, content: m.text.slice(0, 2000) }))
        .slice(-16);
      setTyping(true);
      try {
        const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
        const out = (await res.json()) as ChatApiResponse & { error?: string };
        setTyping(false);
        if (!res.ok) {
          push({ role: "assistant", tone: "error", text: out.error ?? "Sorry, I had trouble answering that. You can reach Wicliff directly:", actions: [{ type: "whatsapp", label: "Chat on WhatsApp" }, { type: "email", label: "Email Wicliff" }] });
          setQuick([...QUICK_REPLIES]);
          return;
        }
        setMode(out.mode);
        if (out.service) setService(out.service);
        push({ role: "assistant", text: out.text, actions: out.actions });
        setQuick(out.quickReplies?.length ? out.quickReplies : [...QUICK_REPLIES]);
      } catch {
        setTyping(false);
        push({ role: "assistant", tone: "error", text: "I couldn't connect just now. Please try again, or contact Wicliff directly:", actions: [{ type: "whatsapp", label: "Chat on WhatsApp" }, { type: "email", label: "Email Wicliff" }] });
        setQuick([...QUICK_REPLIES]);
      }
    },
    [messages, push],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      setInput("");
      if (flow && flow.step !== "review") return handleFlowInput(text);
      if (flow?.step === "review") {
        if (isCancel(text)) return cancelEnquiry();
        return botSay({ text: "Please use the buttons on the summary above to submit, start over or cancel your enquiry." }, 200);
      }
      if (/^(request a quotation|get a quote)$/i.test(text)) {
        push({ role: "user", text });
        return beginEnquiry();
      }
      return ask(text);
    },
    [busy, flow, handleFlowInput, cancelEnquiry, botSay, push, beginEnquiry, ask],
  );

  // ── Open / close / external triggers ───────────────────────────────
  const show = useCallback(() => {
    setOpen(true);
    setClosing(false);
    setMinimised(false);
    setSeen(true);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);
  const hide = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 190);
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<{ message?: string; enquiry?: string } | undefined>).detail;
      show();
      if (d?.enquiry !== undefined && !flow) setTimeout(() => beginEnquiry(d.enquiry || undefined), 350);
      else if (d?.message) setTimeout(() => send(d.message!), 350);
    };
    window.addEventListener("wsc:open-chat", onOpen);
    return () => window.removeEventListener("wsc:open-chat", onOpen);
  }, [show, send, beginEnquiry, flow]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && open) hide(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hide]);

  // ── Actions under bot messages ─────────────────────────────────────
  const svcName = SERVICES.find((s) => s.slug === service)?.name;
  const waText = flow?.data && Object.keys(flow.data).length > 1
    ? enquiryAsText(flow.data)
    : `Hello Wicliff, I found Wickie Stat Consultancy online${svcName ? ` and I'm interested in ${svcName}` : ""}. I'd like to discuss a project.`;

  const renderAction = (a: ChatAction, i: number) => {
    switch (a.type) {
      case "start_enquiry":
        return <button key={i} className="primary" onClick={() => !flow && !busy && beginEnquiry(a.service)} disabled={!!flow}>{a.label}</button>;
      case "page":
        return <button key={i} onClick={() => { router.push(PAGES[a.page].href); if (window.innerWidth < 520) setMinimised(true); }}>{a.label} →</button>;
      case "email":
        return <a key={i} href={mailtoLink(EMAIL_SUBJECT, flow?.data && Object.keys(flow.data).length > 1 ? enquiryAsText(flow.data) : undefined)}>{a.label}</a>;
      case "whatsapp":
        return ACTIVE_WHATSAPP_LINES.map((l) => (
          <a key={`${i}-${l.id}`} className="wa" href={whatsappLink(l, waText)} target="_blank" rel="noopener noreferrer">
            {ACTIVE_WHATSAPP_LINES.length > 1 ? `${a.label} (${l.id === "kenya" ? "Kenya" : "International"})` : a.label}
          </a>
        ));
    }
  };

  const panelClass = ["chat-panel", closing && "closing", maximised && !minimised && "maximised", minimised && "minimised"].filter(Boolean).join(" ");
  const wrapQuick = flow?.step === "service";

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={show} aria-label="Open chat with our virtual assistant">
          <ChatIcon />
          {!seen && <span className="pulse" aria-hidden="true" />}
          {!seen && <span className="chat-fab-label">Questions? Ask our assistant</span>}
        </button>
      )}

      {open && (
        <section className={panelClass} role="dialog" aria-label={`${BUSINESS.name} virtual assistant`} aria-modal="false">
          <header className="chat-head" onDoubleClick={() => setMinimised((m) => !m)}>
            <div className="chat-avatar" aria-hidden="true">WS</div>
            <div className="chat-title">
              <b>Wickie Stat Assistant</b>
              <span>
                {mode === "demo" && <span className="demo-chip" title="Demonstration mode: answers come from a fixed knowledge base, not live AI.">Demo mode</span>}
                {mode === "demo" ? " Instant answers" : "Online · replies instantly"}
              </span>
            </div>
            <button onClick={() => setMinimised((m) => !m)} aria-label={minimised ? "Restore chat" : "Minimise chat"} title={minimised ? "Restore" : "Minimise"}>
              {minimised ? <RestoreIcon /> : <MinIcon />}
            </button>
            {!minimised && (
              <button onClick={() => setMaximised((m) => !m)} aria-label={maximised ? "Restore chat size" : "Maximise chat"} title={maximised ? "Restore size" : "Maximise"}>
                {maximised ? <RestoreIcon /> : <MaxIcon />}
              </button>
            )}
            <button onClick={hide} aria-label="Close chat" title="Close"><CloseIcon /></button>
          </header>

          {!minimised && (
            <>
              <div className="chat-log" ref={logRef} aria-live="polite">
                {mode === "demo" && (
                  <p className="demo-note">
                    <b>Demonstration mode.</b> I answer from Wickie Stat&apos;s knowledge base rather than live AI, so I may suggest contacting Wicliff for anything specific.
                  </p>
                )}
                {messages.map((m) => (
                  <div key={m.id} className={`msg ${m.role === "user" ? "user" : "bot"} ${m.tone ?? ""}`}>
                    <div className="bubble">{m.text}</div>
                    {m.review && (
                      <div className="review-card">
                        <dl>
                          {SUMMARY_FIELDS.map((f) => (
                            <FragmentRow key={f.key} label={f.label} value={m.review![f.key] || (f.key === "budget" ? "Not specified" : "—")} />
                          ))}
                        </dl>
                        <label className="check">
                          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                          <span>{CONSENT_TEXT.replace("Privacy notice.", "")}<a href={PAGES.privacy.href} target="_blank" rel="noopener">Privacy notice</a>.</span>
                        </label>
                        <label className="check">
                          <input type="checkbox" checked={shareTranscript} onChange={(e) => setShareTranscript(e.target.checked)} />
                          <span>{TRANSCRIPT_CONSENT_TEXT}</span>
                        </label>
                        <div className="btns">
                          <button className="primary" disabled={!consent || submitting} onClick={submitEnquiry}>{submitting ? "Submitting…" : "Submit enquiry"}</button>
                          <button disabled={submitting} onClick={() => { setMessages((p) => p.filter((x) => !x.review)); beginEnquiry(flow?.data.service); }}>Start over</button>
                          <button disabled={submitting} onClick={() => { setMessages((p) => p.filter((x) => !x.review)); cancelEnquiry(); }}>Cancel</button>
                        </div>
                      </div>
                    )}
                    {m.actions && m.actions.length > 0 && <div className="msg-actions">{m.actions.map(renderAction)}</div>}
                  </div>
                ))}
                {typing && <div className="typing" aria-label="Assistant is typing"><i /><i /><i /></div>}
              </div>

              {quick.length > 0 && !busy && (
                <div className={`quick ${wrapQuick ? "wrap-q" : ""}`} role="group" aria-label="Suggested replies">
                  {quick.map((q) => <button key={q} onClick={() => send(q)}>{q}</button>)}
                </div>
              )}

              <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={2000}
                  placeholder={flow ? flowPrompt(flow).placeholder ?? "Type your answer…" : "Type your message…"}
                  inputMode={flow ? flowPrompt(flow).inputMode : "text"}
                  aria-label="Message"
                  disabled={flow?.step === "review"}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                />
                <button type="submit" disabled={!input.trim() || busy} aria-label="Send message"><SendIcon /></button>
              </form>
              <p className="chat-foot">
                Please don&apos;t share passwords or sensitive personal data here. <a href={PAGES.privacy.href}>Privacy</a>
              </p>
            </>
          )}
        </section>
      )}
    </>
  );
}

function FragmentRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
