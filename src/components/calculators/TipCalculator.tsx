"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import { calculateTip, commonTipRates } from "@/lib/calculators/tip";

const euro = (value: number) => `${formatNumber(value, 2)} €`;

const limits = {
  bill: { min: 0, max: 100_000, unit: "€" },
  rate: { min: 0, max: 100, unit: "%" },
  people: { min: 1, max: 100, unit: "Personen", integer: true },
};

export function TipCalculator() {
  const bill = useNumericField("47.30", limits.bill);
  const rate = useNumericField("10", limits.rate);
  const people = useNumericField("1", limits.people);
  const [roundUp, setRoundUp] = useState("nein");

  const result =
    bill.value !== null && rate.value !== null && people.value !== null
      ? calculateTip({
          bill: bill.value,
          rate: rate.value,
          people: people.value,
          roundUp: roundUp === "ja",
        })
      : null;

  const rounded = roundUp === "ja";
  const rateDiffers =
    result !== null &&
    rate.value !== null &&
    Math.abs(result.rate - rate.value) >= 0.01;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Trinkgeld berechnen">
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Rechnungsbetrag"
              value={bill.raw}
              onChange={bill.setRaw}
              error={bill.error}
              unit="€"
              step={0.1}
            />
            <NumberField
              label="Trinkgeld"
              value={rate.raw}
              onChange={rate.setRaw}
              error={rate.error}
              unit="%"
              step={1}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-text">Schnellauswahl</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {commonTipRates.map((preset) => {
                const value = String(preset.rate);
                const active = rate.raw === value;
                return (
                  <button
                    key={preset.rate}
                    type="button"
                    onClick={() => rate.setRaw(value)}
                    aria-pressed={active}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border text-text-muted hover:border-text-subtle"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Anzahl Personen"
              hint="Zum Aufteilen der Rechnung"
              value={people.raw}
              onChange={people.setRaw}
              error={people.error}
              step={1}
            />
            <RadioGroupField
              legend="Gesamtbetrag aufrunden"
              hint="Auf volle Euro – so, wie man es im Lokal sagt."
              value={roundUp}
              onChange={setRoundUp}
              options={[
                { value: "nein", label: "Genau rechnen" },
                { value: "ja", label: "Aufrunden" },
              ]}
            />
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <ResultGrid>
              <ResultValue
                label="Du zahlst insgesamt"
                value={euro(result.total)}
                emphasis
              />
              <ResultValue
                label="Davon Trinkgeld"
                value={euro(result.tip)}
                emphasis
                note={`entspricht ${formatNumber(result.rate, 2)} % der Rechnung`}
              />
            </ResultGrid>

            {result.people > 1 && (
              <div className="mt-5 grid gap-5 border-t border-accent/30 pt-5 sm:grid-cols-2">
                <ResultValue
                  label={`Pro Person (${formatNumber(result.people)})`}
                  value={euro(result.perPerson)}
                />
                <ResultValue
                  label="Davon Trinkgeld je Person"
                  value={euro(result.tipPerPerson)}
                />
              </div>
            )}
          </ResultCard>

          {rounded && rateDiffers && (
            <Callout tone="info" title="Aufgerundet ist es ein anderer Satz" live>
              Durch das Aufrunden auf {euro(result.total)} liegt das Trinkgeld
              bei {formatNumber(result.rate, 2)} Prozent statt der
              eingestellten {formatNumber(rate.value ?? 0, 2)} Prozent.
            </Callout>
          )}
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib einen Rechnungsbetrag ab 0 €, ein Trinkgeld zwischen 0 und
          100 Prozent und mindestens eine Person ein.
        </Callout>
      )}
    </div>
  );
}
