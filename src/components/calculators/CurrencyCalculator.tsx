"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { useNumericField } from "@/components/calculators/useNumericField";
import { NumberField, SelectField } from "@/components/ui/Field";
import { ResultCard, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import {
  convertCurrency,
  currencyLabel,
  currencyOptions,
  type RateTable,
} from "@/lib/calculators/exchange";

const amountLimits = { min: 0, max: 1_000_000_000 };

/** Beträge, die die Grössenordnung schnell einordnen lassen. */
const quickAmounts = [1, 10, 50, 100, 1000];

function formatMoney(value: number): string {
  // Bei sehr kleinen Beträgen (etwa Yen in Euro) wären zwei Nachkommastellen
  // nichtssagend – dann werden vier angezeigt.
  const decimals = value !== 0 && Math.abs(value) < 0.1 ? 4 : 2;
  return formatNumber(value, decimals);
}

export function CurrencyCalculator({
  rates,
  date,
}: {
  rates: RateTable;
  /** Tag der Kursfeststellung im Format JJJJ-MM-TT. */
  date: string;
}) {
  const amount = useNumericField("100", amountLimits);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("CHF");

  const codes = currencyOptions(rates);
  const options = codes.map((code) => ({
    value: code,
    label: currencyLabel(code),
  }));

  const result =
    amount.value !== null
      ? convertCurrency({ amount: amount.value, from, to, rates })
      : null;

  const publishedOn = new Date(`${date}T00:00:00Z`).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Währung umrechnen">
        <div className="grid gap-5">
          <NumberField
            label="Betrag"
            value={amount.raw}
            onChange={amount.setRaw}
            error={amount.error}
            step={1}
          />

          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => amount.setRaw(String(value))}
                aria-pressed={amount.raw === String(value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  amount.raw === String(value)
                    ? "border-brand bg-brand-soft text-brand-strong"
                    : "border-border text-text-muted hover:border-text-subtle"
                }`}
              >
                {formatNumber(value)}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Von"
              value={from}
              onChange={setFrom}
              options={options}
            />
            <SelectField
              label="Nach"
              value={to}
              onChange={setTo}
              options={options}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={swap}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:border-text-subtle"
            >
              Währungen tauschen
            </button>
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <ResultCard>
          <ResultValue
            label={`${formatMoney(result.amount)} ${result.from} entsprechen`}
            value={`${formatMoney(result.converted)} ${result.to}`}
            emphasis
          />

          <div className="mt-5 grid gap-5 border-t border-brand/30 pt-5 sm:grid-cols-2">
            <ResultValue
              label="Kurs"
              value={`1 ${result.from} = ${formatNumber(result.rate, 4)} ${result.to}`}
            />
            <ResultValue
              label="Gegenrichtung"
              value={`1 ${result.to} = ${formatNumber(result.inverseRate, 4)} ${result.from}`}
            />
          </div>

          <p className="mt-4 text-sm text-text-muted">
            EZB-Referenzkurs vom {publishedOn}. Kein Handelskurs – beim
            tatsächlichen Umtausch kommen Aufschläge und Gebühren dazu.
          </p>
        </ResultCard>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte gib einen Betrag ab 0 ein.
        </Callout>
      )}
    </div>
  );
}
