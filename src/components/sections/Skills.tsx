"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Code2, Server, Database, Shield, Layout, Terminal, Network, Cpu, Cloud, BrainCircuit, Sparkles } from "lucide-react";
import { 
  SiReact, SiNextdotjs, SiTailwindcss, SiRedux, SiHtml5,
  SiNodedotjs, SiExpress, SiDotnet,
  SiMongodb, SiSequelize,
  SiNginx, SiCloudflare, SiGit,
  SiPython, SiJavascript, SiCplusplus, SiGnubash,
  SiOwasp, SiKalilinux
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

const FULL_STACK = [
  { name: "React.js", icon: <SiReact />, tooltip: "Frontend · UI Development" },
  { name: "Next.js", icon: <SiNextdotjs />, tooltip: "Frontend · Full Stack Framework" },
  { name: "Tailwind CSS", icon: <SiTailwindcss />, tooltip: "Frontend · Styling" },
  { name: "Node.js", icon: <SiNodedotjs />, tooltip: "Backend · APIs" },
  { name: "MongoDB", icon: <SiMongodb />, tooltip: "Database · NoSQL" },
  { name: "SQL Server", icon: <Database className="w-4 h-4" />, tooltip: "Database · Relational" },
  { name: "AWS EC2", icon: <FaAws />, tooltip: "Cloud · Infrastructure" },
  { name: "Git", icon: <SiGit />, tooltip: "DevOps · Version Control" },
  { name: "JavaScript", icon: <SiJavascript />, tooltip: "Language · Core Logic" },
  { name: "Python", icon: <SiPython />, tooltip: "Language · Scripting" }
];

const CATEGORIES_DATA: Record<string, { name: string; icon: React.ReactNode; tooltip: string }[]> = {
  "Frontend": [
    { name: "React.js", icon: <SiReact />, tooltip: "Frontend · UI Development" },
    { name: "Next.js", icon: <SiNextdotjs />, tooltip: "Frontend · Full Stack Framework" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, tooltip: "Frontend · Styling" },
    { name: "Redux", icon: <SiRedux />, tooltip: "Frontend · State Management" },
    { name: "HTML/CSS", icon: <SiHtml5 />, tooltip: "Frontend · Core Web" }
  ],
  "Backend": [
    { name: "Node.js", icon: <SiNodedotjs />, tooltip: "Backend · APIs" },
    { name: "Express.js", icon: <SiExpress />, tooltip: "Backend · Server Framework" },
    { name: ".NET", icon: <SiDotnet />, tooltip: "Backend · Enterprise Framework" },
    { name: "C#", icon: <Code2 className="w-4 h-4" />, tooltip: "Backend · Server Logic" }
  ],
  "Databases": [
    { name: "MongoDB", icon: <SiMongodb />, tooltip: "Database · NoSQL" },
    { name: "SQL Server", icon: <Database className="w-4 h-4" />, tooltip: "Database · Relational" },
    { name: "Mongoose", icon: <Database className="w-4 h-4" />, tooltip: "Database · ODM" },
    { name: "Sequelize", icon: <SiSequelize />, tooltip: "Database · ORM" }
  ],
  "DevOps & Cloud": [
    { name: "AWS EC2", icon: <FaAws />, tooltip: "Cloud · Infrastructure" },
    { name: "Nginx", icon: <SiNginx />, tooltip: "Server · Reverse Proxy" },
    { name: "Cloudflare", icon: <SiCloudflare />, tooltip: "CDN · Security" },
    { name: "Git", icon: <SiGit />, tooltip: "DevOps · Version Control" },
    { name: "IIS / TFS", icon: <Terminal className="w-4 h-4" />, tooltip: "Server · CI/CD" }
  ],
  "Security": [
    { name: "Burp Suite", icon: <Shield className="w-4 h-4" />, tooltip: "Security · Pentesting" },
    { name: "Nmap", icon: <Shield className="w-4 h-4" />, tooltip: "Security · Network Mapping" },
    { name: "Metasploit", icon: <SiKalilinux />, tooltip: "Security · Exploitation" },
    { name: "OWASP", icon: <SiOwasp />, tooltip: "Security · Guidelines" }
  ],
  "Languages": [
    { name: "JavaScript", icon: <SiJavascript />, tooltip: "Language · Web" },
    { name: "Python", icon: <SiPython />, tooltip: "Language · Scripting" },
    { name: "C++", icon: <SiCplusplus />, tooltip: "Language · Systems" },
    { name: "Bash", icon: <SiGnubash />, tooltip: "Language · Shell" },
    { name: "DSA / OOP", icon: <Code2 className="w-4 h-4" />, tooltip: "Computer Science" }
  ]
};

const CATEGORIES_LIST = [
  "✦ Full Stack",
  "Frontend",
  "Backend",
  "Databases",
  "DevOps & Cloud",
  "Security",
  "Languages"
];

const EXPLORING = [
  { name: "AI Agents" },
  { name: "Socket.IO" },
  { name: "System Design" },
  { name: "Cloud Architecture" }
];

const ALSO_WORKED_WITH = [
  { name: ".NET" },
  { name: "C#" },
  { name: "IIS" },
  { name: "TFS" },
  { name: "Bash" }
];

export function Skills() {
  const [activeCategory, setActiveCategory] = useState("✦ Full Stack");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Pre-calculate parallax transforms to avoid calling hooks inside map
  const parallaxX1 = useTransform(smoothX, [-1, 1], [-15, 15]);
  const parallaxY1 = useTransform(smoothY, [-1, 1], [-15, 15]);
  const parallaxX2 = useTransform(smoothX, [-1, 1], [15, -15]);
  const parallaxY2 = useTransform(smoothY, [-1, 1], [15, -15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const activeSkills = activeCategory === "✦ Full Stack" 
    ? FULL_STACK 
    : CATEGORIES_DATA[activeCategory] || [];

  return (
    <section className="relative pt-4 pb-24 sm:pt-6 sm:pb-32 w-full max-w-[100vw] box-border overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 box-border">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <span className="text-accent-coral font-bold tracking-widest text-xs sm:text-sm mb-6 block uppercase">SKILLS</span>
          <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Tools I use to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral to-accent-violet">build.</span>
          </h2>
          <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl font-medium mx-auto">
            A collection of technologies I use to design, develop, secure, and ship digital products.
          </p>
        </motion.div>

        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mb-16">
          
          {/* Left: Filter Navigation */}
          <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {CATEGORIES_LIST.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative flex items-center px-5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap lg:whitespace-normal text-left ${
                    isActive 
                      ? "text-foreground shadow-lg scale-[1.02] bg-foreground/[0.03]" 
                      : "text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.02]"
                  }`}
                >
                  {/* Active Indicator Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 rounded-xl glass-panel border border-foreground/10 dark:border-white/20 bg-gradient-to-r from-accent-coral/10 to-accent-violet/10"
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />
                  )}
                  
                  {/* Active Dot */}
                  <span className={`w-2 h-2 rounded-full mr-3 shrink-0 transition-colors duration-300 ${isActive ? "bg-accent-coral shadow-[0_0_8px_rgba(255,127,80,0.8)]" : "bg-transparent"}`} />
                  
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Interactive Skill Ecosystem */}
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex-1 w-full min-h-[400px] lg:min-h-[500px] max-h-[500px] lg:max-h-[600px] rounded-3xl glass-panel border border-foreground/5 dark:border-white/5 bg-background/30 overflow-visible flex items-center justify-center"
          >
            {/* The Perfect Square Wrapper to align SVG and CSS coordinates */}
            <div className="relative w-full max-w-[400px] lg:max-w-[500px] aspect-square">
              {/* Parallax Radial Glow */}
              <motion.div 
                style={{
                  x: useTransform(smoothX, [-1, 1], [-50, 50]),
                  y: useTransform(smoothY, [-1, 1], [-50, 50]),
                }}
                className="absolute top-1/2 left-1/2 w-3/4 h-3/4 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-accent-coral/10 to-accent-violet/10 rounded-full blur-[100px] pointer-events-none"
              />

            {/* Connecting SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              <AnimatePresence>
                {activeSkills.map((skill, index) => {
                  const angle = (index / activeSkills.length) * Math.PI * 2;
                  // Base radius 35% of container
                  const radius = 35; 
                  const x = 50 + Math.cos(angle) * radius;
                  const y = 50 + Math.sin(angle) * radius;
                  
                  // Control point for subtle curve
                  const midX = (50 + x) / 2;
                  const midY = (50 + y) / 2;
                  const offset = 8; // curvature amount
                  const cpX = (midX - Math.sin(angle) * offset).toFixed(2);
                  const cpY = (midY + Math.cos(angle) * offset).toFixed(2);
                  const finalX = x.toFixed(2);
                  const finalY = y.toFixed(2);
                  
                  return (
                    <motion.path
                      key={`line-${activeCategory}-${skill.name}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.6 }}
                      exit={{ opacity: 0, transition: { duration: 0.3 } }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} // smooth cubic-bezier
                      d={`M 50 50 Q ${cpX} ${cpY} ${finalX} ${finalY}`}
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

            {/* Central Core Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <motion.div 
                style={{
                  x: useTransform(smoothX, [-1, 1], [-15, 15]),
                  y: useTransform(smoothY, [-1, 1], [-15, 15]),
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="group glass-panel px-6 sm:px-8 py-4 sm:py-5 rounded-2xl border border-foreground/10 dark:border-white/20 bg-background/80 shadow-[0_0_40px_rgba(255,127,80,0.1)] backdrop-blur-xl flex items-center justify-center hover:shadow-[0_0_60px_rgba(157,78,221,0.2)] transition-shadow duration-500 cursor-default">
                  <span className="font-bold tracking-widest text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-accent-coral to-accent-violet">
                    {activeCategory === "✦ Full Stack" ? "FULL STACK" : activeCategory.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Orbiting Technology Nodes */}
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
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: "-50%",
                      y: "-50%",
                      left: `${x}%`, 
                      top: `${y}%`,
                    }}
                    exit={{ opacity: 0, scale: 0, x: "-50%", y: "-50%", left: "50%", top: "50%", transition: { duration: 0.4 } }}
                    transition={{ 
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1], // premium cubic bezier
                      delay: index * 0.05 
                    }}
                    className="absolute z-40"
                  >
                    {/* Inner parallax */}
                    <motion.div
                      style={{
                        x: index % 2 === 0 ? parallaxX1 : parallaxX2,
                        y: index % 2 === 0 ? parallaxY1 : parallaxY2,
                      }}
                    >
                      {/* Inner float */}
                      <motion.div
                        animate={{ y: [-4, 4, -4] }}
                        transition={{ duration: 5 + (index % 3), delay: index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                        className="group relative"
                      >
                      {/* Node Circle */}
                      <div 
                        tabIndex={0}
                        className="w-12 h-12 sm:w-14 sm:h-14 glass-panel rounded-full flex items-center justify-center border border-foreground/10 dark:border-white/20 bg-background/70 shadow-lg text-2xl text-foreground/80 hover:text-accent-coral hover:border-accent-coral/50 focus:text-accent-coral focus:border-accent-coral/50 transition-colors duration-300 hover:scale-110 focus:scale-110 outline-none cursor-pointer"
                      >
                        {skill.icon}
                      </div>
                      
                      {/* Premium Tooltip */}
                      <div className={`absolute top-1/2 -translate-y-1/2 ${
                        isLeft 
                          ? "left-full ml-4 translate-x-[-10px]" 
                          : "right-full mr-4 translate-x-[10px]"
                      } px-3 py-1.5 bg-foreground text-background text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 shadow-xl whitespace-nowrap pointer-events-none group-hover:translate-x-0 group-focus-within:translate-x-0 z-50`}>
                        <span className="block mb-0.5 text-accent-coral/80 text-[10px] uppercase tracking-wider">{skill.name}</span>
                        {skill.tooltip}
                        <div className={`absolute top-1/2 -translate-y-1/2 border-4 border-transparent ${
                          isLeft 
                            ? "-left-1 border-r-foreground" 
                            : "-right-1 border-l-foreground"
                        }`} />
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

        {/* Secondary Sections */}
        <div className="flex flex-col md:flex-row justify-center gap-12 sm:gap-16 lg:gap-32 w-full max-w-4xl mx-auto border-t border-foreground/5 dark:border-white/5 pt-12">
          
          {/* Currently Exploring */}
          <div className="flex flex-col items-center flex-1">
             <span className="text-xs font-bold tracking-widest uppercase text-foreground/60 mb-6 flex items-center gap-2">
               Currently Exploring <Sparkles className="w-3 h-3 text-accent-violet" />
             </span>
             <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
               {EXPLORING.map(skill => (
                 <div key={skill.name} className="flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/10 bg-foreground/5 text-xs font-semibold text-foreground hover:bg-foreground/10 hover:border-accent-violet/30 transition-colors cursor-default shadow-sm">
                   {skill.name}
                 </div>
               ))}
             </div>
          </div>

          {/* Also Worked With */}
          <div className="flex flex-col items-center flex-1">
             <span className="text-xs font-bold tracking-widest uppercase text-foreground/60 mb-6">Also Worked With</span>
             <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
               {ALSO_WORKED_WITH.map(skill => (
                 <div key={skill.name} className="flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/10 bg-foreground/5 text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-colors cursor-default shadow-sm">
                   {skill.name}
                 </div>
               ))}
             </div>
          </div>

        </div>

      </div>
    </section>
  );
}
