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
    shortName: "Gesundheit",
    description:
      "Kalorienbedarf, BMI, Makronährstoffe und weitere Rechner rund um Ernährung und Training.",
    href: "/gesundheit",
    icon: "activity",
    status: "aktiv",
  },
  {
    slug: "arbeit",
    name: "Arbeit & Gehalt",
    shortName: "Arbeit",
    description:
      "Stundenlohn aus dem Gehalt, Arbeitszeit mit Pausen und Überstunden – nachvollziehbar gerechnet.",
    href: "/arbeit",
    icon: "briefcase",
    status: "aktiv",
  },
  {
    slug: "finanzen",
    name: "Finanzen",
    description:
      "Zinsen, Sparpläne und Kredite berechnen – mit nachvollziehbarem Rechenweg.",
    href: "/finanzen",
    icon: "wallet",
    status: "aktiv",
  },
  {
    slug: "waehrungen",
    name: "Währungen",
    description:
      "Währungen umrechnen mit den täglich veröffentlichten Referenzkursen der Europäischen Zentralbank.",
    href: "/waehrungen",
    icon: "coins",
    status: "aktiv",
  },
  {
    slug: "krypto",
    name: "Kryptowährungen",
    shortName: "Krypto",
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
      "Prozentrechnung und Dreisatz – die Klassiker, sauber erklärt.",
    href: "/mathematik",
    icon: "calculator",
    status: "aktiv",
  },
  {
    slug: "alltag",
    name: "Alltag",
    description:
      "Spritkosten, Stromkosten und Mehrwertsteuer für den Alltag.",
    href: "/alltag",
    icon: "home",
    status: "aktiv",
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
