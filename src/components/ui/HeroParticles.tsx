"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-normal">
      
      {/* --- Animated Aurora / Mesh Gradient Background --- */}
      {/* Peach Blob */}
      <motion.div
        animate={{
          x: ["0%", "10%", "-5%", "0%"],
          y: ["0%", "-10%", "5%", "0%"],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#ffb38a]/30 dark:bg-[#ffd8c4]/10 blur-[100px] sm:blur-[140px]"
      />

      {/* Lavender Blob */}
      <motion.div
        animate={{
          x: ["0%", "-10%", "10%", "0%"],
          y: ["0%", "10%", "-10%", "0%"],
          scale: [1, 1.05, 1.15, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#c0a3ff]/30 dark:bg-[#e6d8ff]/10 blur-[100px] sm:blur-[140px]"
      />

      {/* Warm Pink Blob */}
      <motion.div
        animate={{
          x: ["0%", "5%", "-10%", "0%"],
          y: ["0%", "10%", "-5%", "0%"],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-[#ff8ab3]/25 dark:bg-[#ffc4d9]/10 blur-[120px] sm:blur-[150px]"
      />

      {/* Soft Purple Blob */}
      <motion.div
        animate={{
          x: ["0%", "-15%", "5%", "0%"],
          y: ["0%", "-5%", "15%", "0%"],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#a38aff]/20 dark:bg-[#d0c4ff]/10 blur-[100px] sm:blur-[130px]"
      />

      {/* --- Subtle Spotlight Sweep --- */}
      {/* A very soft angled sweep passing across the screen every 10 seconds */}
      {/* In light mode, this acts like a very subtle moving shadow, in dark mode like a light */}
      <motion.div
        animate={{
          x: ["-200vw", "200vw"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[-50%] w-[100vw] h-[200vh] rotate-45 bg-gradient-to-r from-transparent via-foreground/[0.04] dark:via-white/[0.05] to-transparent blur-[80px]"
      />
      
      {/* Optional second sweep with a delay for layered effect */}
      <motion.div
        animate={{
          x: ["-200vw", "200vw"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
          delay: 4,
        }}
        className="absolute top-[-50%] w-[150vw] h-[200vh] rotate-[60deg] bg-gradient-to-r from-transparent via-foreground/[0.02] dark:via-white/[0.03] to-transparent blur-[100px]"
      />
    </div>
  );
}
