/**
 * Rendert strukturierte Daten als JSON-LD.
 * Die Daten stammen ausschliesslich aus eigenen, statisch definierten Objekten
 * (siehe src/lib/schema.ts), niemals aus Nutzereingaben.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
