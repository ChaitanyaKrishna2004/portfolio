"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ICONS, Icon } from "@/lib/iconRegistry";
import type { FieldDef } from "@/lib/adminSchema";

export const inputBase =
  "w-full bg-background/70 border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-2 focus:ring-accent-violet/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed";

export const borderOk = "border-border focus:border-accent-violet";
export const borderBad = "border-red-500/60 focus:border-red-500";

export function FieldShell({
  label,
  help,
  error,
  required,
  children,
  htmlFor,
  action,
}: {
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-foreground">
          {label}
          {required && <span className="text-accent-coral ml-0.5">*</span>}
        </label>
        {action}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : (
        help && <p className="text-xs text-foreground/45 leading-relaxed">{help}</p>
      )}
    </div>
  );
}

/** A searchable icon picker — beats typing "SiNextdotjs" from memory. */
export function IconPicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const names = Object.keys(ICONS);
  const matches = query
    ? names.filter((n) => n.toLowerCase().includes(query.toLowerCase())).slice(0, 60)
    : names.slice(0, 60);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-foreground/70">
            <Icon name={value} className="w-4 h-4" fallback={<span className="w-2 h-2 rounded-full bg-foreground/15" />} />
          </span>
          <input
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder="None"
            className={`${inputBase} ${borderOk} pl-9 font-mono text-[13px]`}
          />
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className="px-3 rounded-xl border border-border text-xs font-medium text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors shrink-0 disabled:opacity-60"
        >
          Browse
        </button>
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-border bg-background shadow-2xl p-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons…"
            className={`${inputBase} ${borderOk} mb-3`}
          />
          <div className="grid grid-cols-8 gap-1 max-h-56 overflow-y-auto">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              title="None"
              className="aspect-square rounded-lg border border-dashed border-border flex items-center justify-center text-foreground/30 hover:bg-foreground/5"
            >
              &times;
            </button>
            {matches.map((name) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setOpen(false); }}
                className={`aspect-square rounded-lg flex items-center justify-center transition-colors ${
                  value === name ? "bg-accent-violet/15 text-accent-violet ring-1 ring-accent-violet/40" : "hover:bg-foreground/5 text-foreground/70"
                }`}
              >
                <Icon name={name} className="w-4 h-4" />
              </button>
            ))}
          </div>
          {matches.length === 0 && (
            <p className="text-xs text-foreground/50 py-3 text-center">No icon matches “{query}”.</p>
          )}
        </div>
      )}
    </div>
  );
}

/** Hex swatch plus the "foreground" theme token. */
export function ColorInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const isHex = /^#[0-9a-f]{3,8}$/i.test(value);

  return (
    <div className="flex gap-2">
      <div
        className={`w-10 shrink-0 rounded-xl border border-border ${isHex ? "" : "bg-foreground"}`}
        style={isHex ? { backgroundColor: value } : undefined}
        aria-hidden="true"
      />
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#0077b5 or foreground"
        className={`${inputBase} ${borderOk} font-mono text-[13px]`}
      />
      <input
        type="color"
        disabled={disabled}
        value={isHex ? value.slice(0, 7) : "#888888"}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Pick a colour"
        className="w-10 h-[42px] shrink-0 rounded-xl border border-border bg-transparent cursor-pointer disabled:opacity-60"
      />
    </div>
  );
}

export function Collapsible({
  title,
  subtitle,
  defaultOpen = false,
  right,
  children,
}: {
  title: React.ReactNode;
  subtitle?: string;
  defaultOpen?: boolean;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border bg-background/40 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left group"
        >
          <ChevronDown
            className={`w-4 h-4 shrink-0 text-foreground/40 transition-transform ${open ? "" : "-rotate-90"}`}
          />
          <span className="text-sm font-medium truncate group-hover:text-accent-violet transition-colors">{title}</span>
          {subtitle && <span className="text-xs text-foreground/40 truncate hidden sm:inline">{subtitle}</span>}
        </button>
        {right}
      </div>
      {open && <div className="px-3 pb-3 pt-1 border-t border-border/60">{children}</div>}
    </div>
  );
}

/** Span inside a nested two-column grid (object rows, groups). */
export function spanClass(field: FieldDef): string {
  return field.span === "half" ? "sm:col-span-1" : "sm:col-span-2";
}

/**
 * Span inside a top-level panel, which widens to three columns on very large
 * screens so the form fills the viewport without inputs becoming unreadably
 * long. Full-width fields must span every column at each breakpoint.
 */
export function panelSpanClass(field: FieldDef): string {
  return field.span === "half" ? "sm:col-span-1" : "sm:col-span-2 2xl:col-span-3";
}
