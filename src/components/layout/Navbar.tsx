import { getSiteSettings } from "@/services/site.service";
import { NavbarView } from "./NavbarView";

export async function Navbar() {
  const site = await getSiteSettings();

  return (
    <NavbarView
      brandName={site.brandName}
      brandSuffix={site.brandSuffix}
      links={site.navLinks.filter((l) => l.placement === "navbar")}
      backButton={site.buttons["navbar.backToProjects"] ?? null}
    />
  );
}
