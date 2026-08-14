"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import {
  calculateDiscount,
  combineDiscounts,
  type DiscountMode,
} from "@/lib/calculators/discount";

const euro = (value: number) => `${formatNumber(value, 2)} €`;

const limits = {
  price: { min: 0, max: 10_000_000, unit: "€" },
  rate: { min: 0, max: 100, unit: "%" },
};

const quickRates = [10, 20, 25, 30, 50, 70];

export function DiscountCalculator() {
  const [mode, setMode] = useState<DiscountMode>("endpreis");
  const originalPrice = useNumericField("199", limits.price);
  const finalPrice = useNumericField("149", limits.price);
  const rate = useNumericField("25", limits.rate);
  const secondRate = useNumericField("", { ...limits.rate });

  const result = calculateDiscount({
    mode,
    originalPrice: originalPrice.value ?? undefined,
    finalPrice: finalPrice.value ?? undefined,
    rate: rate.value ?? undefined,
  });

  // Zweiter Rabatt ist ein freiwilliges Zusatzfeld: leer lassen heisst,
  // dass nur ein Rabatt gilt.
  const extra = secondRate.raw.trim() === "" ? null : secondRate.value;
  const combined =
    mode !== "rabattsatz" && extra !== null && rate.value !== null
      ? combineDiscounts([rate.value, extra])
      : null;
  const combinedResult =
    combined !== null && result !== null
      ? calculateDiscount({
          mode: "endpreis",
          originalPrice: result.originalPrice,
          rate: combined,
        })
      : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Rabatt berechnen">
        <div className="grid gap-5">
          <RadioGroupField
            legend="Was möchtest du wissen?"
            columns={3}
            value={mode}
            onChange={(value) => setMode(value as DiscountMode)}
            options={[
              { value: "endpreis", label: "Endpreis" },
              { value: "rabattsatz", label: "Rabatt in %" },
              { value: "originalpreis", label: "Originalpreis" },
            ]}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {mode !== "originalpreis" && (
              <NumberField
                label="Originalpreis"
                value={originalPrice.raw}
                onChange={originalPrice.setRaw}
                error={originalPrice.error}
                unit="€"
                step={0.01}
              />
            )}
            {mode !== "endpreis" && (
              <NumberField
                label="Preis nach Rabatt"
                value={finalPrice.raw}
                onChange={finalPrice.setRaw}
                error={finalPrice.error}
                unit="€"
                step={0.01}
              />
            )}
            {mode !== "rabattsatz" && (
              <NumberField
                label="Rabatt"
                value={rate.raw}
                onChange={rate.setRaw}
                error={rate.error}
                unit="%"
                step={1}
              />
            )}
          </div>

          {mode !== "rabattsatz" && (
            <>
              <div>
                <p className="text-sm font-medium text-text">Schnellauswahl</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {quickRates.map((value) => {
                    const text = String(value);
                    const active = rate.raw === text;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => rate.setRaw(text)}
                        aria-pressed={active}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          active
                            ? "border-accent bg-accent-soft text-accent"
                            : "border-border text-text-muted hover:border-text-subtle"
                        }`}
                      >
                        −{value} %
                      </button>
                    );
                  })}
                </div>
              </div>

              <NumberField
                label="Zusätzlicher Rabatt (optional)"
                hint="Zum Beispiel ein Gutschein, der an der Kasse noch einmal abgezogen wird. Leer lassen, wenn es nur einen Rabatt gibt."
                value={secondRate.raw}
                onChange={secondRate.setRaw}
                error={secondRate.error}
                unit="%"
                step={1}
              />
            </>
          )}
        </div>
      </CalculatorShell>

      {result ? (
        <ResultCard>
          <ResultGrid>
            <ResultValue
              label="Du zahlst"
              value={euro(result.finalPrice)}
              emphasis
            />
            <ResultValue
              label="Du sparst"
              value={euro(result.savings)}
              emphasis
              note={`Das sind ${formatNumber(result.rate, 2)} % vom Originalpreis`}
            />
          </ResultGrid>

          <div className="mt-5 border-t border-accent/30 pt-5">
            <ResultValue
              label="Originalpreis"
              value={euro(result.originalPrice)}
            />
          </div>

          {combined !== null && combinedResult !== null && (
            <div className="mt-5 border-t border-accent/30 pt-5">
              <ResultValue
                label="Mit beiden Rabatten nacheinander"
                value={euro(combinedResult.finalPrice)}
                note={`Gesamtrabatt ${formatNumber(combined, 2)} % – nicht ${formatNumber(
                  (rate.value ?? 0) + (extra ?? 0),
                  2,
                )} %, weil der zweite Rabatt vom bereits reduzierten Preis abgeht`}
              />
            </div>
          )}
        </ResultCard>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          {mode === "rabattsatz"
            ? "Bitte gib beide Preise ein. Der Preis nach Rabatt darf nicht über dem Originalpreis liegen, und der Originalpreis nicht 0 € betragen."
            : "Bitte gib einen gültigen Preis und einen Rabatt zwischen 0 und 100 Prozent ein. Bei genau 100 Prozent lässt sich der Originalpreis nicht zurückrechnen."}
        </Callout>
      )}
    </div>
  );
}
