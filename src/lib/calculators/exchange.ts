import { round } from "./shared";

/**
 * Währungsumrechnung auf Basis einer Kurstabelle mit dem Euro als Bezugswährung.
 *
 * Die Referenzkurse der Europäischen Zentralbank sind so aufgebaut: Zu jeder
 * Währung ist angegeben, wie viele Einheiten einem Euro entsprechen. Der Kurs
 * zwischen zwei Fremdwährungen ergibt sich daraus als Kreuzkurs:
 *
 *   Kurs(A → B) = Kurs(EUR → B) ÷ Kurs(EUR → A)
 *
 * Beispiel: 1 EUR = 1,1534 USD und 1 EUR = 0,9373 CHF.
 * Dann ist 1 USD = 0,9373 ÷ 1,1534 = 0,8127 CHF.
 */

/** Einheiten der Währung je ein Euro. Der Euro selbst hat den Wert 1. */
export type RateTable = Readonly<Record<string, number>>;

export interface ConversionResult {
  amount: number;
  from: string;
  to: string;
  /** Umgerechneter Betrag. */
  converted: number;
  /** Wie viele Einheiten der Zielwährung eine Einheit der Ausgangswährung sind. */
  rate: number;
  /** Der umgekehrte Kurs, für die Gegenrichtung. */
  inverseRate: number;
}

/** Kurs zwischen zwei Währungen aus einer Euro-basierten Tabelle. */
export function crossRate(
  from: string,
  to: string,
  rates: RateTable,
): number | null {
  const fromRate = from === "EUR" ? 1 : rates[from];
  const toRate = to === "EUR" ? 1 : rates[to];
  if (!Number.isFinite(fromRate) || !Number.isFinite(toRate)) return null;
  if (!fromRate || !toRate || fromRate <= 0 || toRate <= 0) return null;
  return toRate / fromRate;
}

export function convertCurrency(input: {
  amount: number;
  from: string;
  to: string;
  rates: RateTable;
}): ConversionResult | null {
  const { amount, from, to, rates } = input;
  if (!Number.isFinite(amount) || amount < 0) return null;

  const rate = crossRate(from, to, rates);
  if (rate === null) return null;

  return {
    amount,
    from,
    to,
    converted: round(amount * rate, 2),
    // Vier Nachkommastellen, weil bei Währungen wie dem japanischen Yen sonst
    // jede Aussagekraft verloren ginge.
    rate: round(rate, 6),
    inverseRate: round(1 / rate, 6),
  };
}

/** Deutsche Bezeichnungen der Währungen aus der EZB-Referenztabelle. */
export const currencyNames: Readonly<Record<string, string>> = {
  EUR: "Euro",
  USD: "US-Dollar",
  CHF: "Schweizer Franken",
  GBP: "Britisches Pfund",
  JPY: "Japanischer Yen",
  AUD: "Australischer Dollar",
  BGN: "Bulgarischer Lew",
  BRL: "Brasilianischer Real",
  CAD: "Kanadischer Dollar",
  CNY: "Chinesischer Renminbi Yuan",
  CZK: "Tschechische Krone",
  DKK: "Dänische Krone",
  HKD: "Hongkong-Dollar",
  HUF: "Ungarischer Forint",
  IDR: "Indonesische Rupiah",
  ILS: "Israelischer Schekel",
  INR: "Indische Rupie",
  ISK: "Isländische Krone",
  KRW: "Südkoreanischer Won",
  MXN: "Mexikanischer Peso",
  MYR: "Malaysischer Ringgit",
  NOK: "Norwegische Krone",
  NZD: "Neuseeländischer Dollar",
  PHP: "Philippinischer Peso",
  PLN: "Polnischer Zloty",
  RON: "Rumänischer Leu",
  SEK: "Schwedische Krone",
  SGD: "Singapur-Dollar",
  THB: "Thailändischer Baht",
  TRY: "Türkische Lira",
  ZAR: "Südafrikanischer Rand",
};

export function currencyLabel(code: string): string {
  const name = currencyNames[code];
  return name ? `${code} – ${name}` : code;
}

/**
 * Sortiert die verfügbaren Währungen: erst die im deutschsprachigen Raum
 * gebräuchlichen, danach der Rest alphabetisch nach Code.
 */
const PREFERRED = ["EUR", "USD", "CHF", "GBP"];

export function currencyOptions(rates: RateTable): string[] {
  const all = ["EUR", ...Object.keys(rates).filter((code) => code !== "EUR")];
  const preferred = PREFERRED.filter((code) => all.includes(code));
  const rest = all
    .filter((code) => !preferred.includes(code))
    .sort((a, b) => a.localeCompare(b));
  return [...preferred, ...rest];
}
