import "server-only";
import { cache } from "react";
import { SkillCategory } from "@/models";
import type { SkillItem } from "@/types/content";

export interface SkillCategoryData {
  id: string;
  name: string;
  slug: string;
  skills: SkillItem[];
  isDefault: boolean;
}

export const getSkillCategories = cache(async (): Promise<SkillCategoryData[]> => {
  const rows = await SkillCategory.findAll({
    where: { isVisible: true },
    order: [["sortOrder", "ASC"]],
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    skills: (r.skills ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    isDefault: r.isDefault,
  }));
});
