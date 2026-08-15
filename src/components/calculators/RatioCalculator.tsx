"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import { calculateRatio, type RatioMode } from "@/lib/calculators/ratio";

const limits = { min: 0, max: 1_000_000_000 };

export function RatioCalculator() {
  const [mode, setMode] = useState<RatioMode>("proportional");
  const a = useNumericField("3", limits);
  const b = useNumericField("1.5", limits);
  const c = useNumericField("7", limits);

  const result =
    a.value !== null && b.value !== null && c.value !== null
      ? calculateRatio({ a: a.value, b: b.value, c: c.value, mode })
      : null;

  const proportional = mode === "proportional";

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Dreisatz berechnen">
        <div className="grid gap-5">
          <RadioGroupField
            legend="Wie hängen die Grössen zusammen?"
            hint={
              proportional
                ? "Mehr von A bedeutet mehr von B – zum Beispiel Menge und Preis."
                : "Mehr von A bedeutet weniger von B – zum Beispiel Arbeiter und Arbeitszeit."
            }
            value={mode}
            onChange={(value) => setMode(value as RatioMode)}
            options={[
              { value: "proportional", label: "Je mehr, desto mehr" },
              { value: "umgekehrt", label: "Je mehr, desto weniger" },
            ]}
          />

          <div className="rounded-lg border border-border bg-surface-muted/40 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Wenn"
                value={a.raw}
                onChange={a.setRaw}
                error={a.error}
                step={1}
              />
              <NumberField
                label={proportional ? "entsprechen" : "brauchen"}
                value={b.raw}
                onChange={b.setRaw}
                error={b.error}
                step={1}
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField
                label="dann entsprechen"
                value={c.raw}
                onChange={c.setRaw}
                error={c.error}
                step={1}
              />
              <div className="flex items-end">
                <p className="text-sm text-text-muted">
                  … dem gesuchten Wert <strong className="text-text">x</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <ResultCard>
          <ResultValue
            label="Gesuchter Wert"
            value={formatNumber(result.value, 4)}
            emphasis
          />

          <div className="mt-5 border-t border-accent/30 pt-5">
            <p className="text-sm font-medium text-text">Rechenweg</p>
            <ol className="mt-2 space-y-2">
              {result.steps.map((step) => (
                <li key={step.label}>
                  <p className="text-sm text-text-muted">{step.label}</p>
                  <p className="font-mono text-sm text-text">
                    {step.calculation}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </ResultCard>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib drei Zahlen ab 0 ein. Der erste Wert darf nicht 0 sein –
          aus „0 Stück kosten 5 €“ lässt sich nichts ableiten. Beim umgekehrten
          Dreisatz gilt das auch für den dritten Wert.
        </Callout>
      )}
    </div>
  );
}
