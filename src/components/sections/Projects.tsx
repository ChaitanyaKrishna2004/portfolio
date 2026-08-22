import { getSection, getSiteSettings } from "@/services/site.service";
import { getFeaturedProjects } from "@/services/project.service";
import type { ProjectsContent } from "@/types/content";
import { ProjectsView } from "./ProjectsView";

export async function Projects() {
  const [section, site, projects] = await Promise.all([
    getSection<ProjectsContent>("projects"),
    getSiteSettings(),
    getFeaturedProjects(),
  ]);

  return (
    <ProjectsView
      eyebrow={section.eyebrow ?? ""}
      title={section.title ?? ""}
      titleHighlight={section.titleHighlight ?? ""}
      description={section.description ?? ""}
      projects={projects}
      labels={{
        problemLabel: section.content.problemLabel ?? "The Problem",
        solutionLabel: section.content.solutionLabel ?? "The Solution",
        outcomeLabel: section.content.outcomeLabel ?? "Measurable Outcome",
      }}
      demoBtn={site.buttons["project.liveDemo"] ?? { label: "Live Demo", icon: "ExternalLink" }}
      sourceBtn={site.buttons["project.source"] ?? { label: "Source", icon: "FaGithub" }}
      detailsBtn={site.buttons["project.details"] ?? { label: "Project Details", icon: "ArrowRight" }}
    />
  );
}
