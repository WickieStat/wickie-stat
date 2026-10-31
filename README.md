# Wickie Stat Consultancy — website & AI assistant

Next.js 16 · TypeScript · OpenAI · Supabase · Resend

> *Turning Data Into Intelligence. Transforming Research Into Impact.*

## What's included

| Area | Where |
|---|---|
| Pages: Home, Services (all 13), Portfolio, About (incl. academic integrity), Contact (form + FAQs), Privacy notice | `src/app/*` |
| **All contact details — edit in one place** | `src/lib/config.ts` |
| Knowledge base: bio, qualifications, services, portfolio, FAQs, process, boundaries | `src/lib/knowledge.ts` |
| Chat widget (floating button, animations, minimise/maximise, typing indicator, session history, quick replies, in-chat enquiry) | `src/components/ChatWidget.tsx` |
| Floating WhatsApp button (shows a menu once there are two numbers) | `src/components/WhatsAppFab.tsx` |
| AI chat endpoint (OpenAI, with automatic demo fallback) | `src/app/api/chat/route.ts` |
| Enquiry endpoint (validation, consent, rate limit, Supabase + email) | `src/app/api/enquiry/route.ts` |
| System prompt generated from the knowledge base | `src/lib/prompt.ts` |
| Demo-mode assistant (no API key needed) | `src/lib/demoBot.ts` |
| Database schema | `supabase/schema.sql` |

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in what you have — everything is optional
npm run dev                   # http://localhost:3000
```

With no keys at all the site works fully, the chatbot runs in **Demo mode** (clearly labelled), and enquiries show an honest “not submitted — send via WhatsApp/email instead” message with the details pre-filled.

## Go live on Cloudflare (no terminal needed)

The dashboard's "Upload your static files" option can't run this project, because the site needs a build step and a server for the chatbot. Use Cloudflare's GitHub import instead. It builds the site for you and redeploys whenever the files change.

1. **Put the code on GitHub.** Create a new repository on github.com (it can be private), click "uploading an existing file", and drag in the *contents* of this folder: `src`, `public`, `supabase`, `scripts`, `preview`, `package.json`, `package-lock.json`, `wrangler.jsonc`, `open-next.config.ts`, `next.config.ts`, `tsconfig.json` and the rest. Commit.
2. **Connect it to Cloudflare.** Go to Workers & Pages → Create → Workers tab → **Import a repository**, then pick the repository.
3. **Settings on that screen:**
   - Project name: `wickie-stat` (it must match `name` in `wrangler.jsonc`)
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx wrangler deploy`
4. Click **Create and deploy**. The first build takes a few minutes. You'll get a `wickie-stat.<your-subdomain>.workers.dev` address.
5. **Add your keys** at Worker → Settings → Variables and Secrets. Add each key from `.env.example` as a *Secret*, then redeploy from the Deployments tab.
6. **Custom domain (optional):** Worker → Settings → Domains & Routes → Add → Custom domain.

With a terminal instead: `npm install`, `npx wrangler login`, then `npm run deploy`. Secrets: `npx wrangler secret put OPENAI_API_KEY` (and the same for the others). To test locally in Cloudflare's runtime: `npm run preview`.

Note: the chat rate limit is kept in memory, so on Cloudflare each server instance counts separately. That's fine for normal traffic. Cloudflare's own Rate Limiting rules (Security → WAF) can add a strict limit on `/api/*` if you ever need one.

## Go live on Vercel (alternative)

1. Push this folder to a GitHub repository.
2. On vercel.com → **Add New Project** → import the repo.
3. Add environment variables (see `.env.example`):
   - `OPENAI_API_KEY` → switches the assistant from demo mode to AI mode.
   - `RESEND_API_KEY` (+ `ENQUIRY_FROM_EMAIL` on a verified domain) → enquiries are emailed to you.
   - `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` → enquiries are also saved to a database. Run `supabase/schema.sql` in the Supabase SQL editor first.
4. Deploy, then submit a test enquiry from the chat and the Contact page.

An enquiry is reported as submitted **only** when the server confirms it was emailed and/or stored. If neither works, the visitor is told it wasn't submitted and offered WhatsApp/email with their details pre-filled.

## Add the international WhatsApp number

In `src/lib/config.ts`, fill in `INTERNATIONAL_WHATSAPP`:

```ts
const INTERNATIONAL_WHATSAPP = {
  display: "+44 7700 900123",
  digits: "447700900123", // country code + number, digits only
};
```

That's it — the footer, contact page, floating button (becomes a two-option menu), chat WhatsApp buttons and fallbacks all pick it up.

## Updating what the assistant knows

Edit `src/lib/knowledge.ts`. Both the AI system prompt and the demo assistant are generated from it, so the website pages and the chatbot never disagree. The assistant is instructed never to quote prices, invent credentials, testimonials or results, or claim an enquiry was sent.

## Privacy & security

- API keys live only in server environment variables; none reach the browser.
- Rate limits: 20 chat messages/minute and 5 enquiries/hour per IP (`src/lib/rateLimit.ts`; in-memory — swap for Upstash Redis if traffic grows).
- Same-origin check on POST endpoints, input validation with Zod, a honeypot field against spam bots, and security headers.
- Explicit consent checkbox before any enquiry is stored or sent; privacy notice at `/privacy`.
- Chats are **not** stored by default. A transcript is attached only if the visitor ticks the optional box. Personal details typed during the enquiry steps are never sent to OpenAI and aren't kept in session history.
- Supabase table has Row Level Security on with no public policies; an optional 12-month purge job is in the schema.

## Useful commands

```bash
npm run typecheck   # TypeScript check
npm run test:bot    # run sample conversations through the demo assistant
npm run build       # production build
```
