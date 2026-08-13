import type { CalculatorMeta, CategorySlug } from "@/types/calculator";

/**
 * Rechner-Registry – die einzige Datenquelle für Navigation, Übersichtsseiten,
 * verwandte Rechner, Suche, Sitemap und SEO-Metadaten.
 *
 * Einen neuen Rechner ergänzen:
 *   1. Eintrag hier anlegen (Status "geplant" oder "aktiv")
 *   2. Berechnungsfunktion in src/lib/calculators/ anlegen + Test
 *   3. Seite unter src/app/<kategorie>/<slug>/page.tsx anlegen
 * Sitemap und Navigation aktualisieren sich dann von selbst.
 */
export const calculators: CalculatorMeta[] = [
  {
    id: "kalorienbedarf",
    name: "Kalorienbedarf-Rechner",
    category: "gesundheit",
    href: "/gesundheit/kalorienbedarf-rechner",
    description:
      "Berechne deinen Grundumsatz und deinen Gesamtumsatz nach der Mifflin-St-Jeor-Formel – inklusive Zuschlag für dein Ziel.",
    icon: "flame",
    related: ["kaloriendefizit", "makronaehrstoffe", "bmi", "kalorienverbrauch"],
    keywords: [
      "kalorienbedarf",
      "grundumsatz",
      "gesamtumsatz",
      "tdee",
      "bmr",
      "kalorien pro tag",
    ],
    status: "aktiv",
    seo: {
      title: "Kalorienbedarf berechnen – Grundumsatz & Gesamtumsatz",
      description:
        "Kalorienbedarf kostenlos berechnen: Grundumsatz und Gesamtumsatz nach Mifflin-St Jeor, mit Aktivitätsfaktor und Zielanpassung. Formel transparent erklärt.",
    },
  },
  {
    id: "bmi",
    name: "BMI-Rechner",
    category: "gesundheit",
    href: "/gesundheit/bmi-rechner",
    description:
      "Body-Mass-Index aus Gewicht und Körpergrösse berechnen und die WHO-Kategorie einordnen.",
    icon: "scale",
    related: ["idealgewicht", "kalorienbedarf", "kaloriendefizit"],
    keywords: ["bmi", "body mass index", "körpermasseindex", "übergewicht"],
    status: "aktiv",
    seo: {
      title: "BMI-Rechner – Body-Mass-Index berechnen",
      description:
        "BMI schnell berechnen und nach WHO-Klassifikation einordnen. Mit Erklärung der Formel und den bekannten Grenzen des Body-Mass-Index.",
    },
  },
  {
    id: "idealgewicht",
    name: "Idealgewicht-Rechner",
    category: "gesundheit",
    href: "/gesundheit/idealgewicht-rechner",
    description:
      "Mehrere etablierte Formeln im Vergleich – als grobe Orientierung, nicht als Zielvorgabe.",
    icon: "target",
    related: ["bmi", "kalorienbedarf", "kaloriendefizit"],
    keywords: ["idealgewicht", "normalgewicht", "broca", "devine", "wunschgewicht"],
    status: "aktiv",
    seo: {
      title: "Idealgewicht berechnen – 5 Formeln im Vergleich",
      description:
        "Idealgewicht nach Broca, Devine, Robinson, Miller und Hamwi vergleichen – plus BMI-Normalgewichtsspanne. Einordnung und Grenzen der Formeln.",
    },
  },
  {
    id: "kaloriendefizit",
    name: "Kaloriendefizit-Rechner",
    category: "gesundheit",
    href: "/gesundheit/kaloriendefizit-rechner",
    description:
      "Aus Kalorienbedarf und gewünschtem Defizit die geschätzte Gewichtsveränderung pro Woche ableiten.",
    icon: "trend-down",
    related: ["kalorienbedarf", "makronaehrstoffe", "protein", "bmi"],
    keywords: [
      "kaloriendefizit",
      "abnehmen",
      "defizit berechnen",
      "gewichtsverlust pro woche",
    ],
    status: "aktiv",
    seo: {
      title: "Kaloriendefizit-Rechner – Abnehmtempo realistisch schätzen",
      description:
        "Kaloriendefizit berechnen und die geschätzte Gewichtsabnahme pro Woche sehen. Mit Warnung vor zu niedriger Kalorienzufuhr und Erklärung der Annahmen.",
    },
  },
  {
    id: "protein",
    name: "Proteinbedarf-Rechner",
    category: "gesundheit",
    href: "/gesundheit/proteinbedarf-rechner",
    description:
      "Empfohlene Eiweisszufuhr als Spanne in Gramm pro Tag – abhängig von Gewicht, Training und Ziel.",
    icon: "protein",
    related: ["makronaehrstoffe", "kalorienbedarf", "kaloriendefizit"],
    keywords: ["proteinbedarf", "eiweissbedarf", "protein pro tag", "eiweiss"],
    status: "aktiv",
    seo: {
      title: "Proteinbedarf berechnen – Eiweiss pro Tag in Gramm",
      description:
        "Täglichen Proteinbedarf als sinnvolle Spanne berechnen, abgestimmt auf Körpergewicht, Aktivitätsniveau und Ziel. Mit Quellenangaben zu den Richtwerten.",
    },
  },
  {
    id: "wasserbedarf",
    name: "Wasserbedarf-Rechner",
    category: "gesundheit",
    href: "/gesundheit/wasserbedarf-rechner",
    description:
      "Grobe Orientierung für die tägliche Trinkmenge, inklusive Zuschlag für Training.",
    icon: "droplet",
    related: ["kalorienverbrauch", "kalorienbedarf", "protein"],
    keywords: ["wasserbedarf", "trinkmenge", "wie viel wasser", "flüssigkeitsbedarf"],
    status: "aktiv",
    seo: {
      title: "Wasserbedarf-Rechner – tägliche Trinkmenge abschätzen",
      description:
        "Trinkmenge pro Tag grob abschätzen: Basiswert nach Körpergewicht plus Zuschlag für Sport und Hitze. Bewusst als Orientierung gekennzeichnet.",
    },
  },
  {
    id: "kalorienverbrauch",
    name: "Kalorienverbrauch-Rechner",
    category: "gesundheit",
    href: "/gesundheit/kalorienverbrauch-rechner",
    description:
      "Kalorienverbrauch beim Sport auf Basis der MET-Werte des Compendium of Physical Activities.",
    icon: "activity",
    related: ["kalorienbedarf", "kaloriendefizit", "wasserbedarf"],
    keywords: [
      "kalorienverbrauch",
      "kalorien verbrannt",
      "met",
      "sport kalorien",
      "joggen kalorien",
    ],
    status: "aktiv",
    seo: {
      title: "Kalorienverbrauch berechnen – MET-Werte für 20 Sportarten",
      description:
        "Kalorienverbrauch beim Sport mit MET-Werten berechnen: Gewicht, Sportart und Dauer eingeben. Formel und Genauigkeitsgrenzen werden erklärt.",
    },
  },
  {
    id: "makronaehrstoffe",
    name: "Makronährstoff-Rechner",
    category: "gesundheit",
    href: "/gesundheit/makronaehrstoff-rechner",
    description:
      "Kalorienziel auf Protein, Fett und Kohlenhydrate aufteilen – in Gramm und Prozent.",
    icon: "pie",
    related: ["kalorienbedarf", "protein", "kaloriendefizit"],
    keywords: ["makros", "makronährstoffe", "protein fett kohlenhydrate", "iifym"],
    status: "aktiv",
    seo: {
      title: "Makronährstoff-Rechner – Makros in Gramm berechnen",
      description:
        "Kalorienziel auf Protein, Fett und Kohlenhydrate verteilen. Ergebnis in Gramm und Prozent, mit nachvollziehbarer Herleitung der Verteilung.",
    },
  },

  // --- Geplante Rechner: erscheinen als Vorschau ohne Link ---
  {
    id: "brutto-netto",
    name: "Brutto-Netto-Rechner",
    category: "arbeit",
    href: "/arbeit/brutto-netto-rechner",
    description:
      "Nettogehalt aus dem Bruttolohn abschätzen. Befindet sich in Vorbereitung.",
    icon: "briefcase",
    related: [],
    keywords: ["brutto netto", "nettogehalt", "lohnrechner"],
    status: "geplant",
    seo: {
      title: "Brutto-Netto-Rechner",
      description: "Nettogehalt aus dem Bruttolohn abschätzen. In Vorbereitung.",
    },
  },
  {
    id: "zinsrechner",
    name: "Zinsrechner",
    category: "finanzen",
    href: "/finanzen/zinsrechner",
    description:
      "Zinsen und Zinseszins über einen frei wählbaren Zeitraum berechnen. In Vorbereitung.",
    icon: "wallet",
    related: [],
    keywords: ["zinsen", "zinseszins", "sparrechner"],
    status: "geplant",
    seo: {
      title: "Zinsrechner",
      description: "Zinsen und Zinseszins berechnen. In Vorbereitung.",
    },
  },
  {
    id: "waehrungsrechner",
    name: "Währungsrechner",
    category: "waehrungen",
    href: "/waehrungen/waehrungsrechner",
    description:
      "Währungen mit tagesaktuellen Kursen umrechnen. In Vorbereitung – Kursanbieter noch nicht angebunden.",
    icon: "coins",
    related: [],
    keywords: ["währungsrechner", "euro dollar", "wechselkurs"],
    status: "geplant",
    seo: {
      title: "Währungsrechner",
      description: "Währungen umrechnen. In Vorbereitung.",
    },
  },
  {
    id: "prozentrechner",
    name: "Prozentrechner",
    category: "mathematik",
    href: "/mathematik/prozentrechner",
    description:
      "Prozentwerte, Grundwerte und prozentuale Veränderungen berechnen. In Vorbereitung.",
    icon: "calculator",
    related: [],
    keywords: ["prozent", "prozentrechnung", "prozentsatz"],
    status: "geplant",
    seo: {
      title: "Prozentrechner",
      description: "Prozentrechnung online. In Vorbereitung.",
    },
  },
];

