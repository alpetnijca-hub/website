"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField, SelectField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatKcal, formatNumber } from "@/lib/format";
import {
  LIMITS,
  activityFactors,
  goalLabels,
  type ActivityLevel,
  type Goal,
  type Sex,
} from "@/lib/calculators/shared";
import { calculateTdee } from "@/lib/calculators/tdee";

const activityOptions = (
  Object.keys(activityFactors) as ActivityLevel[]
).map((key) => ({
  value: key,
  label: `${activityFactors[key].label} – ${activityFactors[key].description}`,
}));

export function CalorieCalculator() {
  const [sex, setSex] = useState<Sex>("weiblich");
  const [activity, setActivity] = useState<ActivityLevel>("leicht");
  const [goal, setGoal] = useState<Goal>("halten");

  const age = useNumericField("30", LIMITS.age);
  const weight = useNumericField("70", LIMITS.weight);
  const height = useNumericField("172", LIMITS.height);

  const complete =
    age.value !== null && weight.value !== null && height.value !== null;

  const result = complete
    ? calculateTdee({
        sex,
        age: age.value!,
        weightKg: weight.value!,
        heightCm: height.value!,
        activity,
        goal,
      })
    : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Kalorienbedarf berechnen">
        <div className="grid gap-5">
          <RadioGroupField
            legend="Geschlecht"
            value={sex}
            onChange={(value) => setSex(value as Sex)}
            options={[
              { value: "weiblich", label: "Weiblich" },
              { value: "maennlich", label: "Männlich" },
            ]}
            hint="Die Formel verwendet unterschiedliche Konstanten für Frauen und Männer."
          />

          <div className="grid gap-5 sm:grid-cols-3">
            <NumberField
              label="Alter"
              value={age.raw}
              onChange={age.setRaw}
              error={age.error}
              unit="Jahre"
              min={LIMITS.age.min}
              max={LIMITS.age.max}
            />
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

          <SelectField
            label="Aktivitätslevel"
            value={activity}
            onChange={(value) => setActivity(value as ActivityLevel)}
            options={activityOptions}
            hint="Schätze deinen gesamten Alltag ein, nicht nur das Training."
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
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <ResultGrid>
              <ResultValue
                label="Grundumsatz (BMR)"
                value={formatKcal(result.bmr)}
                note="Verbrauch in völliger Ruhe, ohne jede Bewegung"
              />
              <ResultValue
                label="Gesamtumsatz (TDEE)"
                value={formatKcal(result.tdee)}
                note={`Grundumsatz × ${formatNumber(result.activityFactor, 3)} (Aktivitätsfaktor)`}
                emphasis
              />
            </ResultGrid>

            <div className="mt-5 border-t border-brand/30 pt-5">
              <ResultValue
                label={`Empfohlene Zufuhr zum Ziel „${goalLabels[goal]}“`}
                value={formatKcal(result.targetCalories)}
                note={
                  result.goalAdjustment === 0
                    ? "Entspricht deinem Gesamtumsatz"
                    : `${result.goalAdjustment > 0 ? "+" : ""}${formatNumber(
                        result.goalAdjustment,
                      )} kcal gegenüber dem Gesamtumsatz`
                }
                emphasis
              />
            </div>
          </ResultCard>

          {result.adjustedToMinimum && (
            <Callout tone="warnung" title="Untergrenze erreicht" live>
              Für dein Ziel wäre rechnerisch eine noch niedrigere Zufuhr
              herausgekommen. Wir zeigen stattdessen{" "}
              {formatKcal(result.targetCalories)} an, weil darunter eine
              ausreichende Versorgung mit Nährstoffen kaum möglich ist. Ein
              kleineres Defizit oder mehr Bewegung ist hier der bessere Weg.
            </Callout>
          )}
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte fülle Alter, Gewicht und Körpergrösse mit gültigen Werten aus.
          Das Ergebnis erscheint automatisch.
        </Callout>
      )}
    </div>
  );
}
