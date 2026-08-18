/**
 * Mirrors the semantics of the native HTML `accept` attribute (comma-separated file extensions,
 * MIME types, or MIME wildcards like `image/*`) so drag-and-drop can be validated the same way —
 * the browser only applies `accept` to its own file-picker dialog, never to a `drop` event, so
 * without this a dropped file bypasses the restriction entirely.
 */
export function fileMatchesAccept(file: File, accept?: string): boolean {
  const patterns = (accept ?? "")
    .split(",")
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean);
  if (patterns.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return name.endsWith(pattern);
    if (pattern.endsWith("/*")) return type.startsWith(pattern.slice(0, -1));
    return type === pattern;
  });
}
