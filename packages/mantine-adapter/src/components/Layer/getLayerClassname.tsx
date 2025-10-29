export type LayerType = "0" | "1" | "2" | "3";

const VALID_LAYERS: LayerType[] = ["0", "1", "2", "3"];

/**
 * Generates a CSS class name for the specified Recursica layer.
 *
 * @param layer - The layer type to generate a class name for. Must be one of "0", "1", "2", or "3".
 * @returns A CSS class name in the format `recursica-layer-{layer}` for valid layers, or an empty string for invalid/undefined layers.
 *
 * @example
 * ```typescript
 * getLayerClassname("0") // returns "recursica-layer-0"
 * getLayerClassname("2") // returns "recursica-layer-2"
 * getLayerClassname("5") // returns ""
 * getLayerClassname(undefined) // returns ""
 * ```
 *
 * @since 1.0.0
 */
export function getLayerClassname(layer?: LayerType) {
  if (!layer) {
    return "";
  }
  if (VALID_LAYERS.includes(layer)) {
    console.warn(`Invalid Recursica layer: ${layer}`);
    return "";
  }
  return `recursica-layer-${layer}`;
}
