import {
  activityFactors,
  round,
  type ActivityLevel,
  type Goal,
  type Sex,
} from "./shared";

/**
 * Kalorienbedarf nach Mifflin-St Jeor.
 *
 * Grundumsatz (BMR, kcal/Tag):
 *   Männer:  10 × kg + 6,25 × cm − 5 × Alter + 5
 *   Frauen:  10 × kg + 6,25 × cm − 5 × Alter − 161
 *
 * Quelle: Mifflin MD, St Jeor ST et al. (1990), Am J Clin Nutr 51(2), 241–247.
 *
 * Der Gesamtumsatz (TDEE) ergibt sich aus dem Grundumsatz multipliziert mit
 * dem Aktivitätsfaktor (PAL).
 */

export interface TdeeInput {
  sex: Sex;
  /** Alter in Jahren. */
  age: number;
  /** Körpergewicht in Kilogramm. */
  weightKg: number;
  /** Körpergrösse in Zentimetern. */
  heightCm: number;
  activity: ActivityLevel;
  goal: Goal;
}

export interface TdeeResult {
  /** Grundumsatz in kcal pro Tag. */
  bmr: number;
  /** Gesamtumsatz in kcal pro Tag (Grundumsatz × Aktivitätsfaktor). */
  tdee: number;
  /** Verwendeter Aktivitätsfaktor. */
  activityFactor: number;
  /** Empfohlene Zufuhr für das gewählte Ziel in kcal pro Tag. */
  targetCalories: number;
  /** Abweichung vom Gesamtumsatz in kcal (negativ = Defizit). */
  goalAdjustment: number;
  /**
   * True, wenn die Zielzufuhr unter der Untergrenze liegt und deshalb
   * angehoben wurde. Die Oberfläche weist dann darauf hin.
   */
  adjustedToMinimum: boolean;
}

/**
 * Anpassung für das jeweilige Ziel.
 *
 * Bewusst moderat gewählt: 500 kcal Defizit entsprechen rechnerisch etwa
 * 0,45 kg Gewichtsverlust pro Woche, ein Überschuss von 300 kcal einem
 * langsamen Aufbau. Grössere Werte erhöhen vor allem den Verlust an
 * Muskelmasse beziehungsweise den Fettaufbau.
 */
export const GOAL_ADJUSTMENT: Record<Goal, number> = {
  abnehmen: -500,
  halten: 0,
  zunehmen: 300,
};

/**
 * Untergrenze der empfohlenen Tageszufuhr.
 *
 * Unterhalb dieser Werte ist eine ausreichende Versorgung mit Nährstoffen
 * ohne fachliche Begleitung kaum möglich. Der Rechner senkt die Empfehlung
 * deshalb nicht weiter ab, sondern weist darauf hin.
 */
export const MINIMUM_CALORIES: Record<Sex, number> = {
  weiblich: 1200,
  maennlich: 1500,
};

/** Grundumsatz nach Mifflin-St Jeor in kcal pro Tag. */
export function calculateBmr(input: {
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
}): number {
  const base =
    10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  const offset = input.sex === "maennlich" ? 5 : -161;
  // Der Grundumsatz kann rechnerisch nie negativ werden, solange die
  // Eingaben innerhalb der geprüften Grenzen liegen.
  return Math.max(base + offset, 0);
}

export function calculateTdee(input: TdeeInput): TdeeResult {
  const bmr = calculateBmr(input);
  const factor = activityFactors[input.activity].factor;
  const tdee = bmr * factor;

  const adjustment = GOAL_ADJUSTMENT[input.goal];
  const raw = tdee + adjustment;
  const minimum = MINIMUM_CALORIES[input.sex];
  const adjustedToMinimum = raw < minimum;
  const target = adjustedToMinimum ? minimum : raw;

  return {
    bmr: round(bmr),
    tdee: round(tdee),
    activityFactor: factor,
    targetCalories: round(target),
    goalAdjustment: round(target - tdee),
    adjustedToMinimum,
  };
}
