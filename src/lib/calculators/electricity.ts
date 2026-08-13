import { round } from "./shared";

/**
 * Stromkosten eines Geräts.
 *
 *   Verbrauch in kWh = Leistung in Watt × Stunden ÷ 1000
 *   Kosten           = Verbrauch × Preis je kWh
 *
 * Der Strompreis wird üblicherweise in Cent je Kilowattstunde angegeben,
 * die Eingabe erfolgt deshalb in Cent.
 */

export interface ElectricityResult {
  /** Verbrauch pro Tag in kWh. */
  kwhPerDay: number;
  /** Verbrauch pro Jahr in kWh. */
  kwhPerYear: number;
  costPerDay: number;
  costPerMonth: number;
  costPerYear: number;
  /** Kosten für einen einzelnen Betriebsvorgang. */
  costPerUse: number;
}

/** Für die Hochrechnung auf Monat und Jahr verwendete Tage. */
const DAYS_PER_MONTH = 30.42;
const DAYS_PER_YEAR = 365;

export function calculateElectricityCost(input: {
  /** Leistungsaufnahme in Watt. */
  watt: number;
  /** Betriebsdauer in Stunden je Nutzung. */
  hoursPerUse: number;
  /** Nutzungen pro Tag. */
  usesPerDay: number;
  /** Strompreis in Cent je Kilowattstunde. */
  centPerKwh: number;
}): ElectricityResult | null {
  const { watt, hoursPerUse, usesPerDay, centPerKwh } = input;

  if (watt < 0 || hoursPerUse < 0 || usesPerDay < 0 || centPerKwh < 0) {
    return null;
  }

  const pricePerKwh = centPerKwh / 100;
  const kwhPerUse = (watt * hoursPerUse) / 1000;
  const kwhPerDay = kwhPerUse * usesPerDay;

  return {
    kwhPerDay: round(kwhPerDay, 3),
    kwhPerYear: round(kwhPerDay * DAYS_PER_YEAR, 1),
    costPerUse: round(kwhPerUse * pricePerKwh, 2),
    costPerDay: round(kwhPerDay * pricePerKwh, 2),
    costPerMonth: round(kwhPerDay * DAYS_PER_MONTH * pricePerKwh, 2),
    costPerYear: round(kwhPerDay * DAYS_PER_YEAR * pricePerKwh, 2),
  };
}
