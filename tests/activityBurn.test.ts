import { describe, expect, it } from "vitest";
import { calculateActivityBurn } from "@/lib/calculators/activityBurn";
import { metActivities, getMetActivity } from "@/data/mets";

describe("calculateActivityBurn", () => {
  it("berechnet den Verbrauch nach der MET-Formel", () => {
    // Joggen 8 km/h = 8.3 MET; 8.3 * 3.5 * 80 / 200 = 11.62 kcal/min
    // 30 Minuten → 348.6 → gerundet 349
    const result = calculateActivityBurn({
      weightKg: 80,
      activityId: "joggen-8",
      durationMinutes: 30,
    });
    expect(result?.totalKcal).toBe(349);
    expect(result?.kcalPerMinute).toBeCloseTo(11.6, 1);
    expect(result?.met).toBe(8.3);
  });

  it("skaliert linear mit der Dauer", () => {
    const thirty = calculateActivityBurn({
      weightKg: 80,
      activityId: "rad-18",
      durationMinutes: 30,
    })!.totalKcal;
    const sixty = calculateActivityBurn({
      weightKg: 80,
      activityId: "rad-18",
      durationMinutes: 60,
    })!.totalKcal;
    // Toleranz von 1 kcal, weil beide Werte einzeln gerundet werden.
    expect(Math.abs(sixty - thirty * 2)).toBeLessThanOrEqual(1);
  });

  it("skaliert linear mit dem Körpergewicht", () => {
    const light = calculateActivityBurn({
      weightKg: 60,
      activityId: "rad-18",
      durationMinutes: 45,
    })!.totalKcal;
    const heavy = calculateActivityBurn({
      weightKg: 120,
      activityId: "rad-18",
      durationMinutes: 45,
    })!.totalKcal;
    expect(Math.abs(heavy - light * 2)).toBeLessThanOrEqual(1);
  });

  it("liefert einen niedrigeren Nettowert als den Bruttowert", () => {
    const result = calculateActivityBurn({
      weightKg: 80,
      activityId: "joggen-8",
      durationMinutes: 30,
    })!;
    expect(result.netKcal).toBeLessThan(result.totalKcal);
    // Netto = Brutto × (MET − 1) / MET
    expect(result.netKcal).toBeCloseTo(result.totalKcal * (7.3 / 8.3), 0);
  });

  it("gibt für unbekannte Aktivitäten null zurück", () => {
    expect(
      calculateActivityBurn({
        weightKg: 80,
        activityId: "gibtsnicht",
        durationMinutes: 30,
      }),
    ).toBeNull();
  });

  it("gibt bei Dauer 0 oder negativer Dauer null zurück", () => {
    expect(
      calculateActivityBurn({
        weightKg: 80,
        activityId: "joggen-8",
        durationMinutes: 0,
      }),
    ).toBeNull();
    expect(
      calculateActivityBurn({
        weightKg: 80,
        activityId: "joggen-8",
        durationMinutes: -10,
      }),
    ).toBeNull();
  });

  it("gibt bei Gewicht 0 null zurück", () => {
    expect(
      calculateActivityBurn({
        weightKg: 0,
        activityId: "joggen-8",
        durationMinutes: 30,
      }),
    ).toBeNull();
  });

  it("verbraucht bei höherem MET-Wert mehr Kalorien", () => {
    const walking = calculateActivityBurn({
      weightKg: 75,
      activityId: "gehen-5",
      durationMinutes: 30,
    })!.totalKcal;
    const running = calculateActivityBurn({
      weightKg: 75,
      activityId: "laufen-12",
      durationMinutes: 30,
    })!.totalKcal;
    expect(running).toBeGreaterThan(walking);
  });

  it("liefert für jede hinterlegte Aktivität ein gültiges Ergebnis", () => {
    for (const activity of metActivities) {
      const result = calculateActivityBurn({
        weightKg: 75,
        activityId: activity.id,
        durationMinutes: 30,
      });
      expect(result).not.toBeNull();
      expect(result!.totalKcal).toBeGreaterThan(0);
      expect(Number.isFinite(result!.totalKcal)).toBe(true);
    }
  });
});

describe("MET-Datensatz", () => {
  it("enthält keine doppelten Kennungen", () => {
    const ids = metActivities.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("enthält nur plausible MET-Werte", () => {
    for (const activity of metActivities) {
      expect(activity.met).toBeGreaterThan(1);
      expect(activity.met).toBeLessThan(20);
    }
  });

  it("findet Aktivitäten über ihre Kennung", () => {
    expect(getMetActivity("joggen-8")?.met).toBe(8.3);
    expect(getMetActivity("nicht-vorhanden")).toBeUndefined();
  });
});
