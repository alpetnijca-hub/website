"use client";

import Script from "next/script";
import { adsClientId, adsConfigured } from "@/config/ads";
import { useConsent } from "@/components/consent/useConsent";

/**
 * Lädt das Skript des Werbenetzwerks – und zwar erst dann, wenn
 *   1. eine Publisher-ID über die Environment gesetzt ist und
 *   2. der Nutzer in die Kategorie "Marketing" eingewilligt hat.
 *
 * Solange keine ID hinterlegt ist, wird überhaupt nichts geladen; die
 * Werbeflächen zeigen dann nur Platzhalter. Damit sind auf einer frisch
 * geklonten Installation keine externen Werbeaufrufe möglich.
 *
 * Die Adresse des Skripts steht bewusst nur an dieser einen Stelle.
 * Wenn du ein anderes Werbenetzwerk einsetzt, tauschst du hier den src aus.
 */
export function AdScripts() {
  const { consent } = useConsent();
  const allowed = consent?.choices.marketing === true;

  if (!adsConfigured || !allowed) return null;

  return (
    <Script
      id="ad-network"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        adsClientId,
      )}`}
    />
  );
}
