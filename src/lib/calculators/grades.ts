import { round, safeDivide } from "./shared";

/**
 * Notendurchschnitt mit Gewichtung.
 *
 *   Durchschnitt = Summe(Note × Gewicht) ÷ Summe(Gewichte)
 *
 * Ohne Gewichtung ist jedes Gewicht 1, und die Formel wird zum gewöhnlichen
 * Mittelwert. Der häufigste Fehler in der Praxis: Erst die Durchschnitte
 * einzelner Fächer bilden und diese dann noch einmal mitteln. Das stimmt nur,
 * wenn überall gleich viele Noten mit gleichem Gewicht vorliegen.
 *
 * Die Notensysteme unterscheiden sich von Land zu Land – auch in der
 * Richtung: In Deutschland ist 1 die beste Note, in der Schweiz die 6.
 * Deshalb wird die Skala ausgewählt und nicht angenommen.
 */

export interface GradeScale {
  id: string;
  label: string;
  min: number;
  max: number;
  /** true, wenn die kleinere Zahl die bessere Note ist (Deutschland). */
  lowerIsBetter: boolean;
  /** Grenze, ab der die Leistung als bestanden gilt. */
  passing: number;
  /** Nachkommastellen, die bei dieser Skala üblich sind. */
  decimals: number;
}

export const gradeScales: GradeScale[] = [
  {
    id: "de",
    label: "Deutschland: 1 bis 6 (1 = sehr gut)",
    min: 1,
    max: 6,
    lowerIsBetter: true,
    passing: 4,
    decimals: 2,
  },
  {
    id: "ch",
    label: "Schweiz: 6 bis 1 (6 = sehr gut)",
    min: 1,
    max: 6,
    lowerIsBetter: false,
    passing: 4,
    decimals: 2,
  },
  {
    id: "at",
    label: "Österreich: 1 bis 5 (1 = sehr gut)",
    min: 1,
    max: 5,
    lowerIsBetter: true,
    passing: 4,
    decimals: 2,
  },
  {
    id: "punkte",
    label: "Oberstufe: 15 bis 0 Punkte (15 = sehr gut)",
    min: 0,
    max: 15,
    lowerIsBetter: false,
    passing: 5,
    decimals: 1,
  },
];

export function getGradeScale(id: string): GradeScale | undefined {
  return gradeScales.find((scale) => scale.id === id);
}

export interface GradeEntry {
  /** Die Note bzw. Punktzahl. */
  grade: number;
  /** Gewicht, z. B. 2 für eine doppelt zählende Klausur. */
  weight: number;
}

export interface GradeResult {
  average: number;
  /** Summe aller Gewichte – bei ungewichteten Noten die Anzahl. */
  totalWeight: number;
  count: number;
  best: number;
  worst: number;
  passed: boolean;
  /** Wortlaut zur Einordnung, z. B. "gut". */
  label: string;
}

/**
 * Bezeichnungen der deutschen Notenstufen. Die Grenzen folgen der
 * üblichen Zuordnung, bei der bis 1,5 als "sehr gut" gilt.
 */
function germanLabel(average: number): string {
  if (average <= 1.5) return "sehr gut";
  if (average <= 2.5) return "gut";
  if (average <= 3.5) return "befriedigend";
  if (average <= 4.5) return "ausreichend";
  if (average <= 5.5) return "mangelhaft";
  return "ungenügend";
}

function swissLabel(average: number): string {
  if (average >= 5.5) return "sehr gut";
  if (average >= 4.5) return "gut";
  if (average >= 4) return "genügend";
  if (average >= 3) return "ungenügend";
  return "schwach";
}

function pointsLabel(average: number): string {
  if (average >= 13) return "sehr gut";
  if (average >= 10) return "gut";
  if (average >= 7) return "befriedigend";
  if (average >= 5) return "ausreichend";
  if (average >= 2) return "mangelhaft";
  return "ungenügend";
}

export function calculateGradeAverage(
  entries: readonly GradeEntry[],
  scale: GradeScale,
): GradeResult | null {
  const valid = entries.filter(
    (entry) =>
      Number.isFinite(entry.grade) &&
      Number.isFinite(entry.weight) &&
      entry.weight > 0 &&
      entry.grade >= scale.min &&
      entry.grade <= scale.max,
  );

  if (valid.length === 0) return null;

  const totalWeight = valid.reduce((sum, entry) => sum + entry.weight, 0);
  const weightedSum = valid.reduce(
    (sum, entry) => sum + entry.grade * entry.weight,
    0,
  );

  const average = safeDivide(weightedSum, totalWeight);
  if (average === null) return null;

  const grades = valid.map((entry) => entry.grade);
  const rounded = round(average, scale.decimals);

  const label =
    scale.id === "ch"
      ? swissLabel(rounded)
      : scale.id === "punkte"
        ? pointsLabel(rounded)
        : germanLabel(rounded);

  return {
    average: rounded,
    totalWeight: round(totalWeight, 2),
    count: valid.length,
    best: scale.lowerIsBetter ? Math.min(...grades) : Math.max(...grades),
    worst: scale.lowerIsBetter ? Math.max(...grades) : Math.min(...grades),
    passed: scale.lowerIsBetter
      ? rounded <= scale.passing
      : rounded >= scale.passing,
    label,
  };
}

/**
 * Welche Note in der nächsten Arbeit nötig ist, um einen Zieldurchschnitt zu
 * erreichen. Gibt null zurück, wenn das Ziel rechnerisch nicht mehr möglich
 * ist – lieber eine ehrliche Fehlanzeige als eine Note ausserhalb der Skala.
 */
export function requiredGrade(
  entries: readonly GradeEntry[],
  target: number,
  scale: GradeScale,
  weight = 1,
): number | null {
  if (weight <= 0) return null;
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  const weightedSum = entries.reduce(
    (sum, entry) => sum + entry.grade * entry.weight,
    0,
  );

  // (weightedSum + x × weight) ÷ (totalWeight + weight) = target
  const needed = target * (totalWeight + weight) - weightedSum;
  const value = safeDivide(needed, weight);
  if (value === null) return null;

  const rounded = round(value, 2);
  if (rounded < scale.min || rounded > scale.max) return null;
  return rounded;
}
