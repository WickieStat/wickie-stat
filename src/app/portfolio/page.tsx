import type { Metadata } from "next";
import Link from "next/link";
import { PORTFOLIO } from "@/lib/knowledge";

export const metadata: Metadata = { title: "Portfolio", description: "Representative data science, research analytics, AI and quantitative finance projects." };

export default function PortfolioPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Portfolio</p>
          <h1>Selected analytical work.</h1>
          <p className="lede">These are demonstration and independent research projects that show the methods and tools used in client work. Client projects are only published with the client&apos;s explicit permission — confidentiality comes first.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 16 }}>
        <div className="wrap grid grid-2">
          {PORTFOLIO.map((p, i) => (
            <article key={p.title} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <span className="tag accent">{p.label}</span>
                <span className="mono small muted">{String(i + 1).padStart(2, "0")} · {p.area}</span>
              </div>
              <h3 style={{ marginTop: 10 }}>{p.title}</h3>
              <p>{p.description}</p>
              <div>{p.tools.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            </article>
          ))}
        </div>
        <div className="wrap" style={{ marginTop: 32 }}>
          <Link href="/contact#enquiry" className="btn btn-primary">Discuss a similar project</Link>
        </div>
      </section>
    </>
  );
}
