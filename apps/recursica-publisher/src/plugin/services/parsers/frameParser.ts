/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FRAME_DEFAULTS, isDifferentFromDefault } from "./nodeDefaults";
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";

/**
 * Parser for FRAME, COMPONENT, and INSTANCE node types
 */
export async function parseFrameProperties(
  node: any,
  _context: ParserContext,
): Promise<Partial<ParsedNodeData>> {
  const result: Partial<ParsedNodeData> = {};
  const handledKeys = new Set<string>();

  // For COMPONENT nodes, export component property definitions
  // This is needed to recreate components with the same properties during import
  if (node.type === "COMPONENT") {
    try {
      if ((node as any).componentPropertyDefinitions) {
        result.componentPropertyDefinitions = (
          node as any
        ).componentPropertyDefinitions;
        handledKeys.add("componentPropertyDefinitions");
      }
    } catch {
      // Property definitions might not be accessible
    }
  }

  // Layout properties
  if (
    node.layoutMode !== undefined &&
    isDifferentFromDefault(node.layoutMode, FRAME_DEFAULTS.layoutMode)
  ) {
    result.layoutMode = node.layoutMode;
    handledKeys.add("layoutMode");
  }
  if (
    node.primaryAxisSizingMode !== undefined &&
    isDifferentFromDefault(
      node.primaryAxisSizingMode,
      FRAME_DEFAULTS.primaryAxisSizingMode,
    )
  ) {
    result.primaryAxisSizingMode = node.primaryAxisSizingMode;
    handledKeys.add("primaryAxisSizingMode");
  }
  if (
    node.counterAxisSizingMode !== undefined &&
    isDifferentFromDefault(
      node.counterAxisSizingMode,
      FRAME_DEFAULTS.counterAxisSizingMode,
    )
  ) {
    result.counterAxisSizingMode = node.counterAxisSizingMode;
    handledKeys.add("counterAxisSizingMode");
  }
  if (
    node.primaryAxisAlignItems !== undefined &&
    isDifferentFromDefault(
      node.primaryAxisAlignItems,
      FRAME_DEFAULTS.primaryAxisAlignItems,
    )
  ) {
    result.primaryAxisAlignItems = node.primaryAxisAlignItems;
    handledKeys.add("primaryAxisAlignItems");
  }
  if (
    node.counterAxisAlignItems !== undefined &&
    isDifferentFromDefault(
      node.counterAxisAlignItems,
      FRAME_DEFAULTS.counterAxisAlignItems,
    )
  ) {
    result.counterAxisAlignItems = node.counterAxisAlignItems;
    handledKeys.add("counterAxisAlignItems");
  }
  if (
    node.paddingLeft !== undefined &&
    isDifferentFromDefault(node.paddingLeft, FRAME_DEFAULTS.paddingLeft)
  ) {
    result.paddingLeft = node.paddingLeft;
    handledKeys.add("paddingLeft");
  }
  if (
    node.paddingRight !== undefined &&
    isDifferentFromDefault(node.paddingRight, FRAME_DEFAULTS.paddingRight)
  ) {
    result.paddingRight = node.paddingRight;
    handledKeys.add("paddingRight");
  }
  if (
    node.paddingTop !== undefined &&
    isDifferentFromDefault(node.paddingTop, FRAME_DEFAULTS.paddingTop)
  ) {
    result.paddingTop = node.paddingTop;
    handledKeys.add("paddingTop");
  }
  if (
    node.paddingBottom !== undefined &&
    isDifferentFromDefault(node.paddingBottom, FRAME_DEFAULTS.paddingBottom)
  ) {
    result.paddingBottom = node.paddingBottom;
    handledKeys.add("paddingBottom");
  }
  if (
    node.itemSpacing !== undefined &&
    isDifferentFromDefault(node.itemSpacing, FRAME_DEFAULTS.itemSpacing)
  ) {
    result.itemSpacing = node.itemSpacing;
    handledKeys.add("itemSpacing");
  }
  if (
    node.cornerRadius !== undefined &&
    isDifferentFromDefault(node.cornerRadius, FRAME_DEFAULTS.cornerRadius)
  ) {
    result.cornerRadius = node.cornerRadius;
    handledKeys.add("cornerRadius");
  }
  if (
    node.clipsContent !== undefined &&
    isDifferentFromDefault(node.clipsContent, FRAME_DEFAULTS.clipsContent)
  ) {
    result.clipsContent = node.clipsContent;
    handledKeys.add("clipsContent");
  }
  if (
    node.layoutWrap !== undefined &&
    isDifferentFromDefault(node.layoutWrap, FRAME_DEFAULTS.layoutWrap)
  ) {
    result.layoutWrap = node.layoutWrap;
    handledKeys.add("layoutWrap");
  }
  if (
    node.layoutGrow !== undefined &&
    isDifferentFromDefault(node.layoutGrow, FRAME_DEFAULTS.layoutGrow)
  ) {
    result.layoutGrow = node.layoutGrow;
    handledKeys.add("layoutGrow");
  }

  // Note: Unhandled keys are tracked centrally in extractNodeData

  return result;
}
