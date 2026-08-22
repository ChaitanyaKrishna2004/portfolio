import { getSection } from "@/services/site.service";
import { getExperiences } from "@/services/experience.service";
import type { ExperienceContent } from "@/types/content";
import { ExperienceView } from "./ExperienceView";

export async function Experience() {
  const [section, experiences] = await Promise.all([
    getSection<ExperienceContent>("experience"),
    getExperiences(),
  ]);

  return (
    <ExperienceView
      eyebrow={section.eyebrow ?? ""}
      title={section.title ?? ""}
      titleHighlight={section.titleHighlight ?? ""}
      description={section.description ?? ""}
      experiences={experiences}
      content={section.content}
    />
  );
}
