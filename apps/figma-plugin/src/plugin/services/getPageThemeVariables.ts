/**
 * Scans the current Figma page's node tree and returns all variable-binding
 * issues found after a theme import.  The response payload contains:
 *
 *  • clashVariables  – OLD variables whose name collides with a _NEW import
 *  • unmatchedVariables – bound variables not present in any theme collection
 *  • referencedPages – other Recursica component pages referenced via instances
 *
 * The UI uses this data to let the user assign actions, then sends them back
 * via `applyPageThemeVariables` in a single batch.
 */

/// <reference types="@figma/plugin-typings" />

import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import { PLUGIN_DATA_KEY } from "./getComponentMetadata";

/* ------------------------------------------------------------------ */
/*  Public types (shared with UI via response.data)                   */
/* ------------------------------------------------------------------ */

export interface VariableBinding {
  nodeId: string;
  nodePath: string; // "Button / Content / Label"
  bindingProperty: string; // e.g. "fills", "itemSpacing"
}

export interface ClashVariableIssue {
  oldVariableId: string;
  oldVariableName: string;
  oldVariableType: string;
  oldVariableValue: string;
  newVariableId: string;
  newVariableName: string;
  newVariableType: string;
  newVariableValue: string;
  collectionName: string;
  bindings: VariableBinding[];
}

export interface ThemeVariableIssue {
  variableId: string;
  variableName: string;
  variableType: string;
  variableValue: string;
  collectionName: string;
  bindings: VariableBinding[];
}

export interface ReferencedPage {
  pageId: string;
  pageName: string;
}

export interface StyleBinding {
  nodeId: string;
  nodePath: string;
}

export interface ThemeStyleIssue {
  styleId: string;
  styleName: string;
  bindings: StyleBinding[];
}

export interface AvailableStyle {
  id: string;
  name: string;
}

