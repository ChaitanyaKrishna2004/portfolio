import { getSection, getSiteSettings, getSocialLinks } from "@/services/site.service";
import type { ContactContent } from "@/types/content";
import { ContactView } from "./ContactView";

export async function Contact() {
  const [section, site, socials] = await Promise.all([
    getSection<ContactContent>("contact"),
    getSiteSettings(),
    getSocialLinks("contact"),
  ]);

  return (
    <ContactView
      eyebrow={section.eyebrow ?? ""}
      title={section.title ?? ""}
      titleHighlight={section.titleHighlight ?? ""}
      description={section.description ?? ""}
      content={section.content}
      socials={socials}
      submitBtn={site.buttons["contact.send"] ?? { label: "Send Message", icon: "Send" }}
    />
  );
}
