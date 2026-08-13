import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/schema";

/**
 * Sichtbare Breadcrumb-Navigation plus passendes BreadcrumbList-Markup.
 * Das letzte Element ist der aktuelle Seitentitel und wird nicht verlinkt.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const full: BreadcrumbItem[] = [{ name: "Startseite", href: "/" }, ...items];

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-text-subtle">
          {full.map((item, index) => {
            const isLast = index === full.length - 1;
            return (
              <li key={item.name} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden="true" className="text-border">
                    /
                  </span>
                )}
                {isLast || !item.href ? (
                  <span aria-current="page" className="text-text-muted">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-brand hover:underline"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(full)} />
    </>
  );
}
