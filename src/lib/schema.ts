import { absoluteUrl, site } from "@/config/site";

/**
 * Strukturierte Daten (JSON-LD).
 *
 * Bewusste Beschränkung auf Typen, die zum Inhalt passen und von Google
 * unterstützt werden: BreadcrumbList, FAQPage und einmalig WebSite/Organization.
 * Kein Review-, Rating- oder Person-Markup – es gibt weder Bewertungen noch
 * ausgewiesene Autoren, und erfundene Angaben wären ein Richtlinienverstoss.
 */

export interface BreadcrumbItem {
  name: string;
  /** Interner Pfad; für das letzte Element optional. */
  href?: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export interface FaqItem {
  question: string;
  /** Reiner Text – JSON-LD-Antwort ohne Markup. */
  answer: string;
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: site.locale,
    description: site.description,
  };
}
