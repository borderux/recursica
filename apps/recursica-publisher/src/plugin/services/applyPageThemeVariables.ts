/**
 * Executes the user's decisions about variable-binding issues in a single batch.
 *
 * For clash actions (action: "delete"):
 *   - Unbinds the OLD variable from all nodes on the current page
 *   - Deletes the OLD variable
 *
 * For unmatched actions (action: "ignore"):
 *   - Logs the decision, no operational change
 *
 * After all clash deletions, renames every remaining _NEW-postfixed variable
 * to remove the suffix.  Figma preserves bindings through variable renames.
 */

/// <reference types="@figma/plugin-typings" />

import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";

/* ------------------------------------------------------------------ */
/*  Public types (sent from UI)                                       */
/* ------------------------------------------------------------------ */

export interface ClashAction {
  oldVariableId: string;
  action: "delete"; // "fix" reserved for future
}

export interface UnmatchedAction {
  variableId: string;
  action: "ignore" | "fix";
  newVariablePath?: string;
}

export interface StyleAction {
  styleId: string;
  action: "ignore" | "map";
  mappedStyleId?: string;
}

export interface ApplyPageThemeVariablesData {
  clashActions: ClashAction[];
  unmatchedActions: UnmatchedAction[];
  textStyleActions?: StyleAction[];
  effectStyleActions?: StyleAction[];
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
 * Unbind a specific variable from a node's boundVariables.
 * Walks each binding property and removes entries that reference the target
 * variable ID.
 */
function unbindVariableFromNode(
  node: SceneNode,
  targetVariableId: string,
): string[] {
  const log: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boundVars = (node as any).boundVariables;
  if (!boundVars || typeof boundVars !== "object") return log;

  for (const [prop, value] of Object.entries(boundVars)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (
          item &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item as any).type === "VARIABLE_ALIAS" &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item as any).id === targetVariableId
        ) {
          // For array-based bindings (e.g., fills), we need to set the
          // field to its current resolved literal value to remove the binding.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const currentValue = (node as any)[prop];
          if (currentValue !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (node as any)[prop] = currentValue;
          }
          log.push(
            `Unbound ${prop} from "${node.name}" (${node.id.substring(0, 8)}...)`,
          );
        }
      }
    } else if (
      value &&
      typeof value === "object" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value as any).type === "VARIABLE_ALIAS" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value as any).id === targetVariableId
    ) {
      // Set to current resolved value to remove the binding
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentValue = (node as any)[prop];
      if (currentValue !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node as any)[prop] = currentValue;
      }
      log.push(
        `Unbound ${prop} from "${node.name}" (${node.id.substring(0, 8)}...)`,
      );
    }
  }

  return log;
}

/**
 * Rebinds a specific variable on a node's boundVariables to a new Variable, supporting arrays like fills/strokes.
 */
function rebindVariableOnNode(
  node: SceneNode,
  oldVariableId: string,
  newVariable: Variable,
): string[] {
  const log: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boundVars = (node as any).boundVariables;
  if (!boundVars || typeof boundVars !== "object") return log;

  for (const [prop, value] of Object.entries(boundVars)) {
    if (Array.isArray(value)) {
      // Array property like fills, strokes, effects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentArray = (node as any)[prop];
      if (!Array.isArray(currentArray)) continue;

      let changed = false;
      const newArray = currentArray.map((item) => {
        if (!item || typeof item !== "object") return item;

        let itemChanged = false;
        const newItem = { ...item };

        // Find bindings inside this paint/effect
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bindings = (item as any).boundVariables;
        if (!bindings) return item;

        for (const [field, alias] of Object.entries(bindings)) {
          if (
            alias &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (alias as any).type === "VARIABLE_ALIAS" &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (alias as any).id === oldVariableId
          ) {
            try {
              if (prop === "fills" || prop === "strokes") {
                const newPaint = figma.variables.setBoundVariableForPaint(
                  newItem,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  field as any,
                  newVariable,
                );
                Object.assign(newItem, newPaint);
                itemChanged = true;
              } else if (prop === "effects") {
                const newEffect = figma.variables.setBoundVariableForEffect(
                  newItem,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  field as any,
                  newVariable,
                );
                Object.assign(newItem, newEffect);
                itemChanged = true;
              }
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              log.push(
                `Warning: Failed to map ${field} via setBoundVariable for ${prop}: ${msg}`,
              );
            }
          }
        }
        if (itemChanged) changed = true;
        return itemChanged ? newItem : item;
      });

      if (changed) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node as any)[prop] = newArray;
        log.push(`Remapped ${prop} on "${node.name}" to "${newVariable.name}"`);
      }
    } else if (
      value &&
      typeof value === "object" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value as any).type === "VARIABLE_ALIAS" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value as any).id === oldVariableId
    ) {
      // Direct property like width, characters
      node.setBoundVariable(prop as VariableBindableNodeField, newVariable);
      log.push(`Remapped ${prop} on "${node.name}" to "${newVariable.name}"`);
    }
  }

  return log;
}

