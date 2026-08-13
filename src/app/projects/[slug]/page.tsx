"use client";

import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { ExternalLink, Play, Heart, MessageSquare, Shield, Sparkles, Database, Server, CheckCircle2, ChevronLeft, ChevronRight, Layout } from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";
import projectsData from "@/data/data.json";

// Map string icon names from JSON to actual Lucide components
const IconMap: Record<string, React.ElementType> = {
  Heart,
  MessageSquare,
  Shield,
  Sparkles,
  Database,
  Server,
};

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const data = (projectsData as Record<string, any>)[slug];

  if (!data) {
    notFound();
  }

  const [activeMedia, setActiveMedia] = useState(0); 

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        
        {/* Main Grid Layout (Static, not sticky) */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative">
          
          {/* LEFT COLUMN: Media & Deep Dive Content */}
          <div className="w-full lg:w-[50%] flex flex-col gap-8 z-20">
            
            {/* Main Media Player */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full aspect-video rounded-2xl glass-panel overflow-hidden relative group cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-coral/20 to-accent-violet/20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0 z-10" />
              
              {/* Real Video / Image Content */}
              {activeMedia === 0 && data.video ? (
                <video 
                  src={data.video} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-foreground/5">
                  {/* Using next/image or standard img for gallery */}
                  <img 
                    src={data.gallery[activeMedia === 0 ? 0 : activeMedia - 1]} 
                    alt="Project media" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Fake Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-white/80" />
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-accent-coral" />
                </div>
                <span className="text-white text-xs font-medium">0:00 / 1:24</span>
              </div>
            </motion.div>

            {/* Thumbnail Gallery matching the image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 w-full"
            >
              <button className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center shrink-0 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex flex-1 items-center gap-3 overflow-x-auto scrollbar-hide">
                <div 
                  onClick={() => setActiveMedia(0)}
                  className={`w-[22%] aspect-video shrink-0 rounded-lg overflow-hidden cursor-pointer relative border-2 transition-all duration-300 ${activeMedia === 0 ? 'border-accent-violet shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    {data.video ? (
                      <>
                        <video src={data.video} muted className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                        <Play className="w-4 h-4 text-foreground/50" />
                      </div>
                    )}
                  </div>
                </div>
                
                {data.gallery.map((img: string, i: number) => (
                  <div 
                    key={i}
                    onClick={() => setActiveMedia(i + 1)}
                    className={`w-[22%] aspect-video shrink-0 rounded-lg overflow-hidden cursor-pointer relative border-2 transition-all duration-300 ${activeMedia === i + 1 ? 'border-accent-violet shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover absolute inset-0" />
                  </div>
                ))}
              </div>

              <button className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center shrink-0 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* About the Project */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 space-y-4"
            >
              <h2 className="text-xl font-bold">About the Project</h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {data.about}
              </p>
            </motion.div>

            {/* What I Learned & Challenges (Side by side) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4"
            >
              <div className="space-y-4">
                <h3 className="text-base font-bold">What I Learned</h3>
                <ul className="space-y-3">
                  {data.learnings.map((learning: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-accent-violet shrink-0" />
                      <span>{learning}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-base font-bold">Challenges</h3>
                <ul className="space-y-3">
                  {data.challenges.map((challenge: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-accent-coral shrink-0" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Project Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <h2 className="text-xl font-bold mb-6">Project Architecture</h2>
              <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden border-white/20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                
                <div className="flex flex-col items-center gap-4 relative z-10 w-full max-w-sm">
                  {data.architecture.map((layer: any, i: number) => (
                    <div key={i} className="w-full flex flex-col items-center">
                      <div className={`w-full text-center p-3 rounded-xl bg-${layer.color}/5 border border-${layer.color}/10 font-mono text-sm font-medium shadow-sm text-${layer.color === 'foreground' ? 'foreground/80' : layer.color}`}>
                        {layer.name}
                      </div>
                      {i < data.architecture.length - 1 && (
                        <div className="h-6 w-px bg-gradient-to-b from-foreground/10 to-foreground/10 relative my-1">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-foreground/20 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Static Flowing Content */}
          <div className="w-full lg:w-[50%] flex flex-col gap-10">
            
            {/* 1. Intro Header */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-2 text-xs font-bold tracking-widest text-accent-violet uppercase">
                {data.category}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">
                {data.title}
              </h1>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-6">
                {data.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {data.technologies.map((tech: string) => (
                  <span key={tech} className="px-4 py-1.5 rounded-full bg-foreground/5 border border-transparent text-xs font-medium text-foreground/70">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* 2. Overview Paragraph */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-lg font-bold mb-2">Overview</h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {data.overview}
              </p>
            </motion.section>

            {/* 3. Feature Grid (2x3) */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.features.map((feature: any, i: number) => {
                  const IconComponent = IconMap[feature.icon] || Layout;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="glass-panel p-5 rounded-2xl hover:bg-foreground/[0.02] transition-colors border-white/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${feature.color}/10 flex items-center justify-center shrink-0`}>
                          <IconComponent className={`w-4 h-4 text-${feature.color}`} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold mb-1">{feature.title}</h3>
                          <p className="text-[11px] text-foreground/60 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </section>

            {/* 4. Highlights & Project Info (Side by side on desktop) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-2">
              
              {/* Key Highlights */}
              <div className="space-y-4">
                <h3 className="text-base font-bold">Key Highlights</h3>
                <ul className="space-y-3">
                  {data.highlights.map((highlight: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-accent-violet shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Project Info Card */}
              <div className="glass-panel p-6 rounded-2xl bg-foreground/[0.02] border-white/20">
                <h3 className="text-base font-bold mb-4">Project Info</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-start pb-2 border-b border-foreground/5 gap-4">
                    <span className="text-foreground/50 flex items-center gap-2 shrink-0 mt-0.5"><div className="w-3 h-3 rounded bg-foreground/10" /> Role</span>
                    <span className="font-medium text-right">{data.projectInfo.role}</span>
                  </div>
                  <div className="flex justify-between items-start pb-2 border-b border-foreground/5 gap-4">
                    <span className="text-foreground/50 flex items-center gap-2 shrink-0 mt-0.5"><div className="w-3 h-3 rounded bg-foreground/10" /> Duration</span>
                    <span className="font-medium text-right">{data.projectInfo.duration}</span>
                  </div>
                  <div className="flex justify-between items-start pb-2 border-b border-foreground/5 gap-4">
                    <span className="text-foreground/50 flex items-center gap-2 shrink-0 mt-0.5"><div className="w-3 h-3 rounded bg-foreground/10" /> Team Size</span>
                    <span className="font-medium text-right">{data.projectInfo.team}</span>
                  </div>
                  <div className="flex justify-between items-start pb-2 border-b border-foreground/5 gap-4">
                    <span className="text-foreground/50 flex items-center gap-2 shrink-0 mt-0.5"><div className="w-3 h-3 rounded bg-foreground/10" /> Live Demo</span>
                    <Link href={`https://${data.projectInfo.liveDemo}`} className="font-medium text-accent-violet hover:underline flex items-center justify-end gap-1 text-right max-w-[60%] break-all">
                      {data.projectInfo.liveDemo} <ExternalLink className="w-3 h-3 shrink-0" />
                    </Link>
                  </div>
                  <div className="flex justify-between items-start pt-1 gap-4">
                    <span className="text-foreground/50 flex items-center gap-2 shrink-0 mt-0.5"><div className="w-3 h-3 rounded bg-foreground/10" /> Source Code</span>
                    <Link href={`https://${data.projectInfo.sourceCode}`} className="font-medium text-accent-violet hover:underline flex items-center justify-end gap-1 text-right max-w-[60%] break-all">
                      {data.projectInfo.sourceCode} <ExternalLink className="w-3 h-3 shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
