import { describe, expect, it } from "vitest";
import {
  convertCurrency,
  crossRate,
  currencyLabel,
  currencyOptions,
} from "@/lib/calculators/exchange";
import { parseEcbXml } from "@/lib/exchangeRates";

/** Ausschnitt aus einer echten EZB-Tabelle (Einheiten je Euro). */
const rates = { USD: 1.1534, CHF: 0.9373, GBP: 0.8549, JPY: 170.0 };

describe("crossRate", () => {
  it("gibt für den Euro als Ausgangswährung den Tabellenwert zurück", () => {
    expect(crossRate("EUR", "USD", rates)).toBeCloseTo(1.1534, 6);
  });

  it("gibt in die Gegenrichtung den Kehrwert zurück", () => {
    expect(crossRate("USD", "EUR", rates)).toBeCloseTo(1 / 1.1534, 6);
  });

  it("berechnet den Kreuzkurs zwischen zwei Fremdwährungen", () => {
    // 1 USD = 0,9373 / 1,1534 = 0,81264 CHF
    expect(crossRate("USD", "CHF", rates)).toBeCloseTo(0.81264, 5);
  });

  it("ergibt für dieselbe Währung genau 1", () => {
    expect(crossRate("CHF", "CHF", rates)).toBe(1);
    expect(crossRate("EUR", "EUR", rates)).toBe(1);
  });

  it("gibt null zurück, wenn eine Währung nicht in der Tabelle steht", () => {
    expect(crossRate("EUR", "XYZ", rates)).toBeNull();
    expect(crossRate("XYZ", "EUR", rates)).toBeNull();
  });
});

describe("convertCurrency", () => {
  it("rechnet einen Betrag um", () => {
    const result = convertCurrency({
      amount: 100,
      from: "EUR",
      to: "USD",
      rates,
    })!;
    expect(result.converted).toBe(115.34);
    expect(result.rate).toBeCloseTo(1.1534, 4);
  });

  it("nennt auch den Kurs der Gegenrichtung", () => {
    const result = convertCurrency({
      amount: 1,
      from: "EUR",
      to: "CHF",
      rates,
    })!;
    expect(result.rate).toBeCloseTo(0.9373, 4);
    expect(result.inverseRate).toBeCloseTo(1 / 0.9373, 4);
  });

  it("ist in beide Richtungen umkehrbar", () => {
    const hin = convertCurrency({ amount: 250, from: "CHF", to: "JPY", rates })!;
    const zurueck = convertCurrency({
      amount: hin.converted,
      from: "JPY",
      to: "CHF",
      rates,
    })!;
    expect(zurueck.converted).toBeCloseTo(250, 1);
  });

  it("gibt bei Betrag 0 auch 0 zurück", () => {
    expect(
      convertCurrency({ amount: 0, from: "EUR", to: "USD", rates })!.converted,
    ).toBe(0);
  });

  it("lehnt negative Beträge und unbekannte Währungen ab", () => {
    expect(
      convertCurrency({ amount: -5, from: "EUR", to: "USD", rates }),
    ).toBeNull();
    expect(
      convertCurrency({ amount: 5, from: "EUR", to: "ABC", rates }),
    ).toBeNull();
  });
});

describe("currencyOptions und currencyLabel", () => {
  it("stellt die gebräuchlichen Währungen voran", () => {
    expect(currencyOptions(rates).slice(0, 4)).toEqual([
      "EUR",
      "USD",
      "CHF",
      "GBP",
    ]);
  });

  it("führt jede Währung genau einmal auf", () => {
    const options = currencyOptions(rates);
    expect(new Set(options).size).toBe(options.length);
    expect(options).toContain("JPY");
  });

  it("beschriftet mit Code und Namen", () => {
    expect(currencyLabel("CHF")).toBe("CHF – Schweizer Franken");
    expect(currencyLabel("XYZ")).toBe("XYZ");
  });
});

describe("parseEcbXml", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01">
  <Cube>
    <Cube time='2026-08-13'>
      <Cube currency='USD' rate='1.1534'/>
      <Cube currency='JPY' rate='170.05'/>
      <Cube currency='CHF' rate='0.9373'/>
    </Cube>
  </Cube>
</gesmes:Envelope>`;

  it("liest Datum und Kurse", () => {
    const snapshot = parseEcbXml(xml)!;
    expect(snapshot.date).toBe("2026-08-13");
    expect(snapshot.rates.USD).toBe(1.1534);
    expect(snapshot.rates.CHF).toBe(0.9373);
    expect(Object.keys(snapshot.rates)).toHaveLength(3);
  });

  it("gibt bei fehlendem Datum null zurück", () => {
    expect(parseEcbXml("<Cube currency='USD' rate='1.15'/>")).toBeNull();
  });

  it("gibt bei fehlenden Kursen null zurück", () => {
    expect(parseEcbXml("<Cube time='2026-08-13'></Cube>")).toBeNull();
  });

  it("gibt bei völlig anderem Inhalt null zurück", () => {
    expect(parseEcbXml("<html><body>Fehler 503</body></html>")).toBeNull();
  });
});
