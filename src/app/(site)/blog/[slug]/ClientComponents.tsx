"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/lib/iconRegistry";
import type { ShareTarget } from "@/types/content";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-violet via-accent-coral to-accent-violet origin-left z-50 shadow-[0_0_10px_rgba(157,78,221,0.5)]"
      style={{ scaleX }}
    />
  );
}

/** Fills {url} and {title} in a stored share template. */
function buildShareUrl(template: string, title: string) {
  if (typeof window === "undefined") return "#";
  return template
    .replace("{url}", encodeURIComponent(window.location.href))
    .replace("{title}", encodeURIComponent(title));
}

export function FloatingSocials({
  shareTargets,
  title,
}: {
  shareTargets: ShareTarget[];
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in some browsers unless the page is focused.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="hidden xl:flex flex-col gap-4 fixed left-8 top-1/3 z-40"
    >
      <div className="flex flex-col gap-3 glass-panel p-3 rounded-full border-white/10">
        {shareTargets.map((target) => (
          <button
            key={target.platform}
            onClick={() => window.open(buildShareUrl(target.urlTemplate, title), "_blank", "noopener,width=600,height=500")}
            aria-label={`Share on ${target.platform}`}
            className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-accent-violet hover:bg-accent-violet/10 transition-all group"
          >
            <Icon name={target.icon} className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        ))}

        <div className="w-full h-[1px] bg-border my-1" />

        <button
          onClick={copyLink}
          aria-label={copied ? "Link copied" : "Copy link"}
          className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all group relative"
        >
          {copied ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <LinkIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </motion.div>
  );
}

interface HeroPost {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  cover?: { alt: string } | null;
}

export function PremiumHero({ post, backLabel }: { post: HeroPost; backLabel: string }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-violet/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-[400px] h-[300px] bg-accent-coral/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center mr-3 group-hover:bg-foreground/10 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            {backLabel}
          </Link>
        </motion.div>

        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="px-4 py-1.5 rounded-full glass-panel border-accent-violet/30 text-accent-violet text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(157,78,221,0.2)]"
          >
            {post.category}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-foreground leading-[1.1] balance-text"
          >
            {post.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            {post.excerpt}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center gap-6 text-sm font-medium text-muted-foreground mb-12"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-violet/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-accent-violet" />
              </div>
              {post.date}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-coral/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-accent-coral" />
              </div>
              {post.readTime}
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ y: y1, opacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.4 }}
          className="relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden glass-panel p-2 shadow-2xl z-20"
        >
          <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
            <Image
              src={post.image}
              alt={post.cover?.alt || post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function PremiumContent({
  children,
  outroText,
  shareLabel,
  moreLabel,
}: {
  children: React.ReactNode;
  outroText: string;
  shareLabel: string;
  moreLabel: string;
}) {
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        // The user dismissed the share sheet — fall through to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Nothing more we can do; the floating rail also offers copy.
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pb-32 relative z-30 -mt-10 md:-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="glass-panel rounded-3xl p-8 md:p-14 lg:p-16 shadow-xl border-white/10 bg-background/60 backdrop-blur-2xl"
      >
        <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-foreground/80
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border
          prose-h3:text-2xl prose-h3:mt-8
          prose-p:text-foreground/80 prose-p:leading-loose
          prose-a:text-accent-violet hover:prose-a:text-accent-coral prose-a:transition-colors prose-a:font-medium prose-a:underline-offset-4
          prose-strong:text-foreground prose-strong:font-bold
          prose-ul:leading-loose prose-ol:leading-loose
          prose-li:text-foreground/80 prose-li:marker:text-accent-violet
          prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-white/10
          prose-blockquote:border-l-4 prose-blockquote:border-l-accent-violet prose-blockquote:bg-accent-violet/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-foreground/90 prose-blockquote:italic prose-blockquote:my-8
          prose-code:text-accent-coral prose-code:bg-accent-coral/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:shadow-2xl">
          {children}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground font-medium">{outroText}</p>
          <div className="flex gap-3">
            <button
              onClick={share}
              className="px-6 py-2.5 rounded-full bg-accent-violet/10 text-accent-violet text-sm font-bold hover:bg-accent-violet hover:text-white transition-all shadow-sm"
            >
              {shareLabel}
            </button>
            <Link href="/blog" className="px-6 py-2.5 rounded-full glass-panel text-foreground text-sm font-bold hover:bg-foreground/5 transition-all shadow-sm">
              {moreLabel}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
