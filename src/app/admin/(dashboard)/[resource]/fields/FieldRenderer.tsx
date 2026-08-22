"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { FieldDef } from "@/lib/adminSchema";
import {
  FieldShell, IconPicker, ColorInput, Collapsible,
  inputBase, borderOk, borderBad, spanClass,
} from "./Primitives";
import { RichTextEditor } from "./RichTextEditor";
import { MediaField } from "./MediaField";

type Val = unknown;

interface Props {
  field: FieldDef;
  value: Val;
  error?: string;
  onChange: (v: Val) => void;
}

/* ------------------------------------------------------------ dispatcher */

export function FieldRenderer({ field, value, error, onChange }: Props) {
  switch (field.type) {
    case "list":
      return <ListEditor field={field} value={value} error={error} onChange={onChange} />;
    case "objectList":
      return <ObjectListEditor field={field} value={value} error={error} onChange={onChange} />;
    case "keyValue":
      return <KeyValueEditor field={field} value={value} error={error} onChange={onChange} />;
    case "objectMap":
      return <ObjectMapEditor field={field} value={value} error={error} onChange={onChange} />;
    case "group":
      return <GroupEditor field={field} value={value} error={error} onChange={onChange} />;
    default:
      return <ScalarField field={field} value={value} error={error} onChange={onChange} />;
  }
}

/* --------------------------------------------------------------- scalars */

