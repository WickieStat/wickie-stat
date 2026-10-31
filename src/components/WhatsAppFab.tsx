"use client";
import { useEffect, useRef, useState } from "react";
import { ACTIVE_WHATSAPP_LINES, whatsappLink } from "@/lib/config";
import { WhatsAppIcon } from "./Icons";

/** Floating WhatsApp button — one tap for a single number, a small menu for two. */
export default function WhatsAppFab() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  if (!ACTIVE_WHATSAPP_LINES.length) return null;

  if (ACTIVE_WHATSAPP_LINES.length === 1) {
    const l = ACTIVE_WHATSAPP_LINES[0];
    return (
      <a className="wa-fab" href={whatsappLink(l)} target="_blank" rel="noopener noreferrer" aria-label={`Chat with Wicliff on WhatsApp (${l.display})`} title={`WhatsApp ${l.display}`}>
        <WhatsAppIcon size={26} />
      </a>
    );
  }
  return (
    <div className="wa-menu" ref={ref}>
      {open && (
        <div className="wa-pop" role="menu">
          {ACTIVE_WHATSAPP_LINES.map((l) => (
            <a key={l.id} role="menuitem" href={whatsappLink(l)} target="_blank" rel="noopener noreferrer">
              {l.label}<small>{l.display}</small>
            </a>
          ))}
        </div>
      )}
      <button className="wa-fab" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Chat with Wicliff on WhatsApp">
        <WhatsAppIcon size={26} />
      </button>
    </div>
  );
}
