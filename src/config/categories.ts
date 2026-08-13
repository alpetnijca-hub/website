import type { Category, CategorySlug } from "@/types/calculator";

/**
 * Alle Kategorien – auch die noch geplanten.
 * Geplante Kategorien werden in Übersichten als Vorschau angezeigt,
 * erhalten aber keinen Link und tauchen nicht in der Sitemap auf.
 */
export const categories: Category[] = [
  {
    slug: "gesundheit",
    name: "Gesundheit & Fitness",
    description:
      "Kalorienbedarf, BMI, Makronährstoffe und weitere Rechner rund um Ernährung und Training.",
    href: "/gesundheit",
    icon: "activity",
    status: "aktiv",
  },
  {
    slug: "arbeit",
    name: "Arbeit & Gehalt",
    description:
      "Rechner für Stundenlohn, Arbeitszeit und Gehaltsbestandteile. In Vorbereitung.",
    href: "/arbeit",
    icon: "briefcase",
    status: "geplant",
  },
  {
    slug: "finanzen",
    name: "Finanzen",
    description:
      "Zins-, Kredit- und Sparrechner. In Vorbereitung.",
    href: "/finanzen",
    icon: "wallet",
    status: "geplant",
  },
  {
    slug: "waehrungen",
    name: "Währungen",
    description:
      "Währungsumrechnung mit tagesaktuellen Kursen eines externen Anbieters. In Vorbereitung.",
    href: "/waehrungen",
    icon: "coins",
    status: "geplant",
  },
  {
    slug: "krypto",
    name: "Kryptowährungen",
    description:
      "Umrechnung und Renditerechner für Kryptowährungen. In Vorbereitung.",
    href: "/krypto",
    icon: "chart",
    status: "geplant",
  },
  {
    slug: "mathematik",
    name: "Mathematik",
    description:
      "Prozent-, Dreisatz- und Bruchrechner. In Vorbereitung.",
    href: "/mathematik",
    icon: "calculator",
    status: "geplant",
  },
  {
    slug: "alltag",
    name: "Alltag",
    description:
      "Praktische Rechner für Haushalt, Reise und Freizeit. In Vorbereitung.",
    href: "/alltag",
    icon: "home",
    status: "geplant",
  },
];

const byslug = new Map<CategorySlug, Category>(
  categories.map((c) => [c.slug, c]),
);

export function getCategory(slug: CategorySlug): Category | undefined {
  return byslug.get(slug);
}

/** Kategorien, die bereits mindestens einen fertigen Rechner haben. */
export function activeCategories(): Category[] {
  return categories.filter((c) => c.status === "aktiv");
}
