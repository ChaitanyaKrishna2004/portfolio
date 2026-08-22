import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getResource, resolveFields } from "@/lib/adminSchema";
import {
  modelFor, buildPayload, recordAudit, revalidateSite, diffOf, snapshot,
} from "@/services/admin.service";
import { deleteUpload } from "@/services/upload.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const { resource: slug, id } = await params;
  const resource = getResource(slug);
  if (!resource) return NextResponse.json({ ok: false, error: "Unknown resource." }, { status: 404 });

  const row = await modelFor(resource).findByPk(id);
  if (!row) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  return NextResponse.json({ ok: true, row: row.get({ plain: true }) });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const { resource: slug, id } = await params;
  const resource = getResource(slug);
  if (!resource) return NextResponse.json({ ok: false, error: "Unknown resource." }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected a JSON body." }, { status: 400 });
  }

  const model = modelFor(resource);
  const row = await model.findByPk(id);
  if (!row) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  // A page section's editable shape depends on its key, which the same request
  // may be changing — so resolve against the incoming value first.
  const fields = resolveFields(resource, { ...row.get({ plain: true }), ...body });

  const { values, errors } = buildPayload(resource, body, fields);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Optimistic lock: JSONB saves are read-modify-write, so a second editor
  // working from a stale copy would silently overwrite the first.
  const clientVersion = body.__updatedAt;
  const serverVersion = row.get("updatedAt") as Date | undefined;
  if (clientVersion && serverVersion && new Date(clientVersion as string).getTime() !== serverVersion.getTime()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Someone else saved this record while you were editing. Reload to get their changes, then reapply yours.",
        conflict: true,
      },
      { status: 409 }
    );
  }

  // Deep-cloned deliberately: row.get({ plain: true }) hands back the live
  // dataValues object when a model has no custom getters, so a plain reference
  // would mutate in step with the update and every diff would come out empty.
  const before = snapshot(row);

  try {
    await row.update(values);
    const after = row.get({ plain: true }) as Record<string, unknown>;

    await recordAudit({
      userId: user.id,
      action: "update",
      entity: resource.model,
      entityId: id,
      diff: diffOf(before, values),
    });
    revalidateSite();

    return NextResponse.json({ ok: true, row: after });
  } catch (err) {
    console.error(`[api/admin/${slug}/${id}] update`, err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message || "Could not save." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const { resource: slug, id } = await params;
  const resource = getResource(slug);
  if (!resource) return NextResponse.json({ ok: false, error: "Unknown resource." }, { status: 404 });

  if (!resource.canDelete) {
    return NextResponse.json(
      { ok: false, error: `${resource.label} records cannot be deleted.` },
      { status: 405 }
    );
  }

  const model = modelFor(resource);
  const row = await model.findByPk(id);
  if (!row) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  try {
    const removed = snapshot(row);

    // Media rows own a file on disk, so deleting the row alone would leave it
    // behind forever.
    if (resource.slug === "media") {
      await deleteUpload(id);
    } else {
      await row.destroy();
    }

    await recordAudit({
      userId: user.id,
      action: "delete",
      entity: resource.model,
      entityId: id,
      diff: removed,
    });
    revalidateSite();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[api/admin/${slug}/${id}] delete`, err);
    return NextResponse.json({ ok: false, error: "Could not delete." }, { status: 500 });
  }
}
