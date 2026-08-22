import { getSection, getSiteSettings, getSocialLinks } from "@/services/site.service";
import type { HeroContent } from "@/types/content";
import { HeroView } from "./HeroView";

export async function Hero() {
  const [section, site, socials] = await Promise.all([
    getSection<HeroContent>("hero"),
    getSiteSettings(),
    getSocialLinks("hero"),
  ]);

  return (
    <HeroView
      title={section.title ?? ""}
      description={section.description ?? ""}
      availabilityText={site.availabilityText}
      photoUrl={site.profilePhotoUrl}
      content={section.content}
      socials={socials}
      primaryCta={site.buttons["hero.viewProjects"] ?? { label: "View Projects", href: "#projects" }}
      resumeCta={site.buttons["hero.resume"] ?? { label: "Resume", href: site.resumeUrl }}
    />
  );
}
