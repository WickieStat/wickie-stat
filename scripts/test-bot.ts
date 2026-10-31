import { demoReply, type DemoContext } from "../src/lib/demoBot";
const convo = [
  "Hi", "I need someone to analyse my Master's research data.", "SPSS", "How long will it take?",
  "I need a machine learning model.", "How much do you charge?", "Can you write my whole thesis for me?",
  "Can you guarantee profits on my forex strategy?", "Who is Wicliff? What are his qualifications?",
  "Do you have testimonials?", "Do you accept M-Pesa?", "Is my data confidential?", "I need a Tableau dashboard for sales KPIs",
  "Can you build me a chatbot with GPT?", "Do you work with clients in Sweden?", "What's the weather on Mars?",
  "I need help with data processing automation in Python", "Explore Your Services", "Speak to Wicliff", "Request a Quotation",
  "I need option pricing with Black-Scholes", "Do you do regression in Stata?", "thanks",
];
let ctx: DemoContext = {};
for (const m of convo) {
  const r = demoReply(m, ctx); ctx = r.ctx;
  console.log(`\n> ${m}\n${r.reply.text.split("\n")[0].slice(0, 170)}\n   [svc=${r.reply.service ?? "-"} actions=${(r.reply.actions ?? []).map(a => a.type).join(",")}]`);
}
