import { describe, expect, it } from "vitest";
import { KCAL_PER_GRAM, calculateMacros } from "@/lib/calculators/macros";

describe("calculateMacros", () => {
  it("verteilt die Kalorien vollständig auf die drei Makronährstoffe", () => {
    const result = calculateMacros({ calories: 2500, goal: "halten" })!;
    const sum = result.protein.kcal + result.fat.kcal + result.carbs.kcal;
    // Rundungsabweichung von wenigen kcal ist zulässig.
    expect(Math.abs(sum - 2500)).toBeLessThanOrEqual(3);
  });

  it("ergibt in Summe rund 100 Prozent", () => {
    const result = calculateMacros({ calories: 2200, goal: "abnehmen" })!;
    const sum = result.protein.percent + result.fat.percent + result.carbs.percent;
    expect(sum).toBeGreaterThan(99);
    expect(sum).toBeLessThan(101);
  });

  it("rechnet Gramm und Kalorien konsistent um", () => {
    const result = calculateMacros({ calories: 2000, goal: "halten" })!;
    expect(result.protein.grams).toBe(
      Math.round(result.protein.kcal / KCAL_PER_GRAM.protein),
    );
    expect(result.fat.grams).toBe(Math.round(result.fat.kcal / KCAL_PER_GRAM.fat));
    expect(result.carbs.grams).toBe(
      Math.round(result.carbs.kcal / KCAL_PER_GRAM.carbs),
    );
  });

  it("nutzt das Körpergewicht für die Proteinmenge, wenn es angegeben ist", () => {
    const result = calculateMacros({
      calories: 2500,
      goal: "halten",
      weightKg: 80,
    })!;
    // 1.6 g/kg × 80 kg = 128 g
    expect(result.protein.grams).toBe(128);
  });

  it("nutzt ohne Gewicht einen prozentualen Anteil", () => {
    const result = calculateMacros({ calories: 2500, goal: "halten" })!;
    expect(result.protein.percent).toBeCloseTo(22, 0);
  });

  it("setzt beim Abnehmen den höchsten Proteinanteil", () => {
    const diet = calculateMacros({
      calories: 2000,
      goal: "abnehmen",
      weightKg: 80,
    })!;
    const maintain = calculateMacros({
      calories: 2000,
      goal: "halten",
      weightKg: 80,
    })!;
    expect(diet.protein.grams).toBeGreaterThan(maintain.protein.grams);
  });

  it("gibt beim Zunehmen den grössten Kohlenhydratanteil aus", () => {
    const gain = calculateMacros({
      calories: 3000,
      goal: "zunehmen",
      weightKg: 80,
    })!;
    const diet = calculateMacros({
      calories: 3000,
      goal: "abnehmen",
      weightKg: 80,
    })!;
    expect(gain.carbs.percent).toBeGreaterThan(diet.carbs.percent);
  });

  it("begrenzt Protein auf höchstens 40 Prozent der Energie", () => {
    // Sehr niedriges Ziel bei hohem Gewicht
    const result = calculateMacros({
      calories: 1200,
      goal: "abnehmen",
      weightKg: 120,
    })!;
    expect(result.protein.percent).toBeLessThanOrEqual(40.1);
    expect(result.notes.length).toBeGreaterThan(1);
  });

  it("lässt nie negative Werte entstehen", () => {
    const result = calculateMacros({
      calories: 1000,
      goal: "abnehmen",
      weightKg: 130,
    })!;
    expect(result.protein.grams).toBeGreaterThanOrEqual(0);
    expect(result.fat.grams).toBeGreaterThanOrEqual(0);
    expect(result.carbs.grams).toBeGreaterThanOrEqual(0);
  });

  it("hebt den Fettanteil auf die Untergrenze an", () => {
    const result = calculateMacros({
      calories: 1600,
      goal: "abnehmen",
      weightKg: 95,
    })!;
    // Mindestens 0.6 g/kg → 57 g
    expect(result.fat.grams).toBeGreaterThanOrEqual(56);
  });

  it("gibt bei ungültigem Kalorienziel null zurück", () => {
    expect(calculateMacros({ calories: 0, goal: "halten" })).toBeNull();
    expect(calculateMacros({ calories: -500, goal: "halten" })).toBeNull();
    expect(calculateMacros({ calories: Number.NaN, goal: "halten" })).toBeNull();
  });

  it("liefert immer mindestens einen erklärenden Hinweis", () => {
    const result = calculateMacros({ calories: 2400, goal: "halten" })!;
    expect(result.notes.length).toBeGreaterThanOrEqual(1);
  });
});
