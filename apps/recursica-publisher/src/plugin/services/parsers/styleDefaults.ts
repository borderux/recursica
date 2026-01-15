/**
 * Default values for Figma styles
 * Used to determine which properties should be exported (only non-defaults)
 */

export const TEXT_STYLE_DEFAULTS = {
  fontSize: 12,
  fontName: { family: "Roboto", style: "Regular" },
  letterSpacing: { value: 0, unit: "PIXELS" },
  lineHeight: { unit: "AUTO" },
  textCase: "ORIGINAL",
  textDecoration: "NONE",
  paragraphSpacing: 0,
  paragraphIndent: 0,
};

export const PAINT_STYLE_DEFAULTS = {
  paints: [],
};

export const EFFECT_STYLE_DEFAULTS = {
  effects: [],
};

export const GRID_STYLE_DEFAULTS = {
  layoutGrids: [],
};
