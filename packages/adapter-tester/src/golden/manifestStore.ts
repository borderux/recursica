import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { validateGoldenManifest } from "./validateManifest.js";

export interface GoldenManifestEntry {
  createdAt: string;
  sourceOfTruthCreatedAt?: string;
}

export type GoldenManifest = Record<string, GoldenManifestEntry>;

export function manifestPath(goldenDir: string): string {
  return join(goldenDir, "manifest.json");
}

export function goldenImagePath(goldenDir: string, storyId: string): string {
  return join(goldenDir, `${storyId}.png`);
}

/** Returns `{}` if no manifest exists yet — a fresh adapter with no goldens
 * captured is the normal starting state, not an error. */
export function loadManifest(goldenDir: string): GoldenManifest {
  const path = manifestPath(goldenDir);
  if (!existsSync(path)) return {};
  const data = JSON.parse(readFileSync(path, "utf8"));
  validateGoldenManifest(data, path);
  return data;
}

/** Validates before writing, and sorts keys so the diff on a reviewed PR is
 * stable regardless of the order stories happened to run in. */
export function saveManifest(
  goldenDir: string,
  manifest: GoldenManifest,
): void {
  const path = manifestPath(goldenDir);
  validateGoldenManifest(manifest, path);
  const sorted: GoldenManifest = {};
  for (const key of Object.keys(manifest).sort()) {
    sorted[key] = manifest[key]!;
  }
  mkdirSync(goldenDir, { recursive: true });
  writeFileSync(path, JSON.stringify(sorted, null, 2) + "\n");
}

export function saveGoldenImage(
  goldenDir: string,
  storyId: string,
  buffer: Buffer,
): void {
  mkdirSync(goldenDir, { recursive: true });
  writeFileSync(goldenImagePath(goldenDir, storyId), buffer);
}
