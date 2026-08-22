import "server-only";
import { cache } from "react";
import { Experience } from "@/models";

export interface ExperienceData {
  id: string;
  role: string;
  company: string;
  companyUrl: string | null;
  duration: string;
  impact: string;
  points: string[];
  stack: string[];
  isCurrent: boolean;
}

export const getExperiences = cache(async (): Promise<ExperienceData[]> => {
  const rows = await Experience.findAll({ order: [["sortOrder", "ASC"]] });

  return rows.map((r) => ({
    id: r.id,
    role: r.role,
    company: r.company,
    companyUrl: r.companyUrl,
    duration: r.duration ?? "",
    impact: r.impact ?? "",
    points: r.points ?? [],
    stack: r.stack ?? [],
    isCurrent: r.isCurrent,
  }));
});
