"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TiltCard } from "@/components/ui/TiltCard";

export function About() {
  const cards = [
    {
      icon: "⚡",
      title: "BUILD",
      subtitle: "Full-Stack Engineering",
      description: "Designing and developing complete applications from frontend interfaces to scalable backend systems.",
    },
    {
      icon: "🔐",
      title: "PROTECT",
      subtitle: "Security Mindset",
      description: "Applying cybersecurity principles to build applications that are not only functional, but secure by design.",
    },
    {
      icon: "🚀",
      title: "SHIP",
      subtitle: "Product Thinking",
      description: "Taking an idea from architecture and development to deployment and a usable final product.",
    },
  ];

  const journey = [
    { year: "2022", title: "B.Tech — Computer Science" },
    { year: "2024", title: "Cybersecurity / VAPT" },
    { year: "2025", title: "Full-Stack Development" },
    { year: "2026", title: "Building & Shipping Products" },
  ];

  return (
    <section className="relative pt-12 pb-12 sm:pt-16 sm:pb-16 overflow-hidden w-full max-w-[100vw] box-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 box-border">
        
        {/* Intro & Visual Row */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-start w-full mb-12 lg:mb-16">
          
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <span className="text-accent-coral font-bold tracking-widest text-xs sm:text-sm mb-6 block">ABOUT ME</span>
            <h2 className="mb-8 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Building things I’m <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral to-accent-violet">curious about.</span>
            </h2>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl font-medium">
              I’m a full-stack developer who enjoys turning ideas into practical digital products. I like working across backend architecture, frontend experiences, APIs, databases, and deployment. My cybersecurity background also pushes me to think about security while building — not after.
            </p>
          </motion.div>

          {/* Right: Floating Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="flex-1 w-full flex justify-center lg:justify-end mt-12 lg:mt-0"
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 perspective-1000">
               {/* 3D Glass Card */}
               <motion.div 
                 animate={{ y: [-15, 15, -15], rotateZ: [-2, 2, -2] }}
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-0 rounded-[2rem] p-3 glass-panel border border-foreground/10 dark:border-white/10 shadow-2xl"
               >
                 <div className="relative w-full h-full rounded-2xl overflow-hidden bg-foreground/5 shadow-inner">
                   <Image src="/photo.jpeg" alt="Chaitanya Workspace" fill className="object-cover scale-110" priority />
                 </div>
                 
                 {/* Floating Labels */}
                 <motion.div 
                    animate={{ y: [-8, 8, -8] }} transition={{ duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -left-6 sm:-left-12 px-5 py-2.5 rounded-full glass-panel border border-foreground/10 dark:border-white/10 text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md bg-background/80"
                 >
                    Backend
                 </motion.div>
                 
                 <motion.div 
                    animate={{ y: [8, -8, 8] }} transition={{ duration: 5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 -right-8 sm:-right-14 px-5 py-2.5 rounded-full glass-panel border border-foreground/10 dark:border-white/10 text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md bg-background/80 text-accent-coral"
                 >
                    Security
                 </motion.div>
                 
                 <motion.div 
                    animate={{ y: [-5, 5, -5] }} transition={{ duration: 7, delay: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-6 left-6 sm:left-12 px-5 py-2.5 rounded-full glass-panel border border-foreground/10 dark:border-white/10 text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md bg-background/80 text-accent-violet"
                 >
                    Full Stack
                 </motion.div>
               </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-16 lg:mb-20 relative z-10">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="h-full"
            >
              <TiltCard className="h-full glass-panel rounded-3xl p-6 border border-foreground/5 dark:border-white/10 bg-background/50 hover:bg-background/80 transition-colors shadow-lg hover:shadow-2xl hover:border-foreground/20 dark:hover:border-white/30 flex flex-col">
                 <div className="text-3xl sm:text-4xl mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3 origin-bottom-left">
                   {card.icon}
                 </div>
                 <h3 className="text-xl font-bold mb-1 tracking-tight">{card.title}</h3>
                 <h4 className="text-accent-coral font-semibold mb-3 text-[11px] sm:text-xs tracking-wide uppercase">{card.subtitle}</h4>
                 <p className="text-foreground/70 leading-relaxed font-medium text-sm mt-auto">{card.description}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Journey Timeline */}
        <div className="w-full relative z-10">
           <span className="text-accent-violet font-bold tracking-widest text-xs sm:text-sm mb-12 block text-center">MY JOURNEY</span>
           
           <div className="relative flex flex-col md:flex-row justify-between items-stretch md:items-center w-full gap-8 md:gap-4 px-4 sm:px-0">
             
             {/* Animated Line Container (Desktop) */}
             <motion.div 
               initial={{ scaleX: 0 }}
               whileInView={{ scaleX: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className="absolute top-1/2 left-10 right-10 h-[2px] bg-foreground/5 dark:bg-white/5 hidden md:block -translate-y-1/2 overflow-hidden rounded-full origin-left"
             >
               {/* Traveling Comet */}
               <motion.div 
                 animate={{ x: ["-100%", "500%"] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="w-1/4 h-full bg-gradient-to-r from-transparent via-accent-violet to-transparent shadow-[0_0_15px_rgba(157,78,221,1)] opacity-80"
               />
             </motion.div>
             
             {/* Animated Line Container (Mobile) */}
             <motion.div 
               initial={{ scaleY: 0 }}
               whileInView={{ scaleY: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className="absolute top-10 bottom-10 left-[39px] w-[2px] bg-foreground/5 dark:bg-white/5 md:hidden overflow-hidden rounded-full origin-top"
             >
               {/* Traveling Comet */}
               <motion.div 
                 animate={{ y: ["-100%", "500%"] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="w-full h-1/4 bg-gradient-to-b from-transparent via-accent-violet to-transparent shadow-[0_0_15px_rgba(157,78,221,1)] opacity-80"
               />
             </motion.div>
             
             {journey.map((node, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, scale: 0.9, y: 30 }}
                 whileInView={{ opacity: 1, scale: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: i * 0.2, type: "spring", stiffness: 100 }}
                 className="relative z-10 flex flex-row md:flex-col items-center gap-6 md:gap-5 flex-1 group"
               >
                 {/* Glowing Animated Node */}
                 <div className="relative flex items-center justify-center w-12 h-12 md:w-12 md:h-12 shrink-0">
                   {/* Background pulse */}
                   <motion.div 
                     animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                     className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-coral to-accent-violet blur-md" 
                   />
                   {/* Center dot */}
                   <div className="relative w-4 h-4 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-accent-coral to-accent-violet shadow-[0_0_15px_rgba(157,78,221,0.8)] border-[2.5px] border-background z-10" />
                 </div>
                 
                 {/* Card Content with continuous float & TiltCard */}
                 <motion.div 
                   animate={{ y: [0, -8, 0] }}
                   transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                   className="w-full md:w-auto"
                 >
                   <TiltCard className="glass-panel w-full p-5 md:p-6 rounded-2xl border border-foreground/10 dark:border-white/20 bg-background/60 hover:bg-background/90 transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(157,78,221,0.15)] text-left md:text-center flex flex-col relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-coral to-accent-violet opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     <span className="text-xs font-bold text-accent-coral mb-2 tracking-wider">{node.year}</span>
                     <span className="text-sm sm:text-base font-bold leading-tight">{node.title}</span>
                   </TiltCard>
                 </motion.div>
               </motion.div>
             ))}
           </div>
        </div>

      </div>
    </section>
  );
}
