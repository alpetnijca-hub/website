import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  daysBetween,
  daysInMonth,
  formatDate,
  isLeapYear,
  isWeekend,
  parseDate,
  weekdayIndex,
  workdaysBetween,
} from "@/lib/calculators/dates";
import {
  calculateDateSpan,
  shiftDate,
} from "@/lib/calculators/dateDiff";

const d = (iso: string) => parseDate(iso)!;

describe("parseDate", () => {
  it("liest gültige Daten", () => {
    expect(formatDate(d("2026-08-15"))).toBe("2026-08-15");
    expect(formatDate(d("2000-01-01"))).toBe("2000-01-01");
  });

  it("weist Daten zurück, die es nicht gibt", () => {
    // Ohne Prüfung würde daraus der 3. März – ein Tippfehler bliebe
    // unbemerkt und das Ergebnis sähe trotzdem plausibel aus.
    expect(parseDate("2026-02-31")).toBeNull();
    expect(parseDate("2026-13-01")).toBeNull();
    expect(parseDate("2025-02-29")).toBeNull();
  });

  it("akzeptiert den 29. Februar im Schaltjahr", () => {
    expect(formatDate(d("2024-02-29"))).toBe("2024-02-29");
  });

  it("weist unsinnige Eingaben zurück", () => {
    expect(parseDate("")).toBeNull();
    expect(parseDate("15.08.2026")).toBeNull();
    expect(parseDate("morgen")).toBeNull();
  });
});

describe("Kalenderhilfen", () => {
  it("erkennt Schaltjahre nach der vollständigen Regel", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2025)).toBe(false);
    // Durch 100 teilbar, aber nicht durch 400: kein Schaltjahr.
    expect(isLeapYear(1900)).toBe(false);
    // Durch 400 teilbar: doch ein Schaltjahr.
    expect(isLeapYear(2000)).toBe(true);
  });

  it("kennt die Länge der Monate", () => {
    expect(daysInMonth(2026, 1)).toBe(28);
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(daysInMonth(2026, 0)).toBe(31);
  });

  it("zählt Wochentage ab Montag", () => {
    // Der 17. August 2026 ist ein Montag.
    expect(weekdayIndex(d("2026-08-17"))).toBe(0);
    expect(weekdayIndex(d("2026-08-23"))).toBe(6);
    expect(isWeekend(d("2026-08-22"))).toBe(true);
    expect(isWeekend(d("2026-08-21"))).toBe(false);
  });

  it("begrenzt beim Monatsaddieren auf das Monatsende", () => {
    // Ein Monat nach dem 31. Januar ist der 28. Februar, nicht der 3. März.
    expect(formatDate(addMonths(d("2026-01-31"), 1))).toBe("2026-02-28");
    expect(formatDate(addMonths(d("2024-01-31"), 1))).toBe("2024-02-29");
    expect(formatDate(addMonths(d("2026-08-15"), 6))).toBe("2027-02-15");
    expect(formatDate(addMonths(d("2026-03-15"), -3))).toBe("2025-12-15");
  });

  it("rechnet über die Sommerzeitumstellung hinweg korrekt", () => {
    // Ende März wird in Mitteleuropa umgestellt. In Ortszeit gerechnet käme
    // hier ein Tag zu wenig oder zu viel heraus.
    expect(daysBetween(d("2026-03-28"), d("2026-03-30"))).toBe(2);
    expect(formatDate(addDays(d("2026-03-28"), 2))).toBe("2026-03-30");
    expect(daysBetween(d("2026-10-24"), d("2026-10-26"))).toBe(2);
  });

  it("zählt Werktage ohne Wochenenden", () => {
    // Montag bis Freitag derselben Woche: 4 Tage Abstand, 4 Werktage.
    expect(workdaysBetween(d("2026-08-17"), d("2026-08-21"))).toBe(4);
    // Über ein Wochenende: Freitag bis Montag sind 3 Tage, 1 Werktag.
    expect(workdaysBetween(d("2026-08-21"), d("2026-08-24"))).toBe(1);
    // Ganze Woche: 7 Tage, 5 Werktage.
    expect(workdaysBetween(d("2026-08-17"), d("2026-08-24"))).toBe(5);
  });
});

