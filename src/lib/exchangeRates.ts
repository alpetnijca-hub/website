import type { RateTable } from "@/lib/calculators/exchange";

/**
 * Abruf der Euro-Referenzkurse der Europäischen Zentralbank.
 *
 * Quelle: <https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml>
 * Die EZB stellt die Datei frei zur Verfügung, ohne Anmeldung und ohne
 * Schlüssel. Sie wird an TARGET-Geschäftstagen gegen 16:00 Uhr MEZ
 * aktualisiert und enthält je Währung den Kurs zu einem Euro.
 *
 * Wichtig für die Einordnung auf der Seite: Das sind **Referenzkurse zu
 * Informationszwecken**, keine Handelskurse. Beim Geldwechsel oder bei einer
 * Kartenzahlung im Ausland gelten andere Kurse plus Gebühren.
 *
 * Der Abruf geschieht auf dem Server. Es werden dabei keine Daten des
 * Besuchers übermittelt – die EZB sieht nur den Server, nicht den Nutzer.
 */

const ECB_URL =
  "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

/** Wie lange ein abgerufener Kursstand wiederverwendet wird (in Sekunden). */
export const RATES_REVALIDATE_SECONDS = 60 * 60 * 6;

export interface RateSnapshot {
  /** Tag, für den die Kurse veröffentlicht wurden, im Format JJJJ-MM-TT. */
  date: string;
  rates: RateTable;
}

/**
 * Liest Datum und Kurse aus dem XML der EZB.
 *
 * Die Datei ist flach aufgebaut – ein Datum, darunter je Währung ein
 * Cube-Element. Für diese Struktur reicht ein Ausdruck; eine XML-Bibliothek
 * als zusätzliche Abhängigkeit wäre hier nicht zu rechtfertigen.
 */
export function parseEcbXml(xml: string): RateSnapshot | null {
  const dateMatch = /time=['"](\d{4}-\d{2}-\d{2})['"]/.exec(xml);
  if (!dateMatch) return null;

  const rates: Record<string, number> = {};
  const pattern = /currency=['"]([A-Z]{3})['"]\s+rate=['"]([\d.]+)['"]/g;
  for (const match of xml.matchAll(pattern)) {
    const value = Number(match[2]);
    if (Number.isFinite(value) && value > 0) {
      rates[match[1]] = value;
    }
  }

  if (Object.keys(rates).length === 0) return null;
  return { date: dateMatch[1], rates };
}

/**
 * Holt die aktuellen Referenzkurse. Gibt null zurück, wenn der Abruf
 * fehlschlägt – die Seite zeigt dann einen Hinweis statt veralteter oder
 * erfundener Kurse.
 */
export async function getExchangeRates(): Promise<RateSnapshot | null> {
  try {
    const response = await fetch(ECB_URL, {
      next: { revalidate: RATES_REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    return parseEcbXml(await response.text());
  } catch {
    return null;
  }
}
