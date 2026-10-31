/**
 * Official business contact details — the ONE place to change them.
 * Every page, the footer, the floating WhatsApp button, the chatbot and the
 * enquiry forms read from here.
 */

export const BUSINESS = {
  name: "Wickie Stat Consultancy",
  owner: "Wicliff Chomba Nyaga",
  ownerFirstName: "Wicliff",
  email: "wickiestat97@gmail.com",
  tagline: "Turning Data Into Intelligence. Transforming Research Into Impact.",
  positioning: "Advanced Analytics. Intelligent Solutions. Measurable Impact.",
} as const;

export type WhatsAppLine = {
  id: "kenya" | "international";
  label: string;
  /** Human-readable number, e.g. "+254 704 619 869" */
  display: string;
  /** Digits only with country code, no "+" — used for wa.me links */
  digits: string;
};

/**
 * TODO(Wicliff): add your international WhatsApp number below, e.g.
 *   display: "+44 7700 900123", digits: "447700900123"
 * Leave `digits` empty and the international line stays hidden everywhere
 * except a "coming soon" note on the Contact page.
 */
const INTERNATIONAL_WHATSAPP = {
  display: "[INSERT SECOND INTERNATIONAL NUMBER]",
  digits: "",
};

export const WHATSAPP_LINES: WhatsAppLine[] = [
  { id: "kenya", label: "Kenya WhatsApp", display: "+254 704 619 869", digits: "254704619869" },
  { id: "international", label: "International WhatsApp", ...INTERNATIONAL_WHATSAPP },
];

/** Lines with a real number configured. */
export const ACTIVE_WHATSAPP_LINES = WHATSAPP_LINES.filter((l) => /^\d{8,15}$/.test(l.digits));
export const INTERNATIONAL_PENDING = !ACTIVE_WHATSAPP_LINES.some((l) => l.id === "international");

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello Wicliff, I found Wickie Stat Consultancy online and would like to discuss a project.";

export function whatsappLink(line: WhatsAppLine, message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${line.digits}?text=${encodeURIComponent(message)}`;
}

export const EMAIL_SUBJECT = "Project Enquiry – Wickie Stat Consultancy";

export const EMAIL_BODY_TEMPLATE = [
  "Hello Wicliff,",
  "",
  "I would like to enquire about your services.",
  "",
  "Full name: ",
  "WhatsApp number: ",
  "Service required: ",
  "Project description: ",
  "Expected timeline: ",
  "Budget range (optional): ",
  "",
  "Kind regards,",
].join("\n");

/** A properly formatted mailto: link (subject + body, RFC 6068 encoding). */
export function mailtoLink(subject: string = EMAIL_SUBJECT, body: string = EMAIL_BODY_TEMPLATE): string {
  return `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Site pages the chatbot can point visitors to. */
export const PAGES = {
  home: { href: "/", label: "Home" },
  services: { href: "/services", label: "Services" },
  portfolio: { href: "/portfolio", label: "Portfolio" },
  about: { href: "/about", label: "About Wicliff" },
  contact: { href: "/contact", label: "Contact" },
  privacy: { href: "/privacy", label: "Privacy notice" },
} as const;

export type PageKey = keyof typeof PAGES;
