"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full border border-border bg-foreground/5" />; // Skeleton placeholder
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background transition-colors hover:bg-foreground/5 hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent-coral overflow-hidden group"
      aria-label="Toggle theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative z-10">
        <Sun 
          className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 text-foreground ${
            isDark ? "-rotate-90 scale-0 absolute" : "rotate-0 scale-100"
          }`} 
        />
        <Moon 
          className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 text-foreground ${
            isDark ? "rotate-0 scale-100" : "rotate-90 scale-0 absolute"
          }`} 
        />
      </div>
      
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent-coral/10 to-accent-violet/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
    </motion.button>
  );
}
