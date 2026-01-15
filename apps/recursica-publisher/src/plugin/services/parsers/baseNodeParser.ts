/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_NODE_DEFAULTS, isDifferentFromDefault } from "./nodeDefaults";
import {
  extractBoundVariables,
  serializeFills,
  serializeBackgrounds,
} from "./boundVariableParser";
import type { VariableTable, CollectionTable } from "./variableTable";
import type { InstanceTable } from "./instanceTable";
import type { StyleTable } from "./styleTable";
import type { ImageTable } from "./imageTable";
import { debugConsole } from "../debugConsole";

/**
 * Parser for common base node properties shared across all node types
 */
export interface ParserContext {
  visited: WeakSet<any>;
  depth: number;
  maxDepth: number;
  nodeCount: number;
  maxNodes: number;
  unhandledKeys: Set<string>;
  variableTable: VariableTable;
  collectionTable: CollectionTable;
  instanceTable: InstanceTable;
  styleTable: StyleTable;
  imageTable: ImageTable;
  detachedComponentsHandled: Set<string>; // Component IDs we've already prompted for and decided to treat as internal
  exportedIds: Map<string, string>; // node ID -> node name (for duplicate detection)
  skipPrompts?: boolean; // If true, skip user prompts and automatically handle detached instances
}

export interface ParsedNodeData {
  type: string;
  id?: string;
  name?: string;
  [key: string]: any;
  _unhandledKeys?: string[];
}

/**
 * Parses common base node properties
 * Returns object with serialized properties and tracks unhandled keys
 */
