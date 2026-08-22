"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, CircleAlert, LoaderCircle, Save, Trash2 } from "lucide-react";
import { isStructured, type FieldDef, type ResourceDef } from "@/lib/adminSchema";
import { FieldRenderer } from "./fields/FieldRenderer";
import { panelSpanClass } from "./fields/Primitives";

type Values = Record<string, unknown>;

/**
 * Structured editors work on real objects; only the raw-JSON escape hatch and
 * the date input need string forms.
 */
function initialValue(field: FieldDef, row: Values): unknown {
  const raw = row[field.key];

  if (isStructured(field.type)) {
    if (raw != null) return raw;
    return field.type === "list" || field.type === "objectList" ? [] : {};
  }
  if (field.type === "boolean") return Boolean(raw);
  if (field.type === "json") return raw == null ? "" : JSON.stringify(raw, null, 2);
  if (field.type === "date") {
    if (!raw) return "";
    const d = new Date(raw as string);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  }
  if (field.type === "number") return raw ?? "";
  return raw == null ? "" : String(raw);
}

export function RecordForm({
  resource,
  fields,
  row,
  isNew,
}: {
  resource: ResourceDef;
  fields: FieldDef[];
  row: Values;
  isNew: boolean;
}) {
  const router = useRouter();

  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(fields.map((f) => [f.key, initialValue(f, row)]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dirty, setDirty] = useState(false);

  const listHref = `/admin/${resource.slug}`;
  const byKey = useMemo(() => new Map(fields.map((f) => [f.key, f])), [fields]);

  function set(key: string, value: unknown) {
    setValues((v) => ({ ...v, [key]: value }));
    setDirty(true);
    setMessage(null);
  }

  /** Only the raw-JSON escape hatch can still contain unparseable text. */
  function validate(): boolean {
    const found: Record<string, string> = {};

    for (const f of fields) {
      if (f.readOnly) continue;

      if (f.type === "json") {
        const raw = values[f.key];
        if (typeof raw === "string" && raw.trim() !== "") {
          try {
            JSON.parse(raw);
          } catch (err) {
            found[f.key] = `Not valid JSON — ${(err as Error).message}`;
          }
        }
      }

      if (f.required) {
        const v = values[f.key];
        if (v === "" || v === null || v === undefined) found[f.key] = `${f.label} is required.`;
      }
    }

    setErrors(found);
    return Object.keys(found).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (!validate()) {
      setMessage({ kind: "error", text: "Some fields need attention — see the highlights below." });
      return;
    }

    setBusy(true);

    const url = isNew ? `/api/admin/${resource.slug}` : `/api/admin/${resource.slug}/${row.id}`;
    const payload: Values = { ...values };
    if (!isNew) payload.__updatedAt = row.updatedAt;

    try {
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setDirty(false);
        setMessage({ kind: "ok", text: isNew ? "Created — it's live on the site." : "Saved — the live site is updated." });
        setBusy(false);
        if (isNew && body.id) router.replace(`${listHref}/${body.id}`);
        router.refresh();
        return;
      }

      if (body.errors) setErrors(body.errors);
      setMessage({ kind: "error", text: body.error ?? "Some fields need attention." });
    } catch {
      setMessage({ kind: "error", text: "Could not reach the server." });
    }

    setBusy(false);
  }

  async function onDelete() {
    const label = String(row[resource.titleField] ?? "this record");
    if (!confirm(`Delete “${label}”? This cannot be undone.`)) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/${resource.slug}/${row.id}`, { method: "DELETE" });

    if (res.ok) {
      router.replace(listHref);
      router.refresh();
      return;
    }

    const body = await res.json().catch(() => ({}));
    setMessage({ kind: "error", text: body.error ?? "Could not delete." });
    setDeleting(false);
  }

  // Fields not named by any group still render, in a trailing panel.
  const panels = useMemo(() => {
    if (!resource.groups?.length) {
      return [{ title: "", description: undefined as string | undefined, fields }];
    }
    const claimed = new Set(resource.groups.flatMap((g) => g.keys));
    const groups = resource.groups.map((g) => ({
      title: g.title,
      description: g.description,
      fields: g.keys.map((k) => byKey.get(k)).filter(Boolean) as FieldDef[],
    }));
    const rest = fields.filter((f) => !claimed.has(f.key));
    if (rest.length) groups.push({ title: "Other", description: undefined, fields: rest });
    return groups.filter((g) => g.fields.length > 0);
  }, [resource.groups, fields, byKey]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 pb-24">
      {/* Sticky action bar */}
      {/* Negative margins mirror the layout's padding so the bar spans edge to edge. */}
      <header className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            {!resource.singleton && (
              <Link href={listHref} className="inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground transition-colors mb-1">
                <ArrowLeft className="w-3 h-3" /> {resource.label}
              </Link>
            )}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
              {isNew ? `New ${resource.singular.toLowerCase()}` : String(row[resource.titleField] ?? resource.singular)}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {dirty && !busy && (
              <span className="text-xs text-foreground/45 hidden sm:inline">Unsaved changes</span>
            )}
            {!isNew && resource.canDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-foreground/60 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/5 transition-colors disabled:opacity-60"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{deleting ? "Deleting…" : "Delete"}</span>
              </button>
            )}
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 disabled:opacity-60 transition-colors"
            >
              {busy ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {busy ? "Saving…" : isNew ? "Create" : "Save"}
            </button>
          </div>
        </div>
      </header>

      {message && (
        <div
          aria-live="polite"
          className={`flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm border ${
            message.kind === "ok"
              ? "border-green-500/25 bg-green-500/[0.07] text-green-600 dark:text-green-400"
              : "border-red-500/25 bg-red-500/[0.07] text-red-500"
          }`}
        >
          {message.kind === "ok" ? <Check className="w-4 h-4 mt-0.5 shrink-0" /> : <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {panels.map((panel, i) => (
        <section key={panel.title || i} className="rounded-2xl border border-border bg-foreground/[0.015] overflow-hidden">
          {panel.title && (
            <div className="px-5 sm:px-6 py-4 border-b border-border bg-foreground/[0.02]">
              <h2 className="text-sm font-semibold tracking-tight">{panel.title}</h2>
              {panel.description && (
                <p className="text-xs text-foreground/50 mt-1 leading-relaxed">{panel.description}</p>
              )}
            </div>
          )}

          <div className="p-5 sm:p-6 grid sm:grid-cols-2 2xl:grid-cols-3 gap-5">
            {panel.fields.map((field) => (
              <div key={field.key} className={panelSpanClass(field)}>
                <FieldRenderer
                  field={field}
                  value={values[field.key]}
                  error={errors[field.key]}
                  onChange={(v) => set(field.key, v)}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </form>
  );
}
