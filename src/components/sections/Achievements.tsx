"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, ShieldCheck } from "lucide-react";

export function Achievements() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden w-full max-w-[100vw] box-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-24 box-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:w-1/2"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Milestones & <span className="text-accent-coral">Accolades</span>
          </h2>
          <p className="text-foreground/60 text-lg">
            A track record of continuous learning, certifications, and problem-solving.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* CEH Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="glass-panel p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-coral/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <ShieldCheck className="w-12 h-12 text-accent-coral mb-6" />
            <h3 className="text-2xl font-bold mb-2">CEHv12 Certified</h3>
            <p className="text-foreground/70 mb-4">Certified Ethical Hacker with a score of 92%.</p>
            <div className="text-sm font-medium text-accent-coral">Top 8% Percentile</div>
          </motion.div>

          {/* Paper Publication */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-panel p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <BookOpen className="w-12 h-12 text-accent-violet mb-6" />
            <h3 className="text-2xl font-bold mb-2">Published Author</h3>
            <p className="text-foreground/70 mb-4">Co-authored a paper on web application security assessment techniques.</p>
            <div className="text-sm font-medium text-accent-violet">Research & Security</div>
          </motion.div>

          {/* LeetCode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="glass-panel p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <Award className="w-12 h-12 text-foreground mb-6" />
            <h3 className="text-2xl font-bold mb-2">Problem Solver</h3>
            <p className="text-foreground/70 mb-4">Solved 250+ algorithmic and data structure problems.</p>
            <div className="text-sm font-medium text-foreground">LeetCode</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
