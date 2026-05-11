"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/styles/colors";
import { mediaMinWide } from "@/lib/viewportBreakpoints";
import { applyThemeDom } from "./theme-dom";

const ThemeContext = createContext(null);

function readStoredPreference() {
  if (typeof window === "undefined") return "light";
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function subscribeWide(callback) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(mediaMinWide);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getWideSnapshot() {
  if (typeof window === "undefined") return true;
  return window.matchMedia(mediaMinWide).matches;
}

/** SSR / first server pass: assume wide so stored preference can apply until client corrects. */
function getServerWideSnapshot() {
  return true;
}

/**
 * `preference` is what the user chose (persisted). `theme` is what is applied to the DOM:
 * viewports under 800px always use light for readability (theme toggle is hidden there).
 */
export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => readStoredPreference());
  const isWide = useSyncExternalStore(subscribeWide, getWideSnapshot, getServerWideSnapshot);

  const theme = isWide ? preference : "light";

  useEffect(() => {
    applyThemeDom(theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {}
  }, [preference]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== THEME_STORAGE_KEY || e.newValue == null) return;
      const next = e.newValue === "dark" ? "dark" : "light";
      setPreference(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next) => {
    setPreference(next === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, preference, setTheme, toggleTheme }),
    [theme, preference, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
