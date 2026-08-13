import { round, safeDivide } from "./shared";

/**
 * Mehrwertsteuer (in Deutschland Umsatzsteuer) hinzurechnen oder herausrechnen.
 *
 *   Netto → Brutto: Brutto = Netto × (1 + p ÷ 100)
 *   Brutto → Netto: Netto  = Brutto ÷ (1 + p ÷ 100)
 *   Steuerbetrag    = Brutto − Netto
 *
 * Die Steuersätze sind länderabhängig und werden vom Gesetzgeber festgelegt.
 * Der Rechner gibt sie deshalb nicht vor, sondern lässt sie frei wählen –
 * mit den gebräuchlichen Sätzen als Schnellauswahl.
 */

export type VatDirection = "netto-zu-brutto" | "brutto-zu-netto";

export interface VatResult {
  net: number;
  gross: number;
  /** Steuerbetrag in Euro. */
  tax: number;
  rate: number;
}

export function calculateVat(input: {
  /** Eingegebener Betrag in Euro. */
  amount: number;
  /** Steuersatz in Prozent. */
  rate: number;
  direction: VatDirection;
}): VatResult | null {
  const { amount, rate, direction } = input;

  if (amount < 0 || rate < 0) return null;

  const factor = 1 + rate / 100;

  if (direction === "netto-zu-brutto") {
    const gross = amount * factor;
    return {
      net: round(amount, 2),
      gross: round(gross, 2),
      tax: round(gross - amount, 2),
      rate,
    };
  }

  // Herausrechnen: Division durch den Faktor, der nie null werden kann,
  // solange der Steuersatz nicht bei −100 % liegt. Die Prüfung oben schliesst
  // negative Sätze bereits aus.
  const net = safeDivide(amount, factor);
  if (net === null) return null;

  return {
    net: round(net, 2),
    gross: round(amount, 2),
    tax: round(amount - net, 2),
    rate,
  };
}

/**
 * Gebräuchliche Steuersätze als Schnellauswahl.
 * Stand der Angaben: Sie können sich durch Gesetzesänderungen ändern –
 * der Rechner erlaubt deshalb jeden beliebigen Satz.
 */
export const commonVatRates = [
  { rate: 19, label: "19 % – Deutschland, Regelsatz" },
  { rate: 7, label: "7 % – Deutschland, ermässigt" },
  { rate: 20, label: "20 % – Österreich, Regelsatz" },
  { rate: 8.1, label: "8,1 % – Schweiz, Normalsatz" },
  { rate: 2.6, label: "2,6 % – Schweiz, reduziert" },
];
