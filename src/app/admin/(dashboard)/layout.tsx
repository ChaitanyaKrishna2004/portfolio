import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ContactMessage } from "@/models";
import { AdminNav } from "./AdminNav";

// Every admin page renders through this layout, and the guard runs per request.
// force-dynamic keeps it out of the static cache, so a signed-out visitor can
// never be served a cached admin shell.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const unread = await ContactMessage.count({ where: { status: "new" } });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <AdminNav user={user} unread={unread} />
      {/* No max-width cap: the admin is a workspace, so it uses the whole
          viewport rather than leaving a dead column on wide screens. */}
      <main className="flex-1 min-w-0">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
