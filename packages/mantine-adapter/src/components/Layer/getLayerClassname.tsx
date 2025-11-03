export type LayerType =
  | "layer-0"
  | "layer-1"
  | "layer-2"
  | "layer-3"
  | "layer-alternative-alert"
  | "layer-alternative-warning"
  | "layer-alternative-primary-color"
  | "layer-alternative-high-contrast";

/**
 * Generates a CSS class name for the specified Recursica layer.
 *
 * @param layer - The layer type to generate a class name for. Must be one of "0", "1", "2", or "3".
 * @returns A CSS class name in the format `layer-{layer}` for valid layers, or an empty string for invalid/undefined layers.
 *
 * @example
 * ```typescript
 * getLayerClassname("0") // returns "layer-0"
 * getLayerClassname("2") // returns "layer-2"
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
  switch (layer) {
    case "layer-0":
      return "layer-0";
    case "layer-1":
      return "layer-1";
    case "layer-2":
      return "layer-2";
    case "layer-3":
      return "layer-3";
    case "layer-alternative-alert":
      return "layer-alternative-alert";
    case "layer-alternative-warning":
      return "layer-alternative-warning";
    case "layer-alternative-primary-color":
      return "layer-alternative-primary-color";
    case "layer-alternative-high-contrast":
      return "layer-alternative-high-contrast";
    default:
      console.warn(`Invalid Recursica layer: ${layer}`);
  }
  return "";
}
