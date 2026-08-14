/**
 * Trinkgeld- und Spendenfunktion.
 *
 * Hier stehen **keine** echten Zahlungsadressen im Quelltext. Alles kommt aus
 * Umgebungsvariablen, die du bei Vercel einträgst – so liegt keine
 * Zahlungsadresse im öffentlichen Repository, und du kannst sie ändern, ohne
 * den Code anzufassen.
 *
 * Ist keine einzige Variable gesetzt, verschwindet die Funktion vollständig:
 * kein Menüpunkt, keine Karte, keine Seite in der Sitemap. Es gibt also
 * niemals einen Knopf, der ins Leere führt.
 *
 * Wie du die Werte bekommst, steht Schritt für Schritt in `docs/SPENDEN.md`.
 */

function clean(value: string | undefined): string {
  const trimmed = (value ?? "").trim();
  // Platzhalter aus der Beispieldatei sollen nicht als echte Konten gelten.
  if (!trimmed || trimmed.startsWith("dein")) return "";
  return trimmed;
}

/**
 * Räumt einen Benutzernamen auf, bevor er in eine Adresse eingesetzt wird.
 *
 * Bei allen drei Anbietern ist der Benutzername ohne Zusätze anzugeben. Wer
 * ihn aus dem Profil kopiert, hat aber schnell ein "@" davor oder gleich die
 * ganze Adresse in der Zwischenablage – und beides führt zu einer
 * Fehlerseite beim Anbieter statt zu einer Zahlung. Deshalb wird hier
 * abgeschnitten, was nicht zum Namen gehört.
 */
function handle(value: string | undefined): string {
  let name = clean(value);
  if (!name) return "";
  // Vollständige Adresse eingetragen: nur den letzten Pfadteil behalten.
  if (name.includes("/")) {
    name = name.split("/").filter(Boolean).pop() ?? "";
  }
  // Führendes @ entfernen, Querystring abschneiden.
  name = name.replace(/^@+/, "").split("?")[0].trim();
  return name;
}

/** Benutzername bei PayPal.me, z. B. "alvinr" – ohne paypal.me/ davor. */
const paypalHandle = handle(process.env.NEXT_PUBLIC_PAYPAL_ME);

/** Benutzername bei Ko-fi, z. B. "rechnerliste". */
const kofiHandle = handle(process.env.NEXT_PUBLIC_KOFI);

/** Benutzername bei Buy Me a Coffee. */
const bmacHandle = handle(process.env.NEXT_PUBLIC_BUYMEACOFFEE);

/** Vollständige Adresse eines Stripe-Zahlungslinks. */
const stripeLink = clean(process.env.NEXT_PUBLIC_STRIPE_LINK);

export interface SupportOption {
  id: string;
  /** Anzeigename des Anbieters. */
  name: string;
  /** Ein Satz darüber, was den Besucher dort erwartet. */
  note: string;
  /** Zieladresse ohne Betrag. */
  url: string;
  /**
   * Adresse für einen festen Betrag in Euro, wenn der Anbieter das über die
   * Adresse unterstützt. Sonst null – dann wird der Betrag beim Anbieter
   * gewählt.
   */
  amountUrl: ((euro: number) => string) | null;
}

export const supportOptions: SupportOption[] = [
  paypalHandle && {
    id: "paypal",
    name: "PayPal",
    note: "Zahlung mit PayPal-Konto, Karte oder Lastschrift.",
    url: `https://paypal.me/${encodeURIComponent(paypalHandle)}`,
    amountUrl: (euro: number) =>
      `https://paypal.me/${encodeURIComponent(paypalHandle)}/${euro}EUR`,
  },
  kofiHandle && {
    id: "kofi",
    name: "Ko-fi",
    note: "Ohne Ko-fi-Konto nutzbar, Betrag wird dort gewählt.",
    url: `https://ko-fi.com/${encodeURIComponent(kofiHandle)}`,
    amountUrl: null,
  },
  bmacHandle && {
    id: "bmac",
    name: "Buy Me a Coffee",
    note: "Ohne eigenes Konto nutzbar, Betrag wird dort gewählt.",
    url: `https://buymeacoffee.com/${encodeURIComponent(bmacHandle)}`,
    amountUrl: null,
  },
  stripeLink && {
    id: "stripe",
    name: "Kreditkarte",
    note: "Sichere Zahlungsseite von Stripe, ohne Anmeldung.",
    url: stripeLink,
    amountUrl: null,
  },
].filter((option): option is SupportOption => Boolean(option));

/** Vorgeschlagene Beträge in Euro. Bewusst niedrig gehalten. */
export const supportAmounts = [2, 5, 10];

// ---------------------------------------------------------------------------
// Kryptowährungen
// ---------------------------------------------------------------------------

