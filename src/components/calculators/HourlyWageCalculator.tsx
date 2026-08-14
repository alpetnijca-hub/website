"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import {
  NumberField,
  RadioGroupField,
  SelectField,
} from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import { calculateWage, type WageMode } from "@/lib/calculators/hourlyWage";

const euro = (value: number) => `${formatNumber(value, 2)} €`;

const limits = {
  salary: { min: 0, max: 1_000_000, unit: "€" },
  hourly: { min: 0, max: 10_000, unit: "€" },
  hoursPerWeek: { min: 1, max: 80, unit: "Stunden" },
  daysPerWeek: { min: 1, max: 7, unit: "Tage", integer: true },
};

export function HourlyWageCalculator() {
  const [mode, setMode] = useState<WageMode>("gehalt-zu-stundenlohn");
  const [salariesPerYear, setSalariesPerYear] = useState("12");
  const monthlySalary = useNumericField("3000", limits.salary);
  const hourlyWage = useNumericField("20", limits.hourly);
  const hoursPerWeek = useNumericField("40", limits.hoursPerWeek);
  const daysPerWeek = useNumericField("5", limits.daysPerWeek);

  const result =
    hoursPerWeek.value !== null && daysPerWeek.value !== null
      ? calculateWage({
          mode,
          monthlySalary: monthlySalary.value ?? undefined,
          hourlyWage: hourlyWage.value ?? undefined,
          hoursPerWeek: hoursPerWeek.value,
          daysPerWeek: daysPerWeek.value,
          salariesPerYear: Number(salariesPerYear),
        })
      : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Stundenlohn berechnen">
        <div className="grid gap-5">
          <RadioGroupField
            legend="Rechenrichtung"
            value={mode}
            onChange={(value) => setMode(value as WageMode)}
            options={[
              {
                value: "gehalt-zu-stundenlohn",
                label: "Gehalt → Stundenlohn",
              },
              {
                value: "stundenlohn-zu-gehalt",
                label: "Stundenlohn → Gehalt",
              },
            ]}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {mode === "gehalt-zu-stundenlohn" ? (
              <NumberField
                label="Monatsgehalt"
                hint="Brutto, so wie es im Arbeitsvertrag steht"
                value={monthlySalary.raw}
                onChange={monthlySalary.setRaw}
                error={monthlySalary.error}
                unit="€"
                step={50}
              />
            ) : (
              <NumberField
                label="Stundenlohn"
                hint="Brutto, also vor Steuern und Sozialabgaben"
                value={hourlyWage.raw}
                onChange={hourlyWage.setRaw}
                error={hourlyWage.error}
                unit="€"
                step={0.5}
              />
            )}

            <NumberField
              label="Wochenarbeitszeit"
              value={hoursPerWeek.raw}
              onChange={hoursPerWeek.setRaw}
              error={hoursPerWeek.error}
              unit="Std."
              step={0.5}
            />

            <NumberField
              label="Arbeitstage pro Woche"
              hint="Nur für den Tagesverdienst"
              value={daysPerWeek.raw}
              onChange={daysPerWeek.setRaw}
              error={daysPerWeek.error}
              unit="Tage"
              step={1}
            />

            <SelectField
              label="Gehälter pro Jahr"
              value={salariesPerYear}
              onChange={setSalariesPerYear}
              options={[
                { value: "12", label: "12 – ohne Sonderzahlung" },
                { value: "13", label: "13 – mit Weihnachtsgeld" },
                {
                  value: "14",
                  label: "14 – mit Weihnachts- und Urlaubsgeld",
                },
              ]}
            />
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <ResultCard>
          <ResultGrid>
            <ResultValue
              label="Stundenlohn (brutto)"
              value={euro(result.hourlyWage)}
              emphasis
            />
            <ResultValue
              label="Monatsgehalt (brutto)"
              value={euro(result.monthlySalary)}
              emphasis
            />
          </ResultGrid>

          <div className="mt-5 grid gap-5 border-t border-accent/30 pt-5 sm:grid-cols-2">
            <ResultValue label="Pro Tag" value={euro(result.dailyWage)} />
            <ResultValue label="Pro Woche" value={euro(result.weeklyWage)} />
            <ResultValue
              label="Pro Jahr"
              value={euro(result.annualSalary)}
              note={
                result.extraPayments > 0
                  ? `davon ${euro(result.extraPayments)} Sonderzahlungen`
                  : undefined
              }
            />
            <ResultValue
              label="Arbeitsstunden pro Monat"
              value={`${formatNumber(result.hoursPerMonth, 2)} Std.`}
              note={`${formatNumber(result.hoursPerYear, 0)} Stunden im Jahr`}
            />
          </div>
        </ResultCard>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib eine Wochenarbeitszeit zwischen 1 und 80 Stunden sowie einen
          gültigen Betrag ein.
        </Callout>
      )}

      <Callout tone="info" title="Brutto, nicht netto">
        Alle Beträge sind Bruttowerte. Was davon nach Steuern und
        Sozialabgaben übrig bleibt, hängt von Steuerklasse, Kirchensteuer,
        Krankenkasse und Wohnort ab – das rechnet dieser Rechner bewusst nicht
        aus.
      </Callout>
    </div>
  );
}
