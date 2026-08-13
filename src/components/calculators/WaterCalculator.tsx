"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, SelectField } from "@/components/ui/Field";
import { ResultCard, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatVolume } from "@/lib/format";
import { LIMITS } from "@/lib/calculators/shared";
import {
  calculateWater,
  waterActivities,
  type WaterActivity,
} from "@/lib/calculators/water";

const activityOptions = (
  Object.keys(waterActivities) as WaterActivity[]
).map((key) => ({
  value: key,
  label: `${waterActivities[key].label} – ${waterActivities[key].description}`,
}));

export function WaterCalculator() {
  const [activity, setActivity] = useState<WaterActivity>("mittel");
  const weight = useNumericField("70", LIMITS.weight);
  const training = useNumericField("0", LIMITS.trainingMinutes);

  const result =
    weight.value !== null && training.value !== null
      ? calculateWater({
          weightKg: weight.value,
          activity,
          trainingMinutes: training.value,
        })
      : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Wasserbedarf berechnen">
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
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
            <NumberField
              label="Training heute"
              value={training.raw}
              onChange={training.setRaw}
              error={training.error}
              unit="Min."
              min={LIMITS.trainingMinutes.min}
              max={LIMITS.trainingMinutes.max}
              hint="Optional – 0 eintragen, wenn du nicht trainierst."
            />
          </div>

          <SelectField
            label="Alltag und Umgebung"
            value={activity}
            onChange={(value) => setActivity(value as WaterActivity)}
            options={activityOptions}
          />
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard title="Orientierungswert">
            <ResultValue
              label="Trinkmenge pro Tag"
              value={`${formatVolume(result.totalMl.min)} – ${formatVolume(
                result.totalMl.max,
              )}`}
              emphasis
            />

            <dl className="mt-5 grid gap-3 border-t border-brand/30 pt-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-text-muted">Grundbedarf</dt>
                <dd className="text-lg font-semibold text-text">
                  {formatVolume(result.baseMl.min)} –{" "}
                  {formatVolume(result.baseMl.max)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Zuschlag Training</dt>
                <dd className="text-lg font-semibold text-text">
                  {result.trainingMl.max === 0
                    ? "kein Zuschlag"
                    : `${formatVolume(result.trainingMl.min)} – ${formatVolume(
                        result.trainingMl.max,
                      )}`}
                </dd>
              </div>
            </dl>
          </ResultCard>

          {result.highIntakeWarning && (
            <Callout tone="warnung" title="Ungewöhnlich hohe Menge" live>
              Die berechnete Spanne liegt über vier Litern pro Tag. So grosse
              Mengen sind nur bei starkem Schwitzen sinnvoll und sollten über
              den Tag verteilt getrunken werden. Sehr viel Wasser in kurzer Zeit
              kann den Salzhaushalt stören.
            </Callout>
          )}

          <Callout tone="info" title="Was hier nicht eingerechnet ist">
            Der Wert bezieht sich auf Getränke. Etwa 20 bis 30 Prozent der
            Flüssigkeit nehmen die meisten Menschen zusätzlich über feste
            Nahrung auf – vor allem über Obst, Gemüse und Suppen. Wer viel davon
            isst, braucht entsprechend weniger zu trinken.
          </Callout>
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib dein Körpergewicht und eine gültige Trainingsdauer ein.
        </Callout>
      )}
    </div>
  );
}
