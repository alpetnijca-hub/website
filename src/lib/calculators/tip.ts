import { round, safeDivide } from "./shared";

/**
 * Trinkgeld und Rechnungsteilung.
 *
 *   Trinkgeld  = Rechnung × Satz ÷ 100
 *   Gesamt     = Rechnung + Trinkgeld
 *   Pro Person = Gesamt ÷ Personen
 *
 * Zusätzlich die Variante, die im Restaurant tatsächlich verwendet wird:
 * aufrunden. Statt 47,30 € plus 10 Prozent sagt man „50 €“ – der Rechner
 * zeigt deshalb auch, welchem Prozentsatz ein gerundeter Betrag entspricht.
 */

export interface TipResult {
  bill: number;
  tip: number;
  total: number;
  /** Tatsächlicher Trinkgeldsatz in Prozent. */
  rate: number;
  perPerson: number;
  tipPerPerson: number;
  people: number;
}

export function calculateTip(input: {
  /** Rechnungsbetrag in Euro. */
  bill: number;
  /** Trinkgeld in Prozent. */
  rate: number;
  /** Zahl der Personen, die teilen. */
  people: number;
  /**
   * Gesamtbetrag auf volle Euro aufrunden. Der Prozentsatz ergibt sich dann
   * aus dem gerundeten Betrag und weicht vom eingestellten Satz ab.
   */
  roundUp?: boolean;
}): TipResult | null {
  const { bill, rate, people, roundUp = false } = input;

  if (!Number.isFinite(bill) || bill < 0) return null;
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) return null;
  if (!Number.isInteger(people) || people < 1 || people > 100) return null;

  let total = bill * (1 + rate / 100);
  if (roundUp) total = Math.ceil(total);

  const tip = total - bill;
  // Bei einer Rechnung von 0 € gibt es keinen sinnvollen Prozentsatz.
  const actualRate = safeDivide(tip, bill);

  const perPerson = safeDivide(total, people);
  const tipPerPerson = safeDivide(tip, people);
  if (perPerson === null || tipPerPerson === null) return null;

  return {
    bill: round(bill, 2),
    tip: round(tip, 2),
    total: round(total, 2),
    rate: round((actualRate ?? 0) * 100, 2),
    perPerson: round(perPerson, 2),
    tipPerPerson: round(tipPerPerson, 2),
    people,
  };
}

/**
 * Gebräuchliche Trinkgeldsätze. Sie sind eine Gewohnheit, keine Vorschrift –
 * deshalb steht der Zusammenhang dabei und keine Empfehlung.
 */
export const commonTipRates = [
  { rate: 5, label: "5 %" },
  { rate: 10, label: "10 %" },
  { rate: 15, label: "15 %" },
  { rate: 20, label: "20 %" },
];
