"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

/**
 * next-themes can't know the resolved theme until it has read localStorage, so
 * the first client render must match the server's. useSyncExternalStore gives
 * us that without a setState-in-effect.
 */
const emptySubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

export function AdminThemeToggle() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex items-center gap-0.5 p-0.5 rounded-lg border border-border bg-background/50"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            title={label}
            onClick={() => setTheme(value)}
            className={`flex-1 h-7 rounded-md flex items-center justify-center transition-colors ${
              active
                ? "bg-foreground/10 text-foreground"
                : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
