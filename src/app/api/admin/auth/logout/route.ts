import { NextResponse } from "next/server";
import { getCurrentUser, destroyCurrentSession } from "@/lib/auth";
import { recordAudit } from "@/services/admin.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getCurrentUser();
    await destroyCurrentSession();

    if (user) {
      await recordAudit({ userId: user.id, action: "logout", entity: "AdminUser", entityId: user.id });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/auth/logout]", err);
    return NextResponse.json({ ok: false, error: "Could not sign out." }, { status: 500 });
  }
}
