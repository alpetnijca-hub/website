"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import {
  calculateCompoundInterest,
  compoundingOptions,
  type Compounding,
} from "@/lib/calculators/compoundInterest";

const euro = (value: number) => `${formatNumber(value, 2)} €`;

const limits = {
  capital: { min: 0, max: 100_000_000, unit: "€" },
  rate: { min: -10, max: 30, unit: "%" },
  years: { min: 1, max: 60, unit: "Jahre", integer: true },
};

export function CompoundInterestCalculator() {
  const [compounding, setCompounding] = useState<Compounding>("jaehrlich");
  const initial = useNumericField("10000", limits.capital);
  const contribution = useNumericField("200", limits.capital);
  const rate = useNumericField("5", limits.rate);
  const years = useNumericField("20", limits.years);

  const complete =
    initial.value !== null &&
    contribution.value !== null &&
    rate.value !== null &&
    years.value !== null;

  const result = complete
    ? calculateCompoundInterest({
        initial: initial.value!,
        contribution: contribution.value!,
        annualRate: rate.value!,
        years: years.value!,
        compounding,
      })
    : null;

  const contributionLabel =
    compounding === "monatlich" ? "Sparrate je Monat" : "Sparrate je Jahr";

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Zinseszins berechnen">
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Startkapital"
              value={initial.raw}
              onChange={initial.setRaw}
              error={initial.error}
              unit="€"
              step={100}
              hint="0 eintragen, wenn du bei null anfängst."
            />
            <NumberField
              label={contributionLabel}
              value={contribution.raw}
              onChange={contribution.setRaw}
              error={contribution.error}
              unit="€"
              step={10}
              hint="0 eintragen, wenn du nur einmalig anlegst."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Zinssatz pro Jahr"
              value={rate.raw}
              onChange={rate.setRaw}
              error={rate.error}
              unit="%"
              step={0.1}
            />
            <NumberField
              label="Laufzeit"
              value={years.raw}
              onChange={years.setRaw}
              error={years.error}
              unit="Jahre"
            />
          </div>

          <RadioGroupField
            legend="Zinsgutschrift und Einzahlung"
            value={compounding}
            onChange={(value) => setCompounding(value as Compounding)}
            options={(Object.keys(compoundingOptions) as Compounding[]).map(
              (key) => ({
                value: key,
                label: compoundingOptions[key].label,
              }),
            )}
          />
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <ResultValue
              label="Endkapital"
              value={euro(result.finalBalance)}
              emphasis
            />

            <ResultGrid>
              <div className="mt-5 border-t border-brand/30 pt-5">
                <ResultValue
                  label="Davon eingezahlt"
                  value={euro(result.totalDeposits)}
                />
              </div>
              <div className="mt-0 border-brand/30 pt-5 sm:mt-5 sm:border-t">
                <ResultValue
                  label={result.totalInterest < 0 ? "Verlust durch Negativzins" : "Davon Zinsertrag"}
                  value={euro(result.totalInterest)}
                  note={
                    result.totalDeposits > 0
                      ? `entspricht ${formatNumber(
                          (result.totalInterest / result.totalDeposits) * 100,
                          1,
                        )} % der Einzahlungen`
                      : undefined
                  }
                />
              </div>
            </ResultGrid>

            {/* Verlauf: Balken je Jahr, Einzahlungen gegen Zinsen */}
            <div className="mt-6 border-t border-brand/30 pt-5">
              <p className="text-sm font-medium text-text">
                Entwicklung über die Jahre
              </p>
              <div className="mt-3 max-h-64 overflow-y-auto pr-1">
                <table className="w-full text-sm">
                  <caption className="sr-only">
                    Kapital, Einzahlungen und Zinsen je Jahr
                  </caption>
                  <thead className="sticky top-0 bg-brand-soft/90">
                    <tr className="text-left text-text-muted">
                      <th scope="col" className="py-1.5 pr-3 font-medium">
                        Jahr
                      </th>
                      <th scope="col" className="py-1.5 pr-3 text-right font-medium">
                        Eingezahlt
                      </th>
                      <th scope="col" className="py-1.5 pr-3 text-right font-medium">
                        Zinsen
                      </th>
                      <th scope="col" className="py-1.5 text-right font-medium">
                        Kapital
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.years.map((row) => (
                      <tr key={row.year} className="border-t border-brand/15">
                        <th
                          scope="row"
                          className="py-1.5 pr-3 text-left font-normal text-text-muted"
                        >
                          {row.year}
                        </th>
                        <td className="py-1.5 pr-3 text-right tabular-nums text-text-muted">
                          {formatNumber(row.deposits)} €
                        </td>
                        <td className="py-1.5 pr-3 text-right tabular-nums text-text-muted">
                          {formatNumber(row.interest)} €
                        </td>
                        <td className="py-1.5 text-right font-semibold tabular-nums text-text">
                          {formatNumber(row.balance)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ResultCard>

          {result.totalInterest < 0 && (
            <Callout tone="warnung" title="Negativer Zinssatz" live>
              Mit einem negativen Zinssatz schrumpft dein Kapital rechnerisch.
              Das Ergebnis zeigt genau das – es ist kein Fehler.
            </Callout>
          )}
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte fülle alle Felder mit gültigen Werten aus.
        </Callout>
      )}
    </div>
  );
}
