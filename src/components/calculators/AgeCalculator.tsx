"use client";

import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useDateField } from "@/components/calculators/useDateField";
import { DateField } from "@/components/ui/Field";
import { ResultCard, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import { calculateAge } from "@/lib/calculators/age";
import { formatDateLong, parseDate } from "@/lib/calculators/dates";

export function AgeCalculator() {
  // Voreinstellung ist ein Datum, das ein plausibles Alter ergibt – so ist
  // sofort ein Ergebnis sichtbar, ohne dass jemand etwas eingeben muss.
  const birth = useDateField("1990-06-15");
  const reference = useDateField();

  const result =
    birth.date && reference.date
      ? calculateAge(birth.date, reference.date)
      : null;

  const nextBirthdayDate = result ? parseDate(result.nextBirthday) : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Alter berechnen">
        <div className="grid gap-5 sm:grid-cols-2">
          <DateField
            label="Geburtsdatum"
            value={birth.value}
            onChange={birth.setValue}
          />
          <DateField
            label="Stichtag"
            hint="Voreingestellt ist heute. Für ein Alter an einem bestimmten Tag hier ein anderes Datum wählen."
            value={reference.value}
            onChange={reference.setValue}
          />
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <ResultValue
              label="Alter"
              value={`${formatNumber(result.years)} Jahre, ${formatNumber(result.months)} Monate, ${formatNumber(result.days)} Tage`}
              emphasis
            />

            <div className="mt-5 grid gap-5 border-t border-accent/30 pt-5 sm:grid-cols-2">
              <ResultValue
                label="Gelebte Tage"
                value={formatNumber(result.totalDays)}
                note={`${formatNumber(result.totalWeeks)} Wochen · ${formatNumber(result.totalMonths)} Monate`}
              />
              <ResultValue
                label="Gelebte Stunden"
                value={formatNumber(result.totalHours)}
              />
              <ResultValue
                label="Geboren an einem"
                value={result.birthWeekday}
              />
              <ResultValue
                label={
                  result.isBirthday
                    ? "Geburtstag ist heute"
                    : "Nächster Geburtstag"
                }
                value={
                  result.isBirthday
                    ? `${formatNumber(result.turningAge)}. Geburtstag`
                    : `in ${formatNumber(result.daysUntilBirthday)} Tagen`
                }
                note={
                  nextBirthdayDate
                    ? `${formatDateLong(nextBirthdayDate)} – dann ${formatNumber(result.turningAge)} Jahre`
                    : undefined
                }
              />
            </div>
          </ResultCard>

          {result.isBirthday && (
            <Callout tone="info" title="Herzlichen Glückwunsch" live>
              Der Stichtag ist genau der {formatNumber(result.turningAge)}.
              Geburtstag.
            </Callout>
          )}
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte wähle ein gültiges Geburtsdatum. Es darf nicht nach dem Stichtag
          liegen.
        </Callout>
      )}
    </div>
  );
}
