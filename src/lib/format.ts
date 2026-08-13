/** Zahlformatierung für deutsche Schreibweise (Komma als Dezimaltrennzeichen). */

const LOCALE = "de-DE";

export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return "–";
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Ganze Kalorienangabe, z. B. "2.145 kcal". */
export function formatKcal(value: number): string {
  return `${formatNumber(Math.round(value))} kcal`;
}

/** Gewicht in Kilogramm mit einer Nachkommastelle. */
export function formatKg(value: number, decimals = 1): string {
  return `${formatNumber(value, decimals)} kg`;
}

export function formatGrams(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals)} g`;
}

export function formatPercent(value: number, decimals = 0): string {
  return `${formatNumber(value, decimals)} %`;
}

/** Millilitermenge, ab 1000 ml in Litern. */
export function formatVolume(milliliters: number): string {
  if (milliliters >= 1000) {
    return `${formatNumber(milliliters / 1000, 1)} l`;
  }
  return `${formatNumber(Math.round(milliliters))} ml`;
}

/** Spanne, z. B. "112 – 140 g". */
export function formatRange(
  min: number,
  max: number,
  format: (value: number) => string,
): string {
  return `${format(min)} – ${format(max)}`;
}
