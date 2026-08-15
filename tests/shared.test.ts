import { describe, expect, it } from "vitest";
import {
  LIMITS,
  parseNumeric,
  round,
  safeDivide,
} from "@/lib/calculators/shared";

describe("parseNumeric", () => {
  const spec = { min: 30, max: 300, unit: "kg" };

  it("akzeptiert gültige Zahlen", () => {
    expect(parseNumeric("75", spec)).toEqual({ ok: true, value: 75 });
  });

  it("akzeptiert Komma als Dezimaltrennzeichen", () => {
    expect(parseNumeric("75,5", spec)).toEqual({ ok: true, value: 75.5 });
  });

  it("ignoriert umgebende Leerzeichen", () => {
    expect(parseNumeric("  80  ", spec)).toEqual({ ok: true, value: 80 });
  });

  it("lehnt leere Eingaben ab", () => {
    const result = parseNumeric("", spec);
    expect(result.ok).toBe(false);
  });

  it("lehnt Text ab", () => {
    expect(parseNumeric("abc", spec).ok).toBe(false);
  });

  it("lehnt negative Werte ab", () => {
    expect(parseNumeric("-70", spec).ok).toBe(false);
  });

  it("lehnt null ab, wenn ein Mindestwert gefordert ist", () => {
    expect(parseNumeric("0", spec).ok).toBe(false);
  });

  it("lehnt Infinity ab", () => {
    expect(parseNumeric("Infinity", spec).ok).toBe(false);
    expect(parseNumeric("1e999", spec).ok).toBe(false);
  });

  it("lehnt Werte oberhalb der Obergrenze ab", () => {
    expect(parseNumeric("500", spec).ok).toBe(false);
  });

  it("akzeptiert die Grenzwerte selbst", () => {
    expect(parseNumeric("30", spec).ok).toBe(true);
    expect(parseNumeric("300", spec).ok).toBe(true);
  });

  it("verlangt ganze Zahlen, wenn gefordert", () => {
    expect(parseNumeric("30,5", LIMITS.age).ok).toBe(false);
    expect(parseNumeric("30", LIMITS.age).ok).toBe(true);
  });

  it("nennt die Einheit in der Fehlermeldung", () => {
    const result = parseNumeric("10", spec);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("kg");
  });
});

describe("safeDivide", () => {
  it("teilt normal", () => {
    expect(safeDivide(10, 4)).toBe(2.5);
  });

  it("gibt bei Division durch null null zurück", () => {
    expect(safeDivide(10, 0)).toBeNull();
  });

  it("gibt bei ungültigen Werten null zurück", () => {
    expect(safeDivide(Number.NaN, 2)).toBeNull();
    expect(safeDivide(10, Number.POSITIVE_INFINITY)).toBeNull();
  });
});

describe("round", () => {
  it("rundet auf die gewünschte Genauigkeit", () => {
    expect(round(2.345, 2)).toBe(2.35);
    expect(round(2.5)).toBe(3);
    expect(round(1.005, 2)).toBe(1.01);
  });

  it("rundet auch sehr kleine Zahlen, statt sie auf null zu setzen", () => {
    // Solche Werte stehen in JavaScript in Exponentialschreibweise da
    // (6.2e-7). Eine Rundung, die das Komma durch Anhängen von "e10"
    // verschiebt, ergibt dabei NaN und damit fälschlich 0 – etwa bei
    // einem Millimeter, umgerechnet in Meilen.
    expect(round(6.21371192237334e-7, 10)).toBe(6.214e-7);
    expect(round(1.5e-8, 10)).toBe(1.5e-8);
    expect(round(9.9e-9, 8)).toBe(1e-8);
  });

  it("rundet sehr grosse Zahlen", () => {
    expect(round(1.23456789e12, 2)).toBe(1234567890000);
  });

  it("behält die Null", () => {
    expect(round(0, 4)).toBe(0);
    // Ergebnis ist die positive Null: "-0" auf einer Seite anzuzeigen wäre
    // verwirrend.
    expect(round(-0.0001, 2)).toBe(0);
  });
});
