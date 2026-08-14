"use client";

import { useState } from "react";
import {
  cryptoOptions,
  supportAmounts,
  supportOptions,
  type SupportOption,
} from "@/config/support";
import { CryptoDialog } from "@/components/support/CryptoDialog";
import { ProviderIcon } from "@/components/support/PaymentIcon";

/** Auflistung der verfügbaren Währungen, z. B. "BTC, ETH und SOL". */
const cryptoSummary = cryptoOptions
  .map((option) => option.symbol)
  .reduce(
    (text, symbol, index, all) =>
      index === 0
        ? symbol
        : index === all.length - 1
          ? `${text} und ${symbol}`
          : `${text}, ${symbol}`,
    "",
  );

/**
 * Trinkgeld-Schaltflächen.
 *
 * Bewusst ohne eingebettete Bezahl-Skripte: Es werden nur ganz normale Links
 * ausgegeben. Solange niemand darauf klickt, erfährt kein Zahlungsanbieter
 * etwas über den Besucher – ein eingebundenes Widget würde dagegen schon beim
 * Seitenaufruf Daten übertragen und wäre einwilligungspflichtig.
 *
 * Der Betrag wird nur mitgegeben, wenn der Anbieter das über die Adresse
 * unterstützt. Sonst wird er beim Anbieter selbst gewählt.
 */
export function TipJar() {
  const [amount, setAmount] = useState<number | null>(
    supportAmounts[1] ?? null,
  );

  if (supportOptions.length === 0 && cryptoOptions.length === 0) return null;

  const supportsAmounts = supportOptions.some((option) => option.amountUrl);

  function hrefFor(option: SupportOption): string {
    if (amount !== null && option.amountUrl) return option.amountUrl(amount);
    return option.url;
  }

  return (
    <div className="space-y-5">
      {supportsAmounts && (
        <div>
          <p className="text-sm font-medium text-text">Betrag</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {supportAmounts.map((value) => {
              const active = amount === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  aria-pressed={active}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-text-muted hover:border-text-subtle"
                  }`}
                >
                  {value} €
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setAmount(null)}
              aria-pressed={amount === null}
              className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                amount === null
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-text-muted hover:border-text-subtle"
              }`}
            >
              Anderer Betrag
            </button>
          </div>
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {supportOptions.map((option) => (
          <li key={option.id}>
            <a
              href={hrefFor(option)}
              target="_blank"
              rel="noopener noreferrer"
              className="card-lift flex h-full items-center gap-3.5 rounded-xl border border-border bg-surface px-4 py-3.5 hover:border-accent"
            >
              <ProviderIcon id={option.id} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-text">
                  {option.name}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-text-subtle">
                  {option.note}
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              >
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
              <span className="sr-only">(öffnet in einem neuen Tab)</span>
            </a>
          </li>
        ))}

        {/* Krypto steht als gleichwertige Zahlungsart in derselben Liste.
            Die Auswahl der Währung folgt im zweiten Schritt, damit hier nicht
            vier fast gleiche Einträge nebeneinander stehen. */}
        {cryptoOptions.length > 0 && (
          <li>
            <CryptoDialog className="card-lift flex h-full w-full items-center gap-3.5 rounded-xl border border-border bg-surface px-4 py-3.5 text-left hover:border-accent">
              <ProviderIcon id="crypto" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-text">
                  Kryptowährung
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-text-subtle">
                  {cryptoSummary} – Adresse im nächsten Schritt.
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </CryptoDialog>
          </li>
        )}
      </ul>

      <p className="text-xs leading-relaxed text-text-subtle">
        Die Zahlung läuft beim jeweiligen Anbieter beziehungsweise in deiner
        Wallet, nicht auf dieser Website. Vor dem Klick wird nichts an einen
        Zahlungsdienst übermittelt. Ein Trinkgeld ist freiwillig, du bekommst
        dafür keine Gegenleistung, und alle Rechner bleiben ohne Zahlung
        vollständig nutzbar.
      </p>
    </div>
  );
}