/**
 * Recursively find all nodes in the page that reference a given variable ID.
 */
function findNodesWithVariable(
  node: SceneNode,
  targetVariableId: string,
): SceneNode[] {
  const result: SceneNode[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boundVars = (node as any).boundVariables;
  if (boundVars && typeof boundVars === "object") {
    for (const value of Object.values(boundVars)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (
            item &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item as any).type === "VARIABLE_ALIAS" &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item as any).id === targetVariableId
          ) {
            result.push(node);
            break;
          }
        }
      } else if (
        value &&
        typeof value === "object" &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (value as any).type === "VARIABLE_ALIAS" &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (value as any).id === targetVariableId
      ) {
        result.push(node);
        break;
      }
    }
  }

  if ("children" in node) {
    for (const child of (node as ChildrenMixin).children) {
      result.push(
        ...findNodesWithVariable(child as SceneNode, targetVariableId),
      );
    }
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Service entry point                                               */
/* ------------------------------------------------------------------ */

export async function applyPageThemeVariables(
  data: ApplyPageThemeVariablesData,
): Promise<ResponseMessage> {
  try {
    const {
      clashActions = [],
      unmatchedActions = [],
      textStyleActions = [],
      effectStyleActions = [],
    } = data;
    const operationLog: string[] = [];
    let deletedCount = 0;
    let ignoredCount = 0;
    let renamedCount = 0;
    let stylesMappedCount = 0;

    const page = figma.currentPage;
    console.log(
      `[applyPageThemeVariables] Processing ${clashActions.length} clash actions, ${unmatchedActions.length} unmatched actions, ${textStyleActions.length} text styles, ${effectStyleActions.length} effect styles on page "${page.name}"`,
    );

    // --- Process Style Actions ---
    // Remote styles bound to nodes often contain trailing commas. We normalize these to guarantee dictionary collision.
    const normalizeStyleId = (id: string) => id.replace(/,$/, "");

    const textStyleMap = new Map<string, string>();
    for (const action of textStyleActions) {
      if (action.action === "map" && action.mappedStyleId) {
        textStyleMap.set(
          normalizeStyleId(action.styleId),
          action.mappedStyleId,
        );
      }
    }
    const effectStyleMap = new Map<string, string>();
    for (const action of effectStyleActions) {
      if (action.action === "map" && action.mappedStyleId) {
        effectStyleMap.set(
          normalizeStyleId(action.styleId),
          action.mappedStyleId,
        );
      }
    }

    if (textStyleMap.size > 0 || effectStyleMap.size > 0) {
      const applyStyleMappings = async (node: SceneNode) => {
        if (
          "textStyleId" in node &&
          typeof node.textStyleId === "string" &&
          node.textStyleId
        ) {
          const mapped = textStyleMap.get(normalizeStyleId(node.textStyleId));
          if (mapped) {
            // Figma strictly requires fonts to be loaded before mutating text properties
            if (node.fontName !== figma.mixed) {
              await figma.loadFontAsync(node.fontName);
            }

            // Load the target style's font as well
            const targetStyle = (await figma.getStyleByIdAsync(
              mapped,
            )) as TextStyle;
            if (targetStyle && targetStyle.fontName) {
              await figma.loadFontAsync(targetStyle.fontName);
            }

            await node.setTextStyleIdAsync(mapped);
            stylesMappedCount++;
          }
        }
        if (
          "effectStyleId" in node &&
          typeof node.effectStyleId === "string" &&
          node.effectStyleId
        ) {
          const mapped = effectStyleMap.get(
            normalizeStyleId(node.effectStyleId),
          );
          if (mapped) {
            await node.setEffectStyleIdAsync(mapped);
            stylesMappedCount++;
          }
        }
        if ("children" in node) {
          for (const child of (node as ChildrenMixin).children) {
            await applyStyleMappings(child as SceneNode);
          }
        }
      };

      for (const child of page.children) {
        await applyStyleMappings(child as SceneNode);
      }
      operationLog.push(`✓ Mapped ${stylesMappedCount} style instances`);
    }

    // --- Process clash actions ---
    for (const clash of clashActions) {
      if (clash.action === "delete") {
        const variable = await figma.variables.getVariableByIdAsync(
          clash.oldVariableId,
        );
        if (!variable) {
          operationLog.push(
            `⚠ Old variable ${clash.oldVariableId.substring(0, 8)}... not found, skipping`,
          );
          continue;
        }

        const varName = variable.name;

        // Find all nodes on current page referencing this variable and unbind
        for (const child of page.children) {
          const nodes = findNodesWithVariable(
            child as SceneNode,
            clash.oldVariableId,
          );
          for (const node of nodes) {
            const unbindLog = unbindVariableFromNode(node, clash.oldVariableId);
            operationLog.push(...unbindLog);
          }
        }

        // Delete the variable
        variable.remove();
        operationLog.push(`✓ Deleted old variable: "${varName}"`);
        deletedCount++;
      }
    }

    // --- Process unmatched actions ---
    for (const unmatched of unmatchedActions) {
      if (unmatched.action === "ignore") {
        const variable = await figma.variables.getVariableByIdAsync(
          unmatched.variableId,
        );
        const name = variable?.name ?? unmatched.variableId.substring(0, 8);
        operationLog.push(`— Ignored unmatched variable: "${name}"`);
        ignoredCount++;
      } else if (unmatched.action === "fix" && unmatched.newVariablePath) {
        const oldVariable = await figma.variables.getVariableByIdAsync(
          unmatched.variableId,
        );
        const oldName =
          oldVariable?.name ?? unmatched.variableId.substring(0, 8);

        let targetVar: Variable | null = null;
        const targetCollectionNames = new Set([
          "tokens",
          "themes",
          "layer",
          "token",
          "theme",
        ]);
        const collections =
          await figma.variables.getLocalVariableCollectionsAsync();

        for (const c of collections) {
          if (!targetCollectionNames.has(c.name.trim().toLowerCase())) continue;

          for (const vid of c.variableIds) {
            const v = await figma.variables.getVariableByIdAsync(vid);
            if (!v) continue;

            const collPrefix =
              c.name.toLowerCase() === "tokens"
                ? "Tokens"
                : c.name.toLowerCase() === "themes" ||
                    c.name.toLowerCase() === "theme"
                  ? "Theme"
                  : "Layer";
            const cleanName = v.name.replace(/_NEW$/, "");
            const fullPath = `${collPrefix}/${cleanName}`;

            if (fullPath === unmatched.newVariablePath) {
              targetVar = v;
              // Prefer the _NEW variant if it exists, since it's the exact incoming theme
              if (v.name.endsWith("_NEW")) break;
            }
          }
        }

        if (!targetVar) {
          operationLog.push(
            `⚠ Failed to find target variable for path: ${unmatched.newVariablePath}`,
          );
          continue;
        }

        let remappedCount = 0;
        for (const child of page.children) {
          const nodes = findNodesWithVariable(
            child as SceneNode,
            unmatched.variableId,
          );
          for (const node of nodes) {
            const rebindLog = rebindVariableOnNode(
              node,
              unmatched.variableId,
              targetVar,
            );
            if (rebindLog.length > 0) remappedCount++;
            operationLog.push(...rebindLog);
          }
        }

        operationLog.push(
          `✓ Fixed unmatched variable "${oldName}" by mapping ${remappedCount} nodes to "${targetVar.name}"`,
        );
      }
    }

    // --- Rename _NEW variables to remove suffix ---
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();

    for (const collection of collections) {
      const normName = collection.name.trim().toLowerCase();
      if (!THEME_COLLECTION_NAMES.has(normName)) continue;

      for (const varId of collection.variableIds) {
        const variable = await figma.variables.getVariableByIdAsync(varId);
        if (!variable) continue;

        if (variable.name.endsWith("_NEW")) {
          const newName = variable.name.slice(0, -4);
          const oldName = variable.name;
          variable.name = newName;
          operationLog.push(`✓ Renamed "${oldName}" → "${newName}"`);
          renamedCount++;
        }
      }
    }

    const summary = `Apply complete. Deleted: ${deletedCount}, Ignored: ${ignoredCount}, Renamed: ${renamedCount}, Styles Mapped: ${stylesMappedCount}`;
    console.log(`[applyPageThemeVariables] ${summary}`);

    return retSuccess("applyPageThemeVariables", {
      operationLog,
      deletedCount,
      ignoredCount,
      renamedCount,
      stylesMappedCount,
      summary,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  } catch (error) {
    console.error("[applyPageThemeVariables] Error:", error);
    return retError(
      "applyPageThemeVariables",
      error instanceof Error ? error : String(error),
    );
  }
}
