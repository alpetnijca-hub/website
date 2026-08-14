"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatKg } from "@/lib/format";
import { LIMITS, type Sex } from "@/lib/calculators/shared";
import { calculateIdealWeight } from "@/lib/calculators/idealWeight";

export function IdealWeightCalculator() {
  const [sex, setSex] = useState<Sex>("weiblich");
  const height = useNumericField("172", LIMITS.height);

  const result =
    height.value !== null
      ? calculateIdealWeight({ heightCm: height.value, sex })
      : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Idealgewicht berechnen">
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            label="Körpergrösse"
            value={height.raw}
            onChange={height.setRaw}
            error={height.error}
            unit="cm"
            min={LIMITS.height.min}
            max={LIMITS.height.max}
          />
          <RadioGroupField
            legend="Geschlecht"
            value={sex}
            onChange={(value) => setSex(value as Sex)}
            options={[
              { value: "weiblich", label: "Weiblich" },
              { value: "maennlich", label: "Männlich" },
            ]}
          />
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard title="Orientierungswerte">
            <ResultValue
              label="Spanne über alle fünf Formeln"
              value={`${formatKg(result.range.min)} – ${formatKg(result.range.max)}`}
              note={`Durchschnitt: ${formatKg(result.average)}`}
              emphasis
            />

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <caption className="sr-only">
                  Ergebnisse der einzelnen Formeln
                </caption>
                <thead>
                  <tr className="border-b border-accent/30 text-left text-text-muted">
                    <th scope="col" className="py-2 pr-4 font-medium">
                      Formel
                    </th>
                    <th scope="col" className="py-2 pr-4 font-medium">
                      Herkunft
                    </th>
                    <th scope="col" className="py-2 text-right font-medium">
                      Ergebnis
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.formulas.map((formula) => (
                    <tr key={formula.key} className="border-b border-brand/15">
                      <th
                        scope="row"
                        className="py-2 pr-4 text-left font-semibold text-text"
                      >
                        {formula.name}
                      </th>
                      <td className="py-2 pr-4 text-text-muted">
                        {formula.origin}
                      </td>
                      <td className="py-2 text-right font-semibold tabular-nums text-text">
                        {formatKg(formula.weightKg)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th
                      scope="row"
                      className="py-2 pr-4 text-left font-semibold text-text"
                    >
                      BMI-Normalbereich
                    </th>
                    <td className="py-2 pr-4 text-text-muted">
                      WHO-Klassifikation (BMI 18,5–24,9)
                    </td>
                    <td className="py-2 text-right font-semibold tabular-nums text-text">
                      {formatKg(result.bmiRange.min)} –{" "}
                      {formatKg(result.bmiRange.max)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ResultCard>

          <Callout tone="warnung" title="Kein Zielgewicht, sondern ein Anhaltspunkt">
            Die fünf Formeln kommen zu unterschiedlichen Ergebnissen – schon das
            zeigt, dass es das eine Idealgewicht nicht gibt. Vier davon wurden
            ursprünglich entwickelt, um Medikamentendosen zu berechnen, nicht um
            ein Wunschgewicht festzulegen. Nutze die Spanne als groben Rahmen und
            nicht als Vorgabe.
          </Callout>
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib deine Körpergrösse als gültige Zahl ein.
        </Callout>
      )}
    </div>
  );
}
