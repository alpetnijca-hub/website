"use client";

import { openConsentSettings } from "@/lib/consent";

/**
 * Öffnet den Einwilligungsdialog von beliebiger Stelle aus.
 * Wird im Footer und auf der Seite "Cookie-Einstellungen" verwendet –
 * damit ist die Einwilligung jederzeit änderbar und widerrufbar.
 */
export function ConsentSettingsLink({
  className = "",
  children = "Cookie-Einstellungen",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {children}
    </button>
  );
}
