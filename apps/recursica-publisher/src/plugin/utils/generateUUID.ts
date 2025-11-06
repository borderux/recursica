/**
 * Generates a UUID v4 compatible string
 * Works in Figma plugin environment where crypto.randomUUID() is not available
 * @returns A UUID v4 string
 */
export function generateUUID(): string {
  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // where x is any hexadecimal digit and y is one of 8, 9, A, or B
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
