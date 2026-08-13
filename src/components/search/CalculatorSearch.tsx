"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { calculators } from "@/config/calculators";
import { Icon } from "@/components/ui/Icon";

/**
 * Suche über alle Rechner.
 *
 * Läuft vollständig im Browser auf der bereits geladenen Registry –
 * kein Netzwerkaufruf, keine Übertragung der Eingabe an einen Server.
 * Bedienung per Tastatur: Eingabe, Pfeiltasten im Ergebnis (native Links),
 * Escape leert das Feld.
 */
export function CalculatorSearch({ limit = 6 }: { limit?: number }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const resultsId = `${inputId}-results`;

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];
    return calculators
      .filter((calculator) => {
        const haystack = [
          calculator.name,
          calculator.description,
          ...calculator.keywords,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      })
      // Fertige Rechner zuerst.
      .sort((a, b) => (a.status === b.status ? 0 : a.status === "aktiv" ? -1 : 1))
      .slice(0, limit);
  }, [query, limit]);

  const showEmpty = query.trim().length >= 2 && results.length === 0;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="sr-only">
        Rechner suchen
      </label>
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-subtle"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
          placeholder="Rechner suchen, z. B. Kalorienbedarf oder BMI"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={resultsId}
          aria-autocomplete="list"
          className="w-full rounded-xl border border-border bg-surface py-3.5 pl-12 pr-4 text-base text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div aria-live="polite">
        {results.length > 0 && (
          <ul
            id={resultsId}
            className="mt-2 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface text-left"
          >
            {results.map((calculator) => (
              <li key={calculator.id}>
                {calculator.status === "aktiv" ? (
                  <Link
                    href={calculator.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted"
                  >
                    <Icon
                      name={calculator.icon}
                      className="h-5 w-5 shrink-0 text-brand"
                    />
                    <span className="text-sm font-medium text-text">
                      {calculator.name}
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Icon
                      name={calculator.icon}
                      className="h-5 w-5 shrink-0 text-text-subtle"
                    />
                    <span className="text-sm text-text-subtle">
                      {calculator.name} · in Vorbereitung
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {showEmpty && (
          <p className="mt-2 rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm text-text-muted">
            Kein passender Rechner gefunden.{" "}
            <Link href="/rechner" className="text-brand underline underline-offset-2">
              Alle Rechner ansehen
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
