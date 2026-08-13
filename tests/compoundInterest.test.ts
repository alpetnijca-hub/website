import { describe, expect, it } from "vitest";
import { calculateCompoundInterest } from "@/lib/calculators/compoundInterest";

describe("calculateCompoundInterest", () => {
  it("berechnet die reine Einmalanlage korrekt", () => {
    // 1000 € zu 5 % über 10 Jahre = 1000 × 1,05^10 = 1628,89
    const result = calculateCompoundInterest({
      initial: 1000,
      contribution: 0,
      annualRate: 5,
      years: 10,
      compounding: "jaehrlich",
    });
    expect(result?.finalBalance).toBeCloseTo(1628.89, 1);
    expect(result?.totalDeposits).toBe(1000);
    expect(result?.totalInterest).toBeCloseTo(628.89, 1);
  });

  it("berechnet einen reinen Sparplan korrekt", () => {
    // 100 €/Jahr zu 5 % über 10 Jahre = 100 × (1,05^10 − 1) / 0,05 = 1257,79
    const result = calculateCompoundInterest({
      initial: 0,
      contribution: 100,
      annualRate: 5,
      years: 10,
      compounding: "jaehrlich",
    });
    expect(result?.finalBalance).toBeCloseTo(1257.79, 1);
    expect(result?.totalDeposits).toBe(1000);
  });

  it("kommt mit einem Zinssatz von 0 Prozent zurecht", () => {
    const result = calculateCompoundInterest({
      initial: 500,
      contribution: 100,
      annualRate: 0,
      years: 10,
      compounding: "jaehrlich",
    });
    expect(result?.finalBalance).toBe(1500);
    expect(result?.totalInterest).toBe(0);
  });

  it("verarbeitet negative Zinsen (Strafzins)", () => {
    const result = calculateCompoundInterest({
      initial: 1000,
      contribution: 0,
      annualRate: -1,
      years: 5,
      compounding: "jaehrlich",
    });
    expect(result!.finalBalance).toBeLessThan(1000);
    expect(result!.totalInterest).toBeLessThan(0);
  });

  it("führt monatliche Verzinsung zu einem höheren Ergebnis als jährliche", () => {
    const base = {
      initial: 10000,
      contribution: 0,
      annualRate: 6,
      years: 10,
    } as const;
    const yearly = calculateCompoundInterest({
      ...base,
      compounding: "jaehrlich",
    });
    const monthly = calculateCompoundInterest({
      ...base,
      compounding: "monatlich",
    });
    expect(monthly!.finalBalance).toBeGreaterThan(yearly!.finalBalance);
  });

  it("liefert für jedes Jahr eine Zeile", () => {
    const result = calculateCompoundInterest({
      initial: 1000,
      contribution: 50,
      annualRate: 4,
      years: 15,
      compounding: "monatlich",
    });
    expect(result?.years).toHaveLength(15);
    expect(result?.years[14].year).toBe(15);
  });

  it("hält Einzahlungen und Zinsen konsistent zum Endkapital", () => {
    const result = calculateCompoundInterest({
      initial: 2500,
      contribution: 200,
      annualRate: 4.5,
      years: 20,
      compounding: "monatlich",
    })!;
    expect(result.totalDeposits + result.totalInterest).toBeCloseTo(
      result.finalBalance,
      1,
    );
  });

  it("lehnt ungültige Eingaben ab", () => {
    const base = {
      initial: 1000,
      contribution: 0,
      annualRate: 5,
      compounding: "jaehrlich",
    } as const;
    expect(calculateCompoundInterest({ ...base, years: 0 })).toBeNull();
    expect(calculateCompoundInterest({ ...base, years: -5 })).toBeNull();
    expect(
      calculateCompoundInterest({ ...base, years: 5, initial: -100 }),
    ).toBeNull();
  });
});
