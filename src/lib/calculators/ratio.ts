import { round, safeDivide } from "./shared";

/**
 * Dreisatz – proportional und umgekehrt proportional.
 *
 * **Proportional** heisst: doppelt so viel Ware, doppelt so viel Geld.
 *
 *   a Einheiten kosten b     →     c Einheiten kosten x
 *   x = b ÷ a × c
 *
 * **Umgekehrt proportional** heisst: doppelt so viele Arbeiter, halbe Zeit.
 *
 *   a Arbeiter brauchen b Stunden  →  c Arbeiter brauchen x Stunden
 *   x = a × b ÷ c
 *
 * Die Wahl zwischen beiden ist der eigentliche Denkschritt und lässt sich
 * nicht rechnen – deshalb wird sie hier bewusst abgefragt und nicht geraten.
 */

export type RatioMode = "proportional" | "umgekehrt";

/**
 * Zahl in deutscher Schreibweise für den Rechenweg. Der Rechenweg ist Text,
 * der so auf der Seite steht – er gehört deshalb in derselben Schreibweise
 * ausgegeben wie alle anderen Zahlen: mit Komma, nicht mit Punkt.
 */
function de(value: number): string {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 4 }).format(
    value,
  );
}

export interface RatioStep {
  /** Was in diesem Schritt passiert. */
  label: string;
  /** Die Rechnung als Text. */
  calculation: string;
}

export interface RatioResult {
  value: number;
  /** Wert für eine einzelne Einheit – der Zwischenschritt des Dreisatzes. */
  perUnit: number;
  steps: RatioStep[];
}

export function calculateRatio(input: {
  /** Bekannte Menge auf der linken Seite. */
  a: number;
  /** Zugehöriger Wert. */
  b: number;
  /** Gesuchte Menge. */
  c: number;
  mode: RatioMode;
}): RatioResult | null {
  const { a, b, c, mode } = input;

  if (![a, b, c].every(Number.isFinite)) return null;
  // a steht im Nenner: Aus "0 Stück kosten 5 €" folgt nichts.
  if (a === 0) return null;
  if (mode === "umgekehrt" && c === 0) return null;
  if (a < 0 || b < 0 || c < 0) return null;

  if (mode === "proportional") {
    const perUnit = safeDivide(b, a);
    if (perUnit === null) return null;
    const value = perUnit * c;
    return {
      value: round(value, 4),
      perUnit: round(perUnit, 4),
      steps: [
        {
          label: "Auf eine Einheit herunterrechnen",
          calculation: `${de(b)} ÷ ${de(a)} = ${de(round(perUnit, 4))}`,
        },
        {
          label: "Auf die gesuchte Menge hochrechnen",
          calculation: `${de(round(perUnit, 4))} × ${de(c)} = ${de(round(value, 4))}`,
        },
      ],
    };
  }

  // Umgekehrt proportional: Das Produkt aus beiden Grössen bleibt gleich.
  const product = a * b;
  const value = safeDivide(product, c);
  if (value === null) return null;

  return {
    value: round(value, 4),
    perUnit: round(product, 4),
    steps: [
      {
        label: "Gesamtaufwand bestimmen (bleibt gleich)",
        calculation: `${de(a)} × ${de(b)} = ${de(round(product, 4))}`,
      },
      {
        label: "Auf die gesuchte Menge verteilen",
        calculation: `${de(round(product, 4))} ÷ ${de(c)} = ${de(round(value, 4))}`,
      },
    ],
  };
}
