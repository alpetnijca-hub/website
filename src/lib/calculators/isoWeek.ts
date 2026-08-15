import { addDays, formatDate, weekdayIndex } from "./dates";

/**
 * Kalenderwochen nach ISO 8601 – der Norm, die im deutschsprachigen Raum gilt
 * (in Deutschland zusätzlich als DIN 1355 bekannt).
 *
 * Zwei Regeln, aus denen sich alles Weitere ergibt:
 *
 *   1. Die Woche beginnt am **Montag**.
 *   2. Die erste Kalenderwoche eines Jahres ist die Woche, die den ersten
 *      **Donnerstag** des Jahres enthält. Gleichbedeutend: die Woche, in der
 *      der 4. Januar liegt.
 *
 * Daraus folgt, dass die ersten Januartage noch zur letzten Woche des
 * Vorjahres gehören können – und die letzten Dezembertage zur KW 1 des
 * Folgejahres. Genau daran scheitern die meisten selbstgebauten Rechner.
 *
 * Achtung: In den USA wird anders gezählt (Woche beginnt sonntags, KW 1 ist
 * die Woche mit dem 1. Januar). Ein amerikanisches Programm liefert deshalb
 * oft eine andere Wochennummer als ein deutscher Kalender.
 */

export interface WeekResult {
  /** Kalenderwoche 1 bis 53. */
  week: number;
  /** Das Jahr, zu dem die Woche gehört – nicht zwingend das Jahr des Datums. */
  weekYear: number;
  /** Montag der Woche als "JJJJ-MM-TT". */
  start: string;
  /** Sonntag der Woche als "JJJJ-MM-TT". */
  end: string;
  /** Tag innerhalb der Woche, 1 = Montag … 7 = Sonntag. */
  dayOfWeek: number;
  /** Der Wochenbeginn liegt in einem anderen Jahr als das Datum selbst. */
  spansYearChange: boolean;
}

/** Der Donnerstag der Woche, in der das Datum liegt. */
function thursdayOfWeek(date: Date): Date {
  return addDays(date, 3 - weekdayIndex(date));
}

export function getIsoWeek(date: Date): WeekResult {
  const thursday = thursdayOfWeek(date);
  const weekYear = thursday.getUTCFullYear();

  // Der 4. Januar liegt immer in der KW 1 – von dort aus wird gezählt.
  const firstThursday = thursdayOfWeek(new Date(Date.UTC(weekYear, 0, 4)));
  const week =
    1 +
    Math.round(
      (thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );

  const monday = addDays(date, -weekdayIndex(date));
  const sunday = addDays(monday, 6);

  return {
    week,
    weekYear,
    start: formatDate(monday),
    end: formatDate(sunday),
    dayOfWeek: weekdayIndex(date) + 1,
    spansYearChange: monday.getUTCFullYear() !== sunday.getUTCFullYear(),
  };
}

/** Zahl der Kalenderwochen eines Jahres: 52 oder 53. */
export function weeksInYear(year: number): number {
  // Der 28. Dezember liegt immer in der letzten Kalenderwoche des Jahres.
  return getIsoWeek(new Date(Date.UTC(year, 11, 28))).week;
}

export interface WeekRange {
  week: number;
  year: number;
  start: string;
  end: string;
  /** Die sieben Tage der Woche mit Wochentagsnamen. */
  days: { date: string; weekday: string }[];
}

/** Umgekehrter Weg: Zu welchem Zeitraum gehört KW x im Jahr y? */
export function getWeekRange(week: number, year: number): WeekRange | null {
  if (!Number.isInteger(week) || !Number.isInteger(year)) return null;
  if (year < 1 || year > 9999) return null;
  if (week < 1 || week > weeksInYear(year)) return null;

  const fourthJanuary = new Date(Date.UTC(year, 0, 4));
  const firstMonday = addDays(fourthJanuary, -weekdayIndex(fourthJanuary));
  const monday = addDays(firstMonday, (week - 1) * 7);

  const days = Array.from({ length: 7 }, (_, index) => {
    const day = addDays(monday, index);
    return {
      date: formatDate(day),
      weekday: new Intl.DateTimeFormat("de-DE", {
        weekday: "long",
        timeZone: "UTC",
      }).format(day),
    };
  });

  return {
    week,
    year,
    start: formatDate(monday),
    end: formatDate(addDays(monday, 6)),
    days,
  };
}
