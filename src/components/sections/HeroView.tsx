"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RoleCycler } from "@/components/ui/RoleCycler";
import { Icon } from "@/lib/iconRegistry";
import { solidSocial } from "@/lib/socialStyle";
import type { ButtonDef, HeroContent, SocialLink } from "@/types/content";

export function HeroView({
  title,
  description,
  availabilityText,
  photoUrl,
  content,
  socials,
  primaryCta,
  resumeCta,
}: {
  title: string;
  description: string;
  availabilityText: string;
  photoUrl: string;
  content: HeroContent;
  socials: SocialLink[];
  primaryCta: ButtonDef;
  resumeCta: ButtonDef;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const roles = content.roles?.map((r) => r.text) ?? [];
  const stats = content.stats ?? [];
  const techIcons = content.techIcons ?? [];

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[85dvh] flex-col items-center justify-center overflow-hidden pt-32 pb-4 lg:pt-28 w-full max-w-[100vw] box-border"
    >
      {/* Dynamic background glow and particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-[10%] top-[20%] h-[70vw] max-h-[500px] w-[70vw] max-w-[500px] rounded-full bg-accent-coral/10 blur-[80px] lg:blur-[120px]" />
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10%] sm:inset-[-15%] rounded-full border-[1.5px] border-black/30 dark:border-white/20"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent-violet dark:bg-white/80 shadow-[0_0_12px_3px_rgba(157,78,221,0.6)] dark:shadow-[0_0_12px_3px_rgba(255,255,255,0.6)]" />
              <div className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-accent-coral shadow-[0_0_10px_2px_rgba(255,127,80,0.6)]" />
            </motion.div>

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20%] sm:inset-[-25%] rounded-full border-[1.5px] border-black/25 dark:border-white/10"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-orange-500 dark:bg-peach-200/80 shadow-[0_0_12px_3px_rgba(251,146,60,0.6)] dark:shadow-[0_0_12px_3px_rgba(255,216,196,0.6)]" />
            </motion.div>

            {/* Floating Technology Icons */}
            {techIcons.map((tech, idx) => (
              <motion.div
                key={tech.name ?? idx}
                initial={{ y: 0 }}
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: tech.delay }}
                className="absolute z-20 group"
                style={{ top: tech.top, left: tech.left }}
              >
                <div
                  className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/10 dark:border-white/20 bg-background/80 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:${tech.shadowClass} hover:shadow-lg cursor-pointer`}
                >
                  <Icon name={tech.icon} className={`w-5 h-5 sm:w-6 sm:h-6 ${tech.colorClass} transition-opacity`} />

                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-background/80 backdrop-blur-sm border border-border rounded text-xs font-medium opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    {tech.name}
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative h-full w-full overflow-hidden rounded-full shadow-2xl transition-transform duration-500 ease-out z-10 bg-background"
            >
              <Image
                src={photoUrl}
                alt="Chaitanya Krishna"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 12rem, (max-width: 1024px) 16rem, 24rem"
              />
            </motion.div>
          </motion.div>

          {/* Copy column */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mb-6 inline-block rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide text-accent-coral backdrop-blur-md">
                {availabilityText}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 font-bold tracking-tight leading-[1.1] text-[clamp(2.2rem,6vw,5.5rem)] whitespace-nowrap"
            >
              {title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 w-full max-w-[100%] lg:max-w-2xl leading-relaxed text-foreground/80"
            >
              <span className="block mb-3 text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
                I am a <RoleCycler roles={roles} />
              </span>
              <p className="text-sm sm:text-base lg:text-lg font-medium">{description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto mb-8"
            >
              <Link href={primaryCta.href ?? "#projects"} className="w-full sm:w-auto">
                <MagneticButton className="w-full sm:w-auto group bg-foreground text-background hover:bg-foreground/90">
                  {primaryCta.label}
                  <Icon name={primaryCta.icon} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </Link>

              <a
                href={resumeCta.href ?? "#"}
                target={resumeCta.target ?? "_blank"}
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <MagneticButton className="w-full sm:w-auto group border-accent-coral/50 hover:bg-accent-coral/10">
                  <Icon name={resumeCta.icon} className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
                  {resumeCta.label}
                </MagneticButton>
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 flex-wrap"
            >
              {socials.map((social) => {
                const surface = solidSocial(social);
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group relative"
                  >
                    <div
                      className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${surface.glowClassName}`}
                      style={surface.glowStyle}
                    />
                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg ${surface.className}`}
                      style={surface.style}
                    >
                      {social.icon ? (
                        <Icon name={social.icon} className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-sm tracking-tighter">{social.textBadge}</span>
                      )}
                    </div>
                  </a>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Stat cards */}
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
              <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center ${stat.iconBgClass}`}>
                <Icon name={stat.icon} className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-xs sm:text-sm text-foreground/60 leading-tight">
                  {stat.labelTop}
                  <br />
                  {stat.labelBottom}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
