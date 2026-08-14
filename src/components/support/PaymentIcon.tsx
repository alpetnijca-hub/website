/**
 * Symbole für die Zahlungswege.
 *
 * Alle Zeichnungen sind selbst gesetzte Inline-SVGs – keine Bilddateien, keine
 * Symbolbibliothek, kein Nachladen. Sie sind damit gestochen scharf auf jedem
 * Bildschirm und kosten keine Ladezeit.
 *
 * **Bewusst keine Fremdlogos.** Für die Zahlungsdienste stehen hier sinnhafte
 * Sinnbilder in der Hausfarbe des jeweiligen Anbieters, nicht deren
 * Wort- oder Bildmarken. Ein nachgezeichnetes Firmenlogo wäre erstens fast
 * immer eine schlechte Kopie und zweitens eine Nutzung fremder Marken, deren
 * Bedingungen ich nicht geprüft habe. Der Name steht ohnehin daneben – die
 * Farbe genügt zum Wiedererkennen.
 *
 * Bei den Kryptowährungen ist es anders: ₿, die Ethereum-Raute und die
 * Solana-Balken sind die allgemein gebräuchlichen Zeichen der jeweiligen
 * offenen Netzwerke und nicht das Logo eines Unternehmens.
 */

interface IconStyle {
  /** Hintergrund der Kachel. */
  background: string;
  /** Farbe der Zeichnung darauf. */
  foreground: string;
  glyph: React.ReactNode;
}

/** Geldbörse – für Zahlungsdienste, bei denen Geld vom Konto kommt. */
const walletGlyph = (
  <>
    <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H18a2 2 0 0 1 2 2v1" />
    <path d="M3 8.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
    <path d="M21 10h-4a2 2 0 0 0 0 4h4Z" />
  </>
);

/** Kaffeetasse – für die Trinkgeld-Plattformen. */
const coffeeGlyph = (
  <>
    <path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" />
    <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
    <path d="M8 3v2.5M12 3v2.5" />
  </>
);

/** Zahlkarte – für die Kartenzahlung über Stripe. */
const cardGlyph = (
  <>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 14.5h3" />
  </>
);

const providerStyles: Record<string, IconStyle> = {
  paypal: { background: "#0070e0", foreground: "#ffffff", glyph: walletGlyph },
  kofi: { background: "#ff5e5b", foreground: "#ffffff", glyph: coffeeGlyph },
  bmac: { background: "#ffdd00", foreground: "#1f2937", glyph: coffeeGlyph },
  stripe: { background: "#635bff", foreground: "#ffffff", glyph: cardGlyph },
  crypto: {
    background: "#f7931a",
    foreground: "#ffffff",
    glyph: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.5 8h3.2a2.1 2.1 0 0 1 0 4.2H9.5m0 0h3.6a2.1 2.1 0 0 1 0 4.2H9.5m0-8.4v8.4" />
        <path d="M11 6.2v1.8M13.2 6.2v1.8M11 16.2v1.8M13.2 16.2v1.8" />
      </>
    ),
  },
};

/**
 * Zeichen der einzelnen Kryptowährungen, jeweils in der Farbe, in der sie
 * üblicherweise dargestellt werden.
 */
const cryptoStyles: Record<string, IconStyle> = {
  BTC: {
    background: "#f7931a",
    foreground: "#ffffff",
    glyph: (
      <>
        {/* Das ₿: ein B mit zwei durchgehenden Strichen. */}
        <path d="M8.5 6.5h4.2a2.4 2.4 0 0 1 0 4.8H8.5m0 0h4.6a2.4 2.4 0 0 1 0 4.8H8.5m0-9.6v9.6" />
        <path d="M10.4 4.6v1.9M12.8 4.6v1.9M10.4 16.1v1.9M12.8 16.1v1.9" />
      </>
    ),
  },
  ETH: {
    background: "#627eea",
    foreground: "#ffffff",
    glyph: (
      <>
        {/* Die Raute: oberer und unterer Körper. */}
        <path d="M12 3v7.2l5.5 2.5L12 3Z" />
        <path d="M12 3 6.5 12.7 12 10.2V3Z" />
        <path d="M12 14v7l5.5-7.6L12 14Z" />
        <path d="M12 21v-7l-5.5-.6L12 21Z" />
      </>
    ),
  },
  SOL: {
    background: "#14f195",
    foreground: "#0b1220",
    glyph: (
      <>
        {/* Drei schräge Balken. */}
        <path d="M6.5 7.5h11l-2.5 2.6h-11L6.5 7.5Z" />
        <path d="M4 11.2h11l2.5 2.6h-11L4 11.2Z" />
        <path d="M6.5 16.5h11l-2.5-2.6" />
      </>
    ),
  },
  USDT: {
    background: "#26a17b",
    foreground: "#ffffff",
    glyph: (
      <>
        {/* Das ₮: T mit zusätzlichem Querstrich. */}
        <path d="M5.5 6.5h13" />
        <path d="M12 6.5v12" />
        <path d="M6.5 10.2h11" />
      </>
    ),
  },
};

function Tile({
  style,
  filled,
  className = "",
}: {
  style: IconStyle;
  /** true = Zeichnung gefüllt (für Flächenformen wie die Ethereum-Raute). */
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${className}`}
      style={{ backgroundColor: style.background }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill={filled ? style.foreground : "none"}
        stroke={style.foreground}
        strokeWidth={filled ? 0.8 : 1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {style.glyph}
      </svg>
    </span>
  );
}

/** Symbol eines Zahlungsdienstes, ausgewählt über dessen ID. */
export function ProviderIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const style = providerStyles[id];
  if (!style) return null;
  return <Tile style={style} className={className} />;
}

/** Symbol einer Kryptowährung, ausgewählt über deren Kürzel. */
export function CryptoIcon({
  symbol,
  className,
}: {
  symbol: string;
  className?: string;
}) {
  const style = cryptoStyles[symbol];
  if (!style) return null;
  // Ethereum und Solana bestehen aus Flächen, Bitcoin und Tether aus Strichen.
  return (
    <Tile
      style={style}
      filled={symbol === "ETH" || symbol === "SOL"}
      className={className}
    />
  );
}
