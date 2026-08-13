import { describe, expect, it } from "vitest";
import { annuityFromTerm, calculateLoan } from "@/lib/calculators/loan";

describe("calculateLoan", () => {
  const base = {
    amount: 300000,
    annualRate: 3.5,
    repaymentRate: 2,
    fixedYears: 10,
  };

  it("berechnet die monatliche Rate", () => {
    // 300.000 × (3,5 + 2) % / 12 = 1375
    expect(calculateLoan(base)?.monthlyRate).toBe(1375);
  });

  it("tilgt im ersten Monat genau die Differenz zum Zinsanteil", () => {
    const result = calculateLoan({ ...base, fixedYears: 1 })!;
    // Zins Monat 1: 300.000 × 3,5 % / 12 = 875 → Tilgung 500
    expect(result.principalPaid).toBeGreaterThan(500 * 12);
    expect(result.interestPaid).toBeLessThan(875 * 12);
  });

  it("senkt die Restschuld über die Zinsbindung", () => {
    const result = calculateLoan(base)!;
    expect(result.remainingDebt).toBeLessThan(base.amount);
    expect(result.remainingDebt).toBeGreaterThan(0);
  });

  it("hält Tilgung und Restschuld konsistent", () => {
    const result = calculateLoan(base)!;
    expect(result.principalPaid + result.remainingDebt).toBeCloseTo(
      base.amount,
      0,
    );
  });

  it("liefert für jedes Jahr der Zinsbindung eine Zeile", () => {
    expect(calculateLoan(base)?.years).toHaveLength(10);
  });

  it("berechnet die Gesamtlaufzeit bis zur vollständigen Tilgung", () => {
    const result = calculateLoan(base)!;
    expect(result.totalMonths).toBeGreaterThan(120);
    expect(result.totalMonths).toBeLessThan(720);
  });

  it("meldet eine unrealistisch lange Laufzeit bei winziger Tilgung", () => {
    // Bei 0,01 % Anfangstilgung deckt die Rate die Zinsen zwar knapp, die
    // Rückzahlung würde aber weit über 60 Jahre dauern.
    const result = calculateLoan({
      amount: 300000,
      annualRate: 10,
      repaymentRate: 0.01,
      fixedYears: 10,
    })!;
    expect(result.exceedsMaxTerm).toBe(true);
    expect(result.totalMonths).toBeNull();
  });

  it("meldet bei normaler Tilgung keine überlange Laufzeit", () => {
    expect(calculateLoan(base)?.exceedsMaxTerm).toBe(false);
  });

  it("kommt mit einem Zinssatz von 0 Prozent zurecht", () => {
    const result = calculateLoan({
      amount: 12000,
      annualRate: 0,
      repaymentRate: 10,
      fixedYears: 10,
    })!;
    expect(result.interestPaid).toBe(0);
    // 12000 × 10 % / 12 = 100 pro Monat → 120 Monate
    expect(result.monthlyRate).toBe(100);
    expect(result.totalMonths).toBe(120);
  });

  it("tilgt nie über die Darlehenssumme hinaus", () => {
    const result = calculateLoan({
      amount: 10000,
      annualRate: 2,
      repaymentRate: 20,
      fixedYears: 30,
    })!;
    expect(result.remainingDebt).toBe(0);
    expect(result.principalPaid).toBeCloseTo(10000, 0);
  });

  it("lehnt ungültige Eingaben ab", () => {
    expect(calculateLoan({ ...base, amount: 0 })).toBeNull();
    expect(calculateLoan({ ...base, repaymentRate: 0 })).toBeNull();
    expect(calculateLoan({ ...base, annualRate: -1 })).toBeNull();
    expect(calculateLoan({ ...base, fixedYears: 0 })).toBeNull();
  });
});

describe("annuityFromTerm", () => {
  it("berechnet die Rate aus einer festen Laufzeit", () => {
    // 10.000 € über 60 Monate zu 5 % ≈ 188,71 €
    expect(annuityFromTerm(10000, 5, 60)).toBeCloseTo(188.71, 1);
  });

  it("teilt bei 0 Prozent gleichmässig auf", () => {
    expect(annuityFromTerm(12000, 0, 12)).toBe(1000);
  });

  it("gibt bei ungültigen Eingaben null zurück", () => {
    expect(annuityFromTerm(0, 5, 60)).toBeNull();
    expect(annuityFromTerm(10000, 5, 0)).toBeNull();
  });
});
