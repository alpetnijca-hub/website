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
  /**
   * Kontaktadresse. Vor dem Livegang durch eine echte Adresse ersetzen –
   * sie erscheint auf der Kontaktseite und im Impressum-Platzhalter.
   */
  contactEmail: "kontakt@example.com",
  /** Betreiberangabe. Platzhalter bis zum Ausfüllen des Impressums. */
  operator: "[Name des Betreibers]",
} as const;

/** Vollständige URL zu einem internen Pfad, z. B. für Canonical-Tags. */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) return `${site.url}/${path}`;
  return `${site.url}${path === "/" ? "" : path}`;
}
