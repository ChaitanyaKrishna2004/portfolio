/**
 * Postgres stores icons as names ("SiReact", "ShieldCheck"). This is the only
 * place that turns a name back into a component.
 *
 * Adding an icon to the CMS means adding it here first — an unknown name falls
 * back to a neutral glyph rather than crashing the page.
 */
import React from "react";
import {
  ArrowLeft, ArrowRight, Award, BookOpen, BrainCircuit, Briefcase, Calendar,
  CheckCircle2, ChevronLeft, ChevronRight, Clock, Cloud, Code2, Coffee, Cpu,
  Database, Download, ExternalLink, Heart, Layout, Link as LinkIcon, Mail,
  MessageSquare, Network, Phone, Play, Send, Server, Share2, Shield,
  ShieldCheck, Sparkles, Terminal, User,
} from "lucide-react";
import {
  SiCloudflare, SiCplusplus, SiDotnet, SiExpress, SiGit, SiGnubash, SiHtml5,
  SiJavascript, SiKalilinux, SiLeetcode, SiMongodb, SiNextdotjs, SiNginx,
  SiNodedotjs, SiOwasp, SiPython, SiRedux, SiReact, SiSequelize, SiTailwindcss,
} from "react-icons/si";
import { FaAws, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export type IconName = keyof typeof ICONS;

export const ICONS = {
  // lucide
  ArrowLeft, ArrowRight, Award, BookOpen, BrainCircuit, Briefcase, Calendar,
  CheckCircle2, ChevronLeft, ChevronRight, Clock, Cloud, Code2, Coffee, Cpu,
  Database, Download, ExternalLink, Heart, Layout, LinkIcon, Mail,
  MessageSquare, Network, Phone, Play, Send, Server, Share2, Shield,
  ShieldCheck, Sparkles, Terminal, User,
  // simple-icons
  SiCloudflare, SiCplusplus, SiDotnet, SiExpress, SiGit, SiGnubash, SiHtml5,
  SiJavascript, SiKalilinux, SiLeetcode, SiMongodb, SiNextdotjs, SiNginx,
  SiNodedotjs, SiOwasp, SiPython, SiRedux, SiReact, SiSequelize, SiTailwindcss,
  // font-awesome
  FaAws, FaGithub, FaLinkedin, FaTwitter,
} as const;

/**
 * Renders an icon by its stored name.
 *
 * `name` may also be a literal emoji (the About cards use ⚡ / 🔐 / 🚀), in
 * which case it is rendered as text.
 */
export function Icon({
  name,
  className,
  fallback = null,
}: {
  name?: string | null;
  className?: string;
  fallback?: React.ReactNode;
}) {
  if (!name) return <>{fallback}</>;

  // Emoji and other non-identifier strings pass straight through.
  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(name)) {
    return <span className={className}>{name}</span>;
  }

  const Cmp = ICONS[name as IconName];
  if (!Cmp) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[iconRegistry] unknown icon "${name}" — add it to src/lib/iconRegistry.tsx`);
    }
    return <>{fallback}</>;
  }

  return <Cmp className={className} />;
}

export function hasIcon(name?: string | null): boolean {
  return !!name && name in ICONS;
}
