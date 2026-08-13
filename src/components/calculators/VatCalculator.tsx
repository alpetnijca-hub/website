"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import {
  calculateVat,
  commonVatRates,
  type VatDirection,
} from "@/lib/calculators/vat";

const euro = (value: number) => `${formatNumber(value, 2)} €`;

const limits = {
  amount: { min: 0, max: 100_000_000, unit: "€" },
  rate: { min: 0, max: 100, unit: "%" },
};

export function VatCalculator() {
  const [direction, setDirection] = useState<VatDirection>("netto-zu-brutto");
  const amount = useNumericField("100", limits.amount);
  const rate = useNumericField("19", limits.rate);

  const result =
    amount.value !== null && rate.value !== null
      ? calculateVat({ amount: amount.value, rate: rate.value, direction })
      : null;

  const amountLabel =
    direction === "netto-zu-brutto"
      ? "Nettobetrag (ohne Steuer)"
      : "Bruttobetrag (mit Steuer)";

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Mehrwertsteuer berechnen">
        <div className="grid gap-5">
          <RadioGroupField
            legend="Rechenrichtung"
            value={direction}
            onChange={(value) => setDirection(value as VatDirection)}
            options={[
              { value: "netto-zu-brutto", label: "Steuer aufschlagen" },
              { value: "brutto-zu-netto", label: "Steuer herausrechnen" },
            ]}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label={amountLabel}
              value={amount.raw}
              onChange={amount.setRaw}
              error={amount.error}
              unit="€"
              step={0.01}
            />
            <NumberField
              label="Steuersatz"
              value={rate.raw}
              onChange={rate.setRaw}
              error={rate.error}
              unit="%"
              step={0.1}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-text">Gebräuchliche Sätze</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {commonVatRates.map((preset) => {
                const value = String(preset.rate).replace(".", ",");
                const active = rate.raw === value;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => rate.setRaw(value)}
                    aria-pressed={active}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "border-brand bg-brand-soft text-brand-strong"
                        : "border-border text-text-muted hover:border-text-subtle"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <ResultCard>
          <ResultGrid>
            <ResultValue label="Netto" value={euro(result.net)} emphasis />
            <ResultValue label="Brutto" value={euro(result.gross)} emphasis />
          </ResultGrid>

          <div className="mt-5 border-t border-brand/30 pt-5">
            <ResultValue
              label={`Steuerbetrag (${formatNumber(result.rate, 1)} %)`}
              value={euro(result.tax)}
            />
          </div>
        </ResultCard>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib Betrag und Steuersatz als gültige Zahlen ein.
        </Callout>
      )}
    </div>
  );
}
