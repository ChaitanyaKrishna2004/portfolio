"use client";

import { motion, Variants } from "framer-motion";
import { Award, BookOpen, ShieldCheck } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

export function Achievements() {
  return (
    <section className="relative pt-4 sm:pt-6 pb-8 sm:pb-12 overflow-hidden w-full max-w-[100vw] box-border">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-accent-coral/20 via-accent-violet/20 to-accent-pink/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-24 box-border relative z-10">
        
        {/* Centered Header */}
        <div className="flex flex-col text-center items-center mb-16 sm:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-accent-coral mb-2 sm:mb-4"
          >
            ACHIEVEMENTS
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 sm:mb-4"
          >
            Milestones & <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral via-accent-pink to-accent-violet">Accolades.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto"
          >
            A track record of continuous learning, certifications, and problem-solving.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {/* CEH Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-panel p-8 sm:p-10 rounded-[2rem] relative overflow-hidden group cursor-pointer border border-white/10 dark:border-white/5 hover:border-accent-coral/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-coral/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12">
              <ShieldCheck className="w-32 h-32 text-accent-coral" />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-accent-coral/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-8 h-8 text-accent-coral" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-accent-coral transition-colors duration-300">CEHv12 Certified</h3>
              <p className="text-foreground/70 mb-6 text-sm leading-relaxed">Certified Ethical Hacker with a score of 92%, demonstrating deep understanding of modern security vectors.</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-coral/10 text-xs font-semibold text-accent-coral">
                Top 8% Percentile
              </div>
            </div>
          </motion.div>

          {/* Paper Publication */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-panel p-8 sm:p-10 rounded-[2rem] relative overflow-hidden group cursor-pointer border border-white/10 dark:border-white/5 hover:border-accent-violet/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12">
              <BookOpen className="w-32 h-32 text-accent-violet" />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-accent-violet/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="w-8 h-8 text-accent-violet" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-accent-violet transition-colors duration-300">Published Author</h3>
              <p className="text-foreground/70 mb-6 text-sm leading-relaxed">Co-authored a comprehensive paper on advanced web application security assessment techniques.</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-violet/10 text-xs font-semibold text-accent-violet">
                Research & Security
              </div>
            </div>
          </motion.div>

          {/* LeetCode */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-panel p-8 sm:p-10 rounded-[2rem] relative overflow-hidden group cursor-pointer border border-white/10 dark:border-white/5 hover:border-foreground/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
              <Award className="w-32 h-32 text-foreground" />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Award className="w-8 h-8 text-foreground/80" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-foreground/90 transition-colors duration-300">Problem Solver</h3>
              <p className="text-foreground/70 mb-6 text-sm leading-relaxed">Solved 250+ algorithmic and data structure problems, consistently improving logic and efficiency.</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 text-xs font-semibold text-foreground/70">
                LeetCode
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
