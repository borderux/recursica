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

export interface SourceOfTruthGolden {
  manifest: GoldenManifest;
  /** Returns the golden PNG bytes for a story, or `null` if the source of
   * truth has no golden captured for it yet. */
  readImage(storyId: string): Promise<Buffer | null>;
}

async function resolveNpmVersion(
  packageName: string,
  versionSpec: string,
): Promise<string> {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  if (!response.ok) {
    throw new Error(
      `Could not reach npm registry for ${packageName}: ${response.statusText}`,
    );
  }
  const data = (await response.json()) as {
    "dist-tags"?: Record<string, string>;
    versions?: Record<string, unknown>;
  };
  const resolved =
    data["dist-tags"]?.[versionSpec] ??
    (data.versions?.[versionSpec] ? versionSpec : undefined);
  if (!resolved) {
    throw new Error(
      `${packageName} has no version or dist-tag "${versionSpec}" on the npm registry.`,
    );
  }
  return resolved;
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
 * `location.type === "npm"`: no local checkout (the default, standalone-repo
 * mode) — resolve the installed version against the npm registry, then fetch
 * that exact version's `test/golden/` from the public GitHub repo at the
 * matching release tag (changesets tags every release as
 * `<packageName>@<version>`), caching what's downloaded under `cacheDir`.
 *
 * Returns `null` — degrading the divergence check to a skip, not a failure —
 * when no golden baseline exists yet for this version, or the registry/repo
 * is unreachable.
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

  let version: string;
  try {
    version = await resolveNpmVersion(
      location.packageName,
      location.versionSpec,
    );
  } catch (error) {
    console.warn(
      `Could not resolve ${location.packageName}@${location.versionSpec} — source-of-truth divergence check skipped for this run.`,
      error,
    );
    return null;
  }

  const cacheDir = join(location.cacheDir, version);
  const tag = `${location.packageName}@${version}`;
  // @recursica/adapter-mantine-v8 is a standalone single-package repo (unlike
  // the old @recursica/mantine-adapter, which lived at `packages/<name>`
  // inside this monorepo) — its `test/golden/` sits directly at the repo root.
  const rawBase = `https://raw.githubusercontent.com/${GITHUB_REPO}/${tag}/test/golden`;

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
        `Could not reach GitHub to fetch ${tag}'s golden baseline — source-of-truth divergence check skipped for this run.`,
        error,
      );
      return null;
    }
    if (!response.ok) {
      console.warn(
        `No golden baseline published for ${tag} — source-of-truth divergence check skipped for this run.`,
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
