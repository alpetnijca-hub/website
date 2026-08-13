/**
 * Setzt die Design-Klasse noch vor dem ersten Rendern.
 *
 * Ohne dieses Inline-Skript würde bei aktivem Dark Mode kurz die helle
 * Variante aufblitzen. Das Skript ist bewusst winzig, greift auf keine
 * externe Datei zu und speichert nichts – es liest nur eine bereits
 * getroffene Auswahl.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem("rp_theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (stored === null && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
