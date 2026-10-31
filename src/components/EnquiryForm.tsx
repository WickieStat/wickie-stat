"use client";
import Link from "next/link";
import { useState } from "react";
import { ACTIVE_WHATSAPP_LINES, EMAIL_SUBJECT, mailtoLink, whatsappLink } from "@/lib/config";
import { CONSENT_TEXT, EMAIL_RE, PHONE_RE, TIMELINE_OPTIONS, enquiryAsText, type EnquiryData } from "@/lib/enquiryFlow";
import { SERVICE_NAMES } from "@/lib/knowledge";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok"; reference: string } | { kind: "error"; message: string };
const EMPTY: EnquiryData = { name: "", email: "", whatsapp: "", service: "", description: "", timeline: "", budget: "" };

export default function EnquiryForm() {
  const [d, setD] = useState<EnquiryData>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryData | "consent", string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const set = (k: keyof EnquiryData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setD({ ...d, [k]: e.target.value });

  function validate() {
    const e: typeof errors = {};
    if (d.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!EMAIL_RE.test(d.email.trim())) e.email = "Please enter a valid email address.";
    if (!PHONE_RE.test(d.whatsapp.trim()) || d.whatsapp.replace(/\D/g, "").length < 7) e.whatsapp = "Include the country code, e.g. +254 712 345 678.";
    if (!d.service) e.service = "Please choose a service.";
    if (d.description.trim().length < 10) e.description = "Please describe your project in a sentence or two.";
    if (!d.timeline.trim()) e.timeline = "Please give a rough timeline.";
    if (!consent) e.consent = "Please agree so we can process your enquiry.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, consent: true, source: "contact_form", company_website: hp }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok && out.reference) {
        setStatus({ kind: "ok", reference: out.reference });
        setD(EMPTY);
        setConsent(false);
      } else {
        setStatus({ kind: "error", message: out.error ?? "Your enquiry could not be submitted." });
      }
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the server, so your enquiry was not submitted." });
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="notice ok" role="status">
        <b>Thank you — your enquiry has been submitted.</b> Your reference is <span className="mono">{status.reference}</span>. Wicliff will be in touch by email or WhatsApp.
      </div>
    );
  }

  const field = (k: keyof EnquiryData, label: string, input: React.ReactNode) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      {input}
      {errors[k] && <span className="err" id={`e-${k}`}>{errors[k]}</span>}
    </div>
  );

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="grid grid-2">
        {field("name", "Full name", <input id="f-name" autoComplete="name" value={d.name} onChange={set("name")} maxLength={100} aria-invalid={!!errors.name} />)}
        {field("email", "Email address", <input id="f-email" type="email" autoComplete="email" value={d.email} onChange={set("email")} maxLength={200} aria-invalid={!!errors.email} />)}
        {field("whatsapp", "WhatsApp number", <input id="f-whatsapp" type="tel" autoComplete="tel" placeholder="+254 7XX XXX XXX" value={d.whatsapp} onChange={set("whatsapp")} maxLength={20} aria-invalid={!!errors.whatsapp} />)}
        {field("service", "Service required", (
          <select id="f-service" value={d.service} onChange={set("service")} aria-invalid={!!errors.service}>
            <option value="">Choose a service…</option>
            {SERVICE_NAMES.map((s) => <option key={s}>{s}</option>)}
            <option>Not sure yet</option>
          </select>
        ))}
      </div>
      {field("description", "Brief project description", <textarea id="f-description" value={d.description} onChange={set("description")} maxLength={2000} placeholder="What do you need done, and what data or materials do you have?" aria-invalid={!!errors.description} />)}
      <div className="grid grid-2">
        {field("timeline", "Expected timeline", (
          <>
            <input id="f-timeline" list="timeline-options" value={d.timeline} onChange={set("timeline")} maxLength={100} placeholder="e.g. 2–4 weeks" aria-invalid={!!errors.timeline} />
            <datalist id="timeline-options">{TIMELINE_OPTIONS.map((t) => <option key={t} value={t} />)}</datalist>
          </>
        ))}
        {field("budget", "Budget range (optional)", <input id="f-budget" value={d.budget} onChange={set("budget")} maxLength={100} placeholder="e.g. KES 15,000–25,000" />)}
      </div>
      <div className="hp" aria-hidden="true">
        <label>Company website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="company_website" /></label>
      </div>
      <label className="check">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{CONSENT_TEXT.replace("Privacy notice.", "")}<Link href="/privacy">Privacy notice</Link>.</span>
      </label>
      {errors.consent && <span className="err small" style={{ color: "var(--danger)" }}>{errors.consent}</span>}
      {status.kind === "error" && (
        <div className="notice err" role="alert">
          <b>{status.message}</b> You can send the same details directly instead:{" "}
          {ACTIVE_WHATSAPP_LINES.map((l) => (
            <a key={l.id} href={whatsappLink(l, enquiryAsText(d))} target="_blank" rel="noopener noreferrer">{l.label}</a>
          )).reduce<React.ReactNode[]>((acc, el, i) => (i ? [...acc, " · ", el] : [el]), [])}
          {" · "}<a href={mailtoLink(EMAIL_SUBJECT, enquiryAsText(d))}>Email</a>
        </div>
      )}
      <div className="btn-row">
        <button className="btn btn-primary" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Submitting…" : "Submit enquiry"}
        </button>
      </div>
    </form>
  );
}
