"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { adsConfigured, interstitial } from "@/config/ads";

const SHOWN_KEY = "rp_interstitial_last";
const VIEWS_KEY = "rp_pageviews";

/** Kurze Schonfrist nach einem Seitenwechsel, bevor das Popup erscheinen darf. */
const GRACE_MS = 3000;

/**
 * Werbe-Interstitial (Popup).
 *
 * Standardmässig ausgeschaltet – Aktivierung über
 * NEXT_PUBLIC_INTERSTITIAL_ENABLED=true.
 *
 * Eingehaltene Regeln:
 *  - erscheint nie beim ersten Seitenaufruf
 *  - frühestens nach 30 Sekunden ODER ab der zweiten besuchten Seite
 *  - höchstens einmal in 24 Stunden (in localStorage vermerkt)
 *  - gut sichtbarer, ausreichend grosser Schliessen-Button oben rechts
 *  - schliessbar per Escape und per Klick auf den Hintergrund
 *  - Fokus wandert beim Öffnen in den Dialog und beim Schliessen zurück
 *  - Fokus bleibt im Dialog gefangen (Tab-Zyklus), role="dialog" + aria-modal
 *  - keine automatische Weiterleitung, keine irreführenden Schaltflächen:
 *    es gibt genau eine Aktion – schliessen
 */
export function AdInterstitial() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Seitenaufrufe der laufenden Sitzung zählen. Der Zählerstand steht in
  // einem Ref, weil er allein kein Neurendern auslösen soll.
  const pageViews = useRef(0);
  useEffect(() => {
    try {
      const next = Number(window.sessionStorage.getItem(VIEWS_KEY) ?? "0") + 1;
      window.sessionStorage.setItem(VIEWS_KEY, String(next));
      pageViews.current = next;
    } catch {
      pageViews.current += 1;
    }
  }, [pathname]);

  const withinCooldown = useCallback((): boolean => {
    try {
      const last = window.localStorage.getItem(SHOWN_KEY);
      if (!last) return false;
      const elapsedHours = (Date.now() - Number(last)) / 36e5;
      return elapsedHours < interstitial.cooldownHours;
    } catch {
      // Ohne Speicher lässt sich die Sperrfrist nicht prüfen – dann lieber
      // gar nicht anzeigen, als den Nutzer wiederholt zu unterbrechen.
      return true;
    }
  }, []);

  const show = useCallback(() => {
    if (withinCooldown()) return;
    try {
      window.localStorage.setItem(SHOWN_KEY, String(Date.now()));
    } catch {
      return;
    }
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, [withinCooldown]);

  // Auslöser: zweite Seite ODER 30 Sekunden Verweildauer.
  useEffect(() => {
    if (!interstitial.enabled) return;
    if (open) return;

    // Auch beim Seiten-Auslöser gibt es eine kurze Wartezeit: Das Popup
    // soll nie mitten in einen Seitenwechsel platzen.
    const delayMs =
      pageViews.current >= interstitial.minPageViews
        ? GRACE_MS
        : interstitial.minSecondsOnSite * 1000;

    const timer = window.setTimeout(show, delayMs);
    return () => window.clearTimeout(timer);
  }, [pathname, open, show]);

  const close = useCallback(() => {
    setOpen(false);
    previouslyFocused.current?.focus();
  }, []);

  // Tastaturbedienung: Escape schliesst, Tab bleibt im Dialog.
  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    // Hintergrund nicht scrollen, solange der Dialog offen ist.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  if (!interstitial.enabled || !open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="interstitial-title"
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="interstitial-title"
            className="text-xs uppercase tracking-widest text-text-subtle"
          >
            Anzeige
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="-mt-1 shrink-0 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text hover:bg-surface-muted"
          >
            Schliessen
          </button>
        </div>

        <div className="mt-4 flex min-h-[250px] items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted/60 p-6 text-center text-sm text-text-subtle">
          {adsConfigured ? (
            <span>Werbeplatz Interstitial</span>
          ) : (
            <span>
              Demo-Platzhalter · Interstitial
              <br />
              <span className="opacity-70">
                Hier erscheint später eine Anzeige. Es wird derzeit kein
                Werbe-Skript geladen.
              </span>
            </span>
          )}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-text-subtle">
          Diese Einblendung erscheint höchstens einmal pro Tag. Du kannst sie
          mit der Escape-Taste oder über den Schliessen-Button jederzeit
          beenden – der Inhalt der Seite bleibt danach unverändert erreichbar.
        </p>
      </div>
    </div>
  );
}
