import { describe, expect, it } from "vitest";
import {
  calculateDiscount,
  combineDiscounts,
} from "@/lib/calculators/discount";

describe("calculateDiscount – Endpreis", () => {
  it("zieht den Rabatt vom Originalpreis ab", () => {
    const result = calculateDiscount({
      mode: "endpreis",
      originalPrice: 200,
      rate: 25,
    })!;
    expect(result.finalPrice).toBe(150);
    expect(result.savings).toBe(50);
    expect(result.rate).toBe(25);
  });

  it("lässt bei 0 Prozent den Preis unverändert", () => {
    const result = calculateDiscount({
      mode: "endpreis",
      originalPrice: 89.9,
      rate: 0,
    })!;
    expect(result.finalPrice).toBe(89.9);
    expect(result.savings).toBe(0);
  });

  it("ergibt bei 100 Prozent den Preis null", () => {
    const result = calculateDiscount({
      mode: "endpreis",
      originalPrice: 40,
      rate: 100,
    })!;
    expect(result.finalPrice).toBe(0);
    expect(result.savings).toBe(40);
  });

  it("rundet kaufmännisch auf zwei Stellen", () => {
    const result = calculateDiscount({
      mode: "endpreis",
      originalPrice: 19.99,
      rate: 33,
    })!;
    // 19,99 × 0,67 = 13,3933
    expect(result.finalPrice).toBe(13.39);
  });

  it("lehnt Rabattsätze ausserhalb von 0 bis 100 Prozent ab", () => {
    expect(
      calculateDiscount({ mode: "endpreis", originalPrice: 100, rate: -5 }),
    ).toBeNull();
    expect(
      calculateDiscount({ mode: "endpreis", originalPrice: 100, rate: 120 }),
    ).toBeNull();
  });
});

describe("calculateDiscount – Rabattsatz", () => {
  it("berechnet den Satz aus zwei Preisen", () => {
    const result = calculateDiscount({
      mode: "rabattsatz",
      originalPrice: 80,
      finalPrice: 60,
    })!;
    expect(result.rate).toBe(25);
    expect(result.savings).toBe(20);
  });

  it("verhindert die Division durch null bei Originalpreis 0", () => {
    expect(
      calculateDiscount({
        mode: "rabattsatz",
        originalPrice: 0,
        finalPrice: 0,
      }),
    ).toBeNull();
  });

  it("lehnt einen Endpreis über dem Originalpreis ab", () => {
    expect(
      calculateDiscount({
        mode: "rabattsatz",
        originalPrice: 50,
        finalPrice: 60,
      }),
    ).toBeNull();
  });
});

describe("calculateDiscount – Originalpreis", () => {
  it("rechnet den Preis vor dem Rabatt zurück", () => {
    const result = calculateDiscount({
      mode: "originalpreis",
      finalPrice: 150,
      rate: 25,
    })!;
    expect(result.originalPrice).toBe(200);
    expect(result.savings).toBe(50);
  });

  it("ist die Umkehrung der Endpreis-Berechnung", () => {
    const forward = calculateDiscount({
      mode: "endpreis",
      originalPrice: 249,
      rate: 30,
    })!;
    const back = calculateDiscount({
      mode: "originalpreis",
      finalPrice: forward.finalPrice,
      rate: 30,
    })!;
    expect(back.originalPrice).toBeCloseTo(249, 2);
  });

  it("lehnt 100 Prozent ab, weil der Originalpreis dann unbestimmt ist", () => {
    expect(
      calculateDiscount({ mode: "originalpreis", finalPrice: 0, rate: 100 }),
    ).toBeNull();
  });
});

describe("combineDiscounts", () => {
  it("addiert aufeinanderfolgende Rabatte nicht einfach", () => {
    // 20 % und danach 10 % ergeben 28 %, nicht 30 %.
    expect(combineDiscounts([20, 10])).toBe(28);
  });

  it("gibt bei einem einzelnen Rabatt genau diesen zurück", () => {
    expect(combineDiscounts([15])).toBe(15);
  });

  it("kommt auch bei drei Stufen nie über 100 Prozent", () => {
    const combined = combineDiscounts([50, 50, 50])!;
    expect(combined).toBeCloseTo(87.5, 2);
    expect(combined).toBeLessThan(100);
  });

  it("lehnt ungültige Eingaben ab", () => {
    expect(combineDiscounts([])).toBeNull();
    expect(combineDiscounts([10, -5])).toBeNull();
  });
});
