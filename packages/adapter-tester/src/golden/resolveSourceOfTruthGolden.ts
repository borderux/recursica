import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { SourceOfTruthGoldenLocation } from "../config.js";
import {
  goldenImagePath,
  loadManifest,
  manifestPath,
  type GoldenManifest,
} from "./manifestStore.js";
import { validateGoldenManifest } from "./validateManifest.js";

// The source-of-truth adapter (Mantine) lives in its own standalone repo, not
// this monorepo — its golden images are fetched from here, not from borderux/recursica.
const GITHUB_REPO = "borderux/recursica-adapter-mantine-v8";
const GITHUB_BRANCH = "main";

export interface SourceOfTruthGolden {
  manifest: GoldenManifest;
  /** Returns the golden PNG bytes for a story, or `null` if the source of
   * truth has no golden captured for it yet. */
  readImage(storyId: string): Promise<Buffer | null>;
}

/** Resolves `GITHUB_BRANCH`'s current commit sha, so downloaded goldens can
 * be cached by an immutable ref instead of re-fetched every run, while still
 * always comparing against the branch's latest state. */
async function resolveGithubBranchSha(
  repo: string,
  branch: string,
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/commits/${branch}`,
    { headers: { Accept: "application/vnd.github.sha" } },
  );
  if (!response.ok) {
    throw new Error(
      `Could not resolve ${repo}@${branch} on GitHub: ${response.statusText}`,
    );
  }
  return (await response.text()).trim();
}

/**
 * Resolves the source-of-truth adapter's golden images for the divergence
 * check. Never boots a Storybook — both location types resolve to plain
 * files, fetched once and cached, not re-diffed per pixel over the wire.
 *
 * `location.type === "local"`: a sibling package already checked out (this
 * monorepo's own `sourceOfTruth.type: "url"` mode) — read its
 * `test/golden/` directly, including any uncommitted local changes.
 *
 * `location.type === "github-main"`: no local checkout (the default,
 * standalone-repo mode) — always reads `test/golden/` from the source-of-truth
 * repo's `main` branch, not a published npm version or release tag (the
 * standalone repo isn't guaranteed to tag every release, and its tag format
 * has changed before — reading `main` directly sidesteps both). The branch's
 * current commit is resolved once per run and used as the cache key, so
 * a repeated run against the same commit doesn't re-download anything.
 *
 * Returns `null` — degrading the divergence check to a skip, not a failure —
 * when no golden baseline exists yet, or GitHub is unreachable.
 */
export async function resolveSourceOfTruthGolden(
  location: SourceOfTruthGoldenLocation,
): Promise<SourceOfTruthGolden | null> {
  if (location.type === "local") {
    if (!existsSync(manifestPath(location.dir))) {
      console.warn(
        `No golden baseline found yet at ${location.dir} — source-of-truth divergence check skipped for this run.`,
      );
      return null;
    }
    const manifest = loadManifest(location.dir);
    return {
      manifest,
      async readImage(storyId) {
        const path = goldenImagePath(location.dir, storyId);
        return existsSync(path) ? readFileSync(path) : null;
      },
    };
  }

  let sha: string;
  try {
    sha = await resolveGithubBranchSha(GITHUB_REPO, GITHUB_BRANCH);
  } catch (error) {
    console.warn(
      `Could not resolve ${location.packageName}'s ${GITHUB_BRANCH} branch on GitHub — source-of-truth divergence check skipped for this run.`,
      error,
    );
    return null;
  }

  const cacheDir = join(location.cacheDir, sha);
  // @recursica/adapter-mantine-v8 is a standalone single-package repo (unlike
  // the old @recursica/mantine-adapter, which lived at `packages/<name>`
  // inside this monorepo) — its `test/golden/` sits directly at the repo root.
  const rawBase = `https://raw.githubusercontent.com/${GITHUB_REPO}/${sha}/test/golden`;

  let manifest: GoldenManifest;
  const cachedManifestPath = manifestPath(cacheDir);
  if (existsSync(cachedManifestPath)) {
    manifest = loadManifest(cacheDir);
  } else {
    let response: Response;
    try {
      response = await fetch(`${rawBase}/manifest.json`);
    } catch (error) {
      console.warn(
        `Could not reach GitHub to fetch ${location.packageName}'s ${GITHUB_BRANCH} golden baseline — source-of-truth divergence check skipped for this run.`,
        error,
      );
      return null;
    }
    if (!response.ok) {
      console.warn(
        `No golden baseline published for ${location.packageName}'s ${GITHUB_BRANCH} branch — source-of-truth divergence check skipped for this run.`,
      );
      return null;
    }
    const text = await response.text();
    const parsed = JSON.parse(text);
    validateGoldenManifest(parsed, `${rawBase}/manifest.json`);
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(cachedManifestPath, text);
    manifest = parsed;
  }

  return {
    manifest,
    async readImage(storyId) {
      const cachedImagePath = goldenImagePath(cacheDir, storyId);
      if (existsSync(cachedImagePath)) return readFileSync(cachedImagePath);
      const response = await fetch(`${rawBase}/${storyId}.png`);
      if (!response.ok) return null;
      const buffer = Buffer.from(await response.arrayBuffer());
      mkdirSync(cacheDir, { recursive: true });
      writeFileSync(cachedImagePath, buffer);
      return buffer;
    },
  };
}
