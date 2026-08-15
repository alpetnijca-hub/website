import { describe, expect, it } from "vitest";
import {
  convertUnit,
  findCategory,
  fromCelsius,
  toCelsius,
} from "@/lib/calculators/units";
import { calculateRatio } from "@/lib/calculators/ratio";
import { calculateTip } from "@/lib/calculators/tip";

const laenge = findCategory("laenge")!;
const gewicht = findCategory("gewicht")!;
const temperatur = findCategory("temperatur")!;
const geschwindigkeit = findCategory("geschwindigkeit")!;

describe("convertUnit – Länge", () => {
  it("rechnet Zentimeter in Zoll um", () => {
    // Ein Zoll ist exakt 2,54 cm definiert.
    const result = convertUnit({
      value: 2.54,
      from: "cm",
      to: "in",
      category: laenge,
    })!;
    expect(result.converted).toBe(1);
  });

  it("rechnet Kilometer in Meilen um", () => {
    const result = convertUnit({
      value: 1,
      from: "mi",
      to: "km",
      category: laenge,
    })!;
    expect(result.converted).toBeCloseTo(1.6093, 4);
  });

  it("ist umkehrbar", () => {
    const hin = convertUnit({
      value: 180,
      from: "cm",
      to: "ft",
      category: laenge,
    })!;
    const zurueck = convertUnit({
      value: hin.converted,
      from: "ft",
      to: "cm",
      category: laenge,
    })!;
    expect(zurueck.converted).toBeCloseTo(180, 3);
  });

  it("zeigt auch sehr kleine Ergebnisse mit Aussagekraft", () => {
    // 1 mm in Meilen wäre auf zwei Stellen gerundet schlicht 0.
    const result = convertUnit({
      value: 1,
      from: "mm",
      to: "mi",
      category: laenge,
    })!;
    expect(result.converted).toBeGreaterThan(0);
  });

  it("nennt den Wert einer einzelnen Einheit", () => {
    const result = convertUnit({
      value: 5,
      from: "km",
      to: "m",
      category: laenge,
    })!;
    expect(result.perUnit).toBe(1000);
    expect(result.converted).toBe(5000);
  });
});

describe("convertUnit – Gewicht", () => {
  it("rechnet Kilogramm in Pfund um", () => {
    const result = convertUnit({
      value: 1,
      from: "kg",
      to: "lb",
      category: gewicht,
    })!;
    expect(result.converted).toBeCloseTo(2.2046, 3);
  });

  it("rechnet Unzen in Gramm um", () => {
    const result = convertUnit({
      value: 1,
      from: "oz",
      to: "g",
      category: gewicht,
    })!;
    expect(result.converted).toBeCloseTo(28.3495, 3);
  });
});

describe("convertUnit – Temperatur", () => {
  it("kennt die Fixpunkte des Wassers", () => {
    expect(toCelsius(32, "f")).toBe(0);
    expect(toCelsius(212, "f")).toBe(100);
    expect(fromCelsius(0, "f")).toBe(32);
    expect(fromCelsius(100, "f")).toBe(212);
  });

  it("kennt den Schnittpunkt beider Skalen", () => {
    // −40 ist der einzige Wert, der in Celsius und Fahrenheit gleich ist.
    expect(toCelsius(-40, "f")).toBe(-40);
  });

  it("rechnet Kelvin richtig um", () => {
    expect(fromCelsius(0, "k")).toBeCloseTo(273.15, 5);
    expect(toCelsius(273.15, "k")).toBeCloseTo(0, 5);
  });

  it("rechnet nicht mit einem Faktor", () => {
    // 20 °C sind 68 °F – mit einem Faktor käme hier Unsinn heraus.
    const result = convertUnit({
      value: 20,
      from: "c",
      to: "f",
      category: temperatur,
    })!;
    expect(result.converted).toBe(68);
  });

  it("lehnt Temperaturen unter dem absoluten Nullpunkt ab", () => {
    expect(
      convertUnit({ value: -300, from: "c", to: "f", category: temperatur }),
    ).toBeNull();
    expect(
      convertUnit({ value: -1, from: "k", to: "c", category: temperatur }),
    ).toBeNull();
  });
});

describe("convertUnit – Geschwindigkeit", () => {
  it("rechnet Stundenkilometer in Meter pro Sekunde um", () => {
    const result = convertUnit({
      value: 36,
      from: "kmh",
      to: "ms",
      category: geschwindigkeit,
    })!;
    expect(result.converted).toBe(10);
  });

  it("rechnet Knoten in Stundenkilometer um", () => {
    const result = convertUnit({
      value: 1,
      from: "kn",
      to: "kmh",
      category: geschwindigkeit,
    })!;
    expect(result.converted).toBeCloseTo(1.852, 3);
  });
});

