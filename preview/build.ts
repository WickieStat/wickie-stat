/* Builds preview/wickie-stat-preview.html — a single-file live preview of the site. Run: npx tsx preview/build.ts */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ACTIVE_WHATSAPP_LINES, BUSINESS, INTERNATIONAL_PENDING, whatsappLink } from "../src/lib/config";
import { TIMELINE_OPTIONS } from "../src/lib/enquiryFlow";
import {
  AUDIENCES, BIO, COMPETENCIES, EXPERIENCE, FAQS, INTEGRITY, PLATFORMS_NOTE, PORTFOLIO, PROCESS, QUALIFICATIONS, SERVICES, SERVICE_NAMES, TIMELINES,
} from "../src/lib/knowledge";

const root = join(__dirname, "..");
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const li = (xs: string[]) => xs.map((x) => `<li>${esc(x)}</li>`).join("");
const tags = (xs: string[], cls = "tag") => xs.map((x) => `<span class="${cls}">${esc(x)}</span>`).join("");

const bundle = execSync(`${join(root, "node_modules/.bin/esbuild")} ${join(root, "preview/entry.ts")} --bundle --format=iife --minify --target=es2019 --alias:server-only=./preview/empty.js`, { cwd: root }).toString();
const widget = readFileSync(join(root, "preview/widget.js"), "utf8");
const css = readFileSync(join(root, "src/app/globals.css"), "utf8") + readFileSync(join(root, "src/components/chat.css"), "utf8");

const ICON = {
  wa: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 0 16.47Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.67.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.17 1.76 2.68 4.25 3.76.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z"/></svg>`,
  mail: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  chat: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.4 7.55L3 21l1.45-5.6A8.5 8.5 0 1 1 21 12Z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01" stroke-width="2.6"/></svg>`,
  min: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>`,
  max: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>`,
  restore: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  send: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
};

const PTS = [[28,168],[44,150],[52,172],[66,140],[78,152],[90,128],[104,136],[112,116],[126,124],[138,104],[150,112],[162,92],[176,100],[186,82],[200,88],[212,70],[226,76],[238,58],[252,64],[266,48],[60,120],[140,150],[220,110],[96,96]];
const heroArt = `<figure class="hero-art" aria-hidden="true"><svg viewBox="0 0 300 200"><defs><linearGradient id="band" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity="0.18"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0.02"/></linearGradient></defs>${[40,80,120,160].map((y) => `<line x1="16" x2="290" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="2 4"/>`).join("")}<line x1="16" x2="290" y1="186" y2="186" stroke="var(--ink-2)"/><line x1="16" x2="16" y1="14" y2="186" stroke="var(--ink-2)"/><path d="M20 160 L280 34 L280 64 L20 190 Z" fill="url(#band)"/>${PTS.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i > 19 ? 3 : 3.6}" fill="${i > 19 ? "var(--signal)" : "var(--ink)"}" opacity="${i > 19 ? 0.9 : 0.75}"/>`).join("")}<line x1="20" y1="176" x2="280" y2="48" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/></svg><figcaption><span>ŷ = β₀ + β₁x</span><span>signal &gt; noise</span></figcaption></figure>`;

const contactCards = (pending: boolean) => `<div class="contact-list">
  <div class="contact-item"><span class="ico">${ICON.mail}</span><span class="ci-body"><b>Email</b><span class="sel">${BUSINESS.email}</span></span><button type="button" class="copy-btn" data-copy="${BUSINESS.email}">Copy</button></div>
  ${ACTIVE_WHATSAPP_LINES.map((l) => `<a class="contact-item" href="${esc(whatsappLink(l))}" target="_blank" rel="noopener noreferrer"><span class="ico wa">${ICON.wa}</span><span class="ci-body"><b>${l.label}</b><span>${l.display}</span></span></a>`).join("")}
  ${pending && INTERNATIONAL_PENDING ? `<div class="contact-item pending"><span class="ico wa">${ICON.wa}</span><span class="ci-body"><b>International WhatsApp</b><span>Coming soon. Please use the Kenya number or email for now.</span></span></div>` : ""}
