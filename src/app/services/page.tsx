import type { Metadata } from "next";
import Link from "next/link";
import ChatButton from "@/components/ChatButton";
import { SERVICES, TIMELINES } from "@/lib/knowledge";

export const metadata: Metadata = { title: "Services", description: "Data science, statistics, research support, AI/ML, financial engineering and BI services." };

export default function ServicesPage() {
  const cats = [...new Set(SERVICES.map((s) => s.category))];
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Services</p>
          <h1>What we can do for you.</h1>
          <p className="lede">Each service lists what it involves, who it suits, what you&apos;ll need to share and an indicative timeline. Every project starts with an assessment and a quotation before any work begins.</p>
          <nav aria-label="Service categories" style={{ marginTop: 20 }}>
            {cats.map((c) => <a key={c} className="tag" href={`#${SERVICES.find((s) => s.category === c)!.slug}`}>{c}</a>)}
          </nav>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 16 }}>
        <div className="wrap">
          {SERVICES.map((s) => (
            <article key={s.slug} id={s.slug} className="service">
              <div>
                <span className="cat-label">{s.category}</span>
                <h2 style={{ marginTop: 8, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>{s.name}</h2>
                <p className="lede" style={{ fontSize: "1.05rem" }}>{s.summary}</p>
                <div>{s.tools.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                <div className="btn-row" style={{ marginTop: 14 }}>
                  <ChatButton enquiry={s.name} className="btn btn-primary">Enquire about this</ChatButton>
                  <ChatButton message={`Tell me more about ${s.name}`}>Ask a question</ChatButton>
                </div>
              </div>
              <dl>
                <div><dt>What it involves</dt><dd><ul>{s.involves.map((x) => <li key={x}>{x}</li>)}</ul></dd></div>
                <div><dt>Who benefits</dt><dd><ul>{s.whoBenefits.map((x) => <li key={x}>{x}</li>)}</ul></dd></div>
                <div><dt>What you&apos;ll provide</dt><dd><ul>{s.clientProvides.map((x) => <li key={x}>{x}</li>)}</ul></dd></div>
                <div><dt>Indicative timeline</dt><dd>{s.timeline}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>
      <section className="section alt">
        <div className="wrap grid grid-2" style={{ gap: 40, alignItems: "start" }}>
          <div>
            <p className="eyebrow">Timelines & pricing</p>
            <h2>Transparent, scoped quotations.</h2>
            <p className="lede">There is no single fixed price — cost depends on complexity, data volume, technical requirements, deliverables, timeline and level of consultancy. You always receive a quotation before work begins. Urgent work is possible, subject to availability, and may attract additional charges.</p>
            <Link href="/contact#enquiry" className="btn btn-primary">Request a quotation</Link>
          </div>
          <div className="card">
            <table className="table">
              <thead><tr><th>Project type</th><th>Indicative time</th></tr></thead>
              <tbody>{TIMELINES.map((t) => <tr key={t.item}><td>{t.item}</td><td>{t.time}</td></tr>)}</tbody>
            </table>
            <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>Estimates, not guaranteed deadlines. A confirmed timeline follows a review of your project.</p>
          </div>
        </div>
      </section>
    </>
  );
}
