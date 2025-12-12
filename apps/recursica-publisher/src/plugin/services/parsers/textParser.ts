/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEXT_DEFAULTS, isDifferentFromDefault } from "./nodeDefaults";
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";

/**
 * Parser for TEXT node type
 */
export async function parseTextProperties(
  node: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: ParserContext,
): Promise<Partial<ParsedNodeData>> {
  const result: Partial<ParsedNodeData> = {};
  const handledKeys = new Set<string>();

  // Text content
  if (node.characters !== undefined && node.characters !== "") {
    result.characters = node.characters;
    handledKeys.add("characters");
  }

  // Font properties
  if (node.fontName !== undefined) {
    result.fontName = node.fontName;
    handledKeys.add("fontName");
  }
  if (node.fontSize !== undefined) {
    result.fontSize = node.fontSize;
    handledKeys.add("fontSize");
  }

  // Text alignment
  if (
    node.textAlignHorizontal !== undefined &&
    isDifferentFromDefault(
      node.textAlignHorizontal,
      TEXT_DEFAULTS.textAlignHorizontal,
    )
  ) {
    result.textAlignHorizontal = node.textAlignHorizontal;
    handledKeys.add("textAlignHorizontal");
  }
  if (
    node.textAlignVertical !== undefined &&
    isDifferentFromDefault(
      node.textAlignVertical,
      TEXT_DEFAULTS.textAlignVertical,
    )
  ) {
    result.textAlignVertical = node.textAlignVertical;
    handledKeys.add("textAlignVertical");
  }

  // Text spacing
  if (
    node.letterSpacing !== undefined &&
    isDifferentFromDefault(node.letterSpacing, TEXT_DEFAULTS.letterSpacing)
  ) {
    result.letterSpacing = node.letterSpacing;
    handledKeys.add("letterSpacing");
  }
  if (
    node.lineHeight !== undefined &&
    isDifferentFromDefault(node.lineHeight, TEXT_DEFAULTS.lineHeight)
  ) {
    result.lineHeight = node.lineHeight;
    handledKeys.add("lineHeight");
  }

  // Text styling
  if (
    node.textCase !== undefined &&
    isDifferentFromDefault(node.textCase, TEXT_DEFAULTS.textCase)
  ) {
    result.textCase = node.textCase;
    handledKeys.add("textCase");
  }
  if (
    node.textDecoration !== undefined &&
    isDifferentFromDefault(node.textDecoration, TEXT_DEFAULTS.textDecoration)
  ) {
    result.textDecoration = node.textDecoration;
    handledKeys.add("textDecoration");
  }
  if (
    node.textAutoResize !== undefined &&
    isDifferentFromDefault(node.textAutoResize, TEXT_DEFAULTS.textAutoResize)
  ) {
    result.textAutoResize = node.textAutoResize;
    handledKeys.add("textAutoResize");
  }
  if (
    node.paragraphSpacing !== undefined &&
    isDifferentFromDefault(
      node.paragraphSpacing,
      TEXT_DEFAULTS.paragraphSpacing,
    )
  ) {
    result.paragraphSpacing = node.paragraphSpacing;
    handledKeys.add("paragraphSpacing");
  }
  if (
    node.paragraphIndent !== undefined &&
    isDifferentFromDefault(node.paragraphIndent, TEXT_DEFAULTS.paragraphIndent)
  ) {
    result.paragraphIndent = node.paragraphIndent;
    handledKeys.add("paragraphIndent");
  }
  if (
    node.listOptions !== undefined &&
    isDifferentFromDefault(node.listOptions, TEXT_DEFAULTS.listOptions)
  ) {
    result.listOptions = node.listOptions;
    handledKeys.add("listOptions");
  }

  // Note: Unhandled keys are tracked centrally in extractNodeData

  return result;
}
