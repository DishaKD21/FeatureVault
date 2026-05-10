"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { THEME_STORAGE_KEY } from "@/styles/colors";
import { applyThemeDom } from "./theme-dom";

const ThemeContext = createContext(null);

function readStoredTheme() {
  if (typeof window === "undefined") return "light";
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    applyThemeDom(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== THEME_STORAGE_KEY || e.newValue == null) return;
      const next = e.newValue === "dark" ? "dark" : "light";
      setThemeState(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
