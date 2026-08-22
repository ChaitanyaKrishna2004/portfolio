import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Minus, Plus } from "lucide-react";
import { getResource, resolveFields, RESOURCES, type ColumnDef } from "@/lib/adminSchema";
import { modelFor } from "@/services/admin.service";
import { RecordForm } from "./RecordForm";
import { MediaGallery } from "./MediaGallery";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ resource: r.slug }));
}

function renderCell(col: ColumnDef, row: Record<string, unknown>) {
  const value = row[col.key];

  if (col.type === "boolean") {
    return value ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <Minus className="w-4 h-4 text-foreground/25" />
    );
  }

  if (col.type === "date") {
    if (!value) return <span className="text-foreground/30">—</span>;
    return (
      <span className="tabular-nums text-foreground/70">
        {new Date(value as string).toISOString().slice(0, 10)}
      </span>
    );
  }

  if (col.type === "badge") {
    if (!value) return <span className="text-foreground/30">—</span>;
    return (
      <span className="inline-block px-2 py-0.5 rounded-md bg-foreground/8 border border-border text-xs font-mono">
        {String(value)}
      </span>
    );
  }

  if (value == null || value === "") return <span className="text-foreground/30">—</span>;
  return <span className="truncate">{String(value)}</span>;
}

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  const model = modelFor(resource);

  // The singleton has no list — go straight to its editor.
  if (resource.singleton) {
    const row = await model.findOne({ order: resource.orderBy });
    if (!row) notFound();

    const plain = JSON.parse(JSON.stringify(row.get({ plain: true })));
    return (
      <RecordForm
        resource={resource}
        fields={resolveFields(resource, plain)}
        row={plain}
        isNew={false}
      />
    );
  }

  const rows = await model.findAll({ order: resource.orderBy });
  const plain = rows.map((r) => JSON.parse(JSON.stringify(r.get({ plain: true }))));

  // Media is browsed by eye, so it gets a gallery with upload instead of a table.
  if (resource.slug === "media") {
    return <MediaGallery rows={plain} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{resource.label}</h1>
          <p className="text-sm text-foreground/60 mt-1">
            {plain.length} {plain.length === 1 ? "record" : "records"}
          </p>
        </div>

        {resource.canCreate && (
          <Link
            href={`/admin/${resource.slug}/new`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New {resource.singular.toLowerCase()}
          </Link>
        )}
      </header>

      {plain.length === 0 ? (
        <div className="p-10 rounded-2xl border border-dashed border-border text-center">
          <p className="text-foreground/60">No {resource.label.toLowerCase()} yet.</p>
          {resource.canCreate && (
            <Link href={`/admin/${resource.slug}/new`} className="text-sm font-semibold text-accent-violet hover:underline mt-2 inline-block">
              Create the first one
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-foreground/[0.03]">
                {resource.columns.map((c) => (
                  <th key={c.key} className="text-left font-semibold text-xs uppercase tracking-wider text-foreground/50 px-4 py-3 whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {plain.map((row) => (
                <tr key={row.id as string} className="border-b border-border last:border-b-0 hover:bg-foreground/[0.03] transition-colors">
                  {resource.columns.map((c, i) => (
                    <td key={c.key} className="px-4 py-3 max-w-[22rem]">
                      {i === 0 ? (
                        <Link href={`/admin/${resource.slug}/${row.id}`} className="font-medium hover:text-accent-violet transition-colors block truncate">
                          {renderCell(c, row)}
                        </Link>
                      ) : (
                        renderCell(c, row)
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/${resource.slug}/${row.id}`} className="text-xs font-semibold text-accent-violet hover:underline whitespace-nowrap">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
