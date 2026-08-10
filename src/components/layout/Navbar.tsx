"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-6 px-4 sm:px-6 md:px-12 pointer-events-none w-full max-w-[100vw] box-border"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        <Link href="/" className="text-lg sm:text-xl font-bold tracking-tighter text-foreground hover:text-accent-coral transition-colors shrink-0">
          Chaitanya<span className="text-accent-violet">.</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <nav className="glass-panel px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-3 sm:gap-6 shadow-2xl shrink-0">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs sm:text-sm font-medium transition-colors hover:text-foreground relative ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  {link.name}
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
