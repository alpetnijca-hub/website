"use client";

import { useState } from "react";
import Link from "next/link";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatKcal, formatNumber, formatPercent } from "@/lib/format";
import { LIMITS, type Sex } from "@/lib/calculators/shared";
import { calculateDeficit } from "@/lib/calculators/deficit";

/** Voreinstellungen, damit niemand ein Defizit „aus dem Bauch“ eintippen muss. */
const presets = [
  { label: "Sanft (300 kcal)", value: "300" },
  { label: "Moderat (500 kcal)", value: "500" },
  { label: "Zügig (700 kcal)", value: "700" },
];

export function DeficitCalculator() {
  const [sex, setSex] = useState<Sex>("weiblich");
  const tdee = useNumericField("2200", LIMITS.calories);
  const deficit = useNumericField("500", LIMITS.calorieChange);

  const result =
    tdee.value !== null && deficit.value !== null
      ? calculateDeficit({
          tdee: tdee.value,
          dailyDeficit: deficit.value,
          sex,
        })
      : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Kaloriendefizit berechnen">
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Aktueller Kalorienbedarf"
              value={tdee.raw}
              onChange={tdee.setRaw}
              error={tdee.error}
              unit="kcal"
              min={LIMITS.calories.min}
              max={LIMITS.calories.max}
              hint="Dein Gesamtumsatz pro Tag"
            />
            <NumberField
              label="Gewünschtes Defizit"
              value={deficit.raw}
              onChange={deficit.setRaw}
              error={deficit.error}
              unit="kcal"
              min={LIMITS.calorieChange.min}
              max={LIMITS.calorieChange.max}
              hint="Wie viel weniger du täglich essen möchtest"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-text">Häufige Werte</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => deficit.setRaw(preset.value)}
                  aria-pressed={deficit.raw === preset.value}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    deficit.raw === preset.value
                      ? "border-brand bg-brand-soft text-brand-strong"
                      : "border-border text-text-muted hover:border-text-subtle"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <RadioGroupField
            legend="Geschlecht"
            value={sex}
            onChange={(value) => setSex(value as Sex)}
            options={[
              { value: "weiblich", label: "Weiblich" },
              { value: "maennlich", label: "Männlich" },
            ]}
            hint="Wird nur für die Untergrenze der empfohlenen Zufuhr verwendet."
          />

          <p className="text-sm text-text-muted">
            Du kennst deinen Bedarf noch nicht?{" "}
            <Link
              href="/gesundheit/kalorienbedarf-rechner"
              className="text-brand underline underline-offset-2"
            >
              Zuerst den Kalorienbedarf berechnen
            </Link>
            .
          </p>
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <ResultGrid>
              <ResultValue
                label="Tägliche Zufuhr"
                value={formatKcal(result.intake)}
                note={`entspricht einem Defizit von ${formatPercent(
                  result.deficitPercent,
                  1,
                )} deines Bedarfs`}
                emphasis
              />
              <ResultValue
                label="Geschätzte Abnahme pro Woche"
                value={`${formatNumber(result.weeklyChangeKg, 2)} kg`}
                note={
                  result.daysPerKg
                    ? `rechnerisch etwa ${formatNumber(result.daysPerKg)} Tage je Kilogramm`
                    : "kein Defizit gewählt"
                }
                emphasis
              />
            </ResultGrid>

            <div className="mt-5 border-t border-brand/30 pt-5">
              <ResultValue
                label="Geschätzte Abnahme in 30 Tagen"
                value={`${formatNumber(result.monthlyChangeKg, 2)} kg`}
              />
            </div>
          </ResultCard>

          {result.warnings.map((warning) => (
            <Callout
              key={warning.title}
              tone={
                warning.level === "kritisch"
                  ? "achtung"
                  : warning.level === "warnung"
                    ? "warnung"
                    : "info"
              }
              title={warning.title}
              live={warning.level !== "hinweis"}
            >
              {warning.text}
            </Callout>
          ))}
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib deinen Kalorienbedarf und das gewünschte Defizit als gültige
          Zahlen ein.
        </Callout>
      )}
    </div>
  );
}
