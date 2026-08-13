import type { ReactNode } from "react";

type CalloutTone = "info" | "warnung" | "achtung";

const tones: Record<CalloutTone, { box: string; title: string }> = {
  info: {
    box: "border-border bg-info-soft",
    title: "text-text",
  },
  warnung: {
    box: "border-warning/40 bg-warning-soft",
    title: "text-warning",
  },
  achtung: {
    box: "border-danger/40 bg-danger-soft",
    title: "text-danger",
  },
};

/**
 * Hinweisbox für Einordnungen, Warnungen und Grenzen einer Berechnung.
 * Warnungen erhalten role="alert" wenn sie erst nach einer Eingabe erscheinen.
 */
export function Callout({
  tone = "info",
  title,
  children,
  live = false,
}: {
  tone?: CalloutTone;
  title?: string;
  children: ReactNode;
  live?: boolean;
}) {
  const style = tones[tone];
  return (
    <div
      className={`rounded-lg border p-4 text-sm leading-relaxed text-text-muted ${style.box}`}
      role={live ? "alert" : undefined}
    >
      {title && (
        <p className={`mb-1 font-semibold ${style.title}`}>{title}</p>
      )}
      {children}
    </div>
  );
}
