import type { Metadata } from "next";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy notice" };

export default function PrivacyPage() {
  return (
    <section className="page-hero">
      <div className="wrap" style={{ maxWidth: 780 }}>
        <p className="eyebrow">Privacy notice</p>
        <h1 style={{ fontSize: "clamp(2.2rem,5vw,3.2rem)" }}>How we handle your information</h1>
        <p className="muted small">Last updated: 31 October 2026</p>

        <h3>Who we are</h3>
        <p>{BUSINESS.name} is operated by {BUSINESS.owner}. For any privacy question or request, email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.</p>

        <h3>What we collect</h3>
        <p>When you submit an enquiry — through the website chatbot or the contact form — we collect your full name, email address, WhatsApp number, the service you need, your project description, expected timeline and, if you choose, a budget range. We only collect this after you tick the consent box.</p>

        <h3>The website assistant (chatbot)</h3>
        <p>Messages you type to the assistant are sent to our server to generate a reply. When AI mode is enabled, they are processed by our AI provider (OpenAI) for that purpose. We do <b>not</b> store chat conversations by default. A copy of the chat is kept with your enquiry only if you tick “include this chat conversation”. Personal details you type during the enquiry steps are not sent to the AI provider. Your chat history is kept in your browser only for the current session and is cleared when you close the tab. Please don&apos;t share passwords, financial details or sensitive personal data in the chat.</p>

        <h3>Why we use it</h3>
        <p>Solely to respond to your enquiry, prepare a quotation and communicate with you about your project. We don&apos;t sell your data or use it for unrelated marketing.</p>

        <h3>Where it&apos;s kept and for how long</h3>
        <p>Enquiries are delivered to {BUSINESS.ownerFirstName} by email and may be stored in a secure database (Supabase) with access restricted to the business. Enquiries that don&apos;t become projects are deleted within 12 months. Project records are kept only as long as needed for the engagement and any legal obligations.</p>

        <h3>Your rights</h3>
        <p>You can ask to access, correct or delete your information, or withdraw consent at any time, by emailing <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>. We aim to handle personal data in line with applicable data-protection laws, including Kenya&apos;s Data Protection Act 2019 and, for clients in the UK and EU, the UK GDPR and GDPR.</p>

        <h3>Research data</h3>
        <p>Datasets and project materials are treated as confidential and used only for your project. Please share only data you are authorised to disclose, and anonymise personal identifiers wherever possible.</p>
      </div>
    </section>
  );
}
