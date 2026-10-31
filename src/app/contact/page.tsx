import type { Metadata } from "next";
import ContactBlock from "@/components/ContactBlock";
import EnquiryForm from "@/components/EnquiryForm";
import { BUSINESS } from "@/lib/config";
import { FAQS } from "@/lib/knowledge";

export const metadata: Metadata = { title: "Contact", description: `Contact ${BUSINESS.owner} by WhatsApp or email, or submit a project enquiry.` };

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h1>Let&apos;s talk about your project.</h1>
          <p className="lede">Reach {BUSINESS.ownerFirstName} directly on WhatsApp or by email, or send the enquiry form for a tailored quotation. Consultations can be arranged by WhatsApp, email or online meeting.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 16 }}>
        <div className="wrap grid" style={{ gap: 40, gridTemplateColumns: "minmax(0,1fr)" }}>
          <div className="grid grid-2" style={{ gap: 40, alignItems: "start" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem" }}>Direct contact</h2>
              <p className="muted">Consultant: {BUSINESS.owner}</p>
              <ContactBlock showPending />
            </div>
            <div className="card" id="enquiry" style={{ scrollMarginTop: 90 }}>
              <h2 style={{ fontSize: "1.8rem" }}>Project enquiry</h2>
              <p className="muted small">Tell us about your project and you&apos;ll receive a quotation covering scope, deliverables, timeline and price before any work begins.</p>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <p className="eyebrow">FAQs</p>
          <h2>Common questions.</h2>
          <div className="grid grid-2" style={{ marginTop: 24 }}>
            {FAQS.map((f) => (
              <details key={f.id} className="card">
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>{f.q}</summary>
                <p style={{ marginTop: 10, marginBottom: 0 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
