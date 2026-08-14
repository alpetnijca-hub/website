"use client";

import { useRef, useState } from "react";
import { cryptoOptions, type CryptoOption } from "@/config/support";

/**
 * Zwei Schritte in einem Fenster: erst die Währung wählen, dann die Adresse.
 *
 * Umgesetzt mit dem <dialog>-Element und `showModal()`. Das ist hier nicht
 * Bequemlichkeit, sondern die verlässlichste Lösung: Der Browser übernimmt
 * damit selbst das Einsperren des Tastaturfokus, das Schliessen mit Escape
 * und das Ausblenden des Hintergrunds für Screenreader. Nachgebaut wird so
 * etwas selten vollständig richtig.
 *
 * Es werden keine Wallet-Skripte eingebunden – nur Text, ein Kopierknopf und
 * ein Link, der die installierte Wallet öffnet.
 */
export function CryptoDialog({
  children,
  className,
}: {
  /** Beschriftung der Schaltfläche, die das Fenster öffnet. */
  children: React.ReactNode;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<CryptoOption | null>(null);
  const [copied, setCopied] = useState(false);

  if (cryptoOptions.length === 0) return null;

  function open() {
    setSelected(null);
    setCopied(false);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  async function copy(address: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ohne Zwischenablage-Rechte bleibt die Adresse markierbar – sie steht
      // vollständig lesbar da.
      setCopied(false);
    }
  }

  return (
    <>
      <button type="button" onClick={open} className={className}>
        {children}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          setSelected(null);
          setCopied(false);
        }}
        // Klick auf den Hintergrund schliesst das Fenster. Der Vergleich mit
        // dem Ziel stellt sicher, dass ein Klick im Inhalt nichts auslöst.
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        aria-labelledby="krypto-titel"
        className="m-auto w-[min(34rem,92vw)] rounded-2xl border border-border bg-surface p-0 text-text backdrop:bg-black/50"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 id="krypto-titel" className="text-lg font-bold text-text">
              {selected ? selected.name : "Kryptowährung wählen"}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {selected
                ? `Senden über das Netzwerk ${selected.network}`
                : "Wähle die Währung, die du senden möchtest."}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="-m-1 shrink-0 rounded-lg p-1 text-text-subtle transition-colors hover:bg-surface-muted hover:text-text"
          >
            <span className="sr-only">Fenster schliessen</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {selected === null ? (
            <ul className="space-y-2">
              {cryptoOptions.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(option);
                      setCopied(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-accent hover:bg-accent-soft/30"
                  >
                    <span>
                      <span className="block font-semibold text-text">
                        {option.symbol}{" "}
                        <span className="font-normal text-text-muted">
                          {option.name}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs text-text-subtle">
                        Netzwerk: {option.network}
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
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p className="text-sm font-medium text-text">
                Adresse für {selected.symbol}
              </p>
              {/* Die Adresse steht immer vollständig da. Wer prüfen will,
                  wohin er sendet, muss alle Zeichen sehen können. */}
              <p className="mt-1.5 break-all rounded-lg border border-border bg-surface-muted/60 px-3 py-2.5 font-mono text-sm text-text">
                {selected.address}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copy(selected.address)}
                  className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-on-brand transition-opacity hover:opacity-90"
                >
                  {copied ? "Kopiert ✓" : "Adresse kopieren"}
                </button>
                {selected.uri && (
                  <a
                    href={selected.uri}
                    className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:border-text-subtle"
                  >
                    In der Wallet öffnen
                  </a>
                )}
              </div>

              <div className="mt-4 rounded-lg border border-warning/40 bg-warning-soft p-3 text-xs leading-relaxed text-text-muted">
                <p className="font-semibold text-warning">
                  Krypto-Zahlungen sind endgültig
                </p>
                <p className="mt-1">
                  Eine gesendete Transaktion kann niemand zurückholen. Prüfe
                  die Adresse Zeichen für Zeichen und sende ausschliesslich
                  über das Netzwerk <strong>{selected.network}</strong> – über
                  ein anderes Netzwerk gesendete Beträge sind verloren. Im
                  Zweifel zuerst einen kleinen Betrag schicken.
                </p>
              </div>

              {cryptoOptions.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mt-4 text-sm font-medium text-accent hover:underline"
                >
                  ← Andere Währung wählen
                </button>
              )}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
