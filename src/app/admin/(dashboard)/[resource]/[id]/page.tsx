import { notFound } from "next/navigation";
import { getResource, resolveFields, isStructured, type FieldDef } from "@/lib/adminSchema";
import { modelFor } from "@/services/admin.service";
import { RecordForm } from "../RecordForm";

export const dynamic = "force-dynamic";

/** Sensible starting values for a brand new record. */
function blankRow(fields: FieldDef[]): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  for (const f of fields) {
    if (isStructured(f.type)) {
      row[f.key] = f.type === "list" || f.type === "objectList" ? [] : {};
    } else if (f.type === "boolean") {
      row[f.key] = f.key === "isVisible" || f.key === "isPublished";
    } else if (f.type === "number") {
      row[f.key] = f.key === "sortOrder" ? 0 : null;
    } else if (f.type === "date") {
      row[f.key] = new Date().toISOString();
    } else {
      row[f.key] = "";
    }
  }

  return row;
}

export default async function RecordPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: slug, id } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  if (id === "new") {
    if (!resource.canCreate) notFound();
    const fields = resolveFields(resource, {});
    return <RecordForm resource={resource} fields={fields} row={blankRow(fields)} isNew />;
  }

  const row = await modelFor(resource).findByPk(id);
  if (!row) notFound();

  // Dates and Sequelize instances aren't serialisable across the server/client
  // boundary, so flatten to plain JSON first.
  const plain = JSON.parse(JSON.stringify(row.get({ plain: true })));

  return <RecordForm resource={resource} fields={resolveFields(resource, plain)} row={plain} isNew={false} />;
}
