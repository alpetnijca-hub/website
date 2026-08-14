"use client";

import { useState } from "react";
import { Callout } from "@/components/ui/Callout";
import { cryptoOptions } from "@/config/support";

/**
 * Krypto-Adressen zum Kopieren.
 *
 * Keine Wallet-Anbindung, kein Zahlungsdienst, kein Skript von aussen – nur
 * die Adressen als Text. Damit gibt es auch nichts, was den Besucher verfolgen
 * könnte, und nichts, das ausfallen kann.
 *
 * Die Adresse steht immer vollständig und lesbar da. Sie wird nie gekürzt
 * angezeigt: Wer prüfen will, wohin er sendet, muss alle Zeichen sehen können.
 */
export function CryptoTips() {
  const [copied, setCopied] = useState<string | null>(null);

  if (cryptoOptions.length === 0) return null;

  async function copy(id: string, address: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      // Ohne Zwischenablage-Rechte bleibt die Adresse markierbar – der Text
      // steht ja vollständig da.
      setCopied(null);
    }
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {cryptoOptions.map((option) => (
          <li
            key={option.id}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-semibold text-text">{option.symbol}</span>
              <span className="text-sm text-text-muted">{option.name}</span>
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                Netzwerk: {option.network}
              </span>
            </div>

            <p className="mt-2.5 break-all rounded-lg border border-border bg-surface-muted/60 px-3 py-2.5 font-mono text-sm text-text">
              {option.address}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => copy(option.id, option.address)}
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-text-subtle"
              >
                {copied === option.id ? "Kopiert ✓" : "Adresse kopieren"}
              </button>
              {option.uri && (
                <a
                  href={option.uri}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:border-text-subtle"
                >
                  In der Wallet öffnen
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Callout tone="warnung" title="Krypto-Zahlungen sind endgültig">
        Eine gesendete Transaktion lässt sich nicht zurückholen – von
        niemandem. Prüfe die Adresse vor dem Senden Zeichen für Zeichen und
        achte darauf, dass du das <strong>angegebene Netzwerk</strong>{" "}
        verwendest. Über ein anderes Netzwerk gesendete Beträge sind verloren.
        Wenn du unsicher bist, schick zuerst einen kleinen Betrag.
      </Callout>
    </div>
  );
}
