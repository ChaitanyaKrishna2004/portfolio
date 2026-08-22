"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Icon } from "@/lib/iconRegistry";
import type { ButtonDef, ProjectsContent } from "@/types/content";
import type { ProjectData } from "@/services/project.service";

export function ProjectsView({
  eyebrow,
  title,
  titleHighlight,
  description,
  projects,
  labels,
  demoBtn,
  sourceBtn,
  detailsBtn,
}: {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  projects: ProjectData[];
  labels: ProjectsContent;
  demoBtn: ButtonDef;
  sourceBtn: ButtonDef;
  detailsBtn: ButtonDef;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${Math.max(0, projects.length - 1) * 100}vw`]
  );

  return (
    <section
      ref={targetRef}
      id="projects"
      className="relative"
      style={{ height: `${Math.max(1, projects.length) * 100}vh` }}
    >
      <div className="sticky top-0 flex flex-col h-screen overflow-hidden pt-0 pb-4">
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute -top-[20%] left-[20%] h-[70vw] max-h-[500px] w-[70vw] max-w-[500px] rounded-full bg-accent-violet/20 blur-[100px] lg:blur-[150px]" />
        </div>

        <div className="shrink-0 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-24 relative z-20 mb-4 sm:mb-8 pointer-events-none">
          <div className="flex flex-col text-center items-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-accent-violet mb-2 sm:mb-4"
            >
              {eyebrow}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 sm:mb-4"
            >
              {title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral via-accent-pink to-accent-violet">
                {titleHighlight}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs sm:text-base md:text-lg text-foreground/60 max-w-xl"
            >
              {description}
            </motion.p>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative z-10 w-full">
          <motion.div style={{ x }} className="flex h-full items-center">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex h-full w-[100vw] shrink-0 items-center justify-center px-4 sm:px-12 lg:px-24 box-border"
              >
                <div className="glass-panel relative z-10 flex h-[95%] lg:h-[90%] max-h-[500px] lg:max-h-[650px] w-full max-w-[1200px] flex-col overflow-hidden rounded-3xl lg:flex-row">
                  <div className="relative h-[35%] sm:h-[40%] lg:h-auto lg:flex-1 bg-foreground/5 border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-8 flex items-center justify-center shrink-0">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl group">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-coral/20 to-accent-violet/20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0 z-10 pointer-events-none" />
                      {project.videoUrl ? (
                        <video
                          src={project.videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-start lg:justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto lg:overflow-hidden pointer-events-auto">
                    <div className="mb-2 text-xs sm:text-sm font-semibold tracking-wider text-accent-violet uppercase shrink-0">
                      {project.role}
                    </div>
                    <h3 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold shrink-0">{project.title}</h3>

                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 shrink-0">
                      <div>
                        <h4 className="text-foreground/60 text-xs sm:text-sm font-medium mb-1">{labels.problemLabel}</h4>
                        <p className="text-foreground/80 text-sm sm:text-base">{project.problem}</p>
                      </div>
                      <div className="hidden sm:block">
                        <h4 className="text-foreground/60 text-xs sm:text-sm font-medium mb-1">{labels.solutionLabel}</h4>
                        <p className="text-foreground/80 text-sm sm:text-base">{project.solution}</p>
                      </div>
                      <div>
                        <h4 className="text-foreground/60 text-xs sm:text-sm font-medium mb-1">{labels.outcomeLabel}</h4>
                        <p className="text-accent-coral font-medium text-sm sm:text-base">{project.outcome}</p>
                      </div>
                    </div>

                    <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 shrink-0">
                      {project.techCard.map((tech) => (
                        <span key={tech} className="rounded-full bg-foreground/10 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-foreground/90">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-wrap gap-3 sm:gap-4 shrink-0">
                      <a
                        href={project.demoUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 lg:flex-none"
                      >
                        <MagneticButton className="w-full">
                          <Icon name={demoBtn.icon} className="h-4 w-4" /> {demoBtn.label}
                        </MagneticButton>
                      </a>
                      <a
                        href={project.githubUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 lg:flex-none"
                      >
                        <MagneticButton className="w-full bg-transparent hover:bg-foreground/5 border border-foreground/10">
                          <Icon name={sourceBtn.icon} className="h-4 w-4" /> {sourceBtn.label}
                        </MagneticButton>
                      </a>
                      <Link href={`/projects/${project.slug}`} className="w-full sm:w-auto sm:ml-auto block">
                        <MagneticButton className="w-full bg-accent-violet text-white hover:bg-accent-violet/90">
                          {detailsBtn.label} <Icon name={detailsBtn.icon} className="h-4 w-4 ml-1" />
                        </MagneticButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
