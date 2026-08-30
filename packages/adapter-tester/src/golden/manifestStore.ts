import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
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

function manifestLockPath(goldenDir: string): string {
  return join(goldenDir, "manifest.json.lock");
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
 * stable regardless of the order stories happened to run in. Writes to a
 * temp file and renames over the real one — `rename` is atomic, so a
 * concurrent `loadManifest` (running in another Playwright worker) never
 * observes a half-written file. */
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
  const tmpPath = `${path}.tmp-${process.pid}-${Math.random().toString(36).slice(2)}`;
  writeFileSync(tmpPath, JSON.stringify(sorted, null, 2) + "\n");
  renameSync(tmpPath, path);
}

const LOCK_RETRY_MS = 25;
const LOCK_TIMEOUT_MS = 15_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Exclusive-create the lock file, spin-retrying until it's free. `wx` fails
 * atomically (`EEXIST`) if another worker process already holds it — that's
 * the only signal we need, no third-party lock library required for a
 * same-machine, same-run lock like this. */
async function acquireManifestLock(goldenDir: string): Promise<void> {
  mkdirSync(goldenDir, { recursive: true });
  const path = manifestLockPath(goldenDir);
  const deadline = Date.now() + LOCK_TIMEOUT_MS;
  for (;;) {
    try {
      closeSync(openSync(path, "wx"));
      return;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if (Date.now() >= deadline) {
        throw new Error(
          `Timed out waiting for the manifest lock at "${path}" — delete it if a previous run crashed while holding it.`,
        );
      }
      await sleep(LOCK_RETRY_MS);
    }
  }
}

function releaseManifestLock(goldenDir: string): void {
  rmSync(manifestLockPath(goldenDir), { force: true });
}

/** Runs `updater` against this story's manifest entry under an exclusive
 * lock on `manifest.json`: reloads the manifest fresh, applies `updater`,
 * and saves it back, all before releasing the lock. Concurrent Playwright
 * workers each own a different story, so this is the only section that
 * needs to serialize — everything else about a story (its screenshot, its
 * golden image file, its diff) is independent of every other story. */
export async function updateManifestEntry(
  goldenDir: string,
  storyId: string,
  updater: (
    entry: GoldenManifestEntry | undefined,
  ) => GoldenManifestEntry | undefined,
): Promise<GoldenManifestEntry | undefined> {
  await acquireManifestLock(goldenDir);
  try {
    const manifest = loadManifest(goldenDir);
    const nextEntry = updater(manifest[storyId]);
    if (nextEntry === undefined) {
      delete manifest[storyId];
    } else {
      manifest[storyId] = nextEntry;
    }
    saveManifest(goldenDir, manifest);
    return nextEntry;
  } finally {
    releaseManifestLock(goldenDir);
  }
}

export function saveGoldenImage(
  goldenDir: string,
  storyId: string,
  buffer: Buffer,
): void {
  mkdirSync(goldenDir, { recursive: true });
  writeFileSync(goldenImagePath(goldenDir, storyId), buffer);
}

/** Removes the golden `.png` + manifest entry for every story id in the
 * manifest that isn't in `currentStoryIds` (e.g. a story renamed or deleted
 * from Storybook) — otherwise those never get cleaned up on their own,
 * since a run only ever adds/updates entries for stories it actually saw.
 * Returns the pruned ids, for the caller to report. Both the file removal
 * and the manifest delete are idempotent, so it's safe for this to run
 * redundantly from more than one Playwright worker. */
export async function pruneOrphanedGoldens(
  goldenDir: string,
  currentStoryIds: ReadonlySet<string>,
): Promise<string[]> {
  const manifest = loadManifest(goldenDir);
  const orphanIds = Object.keys(manifest).filter(
    (id) => !currentStoryIds.has(id),
  );
  for (const id of orphanIds) {
    const imagePath = goldenImagePath(goldenDir, id);
    if (existsSync(imagePath)) unlinkSync(imagePath);
    await updateManifestEntry(goldenDir, id, () => undefined);
  }
  return orphanIds;
}
