export interface AdapterTarget {
  /** Human-readable name used in test titles, report labels, and artifact filenames. */
  name: string;
  /** Base URL the target's Storybook instance is served from. */
  url: string;
  /**
   * Marks this target as the visual/token source of truth every other target
   * is compared against. Exactly one target in a config must set this true.
   */
  sourceOfTruth?: boolean;
}

export interface AdapterTesterConfig {
  targets: AdapterTarget[];
  /** Global pixel-diff threshold applied to every story comparison. */
  diffThresholdPixels: number;
  /**
   * Story ids (matched by prefix) that get `relaxedThresholdPixels` instead
   * of `diffThresholdPixels`, for components with acceptable cross-library
   * structural variation (e.g. native control widgets).
   */
  relaxedThresholdStoryIds?: string[];
  /** Pixel-diff threshold applied to `relaxedThresholdStoryIds`. */
  relaxedThresholdPixels?: number;
  /**
   * Storybook entry title categories excluded from the comparison — an
   * entry is excluded if its title equals one of these or starts with
   * `"<value>/"`. Defaults to ["Theme", "Tokens", "Introduction"]:
   * `@recursica/storybook-template`'s own default token/theme demo stories
   * (which every adapter's Storybook inherits automatically) plus each
   * adapter's own onboarding "Introduction" stories — neither has a
   * cross-adapter counterpart to diff against.
   */
  excludeTitlePrefixes?: string[];
}

export function defineAdapterTesterConfig(
  config: AdapterTesterConfig,
): AdapterTesterConfig {
  const sourceOfTruthCount = config.targets.filter(
    (target) => target.sourceOfTruth,
  ).length;
  if (sourceOfTruthCount !== 1) {
    throw new Error(
      `adapter-tester config must mark exactly one target as sourceOfTruth (found ${sourceOfTruthCount})`,
    );
  }
  return config;
}

export function getSourceOfTruth(config: AdapterTesterConfig): AdapterTarget {
  const sourceOfTruth = config.targets.find((target) => target.sourceOfTruth);
  if (!sourceOfTruth) {
    throw new Error("adapter-tester config has no target marked sourceOfTruth");
  }
  return sourceOfTruth;
}
