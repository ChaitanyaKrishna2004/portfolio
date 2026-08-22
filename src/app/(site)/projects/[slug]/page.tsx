import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/services/project.service";
import { getSiteSettings } from "@/services/site.service";
import { ProjectDetailView } from "./ProjectDetailView";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Projects`,
    description: project.description,
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [project, site] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);

  if (!project) notFound();

  return <ProjectDetailView project={project} labels={site.uiTexts} />;
}
