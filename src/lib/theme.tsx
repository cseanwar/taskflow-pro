"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "tfp_theme";
const COOKIE_KEY = "tfp_theme";

export { THEME_SCRIPT } from "./theme-script";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolve(systemPrefersLight: boolean, theme: Theme): ResolvedTheme {
  if (theme === "system") return systemPrefersLight ? "light" : "dark";
  return theme;
}

function readStored(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
}

function persist(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
    document.cookie = `${COOKIE_KEY}=${theme}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* storage unavailable — theme just won't persist */
  }
}

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [systemPrefersLight, setSystemPrefersLight] = useState(false);

  // Initialize from storage + system preference after mount.
  // State sync is deferred to a microtask so the first client render
  // matches SSR; the FOUC <head> script already painted the correct theme.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const stored = readStored();

    Promise.resolve().then(() => {
      setSystemPrefersLight(mq.matches);
      setThemeState(stored);
      applyTheme(resolve(mq.matches, stored));
    });

    const onChange = () => setSystemPrefersLight(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    persist(next);
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    applyTheme(resolve(mq.matches, next));
  }, []);

  const toggle = useCallback(() => {
    setThemeState(prev => {
      const mq = window.matchMedia("(prefers-color-scheme: light)");
      const current = resolve(mq.matches, prev);
      const next: Theme = current === "light" ? "dark" : "light";
      persist(next);
      applyTheme(next);
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: resolve(systemPrefersLight, theme),
      setTheme,
      toggle,
    }),
    [theme, systemPrefersLight, setTheme, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
