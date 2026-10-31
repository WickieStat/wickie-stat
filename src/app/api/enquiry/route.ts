import { NextResponse } from "next/server";
import { emailConfigured, sendEnquiryEmail } from "@/lib/email";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rateLimit";
import { getSupabase } from "@/lib/supabase";
import { EnquirySchema } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * Receives a project enquiry. Responds { ok: true, reference } ONLY when the
 * enquiry was actually delivered — emailed to Wicliff and/or saved to Supabase.
 * The chat UI never tells a visitor their enquiry was submitted otherwise.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const limit = rateLimit(`enquiry:${clientIp(req)}`, 5, 60 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries have been sent from this connection — please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = EnquirySchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ ok: false, error: first?.message ?? "Please check your details.", field: first?.path[0] }, { status: 422 });
  }
  const e = parsed.data;

  // Honeypot filled → silently accept-without-delivering would mislead a real user,
  // so reject plainly; bots don't read the message.
  if (e.company_website) return NextResponse.json({ ok: false, error: "Submission rejected." }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase && !emailConfigured()) {
    return NextResponse.json(
      { ok: false, notConfigured: true, error: "Online submission isn't available right now." },
      { status: 503 },
    );
  }

  const reference = `WSC-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
  const transcript = e.includeTranscript ? e.transcript ?? [] : null; // only kept with explicit consent

  let stored = false;
  if (supabase) {
    const { error } = await supabase.from("enquiries").insert({
      reference,
      full_name: e.name,
      email: e.email,
      whatsapp: e.whatsapp,
      service: e.service,
      description: e.description,
      timeline: e.timeline,
      budget: e.budget || null,
      source: e.source,
      consent_given_at: new Date().toISOString(),
      transcript,
    });
    if (error) console.error("[enquiry] Supabase insert failed:", error.message);
    stored = !error;
  }

  const emailed = await sendEnquiryEmail(e, reference);

  if (!stored && !emailed) {
    return NextResponse.json(
      { ok: false, error: "We couldn't deliver it just now." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, reference, delivered: { email: emailed, stored } });
}
