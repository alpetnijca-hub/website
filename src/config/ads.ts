/**
 * Werbe-Konfiguration.
 *
 * WICHTIG: Hier stehen keine echten Publisher-IDs im Code. Alle IDs kommen aus
 * Environment-Variablen (siehe .env.example und docs/ADSENSE.md).
 * Solange NEXT_PUBLIC_ADS_CLIENT_ID leer ist, zeigt jeder Werbeplatz nur einen
 * deutlich markierten Entwicklungs-Platzhalter an und es wird kein
 * Werbe-Skript geladen.
 */

/** Alle vorgesehenen Werbeplätze. */
export type AdPlacement =
  | "after-intro"
  | "after-result"
  | "in-content"
  | "sidebar"
  | "sticky-bottom";

export interface AdSlotConfig {
  /** Slot-ID des Werbeanbieters, aus der Environment gelesen. */
  slotId?: string;
  /**
   * Reservierte Mindesthöhe in Pixeln – verhindert Layout-Shift (CLS),
   * auch wenn keine Anzeige ausgeliefert wird.
   */
  minHeight: { mobile: number; desktop: number };
  /** Beschriftung im Entwicklungs-Platzhalter. */
  label: string;
}

/** Globaler Schalter: schaltet sämtliche Werbung ab (auch Platzhalter-Skripte). */
export const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED !== "false";

/**
 * Publisher-/Client-ID des Werbenetzwerks, z. B. "ca-pub-XXXXXXXXXXXXXXXX".
 * Leer lassen, solange kein Konto freigeschaltet ist.
 */
export const adsClientId = process.env.NEXT_PUBLIC_ADS_CLIENT_ID ?? "";

/** True, sobald echte Anzeigen ausgeliefert werden können. */
export const adsConfigured = adsEnabled && adsClientId.length > 0;

export const adSlots: Record<AdPlacement, AdSlotConfig> = {
  "after-intro": {
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_AFTER_INTRO,
    minHeight: { mobile: 280, desktop: 280 },
    label: "Werbeplatz unter der Einleitung",
  },
  "after-result": {
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_AFTER_RESULT,
    minHeight: { mobile: 280, desktop: 280 },
    label: "Werbeplatz nach dem Ergebnis",
  },
  "in-content": {
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT,
    minHeight: { mobile: 250, desktop: 250 },
    label: "Werbeplatz im Textbereich",
  },
  sidebar: {
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR,
    minHeight: { mobile: 0, desktop: 600 },
    label: "Werbeplatz Sidebar",
  },
  "sticky-bottom": {
    slotId: process.env.NEXT_PUBLIC_AD_SLOT_STICKY,
    minHeight: { mobile: 50, desktop: 90 },
    label: "Werbeplatz am unteren Rand",
  },
};

/** Sticky-Anzeige am unteren Bildschirmrand – standardmässig aus. */
export const stickyAdEnabled =
  process.env.NEXT_PUBLIC_STICKY_AD_ENABLED === "true";

/**
 * Interstitial / Werbe-Popup.
 *
 * Standardmässig deaktiviert. Vollbild-Interstitials, die den Inhalt
 * verdecken, verstossen je nach Ausgestaltung gegen die Better Ads Standards
 * und können sich negativ auf das Google-Ranking auswirken. Vor dem
 * Aktivieren die Richtlinien des Werbeanbieters prüfen.
 */
export const interstitial = {
  enabled: process.env.NEXT_PUBLIC_INTERSTITIAL_ENABLED === "true",
  /** Frühestens nach so vielen Sekunden auf der Seite. */
  minSecondsOnSite: 30,
  /** Alternativ: erst ab dieser Anzahl besuchter Seiten in der Sitzung. */
  minPageViews: 2,
  /** Sperrfrist in Stunden, bevor das Popup erneut erscheinen darf. */
  cooldownHours: 24,
} as const;
