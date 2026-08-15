import { describe, expect, it } from "vitest";
import {
  getIsoWeek,
  getWeekRange,
  weeksInYear,
} from "@/lib/calculators/isoWeek";
import { parseDate } from "@/lib/calculators/dates";

const d = (iso: string) => parseDate(iso)!;

describe("getIsoWeek", () => {
  it("bestimmt die Kalenderwoche eines gewöhnlichen Datums", () => {
    const result = getIsoWeek(d("2026-08-15"));
    expect(result.week).toBe(33);
    expect(result.weekYear).toBe(2026);
    expect(result.start).toBe("2026-08-10");
    expect(result.end).toBe("2026-08-16");
  });

  it("beginnt die Woche am Montag", () => {
    expect(getIsoWeek(d("2026-08-10")).dayOfWeek).toBe(1);
    expect(getIsoWeek(d("2026-08-16")).dayOfWeek).toBe(7);
    // Sonntag gehört noch zur alten Woche, nicht zur neuen.
    expect(getIsoWeek(d("2026-08-16")).week).toBe(33);
    expect(getIsoWeek(d("2026-08-17")).week).toBe(34);
  });

  it("ordnet den Jahresanfang der letzten Woche des Vorjahres zu", () => {
    // Der 1. Januar 2027 ist ein Freitag und gehört zur KW 53 von 2026.
    const result = getIsoWeek(d("2027-01-01"));
    expect(result.week).toBe(53);
    expect(result.weekYear).toBe(2026);
  });

  it("ordnet Jahresenden der KW 1 des Folgejahres zu", () => {
    // Der 31. Dezember 2029 ist ein Montag und beginnt die KW 1 von 2030.
    const result = getIsoWeek(d("2029-12-31"));
    expect(result.week).toBe(1);
    expect(result.weekYear).toBe(2030);
  });

  it("setzt die KW 1 auf die Woche mit dem ersten Donnerstag", () => {
    // 2026 beginnt an einem Donnerstag – der 1. Januar liegt in KW 1.
    expect(getIsoWeek(d("2026-01-01")).week).toBe(1);
    expect(getIsoWeek(d("2026-01-01")).weekYear).toBe(2026);
  });

  it("markiert Wochen über den Jahreswechsel", () => {
    expect(getIsoWeek(d("2026-12-31")).spansYearChange).toBe(true);
    expect(getIsoWeek(d("2026-08-15")).spansYearChange).toBe(false);
  });
});

describe("weeksInYear", () => {
  it("kennt Jahre mit 53 Wochen", () => {
    expect(weeksInYear(2026)).toBe(53);
    expect(weeksInYear(2020)).toBe(53);
  });

  it("kennt Jahre mit 52 Wochen", () => {
    expect(weeksInYear(2025)).toBe(52);
    expect(weeksInYear(2027)).toBe(52);
  });
});

describe("getWeekRange", () => {
  it("nennt den Zeitraum einer Kalenderwoche", () => {
    const result = getWeekRange(33, 2026)!;
    expect(result.start).toBe("2026-08-10");
    expect(result.end).toBe("2026-08-16");
    expect(result.days).toHaveLength(7);
    expect(result.days[0].weekday).toBe("Montag");
    expect(result.days[6].weekday).toBe("Sonntag");
  });

  it("ist die Umkehrung der Wochenbestimmung", () => {
    for (const iso of ["2026-01-01", "2026-08-15", "2027-01-01"]) {
      const week = getIsoWeek(d(iso));
      const range = getWeekRange(week.week, week.weekYear)!;
      expect(range.start).toBe(week.start);
      expect(range.end).toBe(week.end);
    }
  });

  it("lehnt Wochen ab, die es im Jahr nicht gibt", () => {
    // 2025 hat nur 52 Wochen.
    expect(getWeekRange(53, 2025)).toBeNull();
    expect(getWeekRange(0, 2026)).toBeNull();
    expect(getWeekRange(54, 2026)).toBeNull();
  });

  it("liefert die KW 53 in Jahren, die sie haben", () => {
    const result = getWeekRange(53, 2026)!;
    expect(result.start).toBe("2026-12-28");
    expect(result.end).toBe("2027-01-03");
  });
});
