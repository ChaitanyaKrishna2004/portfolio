import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getResource, resolveFields } from "@/lib/adminSchema";
import {
  modelFor, buildPayload, recordAudit, revalidateSite,
} from "@/services/admin.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** List rows for a resource. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const { resource: slug } = await params;
  const resource = getResource(slug);
  if (!resource) return NextResponse.json({ ok: false, error: "Unknown resource." }, { status: 404 });

  try {
    const rows = await modelFor(resource).findAll({ order: resource.orderBy });
    return NextResponse.json({ ok: true, rows: rows.map((r) => r.get({ plain: true })) });
  } catch (err) {
    console.error(`[api/admin/${slug}]`, err);
    return NextResponse.json({ ok: false, error: "Could not load records." }, { status: 500 });
  }
}

/** Create a row. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const { resource: slug } = await params;
  const resource = getResource(slug);
  if (!resource) return NextResponse.json({ ok: false, error: "Unknown resource." }, { status: 404 });

  if (!resource.canCreate) {
    return NextResponse.json(
      { ok: false, error: `${resource.label} records cannot be created here.` },
      { status: 405 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected a JSON body." }, { status: 400 });
  }

  const { values, errors } = buildPayload(resource, body, resolveFields(resource, body));
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const row = await modelFor(resource).create(values);
    const id = row.get("id") as string;

    await recordAudit({
      userId: user.id,
      action: "create",
      entity: resource.model,
      entityId: id,
      diff: values,
    });
    revalidateSite();

    return NextResponse.json({ ok: true, id, row: row.get({ plain: true }) }, { status: 201 });
  } catch (err) {
    console.error(`[api/admin/${slug}] create`, err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message || "Could not create the record." },
      { status: 500 }
    );
  }
}
