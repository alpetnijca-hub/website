/**
 * Gemeinsame Bausteine aller Rechner.
 *
 * Grundsätze:
 *  - Alle Berechnungsfunktionen sind reine Funktionen ohne React-Bezug.
 *  - Eingaben kommen als String aus dem Formular und werden hier geprüft.
 *  - Ungültige Eingaben führen nie zu NaN, Infinity oder negativen Ergebnissen,
 *    sondern zu einer verständlichen Fehlermeldung.
 */

export interface NumericSpec {
  /** Kleinster fachlich sinnvoller Wert (einschliesslich). */
  min: number;
  /** Grösster fachlich sinnvoller Wert (einschliesslich). */
  max: number;
  /** Einheit für die Fehlermeldung, z. B. "kg". */
  unit?: string;
  /** Nur ganze Zahlen zulassen (z. B. Alter). */
  integer?: boolean;
}

export type ParseResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

/** Formatiert eine Zahl für Fehlermeldungen in deutscher Schreibweise. */
function forMessage(value: number, unit?: string): string {
  const text = new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 2,
  }).format(value);
  return unit ? `${text} ${unit}` : text;
}

/**
 * Prüft eine Zahleneingabe gegen ihre fachlichen Grenzen.
 *
 * Fängt ab: leere Eingabe, Text, Komma statt Punkt, NaN, Infinity,
 * negative Werte, Null (sofern min > 0) sowie unrealistische Extremwerte.
 */
export function parseNumeric(raw: string, spec: NumericSpec): ParseResult {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { ok: false, error: "Bitte gib einen Wert ein." };
  }

  // Deutsche Eingabegewohnheit: Komma als Dezimaltrennzeichen zulassen.
  const normalised = trimmed.replace(",", ".");
  const value = Number(normalised);

  if (!Number.isFinite(value)) {
    return { ok: false, error: "Bitte gib eine gültige Zahl ein." };
  }
  if (spec.integer && !Number.isInteger(value)) {
    return { ok: false, error: "Bitte gib eine ganze Zahl ein." };
  }
  if (value < spec.min) {
    return {
      ok: false,
      error: `Der Wert muss mindestens ${forMessage(spec.min, spec.unit)} betragen.`,
    };
  }
  if (value > spec.max) {
    return {
      ok: false,
      error: `Der Wert darf höchstens ${forMessage(spec.max, spec.unit)} betragen.`,
    };
  }

  return { ok: true, value };
}

/**
 * Rundet auf eine feste Anzahl Nachkommastellen.
 *
 * Die Verschiebung des Kommas erfolgt über die Exponentialschreibweise statt
 * über eine Multiplikation. Damit wird 2,345 zu 2,35 gerundet und nicht – wie
 * bei der naiven Multiplikation mit 100 – wegen der Gleitkomma-Darstellung
 * fälschlich zu 2,34.
 */
export function round(value: number, decimals = 0): number {
  if (!Number.isFinite(value)) return 0;
  if (decimals === 0) return Math.round(value);

  // Das Komma wird über den Exponenten verschoben, nicht durch Anhängen von
  // "e10" an die Zahl selbst: Steht der Wert bereits in
  // Exponentialschreibweise – bei sehr kleinen Zahlen wie 6.2e-7 tut er das –,
  // ergäbe das Anhängen "6.2e-7e10" und damit NaN.
  const shifted = shiftExponent(value, decimals);
  if (!Number.isFinite(shifted)) return Math.round(value);

  const result = shiftExponent(Math.round(shifted), -decimals);
  return Number.isFinite(result) ? result : Math.round(value);
}

/** Verschiebt das Komma um `by` Stellen, ohne Multiplikation mit 10er-Potenzen. */
function shiftExponent(value: number, by: number): number {
  if (value === 0) return 0;
  const [mantissa, exponent] = value.toExponential().split("e");
  return Number(`${mantissa}e${Number(exponent) + by}`);
}

/**
 * Sichere Division: gibt bei Nenner 0 (oder ungültigen Werten) null zurück,
 * statt Infinity oder NaN weiterzureichen.
 */
