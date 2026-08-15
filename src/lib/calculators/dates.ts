/**
 * Gemeinsame Datumsgrundlagen für alle Rechner, die mit Kalendertagen
 * arbeiten.
 *
 * **Alles rechnet in UTC.** Der Grund ist die Sommerzeit: Wer die Tage
 * zwischen zwei Daten über Millisekunden in Ortszeit berechnet, bekommt an
 * den Umstellungswochenenden 23 oder 25 Stunden pro Tag und damit falsche
 * Ergebnisse. In UTC hat jeder Tag exakt 24 Stunden – für Kalenderrechnungen
 * ist das die richtige Grundlage.
 *
 * Ein Datum wird durchgehend als Zeichenkette "JJJJ-MM-TT" übergeben, weil
 * genau das ein `<input type="date">` liefert.
 */

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface DateParts {
  year: number;
  /** 1 bis 12. */
  month: number;
  /** 1 bis 31. */
  day: number;
}

/**
 * Wandelt "JJJJ-MM-TT" in einen UTC-Zeitpunkt um.
 *
 * Gibt null zurück, wenn das Datum nicht existiert. Die Prüfung ist nötig,
 * weil `Date.UTC` aus dem 31. Februar klaglos den 3. März macht – ein
 * Tippfehler würde sonst zu einem plausibel aussehenden, falschen Ergebnis
 * führen.
 */
export function parseDate(raw: string): Date | null {
  const match = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(raw);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1 || year > 9999) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

/** Umgekehrter Weg: UTC-Zeitpunkt als "JJJJ-MM-TT". */
export function formatDate(date: Date): string {
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Datum in deutscher Schreibweise, z. B. "Freitag, 14. August 2026". */
export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Wochentag als Name, z. B. "Freitag". */
export function weekdayName(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    timeZone: "UTC",
  }).format(date);
}

/** Ganze Tage zwischen zwei Daten; negativ, wenn das Ende früher liegt. */
export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/**
 * Addiert Monate und begrenzt den Tag auf das Monatsende.
 *
 * Ein Monat nach dem 31. Januar ist der 28. Februar (oder der 29. im
 * Schaltjahr) und nicht der 3. März. Ohne diese Begrenzung würde die
 * Altersberechnung an Monatsenden danebenliegen.
 */
export function addMonths(date: Date, months: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + months;
  const day = date.getUTCDate();
  const lastDay = daysInMonth(
    year + Math.floor(month / 12),
    ((month % 12) + 12) % 12,
  );
  return new Date(
    Date.UTC(
      year + Math.floor(month / 12),
      ((month % 12) + 12) % 12,
      Math.min(day, lastDay),
    ),
  );
}

/** Zahl der Tage eines Monats; `month` ist nullbasiert wie in Date. */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Wochentag mit Montag = 0 … Sonntag = 6.
 * Die deutsche Woche beginnt am Montag, `getUTCDay()` liefert aber Sonntag = 0.
 */
export function weekdayIndex(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

/** Samstag oder Sonntag. */
export function isWeekend(date: Date): boolean {
  return weekdayIndex(date) >= 5;
}

/**
 * Werktage (Montag bis Freitag) zwischen zwei Daten, Startdatum ausgenommen,
 * Enddatum eingeschlossen – also die Zahl der Arbeitstage in der Spanne.
 *
 * Feiertage bleiben unberücksichtigt: Sie unterscheiden sich je nach Land und
 * Bundesland und müssten jährlich gepflegt werden. Das steht auch so auf der
 * Seite.
 */
export function workdaysBetween(from: Date, to: Date): number {
  const start = from < to ? from : to;
  const end = from < to ? to : from;
  const total = daysBetween(start, end);

  const fullWeeks = Math.floor(total / 7);
  let workdays = fullWeeks * 5;

  // Restliche Tage einzeln prüfen – höchstens sechs Durchläufe.
  const rest = total - fullWeeks * 7;
  for (let i = 1; i <= rest; i += 1) {
    if (!isWeekend(addDays(start, fullWeeks * 7 + i))) workdays += 1;
  }
  return workdays;
}
