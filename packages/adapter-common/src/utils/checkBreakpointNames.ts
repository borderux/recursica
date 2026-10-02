interface ManifestNumber {
  $value?: unknown;
}

interface ManifestLayoutGrid {
  "min-width"?: ManifestNumber;
  "max-width"?: ManifestNumber;
}

/** The part of `recursica_manifest.json` that defines breakpoint names and widths. */
export interface RecursicaManifestBreakpoints {
  brand?: {
    "layout-grids"?: Record<string, ManifestLayoutGrid | unknown>;
    breakpoints?: Record<string, unknown>;
  };
}

/**
 * Names of the breakpoints Forge defines in the manifest: every non-default layout grid plus every
 * `brand.breakpoints` entry, de-duplicated.
 */
export function getForgeBreakpointNames(
  manifest: RecursicaManifestBreakpoints,
): string[] {
  const grids = Object.keys(manifest.brand?.["layout-grids"] ?? {}).filter(
    (name) => name !== "default",
  );
  const overrides = Object.keys(manifest.brand?.breakpoints ?? {});
  return [...new Set([...grids, ...overrides])];
}

/**
 * Forge breakpoint names that the app's UI-kit breakpoints (e.g. Mantine's `theme.breakpoints`)
 * do not define. Names only; widths are intentionally not compared.
 */
export function findMissingBreakpoints(
  manifest: RecursicaManifestBreakpoints,
  breakpoints: Record<string, unknown>,
): string[] {
  return getForgeBreakpointNames(manifest).filter(
    (name) => !(name in breakpoints),
  );
}
