"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, RadioGroupField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import { calculateFuelCost, fuelUnits, type FuelUnit } from "@/lib/calculators/fuelCost";

const euro = (value: number, decimals = 2) =>
  `${formatNumber(value, decimals)} €`;

const limits = {
  distance: { min: 0.1, max: 100_000, unit: "km" },
  consumption: { min: 0, max: 100 },
  price: { min: 0, max: 10, unit: "€" },
  people: { min: 1, max: 20, integer: true },
};

export function FuelCostCalculator() {
  const [unit, setUnit] = useState<FuelUnit>("liter");
  const distance = useNumericField("500", limits.distance);
  const consumption = useNumericField("7,5", limits.consumption);
  const price = useNumericField("1,75", limits.price);
  const people = useNumericField("1", limits.people);

  const complete =
    distance.value !== null &&
    consumption.value !== null &&
    price.value !== null &&
    people.value !== null;

  const result = complete
    ? calculateFuelCost({
        distanceKm: distance.value!,
        consumption: consumption.value!,
        pricePerUnit: price.value!,
        people: people.value!,
      })
    : null;

  const meta = fuelUnits[unit];

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Spritkosten berechnen">
        <div className="grid gap-5">
          <RadioGroupField
            legend="Antrieb"
            value={unit}
            onChange={(value) => {
              const next = value as FuelUnit;
              setUnit(next);
              // Sinnvolle Ausgangswerte für die jeweilige Antriebsart.
              if (next === "kwh") {
                consumption.setRaw("18");
                price.setRaw("0,40");
              } else {
                consumption.setRaw("7,5");
                price.setRaw("1,75");
              }
            }}
            options={[
              { value: "liter", label: "Benzin / Diesel" },
              { value: "kwh", label: "Elektro" },
            ]}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Strecke"
              value={distance.raw}
              onChange={distance.setRaw}
              error={distance.error}
              unit="km"
              step={1}
            />
            <NumberField
              label={meta.consumptionLabel}
              value={consumption.raw}
              onChange={consumption.setRaw}
              error={consumption.error}
              unit={meta.unit}
              step={0.1}
            />
            <NumberField
              label={unit === "kwh" ? "Strompreis" : "Preis je Liter"}
              value={price.raw}
              onChange={price.setRaw}
              error={price.error}
              unit={meta.priceUnit}
              step={0.01}
            />
            <NumberField
              label="Personen im Fahrzeug"
              value={people.raw}
              onChange={people.setRaw}
              error={people.error}
              min={1}
              hint="Für die Aufteilung der Kosten bei Fahrgemeinschaften."
            />
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <>
          <ResultCard>
            <ResultGrid>
              <ResultValue
                label="Kosten der Fahrt"
                value={euro(result.totalCost)}
                note={`${formatNumber(result.amount, 2)} ${meta.unit} verbraucht`}
                emphasis
              />
              <ResultValue
                label="Je Person"
                value={euro(result.costPerPerson)}
                note={
                  (people.value ?? 1) > 1
                    ? `aufgeteilt auf ${people.value} Personen`
                    : "allein unterwegs"
                }
                emphasis
              />
            </ResultGrid>

            <div className="mt-5 grid gap-5 border-t border-brand/30 pt-5 sm:grid-cols-2">
              <ResultValue
                label="Hin- und Rückfahrt"
                value={euro(result.roundTripCost)}
              />
              <ResultValue
                label="Kosten je Kilometer"
                value={euro(result.costPerKm, 3)}
              />
            </div>
          </ResultCard>

          <Callout tone="info" title="Das sind nur die Energiekosten">
            Nicht enthalten sind Wertverlust, Versicherung, Steuer, Wartung,
            Reifen und Reparaturen. Rechnet man diese Posten mit, liegen die
            tatsächlichen Kosten je Kilometer bei einem Mittelklassewagen
            erfahrungsgemäss um ein Mehrfaches über dem hier gezeigten Wert.
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
