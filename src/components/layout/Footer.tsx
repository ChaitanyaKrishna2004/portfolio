import Link from "next/link";
import { getSiteSettings } from "@/services/site.service";

export async function Footer() {
  const site = await getSiteSettings();
  const footerLinks = site.navLinks.filter((l) => l.placement === "footer");

  return (
    <footer className="relative border-t border-border bg-background/50 backdrop-blur-sm pt-12 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-foreground hover:text-accent-coral transition-colors">
              {site.brandName}<span className="text-accent-violet">{site.brandSuffix}</span>
            </Link>
            <p className="text-sm text-foreground/60">
              {site.footerTagline}
            </p>
          </div>

          {footerLinks.length > 0 && (
            <nav className="flex items-center gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="text-sm text-foreground/50">
            &copy; {new Date().getFullYear()} {site.copyrightName}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
