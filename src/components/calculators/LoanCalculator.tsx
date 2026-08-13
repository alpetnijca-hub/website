"use client";

import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import { calculateLoan } from "@/lib/calculators/loan";

const euro = (value: number) => `${formatNumber(value, 2)} €`;

const limits = {
  amount: { min: 1000, max: 10_000_000, unit: "€" },
  rate: { min: 0, max: 25, unit: "%" },
  repayment: { min: 0.1, max: 50, unit: "%" },
  years: { min: 1, max: 40, unit: "Jahre", integer: true },
};

/** Monate in eine lesbare Angabe „X Jahre und Y Monate“ umwandeln. */
function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} Monate`;
  if (rest === 0) return `${years} Jahre`;
  return `${years} Jahre und ${rest} Monate`;
}

export function LoanCalculator() {
  const amount = useNumericField("300000", limits.amount);
  const rate = useNumericField("3,5", limits.rate);
  const repayment = useNumericField("2", limits.repayment);
  const fixedYears = useNumericField("10", limits.years);

  const complete =
    amount.value !== null &&
    rate.value !== null &&
    repayment.value !== null &&
    fixedYears.value !== null;

  const result = complete
    ? calculateLoan({
        amount: amount.value!,
        annualRate: rate.value!,
        repaymentRate: repayment.value!,
        fixedYears: fixedYears.value!,
      })
    : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Kredit berechnen">
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            label="Darlehenssumme"
            value={amount.raw}
            onChange={amount.setRaw}
            error={amount.error}
            unit="€"
            step={1000}
          />
          <NumberField
            label="Sollzins pro Jahr"
            value={rate.raw}
            onChange={rate.setRaw}
            error={rate.error}
            unit="%"
            step={0.01}
            hint="Der Sollzins, nicht der Effektivzins."
          />
          <NumberField
            label="Anfängliche Tilgung"
            value={repayment.raw}
            onChange={repayment.setRaw}
            error={repayment.error}
            unit="%"
            step={0.1}
            hint="Üblich sind 2 bis 3 Prozent."
          />
          <NumberField
            label="Zinsbindung"
            value={fixedYears.raw}
            onChange={fixedYears.setRaw}
            error={fixedYears.error}
            unit="Jahre"
          />
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <ResultGrid>
              <ResultValue
                label="Monatliche Rate"
                value={euro(result.monthlyRate)}
                note="bleibt über die Zinsbindung gleich"
                emphasis
              />
              <ResultValue
                label="Restschuld nach der Zinsbindung"
                value={euro(result.remainingDebt)}
                note={
                  result.remainingDebt > 0
                    ? "muss anschliessend neu finanziert werden"
                    : "das Darlehen ist vollständig getilgt"
                }
                emphasis
              />
            </ResultGrid>

            <div className="mt-5 grid gap-5 border-t border-brand/30 pt-5 sm:grid-cols-3">
              <ResultValue
                label="Gezahlte Zinsen"
                value={euro(result.interestPaid)}
              />
              <ResultValue
                label="Getilgt"
                value={euro(result.principalPaid)}
              />
              <ResultValue
                label="Gesamtlaufzeit"
                value={
                  result.totalMonths === null
                    ? "über 60 Jahre"
                    : formatDuration(result.totalMonths)
                }
                note="bei gleichbleibendem Zins"
              />
            </div>

            <div className="mt-6 border-t border-brand/30 pt-5">
              <p className="text-sm font-medium text-text">
                Verlauf während der Zinsbindung
              </p>
              <div className="mt-3 max-h-64 overflow-y-auto pr-1">
                <table className="w-full text-sm">
                  <caption className="sr-only">
                    Zinsen, Tilgung und Restschuld je Jahr
                  </caption>
                  <thead className="sticky top-0 bg-brand-soft/90">
                    <tr className="text-left text-text-muted">
                      <th scope="col" className="py-1.5 pr-3 font-medium">
                        Jahr
                      </th>
                      <th scope="col" className="py-1.5 pr-3 text-right font-medium">
                        Zinsen
                      </th>
                      <th scope="col" className="py-1.5 pr-3 text-right font-medium">
                        Tilgung
                      </th>
                      <th scope="col" className="py-1.5 text-right font-medium">
                        Restschuld
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
                          {formatNumber(row.interest)} €
                        </td>
                        <td className="py-1.5 pr-3 text-right tabular-nums text-text-muted">
                          {formatNumber(row.principal)} €
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

          {result.exceedsMaxTerm && (
            <Callout tone="warnung" title="Unrealistisch lange Laufzeit" live>
              Mit dieser Tilgung wäre das Darlehen auch nach 60 Jahren nicht
              abbezahlt. Eine anfängliche Tilgung von weniger als einem Prozent
              führt dazu, dass fast die gesamte Rate in die Zinsen fliesst. Übliche
              Werte liegen bei 2 bis 3 Prozent.
            </Callout>
          )}

          {result.remainingDebt > 0 && !result.exceedsMaxTerm && (
            <Callout tone="info" title="Was nach der Zinsbindung passiert">
              Am Ende der Zinsbindung bleibt eine Restschuld von{" "}
              {euro(result.remainingDebt)}. Dafür brauchst du eine
              Anschlussfinanzierung – zu den dann geltenden Zinsen. Steigen die
              Zinsen bis dahin, wird die Rate höher. Dieses Risiko lässt sich
              durch eine längere Zinsbindung oder eine höhere Tilgung verringern.
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
