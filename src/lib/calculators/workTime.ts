import { round } from "./shared";

/**
 * Tägliche Arbeitszeit aus Kommen, Gehen und Pausen.
 *
 *   Anwesenheit = Gehen − Kommen
 *   Arbeitszeit = Anwesenheit − Pausen
 *
 * Zusätzlich prüft der Rechner die Pausenvorgaben des deutschen
 * Arbeitszeitgesetzes (ArbZG):
 *
 *   § 4 ArbZG – Ruhepausen
 *     mehr als  6 Stunden Arbeitszeit → mindestens 30 Minuten
 *     mehr als  9 Stunden Arbeitszeit → mindestens 45 Minuten
 *     Pausen dürfen aufgeteilt werden, jeder Teil muss mindestens
 *     15 Minuten dauern.
 *
 *   § 3 ArbZG – Höchstarbeitszeit
 *     werktäglich 8 Stunden, verlängerbar auf bis zu 10 Stunden, wenn im
 *     Ausgleichszeitraum im Schnitt 8 Stunden nicht überschritten werden.
 *
 * Der Rechner bildet die Grundregel ab, nicht die Ausnahmen: Tarifverträge,
 * Betriebsvereinbarungen und Sonderregelungen für einzelne Branchen können
 * abweichen. In der Schweiz und in Österreich gelten eigene Vorschriften.
 */

export const MINUTES_PER_DAY = 24 * 60;

/** Mindestpausen nach § 4 ArbZG, bezogen auf die reine Arbeitszeit. */
export const BREAK_RULES = [
  { fromMinutes: 9 * 60, breakMinutes: 45 },
  { fromMinutes: 6 * 60, breakMinutes: 30 },
] as const;

/** Kleinster zulässiger Teil einer aufgeteilten Pause, § 4 Satz 2 ArbZG. */
export const MIN_BREAK_PART = 15;

/** Höchstarbeitszeit nach § 3 ArbZG. */
export const REGULAR_MAX_MINUTES = 8 * 60;
export const ABSOLUTE_MAX_MINUTES = 10 * 60;

/**
 * Wandelt eine Uhrzeit im Format "HH:MM" in Minuten seit Mitternacht um.
 * Gibt null zurück, wenn die Eingabe keine gültige Uhrzeit ist.
 */
