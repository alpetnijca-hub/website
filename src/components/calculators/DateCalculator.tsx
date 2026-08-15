"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useDateField } from "@/components/calculators/useDateField";
import { useNumericField } from "@/components/calculators/useNumericField";
import {
  DateField,
  NumberField,
  RadioGroupField,
  SelectField,
} from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import { formatDateLong, parseDate } from "@/lib/calculators/dates";
import {
  calculateDateSpan,
  shiftDate,
  type ShiftDirection,
  type ShiftUnit,
} from "@/lib/calculators/dateDiff";

type Mode = "spanne" | "verschieben";

const amountLimits = { min: 0, max: 100_000, integer: true };

export function DateCalculator() {
  const [mode, setMode] = useState<Mode>("spanne");
  const from = useDateField();
  // Das Bis-Feld startet 30 Tage in der Zukunft: Zwei Mal dasselbe Datum
  // ergäbe null Tage und damit ein Ergebnis, das nichts zeigt.
  const to = useDateField(undefined, 30);
  const amount = useNumericField("30", amountLimits);
  const [unit, setUnit] = useState<ShiftUnit>("tage");
  const [direction, setDirection] = useState<ShiftDirection>("plus");

  const span =
    mode === "spanne" && from.date && to.date
      ? calculateDateSpan(from.date, to.date)
      : null;

  const shifted =
    mode === "verschieben" && from.date && amount.value !== null
      ? shiftDate({
          from: from.date,
          amount: amount.value,
          unit,
          direction,
        })
      : null;

  const shiftedDate = shifted ? parseDate(shifted.date) : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Mit Daten rechnen">
        <div className="grid gap-5">
          <RadioGroupField
            legend="Was möchtest du berechnen?"
            value={mode}
            onChange={(value) => setMode(value as Mode)}
            options={[
              { value: "spanne", label: "Tage zwischen zwei Daten" },
              { value: "verschieben", label: "Datum plus/minus Frist" },
            ]}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <DateField
              label={mode === "spanne" ? "Von" : "Ausgangsdatum"}
              value={from.value}
              onChange={from.setValue}
            />
            {mode === "spanne" ? (
              <DateField label="Bis" value={to.value} onChange={to.setValue} />
            ) : (
              <NumberField
                label="Anzahl"
                value={amount.raw}
                onChange={amount.setRaw}
                error={amount.error}
                step={1}
              />
            )}
          </div>

          {mode === "verschieben" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Einheit"
                value={unit}
                onChange={(value) => setUnit(value as ShiftUnit)}
                options={[
                  { value: "tage", label: "Tage" },
                  { value: "wochen", label: "Wochen" },
                  { value: "monate", label: "Monate" },
                  { value: "jahre", label: "Jahre" },
                ]}
              />
              <RadioGroupField
                legend="Richtung"
                value={direction}
                onChange={(value) => setDirection(value as ShiftDirection)}
                options={[
                  { value: "plus", label: "in die Zukunft" },
                  { value: "minus", label: "in die Vergangenheit" },
                ]}
              />
            </div>
          )}
        </div>
      </CalculatorShell>

      {mode === "spanne" && span && from.date && to.date && (
        <>
          <ResultCard>
            <ResultGrid>
              <ResultValue
                label="Tage dazwischen"
                value={formatNumber(span.days)}
                emphasis
                note={`${formatNumber(span.daysInclusive)} Tage, wenn beide Tage mitzählen`}
              />
              <ResultValue
                label="Werktage (Mo–Fr)"
                value={formatNumber(span.workdays)}
                emphasis
                note="ohne Feiertage"
              />
            </ResultGrid>

            <div className="mt-5 grid gap-5 border-t border-accent/30 pt-5 sm:grid-cols-2">
              <ResultValue
                label="In Wochen"
                value={`${formatNumber(span.weeks)} Wochen, ${formatNumber(span.restDays)} Tage`}
              />
              <ResultValue
                label="In Jahren und Monaten"
                value={`${formatNumber(span.years)} J., ${formatNumber(span.months)} M., ${formatNumber(span.restDaysAfterMonths)} T.`}
              />
            </div>

            <p className="mt-4 text-sm text-text-muted">
              {formatDateLong(from.date)} → {formatDateLong(to.date)}
            </p>
          </ResultCard>

          {span.reversed && (
            <Callout tone="info" title="Daten vertauscht" live>
              Das zweite Datum liegt vor dem ersten. Gerechnet wurde trotzdem
              die Spanne dazwischen – sie ist in beide Richtungen gleich lang.
            </Callout>
          )}
        </>
      )}

      {mode === "verschieben" && shifted && (
        <ResultCard>
          <ResultValue
            label={
              direction === "plus"
                ? `${formatNumber(amount.value ?? 0)} ${unit} später`
                : `${formatNumber(amount.value ?? 0)} ${unit} früher`
            }
            value={shiftedDate ? formatDateLong(shiftedDate) : shifted.date}
            emphasis
          />
          <div className="mt-5 grid gap-5 border-t border-accent/30 pt-5 sm:grid-cols-2">
            <ResultValue label="Wochentag" value={shifted.weekday} />
            <ResultValue
              label="Abstand"
              value={`${formatNumber(Math.abs(shifted.days))} Tage`}
              note={shifted.isWeekend ? "fällt auf ein Wochenende" : undefined}
            />
          </div>
        </ResultCard>
      )}

      {((mode === "spanne" && !span) ||
        (mode === "verschieben" && !shifted)) && (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte wähle gültige Daten aus. Beim Verschieben muss die Anzahl eine
          ganze Zahl ab 0 sein.
        </Callout>
      )}
    </div>
  );
}