export interface GetPageThemeVariablesResult {
  pageName: string;
  pageId: string;
  clashVariables: ClashVariableIssue[];
  unmatchedVariables: ThemeVariableIssue[];
  nonRecursicaVariables: ThemeVariableIssue[];
  nonRecursicaTextStyles: ThemeStyleIssue[];
  nonRecursicaEffectStyles: ThemeStyleIssue[];
  availableTextStyles: AvailableStyle[];
  availableEffectStyles: AvailableStyle[];
  referencedPages: ReferencedPage[];
  warnings: string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Theme collection names (case-insensitive). */
const THEME_COLLECTION_NAMES = new Set([
  "tokens",
  "token",
  "theme",
  "themes",
  "layer",
]);

/**
 * Build a lookup of all local theme variables keyed by `collectionName/variableName`.
 * Also returns a map of `_NEW` postfixed variables keyed by their base name (without _NEW).
 */
async function buildThemeVariableMaps(): Promise<{
  /** All variables in theme collections keyed by "collectionName/variableName" */
  themeVarSet: Set<string>;
  /** Map: baseName (without _NEW) → _NEW Variable */
  newVarsByBaseName: Map<string, Variable>;
  /** Map: variableId → Variable (for quick lookups) */
  varById: Map<string, Variable>;
  /** Map: variableId → collectionName */
  collectionNameById: Map<string, string>;
}> {
  const themeVarSet = new Set<string>();
  const newVarsByBaseName = new Map<string, Variable>();
  const varById = new Map<string, Variable>();
  const collectionNameById = new Map<string, string>();

  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  for (const collection of collections) {
    const normName = collection.name.trim().toLowerCase();
    if (!THEME_COLLECTION_NAMES.has(normName)) continue;

    for (const varId of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (!variable) continue;

      varById.set(variable.id, variable);
      collectionNameById.set(variable.id, collection.name);

      const key = `${collection.name}/${variable.name}`;
      themeVarSet.add(key);

      if (variable.name.endsWith("_NEW")) {
        const baseName = variable.name.slice(0, -4); // strip "_NEW"
        newVarsByBaseName.set(`${collection.name}/${baseName}`, variable);
      }
    }
  }

  return { themeVarSet, newVarsByBaseName, varById, collectionNameById };
}

/**
 * Build the human-readable node path by walking up the parent chain.
 */
function buildNodePath(node: SceneNode): string {
  const parts: string[] = [];
  let current: BaseNode | null = node;
  while (current && current.type !== "PAGE") {
    parts.unshift(current.name);
    current = current.parent;
  }
  return parts.join(" / ");
}

/* ------------------------------------------------------------------ */
/*  Recursive node walker                                             */
/* ------------------------------------------------------------------ */

interface WalkContext {
  themeVarSet: Set<string>;
  newVarsByBaseName: Map<string, Variable>;
  varById: Map<string, Variable>;
  collectionNameById: Map<string, string>;
  /** Accumulates clash issues keyed by oldVariableId for dedup */
  clashMap: Map<string, ClashVariableIssue>;
  /** Accumulates unmatched issues keyed by variableId for dedup */
  unmatchedMap: Map<string, ThemeVariableIssue>;
  /** Accumulates non-Recursica variables keyed by variableId for dedup */
  nonRecursicaMap: Map<string, ThemeVariableIssue>;
  /** Accumulates non-Recursica Text Styles keyed by styleId */
  nonRecursicaTextStyles: Map<string, ThemeStyleIssue>;
  /** Accumulates non-Recursica Effect Styles keyed by styleId */
  nonRecursicaEffectStyles: Map<string, ThemeStyleIssue>;
  /** Referenced Recursica pages keyed by pageId for dedup */
  referencedPages: Map<string, ReferencedPage>;
  /** Warnings log */
  warnings: string[];
  /** Processed variable IDs to avoid re-resolving */
  resolvedVarCache: Map<
    string,
    { collectionName: string; variable: Variable } | null
  >;
  /** Processed style IDs to avoid re-resolving */
  resolvedStyleCache: Map<string, BaseStyle | null>;
}

/**
 * Resolve a variable ID, with caching.
 */
async function resolveVariable(
  varId: string,
  ctx: WalkContext,
): Promise<{ collectionName: string; variable: Variable } | null> {
  if (ctx.resolvedVarCache.has(varId)) {
    return ctx.resolvedVarCache.get(varId)!;
  }

  const variable = await figma.variables.getVariableByIdAsync(varId);
  if (!variable) {
    ctx.resolvedVarCache.set(varId, null);
    return null;
  }

  let collectionName = ctx.collectionNameById.get(varId);
  if (!collectionName) {
    const collection = await figma.variables.getVariableCollectionByIdAsync(
      variable.variableCollectionId,
    );
    collectionName = collection?.name ?? "Unknown";
    ctx.collectionNameById.set(varId, collectionName);
  }

  const result = { collectionName, variable };
  ctx.resolvedVarCache.set(varId, result);
  return result;
}

/**
 * Serialize a variable's value for display purposes.
 */
function serializeVariableValue(variable: Variable): string {
  try {
    const modeIds = Object.keys(variable.valuesByMode);
    if (modeIds.length === 0) return "(no value)";
    const value = variable.valuesByMode[modeIds[0]];
    if (value === undefined || value === null) return "(no value)";
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof value === "object" && (value as any).type === "VARIABLE_ALIAS") {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aliasId = (value as any).id as string;
        const aliasVar = figma.variables.getVariableById(aliasId);
        if (aliasVar) {
          return `(alias) ${aliasVar.name}`;
        }
      } catch {
        // Fall through to default
      }
      return "(alias) INVALID";
    }
    // Color: { r, g, b, a }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v = value as any;
    if (v.r !== undefined && v.g !== undefined && v.b !== undefined) {
      const toHex = (n: number) =>
        Math.round(n * 255)
          .toString(16)
          .padStart(2, "0");
      return `#${toHex(v.r)}${toHex(v.g)}${toHex(v.b)}`;
    }
    return JSON.stringify(value);
  } catch {
    return "(unknown)";
  }
}

