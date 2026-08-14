import { describe, expect, it } from "vitest";
import { calculateWage } from "@/lib/calculators/hourlyWage";

describe("calculateWage – Gehalt zu Stundenlohn", () => {
  const base = {
    mode: "gehalt-zu-stundenlohn" as const,
    monthlySalary: 3000,
    hoursPerWeek: 40,
  };

  it("rechnet über den Jahresdurchschnitt, nicht über den einzelnen Monat", () => {
    const result = calculateWage(base)!;
    // 40 × 52 / 12 = 173,33 Stunden im Monat
    expect(result.hoursPerMonth).toBeCloseTo(173.33, 2);
    expect(result.hourlyWage).toBeCloseTo(17.31, 2);
  });

  it("berechnet Tages- und Wochenverdienst", () => {
    const result = calculateWage(base)!;
    // Intern wird mit dem ungerundeten Stundenlohn gerechnet, deshalb weichen
    // Wochen- und Tagesverdienst um wenige Cent von der Multiplikation des
    // angezeigten Stundenlohns ab.
    expect(result.weeklyWage).toBeCloseTo(result.hourlyWage * 40, 0);
    expect(result.dailyWage).toBeCloseTo(result.hourlyWage * 8, 1);
  });

  it("erhöht den Stundenlohn bei einem 13. Monatsgehalt", () => {
    const twelve = calculateWage(base)!;
    const thirteen = calculateWage({ ...base, salariesPerYear: 13 })!;
    expect(thirteen.hourlyWage).toBeGreaterThan(twelve.hourlyWage);
    expect(thirteen.annualSalary).toBe(39000);
    expect(thirteen.extraPayments).toBe(3000);
  });

  it("halbiert den Stundenlohn bei doppelter Wochenarbeitszeit", () => {
    const full = calculateWage({ ...base, hoursPerWeek: 40 })!.hourlyWage;
    const half = calculateWage({ ...base, hoursPerWeek: 20 })!.hourlyWage;
    expect(half).toBeCloseTo(full * 2, 2);
  });

  it("lehnt eine Wochenarbeitszeit von 0 ab, statt durch null zu teilen", () => {
    expect(calculateWage({ ...base, hoursPerWeek: 0 })).toBeNull();
  });

  it("lehnt unsinnige Eingaben ab", () => {
    expect(calculateWage({ ...base, monthlySalary: -1 })).toBeNull();
    expect(calculateWage({ ...base, hoursPerWeek: 100 })).toBeNull();
    expect(calculateWage({ ...base, daysPerWeek: 0 })).toBeNull();
    expect(calculateWage({ ...base, salariesPerYear: 20 })).toBeNull();
  });
});

describe("calculateWage – Stundenlohn zu Gehalt", () => {
  it("rechnet den Stundenlohn auf das Monatsgehalt hoch", () => {
    const result = calculateWage({
      mode: "stundenlohn-zu-gehalt",
      hourlyWage: 20,
      hoursPerWeek: 40,
    })!;
    // 20 × 40 × 52 = 41.600 € im Jahr, geteilt durch 12
    expect(result.annualSalary).toBeCloseTo(41600, 0);
    expect(result.monthlySalary).toBeCloseTo(3466.67, 2);
  });

  it("ist die Umkehrung der anderen Richtung", () => {
    const forward = calculateWage({
      mode: "gehalt-zu-stundenlohn",
      monthlySalary: 4200,
      hoursPerWeek: 38.5,
      salariesPerYear: 13,
    })!;
    const back = calculateWage({
      mode: "stundenlohn-zu-gehalt",
      hourlyWage: forward.hourlyWage,
      hoursPerWeek: 38.5,
      salariesPerYear: 13,
    })!;
    // Abweichung nur durch die Rundung des Stundenlohns auf Cent.
    expect(back.monthlySalary).toBeCloseTo(4200, 0);
  });

  it("lehnt einen negativen Stundenlohn ab", () => {
    expect(
      calculateWage({
        mode: "stundenlohn-zu-gehalt",
        hourlyWage: -5,
        hoursPerWeek: 40,
      }),
    ).toBeNull();
  });
});
