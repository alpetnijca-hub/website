"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useDateField, useToday } from "@/components/calculators/useDateField";
import { useNumericField } from "@/components/calculators/useNumericField";
import { DateField, NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import { formatDateLong, parseDate } from "@/lib/calculators/dates";
import { getIsoWeek, getWeekRange, weeksInYear } from "@/lib/calculators/isoWeek";

type Mode = "datum-zu-kw" | "kw-zu-datum";

export function WeekCalculator() {
  const [mode, setMode] = useState<Mode>("datum-zu-kw");
  const date = useDateField();
  const today = useToday();

  // Vor der Hydration steht kein Jahr fest; solange bleibt das Feld leer.
  const currentYear = today ? today.slice(0, 4) : "";
  const [ownYear, setOwnYear] = useState<string | null>(null);
  const yearRaw = ownYear ?? currentYear;
  const year = /^\d{4}$/.test(yearRaw) ? Number(yearRaw) : null;

  const week = useNumericField("1", { min: 1, max: 53, integer: true });

  const fromDate = mode === "datum-zu-kw" && date.date ? getIsoWeek(date.date) : null;
  const range =
    mode === "kw-zu-datum" && year !== null && week.value !== null
      ? getWeekRange(week.value, year)
      : null;

  const rangeStart = range ? parseDate(range.start) : null;
  const rangeEnd = range ? parseDate(range.end) : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Kalenderwoche bestimmen">
        <div className="grid gap-5">
          <RadioGroupField
            legend="Rechenrichtung"
            value={mode}
            onChange={(value) => setMode(value as Mode)}
            options={[
              { value: "datum-zu-kw", label: "Datum → Kalenderwoche" },
              { value: "kw-zu-datum", label: "Kalenderwoche → Datum" },
            ]}
          />

          {mode === "datum-zu-kw" ? (
            <div className="sm:max-w-[50%]">
              <DateField
                label="Datum"
                value={date.value}
                onChange={date.setValue}
              />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Kalenderwoche"
                value={week.raw}
                onChange={week.setRaw}
                error={week.error}
                step={1}
              />
              <NumberField
                label="Jahr"
                value={yearRaw}
                onChange={setOwnYear}
                step={1}
              />
            </div>
          )}
        </div>
      </CalculatorShell>

      {mode === "datum-zu-kw" && fromDate && date.date && (
        <>
          <ResultCard>
            <ResultGrid>
              <ResultValue
                label="Kalenderwoche"
                value={`KW ${formatNumber(fromDate.week)}`}
                emphasis
                note={`Woche des Jahres ${fromDate.weekYear}`}
              />
              <ResultValue
                label="Zeitraum"
                value={`${fromDate.start.split("-").reverse().join(".")} – ${fromDate.end.split("-").reverse().join(".")}`}
                emphasis
                note="Montag bis Sonntag"
              />
            </ResultGrid>
            <p className="mt-4 text-sm text-text-muted">
              {formatDateLong(date.date)} ist der {fromDate.dayOfWeek}. Tag
              dieser Woche.
            </p>
          </ResultCard>

          {fromDate.weekYear !== date.date.getUTCFullYear() && (
            <Callout tone="info" title="Woche gehört zum Nachbarjahr" live>
              Das Datum liegt im Jahr {date.date.getUTCFullYear()}, die
              Kalenderwoche zählt aber zum Jahr {fromDate.weekYear}. Das ist
              kein Fehler: Nach ISO 8601 gehört eine Woche zu dem Jahr, in dem
              ihr Donnerstag liegt.
            </Callout>
          )}
        </>
      )}

      {mode === "kw-zu-datum" && range && rangeStart && rangeEnd && (
        <ResultCard>
          <ResultValue
            label={`KW ${range.week} im Jahr ${range.year}`}
            value={`${formatDateLong(rangeStart)} bis ${formatDateLong(rangeEnd)}`}
            emphasis
          />
          <ul className="mt-5 grid gap-2 border-t border-accent/30 pt-5 sm:grid-cols-2">
            {range.days.map((day) => (
              <li
                key={day.date}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="text-text-muted">{day.weekday}</span>
                <span className="font-medium tabular-nums text-text">
                  {day.date.split("-").reverse().join(".")}
                </span>
              </li>
            ))}
          </ul>
        </ResultCard>
      )}

      {mode === "kw-zu-datum" && !range && (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib ein vierstelliges Jahr und eine gültige Kalenderwoche ein.
          {year !== null && (
            <> Das Jahr {year} hat {weeksInYear(year)} Wochen.</>
          )}
        </Callout>
      )}

      {mode === "datum-zu-kw" && !fromDate && (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte wähle ein gültiges Datum aus.
        </Callout>
      )}
    </div>
  );
}
