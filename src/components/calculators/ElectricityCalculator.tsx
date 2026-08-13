"use client";

import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import { calculateElectricityCost } from "@/lib/calculators/electricity";

const euro = (value: number) => `${formatNumber(value, 2)} €`;

const limits = {
  watt: { min: 0, max: 30_000, unit: "W" },
  hours: { min: 0, max: 24, unit: "Stunden" },
  uses: { min: 0, max: 50 },
  price: { min: 0, max: 200, unit: "Cent" },
};

/**
 * Typische Geräte als Schnellauswahl. Die Leistungsangaben sind grobe
 * Richtwerte – der tatsächliche Verbrauch steht auf dem Typenschild
 * beziehungsweise im Datenblatt des Geräts.
 */
const presets = [
  { label: "Wasserkocher", watt: 2000, hours: 0.1, uses: 4 },
  { label: "Kühlschrank", watt: 60, hours: 24, uses: 1 },
  { label: "Waschmaschine", watt: 1200, hours: 1.5, uses: 0.3 },
  { label: "Fernseher", watt: 100, hours: 4, uses: 1 },
  { label: "Gaming-PC", watt: 400, hours: 3, uses: 1 },
  { label: "Heizlüfter", watt: 2000, hours: 3, uses: 1 },
];

export function ElectricityCalculator() {
  const watt = useNumericField("2000", limits.watt);
  const hours = useNumericField("1", limits.hours);
  const uses = useNumericField("1", limits.uses);
  const price = useNumericField("35", limits.price);

  const complete =
    watt.value !== null &&
    hours.value !== null &&
    uses.value !== null &&
    price.value !== null;

  const result = complete
    ? calculateElectricityCost({
        watt: watt.value!,
        hoursPerUse: hours.value!,
        usesPerDay: uses.value!,
        centPerKwh: price.value!,
      })
    : null;

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Stromkosten berechnen">
        <div className="grid gap-5">
          <div>
            <p className="text-sm font-medium text-text">
              Typisches Gerät wählen
            </p>
            <p className="mt-0.5 text-xs text-text-subtle">
              Richtwerte zum Loslegen – den genauen Wert findest du auf dem
              Typenschild deines Geräts.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    watt.setRaw(String(preset.watt));
                    hours.setRaw(String(preset.hours).replace(".", ","));
                    uses.setRaw(String(preset.uses).replace(".", ","));
                  }}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand-strong"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Leistung des Geräts"
              value={watt.raw}
              onChange={watt.setRaw}
              error={watt.error}
              unit="W"
              step={10}
            />
            <NumberField
              label="Laufzeit je Nutzung"
              value={hours.raw}
              onChange={hours.setRaw}
              error={hours.error}
              unit="Std."
              step={0.1}
              hint="30 Minuten sind 0,5 Stunden."
            />
            <NumberField
              label="Nutzungen pro Tag"
              value={uses.raw}
              onChange={uses.setRaw}
              error={uses.error}
              step={0.5}
              hint="Zweimal pro Woche entspricht etwa 0,3."
            />
            <NumberField
              label="Strompreis"
              value={price.raw}
              onChange={price.setRaw}
              error={price.error}
              unit="ct/kWh"
              step={0.1}
              hint="Steht auf deiner Stromrechnung."
            />
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <ResultGrid>
              <ResultValue
                label="Kosten pro Jahr"
                value={euro(result.costPerYear)}
                note={`${formatNumber(result.kwhPerYear, 1)} kWh Verbrauch`}
                emphasis
              />
              <ResultValue
                label="Kosten pro Monat"
                value={euro(result.costPerMonth)}
                emphasis
              />
            </ResultGrid>

            <div className="mt-5 grid gap-5 border-t border-brand/30 pt-5 sm:grid-cols-2">
              <ResultValue
                label="Kosten pro Tag"
                value={euro(result.costPerDay)}
                note={`${formatNumber(result.kwhPerDay, 3)} kWh`}
              />
              <ResultValue
                label="Kosten je Einzelnutzung"
                value={euro(result.costPerUse)}
              />
            </div>
          </ResultCard>

          <Callout tone="info" title="Warum die Rechnung nur eine Näherung ist">
            Die Leistungsangabe auf dem Typenschild ist die maximale Aufnahme.
            Viele Geräte laufen nicht durchgehend auf Volllast – ein Kühlschrank
            etwa schaltet den Kompressor nur zeitweise ein, eine Waschmaschine
            zieht die volle Leistung nur beim Aufheizen. Genaue Werte liefert ein
            Energiekostenmessgerät für die Steckdose.
          </Callout>
        </>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte fülle alle Felder mit gültigen Werten aus.
        </Callout>
      )}
    </div>
  );
}
