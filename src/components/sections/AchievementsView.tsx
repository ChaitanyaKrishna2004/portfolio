"use client";

import { motion, Variants } from "framer-motion";
import { Icon } from "@/lib/iconRegistry";
import type { AchievementItem } from "@/types/content";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

// Tailwind cannot scan class names that come from the database, so each colour
// a card can use is spelled out here (and safelisted in globals.css).
const PALETTE: Record<string, { border: string; wash: string; iconBg: string; icon: string; hover: string; badge: string; ghost: string }> = {
  "accent-coral": {
    border: "hover:border-accent-coral/30",
    wash: "from-accent-coral/10",
    iconBg: "bg-accent-coral/10",
    icon: "text-accent-coral",
    hover: "group-hover:text-accent-coral",
    badge: "bg-accent-coral/10 text-accent-coral",
    ghost: "text-accent-coral",
  },
  "accent-violet": {
    border: "hover:border-accent-violet/30",
    wash: "from-accent-violet/10",
    iconBg: "bg-accent-violet/10",
    icon: "text-accent-violet",
    hover: "group-hover:text-accent-violet",
    badge: "bg-accent-violet/10 text-accent-violet",
    ghost: "text-accent-violet",
  },
  foreground: {
    border: "hover:border-foreground/30",
    wash: "from-foreground/5",
    iconBg: "bg-foreground/5",
    icon: "text-foreground/80",
    hover: "group-hover:text-foreground/90",
    badge: "bg-foreground/5 text-foreground/70",
    ghost: "text-foreground",
  },
};

export function AchievementsView({
  eyebrow,
  title,
  titleHighlight,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  items: AchievementItem[];
}) {
  return (
    <section className="relative pt-4 sm:pt-6 pb-8 sm:pb-12 overflow-hidden w-full max-w-[100vw] box-border">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-accent-coral/20 via-accent-violet/20 to-accent-pink/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-24 box-border relative z-10">
        <div className="flex flex-col text-center items-center mb-16 sm:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-accent-coral mb-2 sm:mb-4"
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
            className="text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {items.map((item, i) => {
            const c = PALETTE[item.color] ?? PALETTE.foreground;
            return (
              <motion.div
                key={item.title ?? i}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`glass-panel p-8 sm:p-10 rounded-[2rem] relative overflow-hidden group cursor-pointer border border-white/10 dark:border-white/5 ${c.border}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.wash} via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                  <Icon name={item.icon} className={`w-32 h-32 ${c.ghost}`} />
                </div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl ${c.iconBg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon name={item.icon} className={`w-8 h-8 ${c.icon}`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${c.hover} transition-colors duration-300`}>{item.title}</h3>
                  <p className="text-foreground/70 mb-6 text-sm leading-relaxed">{item.description}</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${c.badge}`}>
                    {item.badgeLabel}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
