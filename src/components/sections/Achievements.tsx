import { getSection } from "@/services/site.service";
import type { AchievementsContent } from "@/types/content";
import { AchievementsView } from "./AchievementsView";

export async function Achievements() {
  const section = await getSection<AchievementsContent>("achievements");

  return (
    <AchievementsView
      eyebrow={section.eyebrow ?? ""}
      title={section.title ?? ""}
      titleHighlight={section.titleHighlight ?? ""}
      description={section.description ?? ""}
      items={section.content.items ?? []}
    />
  );
}
