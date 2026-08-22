"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { ButtonDef, NavLink } from "@/types/content";

export function NavbarView({
  brandName,
  brandSuffix,
  links,
  backButton,
}: {
  brandName: string;
  brandSuffix: string;
  links: NavLink[];
  backButton: ButtonDef | null;
}) {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-6 px-4 sm:px-6 md:px-12 pointer-events-none w-full max-w-[100vw] box-border"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-tighter text-foreground hover:text-accent-coral transition-colors shrink-0">
            {brandName}<span className="text-accent-violet">{brandSuffix}</span>
          </Link>

          {pathname.startsWith("/projects/") && backButton && (
            <Link
              href={backButton.href ?? "/#projects"}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-accent-coral transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {backButton.label}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <nav className="glass-panel px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-3 sm:gap-6 shadow-2xl shrink-0">
            {links.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  className={`text-xs sm:text-sm font-medium transition-colors hover:text-foreground relative ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-coral rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
