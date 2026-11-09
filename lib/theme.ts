"use client";
import { useCallback, useEffect, useState } from "react";
import type { ThemeMode } from "./design-tokens";

const THEME_STORAGE_KEY = "nihongo.theme.v1";

export function useTheme(): [ThemeMode, (mode: ThemeMode) => void] {
  const [theme, setThemeState] = useState<ThemeMode>("system");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
        setThemeState(stored);
      }
    } catch {
      // localStorage may be inaccessible
    }
  }, []);

  const applyTheme = useCallback((mode: ThemeMode) => {
    const root = document.documentElement;
    const isDark =
      mode === "dark" ||
      (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme, applyTheme]);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeState(mode);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, mode);
      } catch {
        // storage quota
      }
      applyTheme(mode);
    },
    [applyTheme],
  );

  return [theme, setTheme];
}