export async function parseBaseNodeProperties(
  node: any,
  context: ParserContext,
): Promise<Partial<ParsedNodeData>> {
  const result: Partial<ParsedNodeData> = {};
  const handledKeys = new Set<string>();

  // Always include type and id
  if (node.type) {
    result.type = node.type;
    handledKeys.add("type");
  }
  if (node.id) {
    // Ensure unique node ID using incrementing counter
    let finalId = node.id;
    let counter = 1;

    // Check if this ID is already used, append counter until unique
    while (context.exportedIds.has(finalId)) {
      finalId = `${node.id}_${counter}`;
      counter++;
    }

    // Debug: Log when uniqueness is applied
    if (finalId !== node.id) {
      debugConsole.log(
        `[EXPORT] ID uniqueness applied: ${node.id} → ${finalId} (${node.name || "unnamed"})`,
      );
    }

    // Always log the final assignment for verification
    debugConsole.log(
      `[EXPORT] Final ID assignment: ${finalId} to "${node.name || "unnamed"}" (original: ${node.id})`,
    );

    result.id = finalId;
    context.exportedIds.set(finalId, node.name || "unnamed");
    handledKeys.add("id");
  }

  // Basic properties
  if (node.name !== undefined && node.name !== "") {
    result.name = node.name;
    handledKeys.add("name");
  }

  // Position and size
  if (node.x !== undefined && node.x !== 0) {
    result.x = node.x;
    handledKeys.add("x");
  }
  if (node.y !== undefined && node.y !== 0) {
    result.y = node.y;
    handledKeys.add("y");
  }
  if (node.width !== undefined) {
    result.width = node.width;
    handledKeys.add("width");
  }
  if (node.height !== undefined) {
    result.height = node.height;
    handledKeys.add("height");
  }

  // ISSUE #3 DEBUG: Check for preserveRatio (may not be exported)
  const nodeName = node.name || "Unnamed";
  if ((node as any).preserveRatio !== undefined) {
    debugConsole.log(
      `[ISSUE #3 EXPORT DEBUG] "${nodeName}" has preserveRatio: ${(node as any).preserveRatio} (NOT being exported - needs to be added!)`,
    );
  }

  // ISSUE #4: Export constraints (constraintHorizontal and constraintVertical)
  // Constraints only exist on certain node types (FrameNode, ComponentNode, InstanceNode, etc.)
  // Not all nodes have constraints (e.g., VectorNode, TextNode don't have them)
  // Valid values: "MIN", "CENTER", "MAX", "STRETCH", "SCALE"
  // Default is "MIN" for both (Left/Top)
  // Only check for constraints on node types that support them
  const nodeType = node.type;
  const hasConstraints =
    nodeType === "FRAME" ||
    nodeType === "COMPONENT" ||
    nodeType === "INSTANCE" ||
    nodeType === "GROUP" ||
    nodeType === "BOOLEAN_OPERATION" ||
    nodeType === "VECTOR" ||
    nodeType === "STAR" ||
    nodeType === "LINE" ||
    nodeType === "ELLIPSE" ||
    nodeType === "POLYGON" ||
    nodeType === "RECTANGLE" ||
    nodeType === "TEXT";

  if (hasConstraints) {
    // Try direct properties first, then fall back to constraints object
    const constraintH: string | undefined =
      (node as any).constraintHorizontal !== undefined
        ? (node as any).constraintHorizontal
        : (node as any).constraints?.horizontal;
    const constraintV: string | undefined =
      (node as any).constraintVertical !== undefined
        ? (node as any).constraintVertical
        : (node as any).constraints?.vertical;

    if (constraintH !== undefined) {
      const isDifferent = isDifferentFromDefault(
        constraintH,
        BASE_NODE_DEFAULTS.constraintHorizontal,
      );
      if (isDifferent) {
        result.constraintHorizontal = constraintH;
        handledKeys.add("constraintHorizontal");
      }
    }

    if (constraintV !== undefined) {
      const isDifferent = isDifferentFromDefault(
        constraintV,
        BASE_NODE_DEFAULTS.constraintVertical,
      );
      if (isDifferent) {
        result.constraintVertical = constraintV;
        handledKeys.add("constraintVertical");
      }
    }
  } else {
    // Node type doesn't support constraints, skip logging to reduce noise
    // console.log(`[ISSUE #4 EXPORT DEBUG] "${nodeName}" (${nodeType}) does not support constraints`);
  }

  // Visual properties - only if different from defaults
  if (
    node.visible !== undefined &&
    isDifferentFromDefault(node.visible, BASE_NODE_DEFAULTS.visible)
  ) {
    result.visible = node.visible;
    handledKeys.add("visible");
  }
  if (
    node.locked !== undefined &&
    isDifferentFromDefault(node.locked, BASE_NODE_DEFAULTS.locked)
  ) {
    result.locked = node.locked;
    handledKeys.add("locked");
  }
  if (
    node.opacity !== undefined &&
    isDifferentFromDefault(node.opacity, BASE_NODE_DEFAULTS.opacity)
  ) {
    result.opacity = node.opacity;
    handledKeys.add("opacity");
  }
  if (
    node.rotation !== undefined &&
    isDifferentFromDefault(node.rotation, BASE_NODE_DEFAULTS.rotation)
  ) {
    result.rotation = node.rotation;
    handledKeys.add("rotation");
  }
  if (
    node.blendMode !== undefined &&
    isDifferentFromDefault(node.blendMode, BASE_NODE_DEFAULTS.blendMode)
  ) {
    result.blendMode = node.blendMode;
    handledKeys.add("blendMode");
  }

  // Effects
  if (
    node.effects !== undefined &&
    isDifferentFromDefault(node.effects, BASE_NODE_DEFAULTS.effects)
  ) {
    result.effects = node.effects;
    handledKeys.add("effects");
  }

  // Fills - special handling with bound variables and images
  if (node.fills !== undefined) {
    // Debug logging for text nodes with badge/color/label variables
    const nodeName = node.name || "Unnamed";
    const nodeType = node.type || "UNKNOWN";

    // Check for node-level boundVariables.fills override (instance child overrides)
    // Instance child overrides are stored in node.boundVariables.fills, not in node.fills[].boundVariables
    let fillsToSerialize = node.fills;
    const nodeBoundVars = (node as any).boundVariables;
    if (
      nodeBoundVars &&
      nodeBoundVars.fills &&
      Array.isArray(nodeBoundVars.fills)
    ) {
      // Merge node-level boundVariables.fills overrides into fills array
      fillsToSerialize = node.fills.map((fill: any, index: number) => {
        if (!fill || typeof fill !== "object") return fill;
        const override = nodeBoundVars.fills[index];
        if (override && typeof override === "object") {
          // Create a new fill object with the override merged in
          // Don't modify the original fill object (it's read-only from Figma API)
          const mergedFill: any = {};
          // Copy all properties from original fill
          for (const key in fill) {
            if (Object.prototype.hasOwnProperty.call(fill, key)) {
              if (key === "boundVariables") {
                // Merge boundVariables: start with original, then override
                mergedFill.boundVariables = {
                  ...(fill.boundVariables || {}),
                  ...override,
                };
              } else {
                mergedFill[key] = fill[key];
              }
            }
          }
          return mergedFill;
        }
        return fill;
      });

      // Debug logging for instance child overrides
      if (nodeType === "TEXT") {
        for (let i = 0; i < fillsToSerialize.length; i++) {
          const fill = fillsToSerialize[i];
          if (fill && fill.boundVariables && fill.boundVariables.color) {
            const boundVar = fill.boundVariables.color;
            if (boundVar && boundVar.type === "VARIABLE_ALIAS") {
              try {
                const variable = await figma.variables.getVariableByIdAsync(
                  boundVar.id,
                );
                if (variable && variable.name.includes("badge/color/label")) {
                  const hasOverride =
                    nodeBoundVars.fills && nodeBoundVars.fills[i];
                  debugConsole.log(
                    `[EXPORT DEBUG] TEXT node "${nodeName}" (${nodeType}) has fill[${i}] bound to variable "${variable.name}" (ID: ${boundVar.id})${hasOverride ? " [INSTANCE OVERRIDE]" : ""}`,
                  );
                }
              } catch {
                // Ignore errors - just for debug logging
              }
            }
          }
        }
      }
    } else if (nodeType === "TEXT" && node.fills && Array.isArray(node.fills)) {
      // Original debug logging for non-override case
      for (const fill of node.fills) {
        if (fill && fill.boundVariables && fill.boundVariables.color) {
          const boundVar = fill.boundVariables.color;
          if (boundVar && boundVar.type === "VARIABLE_ALIAS") {
            try {
              const variable = await figma.variables.getVariableByIdAsync(
                boundVar.id,
              );
              if (variable && variable.name.includes("badge/color/label")) {
                debugConsole.log(
                  `[EXPORT DEBUG] TEXT node "${nodeName}" (${nodeType}) has fill bound to variable "${variable.name}" (ID: ${boundVar.id})`,
                );
              }
            } catch {
              // Ignore errors - just for debug logging
            }
          }
        }
      }
    }

    const fills = await serializeFills(
      fillsToSerialize,
      context.variableTable,
      context.collectionTable,
      context.imageTable,
    );
    if (isDifferentFromDefault(fills, BASE_NODE_DEFAULTS.fills)) {
      result.fills = fills;
    }
    handledKeys.add("fills");
  }

  // Strokes
  if (
    node.strokes !== undefined &&
    isDifferentFromDefault(node.strokes, BASE_NODE_DEFAULTS.strokes)
  ) {
    result.strokes = node.strokes;
    handledKeys.add("strokes");
  }
  if (
    node.strokeWeight !== undefined &&
    isDifferentFromDefault(node.strokeWeight, BASE_NODE_DEFAULTS.strokeWeight)
  ) {
    result.strokeWeight = node.strokeWeight;
    handledKeys.add("strokeWeight");
  }
  if (
    node.strokeAlign !== undefined &&
    isDifferentFromDefault(node.strokeAlign, BASE_NODE_DEFAULTS.strokeAlign)
  ) {
    result.strokeAlign = node.strokeAlign;
    handledKeys.add("strokeAlign");
  }

  // Bound variables - special handling
  if (node.boundVariables !== undefined && node.boundVariables !== null) {
    // ISSUE #2: Debug log all bound variables to see what's being exported
    const nodeName = node.name || "Unnamed";
    const boundVarKeys = Object.keys(node.boundVariables);
    if (boundVarKeys.length > 0) {
      debugConsole.log(
        `[ISSUE #2 EXPORT DEBUG] "${nodeName}" (${node.type}) has boundVariables for: ${boundVarKeys.join(", ")}`,
      );
    } else {
      debugConsole.log(
        `[ISSUE #2 EXPORT DEBUG] "${nodeName}" (${node.type}) has no boundVariables`,
      );
    }

    const boundVars = await extractBoundVariables(
      node.boundVariables,
      context.variableTable,
      context.collectionTable,
    );

    const extractedKeys = Object.keys(boundVars);
    if (extractedKeys.length > 0) {
      debugConsole.log(
        `[ISSUE #2 EXPORT DEBUG] "${nodeName}" extracted boundVariables: ${extractedKeys.join(", ")}`,
      );
    }

    if (Object.keys(boundVars).length > 0) {
      result.boundVariables = boundVars;
    }
    handledKeys.add("boundVariables");
  }

  // Backgrounds - special handling with bound variables and images (similar to fills)
  // "Selection colors" might be stored in backgrounds with bound variables
  if (node.backgrounds !== undefined) {
    const backgrounds = await serializeBackgrounds(
      node.backgrounds,
      context.variableTable,
      context.collectionTable,
      context.imageTable,
    );
    // Only include if different from default (empty array)
    if (backgrounds && Array.isArray(backgrounds) && backgrounds.length > 0) {
      result.backgrounds = backgrounds;
    }
    handledKeys.add("backgrounds");
  }

  // Note: selectionColor is not actually a node property - it's just a UI indicator in Figma
  // showing that a child node has a fill color bound to a variable. The child's fills binding
  // is already handled by the normal export/import process for bound variables on fills.
  // We only export selectionColor if it exists as a direct property (rare, for backwards compatibility)
  const selectionColor = (node as any).selectionColor;
  if (selectionColor !== undefined) {
    result.selectionColor = selectionColor;
    handledKeys.add("selectionColor");
  }

  // Export componentPropertyReferences if present
  // This binds node properties to component properties (e.g., characters for TEXT, visible for BOOLEAN properties)
  // Can apply to any node type inside a component
  if (
    node.componentPropertyReferences &&
    typeof node.componentPropertyReferences === "object"
  ) {
    result.componentPropertyReferences = node.componentPropertyReferences;
    handledKeys.add("componentPropertyReferences");
    debugConsole.log(
      `  [EXPORT] ✓ Exported componentPropertyReferences for ${node.type} node "${node.name || "Unnamed"}": ${JSON.stringify(node.componentPropertyReferences)}`,
    );
  }

  // Note: Unhandled keys are tracked centrally in extractNodeData
  // after all parsers have run

  return result;
}
