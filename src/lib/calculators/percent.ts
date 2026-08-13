import { round, safeDivide } from "./shared";

/**
 * Prozentrechnung in den vier gebräuchlichen Varianten.
 *
 * Grundbegriffe:
 *   Grundwert  (G) – der Betrag, auf den sich der Prozentsatz bezieht (100 %)
 *   Prozentsatz(p) – der Anteil in Prozent
 *   Prozentwert(W) – der Betrag, der dem Prozentsatz entspricht
 *
 * Grundgleichung: W = G × p ÷ 100
 */

export type PercentMode =
  /** Wie viel sind p % von G? */
  | "wert"
  /** Wie viel Prozent sind W von G? */
  | "satz"
  /** W sind p % – wie gross ist der Grundwert? */
  | "grundwert"
  /** Prozentuale Veränderung von einem Wert zum anderen. */
  | "veraenderung";

export const percentModes: Record<
  PercentMode,
  { label: string; question: string }
> = {
  wert: {
    label: "Prozentwert",
    question: "Wie viel sind X % von einem Betrag?",
  },
  satz: {
    label: "Prozentsatz",
    question: "Wie viel Prozent ist ein Betrag von einem anderen?",
  },
  grundwert: {
    label: "Grundwert",
    question: "Ein Betrag entspricht X % – wie gross ist das Ganze?",
  },
  veraenderung: {
    label: "Veränderung",
    question: "Um wie viel Prozent hat sich ein Wert verändert?",
  },
};

export interface PercentResult {
  /** Das gesuchte Ergebnis. */
  value: number;
  /** Einheit des Ergebnisses: Prozent oder ein absoluter Betrag. */
  unit: "prozent" | "betrag";
  /** Ausgeschriebener Rechenweg für die Anzeige. */
  steps: string[];
  /** Zusatzangabe, z. B. der absolute Unterschied bei der Veränderung. */
  note?: string;
}

const fmt = (value: number) =>
  new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(value);

/**
 * Führt die gewählte Prozentrechnung aus.
 * Gibt null zurück, wenn die Rechnung nicht definiert ist – etwa bei einem
 * Grundwert von null, durch den geteilt werden müsste.
 */
export function calculatePercent(input: {
  mode: PercentMode;
  /** Erste Zahl – Bedeutung hängt vom Modus ab. */
  a: number;
  /** Zweite Zahl – Bedeutung hängt vom Modus ab. */
  b: number;
}): PercentResult | null {
  const { mode, a, b } = input;

  if (mode === "wert") {
    // a = Grundwert, b = Prozentsatz
    const value = (a * b) / 100;
    return {
      value: round(value, 2),
      unit: "betrag",
      steps: [`${fmt(a)} × ${fmt(b)} ÷ 100 = ${fmt(round(value, 2))}`],
    };
  }

  if (mode === "satz") {
    // a = Prozentwert, b = Grundwert
    const quotient = safeDivide(a, b);
    if (quotient === null) return null;
    const value = quotient * 100;
    return {
      value: round(value, 2),
      unit: "prozent",
      steps: [`${fmt(a)} ÷ ${fmt(b)} × 100 = ${fmt(round(value, 2))} %`],
    };
  }

  if (mode === "grundwert") {
    // a = Prozentwert, b = Prozentsatz
    const quotient = safeDivide(a * 100, b);
    if (quotient === null) return null;
    return {
      value: round(quotient, 2),
      unit: "betrag",
      steps: [`${fmt(a)} × 100 ÷ ${fmt(b)} = ${fmt(round(quotient, 2))}`],
    };
  }

  // Veränderung: a = alter Wert, b = neuer Wert
  const difference = b - a;
  const quotient = safeDivide(difference, Math.abs(a));
  if (quotient === null) return null;
  const value = quotient * 100;

  return {
    value: round(value, 2),
    unit: "prozent",
    steps: [
      `Unterschied: ${fmt(b)} − ${fmt(a)} = ${fmt(round(difference, 2))}`,
      `${fmt(round(difference, 2))} ÷ ${fmt(Math.abs(a))} × 100 = ${fmt(
        round(value, 2),
      )} %`,
    ],
    note:
      difference === 0
        ? "Der Wert hat sich nicht verändert."
        : difference > 0
          ? `Zunahme um ${fmt(round(difference, 2))}`
          : `Abnahme um ${fmt(round(Math.abs(difference), 2))}`,
  };
}
