/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEXT_STYLE_DEFAULTS } from "./styleDefaults";
import type { ParserContext } from "./baseNodeParser";
import { extractBoundVariables } from "./boundVariableParser";

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
  context: ParserContext,
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

  // Extract bound variables from style properties
  // Styles can have bound variables on properties like fontSize, fontName, letterSpacing, etc.
  if ((style as any).boundVariables) {
    const boundVars = await extractBoundVariables(
      (style as any).boundVariables,
      context.variableTable,
      context.collectionTable,
    );
    if (Object.keys(boundVars).length > 0) {
      result.boundVariables = boundVars;
    }
  }

  return result;
}

/**
 * Parser for PAINT style type
 */
export async function parsePaintStyle(
  style: PaintStyle,
  context: ParserContext,
): Promise<SerializedPaintStyle> {
  const result: SerializedPaintStyle = {};

  if (style.paints && style.paints.length > 0) {
    result.paints = [...style.paints];
  }

  // Extract bound variables from style properties
  // Paint styles can have bound variables on paints
  if ((style as any).boundVariables) {
    const boundVars = await extractBoundVariables(
      (style as any).boundVariables,
      context.variableTable,
      context.collectionTable,
    );
    if (Object.keys(boundVars).length > 0) {
      result.boundVariables = boundVars;
    }
  }

  return result;
}

/**
 * Parser for EFFECT style type
 */
export async function parseEffectStyle(
  style: EffectStyle,
  context: ParserContext,
): Promise<SerializedEffectStyle> {
  const result: SerializedEffectStyle = {};

  if (style.effects && style.effects.length > 0) {
    result.effects = [...style.effects];
  }

  // Extract bound variables from style properties
  if ((style as any).boundVariables) {
    const boundVars = await extractBoundVariables(
      (style as any).boundVariables,
      context.variableTable,
      context.collectionTable,
    );
    if (Object.keys(boundVars).length > 0) {
      result.boundVariables = boundVars;
    }
  }

  return result;
}

/**
 * Parser for GRID style type
 */
export async function parseGridStyle(
  style: GridStyle,
  context: ParserContext,
): Promise<SerializedGridStyle> {
  const result: SerializedGridStyle = {};

  if (style.layoutGrids && style.layoutGrids.length > 0) {
    result.layoutGrids = [...style.layoutGrids];
  }

  // Extract bound variables from style properties
  if ((style as any).boundVariables) {
    const boundVars = await extractBoundVariables(
      (style as any).boundVariables,
      context.variableTable,
      context.collectionTable,
    );
    if (Object.keys(boundVars).length > 0) {
      result.boundVariables = boundVars;
    }
  }

  return result;
}
