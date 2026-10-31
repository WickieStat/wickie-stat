import Link from "next/link";
import ChatButton from "@/components/ChatButton";
import ContactBlock from "@/components/ContactBlock";
import HeroArt from "@/components/HeroArt";
import { ArrowIcon } from "@/components/Icons";
import { BUSINESS } from "@/lib/config";
import { AUDIENCES, PORTFOLIO, PROCESS, SERVICES } from "@/lib/knowledge";

export default function Home() {
  const featured = ["data-science-analytics", "spss-stata", "masters-phd-support", "python-r-programming", "machine-learning", "generative-ai", "financial-engineering", "forex-quant-research", "dashboard-development"];
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">Data science · Research analytics · AI · Quant finance</p>
            <h1>Turning data into <em>intelligence.</em> Transforming research into impact.</h1>
            <p className="lede">
              {BUSINESS.name} helps researchers, postgraduate students, businesses and institutions turn complex data into clear, defensible insight — with rigorous statistics, clean code and practical AI.
            </p>
            <div className="btn-row">
              <Link href="/contact#enquiry" className="btn btn-primary">Request a quotation <ArrowIcon /></Link>
              <ChatButton>Ask our assistant</ChatButton>
            </div>
            <div className="trust-row">
              <span>Python · R · SPSS · Stata · SQL</span>
              <span>Remote clients worldwide</span>
              <span>Confidential by default</span>
            </div>
          </div>
          <HeroArt />
        </div>
      </section>

      <section className="section alt" id="services">
        <div className="wrap">
          <p className="eyebrow">Services</p>
          <h2>Analytical expertise, end to end.</h2>
          <p className="lede" style={{ marginBottom: 32 }}>Thirteen specialist services across statistics, research, AI and quantitative finance. Here are the most requested.</p>
          <div className="grid grid-3">
            {SERVICES.filter((s) => featured.includes(s.slug)).map((s) => (
              <Link key={s.slug} href={`/services#${s.slug}`} className="card card-link">
                <span className="cat-label">{s.category}</span>
                <h3 style={{ marginTop: 10 }}>{s.name}</h3>
                <p>{s.summary}</p>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 24 }}><Link href="/services">See all 13 services →</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">How we work</p>
          <h2>A clear process, from enquiry to delivery.</h2>
          <p className="lede" style={{ marginBottom: 32 }}>You get a quotation covering scope, deliverables, timeline and revisions before any work begins.</p>
          <div className="steps">
            {PROCESS.map((p) => (
              <div className="step" key={p.stage}><h3>{p.stage}</h3><p>{p.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid grid-2" style={{ alignItems: "start", gap: 40 }}>
          <div>
            <p className="eyebrow">About the consultant</p>
            <h2>{BUSINESS.owner}</h2>
            <p className="lede">Multidisciplinary data science, AI, research analytics and financial engineering professional — currently pursuing an MSc in Financial Engineering at WorldQuant University and working as a Senior Analyst at WorldQuant Brain on quantitative research and Alpha development.</p>
            <Link href="/about" className="btn btn-ghost">Read the full profile</Link>
          </div>
          <div className="card">
            <h3>Who we work with</h3>
            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--ink-2)" }}>
              {AUDIENCES.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Selected work</p>
          <h2>Representative projects.</h2>
          <p className="lede" style={{ marginBottom: 32 }}>Demonstration and independent research work. Client projects are only ever shown with explicit permission.</p>
          <div className="grid grid-3">
            {PORTFOLIO.slice(0, 3).map((p) => (
              <article key={p.title} className="card">
                <span className="tag accent">{p.label}</span>
                <h3 style={{ marginTop: 8 }}>{p.title}</h3>
                <p>{p.description}</p>
              </article>
            ))}
          </div>
          <p style={{ marginTop: 24 }}><Link href="/portfolio">View the full portfolio →</Link></p>
        </div>
      </section>

      <section className="section alt" id="contact">
        <div className="wrap grid grid-2" style={{ alignItems: "start", gap: 40 }}>
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Let&apos;s discuss your project.</h2>
            <p className="lede">Message Wicliff directly, or send a short enquiry and receive a tailored quotation.</p>
            <div className="btn-row">
              <Link href="/contact#enquiry" className="btn btn-primary">Send a project enquiry</Link>
              <ChatButton enquiry="">Enquire via chat</ChatButton>
            </div>
          </div>
          <ContactBlock />
        </div>
      </section>
    </>
  );
}
