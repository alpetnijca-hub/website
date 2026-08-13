import type { IconName } from "@/types/calculator";

/**
 * Inline-SVG-Icons statt einer Icon-Bibliothek – spart eine Abhängigkeit
 * und liefert kein zusätzliches JavaScript aus.
 * Alle Pfade sind auf ein 24x24-Raster gezeichnet und erben die Textfarbe.
 */
const paths: Record<IconName, React.ReactNode> = {
  flame: (
    <path d="M12 3c.5 3-1.5 4-3 5.5A6.5 6.5 0 0 0 12 21a6.5 6.5 0 0 0 6-9c-.7 1.2-1.6 1.8-2.6 2 .6-3.2-1-6.4-3.4-11Z" />
  ),
  scale: (
    <>
      <path d="M12 4v16" />
      <path d="M7 20h10" />
      <path d="M5 8h14" />
      <path d="M5 8 2 15h6L5 8Z" />
      <path d="m19 8-3 7h6l-3-7Z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  "trend-down": (
    <>
      <path d="m3 7 6 6 4-4 8 8" />
      <path d="M15 17h6v-6" />
    </>
  ),
  protein: (
    <>
      <path d="M6 5h12l-1.5 13a2 2 0 0 1-2 1.8H9.5a2 2 0 0 1-2-1.8L6 5Z" />
      <path d="M6.7 11h10.6" />
    </>
  ),
  droplet: <path d="M12 3s6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 9.5 12 3 12 3Z" />,
  activity: <path d="M2 12h4l3 8 6-16 3 8h4" />,
  pie: (
    <>
      <path d="M12 3a9 9 0 1 0 9 9h-9V3Z" />
      <path d="M15 3.6A9 9 0 0 1 20.4 9H15V3.6Z" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h12v4" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5a2 2 0 0 1-2-2Z" />
      <circle cx="17" cy="14" r="1" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3" />
      <ellipse cx="15" cy="16" rx="6" ry="3" />
      <path d="M9 16v1c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
