"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background/50 backdrop-blur-sm pt-12 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-foreground hover:text-accent-coral transition-colors">
              Chaitanya<span className="text-accent-violet">.</span>
            </Link>
            <p className="text-sm text-foreground/60">
              Crafting beautiful digital products.
            </p>
          </div>
          
          <div className="text-sm text-foreground/50">
            &copy; {new Date().getFullYear()} Paruchuri Chaitanya Krishna. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
