"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField, SelectField } from "@/components/ui/Field";
import { ResultCard, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatGrams, formatKcal, formatNumber } from "@/lib/format";
import { LIMITS, goalLabels, type Goal } from "@/lib/calculators/shared";
import {
  calculateProtein,
  proteinActivities,
  type ProteinActivity,
} from "@/lib/calculators/protein";

const activityOptions = (
  Object.keys(proteinActivities) as ProteinActivity[]
).map((key) => ({
  value: key,
  label: `${proteinActivities[key].label} – ${proteinActivities[key].description}`,
}));

export function ProteinCalculator() {
  const [activity, setActivity] = useState<ProteinActivity>("freizeit");
  const [goal, setGoal] = useState<Goal>("halten");
  const weight = useNumericField("70", LIMITS.weight);

  const result =
    weight.value !== null
      ? calculateProtein({ weightKg: weight.value, activity, goal })
      : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Proteinbedarf berechnen">
        <div className="grid gap-5">
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

          <SelectField
            label="Aktivitätsniveau"
            value={activity}
            onChange={(value) => setActivity(value as ProteinActivity)}
            options={activityOptions}
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
            <ResultValue
              label="Empfohlene Eiweisszufuhr pro Tag"
              value={`${formatGrams(result.gramsPerDay.min)} – ${formatGrams(
                result.gramsPerDay.max,
              )}`}
              note={`entspricht ${formatNumber(
                result.gramsPerKg.min,
                1,
              )} – ${formatNumber(result.gramsPerKg.max, 1)} g je Kilogramm Körpergewicht`}
              emphasis
            />

            <p className="mt-4 text-sm text-text-muted">
              Energieanteil: {formatKcal(result.caloriesPerDay.min)} bis{" "}
              {formatKcal(result.caloriesPerDay.max)} pro Tag.
            </p>

            <div className="mt-5 rounded-lg bg-surface/70 p-4 text-sm leading-relaxed text-text-muted">
              {result.goalNote}
            </div>

            {/* Praktische Einordnung: was bedeutet die Menge auf dem Teller */}
            <div className="mt-4 text-sm leading-relaxed text-text-muted">
              <p className="font-medium text-text">
                Grobe Orientierung für {formatGrams(result.gramsPerDay.min)}{" "}
                Eiweiss am Tag:
              </p>
              <p className="mt-1">
                Etwa 150 g Hähnchenbrust (rund 35 g), 250 g Magerquark (rund
                34 g), 2 Eier (rund 13 g) und 100 g Linsen roh (rund 24 g)
                zusammen ergeben bereits gut 100 g. Die Werte sind Näherungen
                und schwanken je nach Produkt.
              </p>
            </div>
          </ResultCard>

          <Callout tone="info" title="Warum eine Spanne und kein exakter Wert">
            Der Proteinbedarf hängt von Trainingsreiz, Alter, Gesamtenergie und
            Eiweissqualität ab. Studien liefern deshalb Bereiche, keine
            Punktwerte. Wer sich am unteren Rand der Spanne bewegt, macht nichts
            falsch – am oberen Rand liegt der Vorteil vor allem beim Muskelerhalt
            in einer Diät.
          </Callout>
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib dein Körpergewicht als gültige Zahl ein.
        </Callout>
      )}
    </div>
  );
}
