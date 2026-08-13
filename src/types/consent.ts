/**
 * Einwilligungs-Kategorien.
 *
 * "notwendig" ist technisch erforderlich und nicht abwählbar.
 * Alle übrigen Kategorien sind standardmässig AUS – es gibt keine
 * vorangekreuzten optionalen Kategorien.
 */
export type ConsentCategory =
  | "notwendig"
  | "statistik"
  | "marketing"
  | "personalisierung";

export type ConsentState = Record<ConsentCategory, boolean>;

export interface StoredConsent {
  /** Schema-Version – bei Änderungen erneut abfragen. */
  version: number;
  /** Zeitpunkt der Entscheidung als ISO-String (Nachweisbarkeit). */
  timestamp: string;
  choices: ConsentState;
}

export const CONSENT_VERSION = 1;

export const defaultConsent: ConsentState = {
  notwendig: true,
  statistik: false,
  marketing: false,
  personalisierung: false,
};

export const consentCategoryInfo: Record<
  ConsentCategory,
  { title: string; description: string; required: boolean }
> = {
  notwendig: {
    title: "Notwendig",
    description:
      "Erforderlich für den Betrieb der Website, zum Beispiel um deine Cookie-Entscheidung und die Auswahl zwischen hellem und dunklem Design zu speichern. Diese Kategorie lässt sich nicht abwählen.",
    required: true,
  },
  statistik: {
    title: "Statistik",
    description:
      "Hilft uns zu verstehen, welche Rechner genutzt werden, damit wir die Website verbessern können. Ohne deine Einwilligung wird kein Analyse-Skript geladen.",
    required: false,
  },
  marketing: {
    title: "Marketing",
    description:
      "Erlaubt das Laden von Werbeanzeigen, über die diese Website finanziert wird. Ohne Einwilligung werden keine Werbe-Skripte geladen.",
    required: false,
  },
  personalisierung: {
    title: "Personalisierte Werbung",
    description:
      "Erlaubt es dem Werbeanbieter, Anzeigen auf Basis deines Nutzungsverhaltens auszuwählen. Lehnst du ab, können weiterhin nicht personalisierte Anzeigen erscheinen.",
    required: false,
  },
};
