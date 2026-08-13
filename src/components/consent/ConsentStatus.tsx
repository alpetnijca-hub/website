"use client";

import { useConsent } from "@/components/consent/useConsent";
import { ConsentSettingsLink } from "@/components/consent/ConsentSettingsLink";
import { revokeConsent } from "@/lib/consent";
import { consentCategoryInfo, type ConsentCategory } from "@/types/consent";

/** Zeigt den aktuell gespeicherten Einwilligungsstand an. */
export function ConsentStatus() {
  const { consent, ready } = useConsent();

  if (!ready) {
    // Platzhalter mit fester Höhe, damit beim Laden nichts springt.
    return (
      <div
        className="rounded-xl border border-border bg-surface p-5"
        style={{ minHeight: 180 }}
        aria-busy="true"
      />
    );
  }

  const categories = Object.keys(consentCategoryInfo) as ConsentCategory[];

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-lg font-semibold text-text">Dein aktueller Stand</h2>

      {consent === null ? (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Du hast noch keine Entscheidung getroffen oder sie bereits widerrufen.
          Solange das so ist, werden keine Werbe- und Analyseskripte geladen.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-text-muted">
            Gespeichert am{" "}
            {new Date(consent.timestamp).toLocaleString("de-DE", {
              dateStyle: "long",
              timeStyle: "short",
            })}{" "}
            Uhr.
          </p>
          <ul className="mt-4 space-y-2">
            {categories.map((key) => {
              const granted = consent.choices[key];
              return (
                <li
                  key={key}
                  className="flex items-center justify-between gap-4 rounded-lg bg-surface-muted/60 px-4 py-2.5 text-sm"
                >
                  <span className="font-medium text-text">
                    {consentCategoryInfo[key].title}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      granted
                        ? "bg-brand text-on-brand"
                        : "bg-border text-text-muted"
                    }`}
                  >
                    {granted ? "erlaubt" : "abgelehnt"}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <ConsentSettingsLink className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-on-brand hover:bg-brand-strong">
          Auswahl ändern
        </ConsentSettingsLink>
        {consent !== null && (
          <button
            type="button"
            onClick={revokeConsent}
            className="rounded-lg border-2 border-brand px-5 py-3 text-sm font-semibold text-brand hover:bg-brand-soft"
          >
            Einwilligung vollständig widerrufen
          </button>
        )}
      </div>
    </div>
  );
}
