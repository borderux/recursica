import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

/**
 * Pixel-diffs two PNG buffers. Returns the mismatched-pixel count, or
 * `Infinity` if the two images aren't even the same dimensions — pixelmatch
 * itself throws on a size mismatch, and a size mismatch is itself a real
 * difference, not something to swallow.
 */
export function diffPngBuffers(a: Buffer, b: Buffer): number {
  const imgA = PNG.sync.read(a);
  const imgB = PNG.sync.read(b);
  if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
    return Infinity;
  }
  const diff = new PNG({ width: imgA.width, height: imgA.height });
  return pixelmatch(imgA.data, imgB.data, diff.data, imgA.width, imgA.height, {
    threshold: 0.1,
  });
}
