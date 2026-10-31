import { ACTIVE_WHATSAPP_LINES, BUSINESS, INTERNATIONAL_PENDING, mailtoLink, whatsappLink } from "@/lib/config";
import { MailIcon, WhatsAppIcon } from "./Icons";

/** Email + WhatsApp contact cards, used on Home and Contact. */
export default function ContactBlock({ showPending = false }: { showPending?: boolean }) {
  return (
    <div className="contact-list">
      <a className="contact-item" href={mailtoLink()}>
        <span className="ico"><MailIcon /></span>
        <span style={{ color: "inherit" }}><b>Email</b><span>{BUSINESS.email}</span></span>
      </a>
      {ACTIVE_WHATSAPP_LINES.map((l) => (
        <a key={l.id} className="contact-item" href={whatsappLink(l)} target="_blank" rel="noopener noreferrer">
          <span className="ico wa"><WhatsAppIcon /></span>
          <span style={{ color: "inherit" }}><b>{l.label}</b><span>{l.display}</span></span>
        </a>
      ))}
      {showPending && INTERNATIONAL_PENDING && (
        <div className="contact-item" aria-disabled="true" style={{ opacity: 0.7 }}>
          <span className="ico wa"><WhatsAppIcon /></span>
          <span><b>International WhatsApp</b><span>Coming soon — please use the Kenya number or email for now.</span></span>
        </div>
      )}
    </div>
  );
}
