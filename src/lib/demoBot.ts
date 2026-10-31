/**
 * Demonstration-mode assistant.
 *
 * Runs when OPENAI_API_KEY is not set (and powers the static preview).
 * It answers ONLY from the knowledge base, using intent matching rather than
 * a language model — so it can't invent facts, but it is less flexible than
 * the AI mode. The UI labels it clearly as demo mode.
 */
import { BUSINESS, INTERNATIONAL_PENDING } from "./config";
import type { BotReply, ChatAction } from "./chatTypes";
import {
  BIO, COMPETENCIES, EXPERIENCE, FAQS, INTEGRITY, PORTFOLIO, PROCESS, QUALIFICATIONS, SERVICES, type Service,
} from "./knowledge";

export type DemoContext = { lastService?: string };

const ENQUIRE: Extract<ChatAction, { type: "start_enquiry" }> = { type: "start_enquiry", label: "Start a project enquiry" };
const WHATSAPP: ChatAction = { type: "whatsapp", label: "Chat on WhatsApp" };
const EMAIL: ChatAction = { type: "email", label: "Email Wicliff" };

const norm = (s: string) =>
  ` ${s.toLowerCase().replace(/[’`]/g, "'").replace(/[^a-z0-9'+\-\s/]/g, " ").replace(/\s+/g, " ").trim()} `;

const has = (text: string, ...phrases: string[]) => phrases.some((p) => hit(text, p));

/** Word-ish match: phrase appears at a word boundary. */
function hit(text: string, phrase: string): boolean {
  const p = phrase.trim();
  if (!p) return false;
  const idx = text.indexOf(p);
  if (idx < 0) return false;
  const before = text[idx - 1];
  const after = text[idx + p.length];
  const boundary = (c: string | undefined) => c === undefined || !/[a-z0-9]/.test(c);
  return boundary(before) && (boundary(after) || after === "s");
}

const lc = (s: string) => (/^[A-Z][A-Z]/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));
const list = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const PRIORITY: Record<string, number> = { "masters-phd-support": 6, "spss-stata": 3, "generative-ai": 4, "forex-quant-research": 2 };

export function scoreServices(text: string): { service: Service; score: number }[] {
  return SERVICES.map((service) => {
    let score = 0;
    for (const k of service.keywords) if (hit(text, k)) score += Math.min(k.trim().length, 12);
    if (hit(text, service.name.toLowerCase())) score += 15;
    if (score > 0) score += PRIORITY[service.slug] ?? 0;
    return { service, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
}

function bestFaq(raw: string) {
  // "option pricing", "asset pricing" etc. are finance topics, not price questions
  const text = raw.replace(/ (option|options|asset|derivative|derivatives|bond) pricing/g, " $1 valuation");
  let best: { faq: (typeof FAQS)[number]; score: number } | null = null;
  for (const faq of FAQS) {
    let score = 0;
    for (const k of faq.keywords) if (hit(text, k)) score += k.length;
    if (score > 0 && (!best || score > best.score)) best = { faq, score };
  }
  return best;
}

function serviceReply(s: Service, opener = "I'd be happy to help with that."): BotReply {
  return {
    text: `${opener} Through our ${s.name} service, we provide ${list(s.involves.map(lc))}.\n\n${s.followUp}`,
    service: s.slug,
    actions: [{ ...ENQUIRE, service: s.name }, { type: "page", page: "services", label: "See all services" }],
    quickReplies: ["How long does it take?", "How much does it cost?", "What do you need from me?"],
  };
}

const CONTACT_LINES = () =>
  `You can reach ${BUSINESS.ownerFirstName} directly on WhatsApp (Kenya: +254 704 619 869${INTERNATIONAL_PENDING ? "" : " — an international number is also listed on the Contact page"}) or by email at ${BUSINESS.email}.`;

export function demoReply(message: string, ctx: DemoContext = {}): { reply: BotReply; ctx: DemoContext } {
  const text = norm(message);
  const current = ctx.lastService ? SERVICES.find((s) => s.slug === ctx.lastService) : undefined;
  const done = (reply: BotReply) => ({ reply, ctx: { lastService: reply.service ?? ctx.lastService } });

  // ── Boundaries first ────────────────────────────────────────────────
  const integrityAsk =
    (has(text, "write my", "write the whole", "write an entire", "do my", "write for me", "ghost") &&
      has(text, "thesis", "dissertation", "assignment", "essay", "exam", "project for me", "coursework", "paper", "proposal")) ||
    has(text, "take my exam", "sit my exam", "do my exam", "fake data", "fabricate", "make up data", "make up results", "invent data", "fake results", "fake references", "guarantee a pass", "guarantee an a", "guarantee my grade", "guarantee distinction");
  if (integrityAsk) {
    return done({
      text: `I should be upfront: we don't ghost-write theses or assignments for submission as someone else's work, fabricate data or results, invent references, or guarantee grades.\n\nWhat we do offer is genuine research support — ${list(INTEGRITY.doProvide.slice(0, 6).map(lc))}. ${INTEGRITY.aim}\n\nWould support like that help with your project?`,
      service: "masters-phd-support",
      actions: [{ ...ENQUIRE, label: "Enquire about research support", service: "Master's & PhD Research Support" }],
      quickReplies: ["I Need Research Support", "Speak to Wicliff"],
    });
  }
  if (has(text, "guarantee", "guaranteed", "always profitable", "sure profit", "make me money", "double my", "signals that win")) {
    if (has(text, "profit", "return", "money", "trading", "forex", "invest", "win")) {
      return done({
        text: "We don't guarantee financial returns or promise that any trading strategy will always be profitable — markets carry real risk. What we provide is rigorous, data-driven quantitative research: market-data analysis, strategy research and backtesting frameworks, and research dashboards.\n\nWould research support like that be useful?",
        service: "forex-quant-research",
        actions: [{ ...ENQUIRE, service: "Forex & Quantitative Research" }],
      });
    }
  }
  if (has(text, "hack", "crack password", "bypass login", "break into", "scrape private", "steal")) {
    return done({
      text: "That's outside what we can help with — we don't undertake projects involving unauthorised access to systems or data. If you have a legitimate data or analytics need, I'd be glad to help you find the right service.",
      quickReplies: ["Explore Your Services"],
    });
  }

  // ── Quick replies & social ──────────────────────────────────────────
  if (/^ (hi|hello|hey|hallo|habari|jambo|good (morning|afternoon|evening))( there)?( wickie| wicliff)? $/.test(text)) {
    return done({ text: "Hello! Great to have you here. Are you looking for help with data analysis, research support, programming, AI/ML or quantitative finance?", quickReplies: ["Explore Your Services", "I Need Data Analysis", "I Need Research Support", "Request a Quotation"] });
  }
  if (/^ (thanks|thank you|thank you so much|asante|cheers|ok thanks|okay thanks)[ !.]*$/.test(text)) {
    return done({ text: "You're very welcome! Is there anything else I can help you with?", quickReplies: ["Request a Quotation", "Speak to Wicliff"] });
  }
  if (/^ (bye|goodbye|see you|that's all|no thanks|nothing else) $/.test(text)) {
    return done({ text: `Thanks for visiting ${BUSINESS.name}. Whenever you're ready, ${BUSINESS.ownerFirstName} is just a WhatsApp message away.`, actions: [WHATSAPP] });
  }

  if (has(text, "explore your services", "your services", "what services", "list of services", "what can you do", "what do you offer", "services do you", "all services", "services you")) {
    const groups = new Map<string, string[]>();
    for (const s of SERVICES) groups.set(s.category, [...(groups.get(s.category) ?? []), s.name]);
    const lines = [...groups].map(([cat, names]) => `• ${cat}: ${names.join(", ")}`).join("\n");
    return done({
      text: `Here's what we offer:\n\n${lines}\n\nWhich of these is closest to what you need?`,
      actions: [{ type: "page", page: "services", label: "Open the Services page" }],
      quickReplies: ["I Need Data Analysis", "I Need Python/R Programming", "I Need AI/ML Solutions", "I Need Research Support"],
    });
  }
  if (has(text, "i need data analysis")) return done(serviceReply(SERVICES.find((s) => s.slug === "data-science-analytics")!, "Great — data analysis is at the heart of what we do."));
  if (has(text, "i need python/r", "python/r programming")) return done(serviceReply(SERVICES.find((s) => s.slug === "python-r-programming")!, "Happy to help with Python and R."));
  if (has(text, "i need ai/ml", "ai/ml")) {
    return done({
      text: "We work across three areas here:\n\n• Machine Learning — predictive modelling, classification, regression, model evaluation and deployment.\n• Artificial Intelligence — practical AI applications for analytical problem-solving.\n• Generative AI — assistants and document tools built on large language models.\n\nCould you briefly describe the problem you want to solve?",
      service: "machine-learning",
      actions: [{ ...ENQUIRE, service: "Machine Learning" }],
      quickReplies: ["I need a machine learning model", "I want a GenAI chatbot", "How long does it take?"],
    });
  }
  if (has(text, "i need research support")) return done(serviceReply(SERVICES.find((s) => s.slug === "masters-phd-support")!, "I'd be happy to help you with research support."));

  // ── Contact / quotation ─────────────────────────────────────────────
  if (has(text, "speak to wicliff", "talk to wicliff", "speak to a human", "talk to a human", "real person", "contact", "whatsapp", "phone", "call you", "email address", "reach you", "your number", "get in touch")) {
    return done({ text: `${CONTACT_LINES()}\n\nIf you'd like, I can also take your project details now so ${BUSINESS.ownerFirstName} has everything when he replies.`, actions: [WHATSAPP, EMAIL, ENQUIRE] });
  }
  if (has(text, "request a quotation", "get a quote", "quotation", "i want to hire", "hire you", "get started", "start a project", "submit an enquiry", "submit enquiry", "make an enquiry", "book")) {
    return done({
      text: `Of course. I'll ask a few quick questions — your name, email, WhatsApp number, the service, a short project description, your timeline and (optionally) a budget range — and send them to ${BUSINESS.ownerFirstName} for a quotation. Nothing is stored until you review and agree at the end.`,
      actions: [{ ...ENQUIRE, label: "Start enquiry", service: current?.name }],
    });
  }

  // ── Service + FAQ combos (e.g. "how long does an ML project take") ───
  const services = scoreServices(text);
  const svc = services[0]?.service ?? current;
  const faq = bestFaq(text);

  if (faq?.faq.id === "timeline" && svc) {
    return done({ text: `For ${svc.name}: ${svc.timeline}\n\nThese are estimates rather than guaranteed deadlines — you'll get a confirmed timeline once ${BUSINESS.ownerFirstName} has reviewed your project.`, service: svc.slug, actions: [{ ...ENQUIRE, service: svc.name }] });
  }
  if (faq?.faq.id === "price") {
    return done({
      text: `Our pricing depends on the complexity, scope and timeline of each project${svc ? ` — for ${svc.name}, that includes things like the amount of data and the deliverables you need` : ""}. There's no fixed price list, but you'll always receive a quotation before any work begins.\n\nI can help you submit a project enquiry so ${BUSINESS.ownerFirstName} can provide an appropriate quotation.`,
      service: svc?.slug,
      actions: [{ ...ENQUIRE, label: "Request a quotation", service: svc?.name }, WHATSAPP],
    });
  }
  if (has(text, "what do you need from me", "what information", "what do i need to provide", "what should i send", "what do you need", "requirements from me")) {
    if (svc) return done({ text: `For ${svc.name}, it helps to have:\n\n${svc.clientProvides.map((p) => `• ${p}`).join("\n")}\n\nDon't worry if you don't have everything yet — a short description is enough to start.`, service: svc.slug, actions: [{ ...ENQUIRE, service: svc.name }] });
    return done({ text: "To prepare a quotation, it helps to know: the service you need, a short description of the project, any data you'll be working with (anonymised where possible), the deliverables you expect and your timeline. A brief description is enough to start.", actions: [ENQUIRE] });
  }

  // ── About / portfolio / process / tools ─────────────────────────────
  if (has(text, "qualification", "qualified", "education", "degree", "background", "experience", "who is wicliff", "about wicliff", "about you", "credentials", "worldquant", "cv", "resume", "certificate", "certification", "certified")) {
    const q = QUALIFICATIONS.map((x) => `• ${x.title} — ${x.institution} (${x.dates})`).join("\n");
    return done({
      text: `${BIO.short}\n\n${q}\n• ${EXPERIENCE[0].role} at ${EXPERIENCE[0].org} — quantitative research and Alpha development\n• Freelance data science and research analytics consultant\n\nFor anything more specific, ${BUSINESS.ownerFirstName} is happy to share further details directly.`,
      actions: [{ type: "page", page: "about", label: "Read the full profile" }],
    });
  }
  if (has(text, "testimonial", "reviews", "references from clients", "past clients", "client list")) {
    return done({ text: `We don't publish client testimonials or client names on this site — client confidentiality comes first, and work is only showcased with explicit permission. You can see representative demonstration and independent research projects on the Portfolio page, and ${BUSINESS.ownerFirstName} can talk you through relevant experience directly.`, actions: [{ type: "page", page: "portfolio", label: "View portfolio" }, WHATSAPP] });
  }
  if (has(text, "portfolio", "your projects", "project examples", "previous work", "past work", "examples", "samples", "sample work", "work you've done")) {
    return done({ text: `Here are some representative projects (labelled as demonstration or independent research work):\n\n${PORTFOLIO.slice(0, 5).map((p) => `• ${p.title}`).join("\n")}\n\n…and more on the Portfolio page.`, actions: [{ type: "page", page: "portfolio", label: "View portfolio" }] });
  }
  if (has(text, "how do you work", "process", "how does it work", "steps", "procedure", "workflow", "how do we start", "how to start")) {
    return done({ text: `Here's how a project runs:\n\n${PROCESS.map((p, i) => `${i + 1}. ${p.stage} — ${p.text}`).join("\n")}`, actions: [ENQUIRE] });
  }
  if (has(text, "software", "tools", "technologies", "tech stack", "languages", "which programs")) {
    return done({ text: `Main tools and technologies:\n\n${COMPETENCIES.map((c) => `• ${c.area}: ${c.items.join(", ")}`).join("\n")}` });
  }

  // ── Short follow-up answering our last question (e.g. "SPSS") ───────
  const tool = ["spss", "stata", "python", "excel", "tableau", "streamlit"].find((t) => hit(text, t)) ?? (hit(text, "r") || hit(text, "rstudio") ? "R" : undefined);
  if (current && tool && text.trim().split(" ").length <= 4) {
    const name = tool.length <= 2 ? tool.toUpperCase() : tool === "spss" || tool === "stata" ? tool.toUpperCase().replace("STATA", "Stata") : tool.charAt(0).toUpperCase() + tool.slice(1);
    return done({ text: `${name} works well — we use it regularly for ${current.name} work. The best next step is a short project enquiry so ${BUSINESS.ownerFirstName} can review your requirements and send a quotation. Shall we do that now?`, service: current.slug, actions: [{ ...ENQUIRE, service: current.name }, WHATSAPP] });
  }

  if (faq && (!services[0] || faq.score >= services[0].score)) {
    return done({ text: faq.faq.a, actions: faq.faq.id === "online" ? [WHATSAPP, EMAIL] : undefined, quickReplies: ["Request a Quotation", "Explore Your Services"] });
  }
  if (services[0]) {
    const s = services[0].service;
    const opener = s.slug === "masters-phd-support" ? "I'd be happy to help you understand our research analytics services." : s.slug === "machine-learning" ? "We provide machine learning consultancy." : "I'd be happy to help with that.";
    return done(serviceReply(s, opener));
  }

  // ── Fallback: never guess ───────────────────────────────────────────
  return done({
    text: `That's a good question, and I don't want to give you an inaccurate answer. ${BUSINESS.ownerFirstName} can clarify that for you directly. ${CONTACT_LINES()}`,
    actions: [WHATSAPP, EMAIL],
    quickReplies: ["Explore Your Services", "Request a Quotation"],
  });
}
