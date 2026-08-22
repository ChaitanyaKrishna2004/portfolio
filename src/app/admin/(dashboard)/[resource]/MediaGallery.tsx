"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, Upload } from "lucide-react";
import { MediaThumb, humanSize, type MediaRow } from "./fields/MediaField";

/** Media is browsed visually, so it gets a gallery rather than the generic table. */
export function MediaGallery({ rows }: { rows: MediaRow[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const uploadMany = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;

      setBusy(true);
      setErrors([]);
      setProgress({ done: 0, total: list.length });

      const failed: string[] = [];

      for (const [i, file] of list.entries()) {
        const body = new FormData();
        body.append("file", file);

        try {
          const res = await fetch("/api/admin/media/upload", { method: "POST", body });
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            failed.push(`${file.name}: ${j.error ?? "upload failed"}`);
          }
        } catch {
          failed.push(`${file.name}: could not reach the server`);
        }

        setProgress({ done: i + 1, total: list.length });
      }

      setErrors(failed);
      setBusy(false);
      setProgress(null);
      router.refresh();
    },
    [router]
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media</h1>
          <p className="text-sm text-foreground/60 mt-1">
            {rows.length} {rows.length === 1 ? "file" : "files"} · drop new ones anywhere below
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 disabled:opacity-60 transition-colors"
        >
          {busy ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {busy && progress ? `Uploading ${progress.done}/${progress.total}…` : "Upload files"}
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) uploadMany(e.target.files);
            e.target.value = "";
          }}
        />
      </header>

      {errors.length > 0 && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/[0.07] px-4 py-3">
          <p className="text-sm font-medium text-red-500 mb-1">
            {errors.length} {errors.length === 1 ? "file" : "files"} didn&apos;t upload
          </p>
          <ul className="text-xs text-red-500/90 list-disc pl-4 space-y-0.5">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files) uploadMany(e.dataTransfer.files);
        }}
        className={`rounded-2xl border border-dashed transition-colors p-4 ${
          dragging ? "border-accent-violet bg-accent-violet/5" : "border-border"
        }`}
      >
        {rows.length === 0 ? (
          <div className="py-16 text-center">
            <Upload className="w-8 h-8 mx-auto text-foreground/20 mb-3" />
            <p className="text-foreground/60">Nothing uploaded yet.</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-sm font-semibold text-accent-violet hover:underline mt-1"
            >
              Choose your first file
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3">
            {rows.map((m) => (
              <Link
                key={m.id}
                href={`/admin/media/${m.id}`}
                className="group rounded-xl border border-border overflow-hidden hover:border-accent-violet transition-colors bg-background/40"
              >
                <MediaThumb url={m.url} className="w-full aspect-video" />
                <div className="p-2.5">
                  <p className="text-xs font-medium truncate group-hover:text-accent-violet transition-colors">
                    {m.url.split("/").pop()}
                  </p>
                  <p className="text-[10px] text-foreground/40 mt-0.5 tabular-nums">
                    {m.type}
                    {m.bytes ? ` · ${humanSize(m.bytes)}` : ""}
                    {m.width && m.height ? ` · ${m.width}×${m.height}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
