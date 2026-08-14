import { round, safeDivide } from "./shared";

/**
 * Umrechnung zwischen Stundenlohn, Monatsgehalt und Jahresgehalt.
 *
 * Die entscheidende Grösse ist die Zahl der Arbeitsstunden pro Monat. Sie wird
 * nicht aus den Tagen des jeweiligen Monats berechnet – das ergäbe im Februar
 * einen anderen Stundenlohn als im März –, sondern aus dem Jahresdurchschnitt:
 *
 *   Wochen pro Monat = 52 ÷ 12 ≈ 4,3333
 *   Stunden pro Monat = Wochenstunden × 52 ÷ 12
 *
 * Diese Umrechnung ist die im Arbeitsrecht und in der Lohnabrechnung
 * gebräuchliche. Sie führt bei 40 Wochenstunden auf rund 173,33 Monatsstunden.
 */

export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;

export type WageMode = "gehalt-zu-stundenlohn" | "stundenlohn-zu-gehalt";

export interface WageResult {
  hourlyWage: number;
  dailyWage: number;
  weeklyWage: number;
  monthlySalary: number;
  annualSalary: number;
  /** Durchschnittliche Arbeitsstunden pro Monat. */
  hoursPerMonth: number;
  hoursPerYear: number;
  /** Anteil der Zahlung, der auf Sonderzahlungen entfällt (z. B. 13. Gehalt). */
  extraPayments: number;
}

export interface WageInput {
  mode: WageMode;
  /** Monatsgehalt in Euro – nur im Modus "gehalt-zu-stundenlohn". */
  monthlySalary?: number;
  /** Stundenlohn in Euro – nur im Modus "stundenlohn-zu-gehalt". */
  hourlyWage?: number;
  /** Vertragliche Wochenarbeitszeit in Stunden. */
  hoursPerWeek: number;
  /** Arbeitstage pro Woche, für den Tagesverdienst. */
  daysPerWeek?: number;
  /**
   * Zahl der Monatsgehälter pro Jahr. 12 ohne Sonderzahlung, 13 mit
   * Weihnachtsgeld, 14 mit Weihnachts- und Urlaubsgeld.
   */
  salariesPerYear?: number;
}

export function calculateWage(input: WageInput): WageResult | null {
  const {
    mode,
    hoursPerWeek,
    daysPerWeek = 5,
    salariesPerYear = 12,
  } = input;

  if (hoursPerWeek <= 0 || hoursPerWeek > 80) return null;
  if (daysPerWeek <= 0 || daysPerWeek > 7) return null;
  if (salariesPerYear < 12 || salariesPerYear > 14) return null;

  const hoursPerMonth = (hoursPerWeek * WEEKS_PER_YEAR) / MONTHS_PER_YEAR;
  const hoursPerYear = hoursPerWeek * WEEKS_PER_YEAR;

  let monthlySalary: number;
  let hourlyWage: number;

  if (mode === "gehalt-zu-stundenlohn") {
    if (input.monthlySalary === undefined || input.monthlySalary < 0) return null;
    monthlySalary = input.monthlySalary;
    // Sonderzahlungen erhöhen den effektiven Stundenlohn, ohne dass mehr
    // gearbeitet wird: Das gesamte Jahresgehalt wird auf die Jahresstunden
    // verteilt.
    const annual = monthlySalary * salariesPerYear;
    const perHour = safeDivide(annual, hoursPerYear);
    if (perHour === null) return null;
    hourlyWage = perHour;
  } else {
    if (input.hourlyWage === undefined || input.hourlyWage < 0) return null;
    hourlyWage = input.hourlyWage;
    // Umgekehrt: Der Stundenlohn gilt für die geleisteten Stunden, das
    // Jahresgehalt ergibt sich daraus und verteilt sich auf die
    // vereinbarte Zahl von Monatsgehältern.
    const annual = hourlyWage * hoursPerYear;
    const perMonth = safeDivide(annual, salariesPerYear);
    if (perMonth === null) return null;
    monthlySalary = perMonth;
  }

  const annualSalary = monthlySalary * salariesPerYear;
  const hoursPerDay = hoursPerWeek / daysPerWeek;

  return {
    hourlyWage: round(hourlyWage, 2),
    dailyWage: round(hourlyWage * hoursPerDay, 2),
    weeklyWage: round(hourlyWage * hoursPerWeek, 2),
    monthlySalary: round(monthlySalary, 2),
    annualSalary: round(annualSalary, 2),
    hoursPerMonth: round(hoursPerMonth, 2),
    hoursPerYear: round(hoursPerYear, 2),
    extraPayments: round(monthlySalary * (salariesPerYear - 12), 2),
  };
}
