import { describe, expect, it } from "vitest";
import { bmiCategories, calculateBmi, classifyBmi } from "@/lib/calculators/bmi";

describe("calculateBmi", () => {
  it("berechnet den BMI korrekt", () => {
    // 80 / 1.80² = 24.69…
    const result = calculateBmi({ weightKg: 80, heightCm: 180 });
    expect(result?.bmi).toBe(24.7);
  });

  it("ordnet dem Ergebnis die richtige WHO-Kategorie zu", () => {
    expect(calculateBmi({ weightKg: 80, heightCm: 180 })?.category.key).toBe(
      "normalgewicht",
    );
    expect(calculateBmi({ weightKg: 95, heightCm: 180 })?.category.key).toBe(
      "praeadipositas",
    );
    expect(calculateBmi({ weightKg: 55, heightCm: 180 })?.category.key).toBe(
      "untergewicht",
    );
  });

  it("berechnet die Normalgewichtsspanne für die Körpergrösse", () => {
    const result = calculateBmi({ weightKg: 80, heightCm: 180 });
    expect(result?.normalWeightRange.min).toBe(59.9);
    expect(result?.normalWeightRange.max).toBe(80.7);
  });

  it("gibt bei Gewicht im Normalbereich keinen Abstand aus", () => {
    const result = calculateBmi({ weightKg: 75, heightCm: 180 });
    expect(result?.distanceToNormalKg).toBe(0);
  });

  it("berechnet den Abstand zum Normalbereich nach oben", () => {
    const result = calculateBmi({ weightKg: 100, heightCm: 180 });
    expect(result?.distanceToNormalKg).toBeCloseTo(19.3, 1);
  });

  it("berechnet den Abstand zum Normalbereich nach unten", () => {
    const result = calculateBmi({ weightKg: 50, heightCm: 180 });
    expect(result?.distanceToNormalKg).toBeCloseTo(9.9, 1);
  });

  it("gibt bei Körpergrösse 0 null zurück statt Unendlich", () => {
    expect(calculateBmi({ weightKg: 80, heightCm: 0 })).toBeNull();
  });

  it("gibt bei Gewicht 0 null zurück", () => {
    expect(calculateBmi({ weightKg: 0, heightCm: 180 })).toBeNull();
  });

  it("liefert für gleiche Grösse einen höheren BMI bei mehr Gewicht", () => {
    const light = calculateBmi({ weightKg: 60, heightCm: 170 })!.bmi;
    const heavy = calculateBmi({ weightKg: 90, heightCm: 170 })!.bmi;
    expect(heavy).toBeGreaterThan(light);
  });
});

describe("classifyBmi", () => {
  it("trifft die Kategoriegrenzen exakt", () => {
    expect(classifyBmi(18.5).key).toBe("normalgewicht");
    expect(classifyBmi(18.4).key).toBe("untergewicht");
    expect(classifyBmi(25).key).toBe("praeadipositas");
    expect(classifyBmi(24.9).key).toBe("normalgewicht");
    expect(classifyBmi(30).key).toBe("adipositas-1");
    expect(classifyBmi(35).key).toBe("adipositas-2");
    expect(classifyBmi(40).key).toBe("adipositas-3");
  });

  it("deckt mit den Kategorien den gesamten Wertebereich lückenlos ab", () => {
    for (let bmi = 1; bmi <= 60; bmi += 0.5) {
      expect(classifyBmi(bmi)).toBeDefined();
    }
    // Die Kategorien schliessen lückenlos aneinander an.
    for (let i = 1; i < bmiCategories.length; i += 1) {
      expect(bmiCategories[i].from).toBe(bmiCategories[i - 1].to);
    }
  });

  it("ordnet sehr hohe Werte der obersten Kategorie zu", () => {
    expect(classifyBmi(120).key).toBe("adipositas-3");
  });
});
