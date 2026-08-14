"use client";

import { useEffect, useRef } from "react";
import { adSlots, adsClientId, adsConfigured, type AdPlacement } from "@/config/ads";

/**
 * Wiederverwendbarer Werbeplatz.
 *
 * Verhalten:
 *  - Ohne Publisher-ID (NEXT_PUBLIC_ADS_CLIENT_ID leer) wird ausschliesslich
 *    ein deutlich markierter Entwicklungs-Platzhalter angezeigt. Es wird kein
 *    externes Skript geladen.
 *  - Mit Publisher-ID wird eine Anzeige angefordert. Ob und in welcher Form
 *    sie ausgeliefert wird, entscheidet die zertifizierte Consent-Lösung von
 *    Google: Ohne Einwilligung erscheinen keine personalisierten Anzeigen.
 *    Die Einwilligungsabfrage selbst kommt ebenfalls von dort.
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
  const insRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!adsConfigured || pushed.current) return;
    if (!insRef.current) return;
    // Anzeigenanforderung an das Werbenetzwerk übergeben. Das Skript selbst
    // wird zentral in AdScripts.tsx geladen.
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
  }, []);

  /**
   * Beide Mindesthöhen als CSS-Variablen. Die Umschaltung übernimmt die
   * Klasse .ad-slot-box in globals.css per Media Query – ein Inline-Style
   * würde eine Breakpoint-Klasse überschreiben und die Desktop-Höhe nie
   * wirksam werden lassen.
   */
  const style = {
    ["--ad-min-mobile" as string]: `${config.minHeight.mobile}px`,
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
      <div className="ad-slot-box flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface-muted/60">
        {!adsConfigured ? (
          <span className="px-4 py-6 text-center text-xs text-text-subtle">
            Entwicklungs-Platzhalter · {config.label}
            <br />
            <span className="opacity-70">
              Aktiv, sobald eine Publisher-ID hinterlegt ist
            </span>
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
