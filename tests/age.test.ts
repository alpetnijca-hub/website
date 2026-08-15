import { describe, expect, it } from "vitest";
import { calculateAge } from "@/lib/calculators/age";
import { parseDate } from "@/lib/calculators/dates";

const d = (iso: string) => parseDate(iso)!;

describe("calculateAge", () => {
  it("zählt volle Jahre", () => {
    const result = calculateAge(d("1990-08-15"), d("2026-08-15"))!;
    expect(result.years).toBe(36);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it("zählt am Tag vor dem Geburtstag noch ein Jahr weniger", () => {
    const result = calculateAge(d("1990-08-15"), d("2026-08-14"))!;
    expect(result.years).toBe(35);
    expect(result.months).toBe(11);
    expect(result.days).toBe(30);
  });

  it("erkennt den Geburtstag", () => {
    expect(calculateAge(d("1990-08-15"), d("2026-08-15"))!.isBirthday).toBe(
      true,
    );
    expect(calculateAge(d("1990-08-15"), d("2026-08-16"))!.isBirthday).toBe(
      false,
    );
  });

  it("nennt den nächsten Geburtstag und die Tage bis dahin", () => {
    const result = calculateAge(d("1990-12-24"), d("2026-08-15"))!;
    expect(result.nextBirthday).toBe("2026-12-24");
    expect(result.daysUntilBirthday).toBe(131);
    expect(result.turningAge).toBe(36);
  });

  it("nimmt am Geburtstag selbst den heutigen Tag als nächsten Geburtstag", () => {
    const result = calculateAge(d("1990-08-15"), d("2026-08-15"))!;
    expect(result.daysUntilBirthday).toBe(0);
    expect(result.turningAge).toBe(36);
  });

  it("zählt den nächsten Geburtstag ins Folgejahr, wenn er vorbei ist", () => {
    const result = calculateAge(d("1990-01-10"), d("2026-08-15"))!;
    expect(result.nextBirthday).toBe("2027-01-10");
  });

  it("berechnet gelebte Tage, Wochen und Stunden", () => {
    const result = calculateAge(d("2026-01-01"), d("2026-08-15"))!;
    expect(result.totalDays).toBe(226);
    expect(result.totalWeeks).toBe(32);
    expect(result.totalHours).toBe(226 * 24);
  });

  it("kommt mit dem 29. Februar als Geburtstag zurecht", () => {
    // In einem Nicht-Schaltjahr fällt der Jahrestag auf den 28. Februar.
    const result = calculateAge(d("2000-02-29"), d("2026-03-01"))!;
    expect(result.years).toBe(26);
    expect(result.nextBirthday).toBe("2027-02-28");
  });

  it("nennt den Wochentag der Geburt", () => {
    // Der 15. August 1990 war ein Mittwoch.
    expect(calculateAge(d("1990-08-15"), d("2026-08-15"))!.birthWeekday).toBe(
      "Mittwoch",
    );
  });

  it("lehnt ein Geburtsdatum in der Zukunft ab", () => {
    expect(calculateAge(d("2030-01-01"), d("2026-08-15"))).toBeNull();
  });

  it("ergibt am Geburtstag selbst ein Alter von null", () => {
    const result = calculateAge(d("2026-08-15"), d("2026-08-15"))!;
    expect(result.years).toBe(0);
    expect(result.totalDays).toBe(0);
  });
});
