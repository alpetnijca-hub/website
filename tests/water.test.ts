import { describe, expect, it } from "vitest";
import {
  HIGH_INTAKE_ML,
  ML_PER_TRAINING_HOUR,
  calculateWater,
} from "@/lib/calculators/water";

describe("calculateWater", () => {
  it("berechnet den Grundbedarf aus Gewicht und Aktivität", () => {
    const result = calculateWater({
      weightKg: 70,
      activity: "gering",
      trainingMinutes: 0,
    });
    // 30–33 ml/kg bei 70 kg
    expect(result.baseMl.min).toBe(2100);
    expect(result.baseMl.max).toBe(2310);
  });

  it("addiert keinen Zuschlag ohne Training", () => {
    const result = calculateWater({
      weightKg: 70,
      activity: "gering",
      trainingMinutes: 0,
    });
    expect(result.trainingMl.min).toBe(0);
    expect(result.totalMl.min).toBe(result.baseMl.min);
  });

  it("addiert den Trainingszuschlag anteilig", () => {
    const result = calculateWater({
      weightKg: 70,
      activity: "gering",
      trainingMinutes: 60,
    });
    expect(result.trainingMl.min).toBe(ML_PER_TRAINING_HOUR.min);
    expect(result.trainingMl.max).toBe(ML_PER_TRAINING_HOUR.max);
  });

  it("rechnet halbe Stunden korrekt anteilig um", () => {
    const result = calculateWater({
      weightKg: 70,
      activity: "gering",
      trainingMinutes: 30,
    });
    expect(result.trainingMl.min).toBe(ML_PER_TRAINING_HOUR.min / 2);
  });

  it("steigt mit dem Aktivitätsniveau", () => {
    const low = calculateWater({
      weightKg: 70,
      activity: "gering",
      trainingMinutes: 0,
    });
    const high = calculateWater({
      weightKg: 70,
      activity: "hoch",
      trainingMinutes: 0,
    });
    expect(high.totalMl.min).toBeGreaterThan(low.totalMl.min);
  });

  it("behandelt negative Trainingszeiten als null", () => {
    const result = calculateWater({
      weightKg: 70,
      activity: "gering",
      trainingMinutes: -60,
    });
    expect(result.trainingMl.min).toBe(0);
  });

  it("setzt die Warnung bei sehr hoher Gesamtmenge", () => {
    const result = calculateWater({
      weightKg: 110,
      activity: "hoch",
      trainingMinutes: 120,
    });
    expect(result.totalMl.max).toBeGreaterThan(HIGH_INTAKE_ML);
    expect(result.highIntakeWarning).toBe(true);
  });

  it("setzt keine Warnung bei normaler Menge", () => {
    const result = calculateWater({
      weightKg: 65,
      activity: "gering",
      trainingMinutes: 0,
    });
    expect(result.highIntakeWarning).toBe(false);
  });

  it("liefert eine Spanne, keinen exakten Einzelwert", () => {
    const result = calculateWater({
      weightKg: 80,
      activity: "mittel",
      trainingMinutes: 45,
    });
    expect(result.totalMl.max).toBeGreaterThan(result.totalMl.min);
  });
});
