import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const description =
  "Pericherla Manish Varma — aspiring AI-native developer from Hyderabad building real-time voice agents, retrieval systems and full-stack products with FastAPI, Next.js and Gemini.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: `${profile.name} — ${profile.role}`, template: `%s — ${profile.shortName}` },
  description,
  authors: [{ name: profile.name, url: profile.github }],
  keywords: ["Manish Varma", "AI-native developer", "FastAPI", "Next.js", "Gemini Live", "RAG", "portfolio"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: `${profile.name} — ${profile.role}`,
    description,
    url: "/",
    siteName: profile.name,
  },
  twitter: { card: "summary_large_image", title: `${profile.name} — ${profile.role}`, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0c",
};

/** Before paint: applies a saved theme, and opts into motion (hero hidden until GSAP reveals it). */
const themeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');try{if(!sessionStorage.getItem('introSeen')){d.classList.add('intro');sessionStorage.setItem('introSeen','1');}}catch(e){}setTimeout(function(){if(!d.classList.contains('motion-started'))d.classList.remove('js-motion','intro');},3500);}})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  alumniOf: "R.M.K Engineering College",
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
