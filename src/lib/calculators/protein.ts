import { round, type Goal } from "./shared";

/**
 * Proteinbedarf als Spanne in Gramm pro Tag.
 *
 * Grundlage sind Richtwerte pro Kilogramm Körpergewicht:
 *  - 0,8 g/kg ist der Referenzwert der DGE für gesunde Erwachsene ab 19 Jahren
 *    zur Deckung des Bedarfs – nicht der optimale Wert für Sporttreibende.
 *  - Die Positionsschrift der International Society of Sports Nutrition
 *    (Jäger et al. 2017) nennt für regelmässig Trainierende 1,4–2,0 g/kg.
 *  - In einer Diätphase wird häufig der obere Bereich empfohlen, um Muskel-
 *    masse zu erhalten.
 *
 * Der Rechner gibt bewusst eine Spanne aus. Ein einzelner exakter Gramm-Wert
 * würde eine Genauigkeit vortäuschen, die die Datenlage nicht hergibt.
 */

export type ProteinActivity = "wenig" | "freizeit" | "ausdauer" | "kraft";

export interface ProteinActivityInfo {
  label: string;
  description: string;
  /** Spanne in Gramm je Kilogramm Körpergewicht. */
  range: { min: number; max: number };
}

export const proteinActivities: Record<ProteinActivity, ProteinActivityInfo> = {
  wenig: {
    label: "Kaum Sport",
    description: "Überwiegend sitzender Alltag, kein regelmässiges Training",
    range: { min: 0.8, max: 1.0 },
  },
  freizeit: {
    label: "Freizeitsport",
    description: "1–3 Trainingseinheiten pro Woche",
    range: { min: 1.2, max: 1.6 },
  },
  ausdauer: {
    label: "Ausdauertraining",
    description: "Laufen, Radfahren oder Schwimmen, 4 oder mehr Einheiten",
    range: { min: 1.4, max: 1.8 },
  },
  kraft: {
    label: "Krafttraining",
    description: "Regelmässiges Training mit Gewichten, Muskelaufbau als Ziel",
    range: { min: 1.6, max: 2.2 },
  },
};

/**
 * Zuschlag je nach Ziel.
 * In einer Diät steigt der relative Bedarf, weil weniger Energie zur
 * Verfügung steht; beim Aufbau ist der Bedarf leicht erhöht, aber nicht
 * unbegrenzt – mehr Protein bringt oberhalb dieser Spanne keinen Vorteil.
 */
const goalModifier: Record<Goal, { min: number; max: number; note: string }> = {
  abnehmen: {
    min: 0.2,
    max: 0.2,
    note: "In einer Diätphase hilft mehr Eiweiss, Muskelmasse zu erhalten und länger satt zu bleiben.",
  },
  halten: {
    min: 0,
    max: 0,
    note: "Zum Halten des Gewichts reicht die Spanne deines Aktivitätsniveaus aus.",
  },
  zunehmen: {
    min: 0.1,
    max: 0.1,
    note: "Beim Aufbau ist ein leicht erhöhter Bedarf sinnvoll – entscheidend bleiben Training und Gesamtkalorien.",
  },
};

export interface ProteinResult {
  /** Empfohlene Menge in Gramm pro Tag. */
  gramsPerDay: { min: number; max: number };
  /** Zugrunde gelegte Spanne in Gramm je Kilogramm. */
  gramsPerKg: { min: number; max: number };
  /** Energieanteil dieser Proteinmenge in kcal. */
  caloriesPerDay: { min: number; max: number };
  /** Erläuterung zur Zielanpassung. */
  goalNote: string;
}

/** Ein Gramm Protein liefert rund 4 kcal. */
export const KCAL_PER_GRAM_PROTEIN = 4;

export function calculateProtein(input: {
  weightKg: number;
  activity: ProteinActivity;
  goal: Goal;
}): ProteinResult {
  const base = proteinActivities[input.activity].range;
  const modifier = goalModifier[input.goal];

  const perKgMin = round(base.min + modifier.min, 2);
  const perKgMax = round(base.max + modifier.max, 2);

  const gramsMin = round(perKgMin * input.weightKg);
  const gramsMax = round(perKgMax * input.weightKg);

  return {
    gramsPerDay: { min: gramsMin, max: gramsMax },
    gramsPerKg: { min: perKgMin, max: perKgMax },
    caloriesPerDay: {
      min: round(gramsMin * KCAL_PER_GRAM_PROTEIN),
      max: round(gramsMax * KCAL_PER_GRAM_PROTEIN),
    },
    goalNote: modifier.note,
  };
}
