import { ImageResponse } from "next/og";
import { site } from "@/config/site";

/**
 * Open-Graph-Bild, das beim Build erzeugt wird.
 *
 * Next.js stellt es automatisch unter /opengraph-image bereit und verlinkt es
 * in den Meta-Daten. Dadurch braucht es keine hochgeladene Bilddatei und der
 * Markenname bleibt an einer einzigen Stelle konfiguriert (src/config/site.ts).
 *
 * Es werden bewusst nur Systemschriften verwendet – so muss keine Schriftdatei
 * geladen werden und der Build bleibt schnell.
 */
export const alt = `${site.name} – ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0f766e",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.02em" }}>
          {site.name}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 40,
            lineHeight: 1.3,
            color: "#ccfbf1",
            maxWidth: 900,
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            marginTop: 56,
            fontSize: 26,
            color: "#99f6e4",
          }}
        >
          Formeln offengelegt · Berechnung im Browser · ohne Anmeldung
        </div>
      </div>
    ),
    size,
  );
}
