import { round, safeDivide } from "./shared";

/**
 * Body-Mass-Index.
 *
 * Formel: BMI = Gewicht in kg ÷ (Körpergrösse in m)²
 *
 * Die Einteilung folgt der Klassifikation der Weltgesundheitsorganisation
 * für Erwachsene. Sie gilt unabhängig vom Geschlecht und ist nicht auf
 * Kinder, Jugendliche, Schwangere oder Menschen mit sehr hoher Muskelmasse
 * anwendbar.
 */

export type BmiCategoryKey =
  | "untergewicht-stark"
  | "untergewicht"
  | "normalgewicht"
  | "praeadipositas"
  | "adipositas-1"
  | "adipositas-2"
  | "adipositas-3";

export interface BmiCategory {
  key: BmiCategoryKey;
  label: string;
  /** Untergrenze (einschliesslich). */
  from: number;
  /** Obergrenze (ausschliesslich); null bedeutet nach oben offen. */
  to: number | null;
}

/** WHO-Klassifikation für Erwachsene. */
export const bmiCategories: BmiCategory[] = [
  { key: "untergewicht-stark", label: "Starkes Untergewicht", from: 0, to: 16 },
  { key: "untergewicht", label: "Untergewicht", from: 16, to: 18.5 },
  { key: "normalgewicht", label: "Normalgewicht", from: 18.5, to: 25 },
  { key: "praeadipositas", label: "Übergewicht (Präadipositas)", from: 25, to: 30 },
  { key: "adipositas-1", label: "Adipositas Grad I", from: 30, to: 35 },
  { key: "adipositas-2", label: "Adipositas Grad II", from: 35, to: 40 },
  { key: "adipositas-3", label: "Adipositas Grad III", from: 40, to: null },
];

export interface BmiResult {
  /** BMI auf eine Nachkommastelle gerundet. */
  bmi: number;
  category: BmiCategory;
  /** Gewichtsspanne in kg, die bei dieser Grösse dem Normalgewicht entspricht. */
  normalWeightRange: { min: number; max: number };
  /**
   * Differenz zum nächstgelegenen Rand des Normalbereichs in kg.
   * 0, wenn der BMI bereits im Normalbereich liegt.
   */
  distanceToNormalKg: number;
}

export function classifyBmi(bmi: number): BmiCategory {
  const match = bmiCategories.find(
    (category) => bmi >= category.from && (category.to === null || bmi < category.to),
  );
  // Fällt nur bei negativen Werten an, die die Eingabeprüfung ausschliesst.
  return match ?? bmiCategories[0];
}

/**
 * Berechnet den BMI. Gibt null zurück, wenn die Körpergrösse 0 ist –
 * dadurch entsteht nie eine Division durch null.
 */
export function calculateBmi(input: {
  weightKg: number;
  heightCm: number;
}): BmiResult | null {
  const heightM = input.heightCm / 100;
  const bmiRaw = safeDivide(input.weightKg, heightM * heightM);
  if (bmiRaw === null || bmiRaw <= 0) return null;

  const bmi = round(bmiRaw, 1);
  const category = classifyBmi(bmi);

  // Normalgewichtsspanne für diese Körpergrösse (BMI 18,5 bis 24,9).
  const minWeight = round(18.5 * heightM * heightM, 1);
  const maxWeight = round(24.9 * heightM * heightM, 1);

  let distance = 0;
  if (input.weightKg < minWeight) distance = round(minWeight - input.weightKg, 1);
  else if (input.weightKg > maxWeight)
    distance = round(input.weightKg - maxWeight, 1);

  return {
    bmi,
    category,
    normalWeightRange: { min: minWeight, max: maxWeight },
    distanceToNormalKg: distance,
  };
}
