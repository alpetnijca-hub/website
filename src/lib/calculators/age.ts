import {
  addMonths,
  daysBetween,
  formatDate,
  weekdayName,
  MS_PER_DAY,
} from "./dates";

/**
 * Alter aus Geburtsdatum und Stichtag.
 *
 * Das Alter wird so gezählt, wie es im Alltag und im Recht gilt: Man ist so
 * viele Jahre alt, wie man volle Jahre gelebt hat. Am Tag vor dem Geburtstag
 * ist man noch ein Jahr jünger, am Geburtstag selbst wird das nächste Jahr
 * vollendet.
 *
 * Gerechnet wird deshalb über Kalendermonate und nicht über eine Division
 * durch 365,25 – die läge bei Geburtstagen am Monatsende und in Schaltjahren
 * um bis zu einem Tag daneben.
 */

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  /** Gesamtzahl gelebter Tage. */
  totalDays: number;
  totalWeeks: number;
  /** Gerundete Gesamtmonate. */
  totalMonths: number;
  totalHours: number;
  /** Wochentag, an dem die Person geboren wurde. */
  birthWeekday: string;
  /** Datum des nächsten Geburtstags als "JJJJ-MM-TT". */
  nextBirthday: string;
  nextBirthdayWeekday: string;
  daysUntilBirthday: number;
  /** Der Stichtag ist der Geburtstag. */
  isBirthday: boolean;
  /** Alter, das an diesem nächsten Geburtstag erreicht wird. */
  turningAge: number;
}

export function calculateAge(birth: Date, reference: Date): AgeResult | null {
  if (reference < birth) return null;

  // Volle Jahre und Monate schrittweise bestimmen.
  let years = 0;
  while (addMonths(birth, (years + 1) * 12) <= reference) years += 1;
  let months = 0;
  while (addMonths(birth, years * 12 + months + 1) <= reference) months += 1;
  const afterMonths = addMonths(birth, years * 12 + months);
  const days = daysBetween(afterMonths, reference);

  const totalDays = daysBetween(birth, reference);

  // Nächster Geburtstag: der Jahrestag im laufenden oder im nächsten Jahr.
  const thisYearBirthday = addMonths(birth, years * 12);
  const isBirthday = daysBetween(thisYearBirthday, reference) === 0;
  const nextBirthday = isBirthday
    ? thisYearBirthday
    : addMonths(birth, (years + 1) * 12);

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths: years * 12 + months,
    totalHours: totalDays * 24,
    birthWeekday: weekdayName(birth),
    nextBirthday: formatDate(nextBirthday),
    nextBirthdayWeekday: weekdayName(nextBirthday),
    daysUntilBirthday: Math.round(
      (nextBirthday.getTime() - reference.getTime()) / MS_PER_DAY,
    ),
    isBirthday,
    turningAge: isBirthday ? years : years + 1,
  };
}