describe("convertUnit – Grenzfälle", () => {
  it("gibt bei gleicher Einheit denselben Wert zurück", () => {
    const result = convertUnit({
      value: 42,
      from: "m",
      to: "m",
      category: laenge,
    })!;
    expect(result.converted).toBe(42);
  });

  it("lehnt unbekannte Einheiten ab", () => {
    expect(
      convertUnit({ value: 1, from: "xyz", to: "m", category: laenge }),
    ).toBeNull();
  });
});

describe("calculateRatio", () => {
  it("löst den proportionalen Dreisatz", () => {
    // 3 Brötchen kosten 1,50 € – was kosten 7?
    const result = calculateRatio({ a: 3, b: 1.5, c: 7, mode: "proportional" })!;
    expect(result.perUnit).toBe(0.5);
    expect(result.value).toBe(3.5);
    expect(result.steps).toHaveLength(2);
  });

  it("löst den umgekehrt proportionalen Dreisatz", () => {
    // 4 Arbeiter brauchen 6 Stunden – wie lange brauchen 3?
    const result = calculateRatio({ a: 4, b: 6, c: 3, mode: "umgekehrt" })!;
    expect(result.value).toBe(8);
  });

  it("unterscheidet die beiden Richtungen deutlich", () => {
    const pro = calculateRatio({ a: 4, b: 6, c: 8, mode: "proportional" })!;
    const um = calculateRatio({ a: 4, b: 6, c: 8, mode: "umgekehrt" })!;
    expect(pro.value).toBe(12);
    expect(um.value).toBe(3);
  });

  it("verhindert die Division durch null", () => {
    expect(
      calculateRatio({ a: 0, b: 5, c: 3, mode: "proportional" }),
    ).toBeNull();
    expect(calculateRatio({ a: 4, b: 6, c: 0, mode: "umgekehrt" })).toBeNull();
  });

  it("erlaubt beim proportionalen Dreisatz die Menge null", () => {
    const result = calculateRatio({ a: 3, b: 1.5, c: 0, mode: "proportional" })!;
    expect(result.value).toBe(0);
  });

  it("lehnt negative Werte ab", () => {
    expect(
      calculateRatio({ a: -3, b: 1.5, c: 7, mode: "proportional" }),
    ).toBeNull();
  });
});

describe("calculateTip", () => {
  const base = { bill: 50, rate: 10, people: 1 };

  it("berechnet Trinkgeld und Gesamtbetrag", () => {
    const result = calculateTip(base)!;
    expect(result.tip).toBe(5);
    expect(result.total).toBe(55);
    expect(result.rate).toBe(10);
  });

  it("teilt durch die Zahl der Personen", () => {
    const result = calculateTip({ ...base, people: 4 })!;
    expect(result.perPerson).toBe(13.75);
    expect(result.tipPerPerson).toBe(1.25);
  });

  it("rundet den Gesamtbetrag auf Wunsch auf", () => {
    // 47,30 € plus 10 % sind 52,03 € – aufgerundet 53 €.
    const result = calculateTip({
      bill: 47.3,
      rate: 10,
      people: 1,
      roundUp: true,
    })!;
    expect(result.total).toBe(53);
    expect(result.tip).toBe(5.7);
    // Der tatsächliche Satz weicht dann vom eingestellten ab.
    expect(result.rate).toBeCloseTo(12.05, 1);
  });

  it("kommt ohne Trinkgeld zurecht", () => {
    const result = calculateTip({ ...base, rate: 0 })!;
    expect(result.tip).toBe(0);
    expect(result.total).toBe(50);
  });

  it("gibt bei einer Rechnung von 0 € keinen Prozentsatz aus", () => {
    const result = calculateTip({ ...base, bill: 0 })!;
    expect(result.total).toBe(0);
    expect(result.rate).toBe(0);
  });

  it("lehnt ungültige Eingaben ab", () => {
    expect(calculateTip({ ...base, bill: -1 })).toBeNull();
    expect(calculateTip({ ...base, rate: 150 })).toBeNull();
    expect(calculateTip({ ...base, people: 0 })).toBeNull();
    expect(calculateTip({ ...base, people: 2.5 })).toBeNull();
  });
});

describe("Rechenweg des Dreisatzes", () => {
  it("schreibt Zahlen in deutscher Schreibweise", () => {
    const result = calculateRatio({ a: 3, b: 1.5, c: 7, mode: "proportional" })!;
    expect(result.steps[0].calculation).toBe("1,5 ÷ 3 = 0,5");
    expect(result.steps[1].calculation).toBe("0,5 × 7 = 3,5");
  });
});
