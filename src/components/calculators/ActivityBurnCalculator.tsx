"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatKcal, formatNumber } from "@/lib/format";
import { LIMITS } from "@/lib/calculators/shared";
import { calculateActivityBurn } from "@/lib/calculators/activityBurn";
import { metActivityGroups } from "@/data/mets";

export function ActivityBurnCalculator() {
  const [activityId, setActivityId] = useState("joggen-8");
  const weight = useNumericField("70", LIMITS.weight);
  const duration = useNumericField("30", LIMITS.duration);

  const result =
    weight.value !== null && duration.value !== null
      ? calculateActivityBurn({
          weightKg: weight.value,
          activityId,
          durationMinutes: duration.value,
        })
      : null;

  const groups = metActivityGroups();

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Kalorienverbrauch berechnen">
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
              label="Dauer"
              value={duration.raw}
              onChange={duration.setRaw}
              error={duration.error}
              unit="Min."
              min={LIMITS.duration.min}
              max={LIMITS.duration.max}
            />
          </div>

          {/* Gruppierte Auswahl: eigenes Markup, weil optgroup gebraucht wird. */}
          <div>
            <label
              htmlFor="sportart"
              className="block text-sm font-medium text-text"
            >
              Sportart oder Tätigkeit
            </label>
            <select
              id="sportart"
              value={activityId}
              onChange={(event) => setActivityId(event.target.value)}
              className="mt-1.5 w-full appearance-none rounded-lg border border-border bg-surface px-3 py-2.5 pr-8 text-base text-text hover:border-text-subtle focus:outline-none"
            >
              {groups.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} ({formatNumber(item.met, 1)} MET)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <ResultGrid>
              <ResultValue
                label="Verbrauch gesamt (brutto)"
                value={formatKcal(result.totalKcal)}
                note={`${formatNumber(result.kcalPerMinute, 1)} kcal pro Minute bei ${formatNumber(
                  result.met,
                  1,
                )} MET`}
                emphasis
              />
              <ResultValue
                label="Zusätzlich zum Ruheumsatz (netto)"
                value={formatKcal(result.netKcal)}
                note="Der Anteil, der über den Grundverbrauch hinausgeht"
                emphasis
              />
            </ResultGrid>
          </ResultCard>

          <Callout tone="info" title="Brutto oder netto – welcher Wert zählt?">
            Wenn du deinen Tagesbedarf bereits mit einem Aktivitätsfaktor
            berechnet hast, ist das Training dort meist schon enthalten. Rechne
            es dann nicht ein zweites Mal dazu. Willst du eine einzelne Einheit
            zusätzlich anrechnen, ist der Nettowert der ehrlichere – er zieht
            ab, was du in dieser Zeit auch auf dem Sofa verbraucht hättest.
          </Callout>
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib Körpergewicht und Dauer als gültige Zahlen ein.
        </Callout>
      )}
    </div>
  );
}
