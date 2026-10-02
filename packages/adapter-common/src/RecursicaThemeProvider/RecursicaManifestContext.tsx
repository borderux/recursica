"use client";

import { createContext, useContext } from "react";

/** The parsed `recursica_manifest.json` from a Forge export. */
export type RecursicaManifest = Record<string, unknown>;

export const RecursicaManifestContext = createContext<
  RecursicaManifest | undefined
>(undefined);

/**
 * Returns the manifest passed to `RecursicaThemeProvider`. Throws when none was provided, so
 * only components that need the manifest require it.
 */
export function useRecursicaManifest(): RecursicaManifest {
  const manifest = useContext(RecursicaManifestContext);
  if (!manifest) {
    throw new Error(
      "This component needs the Recursica manifest: pass the parsed recursica_manifest.json as the `manifest` prop of RecursicaThemeProvider.",
    );
  }
  return manifest;
}
