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

/** How `runVisualRegression` reaches the source-of-truth adapter's (mantine)
 * own golden images, for the divergence check. Never involves booting a
 * Storybook — both `readImage` targets are plain files on disk. */
export type SourceOfTruthGoldenLocation =
  | {
      /** Sibling package already checked out locally (this monorepo's own
       * `sourceOfTruth.type: "url"` mode) — read its `test/golden/` directly. */
      type: "local";
      /** Absolute path to the source-of-truth adapter's `test/golden/` directory. */
      dir: string;
    }
  | {
      /** No local checkout (the default, standalone-repo mode) — resolve the
       * installed version against the npm registry, then fetch that git tag's
       * `test/golden/` from the public GitHub repo, caching what's downloaded. */
      type: "npm";
      packageName: string;
      /** npm version/dist-tag to resolve, e.g. "latest" or a pinned version. */
      versionSpec: string;
      /** Directory downloaded manifest/images are cached in between runs. */
      cacheDir: string;
    };

export type GoldenMode = "check" | "update-golden" | "approve-divergence";

export interface AdapterTesterConfig {
  targets: AdapterTarget[];
  /** Global pixel-diff threshold applied to every story comparison. */
  diffThresholdPixels: number;
  /**
   * Per-story diff threshold overrides, keyed by story id prefix (a story
   * matches if its id equals the key or starts with it). Overrides
   * `diffThresholdPixels` for components with acceptable cross-library
   * structural variation (e.g. native control widgets). When more than one
   * key matches, the longest (most specific) key wins.
   */
  storyThresholds?: Record<string, number>;
  /**
   * Story id prefixes (same matching rule as `storyThresholds`) skipped
   * entirely — no own-drift check, no divergence check, no golden captured.
   */
  excludeStoryIds?: string[];
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
  /** Absolute path to this project's own `test/golden/` directory — where
   * golden PNGs and `manifest.json` are stored, committed to git. */
  goldenDir: string;
  /**
   * True only for the source-of-truth adapter's own config (mantine). It has
   * nothing above it to diverge from, so the divergence check is skipped
   * entirely and `sourceOfTruthGolden` is ignored.
   */
  isSourceOfTruthAdapter: boolean;
  /** How to reach the source-of-truth's golden images. Required unless
   * `isSourceOfTruthAdapter` is true. */
  sourceOfTruthGolden?: SourceOfTruthGoldenLocation;
  /** Set by the CLI from `--update-golden`/`--approve-divergence`. Defaults to `"check"`. */
  goldenMode: GoldenMode;
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
