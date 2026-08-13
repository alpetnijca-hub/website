"use client";

import { useState } from "react";
import { parseNumeric, type NumericSpec } from "@/lib/calculators/shared";

export interface NumericFieldState {
  /** Rohwert für das Eingabefeld. */
  raw: string;
  setRaw: (value: string) => void;
  /** Geprüfter Zahlenwert oder null, wenn die Eingabe ungültig ist. */
  value: number | null;
  /** Fehlermeldung – erst sichtbar, nachdem das Feld bearbeitet wurde. */
  error?: string;
}

/**
 * Verwaltet ein einzelnes Zahlenfeld inklusive Prüfung.
 *
 * Die Fehlermeldung erscheint bewusst erst, wenn der Nutzer das Feld
 * verändert hat – ein Formular, das beim ersten Anblick rot ist, wirkt
 * abweisend und hilft niemandem.
 *
 * Die Rechner starten mit sinnvollen Beispielwerten, damit sofort ein
 * Ergebnis sichtbar ist und klar wird, was der Rechner leistet.
 */
export function useNumericField(
  initial: string,
  spec: NumericSpec,
): NumericFieldState {
  const [raw, setRawValue] = useState(initial);
  const [touched, setTouched] = useState(false);

  const parsed = parseNumeric(raw, spec);

  return {
    raw,
    setRaw: (value: string) => {
      setRawValue(value);
      setTouched(true);
    },
    value: parsed.ok ? parsed.value : null,
    error: touched && !parsed.ok ? parsed.error : undefined,
  };
}
