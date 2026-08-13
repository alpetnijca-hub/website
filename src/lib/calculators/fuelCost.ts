import { round, safeDivide } from "./shared";

/**
 * Spritkosten einer Fahrt.
 *
 *   Verbrauch  = Strecke × Verbrauch je 100 km ÷ 100
 *   Kosten     = Verbrauch × Preis je Liter
 *   je Person  = Kosten ÷ Anzahl Personen
 *
 * Für Elektrofahrzeuge gilt dieselbe Rechnung mit kWh statt Litern.
 */

export type FuelUnit = "liter" | "kwh";

export const fuelUnits: Record<
  FuelUnit,
  { label: string; consumptionLabel: string; unit: string; priceUnit: string }
> = {
  liter: {
    label: "Benzin oder Diesel",
    consumptionLabel: "Verbrauch je 100 km",
    unit: "l",
    priceUnit: "€/l",
  },
  kwh: {
    label: "Strom (Elektroauto)",
    consumptionLabel: "Verbrauch je 100 km",
    unit: "kWh",
    priceUnit: "€/kWh",
  },
};

export interface FuelCostResult {
  /** Verbrauchte Menge in Litern beziehungsweise Kilowattstunden. */
  amount: number;
  /** Gesamtkosten der Strecke in Euro. */
  totalCost: number;
  /** Kosten je Person in Euro. */
  costPerPerson: number;
  /** Kosten je Kilometer in Euro. */
  costPerKm: number;
  /** Kosten für Hin- und Rückfahrt in Euro. */
  roundTripCost: number;
}

export function calculateFuelCost(input: {
  /** Strecke in Kilometern. */
  distanceKm: number;
  /** Verbrauch je 100 km. */
  consumption: number;
  /** Preis je Liter beziehungsweise je kWh in Euro. */
  pricePerUnit: number;
  /** Anzahl Personen, die sich die Kosten teilen. */
  people: number;
}): FuelCostResult | null {
  const { distanceKm, consumption, pricePerUnit, people } = input;

  if (distanceKm <= 0 || consumption < 0 || pricePerUnit < 0) return null;

  const amount = (distanceKm * consumption) / 100;
  const totalCost = amount * pricePerUnit;

  const perPerson = safeDivide(totalCost, Math.max(people, 1));
  const perKm = safeDivide(totalCost, distanceKm);
  if (perPerson === null || perKm === null) return null;

  return {
    amount: round(amount, 2),
    totalCost: round(totalCost, 2),
    costPerPerson: round(perPerson, 2),
    costPerKm: round(perKm, 3),
    roundTripCost: round(totalCost * 2, 2),
  };
}
