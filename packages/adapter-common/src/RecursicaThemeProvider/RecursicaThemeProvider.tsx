"use client";

import { useEffect } from "react";

const THEME_ATTRIBUTE = "data-recursica-theme";

export interface RecursicaThemeProviderProps {
  /** 'light' | 'dark'. Defaults to 'light' when omitted. */
  theme?: "light" | "dark";
  children: React.ReactNode;
}

/**
 * Sets data-recursica-theme on document.documentElement so Recursica scoped CSS
 * (e.g. recursica_variables_scoped.css) applies the correct theme and layer-0 variables.
 * Default is light theme.
 */
export function RecursicaThemeProvider({
  children,
  theme = "light",
}: RecursicaThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(THEME_ATTRIBUTE, theme);
    return () => {
      root.removeAttribute(THEME_ATTRIBUTE);
    };
  }, [theme]);

  return <>{children}</>;
}
