"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight, Download, Briefcase, User, Code2, Coffee } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode, SiReact, SiNodedotjs, SiMongodb, SiJavascript, SiGit } from "react-icons/si";
import Image from "next/image";

import { RoleCycler } from "@/components/ui/RoleCycler";
import { HeroParticles } from "@/components/ui/HeroParticles";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      icon: <Briefcase className="w-5 h-5 text-foreground" />,
      iconBg: "bg-orange-100 dark:bg-orange-500/20",
      value: "10+",
      label: <>Projects<br />Completed</>,
    },
    {
      icon: <User className="w-5 h-5 text-foreground" />,
      iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
      value: "2+",
      label: <>Years of<br />Experience</>,
    },
    {
      icon: <Code2 className="w-5 h-5 text-foreground" />,
      iconBg: "bg-fuchsia-100 dark:bg-fuchsia-500/20",
      value: "5+",
      label: <>Technologies<br />Mastered</>,
    },
    {
      icon: <Coffee className="w-5 h-5 text-foreground" />,
      iconBg: "bg-rose-100 dark:bg-rose-500/20",
      value: "100%",
      label: <>Commitment &<br />Dedication</>,
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[85dvh] flex-col items-center justify-center overflow-hidden pt-32 pb-4 lg:pt-28 w-full max-w-[100vw] box-border"
    >
      {/* Dynamic background glow and particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-[10%] top-[20%] h-[70vw] max-h-[500px] w-[70vw] max-w-[500px] rounded-full bg-accent-coral/10 blur-[80px] lg:blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[80vw] max-h-[600px] w-[80vw] max-w-[600px] rounded-full bg-accent-violet/10 blur-[80px] lg:blur-[150px]" />
        <HeroParticles />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 box-border flex flex-col gap-8 lg:gap-12"
      >
        <div className="flex flex-col items-center justify-center gap-12 lg:justify-between lg:gap-16 lg:flex-row w-full">
          
          {/* Profile Image with Orbital Rings & Floating Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-48 w-48 sm:h-64 sm:w-64 lg:h-96 lg:w-96 perspective-1000 shrink-0 lg:order-last mx-auto"
          >
            {/* 1. Orbital Ring 1 (Inner) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10%] sm:inset-[-15%] rounded-full border-[1.5px] border-black/30 dark:border-white/20"
            >
              {/* Glowing particles on the orbit */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent-violet dark:bg-white/80 shadow-[0_0_12px_3px_rgba(157,78,221,0.6)] dark:shadow-[0_0_12px_3px_rgba(255,255,255,0.6)]" />
              <div className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-accent-coral shadow-[0_0_10px_2px_rgba(255,127,80,0.6)]" />
            </motion.div>

            {/* 2. Orbital Ring 2 (Outer) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20%] sm:inset-[-25%] rounded-full border-[1.5px] border-black/25 dark:border-white/10"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-orange-500 dark:bg-peach-200/80 shadow-[0_0_12px_3px_rgba(251,146,60,0.6)] dark:shadow-[0_0_12px_3px_rgba(255,216,196,0.6)]" />
            </motion.div>

            {/* 3. Floating Technology Icons */}
            {[
              { Icon: SiReact, name: "React", color: "text-[#61DAFB]", shadow: "shadow-[#61DAFB]/30", top: "5%", left: "-5%", delay: 0 },
              { Icon: SiNodedotjs, name: "Node.js", color: "text-[#339933]", shadow: "shadow-[#339933]/30", top: "70%", left: "-15%", delay: 1.5 },
              { Icon: SiMongodb, name: "MongoDB", color: "text-[#47A248]", shadow: "shadow-[#47A248]/30", top: "85%", left: "80%", delay: 3 },
              { Icon: SiJavascript, name: "JavaScript", color: "text-[#F7DF1E]", shadow: "shadow-[#F7DF1E]/30", top: "-5%", left: "75%", delay: 2 },
              { Icon: SiGit, name: "Git", color: "text-[#F05032]", shadow: "shadow-[#F05032]/30", top: "40%", left: "95%", delay: 4 },
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 0 }}
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: tech.delay }}
                className="absolute z-20 group"
                style={{ top: tech.top, left: tech.left }}
              >
                <div className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/10 dark:border-white/20 bg-background/80 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:${tech.shadow} hover:shadow-lg cursor-pointer`}>
                  <tech.Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${tech.color} transition-opacity`} />
                  
                  {/* Tooltip Name */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/80 backdrop-blur-sm border border-border rounded text-xs font-medium opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    {tech.name}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Profile Image Container */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative h-full w-full overflow-hidden rounded-full shadow-2xl transition-transform duration-500 ease-out z-10 bg-background"
            >
              <Image
                src="/photo.jpeg"
                alt="Chaitanya Krishna"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Text Content (Second on mobile, left on desktop) */}
          <div className="flex w-full flex-col items-start text-left lg:order-first shrink">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mb-6 inline-block rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide text-accent-coral backdrop-blur-md">
                Available for new opportunities
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 font-bold tracking-tight leading-[1.1] text-[clamp(2.2rem,6vw,5.5rem)] whitespace-nowrap"
            >
              Hi, I&apos;m Chaitanya.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 w-full max-w-[100%] lg:max-w-2xl leading-relaxed text-foreground/80"
            >
              <span className="block mb-3 text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
                I am a <RoleCycler />
              </span>
              <p className="text-sm sm:text-base lg:text-lg font-medium">
                building applications that are fast, secure, and incredibly easy to use. I love turning complex problems into simple, elegant solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto mb-8"
            >
              <MagneticButton className="w-full sm:w-auto group bg-foreground text-background hover:bg-foreground/90">
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <a href="/Paruchuri_Chaitanya_Krishna_Resume.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <MagneticButton className="w-full sm:w-auto group border-accent-coral/50 hover:bg-accent-coral/10">
                  <Download className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
                  Resume
                </MagneticButton>
              </a>
              <MagneticButton className="w-full sm:w-auto">
                Contact Me
              </MagneticButton>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 flex-wrap"
            >
              <a href="https://github.com/ChaitanyaKrishna2004/" target="_blank" rel="noopener noreferrer" className="group relative">
                <div className="absolute inset-0 bg-foreground/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <FaGithub className="w-5 h-5" />
                </div>
              </a>
              <a href="https://www.linkedin.com/in/paruchuri-chaitanya-krishna-768557255/?skipRedirect=true" target="_blank" rel="noopener noreferrer" className="group relative">
                <div className="absolute inset-0 bg-[#0077b5]/50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-12 h-12 rounded-full bg-[#0077b5] text-white flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <FaLinkedin className="w-5 h-5" />
                </div>
              </a>
              <a href="https://leetcode.com/u/chaitanya2004/" target="_blank" rel="noopener noreferrer" className="group relative">
                <div className="absolute inset-0 bg-[#ffa116]/50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-12 h-12 rounded-full bg-[#ffa116] text-white flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <SiLeetcode className="w-5 h-5" />
                </div>
              </a>
              <a href="https://takeuforward.org/profile/krishnaparuchuri2004" target="_blank" rel="noopener noreferrer" className="group relative">
                <div className="absolute inset-0 bg-red-500/50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <span className="font-bold text-sm tracking-tighter">TUF</span>
                </div>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-border bg-foreground/5 backdrop-blur-md hover:bg-foreground/10 transition-colors duration-300"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center ${stat.iconBg}`}>
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground/80 leading-tight mt-0.5">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
