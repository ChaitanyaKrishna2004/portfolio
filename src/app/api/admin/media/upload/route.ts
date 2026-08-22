import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveUpload, UploadError } from "@/services/upload.service";
import { recordAudit, revalidateSite } from "@/services/admin.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected a file upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file was attached." }, { status: 400 });
  }

  try {
    const media = await saveUpload(file, {
      altText: (form.get("altText") as string) ?? "",
      folder: (form.get("folder") as string) ?? "",
      uploadedBy: user.id,
    });

    await recordAudit({
      userId: user.id,
      action: "create",
      entity: "Media",
      entityId: media.id,
      diff: { url: media.url, bytes: media.bytes },
    });
    revalidateSite();

    return NextResponse.json({ ok: true, media }, { status: 201 });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 422 });
    }
    console.error("[api/admin/media/upload]", err);
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
