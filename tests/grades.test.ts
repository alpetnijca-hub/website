import { describe, expect, it } from "vitest";
import {
  calculateGradeAverage,
  getGradeScale,
  requiredGrade,
} from "@/lib/calculators/grades";

const de = getGradeScale("de")!;
const ch = getGradeScale("ch")!;
const punkte = getGradeScale("punkte")!;

const plain = (...grades: number[]) =>
  grades.map((grade) => ({ grade, weight: 1 }));

describe("calculateGradeAverage", () => {
  it("bildet den einfachen Mittelwert", () => {
    const result = calculateGradeAverage(plain(1, 2, 3), de)!;
    expect(result.average).toBe(2);
    expect(result.count).toBe(3);
    expect(result.totalWeight).toBe(3);
  });

  it("gewichtet einzelne Noten", () => {
    // Eine doppelt zählende 1 und eine einfache 4: (1+1+4) ÷ 3 = 2
    const result = calculateGradeAverage(
      [
        { grade: 1, weight: 2 },
        { grade: 4, weight: 1 },
      ],
      de,
    )!;
    expect(result.average).toBe(2);
    expect(result.totalWeight).toBe(3);
  });

  it("unterscheidet sich vom Mittelwert der Mittelwerte", () => {
    // Zwei Noten im ersten Fach, eine im zweiten: Wer erst je Fach mittelt
    // und dann noch einmal, bekommt 2,5 statt der korrekten 2,33.
    const result = calculateGradeAverage(plain(1, 2, 4), de)!;
    expect(result.average).toBe(2.33);
  });

  it("nennt beste und schlechteste Note je nach Skala", () => {
    const german = calculateGradeAverage(plain(1, 3, 5), de)!;
    expect(german.best).toBe(1);
    expect(german.worst).toBe(5);

    // In der Schweiz ist die 6 die beste Note – die Richtung dreht sich um.
    const swiss = calculateGradeAverage(plain(6, 4, 3), ch)!;
    expect(swiss.best).toBe(6);
    expect(swiss.worst).toBe(3);
  });

  it("beurteilt Bestehen in beide Richtungen richtig", () => {
    expect(calculateGradeAverage(plain(3, 4), de)!.passed).toBe(true);
    expect(calculateGradeAverage(plain(5, 5), de)!.passed).toBe(false);
    expect(calculateGradeAverage(plain(4, 5), ch)!.passed).toBe(true);
    expect(calculateGradeAverage(plain(3, 3.5), ch)!.passed).toBe(false);
  });

  it("ordnet den Durchschnitt in Worte ein", () => {
    expect(calculateGradeAverage(plain(1, 1, 2), de)!.label).toBe("sehr gut");
    expect(calculateGradeAverage(plain(2, 3), de)!.label).toBe("gut");
    expect(calculateGradeAverage(plain(6, 6), ch)!.label).toBe("sehr gut");
    expect(calculateGradeAverage(plain(14, 15), punkte)!.label).toBe(
      "sehr gut",
    );
  });

  it("rundet Punkte auf eine Stelle, Noten auf zwei", () => {
    expect(calculateGradeAverage(plain(1, 2), punkte)!.average).toBe(1.5);
    expect(calculateGradeAverage(plain(1, 1, 2), de)!.average).toBe(1.33);
  });

  it("übergeht Noten ausserhalb der Skala", () => {
    const result = calculateGradeAverage(
      [
        { grade: 2, weight: 1 },
        { grade: 7, weight: 1 },
        { grade: 4, weight: 1 },
      ],
      de,
    )!;
    expect(result.count).toBe(2);
    expect(result.average).toBe(3);
  });

  it("übergeht Einträge ohne Gewicht", () => {
    const result = calculateGradeAverage(
      [
        { grade: 2, weight: 1 },
        { grade: 5, weight: 0 },
      ],
      de,
    )!;
    expect(result.count).toBe(1);
    expect(result.average).toBe(2);
  });

  it("gibt ohne gültige Note null zurück", () => {
    expect(calculateGradeAverage([], de)).toBeNull();
    expect(calculateGradeAverage(plain(9, 10), de)).toBeNull();
  });
});

describe("requiredGrade", () => {
  it("berechnet die nötige Note für ein Ziel", () => {
    // Bisher 3 und 3, Ziel 2,5: (3+3+x) ÷ 3 = 2,5 → x = 1,5
    expect(requiredGrade(plain(3, 3), 2.5, de)).toBe(1.5);
  });

  it("berücksichtigt das Gewicht der nächsten Arbeit", () => {
    // Doppelt zählende Arbeit: (3+3+2x) ÷ 4 = 2,5 → x = 2
    expect(requiredGrade(plain(3, 3), 2.5, de, 2)).toBe(2);
  });

  it("gibt null zurück, wenn das Ziel unerreichbar ist", () => {
    // Aus zwei Fünfen lässt sich kein Schnitt von 1,0 mehr machen.
    expect(requiredGrade(plain(5, 5), 1, de)).toBeNull();
  });

  it("funktioniert auch bei umgekehrter Skala", () => {
    // Schweiz: bisher 4 und 4, Ziel 5 → nötig ist eine 7, die es nicht gibt.
    expect(requiredGrade(plain(4, 4), 5, ch)).toBeNull();
    // Ziel 4,5 → nötig ist eine 5,5.
    expect(requiredGrade(plain(4, 4), 4.5, ch)).toBe(5.5);
  });

  it("lehnt ein Gewicht von null ab", () => {
    expect(requiredGrade(plain(3), 2, de, 0)).toBeNull();
  });
});
