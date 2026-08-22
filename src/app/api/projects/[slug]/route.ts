import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/services/project.service";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json({ ok: false, error: "No project with that slug." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, project });
  } catch (err) {
    console.error("[api/projects/:slug]", err);
    return NextResponse.json({ ok: false, error: "Could not load the project." }, { status: 500 });
  }
}