const byId = new Map<string, CalculatorMeta>(calculators.map((c) => [c.id, c]));

export function getCalculator(id: string): CalculatorMeta | undefined {
  return byId.get(id);
}

/** Rechner, die tatsächlich existieren und verlinkt werden dürfen. */
export function activeCalculators(): CalculatorMeta[] {
  return calculators.filter((c) => c.status === "aktiv");
}

export function calculatorsByCategory(category: CategorySlug): CalculatorMeta[] {
  return calculators.filter((c) => c.category === category);
}

/**
 * Verwandte Rechner eines Rechners – geplante werden herausgefiltert,
 * damit keine toten Links entstehen.
 */
export function relatedCalculators(id: string): CalculatorMeta[] {
  const current = byId.get(id);
  if (!current) return [];
  return current.related
    .map((relatedId) => byId.get(relatedId))
    .filter((c): c is CalculatorMeta => c?.status === "aktiv");
}

/**
 * Reihenfolge der "beliebten Rechner" auf der Startseite.
 * Bewusst manuell gepflegt statt aus erfundenen Nutzungszahlen abgeleitet.
 */
export const featuredCalculatorIds = [
  "kalorienbedarf",
  "bmi",
  "makronaehrstoffe",
  "kaloriendefizit",
] as const;

export function featuredCalculators(): CalculatorMeta[] {
  return featuredCalculatorIds
    .map((id) => byId.get(id))
    .filter((c): c is CalculatorMeta => c?.status === "aktiv");
}
