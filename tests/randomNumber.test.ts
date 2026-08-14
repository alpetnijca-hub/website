import { describe, expect, it } from "vitest";
import {
  drawNumbers,
  randomInt,
  type RandomSource,
} from "@/lib/calculators/randomNumber";

/** Zufallsquelle mit vorgegebener Folge – macht die Ziehung nachprüfbar. */
function fixed(values: number[]): RandomSource {
  let index = 0;
  return () => values[index++ % values.length];
}

const MAX_UINT32 = 2 ** 32;

describe("randomInt", () => {
  it("bildet den kleinsten Zufallswert auf die Untergrenze ab", () => {
    expect(randomInt(1, 6, fixed([0]))).toBe(1);
  });

  it("bildet den grössten gültigen Zufallswert auf die Obergrenze ab", () => {
    // Grösster nicht verworfener Wert: floor(2³²/6) × 6 − 1
    const limit = Math.floor(MAX_UINT32 / 6) * 6;
    expect(randomInt(1, 6, fixed([limit - 1]))).toBe(6);
  });

  it("verwirft Werte im ungleich verteilten Rest und zieht neu", () => {
    const limit = Math.floor(MAX_UINT32 / 6) * 6;
    // Der erste Wert liegt über der Grenze und muss verworfen werden.
    expect(randomInt(1, 6, fixed([limit + 1, 0]))).toBe(1);
  });

  it("gibt bei einem Bereich aus einer einzigen Zahl genau diese zurück", () => {
    expect(randomInt(7, 7, fixed([12345]))).toBe(7);
  });

  it("bleibt bei vielen Ziehungen innerhalb des Bereichs", () => {
    for (let i = 0; i < 500; i += 1) {
      const value = randomInt(-10, 10)!;
      expect(value).toBeGreaterThanOrEqual(-10);
      expect(value).toBeLessThanOrEqual(10);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it("lehnt ungültige Bereiche ab", () => {
    expect(randomInt(10, 1)).toBeNull();
    expect(randomInt(1.5, 6)).toBeNull();
  });
});

describe("drawNumbers", () => {
  it("zieht die gewünschte Anzahl", () => {
    const result = drawNumbers({ min: 1, max: 49, count: 6, unique: true })!;
    expect(result.numbers).toHaveLength(6);
    expect(result.poolSize).toBe(49);
  });

  it("liefert ohne Wiederholung nur verschiedene Zahlen", () => {
    for (let i = 0; i < 50; i += 1) {
      const { numbers } = drawNumbers({
        min: 1,
        max: 10,
        count: 10,
        unique: true,
      })!;
      expect(new Set(numbers).size).toBe(10);
      expect([...numbers].sort((a, b) => a - b)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);
    }
  });

  it("erlaubt mit Wiederholung mehr Zahlen als der Bereich hergibt", () => {
    const result = drawNumbers({ min: 1, max: 2, count: 20, unique: false })!;
    expect(result.numbers).toHaveLength(20);
    expect(result.numbers.every((n) => n === 1 || n === 2)).toBe(true);
  });

  it("lehnt ohne Wiederholung mehr Zahlen als möglich ab", () => {
    expect(
      drawNumbers({ min: 1, max: 5, count: 6, unique: true }),
    ).toBeNull();
  });

  it("sortiert auf Wunsch aufsteigend", () => {
    const { numbers } = drawNumbers({
      min: 1,
      max: 49,
      count: 6,
      unique: true,
      sorted: true,
    })!;
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });

  it("funktioniert auch bei sehr grossen Bereichen", () => {
    const { numbers } = drawNumbers({
      min: 1,
      max: 1_000_000_000,
      count: 5,
      unique: true,
    })!;
    expect(new Set(numbers).size).toBe(5);
    expect(numbers.every((n) => n >= 1 && n <= 1_000_000_000)).toBe(true);
  });

  it("kommt mit negativen Bereichen zurecht", () => {
    const { numbers } = drawNumbers({
      min: -5,
      max: -1,
      count: 5,
      unique: true,
    })!;
    expect([...numbers].sort((a, b) => a - b)).toEqual([-5, -4, -3, -2, -1]);
  });

  it("lehnt ungültige Eingaben ab", () => {
    expect(drawNumbers({ min: 1, max: 10, count: 0, unique: false })).toBeNull();
    expect(drawNumbers({ min: 10, max: 1, count: 3, unique: false })).toBeNull();
    expect(
      drawNumbers({ min: 1, max: 10, count: 2.5, unique: false }),
    ).toBeNull();
  });

  it("verteilt die Ergebnisse über den ganzen Bereich", () => {
    const counts = new Map<number, number>();
    for (let i = 0; i < 600; i += 1) {
      const value = drawNumbers({ min: 1, max: 6, count: 1, unique: false })!
        .numbers[0];
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    // Jede Augenzahl muss vorkommen; die genaue Häufigkeit ist zufällig.
    expect(counts.size).toBe(6);
    for (const value of counts.values()) {
      expect(value).toBeGreaterThan(20);
    }
  });
});
