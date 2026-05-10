/**
 * Central semantic tokens mapped to CSS variables (globals.css + theme.css).
 * Change primary scale here conceptually via CSS vars so the entire app picks it up.
 */
export const THEME_STORAGE_KEY = "featurevault-theme";

export const cssVar = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  muted: "var(--muted)",
  border: "var(--border)",
  card: "var(--card)",
};
