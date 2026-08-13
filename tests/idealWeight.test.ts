import { describe, expect, it } from "vitest";
import { calculateIdealWeight } from "@/lib/calculators/idealWeight";

describe("calculateIdealWeight", () => {
  it("liefert alle fünf Formeln", () => {
    const result = calculateIdealWeight({ heightCm: 180, sex: "maennlich" });
    expect(result.formulas).toHaveLength(5);
    expect(result.formulas.map((f) => f.key)).toEqual([
      "broca",
      "devine",
      "robinson",
      "miller",
      "hamwi",
    ]);
  });

  it("berechnet Broca korrekt", () => {
    // (180 - 100) * 0.9 = 72
    const male = calculateIdealWeight({ heightCm: 180, sex: "maennlich" });
    expect(male.formulas[0].weightKg).toBe(72);
    // (170 - 100) * 0.85 = 59.5
    const female = calculateIdealWeight({ heightCm: 170, sex: "weiblich" });
    expect(female.formulas[0].weightKg).toBe(59.5);
  });

  it("berechnet Devine korrekt", () => {
    // (180 - 152.4) / 2.54 = 10.866 Zoll; 50 + 2.3 * 10.866 = 74.99
    const result = calculateIdealWeight({ heightCm: 180, sex: "maennlich" });
    expect(result.formulas[1].weightKg).toBeCloseTo(75.0, 1);
  });

  it("liefert für Frauen niedrigere Werte als für Männer bei gleicher Grösse", () => {
    const male = calculateIdealWeight({ heightCm: 175, sex: "maennlich" });
    const female = calculateIdealWeight({ heightCm: 175, sex: "weiblich" });
    expect(female.average).toBeLessThan(male.average);
  });

  it("steigt mit der Körpergrösse", () => {
    const small = calculateIdealWeight({ heightCm: 160, sex: "maennlich" });
    const tall = calculateIdealWeight({ heightCm: 190, sex: "maennlich" });
    expect(tall.average).toBeGreaterThan(small.average);
  });

  it("berechnet Spanne und Durchschnitt konsistent", () => {
    const result = calculateIdealWeight({ heightCm: 175, sex: "weiblich" });
    const values = result.formulas.map((f) => f.weightKg);
    expect(result.range.min).toBe(Math.min(...values));
    expect(result.range.max).toBe(Math.max(...values));
    expect(result.average).toBeGreaterThanOrEqual(result.range.min);
    expect(result.average).toBeLessThanOrEqual(result.range.max);
  });

  it("gibt für sehr kleine Körpergrössen keine negativen Gewichte aus", () => {
    const result = calculateIdealWeight({ heightCm: 120, sex: "weiblich" });
    for (const formula of result.formulas) {
      expect(formula.weightKg).toBeGreaterThanOrEqual(0);
    }
  });

  it("liefert eine plausible BMI-Normalgewichtsspanne", () => {
    const result = calculateIdealWeight({ heightCm: 180, sex: "maennlich" });
    expect(result.bmiRange.min).toBeCloseTo(59.9, 1);
    expect(result.bmiRange.max).toBeCloseTo(80.7, 1);
    expect(result.bmiRange.min).toBeLessThan(result.bmiRange.max);
  });
});
