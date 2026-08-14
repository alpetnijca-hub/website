/**
 * Zufallszahlen in einem frei wählbaren Bereich.
 *
 * Zwei Punkte, an denen einfache Umsetzungen fehlerhaft sind:
 *
 * 1. `Math.floor(Math.random() * range)` liefert keine gleichverteilten Werte,
 *    sobald man aus einer 32-Bit-Zufallszahl zieht: Der Rest der Division
 *    verteilt sich ungleich auf die möglichen Ergebnisse. Deshalb wird hier
 *    mit Verwerfung gearbeitet – Werte im ungleich verteilten Rest werden
 *    weggeworfen und neu gezogen.
 *
 * 2. Für Ziehungen ohne Wiederholung genügt es nicht, so lange zu ziehen, bis
 *    genügend verschiedene Zahlen zusammenkommen: Bei einer Ziehung, die fast
 *    den ganzen Bereich umfasst, dauert das beliebig lange. Für kleine
 *    Bereiche wird deshalb gemischt statt gezogen.
 *
 * Die Zufallsquelle ist austauschbar, damit die Funktionen mit einer festen
 * Folge geprüft werden können. Voreinstellung ist `crypto.getRandomValues`.
 */

/** Liefert eine ganzzahlige Zufallszahl im Bereich 0 bis 2³²−1. */
export type RandomSource = () => number;

const UINT32_RANGE = 2 ** 32;

/** Grösster Bereich, für den zum Mischen ein Array angelegt wird. */
const SHUFFLE_LIMIT = 100_000;

export const defaultRandomSource: RandomSource = () => {
  const globalCrypto =
    typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  if (globalCrypto?.getRandomValues) {
    return globalCrypto.getRandomValues(new Uint32Array(1))[0];
  }
  // Rückfall für Umgebungen ohne Web-Crypto. Für Spiel- und Losentscheide
  // ausreichend, für kryptografische Zwecke nicht.
  return Math.floor(Math.random() * UINT32_RANGE);
};

/**
 * Gleichverteilte ganze Zahl von min bis max, beide einschliesslich.
 */
export function randomInt(
  min: number,
  max: number,
  random: RandomSource = defaultRandomSource,
): number | null {
  if (!Number.isInteger(min) || !Number.isInteger(max)) return null;
  if (max < min) return null;

  const range = max - min + 1;
  if (range > UINT32_RANGE) return null;
  if (range === 1) return min;

  // Alles ab dieser Grenze würde einzelne Ergebnisse bevorzugen und wird
  // deshalb verworfen.
  const limit = Math.floor(UINT32_RANGE / range) * range;

  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const value = random() >>> 0;
    if (value < limit) return min + (value % range);
  }
  // Praktisch unerreichbar: Die Verwerfungsrate liegt immer unter 50 Prozent.
  return null;
}

export interface RandomDrawInput {
  min: number;
  max: number;
  /** Anzahl der zu ziehenden Zahlen. */
  count: number;
  /** true = jede Zahl höchstens einmal (Ziehung wie beim Lotto). */
  unique: boolean;
  /** Ergebnis aufsteigend sortieren. */
  sorted?: boolean;
}

export interface RandomDrawResult {
  numbers: number[];
  /** Zahl der möglichen Werte im gewählten Bereich. */
  poolSize: number;
}

export function drawNumbers(
  input: RandomDrawInput,
  random: RandomSource = defaultRandomSource,
): RandomDrawResult | null {
  const { min, max, count, unique, sorted = false } = input;

  if (!Number.isInteger(min) || !Number.isInteger(max)) return null;
  if (!Number.isInteger(count) || count < 1) return null;
  if (max < min) return null;

  const poolSize = max - min + 1;
  if (poolSize > UINT32_RANGE) return null;
  // Ohne Wiederholung kann es nie mehr Zahlen geben als der Bereich hergibt.
  if (unique && count > poolSize) return null;

  const numbers: number[] = [];

  if (!unique) {
    for (let i = 0; i < count; i += 1) {
      const value = randomInt(min, max, random);
      if (value === null) return null;
      numbers.push(value);
    }
  } else if (poolSize <= SHUFFLE_LIMIT) {
    // Teilweises Mischen nach Fisher und Yates: Für jeden benötigten Platz
    // wird ein zufälliger Rest-Eintrag nach vorne getauscht. Das ist auch dann
    // schnell, wenn fast der ganze Bereich gezogen wird.
    const pool = Array.from({ length: poolSize }, (_, i) => min + i);
    for (let i = 0; i < count; i += 1) {
      const j = randomInt(i, poolSize - 1, random);
      if (j === null) return null;
      [pool[i], pool[j]] = [pool[j], pool[i]];
      numbers.push(pool[i]);
    }
  } else {
    // Grosser Bereich, vergleichsweise wenige Zahlen: Ein Array anzulegen wäre
    // verschwenderisch, Wiederholungen sind hier selten.
    const seen = new Set<number>();
    let guard = 0;
    while (numbers.length < count) {
      guard += 1;
      if (guard > count * 100) return null;
      const value = randomInt(min, max, random);
      if (value === null) return null;
      if (seen.has(value)) continue;
      seen.add(value);
      numbers.push(value);
    }
  }

  return {
    numbers: sorted ? [...numbers].sort((a, b) => a - b) : numbers,
    poolSize,
  };
}
