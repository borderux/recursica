import { expect } from "@playwright/test";
import type { Browser, TestInfo } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import type { AdapterTesterConfig } from "../config.js";
import { diffPngBuffers } from "../golden/diffPng.js";
import {
  type GoldenManifestEntry,
  goldenImagePath,
  loadManifest,
  pruneOrphanedGoldens,
  saveGoldenImage,
  updateManifestEntry,
} from "../golden/manifestStore.js";
import { resolveSourceOfTruthGolden } from "../golden/resolveSourceOfTruthGolden.js";

const DEFAULT_EXCLUDE_TITLE_PREFIXES = ["Theme", "Tokens", "Introduction"];

interface StorybookEntry {
  type: string;
  id: string;
  name: string;
  title: string;
}

function matchesPrefix(id: string, prefix: string): boolean {
  return id === prefix || id.startsWith(prefix);
}

/** Fetches every story `target`'s Storybook currently has, filtered only by
 * `excludeTitlePrefixes` — not `stories.<id>.exclude`, so callers can still
 * tell an excluded story apart from one that's genuinely missing. */
async function fetchStories(
  target: { name: string; url: string },
  excludeTitlePrefixes: string[],
): Promise<StorybookEntry[]> {
  let stories: StorybookEntry[];
  try {
    const response = await fetch(`${target.url}/index.json`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Storybook index: ${response.statusText}`,
      );
    }
    const data = (await response.json()) as any;
    const entries = data.entries || {};
    stories = Object.values(entries).filter(
      (entry: any) =>
        entry.type === "story" &&
        !excludeTitlePrefixes.some(
          (prefix) =>
            entry.title === prefix || entry.title.startsWith(`${prefix}/`),
        ),
    ) as StorybookEntry[];
    stories.sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error(
      "Failed to load Storybook index from",
      `${target.url}/index.json`,
      error,
    );
    throw new Error(
      `Storybook target "${target.name}" is not responsive or index.json is missing. Please ensure its Storybook is running.`,
    );
  }
  return stories;
}

/** Resolves the diff threshold for `storyId`: the longest (most specific)
 * `storyThresholds` key matching by prefix, falling back to
 * `defaultThresholdPixels` when nothing matches. */
function resolveThreshold(
  storyId: string,
  storyThresholds: Record<string, number>,
  defaultThresholdPixels: number,
): number {
  let bestMatch: string | undefined;
  for (const prefix of Object.keys(storyThresholds)) {
    if (
      matchesPrefix(storyId, prefix) &&
      (!bestMatch || prefix.length > bestMatch.length)
    ) {
      bestMatch = prefix;
    }
  }
  return bestMatch !== undefined
    ? storyThresholds[bestMatch]!
    : defaultThresholdPixels;
}

/** Everything a generated Playwright spec needs to register the golden-image
 * suite itself. Split out from the actual `test.describe`/`test` calls so
 * those calls execute in the spec file that imports this, not in this
 * library file — otherwise Playwright's HTML report groups every story under
 * this file's own (sourcemapped) path instead of a stable spec name. */
export interface VisualRegressionPlan {
  /** `config`'s own (non-source-of-truth) target name, for the suite title. */
  ownTargetName: string;
  /** Suite title suffix describing which check mode is running. */
  suiteLabel: string;
  /** Stories to check, already filtered and sorted by id. */
  stories: StorybookEntry[];
  /** Story ids the source-of-truth adapter has a golden for but this
   * project's own Storybook doesn't — empty outside `checkMode: "divergence"`
   * or when `sourceOfTruthGolden` didn't resolve. Excludes ids covered by a
   * `stories.<id>.exclude` entry: an intentional gap, not a sync failure. */
  missingFromSourceOfTruth: string[];
  /** Golden-checks one story. Call this from inside a `test(story.id, ...)`
   * body — safe to run concurrently across Playwright workers, since each
   * call only ever reads/writes its own story's manifest entry (locked at
   * the point it writes it back, so concurrent workers never race each
   * other's entries — see `updateManifestEntry`). */
  checkStory: (
    story: StorybookEntry,
    browser: Browser,
    testInfo: TestInfo,
  ) => Promise<void>;
}

/** Everything a generated Playwright spec needs to register the golden-image
 * suite itself. Split out from the actual `test.describe`/`test` calls so
 * those calls execute in the spec file that imports this, not in this
 * library file — otherwise Playwright's HTML report groups every story under
 * this file's own (sourcemapped) path instead of a stable spec name. */
export interface VisualRegressionPlan {
  /** `config`'s own (non-source-of-truth) target name, for the suite title. */
  ownTargetName: string;
  /** Suite title suffix describing which check mode is running. */
  suiteLabel: string;
  /** Stories to check, already filtered and sorted by id. */
  stories: StorybookEntry[];
  /** Golden-checks one story. Call this from inside a `test(story.id, ...)`
   * body — safe to run concurrently across Playwright workers, since each
   * call only ever reads/writes its own story's manifest entry (locked at
   * the point it writes it back, so concurrent workers never race each
   * other's entries — see `updateManifestEntry`). */
  checkStory: (
    story: StorybookEntry,
    browser: Browser,
    testInfo: TestInfo,
  ) => Promise<void>;
}

/**
 * Resolves the golden-image plan for `config`'s own target (the one target
 * in `config.targets` not marked `sourceOfTruth`).
 *
 * Two independent checks per story, gated by `config.checkMode`. Neither
 * boots the source-of-truth adapter's own Storybook — its side of both
 * checks is always a stored golden file, never a live page:
 *
 * 1. **Own-drift (`checkMode: "own"`, the default; hard fail):** this run's
 *    live render vs this project's own stored `test/golden/<story-id>.png`.
 *    No golden yet for a story is not a failure — one is captured from this
 *    run instead (same as `--update-golden`, scoped to just that story), in
 *    either mode.
 * 2. **Source-of-truth divergence (`checkMode: "divergence"`; hard fail):**
 *    this run's live render vs the source-of-truth's stored golden (`config`'s
 *    `sourceOfTruthGolden`) — always fresh, no `--update-golden` step needed
 *    first. Skipped entirely when `config.isSourceOfTruthAdapter` is true —
 *    the source-of-truth adapter has nothing above it to diverge from — and
 *    skipped per-story when the source of truth has no baseline for it yet.
 *    A once-flagged divergence stays quiet after `--approve-divergence`,
 *    until the source of truth's own golden changes again.
 */
export async function resolveVisualRegressionPlan(
  config: AdapterTesterConfig,
): Promise<VisualRegressionPlan> {
  const ownTarget = config.isSourceOfTruthAdapter
    ? config.targets[0]
    : config.targets.find((target) => !target.sourceOfTruth);
  if (!ownTarget) {
    throw new Error(
      "adapter-tester config has no non-sourceOfTruth target to run the golden check against.",
    );
  }
  const excludeTitlePrefixes =
    config.excludeTitlePrefixes ?? DEFAULT_EXCLUDE_TITLE_PREFIXES;
  const storyOverrides = config.stories ?? {};
  const excludeStoryIds = Object.keys(storyOverrides).filter(
    (id) => storyOverrides[id]!.exclude,
  );
  const goldenStoryThresholds = Object.fromEntries(
    Object.entries(storyOverrides)
      .filter(([, override]) => override.goldenThreshold !== undefined)
      .map(([id, override]) => [id, override.goldenThreshold!]),
  );
  const sourceOfTruthStoryThresholds = Object.fromEntries(
    Object.entries(storyOverrides)
      .filter(([, override]) => override.sourceOfTruthThreshold !== undefined)
      .map(([id, override]) => [id, override.sourceOfTruthThreshold!]),
  );
  const goldenDir = config.goldenDir;
  const goldenMode = config.goldenMode;
  const checkMode = config.checkMode;

  // Fetched with only excludeTitlePrefixes applied — not excludeStoryIds —
  // so the source-of-truth story-parity check below can tell an excluded
  // story apart from one that's genuinely missing from this Storybook.
  const ownStories = await fetchStories(ownTarget, excludeTitlePrefixes);
  const stories = ownStories.filter(
    (entry) =>
      !excludeStoryIds.some((prefix) => matchesPrefix(entry.id, prefix)),
  );

  // `--update-golden` redefines this project's own baseline, so it's also
  // the point a renamed/removed story's now-orphaned golden gets cleaned up
  // — otherwise nothing ever prunes it, since a run only ever adds/updates
  // entries for stories it actually saw in this pass. Uses the full current
  // story list (not narrowed by any `--grep` Playwright itself applies), so
  // this catches every orphan regardless of how the run is scoped.
  if (goldenMode === "update-golden") {
    const prunedStoryIds = await pruneOrphanedGoldens(
      goldenDir,
      new Set(stories.map((story) => story.id)),
    );
    if (prunedStoryIds.length > 0) {
      console.warn(
        `Pruned ${prunedStoryIds.length} orphaned golden(s) no longer in Storybook: ${prunedStoryIds.join(", ")}`,
      );
    }
  }

  const sourceOfTruthGolden =
    checkMode !== "divergence" ||
    config.isSourceOfTruthAdapter ||
    !config.sourceOfTruthGolden
      ? null
      : await resolveSourceOfTruthGolden(config.sourceOfTruthGolden);

  // Checked against `ownStories` (title-prefix-excluded only), not `stories`
  // — a story marked `exclude: true` still counts as "present", it's just
  // not diffed. Only a story the source of truth has that this adapter
  // never built at all, and hasn't acknowledged via `exclude`, is missing.
  const ownStoryIds = new Set(ownStories.map((entry) => entry.id));
  const missingFromSourceOfTruth = sourceOfTruthGolden
    ? Object.keys(sourceOfTruthGolden.manifest)
        .filter(
          (id) =>
            !ownStoryIds.has(id) &&
            !excludeStoryIds.some((prefix) => matchesPrefix(id, prefix)),
        )
        .sort()
    : [];

  if (missingFromSourceOfTruth.length > 0) {
    console.error(
      `[adapter-tester] ${missingFromSourceOfTruth.length} stor(y/ies) exist in the source of truth but are missing here: ${missingFromSourceOfTruth.join(", ")}. Add the missing story, or mark it \`exclude: true\` under \`stories\` in adapter-tester.config.json if intentional.`,
    );
  }

  console.log(
    [
      `[adapter-tester] target: "${ownTarget.name}" (${ownTarget.url})`,
      `[adapter-tester] checkMode: "${checkMode}" (${checkMode === "divergence" ? "live render vs source-of-truth's golden" : "live render vs this project's own golden"})`,
      `[adapter-tester] goldenMode: "${goldenMode}"`,
      `[adapter-tester] goldenThresholdPixels: ${config.goldenThresholdPixels}`,
      `[adapter-tester] sourceOfTruthThresholdPixels: ${config.sourceOfTruthThresholdPixels}`,
      checkMode === "divergence"
        ? config.isSourceOfTruthAdapter
          ? `[adapter-tester] sourceOfTruthGolden: skipped — this is the source-of-truth adapter, nothing to diverge from`
          : !config.sourceOfTruthGolden
            ? `[adapter-tester] sourceOfTruthGolden: skipped — no sourceOfTruthGolden configured`
            : sourceOfTruthGolden
              ? `[adapter-tester] sourceOfTruthGolden: resolved, ${Object.keys(sourceOfTruthGolden.manifest).length} golden(s) available (config: ${JSON.stringify(config.sourceOfTruthGolden)})`
              : `[adapter-tester] sourceOfTruthGolden: unavailable — no baseline found or unreachable (config: ${JSON.stringify(config.sourceOfTruthGolden)}); divergence check will skip every story`
        : `[adapter-tester] sourceOfTruthGolden: not used in "own" checkMode`,
      `[adapter-tester] stories: ${stories.length} to check (excluded: ${excludeStoryIds.length}, title prefixes excluded: ${excludeTitlePrefixes.join(", ") || "none"})`,
      `[adapter-tester] story parity with source of truth: ${missingFromSourceOfTruth.length === 0 ? "OK" : `${missingFromSourceOfTruth.length} missing (see error above)`}`,
    ].join("\n"),
  );

  const suiteLabel =
    checkMode === "divergence"
      ? "Source-of-Truth Divergence Check"
      : "Own-Drift Golden Image Check";

  return {
    ownTargetName: ownTarget.name,
    suiteLabel,
    stories,
    missingFromSourceOfTruth,
    checkStory: async (story, browser, testInfo) => {
      const page = await browser.newPage();
      await page.setViewportSize({ width: 800, height: 600 });
      await page.goto(
        `${ownTarget.url}/iframe.html?id=${story.id}&viewMode=story`,
        { waitUntil: "networkidle" },
      );
      await page.waitForSelector("#storybook-root");
      await page.addStyleTag({
        content: `* { -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; }`,
      });
      // Web fonts (e.g. `withRecursicaFonts`'s Google Fonts `<link>`s, injected
      // from a React effect after this page's `networkidle` already fired) can
      // still be mid-download here. Wait for any `<link>` stylesheet that's
      // still loading to settle — so the browser has parsed its `@font-face`
      // rules and started the actual font-file fetches `document.fonts.ready`
      // below needs to know about — then for the fonts themselves. Without
      // this, the very first golden capture of a newly-introduced font family
      // is a coin flip between the real font and its fallback, depending on
      // how fast the network happens to be.
      await page.evaluate(() =>
        Promise.all(
          Array.from(
            document.querySelectorAll<HTMLLinkElement>(
              'link[rel="stylesheet"]',
            ),
          ).map((link) =>
            link.sheet
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  link.addEventListener("load", () => resolve(), {
                    once: true,
                  });
                  link.addEventListener("error", () => resolve(), {
                    once: true,
                  });
                }),
          ),
        ).then(() => document.fonts.ready),
      );
      await page.waitForTimeout(300);
      const liveBuffer = await page.screenshot();

      const imagePath = goldenImagePath(goldenDir, story.id);
      // Only this worker ever touches this story's key, so reading it here
      // (outside the lock `updateManifestEntry` takes at the end) can't
      // race another worker — they're all reading/writing different keys.
      const entry = loadManifest(goldenDir)[story.id];
      const capturingNewGolden =
        goldenMode !== "check" || !entry || !existsSync(imagePath);

      let currentEntry: GoldenManifestEntry;
      if (capturingNewGolden) {
        saveGoldenImage(goldenDir, story.id, liveBuffer);
        currentEntry = entry?.sourceOfTruthCreatedAt
          ? {
              createdAt: new Date().toISOString(),
              sourceOfTruthCreatedAt: entry.sourceOfTruthCreatedAt,
            }
          : { createdAt: new Date().toISOString() };
        if (!entry) {
          testInfo.annotations.push({
            type: "golden-created",
            description: `No golden existed yet for "${story.id}" — captured one from this run.`,
          });
        }
      } else {
        currentEntry = entry;
        if (checkMode === "own") {
          const goldenBuffer = readFileSync(imagePath);
          const { diffPixels, diffImage } = diffPngBuffers(
            liveBuffer,
            goldenBuffer,
          );
          const threshold = resolveThreshold(
            story.id,
            goldenStoryThresholds,
            config.goldenThresholdPixels,
          );
          if (diffPixels >= threshold) {
            await testInfo.attach("expected", {
              body: goldenBuffer,
              contentType: "image/png",
            });
            await testInfo.attach("actual", {
              body: liveBuffer,
              contentType: "image/png",
            });
            if (diffImage) {
              await testInfo.attach("diff", {
                body: diffImage,
                contentType: "image/png",
              });
            }
          }
          expect
            .soft(
              diffPixels,
              `"${story.id}" has drifted from its own golden image (${diffPixels} mismatched pixels, threshold ${threshold})`,
            )
            .toBeLessThan(threshold);
        }
      }

      if (sourceOfTruthGolden) {
        const sourceOfTruthEntry = sourceOfTruthGolden.manifest[story.id];
        const sourceOfTruthImage = sourceOfTruthEntry
          ? await sourceOfTruthGolden.readImage(story.id)
          : null;

        if (sourceOfTruthEntry && sourceOfTruthImage) {
          if (goldenMode === "approve-divergence") {
            currentEntry = {
              ...currentEntry,
              sourceOfTruthCreatedAt: sourceOfTruthEntry.createdAt,
            };
          } else {
            // Always this run's live render, never the stored own-drift
            // golden — divergence should reflect what's on screen right now,
            // not whatever was last captured via --update-golden.
            const { diffPixels, diffImage } = diffPngBuffers(
              liveBuffer,
              sourceOfTruthImage,
            );
            const threshold = resolveThreshold(
              story.id,
              sourceOfTruthStoryThresholds,
              config.sourceOfTruthThresholdPixels,
            );
            const approvedAt = currentEntry.sourceOfTruthCreatedAt;
            const isKnownDivergence =
              diffPixels < threshold ||
              (approvedAt !== undefined &&
                approvedAt >= sourceOfTruthEntry.createdAt);
            if (!isKnownDivergence) {
              await testInfo.attach("expected", {
                body: sourceOfTruthImage,
                contentType: "image/png",
              });
              await testInfo.attach("actual", {
                body: liveBuffer,
                contentType: "image/png",
              });
              if (diffImage) {
                await testInfo.attach("diff", {
                  body: diffImage,
                  contentType: "image/png",
                });
              }
              testInfo.annotations.push({
                type: "source-of-truth-divergence",
                description: `"${story.id}" differs from the source of truth's golden by ${diffPixels} mismatched pixels (threshold ${threshold}) and hasn't been reviewed — run with --approve-divergence if this is intentional, or fix the adapter styling.`,
              });
            }
            expect
              .soft(
                isKnownDivergence,
                `"${story.id}" differs from the source of truth's golden by ${diffPixels} mismatched pixels (threshold ${threshold}) and hasn't been reviewed — run with --approve-divergence if this is intentional, or fix the adapter styling.`,
              )
              .toBe(true);
          }
        }
      }

      // Locked read-modify-write of just this story's entry — see
      // `updateManifestEntry` for why that's enough to make this safe
      // across concurrent Playwright workers.
      await updateManifestEntry(goldenDir, story.id, () => currentEntry);
    },
  };
}