export interface CryptoOption {
  id: string;
  /** Kürzel der Währung, z. B. "BTC". */
  symbol: string;
  /** Ausgeschriebener Name. */
  name: string;
  /**
   * Das Netzwerk, über das gesendet werden muss. Diese Angabe ist keine
   * Nebensache: Wer USDT über das falsche Netzwerk schickt, verliert den
   * Betrag – deshalb steht sie überall gross dabei.
   */
  network: string;
  address: string;
  /** Adresse als Wallet-Link (öffnet die App), sofern es dafür ein Schema gibt. */
  uri: string | null;
}

interface CryptoSpec {
  id: string;
  symbol: string;
  name: string;
  network: string;
  env: string | undefined;
  /**
   * Formatprüfung. Sie erkennt keine Tippfehler innerhalb einer sonst
   * gültigen Adresse – dafür braucht es die Prüfsumme der jeweiligen Kette –,
   * aber sie fängt die häufigen Fehler ab: abgeschnittene Adressen,
   * mitkopierte Leerzeichen, versehentlich eingefügter Text.
   */
  pattern: RegExp;
  /** Baut den Wallet-Link, falls die Kette ein Schema hat. */
  uri?: (address: string) => string;
}

const cryptoSpecs: CryptoSpec[] = [
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    network: "Bitcoin",
    env: process.env.NEXT_PUBLIC_CRYPTO_BTC,
    pattern: /^(bc1[a-z0-9]{25,71}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/,
    uri: (address) => `bitcoin:${address}`,
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    network: "Ethereum (ERC-20)",
    env: process.env.NEXT_PUBLIC_CRYPTO_ETH,
    pattern: /^0x[a-fA-F0-9]{40}$/,
    uri: (address) => `ethereum:${address}`,
  },
  {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    network: "Solana",
    env: process.env.NEXT_PUBLIC_CRYPTO_SOL,
    pattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  },
  {
    id: "usdt-trc20",
    symbol: "USDT",
    name: "Tether",
    network: "TRON (TRC-20)",
    env: process.env.NEXT_PUBLIC_CRYPTO_USDT_TRC20,
    pattern: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  },
];

/**
 * Nur Adressen, die zum Format der jeweiligen Kette passen, werden angezeigt.
 *
 * Das ist Absicht und der wichtigste Teil dieser Datei: Eine Krypto-Zahlung
 * ist endgültig. Geht sie an eine falsche Adresse, ist sie weg – niemand kann
 * sie zurückholen. Lieber gar kein Knopf als ein Knopf mit einer kaputten
 * Adresse.
 */
export const cryptoOptions: CryptoOption[] = cryptoSpecs
  .map((spec) => {
    const address = clean(spec.env).replace(/\s+/g, "");
    if (!address) return null;
    if (!spec.pattern.test(address)) {
      // Stilles Verwerfen wäre beim Suchen die Hölle: Man trägt eine Adresse
      // ein, deployt, und auf der Seite passiert nichts. Deshalb eine
      // deutliche Meldung im Build-Protokoll. Die Adresse selbst wird dabei
      // nicht ausgegeben.
      console.warn(
        `[support] Die Adresse in NEXT_PUBLIC_CRYPTO_${spec.id.toUpperCase().replace("-", "_")} ` +
          `passt nicht zum Format von ${spec.name} (${spec.network}) und wird nicht angezeigt. ` +
          `Häufige Ursachen: beim Kopieren abgeschnitten, Adresse einer anderen Kette, ` +
          `oder Text mitkopiert. Siehe docs/SPENDEN.md.`,
      );
      return null;
    }
    return {
      id: spec.id,
      symbol: spec.symbol,
      name: spec.name,
      network: spec.network,
      address,
      uri: spec.uri ? spec.uri(address) : null,
    };
  })
  .filter((option): option is CryptoOption => option !== null);

/** Wahr, sobald mindestens ein Zahlungsweg eingerichtet ist. */
export const supportEnabled =
  supportOptions.length > 0 || cryptoOptions.length > 0;

/**
 * Wofür das Geld verwendet wird. Dieser Satz erscheint auf der Seite und muss
 * der Wahrheit entsprechen – wer hier etwas anderes schreibt, als er mit dem
 * Geld tut, täuscht seine Besucher.
 *
 * Der Text wird über NEXT_PUBLIC_SUPPORT_PURPOSE gesetzt. Ist er leer, steht
 * auf der Seite nur, dass die Einnahmen dem Betrieb und der Weiterentwicklung
 * zugutekommen – eine Aussage, die immer stimmt.
 */
export const supportPurpose = clean(process.env.NEXT_PUBLIC_SUPPORT_PURPOSE);
