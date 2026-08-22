"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Icon } from "@/lib/iconRegistry";
import { RESOURCES } from "@/lib/adminSchema";
import { AdminThemeToggle } from "./AdminThemeToggle";
import type { SessionUser } from "@/lib/auth";

const CONTENT = ["sections", "projects", "experiences", "skills", "blog"];
const LIBRARY = ["media", "messages", "settings"];

const linkClass = (active: boolean) =>
  `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
    active
      ? "bg-foreground/[0.07] text-foreground"
      : "text-foreground/55 hover:text-foreground hover:bg-foreground/[0.04]"
  }`;

/** Declared at module scope — defining it inside AdminNav would remount every link on each render. */
function NavGroup({
  title,
  slugs,
  isActive,
  unread,
  onNavigate,
}: {
  title: string;
  slugs: string[];
  isActive: (href: string) => boolean;
  unread: number;
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/30">
        {title}
      </span>
      {slugs.map((slug) => {
        const r = RESOURCES.find((x) => x.slug === slug);
        if (!r) return null;
        const href = `/admin/${r.slug}`;
        const active = isActive(href);
        return (
          <Link key={r.slug} href={href} onClick={onNavigate} className={linkClass(active)}>
            <Icon
              name={r.icon}
              className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-accent-violet" : "text-foreground/35 group-hover:text-foreground/60"}`}
            />
            <span className="flex-1 truncate">{r.label}</span>
            {r.slug === "messages" && unread > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-accent-coral text-white text-[10px] font-bold tabular-nums leading-none">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function AdminNav({ user, unread }: { user: SessionUser; unread: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col">
      <Link href="/admin" onClick={() => setOpen(false)} className={linkClass(isActive("/admin"))}>
        <LayoutDashboard className={`w-4 h-4 shrink-0 ${isActive("/admin") ? "text-accent-violet" : "text-foreground/35"}`} />
        Overview
      </Link>

      <NavGroup title="Content" slugs={CONTENT} isActive={isActive} unread={unread} onNavigate={() => setOpen(false)} />
      <NavGroup title="Library" slugs={LIBRARY} isActive={isActive} unread={unread} onNavigate={() => setOpen(false)} />

      <div className="h-px bg-border my-4" />

      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-foreground/55 hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
      >
        <ExternalLink className="w-4 h-4 shrink-0 text-foreground/35" />
        View site
      </Link>
    </nav>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b border-border bg-background/90 backdrop-blur-xl">
        <span className="font-bold tracking-tight text-sm">
          Admin<span className="text-accent-violet">.</span>
        </span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="w-9 h-9 rounded-lg border border-border flex items-center justify-center"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-b border-border bg-background px-3 py-3">
          {nav}
          <div className="mt-3 px-1">
            <AdminThemeToggle />
          </div>
          <button
            onClick={signOut}
            disabled={signingOut}
            className="mt-2 w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-foreground/55 hover:text-red-500 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-foreground/[0.015] h-screen sticky top-0 px-3 py-5">
        <div className="px-3 mb-2">
          <div className="text-base font-bold tracking-tight">
            Admin<span className="text-accent-violet">.</span>
          </div>
          <div className="text-[11px] text-foreground/40 mt-0.5 truncate">{user.email}</div>
        </div>

        <div className="flex-1 overflow-y-auto -mx-0.5 px-0.5">{nav}</div>

        <div className="mt-3 px-1">
          <AdminThemeToggle />
        </div>

        <button
          onClick={signOut}
          disabled={signingOut}
          className="mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-foreground/50 hover:text-red-500 hover:bg-red-500/5 transition-colors disabled:opacity-60"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </aside>
    </>
  );
}
