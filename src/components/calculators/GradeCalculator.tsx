"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { SelectField } from "@/components/ui/Field";
import { ResultCard, ResultGrid, ResultValue } from "@/components/ui/ResultCard";
import { Callout } from "@/components/ui/Callout";
import { formatNumber } from "@/lib/format";
import {
  calculateGradeAverage,
  getGradeScale,
  gradeScales,
  requiredGrade,
  type GradeEntry,
} from "@/lib/calculators/grades";

interface Row {
  id: number;
  /** Freie Beschriftung, z. B. "Mathe Klausur". */
  label: string;
  grade: string;
  weight: string;
}

const initialRows: Row[] = [
  { id: 1, label: "", grade: "2", weight: "1" },
  { id: 2, label: "", grade: "3", weight: "1" },
  { id: 3, label: "", grade: "1", weight: "2" },
];

/** Komma als Dezimaltrennzeichen zulassen – so tippt man Noten. */
function toNumber(raw: string): number | null {
  const value = Number(raw.trim().replace(",", "."));
  return raw.trim() !== "" && Number.isFinite(value) ? value : null;
}

export function GradeCalculator() {
  const [scaleId, setScaleId] = useState("de");
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [nextId, setNextId] = useState(4);
  const [target, setTarget] = useState("2");

  const scale = getGradeScale(scaleId)!;

  const entries: GradeEntry[] = rows
    .map((row) => ({
      grade: toNumber(row.grade),
      weight: toNumber(row.weight) ?? 1,
    }))
    .filter((entry): entry is GradeEntry => entry.grade !== null);

  const result = calculateGradeAverage(entries, scale);

  const targetValue = toNumber(target);
  const needed =
    result && targetValue !== null
      ? requiredGrade(entries, targetValue, scale)
      : null;

  function update(id: number, field: keyof Row, value: string) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  }

  function addRow() {
    setRows((current) => [
      ...current,
      { id: nextId, label: "", grade: "", weight: "1" },
    ]);
    setNextId((id) => id + 1);
  }

  function removeRow(id: number) {
    setRows((current) =>
      current.length > 1 ? current.filter((row) => row.id !== id) : current,
    );
  }

  return (
    <div className="space-y-6">
      <CalculatorShell legend="Notendurchschnitt berechnen">
        <div className="grid gap-5">
          <SelectField
            label="Notensystem"
            value={scaleId}
            onChange={setScaleId}
            options={gradeScales.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
          />

          <div>
            <p className="text-sm font-medium text-text">Noten</p>
            <p className="mt-0.5 text-xs text-text-subtle">
              Das Gewicht gibt an, wie stark eine Note zählt: 2 für eine
              doppelt gewertete Klausur, 0,5 für eine halb gewertete Note.
            </p>

            <div className="mt-2.5 space-y-2">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <label
                      className="block text-xs text-text-subtle"
                      htmlFor={`fach-${row.id}`}
                    >
                      Fach oder Arbeit (freiwillig)
                    </label>
                    <input
                      id={`fach-${row.id}`}
                      type="text"
                      value={row.label}
                      onChange={(event) =>
                        update(row.id, "label", event.target.value)
                      }
                      placeholder={`Note ${index + 1}`}
                      className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-base text-text placeholder:text-text-subtle focus:outline-none hover:border-text-subtle"
                    />
                  </div>

                  <div className="w-24">
                    <label
                      className="block text-xs text-text-subtle"
                      htmlFor={`note-${row.id}`}
                    >
                      Note
                    </label>
                    <input
                      id={`note-${row.id}`}
                      type="number"
                      inputMode="decimal"
                      step={0.25}
                      min={scale.min}
                      max={scale.max}
                      value={row.grade}
                      onChange={(event) =>
                        update(row.id, "grade", event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-base text-text focus:outline-none hover:border-text-subtle"
                    />
                  </div>

                  <div className="w-24">
                    <label
                      className="block text-xs text-text-subtle"
                      htmlFor={`gewicht-${row.id}`}
                    >
                      Gewicht
                    </label>
                    <input
                      id={`gewicht-${row.id}`}
                      type="number"
                      inputMode="decimal"
                      step={0.5}
                      min={0}
                      value={row.weight}
                      onChange={(event) =>
                        update(row.id, "weight", event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-base text-text focus:outline-none hover:border-text-subtle"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length === 1}
                    className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="sr-only">
                      Note {index + 1} entfernen
                    </span>
                    <span aria-hidden="true">✕</span>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              className="mt-2.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-text-subtle"
            >
              + Note hinzufügen
            </button>
          </div>
        </div>
      </CalculatorShell>

      {result ? (
        <ResultCard>
          <ResultGrid>
            <ResultValue
              label="Durchschnitt"
              value={formatNumber(result.average, scale.decimals)}
              emphasis
              note={result.label}
            />
            <ResultValue
              label="Berücksichtigte Noten"
              value={formatNumber(result.count)}
              emphasis
              note={`Summe der Gewichte: ${formatNumber(result.totalWeight, 2)}`}
            />
          </ResultGrid>

          <div className="mt-5 grid gap-5 border-t border-accent/30 pt-5 sm:grid-cols-2">
            <ResultValue
              label="Beste Note"
              value={formatNumber(result.best, 2)}
            />
            <ResultValue
              label="Schlechteste Note"
              value={formatNumber(result.worst, 2)}
            />
          </div>

          <div className="mt-5 border-t border-accent/30 pt-5">
            <label
              className="block text-sm font-medium text-text"
              htmlFor="ziel"
            >
              Zielschnitt
            </label>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <input
                id="ziel"
                type="number"
                inputMode="decimal"
                step={0.1}
                min={scale.min}
                max={scale.max}
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                className="w-28 rounded-lg border border-border bg-surface px-3 py-2 text-base text-text focus:outline-none hover:border-text-subtle"
              />
              <p className="text-sm text-text-muted">
                {needed !== null ? (
                  <>
                    Dafür brauchst du in der nächsten Arbeit eine{" "}
                    <strong className="text-text">
                      {formatNumber(needed, 2)}
                    </strong>
                    .
                  </>
                ) : (
                  "Mit einer einzelnen weiteren Note ist dieser Schnitt nicht mehr erreichbar."
                )}
              </p>
            </div>
          </div>
        </ResultCard>
      ) : (
        <Callout tone="info" title="Ergebnis noch nicht möglich">
          Bitte trag mindestens eine Note zwischen {scale.min} und {scale.max}{" "}
          ein.
        </Callout>
      )}
    </div>
  );
}
