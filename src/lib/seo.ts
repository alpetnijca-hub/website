import type { Metadata } from "next";
import { absoluteUrl, site } from "@/config/site";

interface PageSeoInput {
  /** Titel ohne Markennamen – das Suffix wird ergänzt. */
  title: string;
  description: string;
  /** Interner Pfad, z. B. "/gesundheit/bmi-rechner". */
  path: string;
  /** Für Seiten, die nicht in den Index sollen (z. B. Danke-Seiten). */
  noIndex?: boolean;
}

/**
 * Erzeugt Metadaten inklusive Canonical, Open Graph und Twitter Card.
 * Jede Seite ruft diese Funktion mit eigenen Texten auf – es gibt bewusst
 * keine automatisch generierten Standardtexte pro Rechner.
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title} | ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.name,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
