"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, LoaderCircle } from "lucide-react";

export function LoginForm({ brandName }: { brandName: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }

      setError(body.error ?? "Sign in failed.");
      setBusy(false);
    } catch {
      setError("Could not reach the server. Is it running?");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {brandName}<span className="text-accent-violet">.</span> admin
        </h1>
        <p className="text-sm text-foreground/60 mt-1">Sign in to edit your site content.</p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Email</span>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            autoFocus
            className="w-full bg-background/60 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-violet transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Password</span>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full bg-background/60 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-violet transition-colors"
            placeholder="••••••••••••"
          />
        </div>
      </label>

      <div aria-live="polite" className="min-h-[1.25rem]">
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        {busy && <LoaderCircle className="w-4 h-4 animate-spin" />}
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