</div>`;

const previewCss = `
.preview-bar { background: var(--signal); color: #1d1405; font-size: 0.82rem; text-align: center; padding-block: 8px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 50; background: var(--paper); }
.site-header { top: env(safe-area-inset-top, 0px); }
.wrap { padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
@media (min-width: 720px) { .wrap { padding-left: max(28px, env(safe-area-inset-left, 0px)); padding-right: max(28px, env(safe-area-inset-right, 0px)); } }
h1, h2 { text-wrap: balance; }
section[id] { scroll-margin-top: 80px; }
.ci-body { min-width: 0; flex: 1; color: inherit; }
.sel { user-select: all; }
.copy-btn { font: 600 0.8rem/1 var(--font-body); padding: 9px 12px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; }
.copy-btn:hover { border-color: var(--accent); color: var(--accent); }
.contact-item.pending { opacity: 0.72; }
.fab-stack { right: calc(16px + env(safe-area-inset-right, 0px)); bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
@media (min-width: 720px) { .fab-stack { right: calc(24px + env(safe-area-inset-right, 0px)); bottom: calc(24px + env(safe-area-inset-bottom, 0px)); } }
.chat-panel { right: calc(16px + env(safe-area-inset-right, 0px)); bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
@media (min-width: 720px) { .chat-panel { right: calc(24px + env(safe-area-inset-right, 0px)); bottom: calc(24px + env(safe-area-inset-bottom, 0px)); } }
@media (max-width: 520px) { .chat-panel:not(.minimised) { right: 0; bottom: 0; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); } }
.chat-panel[hidden], .chat-fab[hidden] { display: none !important; }
.msg-actions .wa-solid { background: var(--wa); color: #fff; border-color: var(--wa); }
.quick[hidden] { display: none !important; }
.faq-grid details summary { cursor: pointer; font-weight: 600; }
.faq-grid details p { margin: 10px 0 0; }
.privacy { max-width: 760px; }
.privacy h3 { margin-top: 1.4em; }
.grid > * { min-width: 0; }
`;

const html = `<title>Wickie Stat Consultancy</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap">
<style>${css}${previewCss}</style>
<div class="preview-bar" role="note"><b>Website preview.</b> The chatbot runs in demo mode here, and enquiries open WhatsApp rather than submitting online.</div>
<header class="site-header" id="top"><div class="wrap">
  <a href="#top" class="brand" aria-label="Wickie Stat Consultancy home"><span class="brand-mark">WS</span><span>Wickie Stat<small>Consultancy</small></span></a>
  <nav class="nav" aria-label="Main"><a href="#services">Services</a><a href="#portfolio">Portfolio</a><a href="#about">About</a><a href="#contact">Contact</a><a href="#enquiry" class="btn btn-primary">Request a quote</a></nav>
  <a class="menu-btn" href="#contact" aria-label="Contact">${ICON.mail}</a>
</div></header>
<main>
<section class="hero"><div class="wrap hero-grid">
  <div>
    <p class="eyebrow">Data science · Research analytics · AI · Quant finance</p>
    <h1>Turning data into <em>intelligence.</em> Transforming research into impact.</h1>
    <p class="lede">${BUSINESS.name} helps researchers, postgraduate students, businesses and institutions turn complex data into clear, defensible insight, with rigorous statistics, clean code and practical AI.</p>
    <div class="btn-row"><a href="#enquiry" class="btn btn-primary">Request a quotation →</a><button type="button" class="btn btn-ghost" data-chat="">Ask our assistant</button></div>
    <div class="trust-row"><span>Python · R · SPSS · Stata · SQL</span><span>Remote clients worldwide</span><span>Confidential by default</span></div>
  </div>
  ${heroArt}
</div></section>

<section class="section alt" id="services"><div class="wrap">
  <p class="eyebrow">Services</p><h2>Analytical expertise, end to end.</h2>
  <p class="lede" style="margin-bottom:24px">Thirteen specialist services. Each lists what it involves, who it suits, what you'll share and an indicative timeline.</p>
  ${SERVICES.map((s) => `<article class="service" id="${s.slug}">
    <div><span class="cat-label">${esc(s.category)}</span><h2 style="margin-top:8px;font-size:clamp(1.5rem,3vw,2.1rem)">${esc(s.name)}</h2><p class="lede" style="font-size:1.03rem">${esc(s.summary)}</p><div>${tags(s.tools)}</div>
      <div class="btn-row" style="margin-top:14px"><button type="button" class="btn btn-primary" data-enquiry="${esc(s.name)}">Enquire about this</button><button type="button" class="btn btn-ghost" data-chat="Tell me more about ${esc(s.name)}">Ask a question</button></div></div>
    <dl><div><dt>What it involves</dt><dd><ul>${li(s.involves)}</ul></dd></div><div><dt>Who benefits</dt><dd><ul>${li(s.whoBenefits)}</ul></dd></div><div><dt>What you'll provide</dt><dd><ul>${li(s.clientProvides)}</ul></dd></div><div><dt>Indicative timeline</dt><dd>${esc(s.timeline)}</dd></div></dl>
  </article>`).join("")}
</div></section>

<section class="section" id="process"><div class="wrap">
  <p class="eyebrow">How we work</p><h2>A clear process, from enquiry to delivery.</h2>
  <p class="lede" style="margin-bottom:28px">You receive a quotation covering scope, deliverables, timeline, price, payment terms and revisions before any work begins.</p>
  <div class="steps">${PROCESS.map((p) => `<div class="step"><h3>${esc(p.stage)}</h3><p>${esc(p.text)}</p></div>`).join("")}</div>
  <div class="grid grid-2" style="margin-top:40px;gap:32px;align-items:start">
    <div><h3>Pricing</h3><p class="muted">There is no single fixed price. Cost depends on complexity, data volume, technical requirements, deliverables, timeline and the level of consultancy needed. Urgent work is possible, subject to availability, and may attract additional charges.</p></div>
    <div class="card" style="overflow-x:auto"><table class="table"><thead><tr><th>Project type</th><th>Indicative time</th></tr></thead><tbody>${TIMELINES.map((t) => `<tr><td>${esc(t.item)}</td><td style="white-space:nowrap">${esc(t.time)}</td></tr>`).join("")}</tbody></table><p class="small muted" style="margin:12px 0 0">Estimates, not guaranteed deadlines.</p></div>
  </div>
</div></section>

<section class="section alt" id="about"><div class="wrap">
  <p class="eyebrow">About</p><h2>${BUSINESS.owner}</h2>
  <div class="grid grid-2" style="gap:40px;align-items:start;margin-top:16px">
    <div>${BIO.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}<p class="muted">${esc(PLATFORMS_NOTE)}</p></div>
    <div class="grid" style="gap:16px">
      <div class="card"><h3>Qualifications</h3>${QUALIFICATIONS.map((q) => `<div style="margin-top:12px"><b>${esc(q.title)}</b><div class="small muted">${esc(q.institution)} · ${esc(q.dates)}</div>${q.detail ? `<p class="small" style="margin:4px 0 0">${esc(q.detail)}</p>` : ""}</div>`).join("")}</div>
      <div class="card"><h3>Experience</h3>${EXPERIENCE.map((e) => `<div style="margin-top:12px"><b>${esc(e.role)}</b> <span class="small muted">· ${esc(e.org)}</span><ul style="margin:4px 0 0;padding-left:18px;color:var(--ink-2);font-size:.93rem">${li(e.points)}</ul></div>`).join("")}</div>
    </div>
  </div>
  <div class="grid grid-3" style="margin-top:32px">${COMPETENCIES.map((c) => `<div class="card"><h3>${esc(c.area)}</h3><div style="margin-top:10px">${tags(c.items)}</div></div>`).join("")}<div class="card"><h3>Who we work with</h3><ul style="margin:8px 0 0;padding-left:18px;color:var(--ink-2);font-size:.93rem">${li(AUDIENCES)}</ul></div></div>
  <div id="integrity" style="margin-top:48px"><h3 style="font-family:var(--font-display);font-weight:400;font-size:1.9rem">Academic integrity &amp; ethical boundaries</h3><p class="lede">${esc(INTEGRITY.aim)}</p>
    <div class="grid grid-2" style="margin-top:16px"><div class="card"><h3>We do provide</h3><ul style="padding-left:18px;color:var(--ink-2)">${li(INTEGRITY.doProvide)}</ul></div><div class="card"><h3>We do not</h3><ul style="padding-left:18px;color:var(--ink-2)">${li([...INTEGRITY.doNot, ...INTEGRITY.other])}</ul></div></div></div>
</div></section>

<section class="section" id="portfolio"><div class="wrap">
  <p class="eyebrow">Portfolio</p><h2>Selected analytical work.</h2>
  <p class="lede" style="margin-bottom:28px">Demonstration and independent research projects. Client projects are only published with the client's explicit permission.</p>
  <div class="grid grid-2">${PORTFOLIO.map((p) => `<article class="card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:baseline;flex-wrap:wrap"><span class="tag accent">${p.label}</span><span class="mono small muted">${esc(p.area)}</span></div><h3 style="margin-top:10px">${esc(p.title)}</h3><p>${esc(p.description)}</p><div>${tags(p.tools)}</div></article>`).join("")}</div>
</div></section>

<section class="section alt" id="contact"><div class="wrap">
  <p class="eyebrow">Contact</p><h2>Let's talk about your project.</h2>
  <p class="lede">Reach ${BUSINESS.ownerFirstName} on WhatsApp or by email, or send an enquiry for a tailored quotation. Consultations by WhatsApp, email or online meeting.</p>
  <div class="grid grid-2" style="gap:40px;align-items:start;margin-top:24px">
    <div><p class="muted">Consultant: ${BUSINESS.owner}</p>${contactCards(true)}</div>
    <div class="card" id="enquiry"><h2 style="font-size:1.8rem">Project enquiry</h2><p class="muted small">You'll receive a quotation covering scope, deliverables, timeline and price before any work begins.</p>
      <form class="form" id="enquiry-form" novalidate>
        <div class="grid grid-2">
          <div class="field"><label for="f-name">Full name</label><input id="f-name" autocomplete="name" maxlength="100" value="Amina Otieno"></div>
          <div class="field"><label for="f-email">Email address</label><input id="f-email" type="email" autocomplete="email" maxlength="200" value="amina.otieno@example.com"></div>
          <div class="field"><label for="f-whatsapp">WhatsApp number</label><input id="f-whatsapp" type="tel" maxlength="20" placeholder="+254 7XX XXX XXX" value="+254 711 000 000"></div>
          <div class="field"><label for="f-service">Service required</label><select id="f-service"><option value="">Choose a service…</option>${SERVICE_NAMES.map((s) => `<option${s === "SPSS & Stata Statistical Analysis" ? " selected" : ""}>${esc(s)}</option>`).join("")}<option>Not sure yet</option></select></div>
        </div>
        <div class="field"><label for="f-description">Brief project description</label><textarea id="f-description" maxlength="2000">Example: I have questionnaire data from 180 respondents for my MSc and need regression analysis in SPSS with interpretation of the results.</textarea></div>
        <div class="grid grid-2">
          <div class="field"><label for="f-timeline">Expected timeline</label><input id="f-timeline" list="tl" maxlength="100" value="2–4 weeks"><datalist id="tl">${TIMELINE_OPTIONS.map((t) => `<option value="${t}">`).join("")}</datalist></div>
          <div class="field"><label for="f-budget">Budget range (optional)</label><input id="f-budget" maxlength="100" placeholder="e.g. KES 15,000–25,000"></div>
        </div>
        <label class="check"><input type="checkbox" id="f-consent"><span>I agree that Wickie Stat Consultancy may store and use these details to respond to my enquiry, as described in the <a href="#privacy">Privacy notice</a>.</span></label>
        <div id="form-msg" role="status"></div>
        <div class="btn-row"><button class="btn btn-primary" type="submit">Submit enquiry</button></div>
        <p class="small muted" style="margin:0">The example values above are placeholders to show the form filled in.</p>
      </form>
    </div>
  </div>
  <div style="margin-top:56px"><h3 style="font-family:var(--font-display);font-weight:400;font-size:1.9rem">Common questions</h3>
    <div class="grid grid-2 faq-grid" style="margin-top:16px">${FAQS.map((f) => `<details class="card"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div></div>
</div></section>

<section class="section" id="privacy"><div class="wrap privacy">
  <p class="eyebrow">Privacy notice</p><h2>How we handle your information</h2>
  <p>${BUSINESS.name} is operated by ${BUSINESS.owner}. For any privacy question or request, email <span class="sel">${BUSINESS.email}</span>.</p>
  <h3>What we collect</h3><p>When you submit an enquiry through the chatbot or the contact form, we collect your full name, email address, WhatsApp number, the service you need, your project description, expected timeline and, if you choose, a budget range. We only collect this after you tick the consent box.</p>
  <h3>The website assistant</h3><p>Messages you type to the assistant are processed to generate a reply (by our AI provider, OpenAI, when AI mode is on). Chats are not stored by default; a copy is kept with your enquiry only if you tick the optional box. Personal details typed during the enquiry steps are never sent to the AI provider. Please don't share passwords, financial details or sensitive personal data in the chat.</p>
  <h3>Why we use it</h3><p>Only to respond to your enquiry, prepare a quotation and communicate about your project. We don't sell your data or use it for unrelated marketing.</p>
  <h3>Retention</h3><p>Enquiries are emailed to ${BUSINESS.ownerFirstName} and may be stored in a secure database with access restricted to the business. Enquiries that don't become projects are deleted within 12 months.</p>
  <h3>Your rights</h3><p>You can ask to access, correct or delete your information, or withdraw consent, by emailing ${BUSINESS.email}. We aim to follow applicable data-protection laws, including Kenya's Data Protection Act 2019 and, for UK and EU clients, the UK GDPR and GDPR.</p>
</div></section>
</main>
<footer class="site-footer"><div class="wrap">
  <div class="footer-grid">
    <div><h4>${BUSINESS.name}</h4><p style="max-width:42ch">${BUSINESS.tagline}</p><p class="small">Consultant: ${BUSINESS.owner}</p></div>
    <div><h4>Contact</h4><ul><li><span class="sel">${BUSINESS.email}</span></li>${ACTIVE_WHATSAPP_LINES.map((l) => `<li><a href="${esc(whatsappLink(l))}" target="_blank" rel="noopener noreferrer">${l.label}: ${l.display}</a></li>`).join("")}<li><a href="#enquiry">Project enquiry form</a></li></ul></div>
    <div><h4>Popular services</h4><ul>${SERVICES.filter((s) => ["data-science-analytics", "spss-stata", "masters-phd-support", "machine-learning", "dashboard-development"].includes(s.slug)).map((s) => `<li><a href="#${s.slug}">${esc(s.name)}</a></li>`).join("")}</ul></div>
  </div>
  <div class="footer-bottom"><span>© 2026 ${BUSINESS.name}. ${BUSINESS.positioning}</span><span><a href="#privacy">Privacy notice</a> · <a href="#integrity">Academic integrity</a></span></div>
</div></footer>

<div class="fab-stack">
  ${ACTIVE_WHATSAPP_LINES.map((l) => `<a class="wa-fab" href="${esc(whatsappLink(l))}" target="_blank" rel="noopener noreferrer" aria-label="Chat with Wicliff on WhatsApp (${l.display})">${ICON.wa}</a>`).join("")}
  <button class="chat-fab" id="chat-fab" type="button" aria-label="Open chat with our virtual assistant">${ICON.chat}<span class="pulse" aria-hidden="true"></span><span class="chat-fab-label">Questions? Ask our assistant</span></button>
</div>
<section class="chat-panel" id="chat-panel" role="dialog" aria-label="Wickie Stat virtual assistant" hidden>
  <header class="chat-head">
    <div class="chat-avatar" aria-hidden="true">WS</div>
    <div class="chat-title"><b>Wickie Stat Assistant</b><span><span class="demo-chip" title="Demonstration mode: answers come from a fixed knowledge base, not live AI.">Demo mode</span> Instant answers</span></div>
    <button type="button" id="chat-min" aria-label="Minimise chat" title="Minimise">${ICON.min}</button>
    <button type="button" id="chat-max" aria-label="Maximise chat" title="Maximise">${ICON.max}</button>
    <button type="button" id="chat-close" aria-label="Close chat" title="Close">${ICON.close}</button>
  </header>
  <div class="chat-log" id="chat-log" aria-live="polite"><p class="demo-note"><b>Demonstration mode.</b> I answer from Wickie Stat's knowledge base rather than live AI, so I may suggest contacting Wicliff for anything specific.</p></div>
  <div class="quick" id="chat-quick" role="group" aria-label="Suggested replies"></div>
  <form class="chat-input" id="chat-form"><textarea id="chat-text" rows="1" maxlength="2000" placeholder="Type your message…" aria-label="Message"></textarea><button type="submit" aria-label="Send message">${ICON.send}</button></form>
  <p class="chat-foot">Please don't share passwords or sensitive personal data here. <a href="#privacy">Privacy</a></p>
</section>
<template id="icon-restore">${ICON.restore}</template>
<script>${bundle}</script>
<script>${widget}</script>
<script>
(function () {
  var C = window.WSC.config, F = window.WSC.flow;
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-copy"), old = b.textContent;
      var ok = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = old; }, 1600); };
      try { navigator.clipboard.writeText(t).then(ok, function () {}); } catch (e) {}
    });
  });
  var form = document.getElementById("enquiry-form"), msg = document.getElementById("form-msg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var d = { name: v("f-name"), email: v("f-email"), whatsapp: v("f-whatsapp"), service: v("f-service"), description: v("f-description"), timeline: v("f-timeline"), budget: v("f-budget") };
    var err = d.name.length < 2 ? "Please enter your full name." : !F.EMAIL_RE.test(d.email) ? "Please enter a valid email address." : !F.PHONE_RE.test(d.whatsapp) ? "Please enter a WhatsApp number with its country code." : !d.service ? "Please choose a service." : d.description.length < 10 ? "Please describe your project in a sentence or two." : !d.timeline ? "Please give a rough timeline." : !document.getElementById("f-consent").checked ? "Please tick the consent box so we can process your enquiry." : "";
    msg.innerHTML = "";
    var box = document.createElement("div");
    if (err) { box.className = "notice err"; box.textContent = err; msg.appendChild(box); return; }
    box.className = "notice ok";
    var text = F.enquiryAsText(d);
    box.innerHTML = "<b>This preview can't submit enquiries online, so nothing has been sent yet.</b> On the live site this form delivers straight to Wicliff. To send these details now, open WhatsApp with the message filled in: ";
    C.ACTIVE_WHATSAPP_LINES.forEach(function (l) { var a = document.createElement("a"); a.href = C.whatsappLink(l, text); a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "Send on WhatsApp"; box.appendChild(a); });
    msg.appendChild(box);
  });
})();
</script>`;

writeFileSync(join(root, "preview/wickie-stat-preview.html"), html);
console.log("preview bytes:", html.length);
