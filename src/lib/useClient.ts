"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True, sobald die Komponente im Browser läuft (nach der Hydration).
 * Wird gebraucht, um Platzhalter erst dann durch echte Inhalte zu ersetzen,
 * ohne setState in einem Effekt aufzurufen.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Liest einen rein clientseitigen Wert (z. B. aus sessionStorage).
 * Nur für primitive Werte gedacht – der Snapshot wird bei jedem Render
 * neu berechnet und muss deshalb vergleichbar sein.
 */
export function useClientValue<T extends string | number | boolean | null>(
  read: () => T,
  serverValue: T,
): T {
  return useSyncExternalStore(emptySubscribe, read, () => serverValue);
}