describe("calculateDateSpan", () => {
  it("zählt Tage zwischen zwei Daten", () => {
    const result = calculateDateSpan(d("2026-01-01"), d("2026-12-31"));
    expect(result.days).toBe(364);
    expect(result.daysInclusive).toBe(365);
  });

  it("teilt die Spanne in Wochen und Resttage", () => {
    const result = calculateDateSpan(d("2026-08-01"), d("2026-08-20"));
    expect(result.days).toBe(19);
    expect(result.weeks).toBe(2);
    expect(result.restDays).toBe(5);
  });

  it("teilt die Spanne in Jahre, Monate und Tage", () => {
    const result = calculateDateSpan(d("2020-03-15"), d("2026-08-20"));
    expect(result.years).toBe(6);
    expect(result.months).toBe(5);
    expect(result.restDaysAfterMonths).toBe(5);
  });

  it("kommt mit vertauschter Reihenfolge zurecht", () => {
    const result = calculateDateSpan(d("2026-12-31"), d("2026-01-01"));
    expect(result.reversed).toBe(true);
    expect(result.days).toBe(364);
  });

  it("ergibt für denselben Tag null Tage", () => {
    const result = calculateDateSpan(d("2026-08-15"), d("2026-08-15"));
    expect(result.days).toBe(0);
    expect(result.daysInclusive).toBe(1);
  });

  it("nennt die Wochentage beider Daten", () => {
    const result = calculateDateSpan(d("2026-08-17"), d("2026-08-21"));
    expect(result.fromWeekday).toBe("Montag");
    expect(result.toWeekday).toBe("Freitag");
  });
});

describe("shiftDate", () => {
  it("addiert Tage", () => {
    const result = shiftDate({
      from: d("2026-08-15"),
      amount: 30,
      unit: "tage",
      direction: "plus",
    })!;
    expect(result.date).toBe("2026-09-14");
    expect(result.days).toBe(30);
  });

  it("subtrahiert Tage", () => {
    const result = shiftDate({
      from: d("2026-08-15"),
      amount: 30,
      unit: "tage",
      direction: "minus",
    })!;
    expect(result.date).toBe("2026-07-16");
  });

  it("rechnet mit Wochen, Monaten und Jahren", () => {
    const from = d("2026-08-15");
    expect(
      shiftDate({ from, amount: 3, unit: "wochen", direction: "plus" })!.date,
    ).toBe("2026-09-05");
    expect(
      shiftDate({ from, amount: 3, unit: "monate", direction: "plus" })!.date,
    ).toBe("2026-11-15");
    expect(
      shiftDate({ from, amount: 2, unit: "jahre", direction: "minus" })!.date,
    ).toBe("2024-08-15");
  });

  it("rechnet über den Jahreswechsel", () => {
    const result = shiftDate({
      from: d("2026-12-28"),
      amount: 10,
      unit: "tage",
      direction: "plus",
    })!;
    expect(result.date).toBe("2027-01-07");
  });

  it("nennt Wochentag und Wochenende", () => {
    const result = shiftDate({
      from: d("2026-08-17"),
      amount: 5,
      unit: "tage",
      direction: "plus",
    })!;
    expect(result.weekday).toBe("Samstag");
    expect(result.isWeekend).toBe(true);
  });

  it("lehnt ungültige Eingaben ab", () => {
    const from = d("2026-08-15");
    expect(
      shiftDate({ from, amount: -5, unit: "tage", direction: "plus" }),
    ).toBeNull();
    expect(
      shiftDate({ from, amount: 1.5, unit: "tage", direction: "plus" }),
    ).toBeNull();
  });
});
