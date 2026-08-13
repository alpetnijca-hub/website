import { round } from "./shared";

/**
 * Orientierungswert für die tägliche Trinkmenge.
 *
 * Es gibt keine allgemein anerkannte Formel für den individuellen
 * Flüssigkeitsbedarf. Die EFSA nennt Referenzwerte für die Gesamtzufuhr
 * (Getränke plus Nahrung) von rund 2,0 l pro Tag für Frauen und 2,5 l für
 * Männer bei moderaten Bedingungen. Verbreitet ist zusätzlich die Faustregel
 * von etwa 30–35 ml je Kilogramm Körpergewicht.
 *
 * Dieser Rechner nutzt die Faustregel als Ausgangspunkt und addiert einen
 * Zuschlag für Training. Das Ergebnis ist ausdrücklich eine grobe
 * Orientierung und keine medizinische Vorgabe.
 */

export type WaterActivity = "gering" | "mittel" | "hoch";

export const waterActivities: Record<
  WaterActivity,
  { label: string; description: string; mlPerKg: { min: number; max: number } }
> = {
  gering: {
    label: "Wenig aktiv",
    description: "Überwiegend sitzend, normale Raumtemperatur",
    mlPerKg: { min: 30, max: 33 },
  },
  mittel: {
    label: "Mässig aktiv",
    description: "Regelmässige Bewegung oder viel auf den Beinen",
    mlPerKg: { min: 33, max: 37 },
  },
  hoch: {
    label: "Sehr aktiv",
    description: "Körperliche Arbeit, intensives Training oder Hitze",
    mlPerKg: { min: 37, max: 42 },
  },
};

/**
 * Zusätzlicher Bedarf pro Stunde Training in Millilitern.
 * Der tatsächliche Schweissverlust schwankt stark – je nach Intensität,
 * Temperatur und Person zwischen etwa 0,3 und 2,4 Litern pro Stunde.
 */
export const ML_PER_TRAINING_HOUR = { min: 400, max: 800 };

export interface WaterResult {
  /** Grundbedarf ohne Training in Millilitern. */
  baseMl: { min: number; max: number };
  /** Zuschlag durch Training in Millilitern. */
  trainingMl: { min: number; max: number };
  /** Gesamtempfehlung in Millilitern. */
  totalMl: { min: number; max: number };
  /** Hinweis, wenn die Menge ungewöhnlich hoch ausfällt. */
  highIntakeWarning: boolean;
}

/** Ab dieser Tagesmenge weist der Rechner ausdrücklich auf Vorsicht hin. */
export const HIGH_INTAKE_ML = 4000;

export function calculateWater(input: {
  weightKg: number;
  activity: WaterActivity;
  /** Trainingsdauer pro Tag in Minuten (0 = kein Training). */
  trainingMinutes: number;
}): WaterResult {
  const perKg = waterActivities[input.activity].mlPerKg;
  const baseMin = perKg.min * input.weightKg;
  const baseMax = perKg.max * input.weightKg;

  const hours = Math.max(input.trainingMinutes, 0) / 60;
  const trainingMin = hours * ML_PER_TRAINING_HOUR.min;
  const trainingMax = hours * ML_PER_TRAINING_HOUR.max;

  const totalMin = baseMin + trainingMin;
  const totalMax = baseMax + trainingMax;

  return {
    baseMl: { min: round(baseMin), max: round(baseMax) },
    trainingMl: { min: round(trainingMin), max: round(trainingMax) },
    totalMl: { min: round(totalMin), max: round(totalMax) },
    highIntakeWarning: totalMax > HIGH_INTAKE_ML,
  };
}
