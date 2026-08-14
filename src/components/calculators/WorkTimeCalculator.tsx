"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, TimeField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import {
  calculateWorkTime,
  formatDuration,
  formatTime,
  MIN_BREAK_PART,
  parseTime,
} from "@/lib/calculators/workTime";

const limits = {
  breakMinutes: { min: 0, max: 720, unit: "Minuten" },
  targetHours: { min: 0, max: 24, unit: "Stunden" },
};

/**
 * Drei Pausenfelder, einzeln zuschaltbar. Getrennte Felder statt einer
 * Gesamtsumme, weil das Gesetz an die Länge der einzelnen Pause anknüpft:
 * Drei Pausen zu je zehn Minuten sind eben keine halbe Stunde Ruhepause.
 */
const BREAK_SLOTS = [
  { label: "1. Pause", initialMinutes: "30", initialOn: true },
  { label: "2. Pause", initialMinutes: "15", initialOn: false },
  { label: "3. Pause", initialMinutes: "15", initialOn: false },
];

export function WorkTimeCalculator() {
  const [arrival, setArrival] = useState("08:00");
  const [departure, setDeparture] = useState("17:00");
  const targetHours = useNumericField("8", limits.targetHours);

  const [enabled, setEnabled] = useState(
    BREAK_SLOTS.map((slot) => slot.initialOn),
  );
  // Feste Zahl an Feldern statt einer Schleife: Hooks müssen in jeder
  // Darstellung in derselben Reihenfolge aufgerufen werden. Drei Pausen
  // decken den Arbeitsalltag ab.
  const firstBreak = useNumericField(
    BREAK_SLOTS[0].initialMinutes,
    limits.breakMinutes,
  );
  const secondBreak = useNumericField(
    BREAK_SLOTS[1].initialMinutes,
    limits.breakMinutes,
  );
  const thirdBreak = useNumericField(
    BREAK_SLOTS[2].initialMinutes,
    limits.breakMinutes,
  );
  const breakFields = [firstBreak, secondBreak, thirdBreak];

  const arrivalMinutes = parseTime(arrival);
  const departureMinutes = parseTime(departure);

  const activeBreaks = breakFields
    .map((field, index) => (enabled[index] ? field.value : null))
    .filter((value): value is number => value !== null && value > 0);

  const breaksValid = breakFields.every(
    (field, index) => !enabled[index] || field.value !== null,
  );

  const result =
    arrivalMinutes !== null &&
    departureMinutes !== null &&
    targetHours.value !== null &&
    breaksValid
      ? calculateWorkTime({
          arrival: arrivalMinutes,
          departure: departureMinutes,
          breaks: activeBreaks,
          targetHours: targetHours.value,
        })
      : null;

  const balancePositive = result ? result.balanceMinutes >= 0 : false;

  function toggle(index: number) {
    setEnabled((current) =>
      current.map((value, i) => (i === index ? !value : value)),
    );
  }

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Arbeitszeit berechnen">
        <div className="grid gap-5">
          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TimeField
                label="Arbeitsbeginn"
                value={arrival}
                onChange={setArrival}
              />
              <TimeField
                label="Arbeitsende"
                value={departure}
                onChange={setDeparture}
              />
            </div>
            {/* Der Hinweis steht unter beiden Feldern, damit sie auf gleicher
                Höhe bleiben. */}
            <p className="mt-1.5 text-xs text-text-subtle">
              Liegt das Ende vor dem Beginn, wird eine Nachtschicht über
              Mitternacht angenommen.
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-text">Pausen</legend>
            <p className="mt-0.5 text-xs text-text-subtle">
              Jede Pause einzeln eintragen. Nur Pausen ab {MIN_BREAK_PART}{" "}
              Minuten zählen als Ruhepause im Sinne des Arbeitszeitgesetzes.
            </p>
            <div className="mt-2.5 space-y-2">
              {BREAK_SLOTS.map((slot, index) => {
                const field = breakFields[index];
                const on = enabled[index];
                return (
                  <div
                    key={slot.label}
                    className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5"
                  >
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-text">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(index)}
                        className="h-4.5 w-4.5 accent-[var(--color-accent)]"
                      />
                      <span className="w-16">{slot.label}</span>
                    </label>

                    {on ? (
                      <div className="flex items-center gap-2">
                        <label className="sr-only" htmlFor={`pause-${index}`}>
                          Dauer der {slot.label} in Minuten
                        </label>
                        <input
                          id={`pause-${index}`}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={720}
                          step={5}
                          value={field.raw}
                          onChange={(event) => field.setRaw(event.target.value)}
                          aria-invalid={field.error ? true : undefined}
                          className={`w-24 rounded-lg border bg-surface px-3 py-1.5 text-base text-text focus:outline-none ${
                            field.error
                              ? "border-danger ring-1 ring-danger"
                              : "border-border hover:border-text-subtle"
                          }`}
                        />
                        <span className="text-sm text-text-muted">Minuten</span>
                        {field.error && (
                          <span className="text-sm font-medium text-danger">
                            {field.error}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-text-subtle">keine</span>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>

          <div className="sm:max-w-[50%]">
            <NumberField
              label="Sollarbeitszeit am Tag"
              value={targetHours.raw}
              onChange={targetHours.setRaw}
              error={targetHours.error}
              unit="Std."
              step={0.5}
            />
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <ResultGrid>
              <ResultValue
                label="Arbeitszeit"
                value={formatDuration(result.workMinutes)}
                emphasis
                note={`${formatNumber(result.workHoursDecimal, 2)} Stunden dezimal – so tragen es die meisten Zeiterfassungen ein`}
              />
              <ResultValue
                label={balancePositive ? "Überstunden" : "Minusstunden"}
                value={`${balancePositive ? "+" : "−"}${formatDuration(
                  Math.abs(result.balanceMinutes),
                )}`}
                emphasis
                note={`gegenüber ${formatNumber(
                  targetHours.value ?? 0,
                  2,
                )} Stunden Sollzeit`}
              />
            </ResultGrid>

            <div className="mt-5 grid gap-5 border-t border-accent/30 pt-5 sm:grid-cols-2">
              <ResultValue
                label="Anwesend"
                value={formatDuration(result.presenceMinutes)}
                note={
                  result.breakMinutes > 0
                    ? `einschliesslich ${formatDuration(result.breakMinutes)} Pause`
                    : "ohne Pause"
                }
              />
              <ResultValue
                label="Sollzeit erreicht um"
                value={formatTime(result.targetEndMinutes)}
                note="bei den eingetragenen Pausen"
              />
            </div>
          </ResultCard>

          {result.overnight && (
            <Callout tone="info" title="Schicht über Mitternacht" live>
              Das Arbeitsende liegt vor dem Beginn, deshalb wurde über
              Mitternacht hinweg gerechnet – also{" "}
              {formatDuration(result.presenceMinutes)} Anwesenheit.
            </Callout>
          )}

          {result.shortBreakCount > 0 && (
            <Callout tone="info" title="Kurze Pausen zählen nicht als Ruhepause" live>
              {result.shortBreakCount === 1
                ? "Eine deiner Pausen ist"
                : `${result.shortBreakCount} deiner Pausen sind`}{" "}
              kürzer als {MIN_BREAK_PART} Minuten. Von der Arbeitszeit
              abgezogen{" "}
              {result.shortBreakCount === 1 ? "wird sie" : "werden sie"}{" "}
              trotzdem – auf die vorgeschriebene Mindestpause zählen davon aber
              nur {formatDuration(result.countedBreakMinutes)} an.
            </Callout>
          )}

          {result.missingBreakMinutes > 0 && (
            <Callout tone="warnung" title="Pause zu kurz" live>
              Bei {formatDuration(result.workMinutes)} Arbeitszeit sind nach
              § 4 Arbeitszeitgesetz mindestens{" "}
              {result.requiredBreakMinutes} Minuten Pause vorgeschrieben.
              Angerechnet werden {formatDuration(result.countedBreakMinutes)} –
              es fehlen {result.missingBreakMinutes} Minuten.
            </Callout>
          )}

          {result.exceedsAbsoluteMax ? (
            <Callout tone="achtung" title="Über 10 Stunden Arbeitszeit" live>
              Nach § 3 Arbeitszeitgesetz sind werktäglich höchstens 10 Stunden
              zulässig, und auch das nur, wenn im Ausgleichszeitraum im Schnitt
              8 Stunden eingehalten werden. Über 10 Stunden hinaus ist die
              Arbeitszeit ohne behördliche Ausnahme unzulässig.
            </Callout>
          ) : (
            result.exceedsRegularMax && (
              <Callout tone="info" title="Über 8 Stunden Arbeitszeit" live>
                Die werktägliche Regelarbeitszeit von 8 Stunden ist
                überschritten. Zulässig ist das bis 10 Stunden, sofern im
                Ausgleichszeitraum im Schnitt 8 Stunden nicht überschritten
                werden.
              </Callout>
            )
          )}
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte trage gültige Uhrzeiten und Pausendauern ein. Die Pausen müssen
          zusammen kürzer sein als die Anwesenheit, und Beginn und Ende dürfen
          nicht auf derselben Minute liegen.
        </Callout>
      )}
    </div>
  );
}
