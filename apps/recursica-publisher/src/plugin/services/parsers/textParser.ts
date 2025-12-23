/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEXT_DEFAULTS, isDifferentFromDefault } from "./nodeDefaults";
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";
import { parseTextStyle } from "./styleParsers";
import { debugConsole } from "../debugConsole";

/**
 * Parser for TEXT node type
 */
export async function parseTextProperties(
  node: any,
  context: ParserContext,
): Promise<Partial<ParsedNodeData>> {
  const result: Partial<ParsedNodeData> = {};
  const handledKeys = new Set<string>();

  // Check for textStyleId first and replace with _styleRef
  if (node.textStyleId !== undefined && node.textStyleId !== "") {
    try {
      const style = await figma.getStyleByIdAsync(node.textStyleId);
      if (style && style.type === "TEXT") {
        // Check if style is already in styleTable
        let styleIndex = context.styleTable.getStyleIndex(style.key);
        if (styleIndex < 0) {
          // Style not in table yet - parse and add it
          const parsed = await parseTextStyle(style as TextStyle, context);
          styleIndex = context.styleTable.addStyle({
            type: "TEXT",
            name: style.name,
            styleKey: style.key,
            textStyle: parsed,
            boundVariables: parsed.boundVariables,
          });
          debugConsole.log(
            `  [EXPORT] Added text style "${style.name}" to style table at index ${styleIndex} for text node "${node.name || "Unnamed"}"`,
          );
        } else {
          debugConsole.log(
            `  [EXPORT] Reusing existing text style "${style.name}" from style table at index ${styleIndex} for text node "${node.name || "Unnamed"}"`,
          );
        }
        result._styleRef = styleIndex;
        handledKeys.add("_styleRef");
        handledKeys.add("textStyleId"); // Mark original textStyleId as handled
        debugConsole.log(
          `  [EXPORT] ✓ Exported text node "${node.name || "Unnamed"}" with _styleRef=${styleIndex} (style: "${style.name}")`,
        );
      } else {
        debugConsole.warning(
          `  [EXPORT] Text node "${node.name || "Unnamed"}" has textStyleId but style lookup returned null or wrong type`,
        );
      }
    } catch (error) {
      // If style lookup fails, continue with individual properties
      debugConsole.warning(
        `  [EXPORT] Could not look up text style for node "${node.name || "Unnamed"}": ${error}`,
      );
    }
  } else {
    debugConsole.log(
      `  [EXPORT] Text node "${node.name || "Unnamed"}" has no textStyleId (textStyleId=${node.textStyleId})`,
    );
  }

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
