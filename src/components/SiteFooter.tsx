import Link from "next/link";
import { ACTIVE_WHATSAPP_LINES, BUSINESS, mailtoLink, whatsappLink } from "@/lib/config";
import { SERVICES } from "@/lib/knowledge";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h4>{BUSINESS.name}</h4>
            <p style={{ maxWidth: "42ch" }}>{BUSINESS.tagline}</p>
            <p className="small">Consultant: {BUSINESS.owner}</p>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={mailtoLink()}>{BUSINESS.email}</a></li>
              {ACTIVE_WHATSAPP_LINES.map((l) => (
                <li key={l.id}><a href={whatsappLink(l)} target="_blank" rel="noopener noreferrer">{l.label}: {l.display}</a></li>
              ))}
              <li><Link href="/contact#enquiry">Project enquiry form</Link></li>
            </ul>
          </div>
          <div>
            <h4>Popular services</h4>
            <ul>
              {SERVICES.filter((s) => ["data-science-analytics", "spss-stata", "masters-phd-support", "machine-learning", "dashboard-development"].includes(s.slug)).map((s) => (
                <li key={s.slug}><Link href={`/services#${s.slug}`}>{s.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} {BUSINESS.name}. {BUSINESS.positioning}</span>
          <span><Link href="/privacy">Privacy notice</Link> · <Link href="/about#integrity">Academic integrity</Link></span>
        </div>
      </div>
    </footer>
  );
}
