"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, SelectField } from "@/components/ui/Field";
import { ResultCard, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import {
  allUnitCategories,
  convertUnit,
  findCategory,
} from "@/lib/calculators/units";

const valueLimits = { min: -1_000_000_000, max: 1_000_000_000 };

/** Zeigt genug Nachkommastellen, damit auch kleine Werte lesbar bleiben. */
function display(value: number): string {
  const size = Math.abs(value);
  if (size !== 0 && size < 0.001) return value.toExponential(4).replace(".", ",");
  if (size >= 1000) return formatNumber(value, 2);
  if (size >= 1) return formatNumber(value, 4);
  return formatNumber(value, 6);
}

export function UnitConverter() {
  const [categoryId, setCategoryId] = useState("laenge");
  const category = findCategory(categoryId)!;

  const [pairs, setPairs] = useState<Record<string, { from: string; to: string }>>(
    Object.fromEntries(
      allUnitCategories.map((item) => [item.id, item.defaults]),
    ),
  );
  const pair = pairs[categoryId] ?? category.defaults;

  const amount = useNumericField("1", valueLimits);

  const result =
    amount.value !== null
      ? convertUnit({
          value: amount.value,
          from: pair.from,
          to: pair.to,
          category,
        })
      : null;

  const unitOptions = category.units.map((unit) => ({
    value: unit.id,
    label: `${unit.name} (${unit.symbol})`,
  }));

  const fromUnit = category.units.find((unit) => unit.id === pair.from);
  const toUnit = category.units.find((unit) => unit.id === pair.to);

  function setPair(next: { from: string; to: string }) {
    setPairs((current) => ({ ...current, [categoryId]: next }));
  }

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Einheiten umrechnen">
        <div className="grid gap-5">
          <div>
            <p className="text-sm font-medium text-text">Was möchtest du umrechnen?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {allUnitCategories.map((item) => {
                const active = item.id === categoryId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategoryId(item.id)}
                    aria-pressed={active}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border text-text-muted hover:border-text-subtle"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <NumberField
            label="Wert"
            value={amount.raw}
            onChange={amount.setRaw}
            error={amount.error}
            step={1}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Von"
              value={pair.from}
              onChange={(value) => setPair({ ...pair, from: value })}
              options={unitOptions}
            />
            <SelectField
              label="Nach"
              value={pair.to}
              onChange={(value) => setPair({ ...pair, to: value })}
              options={unitOptions}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setPair({ from: pair.to, to: pair.from })}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:border-text-subtle"
            >
              Einheiten tauschen
            </button>
          </div>
        </div>
      </CalculatorShell>

      {result && fromUnit && toUnit ? (
        <ResultCard>
          <ResultValue
            label={`${display(result.value)} ${fromUnit.symbol} entsprechen`}
            value={`${display(result.converted)} ${toUnit.symbol}`}
            emphasis
          />
          <div className="mt-5 border-t border-accent/30 pt-5">
            <ResultValue
              label="Umrechnungsfaktor"
              value={`1 ${fromUnit.symbol} = ${display(result.perUnit)} ${toUnit.symbol}`}
              note={
                category.id === "temperatur"
                  ? "Bei Temperaturen ist das kein Faktor, sondern der umgerechnete Wert von 1 Grad – die Skalen haben verschiedene Nullpunkte."
                  : undefined
              }
            />
          </div>
        </ResultCard>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          {category.id === "temperatur"
            ? "Bitte gib eine Temperatur oberhalb des absoluten Nullpunkts ein (−273,15 °C)."
            : "Bitte gib einen gültigen Wert ein."}
        </Callout>
      )}
    </div>
  );
}
