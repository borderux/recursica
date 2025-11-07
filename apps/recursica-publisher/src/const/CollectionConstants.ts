/**
 * Fixed GUIDs for standard collections (Layer, Theme, Tokens)
 * These collections should always use these GUIDs for consistency
 */
export const FIXED_COLLECTION_GUIDS = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003",
} as const;

/**
 * Valid collection names (normalized)
 */
export const VALID_COLLECTION_NAMES = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme",
} as const;

/**
 * Normalizes a collection name to a standard name
 * - "Themes" -> "Theme"
 * - "Token" -> "Tokens"
 * - Other names are returned as-is
 */
export function normalizeCollectionName(name: string): string {
  const normalized = name.trim();
  const lower = normalized.toLowerCase();

  if (lower === "themes") {
    return VALID_COLLECTION_NAMES.THEME;
  }
  if (lower === "token") {
    return VALID_COLLECTION_NAMES.TOKENS;
  }
  if (lower === "layer") {
    return VALID_COLLECTION_NAMES.LAYER;
  }
  if (lower === "tokens") {
    return VALID_COLLECTION_NAMES.TOKENS;
  }
  if (lower === "theme") {
    return VALID_COLLECTION_NAMES.THEME;
  }

  // Return original name if not a standard collection
  return normalized;
}

/**
 * Checks if a collection name is one of the standard collections
 */
export function isStandardCollection(name: string): boolean {
  const normalized = normalizeCollectionName(name);
  return (
    normalized === VALID_COLLECTION_NAMES.LAYER ||
    normalized === VALID_COLLECTION_NAMES.TOKENS ||
    normalized === VALID_COLLECTION_NAMES.THEME
  );
}

/**
 * Gets the fixed GUID for standard collections (Layer, Theme, Tokens)
 * Returns undefined if not a standard collection
 */
export function getFixedGuidForCollection(name: string): string | undefined {
  const normalized = normalizeCollectionName(name);
  if (normalized === VALID_COLLECTION_NAMES.LAYER) {
    return FIXED_COLLECTION_GUIDS.LAYER;
  }
  if (normalized === VALID_COLLECTION_NAMES.TOKENS) {
    return FIXED_COLLECTION_GUIDS.TOKENS;
  }
  if (normalized === VALID_COLLECTION_NAMES.THEME) {
    return FIXED_COLLECTION_GUIDS.THEME;
  }
  return undefined;
}
