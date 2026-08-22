import { NextRequest, NextResponse } from "next/server";
import { createMessage } from "@/services/contact.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected a JSON body." }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    null;

  try {
    const result = await createMessage(body, {
      ip,
      userAgent: req.headers.get("user-agent"),
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json(
      { ok: false, error: "Could not save your message. Please try again." },
      { status: 500 }
    );
  }
}
