/**
 * Token to CSS transformation utilities
 *
 * This module provides common utilities for converting design tokens into CSS custom properties.
 * It abstracts the repetitive logic used across different CSS generation functions to ensure
 * consistency and maintainability.
 */

/**
 * Configuration options for token-to-CSS transformation
 */
export interface TokenToCssOptions {
  /** Whether to include only string and number values (for basic tokens) */
  filterPrimitives?: boolean;
  /** Custom CSS variable name transformation function */
  nameTransform?: (key: string) => string;
  /** Whether to handle token references (objects with collection/name) */
  handleReferences?: boolean;
  /** Whether to handle string token references (strings containing "/") */
  handleStringReferences?: boolean;
}

/**
 * Default CSS variable name transformation
 * Converts token names to kebab-case CSS custom property format
 */
export function defaultNameTransform(key: string): string {
  return key.replace(/[\/\s]/g, "-").toLowerCase();
}

/**
 * Converts a token value to a CSS custom property value
 *
 * @param key - The token key/name
 * @param value - The token value
 * @param options - Transformation options
 * @returns CSS custom property string or null if value should be skipped
 */
export function tokenValueToCss(
  key: string,
  value: any,
  options: TokenToCssOptions = {},
): string | null {
  const {
    nameTransform = defaultNameTransform,
    handleReferences = true,
    handleStringReferences = true,
  } = options;

  const cssVarName = nameTransform(key);

  // Handle token references (objects with collection and name)
  if (
    handleReferences &&
    typeof value === "object" &&
    value !== null &&
    "collection" in value &&
    "name" in value
  ) {
    const ref = value as { collection: string; name: string };
    const refVarName = nameTransform(ref.name);
    return `  --${cssVarName}: var(--${refVarName});`;
  }

  // Handle string values that might be token references
  if (
    handleStringReferences &&
    typeof value === "string" &&
    value.includes("/")
  ) {
    const tokenVarName = nameTransform(value);
    return `  --${cssVarName}: var(--${tokenVarName});`;
  }

  // Handle direct primitive values
  if (typeof value === "string" || typeof value === "number") {
    return `  --${cssVarName}: ${value};`;
  }

  // Skip other types
  return null;
}

/**
 * Converts a collection of tokens to CSS custom properties
 *
 * @param tokens - Object containing token key-value pairs
 * @param options - Transformation options
 * @returns Array of CSS custom property strings
 */
export function tokensToCssVariables(
  tokens: Record<string, any>,
  options: TokenToCssOptions = {},
): string[] {
  const { filterPrimitives = false } = options;

  return Object.entries(tokens)
    .filter(([_, value]) => {
      if (filterPrimitives) {
        return typeof value === "string" || typeof value === "number";
      }
      return true;
    })
    .map(([key, value]) => tokenValueToCss(key, value, options))
    .filter(Boolean) as string[];
}

/**
 * Converts a token value to a JavaScript object property value
 *
 * @param key - The token key/name
 * @param value - The token value
 * @param options - Transformation options
 * @returns JavaScript object property string or null if value should be skipped
 */
export function tokenValueToJs(
  key: string,
  value: any,
  options: TokenToCssOptions = {},
): string | null {
  const {
    nameTransform = defaultNameTransform,
    handleReferences = true,
    handleStringReferences = true,
  } = options;

  const cssVarName = nameTransform(key);

  // Handle token references (objects with collection and name)
  if (
    handleReferences &&
    typeof value === "object" &&
    value !== null &&
    "collection" in value &&
    "name" in value
  ) {
    const ref = value as { collection: string; name: string };
    const refVarName = nameTransform(ref.name);
    return `  "${key}": "var(--${refVarName})"`;
  }

  // Handle string values that might be token references
  if (
    handleStringReferences &&
    typeof value === "string" &&
    value.includes("/")
  ) {
    const tokenVarName = nameTransform(value);
    return `  "${key}": "var(--${tokenVarName})"`;
  }

  // Handle direct primitive values
  if (typeof value === "string" || typeof value === "number") {
    return `  "${key}": "var(--${cssVarName})"`;
  }

  // Skip other types
  return null;
}

/**
 * Converts a collection of tokens to JavaScript object properties
 *
 * @param tokens - Object containing token key-value pairs
 * @param options - Transformation options
 * @returns Array of JavaScript object property strings
 */
export function tokensToJsProperties(
  tokens: Record<string, any>,
  options: TokenToCssOptions = {},
): string[] {
  const { filterPrimitives = false } = options;

  return Object.entries(tokens)
    .filter(([_, value]) => {
      if (filterPrimitives) {
        return typeof value === "string" || typeof value === "number";
      }
      return true;
    })
    .map(([key, value]) => tokenValueToJs(key, value, options))
    .filter(Boolean) as string[];
}

/**
 * Converts a collection of tokens to a formatted JavaScript object properties block
 *
 * @param tokens - Object containing token key-value pairs
 * @param options - Transformation options
 * @returns Formatted JavaScript object properties string
 */
export function tokensToJsBlock(
  tokens: Record<string, any>,
  options: TokenToCssOptions = {},
): string {
  return tokensToJsProperties(tokens, options).join(",\n");
}

/**
 * Predefined configurations for different token types
 */
export const TOKEN_CONFIGS = {
  /** Configuration for basic design tokens (primitives only) */
  BASIC_TOKENS: {
    filterPrimitives: true,
    nameTransform: (key: string) => key.replace(/\//g, "-").toLowerCase(),
    handleReferences: false,
    handleStringReferences: false,
  } as TokenToCssOptions,

  /** Configuration for UI Kit tokens (with references) */
  UI_KIT_TOKENS: {
    filterPrimitives: false,
    nameTransform: defaultNameTransform,
    handleReferences: true,
    handleStringReferences: true,
  } as TokenToCssOptions,

  /** Configuration for theme tokens (with references) */
  THEME_TOKENS: {
    filterPrimitives: false,
    nameTransform: defaultNameTransform,
    handleReferences: true,
    handleStringReferences: false,
  } as TokenToCssOptions,
} as const;
