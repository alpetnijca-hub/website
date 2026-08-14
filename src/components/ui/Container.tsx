import type { ReactNode } from "react";

/** Einheitliche horizontale Begrenzung und Innenabstände für alle Seiten. */
export function Container({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  /** Setzt die Akzentfarbe für alles darin, z. B. `data-accent="finanzen"`. */
  "data-accent"?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
