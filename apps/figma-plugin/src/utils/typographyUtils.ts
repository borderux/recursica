/**
 * Checks whether a given Figma variable name or path represents a synthetic/hidden
 * typography variable generated for UI Kit components (e.g., components_button_text).
 * These are generally filtered out to avoid cluttering Figma variables and UI.
 *
 * @param name The variable name or path to check (e.g., "typography/components_button_text")
 * @returns True if it's a UI Kit synthetic typography variable
 */
export function isUiKitTypography(name: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  return (
    lower.includes("/typography/components_") ||
    lower.includes("/typography/globals_") ||
    lower.includes("/typography/variants_") ||
    lower.startsWith("typography/components_") ||
    lower.startsWith("typography/globals_") ||
    lower.startsWith("typography/variants_")
  );
}
