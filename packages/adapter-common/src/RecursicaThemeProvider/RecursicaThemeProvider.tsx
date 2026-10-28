"use client";

import { useEffect } from "react";
import {
  injectOverStyledStyles,
  registerOverStyledConsoleCommand,
} from "../utils/overStyledControl";
import {
  RecursicaManifestContext,
  type RecursicaManifest,
} from "./RecursicaManifestContext";

const THEME_ATTRIBUTE = "data-recursica-theme";
const LAYER_ATTRIBUTE = "data-recursica-layer";

export interface RecursicaThemeProviderProps {
  /** 'light' | 'dark'. Defaults to 'light' when omitted. */
  theme?: "light" | "dark";
  /**
   * When true (the default), sets `data-recursica-layer="0"` on `document.body` so the
   * base page surface/text/padding apply to the body without an extra wrapper element.
   * Set to `false` if you want to place the base `Layer` yourself (e.g. to control
   * exactly where in the tree layer 0 starts).
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
 * Default is light theme. Applies layer 0 to document.body by default (see `initLayer0`).
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
    if (!initLayer0) return;
    const body = document.body;
    body.setAttribute(LAYER_ATTRIBUTE, "0");
    return () => {
      body.removeAttribute(LAYER_ATTRIBUTE);
    };
  }, [initLayer0]);

  useEffect(() => {
    injectOverStyledStyles();
    registerOverStyledConsoleCommand();
  }, []);

  return (
    <RecursicaManifestContext.Provider value={manifest}>
      {children}
    </RecursicaManifestContext.Provider>
  );
}
