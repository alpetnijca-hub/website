import type { ConsentState } from "@/types/consent";

/**
 * Technische Vorbereitung für Google Consent Mode v2.
 *
 * Es wird hier KEIN Google-Skript geladen. Diese Datei schreibt lediglich die
 * Consent-Signale in den dataLayer. Sobald du später ein Google-Tag (gtag.js
 * oder Google Tag Manager) einbindest, liest dieses die bereits gesetzten
 * Standardwerte "denied" und die spätere Aktualisierung aus.
 *
 * Reihenfolge ist entscheidend:
 *   1. setDefaultConsent() so früh wie möglich (vor jedem Tag)
 *   2. updateConsent() nach der Entscheidung des Nutzers
 */

type ConsentValue = "granted" | "denied";

interface ConsentSignals {
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  analytics_storage: ConsentValue;
  functionality_storage: ConsentValue;
  security_storage: ConsentValue;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function pushToDataLayer(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  // Google erwartet echte "arguments"-Objekte; ein Array funktioniert ebenso.
  window.dataLayer.push(args);
}

const yesNo = (granted: boolean): ConsentValue =>
  granted ? "granted" : "denied";

export function consentToSignals(choices: ConsentState): ConsentSignals {
  return {
    ad_storage: yesNo(choices.marketing),
    ad_user_data: yesNo(choices.personalisierung),
    ad_personalization: yesNo(choices.personalisierung),
    analytics_storage: yesNo(choices.statistik),
    // Notwendige Speicherung ist Grundlage des Betriebs.
    functionality_storage: "granted",
    security_storage: "granted",
  };
}

/** Alle optionalen Kategorien auf "denied" – vor dem Laden jeglicher Tags. */
export function setDefaultConsent(): void {
  pushToDataLayer("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
}

/** Aktualisiert die Signale nach der Entscheidung des Nutzers. */
export function updateConsent(choices: ConsentState): void {
  pushToDataLayer("consent", "update", consentToSignals(choices));
}
