"use client";

import { useEffect, useRef } from "react";
import { adSlots, adsClientId, adsConfigured, type AdPlacement } from "@/config/ads";
import { useConsent } from "@/components/consent/useConsent";

/**
 * Wiederverwendbarer Werbeplatz.
 *
 * Verhalten:
 *  - Ohne Publisher-ID (NEXT_PUBLIC_ADS_CLIENT_ID leer) wird ausschliesslich
 *    ein deutlich markierter Entwicklungs-Platzhalter angezeigt. Es wird kein
 *    externes Skript geladen.
 *  - Mit Publisher-ID wird die Anzeige erst nach Einwilligung in die
 *    Kategorie "Marketing" angefordert. Ohne Einwilligung bleibt die Fläche
 *    leer, behält aber ihre Höhe.
 *  - Die Fläche reserviert immer ihre Mindesthöhe, damit beim Nachladen kein
 *    Layout-Shift (CLS) entsteht.
 *  - Werbung ist gemäss Trennungsgebot sichtbar als "Anzeige" gekennzeichnet.
 */
export function AdSlot({
  placement,
  className = "",
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const config = adSlots[placement];
  const { consent, ready } = useConsent();
  const allowed = consent?.choices.marketing === true;
  const insRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!adsConfigured || !allowed || pushed.current) return;
    if (!insRef.current) return;
    // Anzeigenanforderung an das Werbenetzwerk übergeben. Das Skript selbst
    // wird zentral in AdScripts.tsx geladen – ebenfalls erst nach Einwilligung.
    const globalWithAds = window as typeof window & {
      adsbygoogle?: unknown[];
    };
    try {
      globalWithAds.adsbygoogle = globalWithAds.adsbygoogle ?? [];
      globalWithAds.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // Anzeige konnte nicht angefordert werden – die Fläche bleibt leer.
    }
  }, [allowed]);

  const style = {
    minHeight: `${config.minHeight.mobile}px`,
    // Auf grösseren Bildschirmen greift die Desktop-Mindesthöhe.
    ["--ad-min-desktop" as string]: `${config.minHeight.desktop}px`,
  } as React.CSSProperties;

  return (
    <div
      className={`ad-slot my-8 ${className}`}
      data-placement={placement}
      style={style}
    >
      <p className="mb-1 text-center text-[11px] uppercase tracking-widest text-text-subtle">
        Anzeige
      </p>
      <div
        className="flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface-muted/60 lg:min-h-[var(--ad-min-desktop)]"
        style={{ minHeight: `${config.minHeight.mobile}px` }}
      >
        {!adsConfigured ? (
          <span className="px-4 py-6 text-center text-xs text-text-subtle">
            Entwicklungs-Platzhalter · {config.label}
            <br />
            <span className="opacity-70">
              Aktiv, sobald eine Publisher-ID hinterlegt ist
            </span>
          </span>
        ) : !ready || !allowed ? (
          <span className="px-4 py-6 text-center text-xs text-text-subtle">
            Für Werbung ist deine Einwilligung erforderlich.
          </span>
        ) : (
          <ins
            ref={insRef}
            className="adsbygoogle block w-full"
            style={{ display: "block" }}
            data-ad-client={adsClientId}
            data-ad-slot={config.slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
}
