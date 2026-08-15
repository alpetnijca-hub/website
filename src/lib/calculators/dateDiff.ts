import {
  addDays,
  addMonths,
  daysBetween,
  formatDate,
  isWeekend,
  weekdayName,
  workdaysBetween,
} from "./dates";

/**
 * Zwei Rechnungen mit Kalendertagen:
 *
 *   1. Spanne  – wie viele Tage liegen zwischen zwei Daten?
 *   2. Verschiebung – welches Datum ist X Tage vor oder nach einem Datum?
 *
 * Beide sind einfach, haben aber je eine Stelle, an der sich fast alle
 * verrechnen: bei der Spanne die Frage, ob der erste und der letzte Tag
 * mitzählen, und bei der Verschiebung die Sommerzeit (siehe `dates.ts`).
 */

export interface DateSpanResult {
  /** Tage zwischen den Daten, Startdatum nicht mitgezählt. */
  days: number;
  /** Beide Randtage mitgezählt – so zählt man Urlaubstage. */
  daysInclusive: number;
  /** Zahl der Werktage (Mo–Fr) ohne den Starttag. */
  workdays: number;
  weeks: number;
  /** Rest nach vollen Wochen. */
  restDays: number;
  /** Aufteilung in volle Jahre, Monate und Tage. */
  years: number;
  months: number;
  restDaysAfterMonths: number;
  /** Das spätere Datum liegt vor dem früheren. */
  reversed: boolean;
  fromWeekday: string;
  toWeekday: string;
}

export function calculateDateSpan(from: Date, to: Date): DateSpanResult {
  const reversed = to < from;
  const start = reversed ? to : from;
  const end = reversed ? from : to;

  const days = daysBetween(start, end);

  // Jahre und Monate werden schrittweise aufaddiert, statt Tage zu teilen:
  // Monate haben 28 bis 31 Tage, eine Division ergäbe krumme Werte.
  let years = 0;
  while (addMonths(start, (years + 1) * 12) <= end) years += 1;
  let months = 0;
  while (addMonths(start, years * 12 + months + 1) <= end) months += 1;
  const afterMonths = addMonths(start, years * 12 + months);

  return {
    days,
    daysInclusive: days + 1,
    workdays: workdaysBetween(start, end),
    weeks: Math.floor(days / 7),
    restDays: days % 7,
    years,
    months,
    restDaysAfterMonths: daysBetween(afterMonths, end),
    reversed,
    fromWeekday: weekdayName(from),
    toWeekday: weekdayName(to),
  };
}

export type ShiftUnit = "tage" | "wochen" | "monate" | "jahre";
export type ShiftDirection = "plus" | "minus";

export interface DateShiftResult {
  /** Ergebnisdatum als "JJJJ-MM-TT". */
  date: string;
  weekday: string;
  /** Abstand zum Ausgangsdatum in Tagen. */
  days: number;
  isWeekend: boolean;
}

export function shiftDate(input: {
  from: Date;
  amount: number;
  unit: ShiftUnit;
  direction: ShiftDirection;
}): DateShiftResult | null {
  const { from, amount, unit, direction } = input;
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) return null;
  if (amount < 0) return null;

  const sign = direction === "minus" ? -1 : 1;
  const value = amount * sign;

  let result: Date;
  if (unit === "tage") result = addDays(from, value);
  else if (unit === "wochen") result = addDays(from, value * 7);
  else if (unit === "monate") result = addMonths(from, value);
  else result = addMonths(from, value * 12);

  if (Number.isNaN(result.getTime())) return null;
  if (result.getUTCFullYear() < 1 || result.getUTCFullYear() > 9999) return null;

  return {
    date: formatDate(result),
    weekday: weekdayName(result),
    days: daysBetween(from, result),
    isWeekend: isWeekend(result),
  };
}
