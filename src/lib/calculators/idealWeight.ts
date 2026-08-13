import { round, type Sex } from "./shared";

/**
 * Idealgewicht nach mehreren etablierten Formeln.
 *
 * Wichtig zur Einordnung: Die Formeln von Devine, Robinson, Miller und Hamwi
 * stammen ursprünglich nicht aus der Ernährungsberatung, sondern aus der
 * Arzneimitteldosierung. Sie liefern einen Referenzwert, keine medizinische
 * Zielvorgabe. Broca ist eine historische Faustformel aus dem 19. Jahrhundert.
 *
 * Alle vier Formeln arbeiten mit Zoll über 5 Fuss (152,4 cm):
 *   inchesOver5Feet = (Körpergrösse in cm − 152,4) ÷ 2,54
 */

export interface IdealWeightFormula {
  key: string;
  name: string;
  /** Kurze Einordnung der Herkunft. */
  origin: string;
  /** Ergebnis in Kilogramm. */
  weightKg: number;
}

export interface IdealWeightResult {
  formulas: IdealWeightFormula[];
  /** Spanne über alle Formeln hinweg. */
  range: { min: number; max: number };
  /** Durchschnitt aller Formeln, gerundet. */
  average: number;
  /** Normalgewichtsspanne nach BMI 18,5–24,9 für diese Körpergrösse. */
  bmiRange: { min: number; max: number };
}

const CM_PER_INCH = 2.54;
const FIVE_FEET_CM = 152.4;

function inchesOverFiveFeet(heightCm: number): number {
  // Bei Körpergrössen unter 152,4 cm wird der Wert negativ; die Formeln
  // rechnen dann korrekt nach unten. Ein Mindestwert verhindert jedoch,
  // dass unrealistisch kleine oder negative Gewichte entstehen.
  return (heightCm - FIVE_FEET_CM) / CM_PER_INCH;
}

export function calculateIdealWeight(input: {
  heightCm: number;
  sex: Sex;
}): IdealWeightResult {
  const { heightCm, sex } = input;
  const inches = inchesOverFiveFeet(heightCm);
  const male = sex === "maennlich";

  /** Broca: (cm − 100), davon 10 % (Männer) bzw. 15 % (Frauen) Abschlag. */
  const broca = (heightCm - 100) * (male ? 0.9 : 0.85);

  /** Devine (1974): 50,0 / 45,5 kg + 2,3 kg je Zoll über 5 Fuss. */
  const devine = (male ? 50.0 : 45.5) + 2.3 * inches;

  /** Robinson (1983): 52,0 / 49,0 kg + 1,9 bzw. 1,7 kg je Zoll. */
  const robinson = male ? 52.0 + 1.9 * inches : 49.0 + 1.7 * inches;

  /** Miller (1983): 56,2 / 53,1 kg + 1,41 bzw. 1,36 kg je Zoll. */
  const miller = male ? 56.2 + 1.41 * inches : 53.1 + 1.36 * inches;

  /** Hamwi (1964): 48,0 / 45,5 kg + 2,7 bzw. 2,2 kg je Zoll. */
  const hamwi = male ? 48.0 + 2.7 * inches : 45.5 + 2.2 * inches;

  const formulas: IdealWeightFormula[] = [
    {
      key: "broca",
      name: "Broca-Index",
      origin: "Historische Faustformel (Paul Broca, 1871)",
      weightKg: round(Math.max(broca, 0), 1),
    },
    {
      key: "devine",
      name: "Devine",
      origin: "Aus der Arzneimitteldosierung (1974)",
      weightKg: round(Math.max(devine, 0), 1),
    },
    {
      key: "robinson",
      name: "Robinson",
      origin: "Überarbeitung der Devine-Formel (1983)",
      weightKg: round(Math.max(robinson, 0), 1),
    },
    {
      key: "miller",
      name: "Miller",
      origin: "Alternative Auswertung derselben Daten (1983)",
      weightKg: round(Math.max(miller, 0), 1),
    },
    {
      key: "hamwi",
      name: "Hamwi",
      origin: "Aus der Diabetesberatung (1964)",
      weightKg: round(Math.max(hamwi, 0), 1),
    },
  ];

  const values = formulas.map((formula) => formula.weightKg);
  const heightM = heightCm / 100;

  return {
    formulas,
    range: { min: Math.min(...values), max: Math.max(...values) },
    average: round(values.reduce((sum, v) => sum + v, 0) / values.length, 1),
    bmiRange: {
      min: round(18.5 * heightM * heightM, 1),
      max: round(24.9 * heightM * heightM, 1),
    },
  };
}
