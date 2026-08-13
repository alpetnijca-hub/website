"use client";

import { useState } from "react";
import Link from "next/link";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatGrams, formatKcal, formatPercent } from "@/lib/format";
import { LIMITS, goalLabels, type Goal } from "@/lib/calculators/shared";
import { calculateMacros, type MacroSplit } from "@/lib/calculators/macros";

const macroMeta = [
  { key: "protein", label: "Protein", color: "var(--color-brand)" },
  { key: "fat", label: "Fett", color: "var(--color-warning)" },
  { key: "carbs", label: "Kohlenhydrate", color: "var(--color-text-subtle)" },
] as const;

export function MacroCalculator() {
  const [goal, setGoal] = useState<Goal>("halten");
  const [useWeight, setUseWeight] = useState(true);
  const calories = useNumericField("2200", LIMITS.calories);
  const weight = useNumericField("70", LIMITS.weight);

  const result =
    calories.value !== null
      ? calculateMacros({
          calories: calories.value,
          goal,
          weightKg: useWeight && weight.value !== null ? weight.value : undefined,
        })
      : null;

  const splits: Record<string, MacroSplit> | null = result
    ? { protein: result.protein, fat: result.fat, carbs: result.carbs }
    : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Makronährstoffe berechnen">
        <div className="grid gap-5">
          <NumberField
            label="Tägliches Kalorienziel"
            value={calories.raw}
            onChange={calories.setRaw}
            error={calories.error}
            unit="kcal"
            min={LIMITS.calories.min}
            max={LIMITS.calories.max}
            hint="Der Wert, den du täglich essen möchtest."
          />

          <RadioGroupField
            legend="Ziel"
            value={goal}
            onChange={(value) => setGoal(value as Goal)}
            options={[
              { value: "abnehmen", label: goalLabels.abnehmen },
              { value: "halten", label: goalLabels.halten },
              { value: "zunehmen", label: goalLabels.zunehmen },
            ]}
            columns={3}
          />

          <div className="rounded-lg border border-border bg-surface-muted/50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={useWeight}
                onChange={(event) => setUseWeight(event.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-brand)]"
              />
              <span className="text-sm">
                <span className="block font-medium text-text">
                  Körpergewicht berücksichtigen
                </span>
                <span className="mt-0.5 block leading-relaxed text-text-muted">
                  Dann wird die Proteinmenge je Kilogramm Körpergewicht
                  berechnet statt als fester Prozentanteil. Das ist genauer.
                </span>
              </span>
            </label>

            {useWeight && (
              <div className="mt-4">
                <NumberField
                  label="Körpergewicht"
                  value={weight.raw}
                  onChange={weight.setRaw}
                  error={weight.error}
                  unit="kg"
                  step={0.1}
                  min={LIMITS.weight.min}
                  max={LIMITS.weight.max}
                />
              </div>
            )}
          </div>

          <p className="text-sm text-text-muted">
            Kalorienziel noch offen?{" "}
            <Link
              href="/gesundheit/kalorienbedarf-rechner"
              className="text-brand underline underline-offset-2"
            >
              Kalorienbedarf berechnen
            </Link>
            .
          </p>
        </div>
      </CalculatorShell>

      {result && splits ? (
        <>
          <ResultCard title={`Verteilung von ${formatKcal(result.calories)}`}>
            {/* Anteilsbalken */}
            <div
              className="flex h-4 w-full overflow-hidden rounded-full"
              role="img"
              aria-label={`Protein ${formatPercent(
                result.protein.percent,
                1,
              )}, Fett ${formatPercent(result.fat.percent, 1)}, Kohlenhydrate ${formatPercent(
                result.carbs.percent,
                1,
              )}`}
            >
              {macroMeta.map((macro) => (
                <span
                  key={macro.key}
                  style={{
                    width: `${splits[macro.key].percent}%`,
                    backgroundColor: macro.color,
                  }}
                />
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {macroMeta.map((macro) => {
                const split = splits[macro.key];
                return (
                  <div key={macro.key}>
                    <p className="flex items-center gap-2 text-sm text-text-muted">
                      <span
                        aria-hidden="true"
                        className="inline-block h-3 w-3 rounded-sm"
                        style={{ backgroundColor: macro.color }}
                      />
                      {macro.label}
                    </p>
                    <p className="text-2xl font-bold text-text">
                      {formatGrams(split.grams)}
                    </p>
                    <p className="text-xs text-text-subtle">
                      {formatPercent(split.percent, 1)} ·{" "}
                      {formatKcal(split.kcal)}
                    </p>
                  </div>
                );
              })}
            </div>
          </ResultCard>

          {result.notes.map((note) => (
            <Callout key={note} tone="info">
              {note}
            </Callout>
          ))}
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib ein gültiges Kalorienziel ein.
        </Callout>
      )}
    </div>
  );
}
