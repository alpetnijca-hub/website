import { describe, expect, it } from "vitest";
import {
  calculateWorkTime,
  formatDuration,
  formatTime,
  parseTime,
  requiredBreak,
} from "@/lib/calculators/workTime";

describe("parseTime", () => {
  it("liest gültige Uhrzeiten", () => {
    expect(parseTime("08:00")).toBe(480);
    expect(parseTime("8:05")).toBe(485);
    expect(parseTime("00:00")).toBe(0);
    expect(parseTime("23:59")).toBe(1439);
  });

  it("weist ungültige Eingaben zurück", () => {
    expect(parseTime("")).toBeNull();
    expect(parseTime("24:00")).toBeNull();
    expect(parseTime("12:60")).toBeNull();
    expect(parseTime("acht Uhr")).toBeNull();
    expect(parseTime("12.30")).toBeNull();
  });
});

describe("formatTime und formatDuration", () => {
  it("gibt Uhrzeiten zweistellig aus", () => {
    expect(formatTime(485)).toBe("08:05");
    expect(formatTime(0)).toBe("00:00");
  });

  it("bricht Uhrzeiten über Mitternacht um", () => {
    expect(formatTime(1500)).toBe("01:00");
  });

  it("schreibt Dauern lesbar", () => {
    expect(formatDuration(462)).toBe("7 h 42 min");
    expect(formatDuration(480)).toBe("8 h");
    expect(formatDuration(45)).toBe("45 min");
  });
});

describe("requiredBreak", () => {
  it("verlangt unter 6 Stunden keine Pause", () => {
    expect(requiredBreak(6 * 60)).toBe(0);
  });

  it("verlangt über 6 Stunden 30 Minuten", () => {
    expect(requiredBreak(6 * 60 + 1)).toBe(30);
    expect(requiredBreak(9 * 60)).toBe(30);
  });

  it("verlangt über 9 Stunden 45 Minuten", () => {
    expect(requiredBreak(9 * 60 + 1)).toBe(45);
  });
});

describe("calculateWorkTime", () => {
  const base = {
    arrival: 8 * 60,
    departure: 17 * 60,
    breakMinutes: 30,
    breakCount: 1,
    targetHours: 8,
  };

  it("zieht die Pause von der Anwesenheit ab", () => {
    const result = calculateWorkTime(base)!;
    expect(result.presenceMinutes).toBe(540);
    expect(result.workMinutes).toBe(510);
  });

  it("gibt die Arbeitszeit auch als Dezimalstunden aus", () => {
    // 8 h 30 min = 8,5 Stunden
    expect(calculateWorkTime(base)!.workHoursDecimal).toBe(8.5);
    expect(
      calculateWorkTime({ ...base, departure: 16 * 60 + 12 })!.workHoursDecimal,
    ).toBe(7.7);
  });

  it("berechnet die Abweichung von der Sollzeit", () => {
    expect(calculateWorkTime(base)!.balanceMinutes).toBe(30);
    expect(
      calculateWorkTime({ ...base, departure: 16 * 60 })!.balanceMinutes,
    ).toBe(-30);
  });

  it("nennt die Uhrzeit, zu der die Sollzeit erreicht ist", () => {
    // 08:00 + 8 h Arbeit + 30 min Pause = 16:30
    expect(formatTime(calculateWorkTime(base)!.targetEndMinutes)).toBe("16:30");
  });

  it("erkennt eine fehlende Pflichtpause", () => {
    const result = calculateWorkTime({ ...base, breakMinutes: 0, breakCount: 0 })!;
    expect(result.requiredBreakMinutes).toBe(30);
    expect(result.missingBreakMinutes).toBe(30);
  });

  it("meldet keine fehlende Pause, wenn genug pausiert wurde", () => {
    expect(calculateWorkTime(base)!.missingBreakMinutes).toBe(0);
    expect(
      calculateWorkTime({ ...base, breakMinutes: 60 })!.missingBreakMinutes,
    ).toBe(0);
  });

  it("verlangt ab mehr als 9 Stunden Arbeitszeit 45 Minuten", () => {
    const result = calculateWorkTime({
      ...base,
      departure: 18 * 60 + 30,
      breakMinutes: 30,
    })!;
    expect(result.workMinutes).toBe(600);
    expect(result.requiredBreakMinutes).toBe(45);
    expect(result.missingBreakMinutes).toBe(15);
  });

  it("erkennt zu kurz aufgeteilte Pausen", () => {
    // Dreimal 10 Minuten erfüllen die Vorgabe nicht, weil jeder Teil
    // mindestens 15 Minuten dauern muss.
    const result = calculateWorkTime({
      ...base,
      breakMinutes: 30,
      breakCount: 3,
    })!;
    expect(result.breakLength).toBe(10);
    expect(result.breakPartsTooShort).toBe(true);
  });

  it("beanstandet zwei Pausen zu je 15 Minuten nicht", () => {
    const result = calculateWorkTime({
      ...base,
      breakMinutes: 30,
      breakCount: 2,
    })!;
    expect(result.breakPartsTooShort).toBe(false);
  });

  it("prüft die Teile nur, wenn überhaupt eine Pause vorgeschrieben ist", () => {
    const result = calculateWorkTime({
      ...base,
      departure: 13 * 60,
      breakMinutes: 20,
      breakCount: 4,
    })!;
    expect(result.requiredBreakMinutes).toBe(0);
    expect(result.breakPartsTooShort).toBe(false);
  });

  it("behandelt ein Gehen vor dem Kommen als Nachtschicht", () => {
    const result = calculateWorkTime({
      ...base,
      arrival: 22 * 60,
      departure: 6 * 60,
    })!;
    expect(result.overnight).toBe(true);
    expect(result.presenceMinutes).toBe(480);
    expect(result.workMinutes).toBe(450);
  });

  it("markiert Überschreitungen der gesetzlichen Höchstarbeitszeit", () => {
    const normal = calculateWorkTime(base)!;
    expect(normal.exceedsRegularMax).toBe(true);
    expect(normal.exceedsAbsoluteMax).toBe(false);

    const long = calculateWorkTime({
      ...base,
      departure: 19 * 60,
      breakMinutes: 45,
    })!;
    expect(long.workMinutes).toBe(615);
    expect(long.exceedsAbsoluteMax).toBe(true);
  });

  it("lehnt ungültige Eingaben ab", () => {
    expect(calculateWorkTime({ ...base, arrival: -1 })).toBeNull();
    expect(calculateWorkTime({ ...base, departure: 1440 })).toBeNull();
    expect(calculateWorkTime({ ...base, breakMinutes: -10 })).toBeNull();
    // Kommen und Gehen identisch: keine erfassbare Arbeitszeit.
    expect(calculateWorkTime({ ...base, departure: base.arrival })).toBeNull();
    // Pause länger als die Anwesenheit ergäbe negative Arbeitszeit.
    expect(calculateWorkTime({ ...base, breakMinutes: 600 })).toBeNull();
  });
});
