import { round, safeDivide } from "./shared";

/**
 * Einheitenumrechnung.
 *
 * Alle Einheiten einer Kategorie sind über einen Faktor zu einer Basiseinheit
 * definiert – Meter, Kilogramm, Quadratmeter, Liter, Meter pro Sekunde. Die
 * Umrechnung ist dann:
 *
 *   Ergebnis = Wert × Faktor(von) ÷ Faktor(nach)
 *
 * Die Temperatur ist der einzige Sonderfall: Ihre Skalen haben verschiedene
 * Nullpunkte, deshalb genügt kein Faktor. Multiplizierte man 20 °C mit einem
 * Faktor, käme Unsinn heraus – nötig sind Umrechnungsformeln.
 *
 * Die Faktoren sind exakte Definitionswerte: Ein Zoll ist seit 1959 auf genau
 * 25,4 Millimeter festgelegt, ein Pfund auf 0,45359237 Kilogramm.
 */

export interface Unit {
  id: string;
  /** Kurzform für die Anzeige, z. B. "km". */
  symbol: string;
  name: string;
  /** Wie viele Basiseinheiten eine Einheit ergibt. */
  factor: number;
}

export interface UnitCategory {
  id: string;
  label: string;
  /** Einheit, auf die alle Faktoren bezogen sind. */
  base: string;
  units: Unit[];
  /** Voreingestellte Umrechnung beim Öffnen. */
  defaults: { from: string; to: string };
}

export const unitCategories: UnitCategory[] = [
  {
    id: "laenge",
    label: "Länge",
    base: "Meter",
    defaults: { from: "cm", to: "in" },
    units: [
      { id: "mm", symbol: "mm", name: "Millimeter", factor: 0.001 },
      { id: "cm", symbol: "cm", name: "Zentimeter", factor: 0.01 },
      { id: "m", symbol: "m", name: "Meter", factor: 1 },
      { id: "km", symbol: "km", name: "Kilometer", factor: 1000 },
      { id: "in", symbol: "in", name: "Zoll", factor: 0.0254 },
      { id: "ft", symbol: "ft", name: "Fuss", factor: 0.3048 },
      { id: "yd", symbol: "yd", name: "Yard", factor: 0.9144 },
      { id: "mi", symbol: "mi", name: "Meile", factor: 1609.344 },
      { id: "nmi", symbol: "sm", name: "Seemeile", factor: 1852 },
    ],
  },
  {
    id: "gewicht",
    label: "Gewicht",
    base: "Kilogramm",
    defaults: { from: "kg", to: "lb" },
    units: [
      { id: "mg", symbol: "mg", name: "Milligramm", factor: 0.000001 },
      { id: "g", symbol: "g", name: "Gramm", factor: 0.001 },
      { id: "kg", symbol: "kg", name: "Kilogramm", factor: 1 },
      { id: "t", symbol: "t", name: "Tonne", factor: 1000 },
      { id: "lb", symbol: "lb", name: "Pfund (englisch)", factor: 0.45359237 },
      { id: "oz", symbol: "oz", name: "Unze", factor: 0.028349523125 },
      { id: "st", symbol: "st", name: "Stone", factor: 6.35029318 },
    ],
  },
  {
    id: "flaeche",
    label: "Fläche",
    base: "Quadratmeter",
    defaults: { from: "m2", to: "ft2" },
    units: [
      { id: "cm2", symbol: "cm²", name: "Quadratzentimeter", factor: 0.0001 },
      { id: "m2", symbol: "m²", name: "Quadratmeter", factor: 1 },
      { id: "a", symbol: "a", name: "Ar", factor: 100 },
      { id: "ha", symbol: "ha", name: "Hektar", factor: 10000 },
      { id: "km2", symbol: "km²", name: "Quadratkilometer", factor: 1000000 },
      { id: "ft2", symbol: "ft²", name: "Quadratfuss", factor: 0.09290304 },
      { id: "ac", symbol: "ac", name: "Acre", factor: 4046.8564224 },
    ],
  },
  {
    id: "volumen",
    label: "Volumen",
    base: "Liter",
    defaults: { from: "l", to: "gal" },
    units: [
      { id: "ml", symbol: "ml", name: "Milliliter", factor: 0.001 },
      { id: "l", symbol: "l", name: "Liter", factor: 1 },
      { id: "m3", symbol: "m³", name: "Kubikmeter", factor: 1000 },
      { id: "gal", symbol: "gal", name: "Gallone (US)", factor: 3.785411784 },
      { id: "galuk", symbol: "gal UK", name: "Gallone (UK)", factor: 4.54609 },
      { id: "pt", symbol: "pt", name: "Pint (US)", factor: 0.473176473 },
    ],
  },
  {
    id: "geschwindigkeit",
    label: "Geschwindigkeit",
    base: "Meter pro Sekunde",
    defaults: { from: "kmh", to: "mph" },
    units: [
      { id: "ms", symbol: "m/s", name: "Meter pro Sekunde", factor: 1 },
      { id: "kmh", symbol: "km/h", name: "Kilometer pro Stunde", factor: 1 / 3.6 },
      { id: "mph", symbol: "mph", name: "Meilen pro Stunde", factor: 0.44704 },
      { id: "kn", symbol: "kn", name: "Knoten", factor: 1852 / 3600 },
    ],
  },
];

