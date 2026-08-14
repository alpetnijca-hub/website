/**
 * Bildmarke von Rechnerliste.
 *
 * Dieselbe Zeichnung liegt zusätzlich als eigenständige Datei unter
 * public/logo-mark.svg – für Fälle, in denen ein Bild hochgeladen werden muss
 * (Werbenetzwerke, soziale Netzwerke, Verzeichnisse). Wird das Zeichen hier
 * geändert, gehört die Datei dort mit angepasst.
 *
 * Das Zeichen besteht aus drei Rechenoperatoren – Plus, Schrägstrich, Minus –
 * die zusammen die Form eines Prozentzeichens ergeben.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="512" height="512" rx="112" fill="currentColor" />
      <g stroke="var(--color-on-brand)" strokeLinecap="round" fill="none">
        <path d="M136 376 L376 136" strokeWidth="46" />
        <path d="M104 152 H196 M150 106 V198" strokeWidth="42" />
        <path d="M316 360 H408" strokeWidth="42" />
      </g>
    </svg>
  );
}
