import { test, expect } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import type { AdapterTesterConfig } from "../config.js";
import { diffPngBuffers } from "../golden/diffPng.js";
import {
  goldenImagePath,
  loadManifest,
  saveGoldenImage,
  saveManifest,
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

async function fetchStories(
  target: { name: string; url: string },
  excludeTitlePrefixes: string[],
  excludeStoryIds: string[],
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
        ) &&
        !excludeStoryIds.some((prefix) => matchesPrefix(entry.id, prefix)),
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
 * `diffThresholdPixels` when nothing matches. */
function resolveThreshold(
  storyId: string,
  storyThresholds: Record<string, number>,
  diffThresholdPixels: number,
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
    : diffThresholdPixels;
}

/**
 * Defines a Playwright suite that golden-image-tests every story in
 * `config`'s own target (the one target in `config.targets` not marked
 * `sourceOfTruth`). Call this with a top-level `await` from a Playwright
 * `*.spec.ts` file — it calls `test.describe` at module scope, so it must
 * run inside Playwright's test runner during test-graph compilation.
 *
 * Two independent checks per story, neither of which boots the
 * source-of-truth adapter's own Storybook — the divergence check below
 * compares stored golden files, not live pages:
 *
 * 1. **Own-drift (hard fail):** this run's live render vs this project's own
 *    stored `test/golden/<story-id>.png`. No golden yet for a story is not a
 *    failure — one is captured from this run instead (same as
 *    `--update-golden`, scoped to just that story).
 * 2. **Source-of-truth divergence (soft flag, never fails the run):** this
 *    project's own golden vs the source-of-truth's golden (`config`'s
 *    `sourceOfTruthGolden`). Skipped entirely when
 *    `config.isSourceOfTruthAdapter` is true — the source-of-truth adapter
 *    has nothing above it to diverge from — and skipped per-story when
 *    neither side has a baseline yet. A once-flagged divergence stays quiet
 *    after `--approve-divergence`, until the source of truth's own golden
 *    changes again.
 */
export async function runVisualRegression(
  config: AdapterTesterConfig,
): Promise<void> {
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
  const excludeStoryIds = config.excludeStoryIds ?? [];
  const storyThresholds = config.storyThresholds ?? {};
  const goldenDir = config.goldenDir;
  const goldenMode = config.goldenMode;

  const stories = await fetchStories(
    ownTarget,
    excludeTitlePrefixes,
    excludeStoryIds,
  );
  const manifest = loadManifest(goldenDir);

  const sourceOfTruthGolden =
    config.isSourceOfTruthAdapter || !config.sourceOfTruthGolden
      ? null
      : await resolveSourceOfTruthGolden(config.sourceOfTruthGolden);

  test.describe(`${ownTarget.name} — Golden Image Visual Regression`, () => {
    for (const story of stories) {
      test(`Golden regression for: ${story.title} - ${story.name} (${story.id})`, async ({
        browser,
      }, testInfo) => {
        const page = await browser.newPage();
        await page.setViewportSize({ width: 800, height: 600 });
        await page.goto(
          `${ownTarget.url}/iframe.html?id=${story.id}&viewMode=story`,
          { waitUntil: "networkidle" },
        );
        await page.waitForSelector("#storybook-root");
        await page.waitForTimeout(300);
        const liveBuffer = await page.screenshot();

        const imagePath = goldenImagePath(goldenDir, story.id);
        const entry = manifest[story.id];
        const capturingNewGolden =
          goldenMode !== "check" || !entry || !existsSync(imagePath);

        if (capturingNewGolden) {
          saveGoldenImage(goldenDir, story.id, liveBuffer);
          manifest[story.id] = entry?.sourceOfTruthCreatedAt
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
          const goldenBuffer = readFileSync(imagePath);
          const diffPixels = diffPngBuffers(liveBuffer, goldenBuffer);
          await testInfo.attach("Live vs Golden Diff", {
            body: `${diffPixels} mismatched pixels`,
            contentType: "text/plain",
          });
          const threshold = resolveThreshold(
            story.id,
            storyThresholds,
            config.diffThresholdPixels,
          );
          expect
            .soft(
              diffPixels,
              `"${story.id}" has drifted from its own golden image`,
            )
            .toBeLessThan(threshold);
        }

        // Guaranteed set by the branch above — either just captured, or
        // already present since !capturingNewGolden implies `entry` existed.
        const currentEntry = manifest[story.id]!;

        if (sourceOfTruthGolden) {
          const sourceOfTruthEntry = sourceOfTruthGolden.manifest[story.id];
          const sourceOfTruthImage = sourceOfTruthEntry
            ? await sourceOfTruthGolden.readImage(story.id)
            : null;

          if (sourceOfTruthEntry && sourceOfTruthImage) {
            if (goldenMode === "approve-divergence") {
              manifest[story.id] = {
                ...currentEntry,
                sourceOfTruthCreatedAt: sourceOfTruthEntry.createdAt,
              };
            } else {
              const ownImage = readFileSync(imagePath);
              const diffPixels = diffPngBuffers(ownImage, sourceOfTruthImage);
              const approvedAt = currentEntry.sourceOfTruthCreatedAt;
              const isKnownDivergence =
                diffPixels === 0 ||
                (approvedAt !== undefined &&
                  approvedAt >= sourceOfTruthEntry.createdAt);
              if (!isKnownDivergence) {
                testInfo.annotations.push({
                  type: "source-of-truth-divergence",
                  description: `"${story.id}" differs from the source of truth's golden and hasn't been reviewed — run with --approve-divergence if this is intentional, or fix the adapter styling.`,
                });
              }
            }
          }
        }

        // Playwright runs this generated spec with workers: 1 specifically so
        // this read-modify-write is never racing another story's test body.
        saveManifest(goldenDir, manifest);
      });
    }
  });
}
