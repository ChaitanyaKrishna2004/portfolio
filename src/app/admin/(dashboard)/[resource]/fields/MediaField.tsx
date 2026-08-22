"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, ImageIcon, LoaderCircle, Upload, X } from "lucide-react";

export interface MediaRow {
  id: string;
  url: string;
  type: string;
  altText: string | null;
  format: string | null;
  bytes: number | null;
  width: number | null;
  height: number | null;
}

function humanSize(bytes?: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function kindOf(url: string): "image" | "video" | "document" {
  const ext = url.split(".").pop()?.toLowerCase() ?? "";
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  if (["pdf"].includes(ext)) return "document";
  return "image";
}

/** Thumbnail that copes with images, video and documents. */
export function MediaThumb({ url, className = "" }: { url: string; className?: string }) {
  const kind = kindOf(url);

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-foreground/5 text-foreground/25 ${className}`}>
        <ImageIcon className="w-5 h-5" />
      </div>
    );
  }

  if (kind === "video") {
    return <video src={url} muted playsInline className={`object-cover bg-foreground/5 ${className}`} />;
  }

  if (kind === "document") {
    return (
      <div className={`flex items-center justify-center bg-foreground/5 text-foreground/40 ${className}`}>
        <FileText className="w-5 h-5" />
      </div>
    );
  }

  // Plain <img>: these are admin previews, not part of the public page, so
  // next/image optimisation would only add latency here.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={`object-cover bg-foreground/5 ${className}`} />;
}

export function MediaField({
  value,
  onChange,
  disabled,
  accept,
}: {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setBusy(true);
      setError(null);

      const body = new FormData();
      body.append("file", file);

      try {
        const res = await fetch("/api/admin/media/upload", { method: "POST", body });
        const json = await res.json().catch(() => ({}));

        if (res.ok && json.media?.url) {
          onChange(json.media.url);
        } else {
          setError(json.error ?? "Upload failed.");
        }
      } catch {
        setError("Could not reach the server.");
      }

      setBusy(false);
    },
    [onChange]
  );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex items-center gap-3 rounded-xl border border-dashed p-3 transition-colors ${
          dragging ? "border-accent-violet bg-accent-violet/5" : "border-border bg-background/50"
        }`}
      >
        <MediaThumb url={value} className="w-16 h-16 rounded-lg shrink-0" />

        <div className="flex-1 min-w-0">
          {value ? (
            <>
              <p className="text-[13px] font-medium truncate">{value.split("/").pop()}</p>
              <p className="text-xs text-foreground/45 truncate">{value}</p>
            </>
          ) : (
            <p className="text-[13px] text-foreground/50">
              Drop a file here, or choose one below.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 disabled:opacity-60 transition-colors"
            >
              {busy ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {busy ? "Uploading…" : "Upload"}
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => setLibraryOpen(true)}
              className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors"
            >
              Choose existing
            </button>

            {value && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange("")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground/50 hover:text-red-500 hover:border-red-500/40 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = ""; // allow re-picking the same file
          }}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {libraryOpen && (
        <MediaLibrary
          onPick={(url) => { onChange(url); setLibraryOpen(false); }}
          onClose={() => setLibraryOpen(false)}
        />
      )}
    </div>
  );
}

/* --------------------------------------------------------------- library */

export function MediaLibrary({
  onPick,
  onClose,
}: {
  onPick: (url: string) => void;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<MediaRow[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((j) => setRows(j.ok ? j.rows : []))
      .catch(() => setRows([]));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const visible = (rows ?? []).filter(
    (r) => !query || r.url.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[80vh] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Media library</h3>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name…"
            className="flex-1 bg-background/70 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent-violet"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground/50 hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {rows === null ? (
            <p className="text-sm text-foreground/40 text-center py-10">Loading…</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-foreground/40 text-center py-10">
              {query ? `Nothing matches “${query}”.` : "Nothing uploaded yet."}
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3">
              {visible.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onPick(m.url)}
                  className="group text-left rounded-xl border border-border overflow-hidden hover:border-accent-violet transition-colors"
                >
                  <MediaThumb url={m.url} className="w-full aspect-video" />
                  <div className="p-2">
                    <p className="text-[11px] font-medium truncate">{m.url.split("/").pop()}</p>
                    <p className="text-[10px] text-foreground/40">
                      {m.type}{m.bytes ? ` · ${humanSize(m.bytes)}` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { humanSize };
