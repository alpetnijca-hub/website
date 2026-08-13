import { getSources, type SourceId } from "@/data/sources";

/** Quellenangaben am Ende einer Rechnerseite. */
export function SourceList({ ids }: { ids: readonly SourceId[] }) {
  const items = getSources(ids);
  return (
    <ol className="space-y-3 text-sm text-text-muted">
      {items.map((source, index) => (
        <li key={source.id} className="flex gap-3">
          <span className="shrink-0 text-text-subtle">[{index + 1}]</span>
          <span>
            {source.citation}: <em>{source.title}</em>. {source.publication}.
            {source.url && (
              <>
                {" "}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-brand underline underline-offset-2"
                >
                  {source.url}
                </a>
              </>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
