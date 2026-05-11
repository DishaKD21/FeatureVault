"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

/** Pill toggle — persists via ThemeProvider / localStorage. */
export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      suppressHydrationWarning
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      disabled={!mounted}
      className={cn(
        "relative hidden h-9 w-[4.125rem] shrink-0 cursor-pointer items-center px-2 min-[800px]:inline-flex",
        "rounded-full border border-border bg-muted/60 shadow-fv-soft",
        "transition-[background-color,border-color,box-shadow] duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/35",
        "disabled:pointer-events-none disabled:opacity-60",
        "hover:border-primary/35 hover:bg-muted supports-[backdrop-filter]:backdrop-blur-sm",
        className,
      )}
    >
      <span className="relative z-[1] flex w-full justify-between px-0.5">
        <Sun
          className={cn("size-4 text-amber-500 transition-opacity duration-300", isDark ? "opacity-30" : "opacity-95")}
          aria-hidden
        />
        <Moon
          className={cn("size-4 text-primary transition-opacity duration-300", isDark ? "opacity-95" : "opacity-30")}
          aria-hidden
        />
      </span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1 top-1 flex size-[1.75rem] rounded-full bg-card shadow-fv-soft ring-1 ring-border transition-transform duration-300 ease-out dark:bg-card/90",
          isDark ? "translate-x-[1.8125rem]" : "translate-x-0",
        )}
      />
    </button>
  );
}
