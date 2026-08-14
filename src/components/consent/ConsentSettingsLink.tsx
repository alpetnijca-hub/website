"use client";

import { adsConfigured } from "@/config/ads";

/**
 * Öffnet die Einwilligungseinstellungen erneut.
 *
 * Die Einwilligung wird von der zertifizierten Consent-Management-Plattform
 * von Google verwaltet. Sie stellt dafür die Funktion
 * `googlefc.showRevocationMessage()` bereit, mit der sich die Abfrage
 * jederzeit erneut öffnen lässt – das ist die Voraussetzung dafür, dass eine
 * erteilte Einwilligung widerrufbar bleibt.
 *
 * Die Funktion steht erst zur Verfügung, wenn das Werbeskript geladen wurde.
 * Ist sie nicht erreichbar – etwa weil noch keine Publisher-ID hinterlegt ist
 * oder ein Blocker das Skript verhindert –, erklärt ein Hinweis, wie sich die
 * Einwilligung über den Browser zurücksetzen lässt.
 */
declare global {
  interface Window {
    googlefc?: {
      showRevocationMessage?: () => void;
      callbackQueue?: unknown[];
    };
  }
}

const FALLBACK_HINT =
  "Die Einwilligungsabfrage lässt sich gerade nicht öffnen. Sie wird von " +
  "unserem Werbepartner bereitgestellt und benötigt dessen Skript. Wenn du " +
  "einen Werbeblocker verwendest, deaktiviere ihn für diese Seite. " +
  "Alternativ kannst du die Einwilligung zurücksetzen, indem du in deinem " +
  "Browser die Cookies und Website-Daten für rechnerliste.de löschst.";

export function ConsentSettingsLink({
  className = "",
  children = "Cookie-Einstellungen",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  function open() {
    const revoke = window.googlefc?.showRevocationMessage;
    if (typeof revoke === "function") {
      revoke();
      return;
    }
    window.alert(FALLBACK_HINT);
  }

  return (
    <button
      type="button"
      onClick={open}
      className={className}
      title={
        adsConfigured
          ? undefined
          : "Die Einwilligungsabfrage erscheint erst, wenn Werbung eingerichtet ist."
      }
    >
      {children}
    </button>
  );
}
