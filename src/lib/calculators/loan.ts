import { round, safeDivide } from "./shared";

/**
 * Annuitätendarlehen.
 *
 * Bei einem Annuitätendarlehen bleibt die monatliche Rate über die gesamte
 * Zinsbindung gleich. Ihre Zusammensetzung verschiebt sich: Der Zinsanteil
 * sinkt mit der Restschuld, der Tilgungsanteil steigt entsprechend.
 *
 * Monatliche Rate aus Darlehenssumme, Zins und anfänglicher Tilgung:
 *   Rate = Darlehen × (Zinssatz + Tilgungssatz) ÷ 12
 *
 * Verlauf je Monat:
 *   Zinsanteil    = Restschuld × Jahreszins ÷ 12
 *   Tilgungsanteil= Rate − Zinsanteil
 *   Restschuld    = Restschuld − Tilgungsanteil
 *
 * Ein Zinssatz von 0 % ist zulässig: Dann besteht die Rate vollständig aus
 * Tilgung. Eine Division durch null kann nicht auftreten.
 */

export interface LoanMonth {
  month: number;
  rate: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface LoanYear {
  year: number;
  /** In diesem Jahr gezahlte Zinsen. */
  interest: number;
  /** In diesem Jahr getilgter Betrag. */
  principal: number;
  /** Restschuld am Jahresende. */
  balance: number;
}

export interface LoanResult {
  /** Monatliche Rate (Annuität). */
  monthlyRate: number;
  /** Restschuld am Ende der Zinsbindung. */
  remainingDebt: number;
  /** In der Zinsbindung gezahlte Zinsen. */
  interestPaid: number;
  /** In der Zinsbindung getilgter Betrag. */
  principalPaid: number;
  /**
   * Laufzeit in Monaten bis zur vollständigen Tilgung, wenn Zins und Rate
   * unverändert blieben. null, wenn das Darlehen selbst nach 60 Jahren nicht
   * abbezahlt wäre – siehe exceedsMaxTerm.
   */
  totalMonths: number | null;
  /** Jahresübersicht für die Zinsbindung. */
  years: LoanYear[];
  /**
   * True, wenn die Tilgung so niedrig angesetzt ist, dass die Rückzahlung
   * länger als 60 Jahre dauern würde. Bei einem Annuitätendarlehen deckt die
   * Rate die Zinsen zwar immer (sie ist die Summe aus Zins und Tilgung), bei
   * sehr kleiner Anfangstilgung wächst die Laufzeit aber ins Unrealistische.
   */
  exceedsMaxTerm: boolean;
}

/** Obergrenze für die Simulation: 60 Jahre. Verhindert Endlosschleifen. */
const MAX_MONTHS = 720;

export function calculateLoan(input: {
  /** Darlehenssumme in Euro. */
  amount: number;
  /** Sollzins pro Jahr in Prozent. */
  annualRate: number;
  /** Anfängliche Tilgung pro Jahr in Prozent. */
  repaymentRate: number;
  /** Zinsbindung in Jahren. */
  fixedYears: number;
}): LoanResult | null {
  const { amount, annualRate, repaymentRate, fixedYears } = input;

  if (amount <= 0 || fixedYears <= 0) return null;
  if (annualRate < 0 || repaymentRate <= 0) return null;

  const monthlyRate = (amount * (annualRate + repaymentRate)) / 100 / 12;
  const monthlyInterestRate = annualRate / 100 / 12;

  let balance = amount;
  let interestPaid = 0;
  let principalPaid = 0;
  const fixedMonths = Math.round(fixedYears * 12);
  const years: LoanYear[] = [];

  let yearInterest = 0;
  let yearPrincipal = 0;

  for (let month = 1; month <= fixedMonths && balance > 0; month += 1) {
    const interest = balance * monthlyInterestRate;
    // Die letzte Rate kann kleiner ausfallen als die reguläre Annuität.
    const principal = Math.min(monthlyRate - interest, balance);
    if (principal <= 0) break;

    balance -= principal;
    interestPaid += interest;
    principalPaid += principal;
    yearInterest += interest;
    yearPrincipal += principal;

    if (month % 12 === 0 || balance <= 0) {
      years.push({
        year: Math.ceil(month / 12),
        interest: round(yearInterest, 2),
        principal: round(yearPrincipal, 2),
        balance: round(Math.max(balance, 0), 2),
      });
      yearInterest = 0;
      yearPrincipal = 0;
    }
  }

  // Gesamtlaufzeit bis zur vollständigen Tilgung getrennt simulieren.
  let simBalance = amount;
  let months = 0;
  while (simBalance > 0 && months < MAX_MONTHS) {
    const interest = simBalance * monthlyInterestRate;
    simBalance -= Math.min(monthlyRate - interest, simBalance);
    months += 1;
  }
  const exceedsMaxTerm = simBalance > 0;
  const totalMonths = exceedsMaxTerm ? null : months;

  return {
    monthlyRate: round(monthlyRate, 2),
    remainingDebt: round(Math.max(balance, 0), 2),
    interestPaid: round(interestPaid, 2),
    principalPaid: round(principalPaid, 2),
    totalMonths,
    years,
    exceedsMaxTerm,
  };
}

/**
 * Rate aus einer gewünschten Laufzeit ableiten (klassische Annuitätenformel).
 * Wird für die Gegenprobe im Rechenbeispiel verwendet.
 */
export function annuityFromTerm(
  amount: number,
  annualRate: number,
  months: number,
): number | null {
  if (amount <= 0 || months <= 0) return null;
  const i = annualRate / 100 / 12;
  if (i === 0) return round(amount / months, 2);

  const factor = (1 + i) ** months;
  const rate = safeDivide(amount * i * factor, factor - 1);
  return rate === null ? null : round(rate, 2);
}
