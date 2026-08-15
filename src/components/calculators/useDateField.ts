"use client";

import { useState } from "react";
import { useClientValue } from "@/lib/useClient";
import { addDays, formatDate, parseDate } from "@/lib/calculators/dates";

/**
 * Das heutige Datum als "JJJJ-MM-TT" – auf dem Server ein leerer String.
 *
 * Das ist kein Umweg, sondern notwendig: Die Rechnerseiten werden beim Bauen
 * einmal erzeugt. Würde „heute“ schon dort eingesetzt, stünde auf der Seite
 * das Datum des letzten Deployments, und beim Übernehmen der Darstellung im
 * Browser würde der Wert sichtbar springen. Über `useClientValue` bleibt das
 * Feld beim ersten Rendern leer und wird unmittelbar nach der Hydration
 * gefüllt – ohne setState in einem Effekt.
 */
export function useToday(offsetDays = 0): string {
  return useClientValue(
    () => formatDate(addDays(new Date(), offsetDays)),
    "",
  );
}

export interface DateFieldState {
  /** Wert für das Eingabefeld. */
  value: string;
  setValue: (value: string) => void;
  /** Geprüftes Datum oder null, solange die Eingabe unvollständig ist. */
  date: Date | null;
  /** Auf das heutige Datum zurücksetzen. */
  reset: () => void;
}

/**
 * Datumsfeld, das mit „heute“ vorbelegt ist, sobald die Seite im Browser
 * läuft. Ein eigener Zustand überschreibt die Voreinstellung, sobald der
 * Nutzer etwas auswählt.
 */
export function useDateField(
  initial?: string,
  /** Voreinstellung um so viele Tage gegenüber heute verschieben. */
  offsetDays = 0,
): DateFieldState {
  const today = useToday(offsetDays);
  const [own, setOwn] = useState<string | null>(initial ?? null);
  const value = own ?? today;

  return {
    value,
    setValue: setOwn,
    date: parseDate(value),
    reset: () => setOwn(null),
  };
}
