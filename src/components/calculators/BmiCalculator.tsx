"use client";

import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField } from "@/components/ui/Field";
import { ResultCard, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatKg, formatNumber } from "@/lib/format";
import { LIMITS } from "@/lib/calculators/shared";
import { bmiCategories, calculateBmi } from "@/lib/calculators/bmi";

export function BmiCalculator() {
  const weight = useNumericField("70", LIMITS.weight);
  const height = useNumericField("172", LIMITS.height);

  const result =
    weight.value !== null && height.value !== null
      ? calculateBmi({ weightKg: weight.value, heightCm: height.value })
      : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="BMI berechnen">
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            label="Gewicht"
            value={weight.raw}
            onChange={weight.setRaw}
            error={weight.error}
            unit="kg"
            step={0.1}
            min={LIMITS.weight.min}
            max={LIMITS.weight.max}
          />
          <NumberField
            label="Körpergrösse"
            value={height.raw}
            onChange={height.setRaw}
            error={height.error}
            unit="cm"
            min={LIMITS.height.min}
            max={LIMITS.height.max}
          />
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <ResultValue
                label="Dein BMI"
                value={formatNumber(result.bmi, 1)}
                emphasis
              />
              <p className="rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-on-brand">
                {result.category.label}
              </p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Bei einer Körpergrösse von {formatNumber(height.value!)} cm
              entspricht der Normalgewichtsbereich (BMI 18,5 bis 24,9) einem
              Gewicht von {formatKg(result.normalWeightRange.min)} bis{" "}
              {formatKg(result.normalWeightRange.max)}.
              {result.distanceToNormalKg > 0 && (
                <>
                  {" "}
                  Dein aktuelles Gewicht liegt{" "}
                  {formatKg(result.distanceToNormalKg)} ausserhalb dieses
                  Bereichs.
                </>
              )}
            </p>

            {/* Skala zur Einordnung */}
            <div className="mt-5">
              <ul className="space-y-1.5">
                {bmiCategories.map((category) => {
                  const isCurrent = category.key === result.category.key;
                  return (
                    <li
                      key={category.key}
                      className={`flex items-center justify-between rounded-md px-3 py-1.5 text-sm ${
                        isCurrent
                          ? "bg-brand font-semibold text-on-brand"
                          : "text-text-muted"
                      }`}
                    >
                      <span>{category.label}</span>
                      <span className="tabular-nums">
                        {category.to === null
                          ? `ab ${formatNumber(category.from, 1)}`
                          : `${formatNumber(category.from, 1)} – ${formatNumber(
                              category.to - 0.1,
                              1,
                            )}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </ResultCard>

          <Callout tone="info" title="So ist der Wert zu lesen">
            Der BMI setzt nur Gewicht und Grösse ins Verhältnis. Er
            unterscheidet nicht zwischen Muskel- und Fettmasse und sagt nichts
            darüber aus, wo am Körper Fett sitzt. Für eine Einschätzung deiner
            Gesundheit ist er allein nicht ausreichend.
          </Callout>
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib Gewicht und Körpergrösse als gültige Zahlen ein.
        </Callout>
      )}
    </div>
  );
}
