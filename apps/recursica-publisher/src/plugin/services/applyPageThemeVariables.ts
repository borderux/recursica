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
  action: "ignore"; // "fix" reserved for future
}

export interface ApplyPageThemeVariablesData {
  clashActions: ClashAction[];
  unmatchedActions: UnmatchedAction[];
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
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentValue = (node as any)[prop];
            if (currentValue !== undefined) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (node as any)[prop] = currentValue;
            }
            log.push(
              `Unbound ${prop} from "${node.name}" (${node.id.substring(0, 8)}...)`,
            );
          } catch (e) {
            log.push(
              `Failed to unbind ${prop} from "${node.name}": ${e instanceof Error ? e.message : String(e)}`,
            );
          }
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
      try {
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
      } catch (e) {
        log.push(
          `Failed to unbind ${prop} from "${node.name}": ${e instanceof Error ? e.message : String(e)}`,
        );
      }
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
    const { clashActions = [], unmatchedActions = [] } = data;
    const operationLog: string[] = [];
    let deletedCount = 0;
    let ignoredCount = 0;
    let renamedCount = 0;

    const page = figma.currentPage;
    console.log(
      `[applyPageThemeVariables] Processing ${clashActions.length} clash actions, ${unmatchedActions.length} unmatched actions on page "${page.name}"`,
    );

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
        try {
          variable.remove();
          operationLog.push(`✓ Deleted old variable: "${varName}"`);
          deletedCount++;
        } catch (e) {
          operationLog.push(
            `✗ Failed to delete "${varName}": ${e instanceof Error ? e.message : String(e)}`,
          );
        }
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
          try {
            variable.name = newName;
            operationLog.push(`✓ Renamed "${oldName}" → "${newName}"`);
            renamedCount++;
          } catch (e) {
            operationLog.push(
              `✗ Failed to rename "${oldName}": ${e instanceof Error ? e.message : String(e)}`,
            );
          }
        }
      }
    }

    const summary = `Apply complete. Deleted: ${deletedCount}, Ignored: ${ignoredCount}, Renamed: ${renamedCount}`;
    console.log(`[applyPageThemeVariables] ${summary}`);

    return retSuccess("applyPageThemeVariables", {
      operationLog,
      deletedCount,
      ignoredCount,
      renamedCount,
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
