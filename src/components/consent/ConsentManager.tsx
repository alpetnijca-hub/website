"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CONSENT_OPEN_EVENT,
  acceptAllConsent,
  readConsent,
  rejectAllConsent,
  writeConsent,
} from "@/lib/consent";
import { setDefaultConsent, updateConsent } from "@/lib/gtag";
import { useConsent } from "@/components/consent/useConsent";
import {
  consentCategoryInfo,
  defaultConsent,
  type ConsentCategory,
  type ConsentState,
} from "@/types/consent";

/**
 * Einwilligungsverwaltung (Banner + Einstellungsdialog).
 *
 * Umgesetzte Anforderungen:
 *  - "Alle akzeptieren", "Ablehnen" und "Einstellungen" sind gleichwertig
 *    gestaltet: gleiche Grösse, gleiche Position, keine versteckte Ablehnung
 *  - optionale Kategorien sind standardmässig NICHT vorausgewählt
 *  - ohne Einwilligung wird kein Statistik- oder Werbeskript geladen
 *  - die Entscheidung wird mit Zeitstempel gespeichert und ist jederzeit
 *    über den Footer-Link widerrufbar
 *  - Google Consent Mode v2 wird mit "denied" vorbelegt und nach der
 *    Entscheidung aktualisiert
 *
 * Rechtlicher Hinweis: Diese Eigenentwicklung ist eine technische Grundlage.
 * Sie ist nicht automatisch rechtssicher und für den Betrieb von Google
 * AdSense im EWR ist zusätzlich eine von Google zertifizierte CMP
 * erforderlich (siehe docs/CONSENT.md).
 */
export function ConsentManager() {
  // Der gespeicherte Stand kommt aus dem externen Consent-Store, damit alle
  // Komponenten denselben Zustand sehen.
  const { consent: decision, ready } = useConsent();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(defaultConsent);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Consent Mode v2 so früh wie möglich auf "denied" setzen und danach den
  // bereits gespeicherten Stand anwenden. Setzt selbst keinen React-Zustand.
  useEffect(() => {
    setDefaultConsent();
    const stored = readConsent();
    if (stored) updateConsent(stored.choices);
  }, []);

  // Dialog von aussen öffnen (Footer-Link, Seite "Cookie-Einstellungen").
  useEffect(() => {
    function onOpen() {
      setDraft(readConsent()?.choices ?? defaultConsent);
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      setDialogOpen(true);
    }
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  const save = useCallback((choices: ConsentState) => {
    const stored = writeConsent(choices);
    updateConsent(stored.choices);
    setDialogOpen(false);
    previouslyFocused.current?.focus();
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    previouslyFocused.current?.focus();
  }, []);

  // Tastaturbedienung des Dialogs.
  useEffect(() => {
    if (!dialogOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
    const firstButton = dialogRef.current?.querySelector<HTMLElement>("button");
    firstButton?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dialogOpen, closeDialog]);

  // Vor der Hydration ist der gespeicherte Stand unbekannt. Erst danach
  // rendern, damit der Banner bei bereits erteilter Einwilligung nicht kurz
  // aufblitzt.
  if (!ready) return null;

  const showBanner = decision === null && !dialogOpen;

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          aria-describedby="consent-text"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:p-6"
        >
          <div className="mx-auto max-w-4xl">
            <h2 id="consent-title" className="text-base font-semibold text-text">
              Wir fragen dich um Erlaubnis
            </h2>
            <p
              id="consent-text"
              className="mt-2 text-sm leading-relaxed text-text-muted"
            >
              Diese Website finanziert sich über Werbung. Dafür und für eine
              anonyme Nutzungsstatistik möchten wir Cookies und ähnliche
              Technologien einsetzen. Notwendige Funktionen laufen immer –
              alles andere nur mit deiner Zustimmung. Du kannst deine Auswahl
              jederzeit im Footer unter „Cookie-Einstellungen“ ändern. Mehr in
              unserer{" "}
              <Link
                href="/datenschutz"
                className="text-brand underline underline-offset-2"
              >
                Datenschutzerklärung
              </Link>
              .
            </p>

            {/* Die drei Optionen sind bewusst gleich gross und gleich
                prominent – kein Dark Pattern zugunsten von "Akzeptieren". */}
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => save(acceptAllConsent)}
                className="rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-on-brand hover:bg-brand-strong"
              >
                Alle akzeptieren
              </button>
              <button
                type="button"
                onClick={() => save(rejectAllConsent)}
                className="rounded-lg border-2 border-brand px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-soft"
              >
                Ablehnen
              </button>
              <button
                type="button"
                onClick={() => {
                  previouslyFocused.current =
                    document.activeElement as HTMLElement | null;
                  setDialogOpen(true);
                }}
                className="rounded-lg border-2 border-brand px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-soft"
              >
                Einstellungen
              </button>
            </div>
          </div>
        </div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-settings-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-xl border border-border bg-surface p-5 sm:rounded-xl sm:p-6"
          >
            <h2
              id="consent-settings-title"
              className="text-lg font-semibold text-text"
            >
              Cookie-Einstellungen
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Wähle aus, was du erlauben möchtest. Deine Auswahl wird lokal in
              deinem Browser gespeichert und gilt, bis du sie änderst.
            </p>

            <div className="mt-5 space-y-3">
              {(Object.keys(consentCategoryInfo) as ConsentCategory[]).map(
                (category) => {
                  const info = consentCategoryInfo[category];
                  return (
                    <div
                      key={category}
                      className="rounded-lg border border-border bg-surface-muted/50 p-4"
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={info.required ? true : draft[category]}
                          disabled={info.required}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              [category]: event.target.checked,
                            }))
                          }
                          className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-brand)]"
                        />
                        <span>
                          <span className="block font-medium text-text">
                            {info.title}
                            {info.required && (
                              <span className="ml-2 text-xs font-normal text-text-subtle">
                                immer aktiv
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-text-muted">
                            {info.description}
                          </span>
                        </span>
                      </label>
                    </div>
                  );
                },
              )}
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => save(acceptAllConsent)}
                className="rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-on-brand hover:bg-brand-strong"
              >
                Alle akzeptieren
              </button>
              <button
                type="button"
                onClick={() => save(rejectAllConsent)}
                className="rounded-lg border-2 border-brand px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-soft"
              >
                Alle ablehnen
              </button>
              <button
                type="button"
                onClick={() => save(draft)}
                className="rounded-lg border-2 border-brand px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-soft"
              >
                Auswahl speichern
              </button>
            </div>

            {decision !== null && (
              <button
                type="button"
                onClick={closeDialog}
                className="mt-3 w-full rounded-lg px-4 py-2 text-sm text-text-subtle underline underline-offset-2 hover:text-text"
              >
                Ohne Änderung schliessen
              </button>
            )}

            <p className="mt-4 text-xs leading-relaxed text-text-subtle">
              Hinweis: Diese Einwilligungslösung ist eine technische
              Umsetzung und stellt keine Rechtsberatung dar. Ob sie für deinen
              konkreten Einsatzzweck ausreicht, muss vor der Veröffentlichung
              fachkundig geprüft werden.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
