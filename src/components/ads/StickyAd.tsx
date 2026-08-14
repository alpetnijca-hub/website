"use client";

import { useState } from "react";
import { adSlots, adsConfigured, stickyAdEnabled } from "@/config/ads";
import { useClientValue } from "@/lib/useClient";

const CLOSED_KEY = "rp_sticky_closed";

function readClosed(): boolean {
  try {
    return window.sessionStorage.getItem(CLOSED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Kleiner Werbeplatz am unteren Bildschirmrand.
 *
 * Regeln, die hier eingehalten werden:
 *  - standardmässig deaktiviert (NEXT_PUBLIC_STICKY_AD_ENABLED)
 *  - niedrige Bauhöhe, damit auf Mobilgeräten kein Inhalt verdeckt wird
 *  - jederzeit schliessbar; die Entscheidung gilt für die laufende Sitzung
 *  - schiebt den Seiteninhalt am Ende nicht zusammen, sondern reserviert
 *    über einen Platzhalter im Fluss die eigene Höhe
 */
export function StickyAd() {
  // Beim Laden aus sessionStorage gelesen, danach über den lokalen Zustand.
  const closedInSession = useClientValue(readClosed, false);
  const [closedNow, setClosedNow] = useState(false);
  const closed = closedInSession || closedNow;

  if (!stickyAdEnabled) return null;
  if (closed) return null;

  const config = adSlots["sticky-bottom"];

  function close() {
    setClosedNow(true);
    try {
      window.sessionStorage.setItem(CLOSED_KEY, "1");
    } catch {
      // ignorieren
    }
  }

  return (
    <>
      {/* Platzhalter im Dokumentfluss: verhindert, dass die fixierte Leiste
          den letzten Abschnitt der Seite überdeckt. */}
      <div aria-hidden="true" style={{ height: config.minHeight.mobile + 16 }} />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-1.5">
          <span className="text-[10px] uppercase tracking-widest text-text-subtle">
            Anzeige
          </span>
          <div
            className="flex flex-1 items-center justify-center overflow-hidden rounded border border-dashed border-border bg-surface-muted/60 text-[11px] text-text-subtle"
            style={{ minHeight: config.minHeight.mobile }}
          >
            {adsConfigured
              ? null
              : "Entwicklungs-Platzhalter · Sticky-Werbeplatz"}
          </div>
          <button
            type="button"
            onClick={close}
            className="shrink-0 rounded-md border border-border px-2 py-1 text-xs text-text-muted hover:bg-surface-muted"
          >
            <span className="sr-only">Werbeleiste schliessen</span>
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>
    </>
  );
}
