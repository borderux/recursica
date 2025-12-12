/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_NODE_DEFAULTS, isDifferentFromDefault } from "./nodeDefaults";
import {
  extractBoundVariables,
  serializeFills,
  serializeBackgrounds,
} from "./boundVariableParser";
import type { VariableTable, CollectionTable } from "./variableTable";
import type { InstanceTable } from "./instanceTable";

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
  detachedComponentsHandled: Set<string>; // Component IDs we've already prompted for and decided to treat as internal
  exportedIds: Map<string, string>; // node ID -> node name (for duplicate detection)
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
    result.id = node.id;
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

  // Fills - special handling with bound variables
  if (node.fills !== undefined) {
    const fills = await serializeFills(
      node.fills,
      context.variableTable,
      context.collectionTable,
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
    const boundVars = await extractBoundVariables(
      node.boundVariables,
      context.variableTable,
      context.collectionTable,
    );
    if (Object.keys(boundVars).length > 0) {
      result.boundVariables = boundVars;
    }
    handledKeys.add("boundVariables");
  }

  // Backgrounds - special handling with bound variables (similar to fills)
  // "Selection colors" might be stored in backgrounds with bound variables
  if (node.backgrounds !== undefined) {
    const backgrounds = await serializeBackgrounds(
      node.backgrounds,
      context.variableTable,
      context.collectionTable,
    );
    // Only include if different from default (empty array)
    if (backgrounds && Array.isArray(backgrounds) && backgrounds.length > 0) {
      result.backgrounds = backgrounds;
    }
    handledKeys.add("backgrounds");
  }

  // Note: Unhandled keys are tracked centrally in extractNodeData
  // after all parsers have run

  return result;
}
