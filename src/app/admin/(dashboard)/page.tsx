import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Icon } from "@/lib/iconRegistry";
import { RESOURCES } from "@/lib/adminSchema";
import { getDashboardStats, getRecentMessages, getRecentActivity } from "@/services/admin.service";

export const dynamic = "force-dynamic";

const COUNT_FOR: Record<string, keyof Awaited<ReturnType<typeof getDashboardStats>>> = {
  sections: "sections",
  skills: "skills",
  projects: "projects",
  experiences: "experiences",
  blog: "posts",
  media: "media",
  messages: "totalMessages",
};

function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default async function AdminDashboard() {
  const [user, stats, messages, activity] = await Promise.all([
    getCurrentUser(),
    getDashboardStats(),
    getRecentMessages(5),
    getRecentActivity(8),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
        </h1>
        <p className="text-foreground/60 mt-2">
          Everything on your site is editable here. Saved changes go live immediately.
        </p>
      </header>

      {stats.unread > 0 && (
        <Link
          href="/admin/messages"
          className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-accent-coral/30 bg-accent-coral/5 hover:bg-accent-coral/10 transition-colors"
        >
          <div>
            <div className="font-semibold text-foreground">
              {stats.unread} unread {stats.unread === 1 ? "message" : "messages"}
            </div>
            <div className="text-sm text-foreground/60 mt-0.5">Someone got in touch through the contact form.</div>
          </div>
          <ArrowRight className="w-5 h-5 text-accent-coral shrink-0" />
        </Link>
      )}

      {/* Resource tiles */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-4">Content</h2>
        {/* auto-fill rather than a fixed column count, so the tiles keep
            reaching the right edge at any window width. */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
          {RESOURCES.filter((r) => !r.singleton).map((r) => (
            <Link
              key={r.slug}
              href={`/admin/${r.slug}`}
              className="group p-5 rounded-2xl border border-border bg-foreground/[0.02] hover:bg-foreground/5 hover:border-foreground/20 transition-colors"
            >
              <Icon name={r.icon} className="w-5 h-5 text-foreground/50 group-hover:text-accent-violet transition-colors mb-3" />
              <div className="text-2xl font-bold tabular-nums">{stats[COUNT_FOR[r.slug]] ?? 0}</div>
              <div className="text-sm text-foreground/60 mt-0.5">{r.label}</div>
            </Link>
          ))}

          <Link
            href="/admin/settings"
            className="group p-5 rounded-2xl border border-border bg-foreground/[0.02] hover:bg-foreground/5 hover:border-foreground/20 transition-colors"
          >
            <Icon name="Sparkles" className="w-5 h-5 text-foreground/50 group-hover:text-accent-violet transition-colors mb-3" />
            <div className="text-sm font-semibold mt-6">Site settings</div>
            <div className="text-sm text-foreground/60 mt-0.5">Brand, nav, buttons</div>
          </Link>
        </div>
      </section>

      {/* Two panels only — they stretch to fill rather than leaving a gap. */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inbox preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/50">Recent messages</h2>
            <Link href="/admin/messages" className="text-xs font-semibold text-accent-violet hover:underline">
              View all
            </Link>
          </div>

          {messages.length === 0 ? (
            <p className="text-sm text-foreground/50 p-5 rounded-2xl border border-dashed border-border">
              No messages yet. They&apos;ll appear here when someone uses the contact form.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {messages.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/admin/messages/${m.id}`}
                    className="flex flex-col gap-1 p-4 rounded-xl border border-border hover:bg-foreground/5 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-sm truncate">{m.name}</span>
                      <span className="flex items-center gap-2 shrink-0">
                        {m.status === "new" && <span className="w-1.5 h-1.5 rounded-full bg-accent-coral" />}
                        <span className="text-xs text-foreground/40">{relative(m.createdAt)}</span>
                      </span>
                    </div>
                    <span className="text-xs text-foreground/60 truncate">{m.message}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Audit trail */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-4">Recent changes</h2>

          {activity.length === 0 ? (
            <p className="text-sm text-foreground/50 p-5 rounded-2xl border border-dashed border-border">
              Nothing yet. Every edit you make gets logged here.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {activity.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border">
                  <span className="text-sm truncate">
                    <span className="font-medium capitalize">{a.action}</span>{" "}
                    <span className="text-foreground/60">{a.entity}</span>
                  </span>
                  <span className="text-xs text-foreground/40 shrink-0">{relative(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