function ScalarField({ field, value, error, onChange }: Props) {
  const border = error ? borderBad : borderOk;

  if (field.type === "boolean") {
    return (
      <label className="flex items-start gap-3 cursor-pointer group">
        <span className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={Boolean(value)}
            disabled={field.readOnly}
            onChange={(e) => onChange(e.target.checked)}
            className="peer sr-only"
          />
          <span className="block w-9 h-5 rounded-full bg-foreground/15 peer-checked:bg-accent-violet transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent-violet/40" />
          <span className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-background shadow transition-transform peer-checked:translate-x-4" />
        </span>
        <span className="flex flex-col">
          <span className="text-[13px] font-medium group-hover:text-accent-violet transition-colors">{field.label}</span>
          {field.help && <span className="text-xs text-foreground/45 mt-0.5">{field.help}</span>}
        </span>
      </label>
    );
  }

  if (field.type === "media") {
    return (
      <FieldShell label={field.label} help={field.help} error={error} required={field.required}>
        <MediaField
          value={String(value ?? "")}
          onChange={onChange}
          disabled={field.readOnly}
          accept={field.accept}
        />
      </FieldShell>
    );
  }

  if (field.type === "icon") {
    return (
      <FieldShell label={field.label} help={field.help} error={error} required={field.required}>
        <IconPicker value={String(value ?? "")} onChange={onChange} disabled={field.readOnly} />
      </FieldShell>
    );
  }

  if (field.type === "color") {
    return (
      <FieldShell label={field.label} help={field.help} error={error} required={field.required}>
        <ColorInput value={String(value ?? "")} onChange={onChange} disabled={field.readOnly} />
      </FieldShell>
    );
  }

  if (field.type === "select") {
    return (
      <FieldShell label={field.label} help={field.help} error={error} required={field.required}>
        <select
          value={String(value ?? "")}
          disabled={field.readOnly}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} ${border} cursor-pointer`}
        >
          {!field.required && <option value="">—</option>}
          {field.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </FieldShell>
    );
  }

  if (field.type === "mdx") {
    return (
      <FieldShell label={field.label} help={field.help} error={error} required={field.required}>
        <RichTextEditor
          value={String(value ?? "")}
          onChange={onChange}
          disabled={field.readOnly}
        />
      </FieldShell>
    );
  }

  if (field.type === "textarea" || field.type === "json") {
    const isCode = field.type !== "textarea";
    return (
      <FieldShell
        label={field.label}
        help={field.help}
        error={error}
        required={field.required}
        action={isCode ? <span className="text-[10px] uppercase tracking-wider text-foreground/35">{field.type}</span> : undefined}
      >
        <textarea
          rows={field.rows ?? 4}
          value={String(value ?? "")}
          disabled={field.readOnly}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={!isCode}
          className={`${inputBase} ${border} resize-y leading-relaxed ${isCode ? "font-mono text-[13px]" : ""}`}
        />
      </FieldShell>
    );
  }

  return (
    <FieldShell label={field.label} help={field.help} error={error} required={field.required}>
      <input
        type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
        value={String(value ?? "")}
        disabled={field.readOnly}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)}
        className={`${inputBase} ${border}`}
      />
    </FieldShell>
  );
}

/* ------------------------------------------------------------ list (strings) */

function ListEditor({ field, value, error, onChange }: Props) {
  const items: string[] = Array.isArray(value) ? (value as string[]) : [];

  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, x) => x !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <FieldShell label={field.label} help={field.help} error={error}>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              value={item ?? ""}
              onChange={(e) => update(i, e.target.value)}
              className={`${inputBase} ${borderOk}`}
            />
            <RowButtons
              onUp={() => move(i, -1)}
              onDown={() => move(i, 1)}
              onRemove={() => remove(i)}
              disableUp={i === 0}
              disableDown={i === items.length - 1}
            />
          </div>
        ))}

        <AddButton label={field.itemLabel ?? "item"} onClick={() => onChange([...items, ""])} />
      </div>
    </FieldShell>
  );
}

/* ------------------------------------------------- objectList (array of rows) */

function ObjectListEditor({ field, value, error, onChange }: Props) {
  const items: Record<string, unknown>[] = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const sub = field.itemFields ?? [];

  const blank = () =>
    Object.fromEntries(
      sub.map((f) => [
        f.key,
        f.type === "boolean" ? false : f.type === "number" ? (f.key === "order" ? items.length + 1 : null) : f.type === "list" ? [] : "",
      ])
    );

  const patch = (i: number, key: string, v: unknown) => {
    const next = [...items];
    next[i] = { ...next[i], [key]: v };
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, x) => x !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <FieldShell
      label={field.label}
      help={field.help}
      error={error}
      action={<span className="text-xs text-foreground/40 tabular-nums">{items.length}</span>}
    >
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const title = String(item[field.itemTitleKey ?? "name"] ?? "") || `${field.itemLabel ?? "Item"} ${i + 1}`;
          return (
            <Collapsible
              key={i}
              title={title}
              defaultOpen={items.length <= 2}
              right={
                <RowButtons
                  onUp={() => move(i, -1)}
                  onDown={() => move(i, 1)}
                  onRemove={() => remove(i)}
                  disableUp={i === 0}
                  disableDown={i === items.length - 1}
                />
              }
            >
              <div className="grid sm:grid-cols-2 gap-4 pt-3">
                {sub.map((f) => (
                  <div key={f.key} className={spanClass(f)}>
                    <FieldRenderer field={f} value={item[f.key]} onChange={(v) => patch(i, f.key, v)} />
                  </div>
                ))}
              </div>
            </Collapsible>
          );
        })}

        <AddButton label={field.itemLabel ?? "item"} onClick={() => onChange([...items, blank()])} />
      </div>
    </FieldShell>
  );
}

/* ------------------------------------------------------- keyValue (text map) */

function KeyValueEditor({ field, value, error, onChange }: Props) {
  const obj = (value && typeof value === "object" ? value : {}) as Record<string, string>;
  const entries = Object.entries(obj);

  const commit = (next: [string, string][]) => onChange(Object.fromEntries(next));

  return (
    <FieldShell
      label={field.label}
      help={field.help}
      error={error}
      action={<span className="text-xs text-foreground/40 tabular-nums">{entries.length}</span>}
    >
      <div className="flex flex-col gap-2">
        {entries.length > 0 && (
          <div className="hidden sm:grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-1.5 px-1">
            <span className="text-[10px] uppercase tracking-wider text-foreground/40">{field.keyLabel ?? "Key"}</span>
            <span className="text-[10px] uppercase tracking-wider text-foreground/40">{field.valueLabel ?? "Value"}</span>
            <span className="w-[86px]" />
          </div>
        )}

        {entries.map(([k, v], i) => (
          <div key={i} className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-1.5">
            <input
              value={k}
              onChange={(e) => {
                const next = [...entries] as [string, string][];
                next[i] = [e.target.value, v];
                commit(next);
              }}
              className={`${inputBase} ${borderOk} font-mono text-[13px]`}
            />
            <input
              value={v ?? ""}
              onChange={(e) => {
                const next = [...entries] as [string, string][];
                next[i] = [k, e.target.value];
                commit(next);
              }}
              className={`${inputBase} ${borderOk}`}
            />
            <RowButtons onRemove={() => commit(entries.filter((_, x) => x !== i) as [string, string][])} />
          </div>
        ))}

        <AddButton
          label={field.itemLabel ?? "entry"}
          onClick={() => commit([...(entries as [string, string][]), ["", ""]])}
        />
      </div>
    </FieldShell>
  );
}

/* --------------------------------------------- objectMap (key → object rows) */

function ObjectMapEditor({ field, value, error, onChange }: Props) {
  const obj = (value && typeof value === "object" ? value : {}) as Record<string, Record<string, unknown>>;
  const entries = Object.entries(obj);
  const sub = field.itemFields ?? [];

  const commit = (next: [string, Record<string, unknown>][]) => onChange(Object.fromEntries(next));

  return (
    <FieldShell
      label={field.label}
      help={field.help}
      error={error}
      action={<span className="text-xs text-foreground/40 tabular-nums">{entries.length}</span>}
    >
      <div className="flex flex-col gap-2">
        {entries.map(([k, v], i) => (
          <Collapsible
            key={i}
            title={String(v?.label ?? k) || k}
            subtitle={k}
            defaultOpen={false}
            right={<RowButtons onRemove={() => commit(entries.filter((_, x) => x !== i) as [string, Record<string, unknown>][])} />}
          >
            <div className="grid sm:grid-cols-2 gap-4 pt-3">
              <div className="sm:col-span-2">
                <FieldShell label={field.keyLabel ?? "Key"} help="Referenced in code.">
                  <input
                    value={k}
                    onChange={(e) => {
                      const next = [...entries] as [string, Record<string, unknown>][];
                      next[i] = [e.target.value, v];
                      commit(next);
                    }}
                    className={`${inputBase} ${borderOk} font-mono text-[13px]`}
                  />
                </FieldShell>
              </div>

              {sub.map((f) => (
                <div key={f.key} className={spanClass(f)}>
                  <FieldRenderer
                    field={f}
                    value={v?.[f.key]}
                    onChange={(nv) => {
                      const next = [...entries] as [string, Record<string, unknown>][];
                      next[i] = [k, { ...v, [f.key]: nv }];
                      commit(next);
                    }}
                  />
                </div>
              ))}
            </div>
          </Collapsible>
        ))}

        <AddButton
          label={field.itemLabel ?? "entry"}
          onClick={() => commit([...(entries as [string, Record<string, unknown>][]), ["new.key", { label: "" }]])}
        />
      </div>
    </FieldShell>
  );
}

/* ------------------------------------------------------ group (fixed object) */

function GroupEditor({ field, value, onChange }: Props) {
  const obj = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const sub = field.itemFields ?? [];

  if (sub.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {field.help && <p className="text-xs text-foreground/45">{field.help}</p>}
      <div className="grid sm:grid-cols-2 gap-5">
        {sub.map((f) => (
          <div key={f.key} className={spanClass(f)}>
            <FieldRenderer
              field={f}
              value={obj[f.key]}
              onChange={(v) => onChange({ ...obj, [f.key]: v })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- controls */

function RowButtons({
  onUp,
  onDown,
  onRemove,
  disableUp,
  disableDown,
}: {
  onUp?: () => void;
  onDown?: () => void;
  onRemove: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  const btn =
    "w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground/45 hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent shrink-0";

  return (
    <div className="flex items-center gap-1 shrink-0">
      {onUp && (
        <button type="button" onClick={onUp} disabled={disableUp} aria-label="Move up" className={btn}>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      )}
      {onDown && (
        <button type="button" onClick={onDown} disabled={disableDown} aria-label="Move down" className={btn}>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove"
        className={`${btn} hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/5`}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-border text-xs font-medium text-foreground/55 hover:text-accent-violet hover:border-accent-violet/40 hover:bg-accent-violet/5 transition-colors"
    >
      <Plus className="w-3.5 h-3.5" />
      Add {label}
    </button>
  );
}
