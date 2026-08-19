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
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return "system";
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
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (theme === "light") {
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [systemPrefersLight, setSystemPrefersLight] = useState(false);

  // Initialize from storage + system preference after mount.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const stored = readStored();
    const isLight = mq.matches;

    setSystemPrefersLight(isLight);
    setThemeState(stored);
    applyTheme(resolve(isLight, stored));

    const onChange = (e: MediaQueryListEvent) => {
      const systemLight = e.matches;
      setSystemPrefersLight(systemLight);
      const currentStored = readStored();
      if (currentStored === "system") {
        applyTheme(systemLight ? "light" : "dark");
      }
    };

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

  const resolved = useMemo(
    () => resolve(systemPrefersLight, theme),
    [systemPrefersLight, theme]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: resolved,
      setTheme,
      toggle,
    }),
    [theme, resolved, setTheme, toggle]
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