/** Human-readable labels for Figma bound variable property keys. */
const BINDING_PROPERTY_LABELS: Record<string, string> = {
  fills: "Fill Color",
  strokes: "Stroke Color",
  effects: "Effect Color",
  layoutGrids: "Layout Grid",
  itemSpacing: "Item Spacing",
  counterAxisSpacing: "Counter Axis Spacing",
  paddingTop: "Padding Top",
  paddingBottom: "Padding Bottom",
  paddingLeft: "Padding Left",
  paddingRight: "Padding Right",
  width: "Width",
  height: "Height",
  minWidth: "Min Width",
  maxWidth: "Max Width",
  minHeight: "Min Height",
  maxHeight: "Max Height",
  topLeftRadius: "Top Left Radius",
  topRightRadius: "Top Right Radius",
  bottomLeftRadius: "Bottom Left Radius",
  bottomRightRadius: "Bottom Right Radius",
  opacity: "Opacity",
  fontFamily: "Font Family",
  fontSize: "Font Size",
  fontWeight: "Font Weight",
  lineHeight: "Line Height",
  letterSpacing: "Letter Spacing",
  paragraphSpacing: "Paragraph Spacing",
  visible: "Visibility",
};

function bindingPropertyLabel(prop: string): string {
  return BINDING_PROPERTY_LABELS[prop] ?? prop;
}

/**
 * Process a single bound variable alias on a node.
 */
async function processBoundVariable(
  node: SceneNode,
  bindingProperty: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alias: any,
  ctx: WalkContext,
): Promise<void> {
  if (!alias || alias.type !== "VARIABLE_ALIAS" || !alias.id) return;

  const resolved = await resolveVariable(alias.id, ctx);
  if (!resolved) return;

  const { collectionName, variable } = resolved;
  const normCollName = collectionName.trim().toLowerCase();

  // Track variables from non-theme collections
  if (!THEME_COLLECTION_NAMES.has(normCollName)) {
    const binding: VariableBinding = {
      nodeId: node.id,
      nodePath: `${buildNodePath(node)} (${bindingPropertyLabel(bindingProperty)})`,
      bindingProperty,
    };
    const existing = ctx.nonRecursicaMap.get(variable.id);
    if (existing) {
      existing.bindings.push(binding);
    } else {
      ctx.nonRecursicaMap.set(variable.id, {
        variableId: variable.id,
        variableName: variable.name,
        variableType: variable.resolvedType,
        variableValue: serializeVariableValue(variable),
        collectionName,
        bindings: [binding],
      });
    }
    return;
  }

  const key = `${collectionName}/${variable.name}`;
  const binding: VariableBinding = {
    nodeId: node.id,
    nodePath: `${buildNodePath(node)} (${bindingPropertyLabel(bindingProperty)})`,
    bindingProperty,
  };

  // Check if this is an OLD variable that has a _NEW replacement
  const newVar = ctx.newVarsByBaseName.get(key);
  if (newVar && !variable.name.endsWith("_NEW")) {
    // This is a clash: the node is bound to the OLD (incorrect) variable
    const existing = ctx.clashMap.get(variable.id);
    if (existing) {
      existing.bindings.push(binding);
    } else {
      ctx.clashMap.set(variable.id, {
        oldVariableId: variable.id,
        oldVariableName: variable.name,
        oldVariableType: variable.resolvedType,
        oldVariableValue: serializeVariableValue(variable),
        newVariableId: newVar.id,
        newVariableName: newVar.name,
        newVariableType: newVar.resolvedType,
        newVariableValue: serializeVariableValue(newVar),
        collectionName,
        bindings: [binding],
      });
    }
    return;
  }

  // Check if variable is in the theme set — if yes it's matched, skip
  if (ctx.themeVarSet.has(key)) return;

  // Variable name also may have _NEW suffix itself; the _NEW vars are theme vars, skip
  if (variable.name.endsWith("_NEW")) return;

  // Unmatched: not in theme set, not a clash
  const existingUnmatched = ctx.unmatchedMap.get(variable.id);
  if (existingUnmatched) {
    existingUnmatched.bindings.push(binding);
  } else {
    ctx.unmatchedMap.set(variable.id, {
      variableId: variable.id,
      variableName: variable.name,
      variableType: variable.resolvedType,
      variableValue: serializeVariableValue(variable),
      collectionName,
      bindings: [binding],
    });
  }
}

/**
 * Walk all bound variables on a single node.
 */
