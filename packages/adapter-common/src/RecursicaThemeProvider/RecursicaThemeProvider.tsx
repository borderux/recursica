"use client";

import { useEffect } from "react";
import {
  injectOverStyledStyles,
  registerOverStyledConsoleCommand,
} from "../utils/overStyledControl";
import { Layer } from "../components/Layer/Layer";
import {
  RecursicaManifestContext,
  type RecursicaManifest,
} from "./RecursicaManifestContext";

const THEME_ATTRIBUTE = "data-recursica-theme";

export interface RecursicaThemeProviderProps {
  /** 'light' | 'dark'. Defaults to 'light' when omitted. */
  theme?: "light" | "dark";
  /**
   * When true (the default), automatically wraps `children` in a `<Layer layer={0}>`
   * so the base page surface/border/elevation variables resolve without any extra
   * setup. Set to `false` if you want to place the base `Layer` yourself (e.g. to use
   * `contentsOnly`, or to control exactly where in the tree layer 0 starts).
   */
  initLayer0?: boolean;
  /**
   * The parsed `recursica_manifest.json` from your Forge export. Required by components that read
   * it (e.g. Pagination, for its component variants), which throw without it.
   */
  manifest?: RecursicaManifest;
  children: React.ReactNode;
}

/**
 * Sets data-recursica-theme on document.documentElement so Recursica scoped CSS
 * (e.g. recursica_variables_scoped.css) applies the correct theme and layer-0 variables.
 * Default is light theme. Wraps children in a layer-0 `Layer` by default (see `initLayer0`).
 */
export function RecursicaThemeProvider({
  children,
  theme = "light",
  initLayer0 = true,
  manifest,
}: RecursicaThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(THEME_ATTRIBUTE, theme);
    return () => {
      root.removeAttribute(THEME_ATTRIBUTE);
    };
  }, [theme]);

  useEffect(() => {
    injectOverStyledStyles();
    registerOverStyledConsoleCommand();
  }, []);

  const content = initLayer0 ? (
    <Layer layer={0}>{children}</Layer>
  ) : (
    <>{children}</>
  );
  return (
    <RecursicaManifestContext.Provider value={manifest}>
      {content}
    </RecursicaManifestContext.Provider>
  );
}