export function safeDivide(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return null;
  if (denominator === 0) return null;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : null;
}

/* --------------------------------------------------------------------------
 * Fachlich gültige Wertebereiche
 *
 * Die Grenzen sind bewusst weit gefasst, aber nicht unbegrenzt: Ausserhalb
 * dieser Bereiche liefern die zugrunde liegenden Formeln keine sinnvollen
 * Ergebnisse mehr.
 * ------------------------------------------------------------------------ */

export const LIMITS = {
  /** Körpergewicht in kg. */
  weight: { min: 30, max: 300, unit: "kg" } satisfies NumericSpec,
  /** Körpergrösse in cm. */
  height: { min: 120, max: 250, unit: "cm" } satisfies NumericSpec,
  /** Alter in Jahren. Die Mifflin-St-Jeor-Formel gilt für Erwachsene. */
  age: { min: 15, max: 100, unit: "Jahre", integer: true } satisfies NumericSpec,
  /** Kalorienangaben. */
  calories: { min: 800, max: 8000, unit: "kcal" } satisfies NumericSpec,
  /** Tägliches Defizit oder Überschuss. */
  calorieChange: { min: 0, max: 1500, unit: "kcal" } satisfies NumericSpec,
  /** Dauer einer Aktivität in Minuten. */
  duration: { min: 1, max: 600, unit: "Minuten" } satisfies NumericSpec,
  /** Trainingsdauer pro Tag in Minuten (0 = kein Training). */
  trainingMinutes: { min: 0, max: 480, unit: "Minuten" } satisfies NumericSpec,
} as const;

/* --------------------------------------------------------------------------
 * Gemeinsame Auswahlwerte
 * ------------------------------------------------------------------------ */

export type Sex = "weiblich" | "maennlich";

export type ActivityLevel =
  | "sitzend"
  | "leicht"
  | "maessig"
  | "hoch"
  | "sehr-hoch";

/**
 * PAL-Faktoren (Physical Activity Level) zur Umrechnung von Grundumsatz
 * in Gesamtumsatz. Die verwendeten Stufen sind die in der Ernährungs-
 * literatur gebräuchlichen Richtwerte.
 */
export const activityFactors: Record<
  ActivityLevel,
  { factor: number; label: string; description: string }
> = {
  sitzend: {
    factor: 1.2,
    label: "Sitzend",
    description: "Bürojob, kaum Bewegung, kein regelmässiger Sport",
  },
  leicht: {
    factor: 1.375,
    label: "Leicht aktiv",
    description: "Leichte Bewegung oder Sport an 1–3 Tagen pro Woche",
  },
  maessig: {
    factor: 1.55,
    label: "Mässig aktiv",
    description: "Sport an 3–5 Tagen pro Woche oder stehende Tätigkeit",
  },
  hoch: {
    factor: 1.725,
    label: "Sehr aktiv",
    description: "Intensiver Sport an 6–7 Tagen pro Woche",
  },
  "sehr-hoch": {
    factor: 1.9,
    label: "Extrem aktiv",
    description: "Körperliche Schwerarbeit oder zweimal täglich Training",
  },
};

export type Goal = "abnehmen" | "halten" | "zunehmen";

export const goalLabels: Record<Goal, string> = {
  abnehmen: "Abnehmen",
  halten: "Gewicht halten",
  zunehmen: "Zunehmen",
};

/**
 * Energiegehalt von einem Kilogramm Körpergewebe in Kilokalorien.
 *
 * Der Wert geht auf Wishnofsky (1958) zurück (3500 kcal je Pfund Fettgewebe
 * ≈ 7700 kcal je Kilogramm). Er beschreibt reines Fettgewebe; in der Praxis
 * besteht eine Gewichtsveränderung auch aus Wasser und Muskelmasse, weshalb
 * die tatsächliche Veränderung abweicht (siehe Hall et al. 2011).
 */
export const KCAL_PER_KG_BODY_FAT = 7700;
