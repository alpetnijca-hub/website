import { describe, expect, it } from "vitest";
import { calculateFuelCost } from "@/lib/calculators/fuelCost";
import { calculateElectricityCost } from "@/lib/calculators/electricity";
import { calculateVat } from "@/lib/calculators/vat";

describe("calculateFuelCost", () => {
  const base = {
    distanceKm: 500,
    consumption: 7.5,
    pricePerUnit: 1.75,
    people: 1,
  };

  it("berechnet Menge und Kosten", () => {
    const result = calculateFuelCost(base)!;
    // 500 × 7,5 / 100 = 37,5 l → × 1,75 = 65,63 €
    expect(result.amount).toBe(37.5);
    expect(result.totalCost).toBeCloseTo(65.63, 1);
  });

  it("teilt die Kosten auf mehrere Personen auf", () => {
    const result = calculateFuelCost({ ...base, people: 3 })!;
    expect(result.costPerPerson).toBeCloseTo(result.totalCost / 3, 1);
  });

  it("behandelt 0 Personen wie eine Person, statt durch null zu teilen", () => {
    const result = calculateFuelCost({ ...base, people: 0 })!;
    expect(result.costPerPerson).toBe(result.totalCost);
  });

  it("berechnet Hin- und Rückfahrt als doppelte Kosten", () => {
    const result = calculateFuelCost(base)!;
    expect(result.roundTripCost).toBeCloseTo(result.totalCost * 2, 1);
  });

  it("berechnet die Kosten je Kilometer", () => {
    const result = calculateFuelCost(base)!;
    expect(result.costPerKm).toBeCloseTo(result.totalCost / 500, 2);
  });

  it("skaliert linear mit der Strecke", () => {
    const short = calculateFuelCost({ ...base, distanceKm: 100 })!.totalCost;
    const long = calculateFuelCost({ ...base, distanceKm: 200 })!.totalCost;
    expect(long).toBeCloseTo(short * 2, 1);
  });

  it("lehnt ungültige Eingaben ab", () => {
    expect(calculateFuelCost({ ...base, distanceKm: 0 })).toBeNull();
    expect(calculateFuelCost({ ...base, consumption: -1 })).toBeNull();
    expect(calculateFuelCost({ ...base, pricePerUnit: -1 })).toBeNull();
  });
});

describe("calculateElectricityCost", () => {
  const base = { watt: 2000, hoursPerUse: 1, usesPerDay: 1, centPerKwh: 35 };

  it("rechnet Watt in Kilowattstunden um", () => {
    // 2000 W × 1 h / 1000 = 2 kWh
    expect(calculateElectricityCost(base)?.kwhPerDay).toBe(2);
  });

  it("berechnet die Kosten je Nutzung", () => {
    // 2 kWh × 0,35 € = 0,70 €
    expect(calculateElectricityCost(base)?.costPerUse).toBe(0.7);
  });

  it("rechnet korrekt auf das Jahr hoch", () => {
    const result = calculateElectricityCost(base)!;
    expect(result.kwhPerYear).toBe(730);
    expect(result.costPerYear).toBeCloseTo(255.5, 0);
  });

  it("berücksichtigt mehrere Nutzungen pro Tag", () => {
    const once = calculateElectricityCost(base)!;
    const twice = calculateElectricityCost({ ...base, usesPerDay: 2 })!;
    expect(twice.costPerDay).toBeCloseTo(once.costPerDay * 2, 2);
  });

  it("liefert bei 0 Watt keine Kosten", () => {
    const result = calculateElectricityCost({ ...base, watt: 0 })!;
    expect(result.costPerYear).toBe(0);
  });

  it("lehnt negative Eingaben ab", () => {
    expect(calculateElectricityCost({ ...base, watt: -5 })).toBeNull();
    expect(calculateElectricityCost({ ...base, centPerKwh: -1 })).toBeNull();
  });
});

describe("calculateVat", () => {
  it("rechnet die Steuer hinzu", () => {
    const result = calculateVat({
      amount: 100,
      rate: 19,
      direction: "netto-zu-brutto",
    })!;
    expect(result.gross).toBe(119);
    expect(result.tax).toBe(19);
  });

  it("rechnet die Steuer heraus", () => {
    const result = calculateVat({
      amount: 119,
      rate: 19,
      direction: "brutto-zu-netto",
    })!;
    expect(result.net).toBe(100);
    expect(result.tax).toBe(19);
  });

  it("ist in beide Richtungen umkehrbar", () => {
    const up = calculateVat({
      amount: 249.99,
      rate: 7,
      direction: "netto-zu-brutto",
    })!;
    const down = calculateVat({
      amount: up.gross,
      rate: 7,
      direction: "brutto-zu-netto",
    })!;
    expect(down.net).toBeCloseTo(249.99, 1);
  });

  it("verarbeitet Nachkommasätze wie 8,1 Prozent", () => {
    const result = calculateVat({
      amount: 1000,
      rate: 8.1,
      direction: "netto-zu-brutto",
    })!;
    expect(result.gross).toBe(1081);
  });

  it("liefert bei 0 Prozent keine Steuer", () => {
    const result = calculateVat({
      amount: 100,
      rate: 0,
      direction: "netto-zu-brutto",
    })!;
    expect(result.tax).toBe(0);
    expect(result.gross).toBe(100);
  });

  it("lehnt negative Werte ab", () => {
    expect(
      calculateVat({ amount: -100, rate: 19, direction: "netto-zu-brutto" }),
    ).toBeNull();
    expect(
      calculateVat({ amount: 100, rate: -19, direction: "netto-zu-brutto" }),
    ).toBeNull();
  });
});
