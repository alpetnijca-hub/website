import { describe, expect, it } from "vitest";
import { calculateDeficit } from "@/lib/calculators/deficit";
import { KCAL_PER_KG_BODY_FAT } from "@/lib/calculators/shared";

describe("calculateDeficit", () => {
  const base = { tdee: 2500, dailyDeficit: 500, sex: "maennlich" as const };

  it("berechnet die resultierende Zufuhr", () => {
    expect(calculateDeficit(base).intake).toBe(2000);
  });

  it("berechnet den prozentualen Anteil des Defizits", () => {
    expect(calculateDeficit(base).deficitPercent).toBe(20);
  });

  it("berechnet die wöchentliche Veränderung nach dem 7700-kcal-Faktor", () => {
    const result = calculateDeficit(base);
    const expected = (500 * 7) / KCAL_PER_KG_BODY_FAT;
    expect(result.weeklyChangeKg).toBeCloseTo(expected, 2);
  });

  it("berechnet die monatliche Veränderung für 30 Tage", () => {
    const result = calculateDeficit(base);
    expect(result.monthlyChangeKg).toBeCloseTo((500 * 30) / KCAL_PER_KG_BODY_FAT, 2);
  });

  it("berechnet die Tage bis zu einem Kilogramm", () => {
    const result = calculateDeficit(base);
    expect(result.daysPerKg).toBe(Math.round(KCAL_PER_KG_BODY_FAT / 500));
  });

  it("gibt bei Defizit 0 keine Tage-pro-Kilo aus statt durch null zu teilen", () => {
    const result = calculateDeficit({ ...base, dailyDeficit: 0 });
    expect(result.daysPerKg).toBeNull();
    expect(result.weeklyChangeKg).toBe(0);
    expect(result.intake).toBe(2500);
  });

  it("weist auf ein fehlendes Defizit hin", () => {
    const result = calculateDeficit({ ...base, dailyDeficit: 0 });
    expect(result.warnings.some((w) => w.level === "hinweis")).toBe(true);
  });

  it("warnt kritisch, wenn die Zufuhr unter die Untergrenze fällt", () => {
    const result = calculateDeficit({
      tdee: 1800,
      dailyDeficit: 700,
      sex: "maennlich",
    });
    expect(result.intake).toBe(1100);
    expect(result.warnings.some((w) => w.level === "kritisch")).toBe(true);
  });

  it("warnt bei einem Defizit über 25 Prozent des Gesamtumsatzes", () => {
    const result = calculateDeficit({
      tdee: 2000,
      dailyDeficit: 800,
      sex: "maennlich",
    });
    expect(result.deficitPercent).toBe(40);
    expect(
      result.warnings.some((w) => w.title === "Sehr hohes Defizit"),
    ).toBe(true);
  });

  it("warnt bei mehr als einem Kilogramm Abnahme pro Woche", () => {
    const result = calculateDeficit({
      tdee: 4000,
      dailyDeficit: 1200,
      sex: "maennlich",
    });
    expect(result.weeklyChangeKg).toBeGreaterThan(1);
    expect(
      result.warnings.some((w) => w.title === "Sehr schnelles Abnehmtempo"),
    ).toBe(true);
  });

  it("gibt bei moderatem Defizit keine Warnung aus", () => {
    const result = calculateDeficit(base);
    expect(result.warnings).toHaveLength(0);
  });

  it("verwendet für Frauen eine niedrigere Untergrenze", () => {
    const female = calculateDeficit({
      tdee: 1700,
      dailyDeficit: 400,
      sex: "weiblich",
    });
    // 1300 kcal liegt über der Untergrenze von 1200 für Frauen
    expect(female.warnings.some((w) => w.level === "kritisch")).toBe(false);

    const male = calculateDeficit({
      tdee: 1700,
      dailyDeficit: 400,
      sex: "maennlich",
    });
    // 1300 kcal liegt unter der Untergrenze von 1500 für Männer
    expect(male.warnings.some((w) => w.level === "kritisch")).toBe(true);
  });

  it("behandelt negative Defizite als null", () => {
    const result = calculateDeficit({ ...base, dailyDeficit: -300 });
    expect(result.intake).toBe(2500);
    expect(result.weeklyChangeKg).toBe(0);
  });
});
