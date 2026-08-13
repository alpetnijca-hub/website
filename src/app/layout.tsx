import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { ConsentManager } from "@/components/consent/ConsentManager";
import { AdScripts } from "@/components/ads/AdScripts";
import { StickyAd } from "@/components/ads/StickyAd";
import { AdInterstitial } from "@/components/ads/AdInterstitial";
import { site } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – ${site.tagline}`,
    // Jede Unterseite liefert ihren eigenen Titel; hier nur das Suffix.
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // Verifizierungs-Code der Google Search Console. Trage ihn als
  // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ein, wenn du die Property anlegst.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.lang} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#hauptinhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand"
        >
          Zum Hauptinhalt springen
        </a>
        <Header />
        <main id="hauptinhalt" className="flex-1">
          {children}
        </main>
        <Footer />

        {/* Einwilligung zuerst – Werbe- und Analyseskripte werden erst
            danach und nur bei erteilter Zustimmung geladen. */}
        <ConsentManager />
        <AdScripts />
        <StickyAd />
        <AdInterstitial />
      </body>
    </html>
  );
}
