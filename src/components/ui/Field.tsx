"use client";

import { useId } from "react";
import type { ReactNode } from "react";

/**
 * Barrierearme Formularbausteine.
 *
 * Gemeinsame Regeln für alle Felder:
 *  - jedes Feld hat ein sichtbares <label>, das mit dem Eingabefeld verknüpft ist
 *  - Hinweis- und Fehlertexte sind über aria-describedby verbunden
 *  - Fehler werden zusätzlich über aria-invalid gemeldet
 *  - Fehlermeldungen erscheinen als Text, nicht nur als rote Umrandung
 *  - alle Felder sind vollständig per Tastatur bedienbar
 */

const inputClasses =
  "w-full rounded-lg border bg-surface px-3 py-2.5 text-base text-text " +
  "placeholder:text-text-subtle focus:outline-none";

function borderClasses(hasError: boolean): string {
  return hasError
    ? "border-danger ring-1 ring-danger"
    : "border-border hover:border-text-subtle";
}

function FieldShell({
  label,
  hint,
  error,
  htmlFor,
  hintId,
  errorId,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  hintId: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-text">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="mt-0.5 text-xs text-text-subtle">
          {hint}
        </p>
      )}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  hint,
  error,
  unit,
  min,
  max,
  step = 1,
  placeholder,
}: {
  label: string;
  /** Rohwert als String, damit Zwischenzustände beim Tippen erhalten bleiben. */
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  /** Einheit, die rechts im Feld angezeigt wird, z. B. "kg". */
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      htmlFor={id}
      hintId={hintId}
      errorId={errorId}
    >
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${inputClasses} ${borderClasses(Boolean(error))} ${
            unit ? "pr-14" : ""
          }`}
        />
        {unit && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-text-subtle"
          >
            {unit}
          </span>
        )}
      </div>
    </FieldShell>
  );
}

/**
 * Uhrzeit-Feld. `type="time"` bringt auf Mobilgeräten die passende Tastatur
 * und auf dem Desktop eine Eingabemaske mit; der Wert ist immer "HH:MM".
 */
export function TimeField({
  label,
  value,
  onChange,
  hint,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      htmlFor={id}
      hintId={hintId}
      errorId={errorId}
    >
      <input
        id={id}
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputClasses} ${borderClasses(Boolean(error))}`}
      />
    </FieldShell>
  );
}

/**
 * Datumsfeld. Der Wert ist immer "JJJJ-MM-TT" – das ist das Format, das
 * `type="date"` liefert, unabhängig davon, wie der Browser das Datum anzeigt.
 */
export function DateField({
  label,
  value,
  onChange,
  hint,
  error,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  min?: string;
  max?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      htmlFor={id}
      hintId={hintId}
      errorId={errorId}
    >
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputClasses} ${borderClasses(Boolean(error))}`}
      />
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  hint?: string;
  error?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      htmlFor={id}
      hintId={hintId}
      errorId={errorId}
    >
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputClasses} ${borderClasses(Boolean(error))} appearance-none pr-8`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/**
 * Radiogruppe als <fieldset> mit <legend> – die semantisch korrekte
 * Auszeichnung für eine Auswahl aus wenigen Optionen.
 */
export function RadioGroupField({
  legend,
  value,
  onChange,
  options,
  hint,
  columns = 2,
}: {
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  hint?: string;
  columns?: 2 | 3;
}) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <fieldset aria-describedby={hint ? hintId : undefined}>
      <legend className="text-sm font-medium text-text">{legend}</legend>
      {hint && (
        <p id={hintId} className="mt-0.5 text-xs text-text-subtle">
          {hint}
        </p>
      )}
      <div
        className={`mt-1.5 grid gap-2 ${
          columns === 3 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              /* Der Fokusring wird auf das Label gespiegelt, weil das
                 eigentliche Radio-Element visuell versteckt ist. */
              className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${
                checked
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border bg-surface text-text-muted hover:border-text-subtle"
              }`}
            >
              <input
                type="radio"
                name={id}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
