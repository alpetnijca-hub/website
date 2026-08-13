import { describe, expect, it } from "vitest";
import { calculatePercent } from "@/lib/calculators/percent";

describe("calculatePercent – Prozentwert", () => {
  it("berechnet den Prozentwert", () => {
    // 19 % von 250
    expect(calculatePercent({ mode: "wert", a: 250, b: 19 })?.value).toBe(47.5);
  });

  it("liefert bei 0 % den Wert null", () => {
    expect(calculatePercent({ mode: "wert", a: 250, b: 0 })?.value).toBe(0);
  });

  it("kommt mit einem Grundwert von 0 zurecht", () => {
    expect(calculatePercent({ mode: "wert", a: 0, b: 19 })?.value).toBe(0);
  });

  it("verarbeitet Sätze über 100 Prozent", () => {
    expect(calculatePercent({ mode: "wert", a: 200, b: 150 })?.value).toBe(300);
  });
});

describe("calculatePercent – Prozentsatz", () => {
  it("berechnet den Anteil in Prozent", () => {
    expect(calculatePercent({ mode: "satz", a: 45, b: 180 })?.value).toBe(25);
  });

  it("gibt Prozent als Einheit zurück", () => {
    expect(calculatePercent({ mode: "satz", a: 45, b: 180 })?.unit).toBe(
      "prozent",
    );
  });

  it("gibt bei Grundwert 0 null zurück statt Unendlich", () => {
    expect(calculatePercent({ mode: "satz", a: 45, b: 0 })).toBeNull();
  });
});

describe("calculatePercent – Grundwert", () => {
  it("berechnet den Grundwert zurück", () => {
    // 47,50 sind 19 % – wie gross ist das Ganze?
    expect(calculatePercent({ mode: "grundwert", a: 47.5, b: 19 })?.value).toBe(
      250,
    );
  });

  it("gibt bei Prozentsatz 0 null zurück", () => {
    expect(calculatePercent({ mode: "grundwert", a: 47.5, b: 0 })).toBeNull();
  });
});

describe("calculatePercent – Veränderung", () => {
  it("berechnet eine Zunahme", () => {
    const result = calculatePercent({ mode: "veraenderung", a: 200, b: 250 });
    expect(result?.value).toBe(25);
    expect(result?.note).toContain("Zunahme");
  });

  it("berechnet eine Abnahme mit negativem Vorzeichen", () => {
    const result = calculatePercent({ mode: "veraenderung", a: 250, b: 200 });
    expect(result?.value).toBe(-20);
    expect(result?.note).toContain("Abnahme");
  });

  it("meldet, wenn sich nichts geändert hat", () => {
    const result = calculatePercent({ mode: "veraenderung", a: 100, b: 100 });
    expect(result?.value).toBe(0);
    expect(result?.note).toContain("nicht verändert");
  });

  it("gibt bei altem Wert 0 null zurück", () => {
    expect(calculatePercent({ mode: "veraenderung", a: 0, b: 50 })).toBeNull();
  });

  it("rechnet auch bei negativem Ausgangswert korrekt", () => {
    // Von −100 auf −50 ist eine Verbesserung um 50 Prozent.
    const result = calculatePercent({ mode: "veraenderung", a: -100, b: -50 });
    expect(result?.value).toBe(50);
  });

  it("liefert einen nachvollziehbaren Rechenweg", () => {
    const result = calculatePercent({ mode: "veraenderung", a: 200, b: 250 });
    expect(result?.steps).toHaveLength(2);
  });
});
