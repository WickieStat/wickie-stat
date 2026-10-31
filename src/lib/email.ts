import "server-only";
import { BUSINESS } from "./config";
import type { EnquiryInput } from "./validation";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Sends the enquiry to Wicliff via Resend (https://resend.com).
 * Returns true only when Resend accepts the message.
 */
export async function sendEnquiryEmail(e: EnquiryInput, reference: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const to = process.env.ENQUIRY_TO_EMAIL || BUSINESS.email;
  const from = process.env.ENQUIRY_FROM_EMAIL || "Wickie Stat Website <onboarding@resend.dev>";

  const rows: [string, string][] = [
    ["Reference", reference],
    ["Full name", e.name],
    ["Email", e.email],
    ["WhatsApp", e.whatsapp],
    ["Service", e.service],
    ["Timeline", e.timeline],
    ["Budget", e.budget || "Not specified"],
    ["Source", e.source === "chatbot" ? "Website chatbot" : "Contact form"],
  ];
  const waDigits = e.whatsapp.replace(/\D/g, "");
  const transcript =
    e.includeTranscript && e.transcript?.length
      ? `<h3 style="margin:24px 0 8px">Chat transcript (shared with consent)</h3>${e.transcript
          .map((t) => `<p style="margin:4px 0"><b>${t.role === "user" ? "Visitor" : "Assistant"}:</b> ${esc(t.content).replace(/\n/g, "<br>")}</p>`)
          .join("")}`
      : "";

  const html = `<div style="font-family:Arial,sans-serif;max-width:640px;color:#14202b">
  <h2 style="margin:0 0 12px">New project enquiry</h2>
  <table style="border-collapse:collapse;width:100%">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5b6773;white-space:nowrap">${k}</td><td style="padding:6px 0"><b>${esc(v)}</b></td></tr>`)
    .join("")}</table>
  <h3 style="margin:24px 0 8px">Project description</h3>
  <p style="white-space:pre-wrap;margin:0">${esc(e.description)}</p>
  <p style="margin:24px 0 0"><a href="https://wa.me/${waDigits}">Reply on WhatsApp</a> · <a href="mailto:${esc(e.email)}?subject=${encodeURIComponent(`Re: your enquiry (${reference})`)}">Reply by email</a></p>
  ${transcript}
</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: e.email,
        subject: `New enquiry: ${e.service} — ${e.name} (${reference})`,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error("[enquiry] Resend rejected the email", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (err) {
    console.error("[enquiry] Email send failed", err);
    return false;
  }
}
