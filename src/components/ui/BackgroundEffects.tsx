"use client";

import { motion } from "framer-motion";

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
      {/* 
        We use framer-motion to create slow-moving, subtle glowing orbs.
        The palette is warm and sophisticated: Cream, Peach, Coral, Lavender, and Violet.
      */}
      
      {/* Left Blob - Soft Peach / Apricot Glow */}
      <motion.div
        animate={{
          x: [0, 40, 0, -30, 0],
          y: [0, 20, -10, 15, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[5%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-orange-200/30 dark:bg-orange-900/20 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] sm:blur-[140px] opacity-70"
      />

      {/* Right Blob - Lavender / Violet Glow */}
      <motion.div
        animate={{
          x: [0, -30, 15, -10, 0],
          y: [0, -20, 30, -15, 0],
          scale: [1, 1.15, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[0%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-300/30 dark:bg-purple-900/30 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] sm:blur-[140px] opacity-70"
      />

      {/* Center Blob - Warm Cream / Beige */}
      <motion.div
        animate={{
          x: [0, -10, 20, -15, 0],
          y: [0, 30, -15, 20, 0],
          scale: [1, 1.2, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[25%] left-[25%] w-[50vw] h-[50vw] rounded-full bg-[#fdf5e6]/40 dark:bg-[#3e2723]/20 mix-blend-multiply dark:mix-blend-screen filter blur-[120px] sm:blur-[160px] opacity-50"
      />

      {/* Bottom Blob - Coral / Rose-Pink Ambient */}
      <motion.div
        animate={{
          x: [0, 30, -20, 25, 0],
          y: [0, -30, 15, -10, 0],
          scale: [1, 1.1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -bottom-[20%] left-[15%] w-[60vw] h-[60vw] rounded-full bg-rose-300/20 dark:bg-rose-900/20 mix-blend-multiply dark:mix-blend-screen filter blur-[120px] sm:blur-[150px] opacity-60"
      />
      
      {/* Subtle Hint of Soft Orange for Depth */}
      <motion.div
        animate={{
          x: [0, -20, 30, -20, 0],
          y: [0, 40, -10, 20, 0],
          scale: [1, 1.2, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[40%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-orange-300/20 dark:bg-amber-700/10 mix-blend-multiply dark:mix-blend-screen filter blur-[110px] opacity-40"
      />
    </div>
  );
}
