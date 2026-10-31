import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/config";
import { BIO, COMPETENCIES, EXPERIENCE, INTEGRITY, PLATFORMS_NOTE, QUALIFICATIONS } from "@/lib/knowledge";

export const metadata: Metadata = { title: "About Wicliff", description: `Background, qualifications and professional standards of ${BUSINESS.owner}.` };

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">About</p>
          <h1>{BUSINESS.owner}</h1>
          <p className="lede">{BIO.paragraphs[1]}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 16 }}>
        <div className="wrap grid grid-2" style={{ gap: 40, alignItems: "start" }}>
          <div>{BIO.paragraphs.filter((_, i) => i !== 1).map((p) => <p key={p}>{p}</p>)}<p className="muted">{PLATFORMS_NOTE}</p></div>
          <div className="grid" style={{ gap: 16 }}>
            <div className="card">
              <h3>Qualifications</h3>
              {QUALIFICATIONS.map((q) => (
                <div key={q.title} style={{ marginTop: 12 }}>
                  <b>{q.title}</b>
                  <div className="small muted">{q.institution} · {q.dates}</div>
                  {q.detail && <p className="small" style={{ marginTop: 4 }}>{q.detail}</p>}
                </div>
              ))}
            </div>
            <div className="card">
              <h3>Experience</h3>
              {EXPERIENCE.map((e) => (
                <div key={e.role} style={{ marginTop: 12 }}>
                  <b>{e.role}</b> <span className="small muted">· {e.org}</span>
                  <ul style={{ margin: "4px 0 0", paddingLeft: 18, color: "var(--ink-2)", fontSize: "0.93rem" }}>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <p className="eyebrow">Technical competencies</p>
          <h2>Tools of the trade.</h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            {COMPETENCIES.map((c) => (
              <div key={c.area} className="card"><h3>{c.area}</h3><div style={{ marginTop: 10 }}>{c.items.map((i) => <span key={i} className="tag">{i}</span>)}</div></div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="integrity">
        <div className="wrap">
          <p className="eyebrow">Professional standards</p>
          <h2>Academic integrity & ethical boundaries.</h2>
          <p className="lede">{INTEGRITY.aim}</p>
          <div className="grid grid-2" style={{ marginTop: 24 }}>
            <div className="card"><h3>We do provide</h3><ul style={{ paddingLeft: 18, color: "var(--ink-2)" }}>{INTEGRITY.doProvide.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="card"><h3>We do not</h3><ul style={{ paddingLeft: 18, color: "var(--ink-2)" }}>{[...INTEGRITY.doNot, ...INTEGRITY.other].map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          <div style={{ marginTop: 28 }}><Link href="/contact#enquiry" className="btn btn-primary">Start a conversation</Link></div>
        </div>
      </section>
    </>
  );
}
