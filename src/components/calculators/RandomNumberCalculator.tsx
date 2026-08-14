"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import { drawNumbers } from "@/lib/calculators/randomNumber";

const limits = {
  bound: { min: -1_000_000_000, max: 1_000_000_000, integer: true },
  count: { min: 1, max: 500, unit: "Zahlen", integer: true },
};

const presets = [
  { label: "Lotto 6 aus 49", min: "1", max: "49", count: "6", unique: "ja" },
  { label: "Würfel", min: "1", max: "6", count: "1", unique: "nein" },
  { label: "Zahl von 1 bis 100", min: "1", max: "100", count: "1", unique: "ja" },
  { label: "Losentscheid 0 oder 1", min: "0", max: "1", count: "1", unique: "nein" },
];

export function RandomNumberCalculator() {
  const min = useNumericField("1", limits.bound);
  const max = useNumericField("49", limits.bound);
  const count = useNumericField("6", limits.count);
  const [unique, setUnique] = useState("ja");
  const [sorted, setSorted] = useState("ja");

  /**
   * Das Ergebnis entsteht erst auf Knopfdruck und nicht schon beim Aufbau der
   * Seite. Das ist hier kein Komfortverzicht, sondern notwendig: Eine beim
   * Rendern gezogene Zufallszahl wäre auf dem Server eine andere als im
   * Browser, und die Seite würde beim Übernehmen der Darstellung springen.
   */
  const [numbers, setNumbers] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputsValid =
    min.value !== null && max.value !== null && count.value !== null;

  function draw() {
    if (!inputsValid) {
      setError("Bitte gib ganze Zahlen für Bereich und Anzahl ein.");
      setNumbers(null);
      return;
    }
    if (max.value! < min.value!) {
      setError("Der grösste Wert muss mindestens so gross sein wie der kleinste.");
      setNumbers(null);
      return;
    }
    const result = drawNumbers({
      min: min.value!,
      max: max.value!,
      count: count.value!,
      unique: unique === "ja",
      sorted: sorted === "ja",
    });
    if (!result) {
      setError(
        `Ohne Wiederholung lassen sich aus dem Bereich ${formatNumber(
          min.value!,
        )} bis ${formatNumber(max.value!)} höchstens ${formatNumber(
          max.value! - min.value! + 1,
        )} Zahlen ziehen.`,
      );
      setNumbers(null);
      return;
    }
    setError(null);
    setNumbers(result.numbers);
  }

  function applyPreset(preset: (typeof presets)[number]) {
    min.setRaw(preset.min);
    max.setRaw(preset.max);
    count.setRaw(preset.count);
    setUnique(preset.unique);
    setNumbers(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Zufallszahlen erzeugen">
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <NumberField
              label="Kleinster Wert"
              value={min.raw}
              onChange={min.setRaw}
              error={min.error}
              step={1}
            />
            <NumberField
              label="Grösster Wert"
              value={max.raw}
              onChange={max.setRaw}
              error={max.error}
              step={1}
            />
            <NumberField
              label="Wie viele Zahlen?"
              value={count.raw}
              onChange={count.setRaw}
              error={count.error}
              step={1}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <RadioGroupField
              legend="Zahlen dürfen sich wiederholen"
              value={unique}
              onChange={setUnique}
              options={[
                { value: "ja", label: "Nein, jede nur einmal" },
                { value: "nein", label: "Ja, Wiederholung erlaubt" },
              ]}
            />
            <RadioGroupField
              legend="Reihenfolge"
              value={sorted}
              onChange={setSorted}
              options={[
                { value: "ja", label: "Aufsteigend" },
                { value: "nein", label: "Ziehungsreihenfolge" },
              ]}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-text">Voreinstellungen</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-text-subtle"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={draw}
            className="rounded-lg bg-brand px-5 py-3 text-base font-semibold text-on-brand transition-colors hover:bg-brand-strong focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {numbers ? "Neu ziehen" : "Zahlen ziehen"}
          </button>
        </div>
      </CalculatorShell>

      {error && (
        <Callout tone="warnung" title="Ziehung nicht möglich" live>
          {error}
        </Callout>
      )}

      {numbers && (
        <ResultCard title="Gezogene Zahlen">
          <ul className="flex flex-wrap gap-2">
            {numbers.map((value, index) => (
              <li
                key={`${value}-${index}`}
                className="rounded-lg border-2 border-brand bg-surface px-4 py-2 text-xl font-bold tabular-nums text-text"
              >
                {formatNumber(value)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-text-muted">
            {numbers.length === 1
              ? "Eine Zahl"
              : `${formatNumber(numbers.length)} Zahlen`}{" "}
            aus dem Bereich {formatNumber(min.value ?? 0)} bis{" "}
            {formatNumber(max.value ?? 0)}
            {unique === "ja" ? ", ohne Wiederholung" : ", mit Wiederholung"}.
          </p>
        </ResultCard>
      )}

      {!numbers && !error && (
        <Callout tone="info" title="Noch keine Ziehung">
          Stell den Bereich ein und drück auf „Zahlen ziehen“. Das Ergebnis
          entsteht erst dabei – nicht schon beim Laden der Seite.
        </Callout>
      )}
    </div>
  );
}
