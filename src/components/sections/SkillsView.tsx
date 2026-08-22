"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView,
} from "framer-motion";
import { Sparkles } from "lucide-react";
import { Icon } from "@/lib/iconRegistry";
import type { SkillItem, SkillTag } from "@/types/content";

export interface SkillCategoryProp {
  name: string;
  slug: string;
  skills: SkillItem[];
  isDefault: boolean;
}

export function SkillsView({
  eyebrow,
  title,
  titleHighlight,
  description,
  categories,
  tags,
  exploringLabel,
  alsoWorkedLabel,
  cycleMs = 1500,
}: {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  categories: SkillCategoryProp[];
  tags: SkillTag[];
  exploringLabel: string;
  alsoWorkedLabel: string;
  cycleMs?: number;
}) {
  const names = categories.map((c) => c.name);
  const defaultName = categories.find((c) => c.isDefault)?.name ?? names[0] ?? "";

  const [activeCategory, setActiveCategory] = useState(defaultName);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Only start cycling once the Skills section is actually on screen.
  const isInView = useInView(sectionRef, { amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;
    const index = names.indexOf(activeCategory);
    const activeTab = tabsRef.current[index];
    activeTab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeCategory, isInView, names]);

  useEffect(() => {
    if (!isAutoPlaying || !isInView || names.length < 2) return;

    const interval = setInterval(() => {
      setActiveCategory((prev) => {
        const currentIndex = names.indexOf(prev);
        return names[(currentIndex + 1) % names.length];
      });
    }, cycleMs);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isInView, names, cycleMs]);

  // Parallax tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const parallaxX1 = useTransform(smoothX, [-1, 1], [-15, 15]);
  const parallaxY1 = useTransform(smoothY, [-1, 1], [-15, 15]);
  const parallaxX2 = useTransform(smoothX, [-1, 1], [15, -15]);
  const parallaxY2 = useTransform(smoothY, [-1, 1], [15, -15]);
  const glowX = useTransform(smoothX, [-1, 1], [-50, 50]);
  const glowY = useTransform(smoothY, [-1, 1], [-50, 50]);
  const coreX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const coreY = useTransform(smoothY, [-1, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setIsAutoPlaying(false);
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left - width / 2) / (width / 2));
    mouseY.set((e.clientY - top - height / 2) / (height / 2));
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
    mouseX.set(0);
    mouseY.set(0);
  };

  const activeSkills = categories.find((c) => c.name === activeCategory)?.skills ?? [];
  const exploring = tags.filter((t) => t.group === "exploring");
  const alsoWorked = tags.filter((t) => t.group === "also_worked");

  return (
    <section ref={sectionRef} className="relative pt-4 pb-24 sm:pt-6 sm:pb-32 w-full max-w-[100vw] box-border overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 box-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <span className="text-accent-coral font-bold tracking-widest text-xs sm:text-sm mb-6 block uppercase">{eyebrow}</span>
          <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            {title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral to-accent-violet">
              {titleHighlight}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl font-medium mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mb-16">
          {/* Filter navigation */}
          <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {categories.map((category, index) => {
              const isActive = activeCategory === category.name;
              return (
                <button
                  key={category.slug}
                  ref={(el) => {
                    tabsRef.current[index] = el;
                  }}
                  onClick={() => {
                    setActiveCategory(category.name);
                    setIsAutoPlaying(false);
                  }}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  className={`relative flex items-center px-5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap lg:whitespace-normal text-left ${
                    isActive
                      ? "text-foreground shadow-lg scale-[1.02] bg-foreground/[0.03]"
                      : "text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.02]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 rounded-xl glass-panel border border-foreground/10 dark:border-white/20 bg-gradient-to-r from-accent-coral/10 to-accent-violet/10"
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />
                  )}
                  <span className={`w-2 h-2 rounded-full mr-3 shrink-0 transition-colors duration-300 ${isActive ? "bg-accent-coral shadow-[0_0_8px_rgba(255,127,80,0.8)]" : "bg-transparent"}`} />
                  <span className="relative z-10">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive skill ecosystem */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex-1 w-full min-h-[400px] lg:min-h-[500px] max-h-[500px] lg:max-h-[600px] rounded-3xl glass-panel border border-foreground/5 dark:border-white/5 bg-background/30 overflow-visible flex items-center justify-center"
          >
            <div className="relative w-full max-w-[400px] lg:max-w-[500px] aspect-square">
              <motion.div
                style={{ x: glowX, y: glowY }}
                className="absolute top-1/2 left-1/2 w-3/4 h-3/4 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-accent-coral/10 to-accent-violet/10 rounded-full blur-[100px] pointer-events-none"
              />

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <AnimatePresence>
                  {activeSkills.map((skill, index) => {
                    const angle = (index / activeSkills.length) * Math.PI * 2;
                    const radius = 35;
                    const x = 50 + Math.cos(angle) * radius;
                    const y = 50 + Math.sin(angle) * radius;
                    const midX = (50 + x) / 2;
                    const midY = (50 + y) / 2;
                    const offset = 8;
                    const cpX = (midX - Math.sin(angle) * offset).toFixed(2);
                    const cpY = (midY + Math.cos(angle) * offset).toFixed(2);

                    return (
                      <motion.path
                        key={`line-${activeCategory}-${skill.name}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        d={`M 50 50 Q ${cpX} ${cpY} ${x.toFixed(2)} ${y.toFixed(2)}`}
                        stroke="url(#lineGradient)"
                        strokeWidth="0.3"
                        fill="none"
                        className="text-foreground/40 dark:text-white/30"
                      />
                    );
                  })}
                </AnimatePresence>
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Central core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <motion.div
                  style={{ x: coreX, y: coreY }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="group glass-panel px-6 sm:px-8 py-4 sm:py-5 rounded-2xl border border-foreground/10 dark:border-white/20 bg-background/80 shadow-[0_0_40px_rgba(255,127,80,0.1)] backdrop-blur-xl flex items-center justify-center hover:shadow-[0_0_60px_rgba(157,78,221,0.2)] transition-shadow duration-500 cursor-default">
                    <span className="font-bold tracking-widest text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-accent-coral to-accent-violet">
                      {activeCategory.replace(/^✦\s*/, "").toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Orbiting nodes */}
              <AnimatePresence>
                {activeSkills.map((skill, index) => {
                  const angle = (index / activeSkills.length) * Math.PI * 2;
                  const radius = 35;
                  const x = (50 + Math.cos(angle) * radius).toFixed(2);
                  const y = (50 + Math.sin(angle) * radius).toFixed(2);
                  const isLeft = parseFloat(x) < 50;

                  return (
                    <motion.div
                      key={`node-${activeCategory}-${skill.name}`}
                      initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%", left: "50%", top: "50%" }}
                      animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%", left: `${x}%`, top: `${y}%` }}
                      exit={{ opacity: 0, scale: 0, x: "-50%", y: "-50%", left: "50%", top: "50%", transition: { duration: 0.4 } }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                      className="absolute z-40"
                    >
                      <motion.div
                        style={{
                          x: index % 2 === 0 ? parallaxX1 : parallaxX2,
                          y: index % 2 === 0 ? parallaxY1 : parallaxY2,
                        }}
                      >
                        <motion.div
                          animate={{ y: [-4, 4, -4] }}
                          transition={{ duration: 5 + (index % 3), delay: index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                          className="group relative"
                        >
                          <div
                            tabIndex={0}
                            className="w-12 h-12 sm:w-14 sm:h-14 glass-panel rounded-full flex items-center justify-center border border-foreground/10 dark:border-white/20 bg-background/70 shadow-lg text-2xl text-foreground/80 hover:text-accent-coral hover:border-accent-coral/50 focus:text-accent-coral focus:border-accent-coral/50 transition-colors duration-300 hover:scale-110 focus:scale-110 outline-none cursor-pointer"
                          >
                            <Icon name={skill.icon} className="w-6 h-6" />
                          </div>

                          <div
                            className={`absolute top-1/2 -translate-y-1/2 ${
                              isLeft ? "left-full ml-4 translate-x-[-10px]" : "right-full mr-4 translate-x-[10px]"
                            } px-3 py-1.5 bg-foreground text-background text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 shadow-xl whitespace-nowrap pointer-events-none group-hover:translate-x-0 group-focus-within:translate-x-0 z-50`}
                          >
                            <span className="block mb-0.5 text-accent-coral/80 text-[10px] uppercase tracking-wider">{skill.name}</span>
                            {skill.tooltip}
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 border-4 border-transparent ${
                                isLeft ? "-left-1 border-r-foreground" : "-right-1 border-l-foreground"
                              }`}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Secondary tag rows */}
        <div className="flex flex-col md:flex-row justify-center gap-12 sm:gap-16 lg:gap-32 w-full max-w-4xl mx-auto border-t border-foreground/5 dark:border-white/5 pt-12">
          <div className="flex flex-col items-center flex-1">
            <span className="text-xs font-bold tracking-widest uppercase text-foreground/60 mb-6 flex items-center gap-2">
              {exploringLabel} <Sparkles className="w-3 h-3 text-accent-violet" />
            </span>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {exploring.map((tag) => (
                <div key={tag.name} className="flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/10 bg-foreground/5 text-xs font-semibold text-foreground hover:bg-foreground/10 hover:border-accent-violet/30 transition-colors cursor-default shadow-sm">
                  {tag.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center flex-1">
            <span className="text-xs font-bold tracking-widest uppercase text-foreground/60 mb-6">{alsoWorkedLabel}</span>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {alsoWorked.map((tag) => (
                <div key={tag.name} className="flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/10 bg-foreground/5 text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-colors cursor-default shadow-sm">
                  {tag.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
