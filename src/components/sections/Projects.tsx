"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { MagneticButton } from "@/components/ui/MagneticButton";

const PROJECTS = [
  {
    title: "DevTinder",
    role: "Full Stack Developer Networking Platform",
    problem: "Developers needed a streamlined platform to find co-founders, mentors, and collaborators based on specific tech stacks and interests.",
    solution: "Built a swipe/request-based matching platform with robust REST APIs, achieving 99% uptime and low-latency matches.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "AWS EC2"],
    outcome: "Successfully matched hundreds of developers with 99% platform uptime.",
    github: "#",
    demo: "#",
  },
  {
    title: "ClickCart",
    role: "Full Stack E-Commerce Platform",
    problem: "Small businesses needed an out-of-the-box e-commerce solution with integrated RBAC admin panels.",
    solution: "Developed a comprehensive platform featuring cart, secure checkout, order history, and a role-based admin dashboard.",
    stack: ["React.js", "Node.js", "Express.js", "MS SQL Server"],
    outcome: "Reduced manual order processing time by integrating an automated checkout pipeline.",
    github: "#",
    demo: "#",
  },
  {
    title: "Food Ordering Web App",
    role: "Frontend Engineer",
    problem: "Users experienced slow load times and janky UI while searching for restaurants.",
    solution: "Implemented Shimmer UI for loading states, optimized search/filtering with Redux Toolkit, and wrote comprehensive Jest tests.",
    stack: ["React.js", "Redux Toolkit", "Tailwind CSS", "Jest"],
    outcome: "Improved perceived performance and established a bug-free critical path.",
    github: "#",
    demo: "#",
  },
];

export function Projects() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Convert vertical scroll to horizontal scroll
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(PROJECTS.length - 1) * 100}vw`]);

  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Background gradient hint */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute -top-[20%] left-[20%] h-[70vw] max-h-[500px] w-[70vw] max-w-[500px] rounded-full bg-accent-violet/20 blur-[100px] lg:blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-24 absolute left-0 top-12 z-20 w-full lg:top-24 box-border">
          <motion.h2 
            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured <span className="text-accent-coral">Work</span>
          </motion.h2>
        </div>

        <motion.div style={{ x }} className="flex">
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              className="flex h-[100dvh] w-[100vw] shrink-0 items-center justify-center p-4 sm:p-12 lg:p-24 box-border"
            >
              <div className="glass-panel relative z-10 flex h-[80%] lg:h-full max-h-[800px] w-full max-w-[1200px] flex-col overflow-hidden rounded-3xl lg:flex-row mt-16 lg:mt-0">
                
                {/* Image / Visual Area */}
                <div className="relative flex-1 bg-foreground/5 border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-8 flex items-center justify-center min-h-[30%] lg:min-h-0 shrink-0">
                   {/* Placeholder for project cinematic image */}
                   <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl group">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-coral/20 to-accent-violet/20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0 z-10" />
                      <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
                      {/* You can add real Next Image here */}
                   </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
                  <div className="mb-2 text-xs sm:text-sm font-semibold tracking-wider text-accent-violet uppercase shrink-0">
                    {project.role}
                  </div>
                  <h3 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold shrink-0">{project.title}</h3>
                  
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 shrink-0">
                    <div>
                      <h4 className="text-foreground/60 text-xs sm:text-sm font-medium mb-1">The Problem</h4>
                      <p className="text-foreground/80 text-sm sm:text-base">{project.problem}</p>
                    </div>
                    <div className="hidden sm:block">
                      <h4 className="text-foreground/60 text-xs sm:text-sm font-medium mb-1">The Solution</h4>
                      <p className="text-foreground/80 text-sm sm:text-base">{project.solution}</p>
                    </div>
                    <div>
                      <h4 className="text-foreground/60 text-xs sm:text-sm font-medium mb-1">Measurable Outcome</h4>
                      <p className="text-accent-coral font-medium text-sm sm:text-base">{project.outcome}</p>
                    </div>
                  </div>

                  <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 shrink-0">
                    {project.stack.map((tech) => (
                      <span key={tech} className="rounded-full bg-foreground/10 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-foreground/90">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
                    <MagneticButton className="w-full lg:flex-none">
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </MagneticButton>
                    <MagneticButton className="w-full lg:flex-none bg-transparent hover:bg-foreground/5">
                      <FaGithub className="h-4 w-4" /> Source
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
