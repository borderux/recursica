/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FRAME_DEFAULTS, isDifferentFromDefault } from "./nodeDefaults";
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";
import { debugConsole } from "../debugConsole";

/**
 * Parser for FRAME, COMPONENT, COMPONENT_SET, and INSTANCE node types
 * All of these node types support auto-layout properties
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
  // Special handling for component variants: check parent COMPONENT_SET if variant has default/undefined sizing mode
  // In Figma UI, variants may show sizing mode from the COMPONENT_SET parent
  // Note: "Fill Container" in the UI is represented by having width/minWidth/maxWidth bound to variables,
  // not by setting primaryAxisSizingMode to "FILL" (which is not a valid API value)
  let primaryAxisSizingModeToUse = node.primaryAxisSizingMode;
  if (node.type === "COMPONENT" && node.parent?.type === "COMPONENT_SET") {
    const componentSet = node.parent;
    // Get width and bound variables for comprehensive debugging
    const variantWidth = (node as any).width;
    const variantWidthBoundVar = (node as any).boundVariables?.width;
    const variantMinWidthBoundVar = (node as any).boundVariables?.minWidth;
    const variantMaxWidthBoundVar = (node as any).boundVariables?.maxWidth;
    const componentSetWidth = (componentSet as any).width;
    const componentSetWidthBoundVar = (componentSet as any).boundVariables
      ?.width;

    // If variant has default/undefined sizing mode, check parent COMPONENT_SET
    if (
      primaryAxisSizingModeToUse === undefined ||
      primaryAxisSizingModeToUse === FRAME_DEFAULTS.primaryAxisSizingMode
    ) {
      if (
        componentSet.primaryAxisSizingMode !== undefined &&
        componentSet.primaryAxisSizingMode !==
          FRAME_DEFAULTS.primaryAxisSizingMode
      ) {
        primaryAxisSizingModeToUse = componentSet.primaryAxisSizingMode;
        debugConsole.log(
          `[EXPORT DEBUG] Component variant "${node.name}" (ID: ${node.id.substring(0, 8)}...): Using parent COMPONENT_SET primaryAxisSizingMode = "${primaryAxisSizingModeToUse}" (variant had "${node.primaryAxisSizingMode}")`,
        );
      } else {
        debugConsole.log(
          `[EXPORT DEBUG] Component variant "${node.name}" (ID: ${node.id.substring(0, 8)}...): primaryAxisSizingMode = "${node.primaryAxisSizingMode}", layoutMode = "${node.layoutMode}", default = "${FRAME_DEFAULTS.primaryAxisSizingMode}", parent = "${componentSet.primaryAxisSizingMode}"`,
        );
      }
    } else {
      // Variant has non-default value - log comprehensive info including width and bound variables
      debugConsole.log(
        `[EXPORT DEBUG] Component variant "${node.name}" (ID: ${node.id.substring(0, 8)}...): primaryAxisSizingMode = "${node.primaryAxisSizingMode}", layoutMode = "${node.layoutMode}", width = ${variantWidth}, widthBoundVar = ${variantWidthBoundVar ? JSON.stringify(variantWidthBoundVar) : "none"}, minWidthBoundVar = ${variantMinWidthBoundVar ? JSON.stringify(variantMinWidthBoundVar) : "none"}, maxWidthBoundVar = ${variantMaxWidthBoundVar ? JSON.stringify(variantMaxWidthBoundVar) : "none"}, parent COMPONENT_SET: primaryAxisSizingMode = "${componentSet.primaryAxisSizingMode}", width = ${componentSetWidth}, widthBoundVar = ${componentSetWidthBoundVar ? JSON.stringify(componentSetWidthBoundVar) : "none"}`,
      );
    }
  }

  if (
    primaryAxisSizingModeToUse !== undefined &&
    isDifferentFromDefault(
      primaryAxisSizingModeToUse,
      FRAME_DEFAULTS.primaryAxisSizingMode,
    )
  ) {
    result.primaryAxisSizingMode = primaryAxisSizingModeToUse;
    handledKeys.add("primaryAxisSizingMode");
    if (node.type === "COMPONENT" && node.parent?.type === "COMPONENT_SET") {
      debugConsole.log(
        `[EXPORT DEBUG] Component variant "${node.name}" (ID: ${node.id.substring(0, 8)}...): Exporting primaryAxisSizingMode = "${primaryAxisSizingModeToUse}"`,
      );
    }
  } else if (
    node.type === "COMPONENT" &&
    node.parent?.type === "COMPONENT_SET"
  ) {
    debugConsole.log(
      `[EXPORT DEBUG] Component variant "${node.name}" (ID: ${node.id.substring(0, 8)}...): NOT exporting primaryAxisSizingMode (undefined or default)`,
    );
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
    node.counterAxisSpacing !== undefined &&
    isDifferentFromDefault(
      node.counterAxisSpacing,
      FRAME_DEFAULTS.counterAxisSpacing,
    )
  ) {
    result.counterAxisSpacing = node.counterAxisSpacing;
    handledKeys.add("counterAxisSpacing");
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

  // Export layoutSizingHorizontal and layoutSizingVertical (these control "Fill Container" behavior)
  // These are shorthands that set multiple layout properties including layoutGrow, layoutAlign, etc.
  // Valid values: "FIXED", "HUG", "FILL"
  if ((node as any).layoutSizingHorizontal !== undefined) {
    result.layoutSizingHorizontal = (node as any).layoutSizingHorizontal;
    handledKeys.add("layoutSizingHorizontal");
  }
  if ((node as any).layoutSizingVertical !== undefined) {
    result.layoutSizingVertical = (node as any).layoutSizingVertical;
    handledKeys.add("layoutSizingVertical");
  }

  // Note: Unhandled keys are tracked centrally in extractNodeData

  return result;
}
