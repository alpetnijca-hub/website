/**
 * Zentrale Typen für die Rechner-Registry.
 * Die Registry ist die einzige Datenquelle für Navigation, Übersichtsseiten,
 * verwandte Rechner, Sitemap und SEO-Metadaten.
 */

/** Kategorie-Schlüssel. Neue Kategorien hier ergänzen. */
export type CategorySlug =
  | "gesundheit"
  | "arbeit"
  | "finanzen"
  | "waehrungen"
  | "krypto"
  | "mathematik"
  | "alltag";

/**
 * "aktiv"   – Rechner ist fertig und verlinkt.
 * "geplant" – Rechner erscheint in Übersichten als Vorschau, ohne Link.
 */
export type CalculatorStatus = "aktiv" | "geplant";

/** Kleiner Satz an Icon-Namen; gerendert als Inline-SVG (keine Icon-Bibliothek). */
export type IconName =
  | "flame"
  | "scale"
  | "target"
  | "trend-down"
  | "protein"
  | "droplet"
  | "activity"
  | "pie"
  | "wallet"
  | "coins"
  | "chart"
  | "briefcase"
  | "calculator"
  | "home";

export interface Category {
  slug: CategorySlug;
  /** Anzeigename, z. B. "Gesundheit & Fitness". */
  name: string;
  /** Kurzbeschreibung für Übersichtsseiten und Meta-Description. */
  description: string;
  /** Pfad der Kategorieseite, z. B. "/gesundheit". */
  href: string;
  icon: IconName;
  status: CalculatorStatus;
}

export interface CalculatorMeta {
  /** Eindeutiger Schlüssel, z. B. "bmi". */
  id: string;
  /** Anzeigename in Navigation und Karten, z. B. "BMI-Rechner". */
  name: string;
  category: CategorySlug;
  /** Absoluter Pfad ohne Domain, z. B. "/gesundheit/bmi-rechner". */
  href: string;
  /** Ein bis zwei Sätze für Karten und Übersichten. */
  description: string;
  icon: IconName;
  /** IDs verwandter Rechner (nur aktive werden verlinkt). */
  related: string[];
  /** Suchbegriffe für die Startseiten-Suche. Kein SEO-Keyword-Stuffing im Text. */
  keywords: string[];
  status: CalculatorStatus;
  seo: {
    /** Meta-Title ohne Site-Suffix; das Suffix ergänzt das Layout. */
    title: string;
    /** Meta-Description, 120–165 Zeichen. */
    description: string;
  };
}
