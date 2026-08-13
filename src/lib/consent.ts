import {
  CONSENT_VERSION,
  defaultConsent,
  type ConsentState,
  type StoredConsent,
} from "@/types/consent";

const STORAGE_KEY = "rp_consent";

/** Event-Name, über den Komponenten auf Änderungen der Einwilligung reagieren. */
export const CONSENT_EVENT = "rp:consent-change";

/**
 * Event, mit dem sich der Einstellungsdialog von überall öffnen lässt
 * (Footer-Link, Datenschutzseite, Seite "Cookie-Einstellungen").
 */
export const CONSENT_OPEN_EVENT = "rp:consent-open";

export function openConsentSettings(): void {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}

/**
 * Liest die gespeicherte Einwilligung.
 * Gibt null zurück, wenn noch keine Entscheidung vorliegt oder die
 * gespeicherte Version veraltet ist – dann muss erneut gefragt werden.
 */
export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (!parsed.choices || typeof parsed.choices !== "object") return null;
    // Fehlende Schlüssel konservativ auf "abgelehnt" setzen.
    return {
      version: parsed.version,
      timestamp: parsed.timestamp,
      choices: { ...defaultConsent, ...parsed.choices, notwendig: true },
    };
  } catch {
    // Beschädigter Eintrag oder localStorage nicht verfügbar (Privatmodus).
    return null;
  }
}

/** Speichert die Entscheidung und informiert alle Komponenten. */
export function writeConsent(choices: ConsentState): StoredConsent {
  const record: StoredConsent = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    choices: { ...choices, notwendig: true },
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Speichern fehlgeschlagen – die Auswahl gilt dann nur für diese Sitzung.
  }
  window.dispatchEvent(
    new CustomEvent<StoredConsent>(CONSENT_EVENT, { detail: record }),
  );
  return record;
}

/** Widerruf: Entscheidung löschen, damit der Banner erneut erscheint. */
export function revokeConsent(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignorieren
  }
  window.dispatchEvent(
    new CustomEvent<StoredConsent | null>(CONSENT_EVENT, { detail: null }),
  );
}

/* --------------------------------------------------------------------------
 * Externer Store für useSyncExternalStore
 *
 * React-Komponenten lesen die Einwilligung nicht selbst aus localStorage,
 * sondern abonnieren diesen Store. Damit stimmt der Zustand über alle
 * Komponenten hinweg überein und es entstehen keine Kaskaden-Renders.
 * ------------------------------------------------------------------------ */

let cachedRaw: string | null = null;
let cachedValue: StoredConsent | null = null;
let cacheFilled = false;

/** Zwischengespeicherter Snapshot – identische Referenz bei unverändertem Wert. */
export function getConsentSnapshot(): StoredConsent | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (cacheFilled && raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = readConsent();
  cacheFilled = true;
  return cachedValue;
}

/** Auf dem Server ist keine Einwilligung bekannt – also gilt: nichts erlaubt. */
export function getConsentServerSnapshot(): StoredConsent | null {
  return null;
}

export function subscribeConsent(onChange: () => void): () => void {
  function handler() {
    // Cache verwerfen, damit der nächste Snapshot neu gelesen wird.
    cacheFilled = false;
    onChange();
  }
  window.addEventListener(CONSENT_EVENT, handler);
  // Änderungen in einem anderen Tab ebenfalls übernehmen.
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CONSENT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export const acceptAllConsent: ConsentState = {
  notwendig: true,
  statistik: true,
  marketing: true,
  personalisierung: true,
};

export const rejectAllConsent: ConsentState = { ...defaultConsent };
