import { describe, expect, it } from "vitest";
import {
  GOAL_ADJUSTMENT,
  MINIMUM_CALORIES,
  calculateBmr,
  calculateTdee,
} from "@/lib/calculators/tdee";
import { activityFactors } from "@/lib/calculators/shared";

describe("calculateBmr (Mifflin-St Jeor)", () => {
  it("berechnet den Grundumsatz für Männer", () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
    expect(
      calculateBmr({ sex: "maennlich", weightKg: 80, heightCm: 180, age: 30 }),
    ).toBe(1780);
  });

  it("berechnet den Grundumsatz für Frauen", () => {
    // 10*65 + 6.25*168 - 5*30 - 161 = 650 + 1050 - 150 - 161 = 1389
    expect(
      calculateBmr({ sex: "weiblich", weightKg: 65, heightCm: 168, age: 30 }),
    ).toBe(1389);
  });

  it("unterscheidet sich zwischen den Geschlechtern um genau 166 kcal", () => {
    const base = { weightKg: 70, heightCm: 175, age: 40 };
    const male = calculateBmr({ ...base, sex: "maennlich" });
    const female = calculateBmr({ ...base, sex: "weiblich" });
    expect(male - female).toBe(166);
  });

  it("sinkt mit steigendem Alter", () => {
    const young = calculateBmr({
      sex: "maennlich",
      weightKg: 80,
      heightCm: 180,
      age: 25,
    });
    const old = calculateBmr({
      sex: "maennlich",
      weightKg: 80,
      heightCm: 180,
      age: 65,
    });
    expect(young).toBeGreaterThan(old);
    // 40 Jahre × 5 kcal = 200 kcal Unterschied
    expect(young - old).toBe(200);
  });

  it("wird nie negativ", () => {
    const bmr = calculateBmr({
      sex: "weiblich",
      weightKg: 30,
      heightCm: 120,
      age: 100,
    });
    expect(bmr).toBeGreaterThanOrEqual(0);
  });
});

describe("calculateTdee", () => {
  const base = {
    sex: "maennlich" as const,
    age: 30,
    weightKg: 80,
    heightCm: 180,
    activity: "maessig" as const,
    goal: "halten" as const,
  };

  it("multipliziert den Grundumsatz mit dem Aktivitätsfaktor", () => {
    const result = calculateTdee(base);
    expect(result.bmr).toBe(1780);
    expect(result.activityFactor).toBe(1.55);
    expect(result.tdee).toBe(Math.round(1780 * 1.55)); // 2759
  });

  it("lässt die Zufuhr beim Ziel 'halten' unverändert", () => {
    const result = calculateTdee(base);
    expect(result.targetCalories).toBe(result.tdee);
    expect(result.goalAdjustment).toBe(0);
  });

  it("zieht beim Abnehmen das Defizit ab", () => {
    const result = calculateTdee({ ...base, goal: "abnehmen" });
    expect(result.targetCalories).toBe(result.tdee + GOAL_ADJUSTMENT.abnehmen);
  });

  it("addiert beim Zunehmen den Überschuss", () => {
    const result = calculateTdee({ ...base, goal: "zunehmen" });
    expect(result.targetCalories).toBe(result.tdee + GOAL_ADJUSTMENT.zunehmen);
  });

  it("steigt monoton mit dem Aktivitätsniveau", () => {
    const levels = Object.keys(activityFactors) as (keyof typeof activityFactors)[];
    const values = levels.map(
      (activity) => calculateTdee({ ...base, activity }).tdee,
    );
    for (let i = 1; i < values.length; i += 1) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });

  it("hebt die Empfehlung auf die Untergrenze an, statt sie zu unterschreiten", () => {
    // Sehr kleine, leichte, ältere Person mit sitzendem Alltag und Abnehmziel
    const result = calculateTdee({
      sex: "weiblich",
      age: 70,
      weightKg: 45,
      heightCm: 150,
      activity: "sitzend",
      goal: "abnehmen",
    });
    expect(result.adjustedToMinimum).toBe(true);
    expect(result.targetCalories).toBe(MINIMUM_CALORIES.weiblich);
  });

  it("meldet keine Anhebung, wenn die Zufuhr ausreichend hoch ist", () => {
    const result = calculateTdee({ ...base, goal: "abnehmen" });
    expect(result.adjustedToMinimum).toBe(false);
  });

  it("liefert nur positive, endliche Werte", () => {
    const result = calculateTdee(base);
    expect(Number.isFinite(result.bmr)).toBe(true);
    expect(Number.isFinite(result.tdee)).toBe(true);
    expect(result.targetCalories).toBeGreaterThan(0);
  });
});
