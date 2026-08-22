import { getSection, getSiteSettings, text } from "@/services/site.service";
import type { AboutContent } from "@/types/content";
import { AboutView } from "./AboutView";

export async function About() {
  const [section, site] = await Promise.all([
    getSection<AboutContent>("about"),
    getSiteSettings(),
  ]);

  return (
    <AboutView
      eyebrow={section.eyebrow ?? ""}
      title={section.title ?? ""}
      titleHighlight={section.titleHighlight ?? ""}
      description={section.description ?? ""}
      journeyLabel={text(site.uiTexts, "about.journeyLabel", "MY JOURNEY")}
      content={section.content}
    />
  );
}
