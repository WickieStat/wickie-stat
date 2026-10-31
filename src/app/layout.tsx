import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/components/chat.css";
import ChatWidget from "@/components/ChatWidget";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WhatsAppFab from "@/components/WhatsAppFab";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: { default: `${BUSINESS.name} — Data Science, Research Analytics & AI`, template: `%s · ${BUSINESS.name}` },
  description:
    "Data science, statistical analysis (SPSS, Stata, R, Python), Master's & PhD research support, machine learning, generative AI and financial engineering consultancy by Wicliff Chomba Nyaga.",
  openGraph: { title: BUSINESS.name, description: BUSINESS.tagline, type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0f1d2b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <div className="fab-stack">
          <WhatsAppFab />
          <ChatWidget />
        </div>
      </body>
    </html>
  );
}
