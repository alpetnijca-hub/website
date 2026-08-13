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

  // === Mathematik ===
  {
    id: "prozent",
    name: "Prozentrechner",
    category: "mathematik",
    href: "/mathematik/prozentrechner",
    description:
      "Prozentwert, Prozentsatz, Grundwert und prozentuale Veränderung – alle vier Varianten in einem Rechner.",
    icon: "calculator",
    related: ["dreisatz", "mehrwertsteuer", "zinseszins"],
    keywords: [
      "prozent",
      "prozentrechnung",
      "prozentsatz",
      "prozentwert",
      "prozentuale veränderung",
      "rabatt",
    ],
    status: "aktiv",
    seo: {
      title: "Prozentrechner – Prozente online berechnen",
      description:
        "Prozentwert, Prozentsatz, Grundwert und prozentuale Veränderung berechnen. Mit ausgeschriebenem Rechenweg und Beispielen aus dem Alltag.",
    },
  },
  {
    id: "dreisatz",
    name: "Dreisatz-Rechner",
    category: "mathematik",
    href: "/mathematik/dreisatz-rechner",
    description:
      "Proportionale und umgekehrt proportionale Zuordnungen lösen – mit vollständigem Rechenweg.",
    icon: "calculator",
    related: ["prozent", "mehrwertsteuer"],
    keywords: ["dreisatz", "proportional", "verhältnis", "umgekehrter dreisatz"],
    status: "geplant",
    seo: {
      title: "Dreisatz-Rechner",
      description: "Dreisatz online lösen. In Vorbereitung.",
    },
  },

  // === Finanzen ===
  {
    id: "zinseszins",
    name: "Zinseszinsrechner",
    category: "finanzen",
    href: "/finanzen/zinseszinsrechner",
    description:
      "Startkapital und Sparrate über die Jahre entwickeln – mit Aufteilung in Einzahlungen und Zinsertrag.",
    icon: "chart",
    related: ["kredit", "prozent", "sparplan"],
    keywords: [
      "zinseszins",
      "zinsrechner",
      "sparrechner",
      "sparplan",
      "kapitalentwicklung",
      "etf sparplan",
    ],
    status: "aktiv",
    seo: {
      title: "Zinseszinsrechner – Sparplan und Kapitalentwicklung",
      description:
        "Zinseszins für Einmalanlage und Sparplan berechnen: Endkapital, eingezahlte Summe und Zinsertrag je Jahr. Formel und Grenzen werden erklärt.",
    },
  },
  {
    id: "kredit",
    name: "Kreditrechner",
    category: "finanzen",
    href: "/finanzen/kreditrechner",
    description:
      "Monatliche Rate, Zinsanteil und Restschuld eines Annuitätendarlehens – inklusive Tilgungsverlauf.",
    icon: "wallet",
    related: ["zinseszins", "prozent"],
    keywords: [
      "kreditrechner",
      "darlehensrechner",
      "annuitätendarlehen",
      "tilgungsrechner",
      "ratenrechner",
      "baufinanzierung",
    ],
    status: "aktiv",
    seo: {
      title: "Kreditrechner – Rate, Zinsen und Restschuld berechnen",
      description:
        "Annuitätendarlehen berechnen: monatliche Rate aus Zins und Tilgung, Zinsanteil, Restschuld nach der Zinsbindung und Gesamtlaufzeit.",
    },
  },
  {
    id: "sparplan",
    name: "ETF-Sparplan-Rechner",
    category: "finanzen",
    href: "/finanzen/etf-sparplan-rechner",
    description:
      "Sparplan mit Kosten und unterschiedlichen Renditeszenarien durchrechnen.",
    icon: "chart",
    related: ["zinseszins"],
    keywords: ["etf sparplan", "sparplanrechner", "vermögensaufbau"],
    status: "geplant",
    seo: {
      title: "ETF-Sparplan-Rechner",
      description: "Sparplan mit Renditeszenarien berechnen. In Vorbereitung.",
    },
  },
  {
    id: "inflation",
    name: "Inflationsrechner",
    category: "finanzen",
    href: "/finanzen/inflationsrechner",
    description:
      "Kaufkraftverlust über die Jahre und die nötige Rendite zum Werterhalt.",
    icon: "trend-down",
    related: ["zinseszins"],
    keywords: ["inflation", "kaufkraft", "kaufkraftverlust", "geldentwertung"],
    status: "geplant",
    seo: {
      title: "Inflationsrechner",
      description: "Kaufkraftverlust berechnen. In Vorbereitung.",
    },
  },

  // === Alltag ===
  {
    id: "spritkosten",
    name: "Spritkosten-Rechner",
    category: "alltag",
    href: "/alltag/spritkosten-rechner",
    description:
      "Kosten einer Fahrt aus Strecke, Verbrauch und Preis – auch für Elektroautos und geteilt auf mehrere Personen.",
    icon: "activity",
    related: ["stromkosten", "mehrwertsteuer", "prozent"],
    keywords: [
      "spritkosten",
      "benzinkosten",
      "fahrtkosten",
      "kraftstoffkosten",
      "benzinverbrauch",
      "spritrechner",
    ],
    status: "aktiv",
    seo: {
      title: "Spritkosten-Rechner – Kosten einer Fahrt berechnen",
      description:
        "Spritkosten für eine Strecke berechnen: Verbrauch, Preis je Liter oder kWh, Kosten je Person und je Kilometer. Auch für Elektroautos.",
    },
  },
  {
    id: "stromkosten",
    name: "Stromkosten-Rechner",
    category: "alltag",
    href: "/alltag/stromkosten-rechner",
    description:
      "Was ein Gerät pro Tag, Monat und Jahr an Strom kostet – aus Watt, Laufzeit und Strompreis.",
    icon: "activity",
    related: ["spritkosten", "mehrwertsteuer", "prozent"],
    keywords: [
      "stromkosten",
      "stromverbrauch",
      "kwh berechnen",
      "watt in kwh",
      "energiekosten",
    ],
    status: "aktiv",
    seo: {
      title: "Stromkosten-Rechner – Verbrauch in Euro umrechnen",
      description:
        "Stromkosten eines Geräts berechnen: aus Watt, Betriebsdauer und Preis je Kilowattstunde die Kosten pro Tag, Monat und Jahr.",
    },
  },
  {
    id: "mehrwertsteuer",
    name: "Mehrwertsteuer-Rechner",
    category: "alltag",
    href: "/alltag/mehrwertsteuer-rechner",
    description:
      "Mehrwertsteuer hinzurechnen oder herausrechnen – mit frei wählbarem Steuersatz.",
    icon: "calculator",
    related: ["prozent", "stromkosten", "spritkosten"],
    keywords: [
      "mehrwertsteuer",
      "umsatzsteuer",
      "mwst",
      "netto brutto",
      "steuer herausrechnen",
      "19 prozent",
    ],
    status: "aktiv",
    seo: {
      title: "Mehrwertsteuer-Rechner – netto und brutto umrechnen",
      description:
        "Mehrwertsteuer aufschlagen oder herausrechnen. Steuersatz frei wählbar, mit Schnellauswahl für Deutschland, Österreich und die Schweiz.",
    },
  },
  {
    id: "rabatt",
    name: "Rabattrechner",
    category: "alltag",
    href: "/alltag/rabattrechner",
    description: "Endpreis nach Rabatt und die tatsächliche Ersparnis.",
    icon: "calculator",
    related: ["prozent", "mehrwertsteuer"],
    keywords: ["rabatt", "preisnachlass", "sale", "prozent abziehen"],
    status: "geplant",
    seo: {
      title: "Rabattrechner",
      description: "Rabatt und Ersparnis berechnen. In Vorbereitung.",
    },
  },
  {
    id: "datumsrechner",
    name: "Datumsrechner",
    category: "alltag",
    href: "/alltag/datumsrechner",
    description: "Tage zwischen zwei Daten und Datum plus oder minus X Tage.",
    icon: "calculator",
    related: [],
    keywords: ["datumsrechner", "tage berechnen", "zeitspanne", "tagezähler"],
    status: "geplant",
    seo: {
      title: "Datumsrechner",
      description: "Tage zwischen zwei Daten berechnen. In Vorbereitung.",
    },
  },
  {
    id: "altersrechner",
    name: "Altersrechner",
    category: "alltag",
    href: "/alltag/altersrechner",
    description: "Alter auf Jahre, Monate und Tage genau aus dem Geburtsdatum.",
    icon: "calculator",
    related: [],
    keywords: ["altersrechner", "alter berechnen", "geburtstag"],
    status: "geplant",
    seo: {
      title: "Altersrechner",
      description: "Alter genau berechnen. In Vorbereitung.",
    },
  },
  {
    id: "kalenderwoche",
    name: "Kalenderwochen-Rechner",
    category: "alltag",
    href: "/alltag/kalenderwochen-rechner",
    description: "Kalenderwoche zu einem Datum und umgekehrt, nach ISO 8601.",
    icon: "calculator",
    related: [],
    keywords: ["kalenderwoche", "kw berechnen", "iso 8601"],
    status: "geplant",
    seo: {
      title: "Kalenderwochen-Rechner",
      description: "Kalenderwoche bestimmen. In Vorbereitung.",
    },
  },
  {
    id: "zufallszahl",
    name: "Zufallsgenerator (Zahlen)",
    category: "alltag",
    href: "/alltag/zufallsgenerator",
    description: "Zufallszahlen in einem frei wählbaren Bereich erzeugen.",
    icon: "calculator",
    related: [],
    keywords: ["zufallsgenerator", "zufallszahl", "losentscheid"],
    status: "geplant",
    seo: {
      title: "Zufallsgenerator",
      description: "Zufallszahlen erzeugen. In Vorbereitung.",
    },
  },

  // === Arbeit & Gehalt ===
  {
    id: "stundenlohn",
    name: "Stundenlohnrechner",
    category: "arbeit",
    href: "/arbeit/stundenlohnrechner",
    description:
      "Stundenlohn aus Monatsgehalt und Wochenarbeitszeit – und umgekehrt.",
    icon: "briefcase",
    related: ["arbeitszeit", "prozent"],
    keywords: ["stundenlohn", "stundensatz", "monatsgehalt", "jahresgehalt"],
    status: "geplant",
    seo: {
      title: "Stundenlohnrechner",
      description: "Stundenlohn aus dem Gehalt berechnen. In Vorbereitung.",
    },
  },
  {
    id: "arbeitszeit",
    name: "Arbeitszeit-Rechner",
    category: "arbeit",
    href: "/arbeit/arbeitszeit-rechner",
    description:
      "Tägliche Arbeitszeit mit gesetzlichen Pausenzeiten korrekt erfassen.",
    icon: "briefcase",
    related: ["stundenlohn"],
    keywords: ["arbeitszeit", "pausenzeiten", "gleitzeit", "stundenrechner"],
    status: "geplant",
    seo: {
      title: "Arbeitszeit-Rechner",
      description: "Arbeitszeit mit Pausen berechnen. In Vorbereitung.",
    },
  },
  {
    id: "brutto-netto",
    name: "Brutto-Netto-Rechner",
    category: "arbeit",
    href: "/arbeit/brutto-netto-rechner",
    description:
      "Nettogehalt aus dem Bruttolohn. Braucht jährlich gepflegte Steuertabellen und Beitragssätze – deshalb noch in Vorbereitung.",
    icon: "briefcase",
    related: ["stundenlohn"],
    keywords: ["brutto netto", "nettogehalt", "lohnrechner", "gehaltsrechner"],
    status: "geplant",
    seo: {
      title: "Brutto-Netto-Rechner",
      description: "Nettogehalt berechnen. In Vorbereitung.",
    },
  },

  // === Währungen und Krypto ===
  {
    id: "waehrungsrechner",
    name: "Währungsrechner",
    category: "waehrungen",
    href: "/waehrungen/waehrungsrechner",
    description:
      "Währungen mit tagesaktuellen Kursen umrechnen. Wartet auf die Anbindung eines seriösen Kursanbieters.",
    icon: "coins",
    related: [],
    keywords: ["währungsrechner", "euro dollar", "wechselkurs", "devisen"],
    status: "geplant",
    seo: {
      title: "Währungsrechner",
      description: "Währungen umrechnen. In Vorbereitung.",
    },
  },
  {
    id: "kryptorechner",
    name: "Krypto-Umrechner",
    category: "krypto",
    href: "/krypto/krypto-umrechner",
    description:
      "Kryptowährungen in Euro umrechnen. Wartet auf die Anbindung eines Kursanbieters.",
    icon: "chart",
    related: [],
    keywords: ["bitcoin rechner", "krypto umrechner", "eth euro"],
    status: "geplant",
    seo: {
      title: "Krypto-Umrechner",
      description: "Kryptowährungen umrechnen. In Vorbereitung.",
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
