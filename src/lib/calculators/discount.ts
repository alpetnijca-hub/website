import { round, safeDivide } from "./shared";

/**
 * Rabattrechnung in drei Richtungen.
 *
 *   Endpreis    = Originalpreis × (1 − Rabatt ÷ 100)
 *   Ersparnis   = Originalpreis − Endpreis
 *   Rabattsatz  = (Originalpreis − Endpreis) ÷ Originalpreis × 100
 *   Originalpreis = Endpreis ÷ (1 − Rabatt ÷ 100)
 *
 * Der dritte Fall ist der praktisch nützlichste: Im Laden steht der reduzierte
 * Preis neben dem durchgestrichenen, und die Frage ist, ob die beworbenen
 * Prozente stimmen.
 */

export type DiscountMode =
  /** Originalpreis und Rabattsatz sind bekannt, gesucht ist der Endpreis. */
  | "endpreis"
  /** Original- und Endpreis sind bekannt, gesucht ist der Rabattsatz. */
  | "rabattsatz"
  /** Endpreis und Rabattsatz sind bekannt, gesucht ist der Originalpreis. */
  | "originalpreis";

export interface DiscountResult {
  originalPrice: number;
  finalPrice: number;
  /** Gesparter Betrag in Euro. */
  savings: number;
  /** Rabatt in Prozent. */
  rate: number;
}

function build(originalPrice: number, finalPrice: number): DiscountResult {
  const savings = originalPrice - finalPrice;
  const rate = safeDivide(savings, originalPrice);
  return {
    originalPrice: round(originalPrice, 2),
    finalPrice: round(finalPrice, 2),
    savings: round(savings, 2),
    rate: round((rate ?? 0) * 100, 2),
  };
}

export function calculateDiscount(input: {
  mode: DiscountMode;
  /** Preis vor Rabatt – nur in den Modi "endpreis" und "rabattsatz". */
  originalPrice?: number;
  /** Preis nach Rabatt – nur in den Modi "rabattsatz" und "originalpreis". */
  finalPrice?: number;
  /** Rabatt in Prozent – nur in den Modi "endpreis" und "originalpreis". */
  rate?: number;
}): DiscountResult | null {
  const { mode, originalPrice, finalPrice, rate } = input;

  if (mode === "endpreis") {
    if (originalPrice === undefined || rate === undefined) return null;
    if (originalPrice < 0 || rate < 0 || rate > 100) return null;
    return build(originalPrice, originalPrice * (1 - rate / 100));
  }

  if (mode === "rabattsatz") {
    if (originalPrice === undefined || finalPrice === undefined) return null;
    // Ein Originalpreis von 0 lässt keinen Prozentsatz zu (Division durch null),
    // ein Endpreis über dem Originalpreis wäre kein Rabatt.
    if (originalPrice <= 0 || finalPrice < 0) return null;
    if (finalPrice > originalPrice) return null;
    return build(originalPrice, finalPrice);
  }

  if (finalPrice === undefined || rate === undefined) return null;
  if (finalPrice < 0 || rate < 0) return null;
  // Bei 100 Prozent Rabatt wäre der Originalpreis nicht bestimmbar:
  // jeder Preis führt zu einem Endpreis von null.
  if (rate >= 100) return null;
  const original = safeDivide(finalPrice, 1 - rate / 100);
  if (original === null) return null;
  return build(original, finalPrice);
}

/**
 * Zwei nacheinander gewährte Rabatte ergeben nicht die Summe der Prozentsätze.
 * 20 % und danach 10 % sind zusammen 28 %, nicht 30 %.
 */
export function combineDiscounts(rates: number[]): number | null {
  if (rates.length === 0) return null;
  if (rates.some((r) => r < 0 || r > 100)) return null;
  const remaining = rates.reduce((factor, r) => factor * (1 - r / 100), 1);
  return round((1 - remaining) * 100, 2);
}
