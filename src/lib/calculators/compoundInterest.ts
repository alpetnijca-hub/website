import { round } from "./shared";

/**
 * Zinseszins und Sparplan.
 *
 * Einmalanlage:
 *   Endkapital = Startkapital × (1 + p)^n
 *
 * Regelmässige Einzahlung (nachschüssig, also am Ende jeder Periode):
 *   Endkapital = Rate × ((1 + p)^n − 1) ÷ p
 *
 * Dabei ist p der Zinssatz je Periode und n die Anzahl Perioden. Werden die
 * Zinsen mehrmals im Jahr gutgeschrieben, gilt p = Jahreszins ÷ Perioden.
 *
 * Bei einem Zinssatz von exakt 0 % greift die Rentenformel nicht (Division
 * durch null); dann ist das Ergebnis schlicht Rate × Anzahl Perioden.
 */

export type Compounding = "jaehrlich" | "monatlich";

export const compoundingOptions: Record<
  Compounding,
  { label: string; periodsPerYear: number }
> = {
  jaehrlich: { label: "Jährlich", periodsPerYear: 1 },
  monatlich: { label: "Monatlich", periodsPerYear: 12 },
};

export interface CompoundYear {
  year: number;
  /** Summe aller Einzahlungen bis einschliesslich dieses Jahres. */
  deposits: number;
  /** Bis dahin angefallene Zinsen. */
  interest: number;
  /** Kapital am Jahresende. */
  balance: number;
}

export interface CompoundResult {
  /** Endkapital nach der gesamten Laufzeit. */
  finalBalance: number;
  /** Summe aller Einzahlungen inklusive Startkapital. */
  totalDeposits: number;
  /** Erwirtschaftete Zinsen insgesamt. */
  totalInterest: number;
  /** Entwicklung je Jahr, für Tabelle und Balkendarstellung. */
  years: CompoundYear[];
}

export function calculateCompoundInterest(input: {
  /** Startkapital in Euro. */
  initial: number;
  /** Regelmässige Einzahlung je Periode in Euro (0 = keine). */
  contribution: number;
  /** Zinssatz pro Jahr in Prozent. */
  annualRate: number;
  /** Laufzeit in Jahren. */
  years: number;
  compounding: Compounding;
}): CompoundResult | null {
  const { initial, contribution, annualRate, years, compounding } = input;

  if (years <= 0) return null;
  if (initial < 0 || contribution < 0) return null;

  const periodsPerYear = compoundingOptions[compounding].periodsPerYear;
  const ratePerPeriod = annualRate / 100 / periodsPerYear;
  const totalPeriods = Math.round(years * periodsPerYear);

  let balance = initial;
  let deposits = initial;
  const yearRows: CompoundYear[] = [];

  for (let period = 1; period <= totalPeriods; period += 1) {
    // Zinsen auf den Bestand, danach die Einzahlung (nachschüssig).
    balance = balance * (1 + ratePerPeriod) + contribution;
    deposits += contribution;

    if (period % periodsPerYear === 0) {
      yearRows.push({
        year: period / periodsPerYear,
        deposits: round(deposits, 2),
        interest: round(balance - deposits, 2),
        balance: round(balance, 2),
      });
    }
  }

  return {
    finalBalance: round(balance, 2),
    totalDeposits: round(deposits, 2),
    totalInterest: round(balance - deposits, 2),
    years: yearRows,
  };
}
