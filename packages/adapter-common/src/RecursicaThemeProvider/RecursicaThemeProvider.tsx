"use client";

import { useEffect } from "react";
import {
  injectOverStyledStyles,
  registerOverStyledConsoleCommand,
} from "../utils/overStyledControl";
import { Layer } from "../components/Layer/Layer";
import { IS_DEV } from "../utils/overStyledControl";
import {
  findMissingBreakpoints,
  type RecursicaManifestBreakpoints,
} from "../utils/checkBreakpointNames";

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
   * Optional, development only. The parsed `recursica_manifest.json`. Together with `breakpoints`,
   * warns in the console when Forge defines a breakpoint (e.g. `mobile`) that `breakpoints` does
   * not. Never changes the UI kit's theme.
   */
  manifest?: RecursicaManifestBreakpoints;
  /**
   * Optional, development only. The app's own UI-kit breakpoints, keyed by name (e.g. Mantine's
   * `theme.breakpoints`). Only the names are compared against Forge's, not the widths.
   */
  breakpoints?: Record<string, unknown>;
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
  breakpoints,
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

  useEffect(() => {
    if (!IS_DEV || !manifest || !breakpoints) return;
    const missing = findMissingBreakpoints(manifest, breakpoints);
    if (missing.length > 0) {
      console.warn(
        `[recursica] Forge defines breakpoint(s) ${missing.map((name) => `"${name}"`).join(", ")} that the app's breakpoints (${Object.keys(breakpoints).join(", ")}) do not. Add them to the UI kit theme under the same names so Forge and the UI kit stay aligned.`,
      );
    }
  }, [manifest, breakpoints]);

  return initLayer0 ? <Layer layer={0}>{children}</Layer> : <>{children}</>;
}
