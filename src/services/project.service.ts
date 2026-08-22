import "server-only";
import { cache } from "react";
import { Project } from "@/models";
import type {
  ArchitectureLayer, GalleryItem, ProjectFeature, ProjectInfo, ProjectPoints,
} from "@/types/content";

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  role: string;
  category: string;
  problem: string;
  solution: string;
  outcome: string;
  description: string;
  overview: string;
  about: string;
  videoUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  techCard: string[];
  techDetail: string[];
  gallery: GalleryItem[];
  features: ProjectFeature[];
  architecture: ArchitectureLayer[];
  points: ProjectPoints;
  projectInfo: ProjectInfo;
  sortOrder: number;
}

const EMPTY_POINTS: ProjectPoints = { highlights: [], learnings: [], challenges: [] };

function toPlain(row: Project): ProjectData {
  const byOrder = <T extends { order?: number }>(a: T, b: T) => (a.order ?? 0) - (b.order ?? 0);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    role: row.role ?? "",
    category: row.category ?? "",
    problem: row.problem ?? "",
    solution: row.solution ?? "",
    outcome: row.outcome ?? "",
    description: row.description ?? "",
    overview: row.overview ?? "",
    about: row.about ?? "",
    videoUrl: row.videoUrl || null,
    githubUrl: row.githubUrl || null,
    demoUrl: row.demoUrl || null,
    techCard: row.techCard ?? [],
    techDetail: row.techDetail ?? [],
    gallery: (row.gallery ?? []).slice().sort(byOrder),
    features: (row.features ?? []).slice().sort(byOrder),
    architecture: (row.architecture ?? []).slice().sort(byOrder),
    points: { ...EMPTY_POINTS, ...(row.points ?? {}) },
    projectInfo: (row.projectInfo ?? {}) as ProjectInfo,
    sortOrder: row.sortOrder,
  };
}

export const getProjects = cache(async (): Promise<ProjectData[]> => {
  const rows = await Project.findAll({
    where: { isPublished: true },
    order: [["sortOrder", "ASC"]],
  });
  return rows.map(toPlain);
});

export const getFeaturedProjects = cache(async (): Promise<ProjectData[]> => {
  const rows = await Project.findAll({
    where: { isPublished: true, isFeatured: true },
    order: [["sortOrder", "ASC"]],
  });
  return rows.map(toPlain);
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectData | null> => {
  const row = await Project.findOne({ where: { slug, isPublished: true } });
  return row ? toPlain(row) : null;
});

export const getProjectSlugs = cache(async (): Promise<string[]> => {
  const rows = await Project.findAll({
    where: { isPublished: true },
    attributes: ["slug"],
    order: [["sortOrder", "ASC"]],
  });
  return rows.map((r) => r.slug);
});
