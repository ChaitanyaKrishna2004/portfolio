import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSiteSettings } from "@/services/site.service";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  const site = await getSiteSettings();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-sm glass-panel rounded-3xl border border-border p-8 sm:p-10 shadow-2xl bg-background/70 backdrop-blur-xl">
        <LoginForm brandName={site.brandName} />
      </div>
    </div>
  );
}
