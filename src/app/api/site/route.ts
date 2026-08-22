import { NextResponse } from "next/server";
import { getAllSections, getSiteSettings } from "@/services/site.service";
import { getSkillCategories } from "@/services/skill.service";
import { getExperiences } from "@/services/experience.service";

export const runtime = "nodejs";

/** Everything the CMS needs to render its edit forms, in one call. */
export async function GET() {
  try {
    const [settings, sections, skills, experiences] = await Promise.all([
      getSiteSettings(),
      getAllSections(),
      getSkillCategories(),
      getExperiences(),
    ]);

    return NextResponse.json({ ok: true, settings, sections, skills, experiences });
  } catch (err) {
    console.error("[api/site]", err);
    return NextResponse.json({ ok: false, error: "Could not load site content." }, { status: 500 });
  }
}
