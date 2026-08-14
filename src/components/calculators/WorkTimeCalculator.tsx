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
  parseTime,
} from "@/lib/calculators/workTime";

const limits = {
  breakMinutes: { min: 0, max: 720, unit: "Minuten" },
  breakCount: { min: 0, max: 20, unit: "Pausen", integer: true },
  targetHours: { min: 0, max: 24, unit: "Stunden" },
};

export function WorkTimeCalculator() {
  const [arrival, setArrival] = useState("08:00");
  const [departure, setDeparture] = useState("17:00");
  const breakMinutes = useNumericField("30", limits.breakMinutes);
  const breakCount = useNumericField("1", limits.breakCount);
  const targetHours = useNumericField("8", limits.targetHours);

  const arrivalMinutes = parseTime(arrival);
  const departureMinutes = parseTime(departure);

  const result =
    arrivalMinutes !== null &&
    departureMinutes !== null &&
    breakMinutes.value !== null &&
    breakCount.value !== null &&
    targetHours.value !== null
      ? calculateWorkTime({
          arrival: arrivalMinutes,
          departure: departureMinutes,
          breakMinutes: breakMinutes.value,
          breakCount: breakCount.value,
          targetHours: targetHours.value,
        })
      : null;

  const balancePositive = result ? result.balanceMinutes >= 0 : false;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Arbeitszeit berechnen">
        <div className="grid gap-5 sm:grid-cols-2">
          <TimeField label="Gekommen um" value={arrival} onChange={setArrival} />
          <TimeField
            label="Gegangen um"
            hint="Liegt die Zeit vor dem Kommen, wird eine Nachtschicht angenommen."
            value={departure}
            onChange={setDeparture}
          />
          <NumberField
            label="Pause insgesamt"
            value={breakMinutes.raw}
            onChange={breakMinutes.setRaw}
            error={breakMinutes.error}
            unit="min"
            step={5}
          />
          <NumberField
            label="Anzahl der Pausen"
            hint="Wichtig für die Prüfung: Jeder Teil muss mindestens 15 Minuten dauern."
            value={breakCount.raw}
            onChange={breakCount.setRaw}
            error={breakCount.error}
            step={1}
          />
          <NumberField
            label="Sollarbeitszeit am Tag"
            value={targetHours.raw}
            onChange={targetHours.setRaw}
            error={targetHours.error}
            unit="Std."
            step={0.5}
          />
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
                note={`einschliesslich ${formatDuration(result.breakMinutes)} Pause`}
              />
              <ResultValue
                label="Sollzeit erreicht um"
                value={formatTime(result.targetEndMinutes)}
                note="bei der eingetragenen Pausendauer"
              />
            </div>
          </ResultCard>

          {result.overnight && (
            <Callout tone="info" title="Schicht über Mitternacht" live>
              Das Gehen liegt vor dem Kommen, deshalb wurde die Zeit über
              Mitternacht hinweg gerechnet – also{" "}
              {formatDuration(result.presenceMinutes)} Anwesenheit.
            </Callout>
          )}

          {result.missingBreakMinutes > 0 && (
            <Callout tone="warnung" title="Pause zu kurz" live>
              Bei {formatDuration(result.workMinutes)} Arbeitszeit sind nach
              § 4 Arbeitszeitgesetz mindestens{" "}
              {result.requiredBreakMinutes} Minuten Pause vorgeschrieben. Es
              fehlen {result.missingBreakMinutes} Minuten.
            </Callout>
          )}

          {result.breakPartsTooShort && (
            <Callout tone="warnung" title="Pausenteile zu kurz" live>
              Aufgeteilte Pausen zählen nur, wenn jeder Teil mindestens
              15 Minuten dauert. Bei {breakCount.value} Pausen und insgesamt{" "}
              {result.breakMinutes} Minuten sind es im Schnitt nur{" "}
              {formatNumber(result.breakLength ?? 0, 1)} Minuten je Pause.
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
          Bitte trage gültige Uhrzeiten ein. Die Pause muss kürzer sein als die
          Anwesenheit, und Kommen und Gehen dürfen nicht auf derselben Minute
          liegen.
        </Callout>
      )}
    </div>
  );
}