export function parseTime(raw: string): number | null {
  const match = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(raw);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Minuten seit Mitternacht als "HH:MM". Werte über 24 h werden umgebrochen. */
export function formatTime(minutes: number): string {
  const normalised = ((Math.round(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) %
    MINUTES_PER_DAY;
  const hours = Math.floor(normalised / 60);
  const rest = normalised % 60;
  return `${String(hours).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

/** Dauer in Minuten als "7 h 42 min". */
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

/** Mindestpause für eine gegebene Arbeitszeit in Minuten. */
export function requiredBreak(workMinutes: number): number {
  for (const rule of BREAK_RULES) {
    if (workMinutes > rule.fromMinutes) return rule.breakMinutes;
  }
  return 0;
}

export interface WorkTimeResult {
  /** Zeit zwischen Kommen und Gehen, in Minuten. */
  presenceMinutes: number;
  /** Anwesenheit abzüglich aller Pausen, in Minuten. */
  workMinutes: number;
  /** Arbeitszeit als Dezimalzahl, wie sie Zeiterfassungssysteme verlangen. */
  workHoursDecimal: number;
  /** Summe aller eingetragenen Pausen. */
  breakMinutes: number;
  /**
   * Summe der Pausen, die nach § 4 Satz 2 ArbZG als Ruhepause zählen –
   * also nur der Teile mit mindestens 15 Minuten.
   */
  countedBreakMinutes: number;
  /** Zahl der eingetragenen Pausen, die kürzer als 15 Minuten sind. */
  shortBreakCount: number;
  /** Vorgeschriebene Mindestpause nach § 4 ArbZG. */
  requiredBreakMinutes: number;
  /** Fehlende Pausenminuten; 0, wenn die Vorgabe erfüllt ist. */
  missingBreakMinutes: number;
  /** Die Schicht geht über Mitternacht hinaus. */
  overnight: boolean;
  /** Abweichung von der Sollarbeitszeit in Minuten; negativ = Minusstunden. */
  balanceMinutes: number;
  /** Uhrzeit, zu der die Sollarbeitszeit erreicht ist (Minuten seit Kommen). */
  targetEndMinutes: number;
  /** Arbeitszeit über 8 Stunden. */
  exceedsRegularMax: boolean;
  /** Arbeitszeit über 10 Stunden – ohne Ausnahmegenehmigung unzulässig. */
  exceedsAbsoluteMax: boolean;
}

export interface WorkTimeInput {
  /** Kommen, in Minuten seit Mitternacht. */
  arrival: number;
  /** Gehen, in Minuten seit Mitternacht. */
  departure: number;
  /**
   * Die einzelnen Pausen in Minuten. Jede Pause steht für sich, weil das
   * Gesetz an die Länge der einzelnen Pause anknüpft und nicht an die Summe.
   */
  breaks: readonly number[];
  /** Sollarbeitszeit des Tages in Stunden. */
  targetHours: number;
}

export function calculateWorkTime(input: WorkTimeInput): WorkTimeResult | null {
  const { arrival, departure, breaks, targetHours } = input;

  if (!Number.isFinite(arrival) || !Number.isFinite(departure)) return null;
  if (arrival < 0 || arrival >= MINUTES_PER_DAY) return null;
  if (departure < 0 || departure >= MINUTES_PER_DAY) return null;
  if (breaks.some((b) => !Number.isFinite(b) || b < 0)) return null;
  if (targetHours < 0 || targetHours > 24) return null;

  const breakMinutes = breaks.reduce((sum, b) => sum + b, 0);
  // Pausen unter 15 Minuten sind keine Ruhepausen im Sinne des Gesetzes.
  // Sie werden von der Arbeitszeit trotzdem abgezogen – man hat ja nicht
  // gearbeitet –, zählen aber nicht auf die Mindestpause an.
  const countedBreakMinutes = breaks
    .filter((b) => b >= MIN_BREAK_PART)
    .reduce((sum, b) => sum + b, 0);
  const shortBreakCount = breaks.filter(
    (b) => b > 0 && b < MIN_BREAK_PART,
  ).length;

  // Liegt das Gehen vor dem Kommen, wird von einer Schicht über Mitternacht
  // ausgegangen – der häufigste Fall bei Nacht- und Schichtarbeit.
  const overnight = departure < arrival;
  const presenceMinutes = overnight
    ? departure + MINUTES_PER_DAY - arrival
    : departure - arrival;

  if (presenceMinutes === 0) return null;
  if (breakMinutes >= presenceMinutes) return null;

  const workMinutes = presenceMinutes - breakMinutes;
  const required = requiredBreak(workMinutes);
  const targetMinutes = targetHours * 60;

  return {
    presenceMinutes,
    workMinutes,
    workHoursDecimal: round(workMinutes / 60, 2),
    breakMinutes,
    countedBreakMinutes,
    shortBreakCount,
    requiredBreakMinutes: required,
    missingBreakMinutes: Math.max(0, required - countedBreakMinutes),
    overnight,
    balanceMinutes: round(workMinutes - targetMinutes),
    // Bis zur Sollzeit fehlt die Differenz; die Pausen liegen dazwischen und
    // verschieben den Feierabend entsprechend nach hinten.
    targetEndMinutes: arrival + targetMinutes + breakMinutes,
    exceedsRegularMax: workMinutes > REGULAR_MAX_MINUTES,
    exceedsAbsoluteMax: workMinutes > ABSOLUTE_MAX_MINUTES,
  };
}
