import { getSection } from "@/services/site.service";
import { getSkillCategories } from "@/services/skill.service";
import type { SkillsContent } from "@/types/content";
import { SkillsView } from "./SkillsView";

interface SkillsSectionContent extends SkillsContent {
  exploringLabel?: string;
  alsoWorkedLabel?: string;
}

export async function Skills() {
  const [section, categories] = await Promise.all([
    getSection<SkillsSectionContent>("skills"),
    getSkillCategories(),
  ]);

  return (
    <SkillsView
      eyebrow={section.eyebrow ?? ""}
      title={section.title ?? ""}
      titleHighlight={section.titleHighlight ?? ""}
      description={section.description ?? ""}
      categories={categories}
      tags={section.content.tags ?? []}
      exploringLabel={section.content.exploringLabel ?? "Currently Exploring"}
      alsoWorkedLabel={section.content.alsoWorkedLabel ?? "Also Worked With"}
    />
  );
}
