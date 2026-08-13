import { round, safeDivide, type Goal } from "./shared";

/**
 * Verteilung eines Kalorienziels auf Protein, Fett und Kohlenhydrate.
 *
 * Vorgehen:
 *  1. Protein wird zuerst festgelegt – entweder je Kilogramm Körpergewicht
 *     (wenn ein Gewicht angegeben ist) oder als Anteil der Gesamtenergie.
 *  2. Fett erhält einen Mindestanteil, da Fett für die Aufnahme fettlöslicher
 *     Vitamine und für den Hormonhaushalt gebraucht wird.
 *  3. Kohlenhydrate füllen den verbleibenden Energiebedarf auf.
 *
 * Die Anteile bleiben innerhalb der Bereiche, die das Institute of Medicine
 * als "Acceptable Macronutrient Distribution Ranges" (AMDR) beschreibt:
 * Protein 10–35 %, Fett 20–35 %, Kohlenhydrate 45–65 % der Gesamtenergie.
 * Bei sehr proteinbetonten Zielen kann der Kohlenhydratanteil rechnerisch
 * darunter liegen; der Rechner weist in diesem Fall darauf hin.
 */

export const KCAL_PER_GRAM = { protein: 4, fat: 9, carbs: 4 } as const;

export interface MacroSplit {
  grams: number;
  kcal: number;
  percent: number;
}

export interface MacroResult {
  calories: number;
  protein: MacroSplit;
  fat: MacroSplit;
  carbs: MacroSplit;
  /** Hinweise zur gewählten Verteilung. */
  notes: string[];
}

/**
 * Zielabhängige Vorgaben.
 * proteinPerKg gilt, wenn ein Körpergewicht angegeben wurde,
 * sonst greift proteinPercent.
 */
const goalProfiles: Record<
  Goal,
  {
    proteinPerKg: number;
    proteinPercent: number;
    fatPercent: number;
    description: string;
  }
> = {
  abnehmen: {
    proteinPerKg: 2.0,
    proteinPercent: 30,
    fatPercent: 27,
    description:
      "In der Diät liegt der Proteinanteil hoch, damit Muskelmasse erhalten bleibt und die Sättigung besser ist.",
  },
  halten: {
    proteinPerKg: 1.6,
    proteinPercent: 22,
    fatPercent: 30,
    description:
      "Eine ausgewogene Verteilung mit moderatem Proteinanteil und ausreichend Kohlenhydraten für den Alltag.",
  },
  zunehmen: {
    proteinPerKg: 1.8,
    proteinPercent: 22,
    fatPercent: 25,
    description:
      "Beim Aufbau liegt der Schwerpunkt auf Kohlenhydraten als Energiequelle für das Training.",
  },
};

/** Untergrenze für Fett in Gramm je Kilogramm Körpergewicht. */
const MIN_FAT_PER_KG = 0.6;

export function calculateMacros(input: {
  /** Tägliches Kalorienziel in kcal. */
  calories: number;
  goal: Goal;
  /** Körpergewicht in kg – optional, macht die Proteinmenge genauer. */
  weightKg?: number;
}): MacroResult | null {
  const { calories, goal, weightKg } = input;
  if (!Number.isFinite(calories) || calories <= 0) return null;

  const profile = goalProfiles[goal];
  const notes: string[] = [profile.description];

  // 1. Protein
  let proteinGrams =
    weightKg && weightKg > 0
      ? profile.proteinPerKg * weightKg
      : (calories * (profile.proteinPercent / 100)) / KCAL_PER_GRAM.protein;

  let proteinKcal = proteinGrams * KCAL_PER_GRAM.protein;

  // Protein darf nicht mehr als 40 % der Energie beanspruchen – sonst bliebe
  // für Fett und Kohlenhydrate zu wenig übrig.
  const proteinCap = calories * 0.4;
  if (proteinKcal > proteinCap) {
    proteinKcal = proteinCap;
    proteinGrams = proteinKcal / KCAL_PER_GRAM.protein;
    notes.push(
      "Die Proteinmenge wurde begrenzt, damit für Fett und Kohlenhydrate genug Energie bleibt. Bei einem sehr niedrigen Kalorienziel im Verhältnis zum Körpergewicht ist das üblich.",
    );
  }

  // 2. Fett
  let fatKcal = calories * (profile.fatPercent / 100);
  if (weightKg && weightKg > 0) {
    const minFatKcal = MIN_FAT_PER_KG * weightKg * KCAL_PER_GRAM.fat;
    if (fatKcal < minFatKcal) {
      fatKcal = minFatKcal;
      notes.push(
        `Der Fettanteil wurde auf mindestens ${MIN_FAT_PER_KG} g je Kilogramm Körpergewicht angehoben. Deutlich weniger Fett kann auf Dauer den Hormonhaushalt und die Aufnahme fettlöslicher Vitamine beeinträchtigen.`,
      );
    }
  }

  // 3. Kohlenhydrate füllen den Rest auf.
  let carbsKcal = calories - proteinKcal - fatKcal;
  if (carbsKcal < 0) {
    // Kann bei sehr niedrigem Kalorienziel und hohem Körpergewicht auftreten.
    // Fett wird dann zurückgenommen, Protein bleibt geschützt.
    fatKcal = Math.max(calories - proteinKcal, 0);
    carbsKcal = 0;
    notes.push(
      "Bei diesem Kalorienziel bleibt rechnerisch kein Raum mehr für Kohlenhydrate. Das ist ein Zeichen dafür, dass das Ziel für dein Körpergewicht sehr niedrig angesetzt ist – prüfe es noch einmal.",
    );
  }

  const percent = (kcal: number) => {
    const share = safeDivide(kcal, calories);
    return share === null ? 0 : round(share * 100, 1);
  };

  const result: MacroResult = {
    calories: round(calories),
    protein: {
      grams: round(proteinKcal / KCAL_PER_GRAM.protein),
      kcal: round(proteinKcal),
      percent: percent(proteinKcal),
    },
    fat: {
      grams: round(fatKcal / KCAL_PER_GRAM.fat),
      kcal: round(fatKcal),
      percent: percent(fatKcal),
    },
    carbs: {
      grams: round(carbsKcal / KCAL_PER_GRAM.carbs),
      kcal: round(carbsKcal),
      percent: percent(carbsKcal),
    },
    notes,
  };

  if (result.carbs.percent > 0 && result.carbs.percent < 45) {
    notes.push(
      "Der Kohlenhydratanteil liegt unter dem Bereich von 45–65 %, den das Institute of Medicine als üblich beschreibt. Das ist bei proteinbetonten Zielen normal und für sich genommen kein Problem.",
    );
  }

  return result;
}
