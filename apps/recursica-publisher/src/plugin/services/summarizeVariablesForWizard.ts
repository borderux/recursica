/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import { debugConsole } from "./debugConsole";
import { loadAndExpandJson } from "./pageImportNew";
import { CollectionTable, VariableTable } from "./parsers/variableTable";
import { normalizeCollectionName } from "../../const/CollectionConstants";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SummarizeVariablesForWizardData {
  jsonFiles: Array<{
    fileName: string;
    jsonData: any;
  }>;
  tokensCollection: "new" | "existing";
  themeCollection: "new" | "existing";
  layersCollection: "new" | "existing";
}

export interface SummarizeVariablesForWizardResponseData {
  tokens: {
    existing: number;
    new: number;
  };
  theme: {
    existing: number;
    new: number;
  };
  layers: {
    existing: number;
    new: number;
  };
}

/**
 * Summarizes variables from import files and compares with existing collections
 */
export async function summarizeVariablesForWizard(
  data: SummarizeVariablesForWizardData,
): Promise<ResponseMessage> {
  try {
    await debugConsole.log("=== Summarizing Variables for Wizard ===");

    // Step 1: Extract all variables from all JSON files
    const allVariables: Array<{
      name: string;
      collectionName: string;
    }> = [];

    for (const { fileName, jsonData } of data.jsonFiles) {
      try {
        // Expand JSON to get readable keys
        const jsonResult = loadAndExpandJson(jsonData);
        if (!jsonResult.success || !jsonResult.expandedJsonData) {
          await debugConsole.warning(
            `Skipping ${fileName} - failed to expand JSON: ${jsonResult.error || "Unknown error"}`,
          );
          continue;
        }

        const expanded = jsonResult.expandedJsonData;

        // Load collection table
        if (!expanded.collections) {
          continue;
        }

        const collectionTableResult = CollectionTable.fromTable(
          expanded.collections,
        );
        const collectionTable = collectionTableResult;

        // Load variable table
        if (!expanded.variables) {
          continue;
        }

        const variableTable = VariableTable.fromTable(expanded.variables);

        // Extract variables with their collection names
        const variables = variableTable.getTable();
        for (const entry of Object.values(variables)) {
          if (entry._colRef === undefined) {
            continue;
          }

          const collectionEntry = collectionTable.getCollectionByIndex(
            entry._colRef,
          );
          if (collectionEntry) {
            const normalizedCollectionName = normalizeCollectionName(
              collectionEntry.collectionName,
            );
            // Only track Tokens, Theme, and Layers collections
            // normalizeCollectionName returns "Layer", "Tokens", or "Theme"
            const lowerName = normalizedCollectionName.toLowerCase();
            if (
              lowerName === "tokens" ||
              lowerName === "theme" ||
              lowerName === "layer"
            ) {
              allVariables.push({
                name: entry.variableName,
                collectionName: lowerName, // Use lowercase for consistency ("layer" not "layers")
              });
            }
          }
        }
      } catch (error) {
        await debugConsole.warning(
          `Error processing ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
        );
        continue;
      }
    }

    // Step 2: Get existing collections
    const localCollections =
      await figma.variables.getLocalVariableCollectionsAsync();

    // Find Tokens, Theme, and Layers collections
    let tokensCollection: VariableCollection | null = null;
    let themeCollection: VariableCollection | null = null;
    let layersCollection: VariableCollection | null = null;

    for (const collection of localCollections) {
      const normalizedName = normalizeCollectionName(collection.name);
      const lowerName = normalizedName.toLowerCase();
      if (
        (lowerName === "tokens" || lowerName === "token") &&
        !tokensCollection
      ) {
        tokensCollection = collection;
      } else if (
        (lowerName === "theme" || lowerName === "themes") &&
        !themeCollection
      ) {
        themeCollection = collection;
      } else if (
        (lowerName === "layer" || lowerName === "layers") &&
        !layersCollection
      ) {
        layersCollection = collection;
      }
    }

    // Step 3: Count variables for each collection
    const tokensVars = allVariables.filter(
      (v) => v.collectionName === "tokens",
    );
    const themeVars = allVariables.filter((v) => v.collectionName === "theme");
    const layersVars = allVariables.filter((v) => v.collectionName === "layer");

    const tokensSummary = {
      existing: 0,
      new: 0,
    };
    const themeSummary = {
      existing: 0,
      new: 0,
    };
    const layersSummary = {
      existing: 0,
      new: 0,
    };

    // Count Tokens variables
    if (data.tokensCollection === "existing" && tokensCollection) {
      // Get existing variable names in the collection
      const existingVarNames = new Set<string>();
      for (const varId of tokensCollection.variableIds) {
        try {
          const variable = figma.variables.getVariableById(varId);
          if (variable) {
            existingVarNames.add(variable.name);
          }
        } catch {
          // Variable might not exist, continue
          continue;
        }
      }

      // Count existing vs new
      for (const varInfo of tokensVars) {
        if (existingVarNames.has(varInfo.name)) {
          tokensSummary.existing++;
        } else {
          tokensSummary.new++;
        }
      }
    } else {
      // All are new if creating new collection
      tokensSummary.new = tokensVars.length;
    }

    // Count Theme variables
    if (data.themeCollection === "existing" && themeCollection) {
      // Get existing variable names in the collection
      const existingVarNames = new Set<string>();
      for (const varId of themeCollection.variableIds) {
        try {
          const variable = figma.variables.getVariableById(varId);
          if (variable) {
            existingVarNames.add(variable.name);
          }
        } catch {
          // Variable might not exist, continue
          continue;
        }
      }

      // Count existing vs new
      for (const varInfo of themeVars) {
        if (existingVarNames.has(varInfo.name)) {
          themeSummary.existing++;
        } else {
          themeSummary.new++;
        }
      }
    } else {
      // All are new if creating new collection
      themeSummary.new = themeVars.length;
    }

    // Count Layers variables
    if (data.layersCollection === "existing" && layersCollection) {
      // Get existing variable names in the collection
      const existingVarNames = new Set<string>();
      for (const varId of layersCollection.variableIds) {
        try {
          const variable = figma.variables.getVariableById(varId);
          if (variable) {
            existingVarNames.add(variable.name);
          }
        } catch {
          // Variable might not exist, continue
          continue;
        }
      }

      // Count existing vs new
      for (const varInfo of layersVars) {
        if (existingVarNames.has(varInfo.name)) {
          layersSummary.existing++;
        } else {
          layersSummary.new++;
        }
      }
    } else {
      // All are new if creating new collection
      layersSummary.new = layersVars.length;
    }

    await debugConsole.log(
      `Variable summary: Tokens - ${tokensSummary.existing} existing, ${tokensSummary.new} new; Theme - ${themeSummary.existing} existing, ${themeSummary.new} new; Layers - ${layersSummary.existing} existing, ${layersSummary.new} new`,
    );

    const responseData: SummarizeVariablesForWizardResponseData = {
      tokens: tokensSummary,
      theme: themeSummary,
      layers: layersSummary,
    };

    return retSuccess("summarizeVariablesForWizard", responseData as any);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(`Summarize failed: ${errorMessage}`);
    return retError(
      "summarizeVariablesForWizard",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}
