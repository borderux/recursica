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

/** How `resolveVisualRegressionPlan` reaches the source-of-truth adapter's (mantine)
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

/**
 * Which check(s) a run performs. `"own"` (the default) is what a normal,
 * fast, no-network run does: this project's own live render vs. its own
 * committed golden images. `"divergence"` is the separate, opt-in check
 * against the source-of-truth adapter's published golden images.
 */
export type CheckMode = "own" | "divergence";

export interface StoryOverride {
  /** Diff threshold override for this story's own-drift check. Overrides
   * `goldenThresholdPixels`. */
  goldenThreshold?: number;
  /** Diff threshold override for this story's source-of-truth divergence
   * check. Overrides `sourceOfTruthThresholdPixels` for components with
   * acceptable cross-library structural variation (e.g. native control
   * widgets). */
  sourceOfTruthThreshold?: number;
  /** Skip this story entirely — no own-drift check, no divergence check, no
   * golden captured. For stories with no meaningful cross-adapter counterpart. */
  exclude?: boolean;
}

export interface AdapterTesterConfig {
  targets: AdapterTarget[];
  /** Global pixel-diff threshold for the own-drift check (this project's live
   * render vs. its own committed golden). Same library on both sides, so this
   * should stay tight. */
  goldenThresholdPixels: number;
  /** Global pixel-diff threshold for the source-of-truth divergence check
   * (this project's golden vs. the source-of-truth adapter's golden).
   * Comparing across two different component libraries has legitimate
   * structural variation, so this is expected to be much higher than
   * `goldenThresholdPixels`. Unused on the source-of-truth adapter's own
   * config (`isSourceOfTruthAdapter: true`). */
  sourceOfTruthThresholdPixels: number;
  /**
   * Per-story overrides, keyed by story id prefix (a story matches if its id
   * equals the key or starts with it). When more than one key matches, the
   * longest (most specific) key wins.
   */
  stories?: Record<string, StoryOverride>;
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
  /** Set by the CLI from `--divergence-only`. Defaults to `"own"`. */
  checkMode: CheckMode;
  /** Overrides the AI report header text (normally read from
   * `report-header.txt`) shown in Dev Mode's "Full Report" export. */
  reportHeader?: string;
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
