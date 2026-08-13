"use client";

import { useSyncExternalStore } from "react";
import {
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeConsent,
} from "@/lib/consent";
import { useIsClient } from "@/lib/useClient";
import type { StoredConsent } from "@/types/consent";

/**
 * Liest die aktuelle Einwilligung und aktualisiert sich, sobald der Nutzer
 * seine Auswahl ändert – auch in einem anderen Browser-Tab.
 *
 * `consent === null` bedeutet: es liegt (noch) keine Entscheidung vor.
 * In diesem Zustand darf nichts geladen werden, was einer Einwilligung bedarf.
 * Beim Server-Rendering ist der Wert immer `null`, damit nie versehentlich
 * eine Einwilligung angenommen wird.
 */
export function useConsent(): { consent: StoredConsent | null; ready: boolean } {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );
  const ready = useIsClient();
  return { consent, ready };
}
