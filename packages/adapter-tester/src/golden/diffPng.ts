import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export interface PngDiffResult {
  /** Mismatched-pixel count, or `Infinity` if the two images aren't even the
   * same dimensions — pixelmatch itself throws on a size mismatch, and a size
   * mismatch is itself a real difference, not something to swallow. */
  diffPixels: number;
  /** Visual highlight of the mismatched pixels, encoded as a PNG buffer.
   * `null` when `diffPixels` is `Infinity` — there's no pixel-aligned diff to
   * render across two different-sized images. */
  diffImage: Buffer | null;
}

/** Pixel-diffs two PNG buffers. */
export function diffPngBuffers(a: Buffer, b: Buffer): PngDiffResult {
  const imgA = PNG.sync.read(a);
  const imgB = PNG.sync.read(b);
  if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
    return { diffPixels: Infinity, diffImage: null };
  }
  const diff = new PNG({ width: imgA.width, height: imgA.height });
  const diffPixels = pixelmatch(
    imgA.data,
    imgB.data,
    diff.data,
    imgA.width,
    imgA.height,
    { threshold: 0.1 },
  );
  return { diffPixels, diffImage: PNG.sync.write(diff) };
}
