/**
 * Zentrale Seiten-Konfiguration.
 *
 * Der Name der Website steht ausschliesslich hier. Wird er geändert,
 * ändert sich automatisch Header, Footer, Meta-Titles, Open Graph,
 * strukturierte Daten und alle Rechtstexte-Platzhalter.
 */

export const site = {
  /** Markenname. Zum Umbenennen nur diesen Wert ändern. */
  name: "RechnerPilot",
  /** Kurzer Claim für Hero und Open Graph. */
  tagline: "Kostenlose Rechner für Fitness, Ernährung und Alltag",
  /**
   * Beschreibung der Website (Startseite, Fallback-Meta-Description).
   */
  description:
    "Kostenlose, werbefinanzierte Online-Rechner für Kalorienbedarf, BMI, Makronährstoffe und mehr. Alle Berechnungen laufen direkt im Browser – ohne Anmeldung.",
  /**
   * Produktions-URL ohne abschliessenden Schrägstrich.
   * Auf Vercel als NEXT_PUBLIC_SITE_URL setzen, sonst greift der lokale Fallback.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  locale: "de-DE",
  /** Sprachattribut des <html>-Elements. */
  lang: "de",
  /** Kontaktadresse für Impressum, Datenschutz und Kontaktseite. */
  contactEmail: "alvinramdedovic@gmail.com",
  /** Telegram-Benutzername für den Kontakt – ohne @. */
  telegram: "Bullishmind2",

  /**
   * Angaben für Impressum und Datenschutzerklärung.
   * Diese Werte erscheinen als verantwortliche Stelle – sie müssen korrekt
   * und aktuell sein.
   */
  operator: {
    name: "Alvin Ramdedovic",
    street: "Neugasse 4b",
    postalCode: "9242",
    city: "Oberuzwil",
    country: "Schweiz",
    /** In internationaler Schreibweise, damit die Nummer aus dem Ausland wählbar ist. */
    phone: "+41 76 460 99 77",
  },
} as const;

/** Anschrift als mehrzeiliger Text für Impressum und Datenschutz. */
export const operatorAddress = [
  site.operator.name,
  site.operator.street,
  `${site.operator.postalCode} ${site.operator.city}`,
  site.operator.country,
].join("\n");

/**
 * True, sobald ein echter Telegram-Name hinterlegt ist. Ist das Feld leer
 * oder steht dort noch ein Platzhalter, zeigt die Kontaktseite einen Hinweis
 * statt eines Links ins Leere.
 */
export const telegramConfigured =
  site.telegram.length > 0 && !site.telegram.startsWith("dein_");

/** Öffentlicher Telegram-Link. */
export const telegramUrl = `https://t.me/${site.telegram}`;

/** Vollständige URL zu einem internen Pfad, z. B. für Canonical-Tags. */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) return `${site.url}/${path}`;
  return `${site.url}${path === "/" ? "" : path}`;
}
