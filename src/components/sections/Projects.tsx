"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Link from "next/link";
const PROJECTS = [
  {
    title: "DevTinder",
    role: "Full Stack Developer Networking Platform",
    problem: "Developers needed a streamlined platform to find co-founders, mentors, and collaborators based on specific tech stacks and interests.",
    solution: "Built a swipe/request-based matching platform with robust REST APIs, achieving 99% uptime and low-latency matches.",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "AWS EC2"],
    outcome: "Successfully matched hundreds of developers with 99% platform uptime.",
    video: "/DevTinder.mp4",
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
    video: "",
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
    video: "/SnapCart-Food-Cart.mp4",
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
      <div className="sticky top-0 flex flex-col h-screen overflow-hidden pt-0 pb-4">
        
        {/* Background gradient hint */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute -top-[20%] left-[20%] h-[70vw] max-h-[500px] w-[70vw] max-w-[500px] rounded-full bg-accent-violet/20 blur-[100px] lg:blur-[150px]" />
        </div>

        {/* Fixed Header occupying natural height at the top */}
        <div className="shrink-0 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-24 relative z-20 mb-4 sm:mb-8 pointer-events-none">
          <div className="flex flex-col text-center items-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-accent-violet mb-2 sm:mb-4"
            >
              PROJECTS
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 sm:mb-4"
            >
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral via-accent-pink to-accent-violet">Work.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs sm:text-base md:text-lg text-foreground/60 max-w-xl"
            >
              A selection of robust, scalable applications I've engineered to solve real-world problems.
            </motion.p>
          </div>
        </div>

        {/* Horizontally scrolling cards in the remaining space */}
        <div className="flex-1 min-h-0 relative z-10 w-full">
          <motion.div style={{ x }} className="flex h-full items-center">
            {PROJECTS.map((project, index) => (
              <div
                key={index}
                className="flex h-full w-[100vw] shrink-0 items-center justify-center px-4 sm:px-12 lg:px-24 box-border"
              >
                <div className="glass-panel relative z-10 flex h-[95%] lg:h-[90%] max-h-[500px] lg:max-h-[650px] w-full max-w-[1200px] flex-col overflow-hidden rounded-3xl lg:flex-row">
                
                {/* Image / Visual Area */}
                <div className="relative flex-1 bg-foreground/5 border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-8 flex items-center justify-center min-h-[30%] lg:min-h-0 shrink-0">
                   {/* Placeholder for project cinematic image */}
                   <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl group">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-coral/20 to-accent-violet/20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0 z-10 pointer-events-none" />
                      {project.video ? (
                        <video 
                          src={project.video} 
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

                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-center p-4 sm:p-8 lg:p-12 overflow-hidden pointer-events-auto">
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

                  <div className="mt-auto flex flex-wrap gap-3 sm:gap-4 shrink-0">
                    <MagneticButton className="flex-1 lg:flex-none">
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </MagneticButton>
                    <MagneticButton className="flex-1 lg:flex-none bg-transparent hover:bg-foreground/5 border border-foreground/10">
                      <FaGithub className="h-4 w-4" /> Source
                    </MagneticButton>
                    <Link href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`} className="w-full sm:w-auto sm:ml-auto block">
                      <MagneticButton className="w-full bg-accent-violet text-white hover:bg-accent-violet/90">
                        Project Details <ArrowRight className="h-4 w-4 ml-1" />
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
