"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "rp_theme";
const THEME_EVENT = "rp:theme-change";

/**
 * Kleiner externer Store für das aktive Design.
 *
 * Die Quelle der Wahrheit ist die Klasse "dark" am <html>-Element. Sie wird
 * bereits vor dem ersten Rendern durch das Inline-Skript (ThemeScript.tsx)
 * gesetzt, damit nichts aufblitzt. useSyncExternalStore liest sie aus,
 * ohne dass ein Effekt Zustand setzen muss.
 */
function subscribe(onChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Beim Server-Rendering ist das Design unbekannt; hell ist der Standard. */
function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      // Funktionale Speicherung (Kategorie "notwendig"), keine Profilbildung.
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Kein Speicher verfügbar – die Auswahl gilt nur für diese Sitzung.
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT));
  }

  const label =
    theme === "dark"
      ? "Zum hellen Design wechseln"
      : "Zum dunklen Design wechseln";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        )}
      </svg>
    </button>
  );
}
