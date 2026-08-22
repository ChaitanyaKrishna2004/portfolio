"use client";

import { motion } from "framer-motion";
import { ExternalLink, Play, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/lib/iconRegistry";
import type { TextMap } from "@/types/content";
import type { ProjectData } from "@/services/project.service";

/**
 * Tailwind can't scan class names stored in Postgres, so the accent colours a
 * project may use are enumerated here rather than interpolated.
 */
const ACCENT: Record<string, { bg: string; border: string; text: string; softBg: string }> = {
  "accent-coral": { bg: "bg-accent-coral/5", border: "border-accent-coral/10", text: "text-accent-coral", softBg: "bg-accent-coral/10" },
  "accent-violet": { bg: "bg-accent-violet/5", border: "border-accent-violet/10", text: "text-accent-violet", softBg: "bg-accent-violet/10" },
  "accent-pink": { bg: "bg-accent-pink/5", border: "border-accent-pink/10", text: "text-accent-pink", softBg: "bg-accent-pink/10" },
  foreground: { bg: "bg-foreground/5", border: "border-foreground/10", text: "text-foreground/80", softBg: "bg-foreground/10" },
};

const accent = (name?: string) => ACCENT[name ?? "foreground"] ?? ACCENT.foreground;

function externalHref(value: string) {
  if (!value) return "#";
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export function ProjectDetailView({ project, labels }: { project: ProjectData; labels: TextMap }) {
  const [activeMedia, setActiveMedia] = useState(0);
  const gallery = project.gallery ?? [];
  const info = project.projectInfo ?? {};

  const label = (key: string, fallback: string) => labels[key] ?? fallback;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative">
          {/* LEFT: media + deep dive */}
          <div className="w-full lg:w-[50%] flex flex-col gap-8 z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full aspect-video rounded-2xl glass-panel overflow-hidden relative group shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-coral/20 to-accent-violet/20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0 z-10 pointer-events-none" />

              {activeMedia === 0 && project.videoUrl ? (
                <video src={project.videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
              ) : gallery.length > 0 ? (
                <div className="absolute inset-0 bg-foreground/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={gallery[Math.max(0, activeMedia - (project.videoUrl ? 1 : 0))]?.url}
                    alt={gallery[Math.max(0, activeMedia - (project.videoUrl ? 1 : 0))]?.alt ?? project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
              )}
            </motion.div>

            {/* Thumbnails */}
            {(project.videoUrl || gallery.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 w-full"
              >
                <button
                  onClick={() => setActiveMedia((i) => Math.max(0, i - 1))}
                  aria-label="Previous media"
                  className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center shrink-0 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex flex-1 items-center gap-3 overflow-x-auto scrollbar-hide">
                  {project.videoUrl && (
                    <button
                      onClick={() => setActiveMedia(0)}
                      className={`w-[22%] aspect-video shrink-0 rounded-lg overflow-hidden cursor-pointer relative border-2 transition-all duration-300 ${activeMedia === 0 ? "border-accent-violet shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                    >
                      <video src={project.videoUrl} muted className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  )}

                  {gallery.map((img, i) => {
                    const index = project.videoUrl ? i + 1 : i;
                    return (
                      <button
                        key={img.url + i}
                        onClick={() => setActiveMedia(index)}
                        className={`w-[22%] aspect-video shrink-0 rounded-lg overflow-hidden cursor-pointer relative border-2 transition-all duration-300 ${activeMedia === index ? "border-accent-violet shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover absolute inset-0" />
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setActiveMedia((i) => Math.min(gallery.length - (project.videoUrl ? 0 : 1), i + 1))
                  }
                  aria-label="Next media"
                  className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center shrink-0 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 space-y-4">
              <h2 className="text-xl font-bold">{label("projectDetail.aboutLabel", "About the Project")}</h2>
              <p className="text-sm text-foreground/70 leading-relaxed">{project.about}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <h3 className="text-base font-bold">{label("projectDetail.learnedLabel", "What I Learned")}</h3>
                <ul className="space-y-3">
                  {project.points.learnings.map((learning, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-accent-violet shrink-0" />
                      <span>{learning}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-base font-bold">{label("projectDetail.challengesLabel", "Challenges")}</h3>
                <ul className="space-y-3">
                  {project.points.challenges.map((challenge, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-accent-coral shrink-0" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6">
              <h2 className="text-xl font-bold mb-6">{label("projectDetail.architectureLabel", "Project Architecture")}</h2>
              <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden border-white/20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="flex flex-col items-center gap-4 relative z-10 w-full max-w-sm">
                  {project.architecture.map((layer, i) => {
                    const c = accent(layer.color);
                    return (
                      <div key={i} className="w-full flex flex-col items-center">
                        <div className={`w-full text-center p-3 rounded-xl ${c.bg} border ${c.border} font-mono text-sm font-medium shadow-sm ${c.text}`}>
                          {layer.name}
                        </div>
                        {i < project.architecture.length - 1 && (
                          <div className="h-6 w-px bg-gradient-to-b from-foreground/10 to-foreground/10 relative my-1">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-foreground/20 rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: narrative */}
          <div className="w-full lg:w-[50%] flex flex-col gap-10">
            <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="mb-2 text-xs font-bold tracking-widest text-accent-violet uppercase">{project.category}</div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">{project.title}</h1>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-6">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.techDetail.map((tech) => (
                  <span key={tech} className="px-4 py-1.5 rounded-full bg-foreground/5 border border-transparent text-xs font-medium text-foreground/70">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-lg font-bold mb-2">{label("projectDetail.overviewLabel", "Overview")}</h2>
              <p className="text-sm text-foreground/70 leading-relaxed">{project.overview}</p>
            </motion.section>

            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.features.map((feature, i) => {
                  const c = accent(feature.color);
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
                        <div className={`w-8 h-8 rounded-full ${c.softBg} flex items-center justify-center shrink-0`}>
                          <Icon name={feature.icon} className={`w-4 h-4 ${c.text}`} fallback={<span className="w-4 h-4" />} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold mb-1">{feature.title}</h3>
                          <p className="text-[11px] text-foreground/60 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-2">
              <div className="space-y-4">
                <h3 className="text-base font-bold">{label("projectDetail.highlightsLabel", "Key Highlights")}</h3>
                <ul className="space-y-3">
                  {project.points.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-accent-violet shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel p-6 rounded-2xl bg-foreground/[0.02] border-white/20">
                <h3 className="text-base font-bold mb-4">{label("projectDetail.infoLabel", "Project Info")}</h3>
                <div className="space-y-4 text-sm">
                  {[
                    [label("projectDetail.infoRole", "Role"), info.role],
                    [label("projectDetail.infoDuration", "Duration"), info.duration],
                    [label("projectDetail.infoTeam", "Team Size"), info.team],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-start pb-2 border-b border-foreground/5 gap-4">
                      <span className="text-foreground/50 flex items-center gap-2 shrink-0 mt-0.5">
                        <span className="w-3 h-3 rounded bg-foreground/10" /> {k}
                      </span>
                      <span className="font-medium text-right">{v || "—"}</span>
                    </div>
                  ))}

                  {[
                    [label("projectDetail.infoLiveDemo", "Live Demo"), info.liveDemo],
                    [label("projectDetail.infoSourceCode", "Source Code"), info.sourceCode],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-start pb-2 border-b border-foreground/5 gap-4 last:border-b-0 last:pt-1">
                      <span className="text-foreground/50 flex items-center gap-2 shrink-0 mt-0.5">
                        <span className="w-3 h-3 rounded bg-foreground/10" /> {k}
                      </span>
                      {v ? (
                        <Link
                          href={externalHref(v)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-accent-violet hover:underline flex items-center justify-end gap-1 text-right max-w-[60%] break-all"
                        >
                          {v} <ExternalLink className="w-3 h-3 shrink-0" />
                        </Link>
                      ) : (
                        <span className="font-medium text-right text-foreground/40">—</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
