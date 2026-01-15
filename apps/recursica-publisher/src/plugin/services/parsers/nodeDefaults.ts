/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Default values for Figma node properties
 * These are used to determine which properties should be serialized
 * (only non-default values are saved to reduce JSON size)
 */

export const BASE_NODE_DEFAULTS = {
  visible: true,
  locked: false,
  opacity: 1,
  blendMode: "PASS_THROUGH",
  rotation: 0,
  effects: [],
  fills: [],
  strokes: [],
  strokeWeight: 1,
  strokeAlign: "CENTER",
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: [],
  constraintHorizontal: "MIN", // Default: Left/Top
  constraintVertical: "MIN", // Default: Left/Top
} as const;

export const FRAME_DEFAULTS = {
  ...BASE_NODE_DEFAULTS,
  layoutMode: "NONE",
  primaryAxisSizingMode: "AUTO",
  counterAxisSizingMode: "AUTO",
  primaryAxisAlignItems: "MIN",
  counterAxisAlignItems: "MIN",
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  itemSpacing: 0,
  counterAxisSpacing: 0,
  cornerRadius: 0,
  clipsContent: false,
  layoutWrap: "NO_WRAP",
  layoutGrow: 0,
} as const;

export const TEXT_DEFAULTS = {
  ...BASE_NODE_DEFAULTS,
  textAlignHorizontal: "LEFT",
  textAlignVertical: "TOP",
  letterSpacing: { value: 0, unit: "PIXELS" },
  lineHeight: { unit: "AUTO" },
  textCase: "ORIGINAL",
  textDecoration: "NONE",
  textAutoResize: "WIDTH",
  paragraphSpacing: 0,
  paragraphIndent: 0,
  listOptions: null,
} as const;

export const VECTOR_DEFAULTS = {
  ...BASE_NODE_DEFAULTS,
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: [],
} as const;

export const SHAPE_DEFAULTS = {
  ...BASE_NODE_DEFAULTS,
  cornerRadius: 0,
} as const;

export const LINE_DEFAULTS = {
  ...BASE_NODE_DEFAULTS,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: [],
} as const;

/**
 * Get default values for a specific node type
 */
export function getDefaultsForNodeType(nodeType: string): any {
  switch (nodeType) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return FRAME_DEFAULTS;
    case "TEXT":
      return TEXT_DEFAULTS;
    case "VECTOR":
      return VECTOR_DEFAULTS;
    case "LINE":
      return LINE_DEFAULTS;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return SHAPE_DEFAULTS;
    default:
      return BASE_NODE_DEFAULTS;
  }
}

/**
 * Check if a value is different from its default
 */
export function isDifferentFromDefault(value: any, defaultValue: any): boolean {
  // Handle arrays
  if (Array.isArray(value)) {
    if (Array.isArray(defaultValue)) {
      return (
        value.length !== defaultValue.length ||
        value.some((v, i) => isDifferentFromDefault(v, defaultValue[i]))
      );
    }
    return value.length > 0;
  }

  // Handle objects
  if (typeof value === "object" && value !== null) {
    if (typeof defaultValue === "object" && defaultValue !== null) {
      // Deep comparison for objects
      const valueKeys = Object.keys(value);
      const defaultKeys = Object.keys(defaultValue);
      if (valueKeys.length !== defaultKeys.length) return true;
      return valueKeys.some(
        (key) =>
          !(key in defaultValue) ||
          isDifferentFromDefault(value[key], defaultValue[key]),
      );
    }
    return true;
  }

  // Primitive comparison
  return value !== defaultValue;
}