async function processNodeBindings(
  node: SceneNode,
  ctx: WalkContext,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boundVars = (node as any).boundVariables;
  if (!boundVars || typeof boundVars !== "object") return;

  const promises: Promise<void>[] = [];

  // Recursive helper to find all VARIABLE_ALIAS objects within nested objects/arrays
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findAliases = (obj: any, topLevelProp: string) => {
    if (!obj || typeof obj !== "object") return;

    if (obj.type === "VARIABLE_ALIAS" && obj.id) {
      promises.push(processBoundVariable(node, topLevelProp, obj, ctx));
      return;
    }

    if (Array.isArray(obj)) {
      for (const item of obj) {
        findAliases(item, topLevelProp);
      }
    } else {
      for (const [key, value] of Object.entries(obj)) {
        // If we don't have a topLevelProp yet, this key is the top-level property
        findAliases(value, topLevelProp || key);
      }
    }
  };

  findAliases(boundVars, "");

  await Promise.all(promises);
}

/**
 * Process textStyleId and effectStyleId on a single node.
 */
async function processNodeStyles(
  node: SceneNode,
  ctx: WalkContext,
): Promise<void> {
  const checkStyle = async (
    styleId: string,
    map: Map<string, ThemeStyleIssue>,
    propertyLabel: string,
  ) => {
    let style = ctx.resolvedStyleCache.get(styleId);
    if (style === undefined) {
      style = (await figma.getStyleByIdAsync(styleId)) || null;
      ctx.resolvedStyleCache.set(styleId, style);
    }
    // Filter out styles that already belong to the Recursica folder or prefix
    if (style && !style.name.toLowerCase().startsWith("recursica/")) {
      const binding: StyleBinding = {
        nodeId: node.id,
        nodePath: `${buildNodePath(node)} (${propertyLabel})`,
      };
      const existing = map.get(style.id);
      if (existing) {
        existing.bindings.push(binding);
      } else {
        map.set(style.id, {
          styleId: style.id,
          styleName: style.name,
          bindings: [binding],
        });
      }
    }
  };

  if (
    "textStyleId" in node &&
    typeof node.textStyleId === "string" &&
    node.textStyleId
  ) {
    await checkStyle(
      node.textStyleId,
      ctx.nonRecursicaTextStyles,
      "Text Style",
    );
  }

  if (
    "effectStyleId" in node &&
    typeof node.effectStyleId === "string" &&
    node.effectStyleId
  ) {
    await checkStyle(
      node.effectStyleId,
      ctx.nonRecursicaEffectStyles,
      "Effect Style",
    );
  }
}

/**
 * Recursively walk the node tree.
 */
