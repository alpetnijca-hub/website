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
