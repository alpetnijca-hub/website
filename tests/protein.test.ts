import { describe, expect, it } from "vitest";
import {
  KCAL_PER_GRAM_PROTEIN,
  calculateProtein,
  proteinActivities,
} from "@/lib/calculators/protein";

describe("calculateProtein", () => {
  it("berechnet die Spanne aus Gewicht und Aktivitätsniveau", () => {
    const result = calculateProtein({
      weightKg: 80,
      activity: "kraft",
      goal: "halten",
    });
    // 1.6–2.2 g/kg bei 80 kg
    expect(result.gramsPerDay.min).toBe(128);
    expect(result.gramsPerDay.max).toBe(176);
  });

  it("erhöht die Empfehlung beim Abnehmen", () => {
    const maintain = calculateProtein({
      weightKg: 80,
      activity: "kraft",
      goal: "halten",
    });
    const diet = calculateProtein({
      weightKg: 80,
      activity: "kraft",
      goal: "abnehmen",
    });
    expect(diet.gramsPerDay.min).toBeGreaterThan(maintain.gramsPerDay.min);
    expect(diet.gramsPerKg.min).toBeCloseTo(1.8, 2);
  });

  it("gibt beim Zunehmen eine leicht erhöhte Empfehlung aus", () => {
    const result = calculateProtein({
      weightKg: 80,
      activity: "freizeit",
      goal: "zunehmen",
    });
    expect(result.gramsPerKg.min).toBeCloseTo(1.3, 2);
  });

  it("liefert immer eine echte Spanne, nie einen einzelnen Wert", () => {
    for (const activity of Object.keys(proteinActivities) as (keyof typeof proteinActivities)[]) {
      const result = calculateProtein({ weightKg: 70, activity, goal: "halten" });
      expect(result.gramsPerDay.max).toBeGreaterThan(result.gramsPerDay.min);
    }
  });

  it("steigt mit dem Körpergewicht", () => {
    const light = calculateProtein({
      weightKg: 55,
      activity: "freizeit",
      goal: "halten",
    });
    const heavy = calculateProtein({
      weightKg: 95,
      activity: "freizeit",
      goal: "halten",
    });
    expect(heavy.gramsPerDay.min).toBeGreaterThan(light.gramsPerDay.min);
  });

  it("rechnet den Energiegehalt mit 4 kcal je Gramm um", () => {
    const result = calculateProtein({
      weightKg: 80,
      activity: "kraft",
      goal: "halten",
    });
    expect(result.caloriesPerDay.min).toBe(
      result.gramsPerDay.min * KCAL_PER_GRAM_PROTEIN,
    );
  });

  it("liefert für wenig aktive Menschen Werte im DGE-Bereich", () => {
    const result = calculateProtein({
      weightKg: 70,
      activity: "wenig",
      goal: "halten",
    });
    expect(result.gramsPerKg.min).toBe(0.8);
    expect(result.gramsPerDay.min).toBe(56);
  });

  it("gibt immer positive Werte aus", () => {
    const result = calculateProtein({
      weightKg: 30,
      activity: "wenig",
      goal: "halten",
    });
    expect(result.gramsPerDay.min).toBeGreaterThan(0);
  });

  it("enthält einen erklärenden Hinweis zum Ziel", () => {
    const result = calculateProtein({
      weightKg: 70,
      activity: "kraft",
      goal: "abnehmen",
    });
    expect(result.goalNote.length).toBeGreaterThan(10);
  });
});