async function walkNodeTree(node: SceneNode, ctx: WalkContext): Promise<void> {
  await processNodeBindings(node, ctx);
  await processNodeStyles(node, ctx);

  // Check for component instance references to other pages
  if (node.type === "INSTANCE") {
    try {
      const mainComponent = await (
        node as InstanceNode
      ).getMainComponentAsync();
      if (mainComponent) {
        // Walk up to find the page
        let page: BaseNode | null = mainComponent.parent;
        while (page && page.type !== "PAGE") {
          page = page.parent;
        }

        if (page && page.type === "PAGE" && page.id !== figma.currentPage.id) {
          const pageNode = page as PageNode;
          if (!ctx.referencedPages.has(pageNode.id)) {
            const pluginData = pageNode.getPluginData(PLUGIN_DATA_KEY);
            if (pluginData) {
              ctx.referencedPages.set(pageNode.id, {
                pageId: pageNode.id,
                pageName: pageNode.name,
              });
            } else {
              ctx.warnings.push(
                `Skipped non-Recursica referenced page: "${pageNode.name}" (no component metadata)`,
              );
            }
          }
        }
      }
    } catch {
      // Skip if we can't resolve the main component
    }
  }

  // Recurse into children
  if ("children" in node) {
    for (const child of (node as ChildrenMixin).children) {
      await walkNodeTree(child as SceneNode, ctx);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Service entry point                                               */
/* ------------------------------------------------------------------ */

export interface GetPageThemeVariablesData {
  pageId?: string;
}

export async function getPageThemeVariables(
  data: GetPageThemeVariablesData,
): Promise<ResponseMessage> {
  try {
    // Determine target page
    let page: PageNode;
    if (data.pageId) {
      await figma.loadAllPagesAsync();
      const node = await figma.getNodeByIdAsync(data.pageId);
      if (!node || node.type !== "PAGE") {
        return retError(
          "getPageThemeVariables",
          `Page with ID ${(data.pageId ?? "").substring(0, 8)}... not found`,
        );
      }
      page = node as PageNode;
    } else {
      page = figma.currentPage;
    }

    // Validate it's a Recursica component page
    const pluginData = page.getPluginData(PLUGIN_DATA_KEY);
    if (!pluginData) {
      return retError(
        "getPageThemeVariables",
        `Page "${page.name}" is not a Recursica component page (no published metadata).`,
      );
    }

    console.log(
      `[getPageThemeVariables] Scanning page: "${page.name}" (${page.id})`,
    );

    // Build theme variable maps
    const { themeVarSet, newVarsByBaseName, varById, collectionNameById } =
      await buildThemeVariableMaps();

    console.log(
      `[getPageThemeVariables] Theme variables: ${themeVarSet.size}, _NEW pairs: ${newVarsByBaseName.size}`,
    );

    // Walk the page tree
    const ctx: WalkContext = {
      themeVarSet,
      newVarsByBaseName,
      varById,
      collectionNameById,
      clashMap: new Map(),
      unmatchedMap: new Map(),
      nonRecursicaMap: new Map(),
      nonRecursicaTextStyles: new Map(),
      nonRecursicaEffectStyles: new Map(),
      referencedPages: new Map(),
      warnings: [],
      resolvedVarCache: new Map(),
      resolvedStyleCache: new Map(),
    };

    for (const child of page.children) {
      await walkNodeTree(child as SceneNode, ctx);
    }

    const [allTextStyles, allEffectStyles] = await Promise.all([
      figma.getLocalTextStylesAsync(),
      figma.getLocalEffectStylesAsync(),
    ]);

    const sortWithComponentsLast = (
      a: { name: string },
      b: { name: string },
    ) => {
      const aComp = a.name.includes("components_");
      const bComp = b.name.includes("components_");
      if (aComp && !bComp) return 1;
      if (!aComp && bComp) return -1;
      return a.name.localeCompare(b.name);
    };

    const availableTextStyles = allTextStyles
      .filter((s) => s.name.toLowerCase().startsWith("recursica/"))
      .map((s) => ({ id: s.id, name: s.name }))
      .sort(sortWithComponentsLast);

    const availableEffectStyles = allEffectStyles
      .filter((s) => s.name.toLowerCase().startsWith("recursica/"))
      .map((s) => ({ id: s.id, name: s.name }))
      .sort(sortWithComponentsLast);

    const result: GetPageThemeVariablesResult = {
      pageName: page.name,
      pageId: page.id,
      clashVariables: [...ctx.clashMap.values()],
      unmatchedVariables: [...ctx.unmatchedMap.values()],
      nonRecursicaVariables: [...ctx.nonRecursicaMap.values()],
      nonRecursicaTextStyles: [...ctx.nonRecursicaTextStyles.values()],
      nonRecursicaEffectStyles: [...ctx.nonRecursicaEffectStyles.values()],
      availableTextStyles,
      availableEffectStyles,
      referencedPages: [...ctx.referencedPages.values()],
      warnings: ctx.warnings,
    };

    console.log(
      `[getPageThemeVariables] Done. Clashes: ${result.clashVariables.length}, Unmatched: ${result.unmatchedVariables.length}, Non-Recursica Vars: ${result.nonRecursicaVariables.length}, Legacy Text Styles: ${result.nonRecursicaTextStyles.length}, Legacy Effect Styles: ${result.nonRecursicaEffectStyles.length}`,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return retSuccess("getPageThemeVariables", result as any);
  } catch (error) {
    console.error("[getPageThemeVariables] Error:", error);
    return retError(
      "getPageThemeVariables",
      error instanceof Error ? error : String(error),
    );
  }
}
