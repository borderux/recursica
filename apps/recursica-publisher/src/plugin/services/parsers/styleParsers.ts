/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEXT_STYLE_DEFAULTS } from "./styleDefaults";
import type { ParserContext } from "./baseNodeParser";

/**
 * Serialized text style (only non-default properties)
 */
export interface SerializedTextStyle {
  fontSize?: number;
  fontName?: FontName;
  letterSpacing?: LetterSpacing;
  lineHeight?: LineHeight;
  textCase?: TextCase;
  textDecoration?: TextDecoration;
  paragraphSpacing?: number;
  paragraphIndent?: number;
  boundVariables?: Record<string, any>;
}

/**
 * Serialized paint style
 */
export interface SerializedPaintStyle {
  paints?: Paint[];
  boundVariables?: Record<string, any>;
}

/**
 * Serialized effect style
 */
export interface SerializedEffectStyle {
  effects?: Effect[];
  boundVariables?: Record<string, any>;
}

/**
 * Serialized grid style
 */
export interface SerializedGridStyle {
  layoutGrids?: LayoutGrid[];
  boundVariables?: Record<string, any>;
}

/**
 * Parser for TEXT style type
 */
export async function parseTextStyle(
  style: TextStyle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: ParserContext,
): Promise<SerializedTextStyle> {
  const result: SerializedTextStyle = {};

  // Only include properties that differ from defaults
  if (style.fontSize !== TEXT_STYLE_DEFAULTS.fontSize) {
    result.fontSize = style.fontSize;
  }

  if (
    style.fontName.family !== TEXT_STYLE_DEFAULTS.fontName.family ||
    style.fontName.style !== TEXT_STYLE_DEFAULTS.fontName.style
  ) {
    result.fontName = style.fontName;
  }

  if (
    JSON.stringify(style.letterSpacing) !==
    JSON.stringify(TEXT_STYLE_DEFAULTS.letterSpacing)
  ) {
    result.letterSpacing = style.letterSpacing;
  }

  if (
    JSON.stringify(style.lineHeight) !==
    JSON.stringify(TEXT_STYLE_DEFAULTS.lineHeight)
  ) {
    result.lineHeight = style.lineHeight;
  }

  if (style.textCase !== TEXT_STYLE_DEFAULTS.textCase) {
    result.textCase = style.textCase;
  }

  if (style.textDecoration !== TEXT_STYLE_DEFAULTS.textDecoration) {
    result.textDecoration = style.textDecoration;
  }

  if (style.paragraphSpacing !== TEXT_STYLE_DEFAULTS.paragraphSpacing) {
    result.paragraphSpacing = style.paragraphSpacing;
  }

  if (style.paragraphIndent !== TEXT_STYLE_DEFAULTS.paragraphIndent) {
    result.paragraphIndent = style.paragraphIndent;
  }

  // Extract bound variables
  // Note: TextStyle doesn't have getBoundVariable method in the Figma API
  // Bound variables on styles are handled differently - they're stored in the style itself
  // For now, we'll skip extracting bound variables from styles during export
  // They will be preserved when the style is recreated during import
  // TODO: Find a way to extract bound variables from TextStyle if needed

  return result;
}

/**
 * Parser for PAINT style type
 */
export async function parsePaintStyle(
  style: PaintStyle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: ParserContext,
): Promise<SerializedPaintStyle> {
  const result: SerializedPaintStyle = {};

  if (style.paints && style.paints.length > 0) {
    result.paints = [...style.paints];
  }

  // Extract bound variables (would be in paints themselves)
  // This is handled at the fill level during export

  return result;
}

/**
 * Parser for EFFECT style type
 */
export async function parseEffectStyle(
  style: EffectStyle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: ParserContext,
): Promise<SerializedEffectStyle> {
  const result: SerializedEffectStyle = {};

  if (style.effects && style.effects.length > 0) {
    result.effects = [...style.effects];
  }

  return result;
}

/**
 * Parser for GRID style type
 */
export async function parseGridStyle(
  style: GridStyle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: ParserContext,
): Promise<SerializedGridStyle> {
  const result: SerializedGridStyle = {};

  if (style.layoutGrids && style.layoutGrids.length > 0) {
    result.layoutGrids = [...style.layoutGrids];
  }

  return result;
}