/** Temperaturen brauchen eigene Formeln – siehe Kommentar oben. */
export const temperatureUnits: Unit[] = [
  { id: "c", symbol: "°C", name: "Grad Celsius", factor: 1 },
  { id: "f", symbol: "°F", name: "Grad Fahrenheit", factor: 1 },
  { id: "k", symbol: "K", name: "Kelvin", factor: 1 },
];

export const temperatureCategory: UnitCategory = {
  id: "temperatur",
  label: "Temperatur",
  base: "Grad Celsius",
  defaults: { from: "c", to: "f" },
  units: temperatureUnits,
};

/** Der absolute Nullpunkt – tiefer geht es physikalisch nicht. */
export const ABSOLUTE_ZERO_C = -273.15;

export function toCelsius(value: number, from: string): number | null {
  if (from === "c") return value;
  if (from === "f") return ((value - 32) * 5) / 9;
  if (from === "k") return value + ABSOLUTE_ZERO_C;
  return null;
}

export function fromCelsius(celsius: number, to: string): number | null {
  if (to === "c") return celsius;
  if (to === "f") return (celsius * 9) / 5 + 32;
  if (to === "k") return celsius - ABSOLUTE_ZERO_C;
  return null;
}

export interface ConversionResult {
  value: number;
  /** Ergebnis, gerundet auf eine sinnvolle Stellenzahl. */
  converted: number;
  /** Wert einer einzelnen Einheit, für die Angabe "1 x = y". */
  perUnit: number;
}

/**
 * Rundet auf so viele Stellen, dass auch sehr kleine Ergebnisse noch
 * aussagekräftig sind: 1 mm in Meilen wäre sonst schlicht 0.
 */
function smartRound(value: number): number {
  const size = Math.abs(value);
  if (size === 0) return 0;
  if (size >= 1000) return round(value, 2);
  if (size >= 1) return round(value, 4);
  if (size >= 0.001) return round(value, 6);
  return round(value, 10);
}

export function convertUnit(input: {
  value: number;
  from: string;
  to: string;
  category: UnitCategory;
}): ConversionResult | null {
  const { value, from, to, category } = input;
  if (!Number.isFinite(value)) return null;

  if (category.id === "temperatur") {
    const celsius = toCelsius(value, from);
    if (celsius === null) return null;
    // Unterhalb des absoluten Nullpunkts gibt es keine Temperatur.
    if (celsius < ABSOLUTE_ZERO_C) return null;
    const converted = fromCelsius(celsius, to);
    const perUnitCelsius = toCelsius(1, from);
    if (converted === null || perUnitCelsius === null) return null;
    const perUnit = fromCelsius(perUnitCelsius, to);
    if (perUnit === null) return null;
    return {
      value,
      converted: round(converted, 2),
      perUnit: round(perUnit, 2),
    };
  }

  const fromUnit = category.units.find((unit) => unit.id === from);
  const toUnit = category.units.find((unit) => unit.id === to);
  if (!fromUnit || !toUnit) return null;

  const ratio = safeDivide(fromUnit.factor, toUnit.factor);
  if (ratio === null) return null;

  return {
    value,
    converted: smartRound(value * ratio),
    perUnit: smartRound(ratio),
  };
}

export function findCategory(id: string): UnitCategory | undefined {
  if (id === temperatureCategory.id) return temperatureCategory;
  return unitCategories.find((category) => category.id === id);
}

/** Alle Kategorien einschliesslich Temperatur, in Anzeigereihenfolge. */
export const allUnitCategories: UnitCategory[] = [
  ...unitCategories.slice(0, 2),
  temperatureCategory,
  ...unitCategories.slice(2),
];
