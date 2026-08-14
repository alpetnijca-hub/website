import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Die Konfiguration liest die Umgebungsvariablen beim Laden des Moduls aus.
 * Für jeden Fall wird das Modul deshalb frisch importiert.
 */
async function loadWith(env: Record<string, string>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value);
  }
  return import("@/config/support");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("supportOptions", () => {
  it("ist ohne Konfiguration vollständig abgeschaltet", async () => {
    const config = await loadWith({});
    expect(config.supportEnabled).toBe(false);
    expect(config.supportOptions).toHaveLength(0);
  });

  it("ignoriert die Platzhalter aus der Beispieldatei", async () => {
    const config = await loadWith({ NEXT_PUBLIC_PAYPAL_ME: "deinname" });
    expect(config.supportEnabled).toBe(false);
  });

  it("baut die PayPal-Adresse mit und ohne Betrag", async () => {
    const config = await loadWith({ NEXT_PUBLIC_PAYPAL_ME: "MaxMuster" });
    const paypal = config.supportOptions[0];
    expect(paypal.url).toBe("https://paypal.me/MaxMuster");
    expect(paypal.amountUrl?.(10)).toBe("https://paypal.me/MaxMuster/10EUR");
  });

  it("entfernt ein versehentlich mitkopiertes @", async () => {
    // Mit @ im Namen liefert PayPal.me eine Fehlerseite – das @ wird als
    // %40 kodiert und gehört nicht zum Benutzernamen.
    const config = await loadWith({ NEXT_PUBLIC_PAYPAL_ME: "@MaxMuster" });
    expect(config.supportOptions[0].url).toBe("https://paypal.me/MaxMuster");
  });

  it("verträgt auch eine ganze Adresse statt des Benutzernamens", async () => {
    const config = await loadWith({
      NEXT_PUBLIC_KOFI: "https://ko-fi.com/MaxMuster?x=1",
    });
    expect(config.supportOptions[0].url).toBe("https://ko-fi.com/MaxMuster");
  });

  it("entfernt Leerzeichen am Rand", async () => {
    const config = await loadWith({ NEXT_PUBLIC_BUYMEACOFFEE: "  maxmuster " });
    expect(config.supportOptions[0].url).toBe(
      "https://buymeacoffee.com/maxmuster",
    );
  });

  it("nimmt den Stripe-Link unverändert", async () => {
    const link = "https://buy.stripe.com/test_abc123";
    const config = await loadWith({ NEXT_PUBLIC_STRIPE_LINK: link });
    expect(config.supportOptions[0].url).toBe(link);
    expect(config.supportOptions[0].amountUrl).toBeNull();
  });

  it("wird auch allein durch eine Krypto-Adresse eingeschaltet", async () => {
    const config = await loadWith({
      NEXT_PUBLIC_CRYPTO_BTC: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    });
    expect(config.supportEnabled).toBe(true);
    expect(config.supportOptions).toHaveLength(0);
    expect(config.cryptoOptions).toHaveLength(1);
  });

  it("zeigt mehrere Anbieter gleichzeitig", async () => {
    const config = await loadWith({
      NEXT_PUBLIC_PAYPAL_ME: "MaxMuster",
      NEXT_PUBLIC_KOFI: "maxmuster",
    });
    expect(config.supportOptions.map((option) => option.id)).toEqual([
      "paypal",
      "kofi",
    ]);
    expect(config.supportEnabled).toBe(true);
  });
});

describe("cryptoOptions", () => {
  // Bekannte Beispieladressen aus den Spezifikationen und der Dokumentation
  // der jeweiligen Kette – kein Konto von jemandem, nur Formatbeispiele.
  const btc = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
  const btcLegacy = "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2";
  const eth = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const tron = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

  it("ist ohne Adressen leer", async () => {
    expect((await loadWith({})).cryptoOptions).toHaveLength(0);
  });

  it("übernimmt eine gültige Bitcoin-Adresse", async () => {
    const config = await loadWith({ NEXT_PUBLIC_CRYPTO_BTC: btc });
    const option = config.cryptoOptions[0];
    expect(option.symbol).toBe("BTC");
    expect(option.address).toBe(btc);
    expect(option.network).toBe("Bitcoin");
    expect(option.uri).toBe(`bitcoin:${btc}`);
  });

  it("akzeptiert auch das alte Bitcoin-Format", async () => {
    const config = await loadWith({ NEXT_PUBLIC_CRYPTO_BTC: btcLegacy });
    expect(config.cryptoOptions[0].address).toBe(btcLegacy);
  });

  it("übernimmt eine gültige Ethereum-Adresse", async () => {
    const config = await loadWith({ NEXT_PUBLIC_CRYPTO_ETH: eth });
    expect(config.cryptoOptions[0].address).toBe(eth);
    expect(config.cryptoOptions[0].uri).toBe(`ethereum:${eth}`);
  });

  it("nennt bei USDT ausdrücklich das Netzwerk", async () => {
    const config = await loadWith({ NEXT_PUBLIC_CRYPTO_USDT_TRC20: tron });
    expect(config.cryptoOptions[0].network).toBe("TRON (TRC-20)");
  });

  it("entfernt mitkopierte Leerzeichen", async () => {
    const config = await loadWith({ NEXT_PUBLIC_CRYPTO_BTC: `  ${btc} ` });
    expect(config.cryptoOptions[0].address).toBe(btc);
  });

  it("verwirft eine abgeschnittene Adresse", async () => {
    // Der haeufigste Kopierfehler. Lieber gar kein Knopf als einer, der
    // Geld an eine Adresse schickt, die es nicht gibt.
    const config = await loadWith({ NEXT_PUBLIC_CRYPTO_BTC: btc.slice(0, 20) });
    expect(config.cryptoOptions).toHaveLength(0);
    expect(config.supportEnabled).toBe(false);
  });

  it("verwirft eine Ethereum-Adresse mit falscher Laenge", async () => {
    const config = await loadWith({ NEXT_PUBLIC_CRYPTO_ETH: `${eth}00` });
    expect(config.cryptoOptions).toHaveLength(0);
  });

  it("verwirft eine Ethereum-Adresse ohne 0x", async () => {
    const config = await loadWith({ NEXT_PUBLIC_CRYPTO_ETH: eth.slice(2) });
    expect(config.cryptoOptions).toHaveLength(0);
  });

  it("verwirft eine Adresse in der falschen Variablen", async () => {
    // Ethereum-Adresse im Bitcoin-Feld: passt zu keinem Bitcoin-Format.
    const config = await loadWith({ NEXT_PUBLIC_CRYPTO_BTC: eth });
    expect(config.cryptoOptions).toHaveLength(0);
  });

  it("verwirft versehentlich eingefuegten Text", async () => {
    const config = await loadWith({
      NEXT_PUBLIC_CRYPTO_BTC: "meine Wallet-Adresse ist bc1...",
    });
    expect(config.cryptoOptions).toHaveLength(0);
  });

  it("zeigt mehrere Waehrungen in fester Reihenfolge", async () => {
    const config = await loadWith({
      NEXT_PUBLIC_CRYPTO_ETH: eth,
      NEXT_PUBLIC_CRYPTO_BTC: btc,
    });
    expect(config.cryptoOptions.map((option) => option.symbol)).toEqual([
      "BTC",
      "ETH",
    ]);
  });
});
