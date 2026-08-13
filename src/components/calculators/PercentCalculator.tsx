"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField } from "@/components/ui/Field";
import { ResultCard, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import {
  calculatePercent,
  percentModes,
  type PercentMode,
} from "@/lib/calculators/percent";

/** Weiter Wertebereich – Prozentrechnung ist nicht auf Grössen beschränkt. */
const anyNumber = { min: -1_000_000_000, max: 1_000_000_000 };

/** Feldbeschriftungen je Rechenart. */
const labels: Record<PercentMode, { a: string; b: string; result: string }> = {
  wert: { a: "Grundwert", b: "Prozentsatz", result: "Prozentwert" },
  satz: { a: "Prozentwert", b: "Grundwert", result: "Prozentsatz" },
  grundwert: { a: "Prozentwert", b: "Prozentsatz", result: "Grundwert" },
  veraenderung: { a: "Alter Wert", b: "Neuer Wert", result: "Veränderung" },
};

export function PercentCalculator() {
  const [mode, setMode] = useState<PercentMode>("wert");
  const a = useNumericField("250", anyNumber);
  const b = useNumericField("19", anyNumber);

  const result =
    a.value !== null && b.value !== null
      ? calculatePercent({ mode, a: a.value, b: b.value })
      : null;

  const label = labels[mode];
  const showPercentUnit = mode === "wert" || mode === "grundwert";

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Prozent berechnen">
        <div className="grid gap-5">
          <fieldset>
            <legend className="text-sm font-medium text-text">
              Was möchtest du berechnen?
            </legend>
            <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
              {(Object.keys(percentModes) as PercentMode[]).map((key) => {
                const checked = key === mode;
                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer flex-col rounded-lg border px-4 py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${
                      checked
                        ? "border-brand bg-brand-soft"
                        : "border-border bg-surface hover:border-text-subtle"
                    }`}
                  >
                    <input
                      type="radio"
                      name="prozent-modus"
                      value={key}
                      checked={checked}
                      onChange={() => setMode(key)}
                      className="sr-only"
                    />
                    <span
                      className={`text-sm font-semibold ${
                        checked ? "text-brand-strong" : "text-text"
                      }`}
                    >
                      {percentModes[key].label}
                    </span>
                    <span className="mt-0.5 text-xs leading-relaxed text-text-muted">
                      {percentModes[key].question}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label={label.a}
              value={a.raw}
              onChange={a.setRaw}
              error={a.error}
              step={0.01}
            />
            <NumberField
              label={label.b}
              value={b.raw}
              onChange={b.setRaw}
              error={b.error}
              unit={showPercentUnit && mode !== "grundwert" ? "%" : undefined}
              step={0.01}
            />
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <ResultCard>
          <ResultValue
            label={label.result}
            value={
              result.unit === "prozent"
                ? `${formatNumber(result.value, 2)} %`
                : formatNumber(result.value, 2)
            }
            note={result.note}
            emphasis
          />

          <div className="mt-5 border-t border-brand/30 pt-4">
            <p className="text-sm font-medium text-text">Rechenweg</p>
            <ul className="mt-1.5 space-y-1 font-mono text-sm text-text-muted">
              {result.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </ResultCard>
      ) : (
        <Callout tone="warnung" title="Diese Rechnung geht nicht auf" live>
          {mode === "satz" &&
            "Ein Grundwert von 0 lässt sich nicht in Prozent aufteilen – dafür müsste durch null geteilt werden."}
          {mode === "grundwert" &&
            "Bei einem Prozentsatz von 0 lässt sich der Grundwert nicht bestimmen."}
          {mode === "veraenderung" &&
            "Von einem Ausgangswert von 0 aus lässt sich keine prozentuale Veränderung berechnen."}
          {mode === "wert" && "Bitte gib zwei gültige Zahlen ein."}
        </Callout>
      )}
    </div>
  );
}
