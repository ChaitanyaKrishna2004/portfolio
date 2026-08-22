import { NextResponse } from "next/server";
import { getProjects } from "@/services/project.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ ok: true, count: projects.length, projects });
  } catch (err) {
    console.error("[api/projects]", err);
    return NextResponse.json({ ok: false, error: "Could not load projects." }, { status: 500 });
  }
}
