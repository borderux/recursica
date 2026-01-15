/* eslint-disable @typescript-eslint/no-explicit-any */
import { InstanceTable } from "./parsers/instanceTable";
import { debugConsole } from "./debugConsole";
import {
  importPage,
  resolveDeferredNormalInstances,
  loadAndExpandJson,
  type PageImportResult,
  sanitizeImportResult,
} from "./pageImportNew";
import type { ResponseMessage } from "../types/messages";
import {
  getFixedGuidForCollection,
  isStandardCollection,
  normalizeCollectionName,
} from "../../const/CollectionConstants";
// VariableCollection type from Figma API
type VariableCollection = ReturnType<
  typeof figma.variables.createVariableCollection
>;

/**
 * Represents a page and its dependencies
 */
export interface PageDependency {
  fileName: string; // The JSON file name (e.g., "Logo.rec.json")
  pageName: string; // The page name from metadata
  pageGuid: string; // The page GUID from metadata
  dependencies: string[]; // Array of page names this page depends on (via normal instances)
  jsonData: any; // The full JSON data (for later import)
}

/**
 * Builds a dependency graph from multiple JSON files
 * Returns an array of PageDependency objects with their dependencies extracted
 */
export async function buildDependencyGraph(
  jsonFiles: Array<{ fileName: string; jsonData: any }>,
): Promise<PageDependency[]> {
  const pages: PageDependency[] = [];

  for (const { fileName, jsonData } of jsonFiles) {
    try {
      // Expand the JSON data to get readable keys
      const jsonResult = loadAndExpandJson(jsonData);
      if (!jsonResult.success || !jsonResult.expandedJsonData) {
        debugConsole.warning(
          `Skipping ${fileName} - failed to expand JSON: ${jsonResult.error || "Unknown error"}`,
        );
        continue;
      }
      const expanded = jsonResult.expandedJsonData;

      // Extract metadata
      const metadata = expanded.metadata;
      if (!metadata || !metadata.name || !metadata.guid) {
        debugConsole.warning(
          `Skipping ${fileName} - missing or invalid metadata`,
        );
        continue;
      }

      // Extract dependencies from instance table
      const dependencies: string[] = [];
      if (expanded.instances) {
        const instanceTable = InstanceTable.fromTable(
          expanded.instances as Record<string, any>,
        );
        const allInstances = instanceTable.getSerializedTable();

        for (const entry of Object.values(allInstances)) {
          if (entry.instanceType === "normal" && entry.componentPageName) {
            // This page depends on another page
            if (!dependencies.includes(entry.componentPageName)) {
              dependencies.push(entry.componentPageName);
            }
          }
        }
      }

      pages.push({
        fileName,
        pageName: metadata.name,
        pageGuid: metadata.guid,
        dependencies,
        jsonData, // Store original JSON data for import
      });

      debugConsole.log(
        `  ${fileName}: "${metadata.name}" depends on: ${dependencies.length > 0 ? dependencies.join(", ") : "none"}`,
      );
    } catch (error) {
      debugConsole.error(
        `Error processing ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return pages;
}

/**
 * Performs topological sort to determine import order
 * Handles circular dependencies by detecting cycles
 * Returns the sorted order and any detected cycles
 */
export function resolveImportOrder(pages: PageDependency[]): {
  order: PageDependency[];
  cycles: PageDependency[][];
  errors: string[];
} {
  const order: PageDependency[] = [];
  const cycles: PageDependency[][] = [];
  const errors: string[] = [];

  // Create a map of page name -> PageDependency for quick lookup
  const pageMap = new Map<string, PageDependency>();
  for (const page of pages) {
    pageMap.set(page.pageName, page);
  }

  // Track visited and visiting states for cycle detection
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const cyclePath: PageDependency[] = [];

  /**
   * DFS to visit a page and its dependencies
   * Returns true if a cycle was detected
   */
  const visit = (page: PageDependency): boolean => {
    if (visited.has(page.pageName)) {
      return false; // Already processed
    }

    if (visiting.has(page.pageName)) {
      // Cycle detected!
      const cycleStart = cyclePath.findIndex(
        (p) => p.pageName === page.pageName,
      );
      if (cycleStart !== -1) {
        const cycle = cyclePath.slice(cycleStart).concat([page]);
        cycles.push(cycle);
        return true;
      }
      return false;
    }

    visiting.add(page.pageName);
    cyclePath.push(page);

    // Visit all dependencies first
    for (const depName of page.dependencies) {
      const depPage = pageMap.get(depName);
      if (!depPage) {
        // Dependency not found in provided pages - this is okay, might be external
        continue;
      }
      visit(depPage);
    }

    visiting.delete(page.pageName);
    cyclePath.pop();
    visited.add(page.pageName);
    order.push(page);

    return false;
  };

  // Visit all pages
  for (const page of pages) {
    if (!visited.has(page.pageName)) {
      visit(page);
    }
  }

  // Validate that all dependencies exist (warn about missing ones)
  for (const page of pages) {
    for (const depName of page.dependencies) {
      if (!pageMap.has(depName)) {
        errors.push(
          `Page "${page.pageName}" (${page.fileName}) depends on "${depName}" which is not in the import set`,
        );
      }
    }
  }

  return { order, cycles, errors };
}

/**
 * Main function to determine import order from multiple JSON files
 * Returns the ordered list of pages to import, with cycles detected
 */
export async function determineImportOrder(
  jsonFiles: Array<{ fileName: string; jsonData: any }>,
): Promise<{
  order: PageDependency[];
  cycles: PageDependency[][];
  errors: string[];
}> {
  debugConsole.log("=== Building Dependency Graph ===");
  const pages = await buildDependencyGraph(jsonFiles);

  debugConsole.log("=== Resolving Import Order ===");
  const result = resolveImportOrder(pages);

  if (result.cycles.length > 0) {
    debugConsole.log(
      `Detected ${result.cycles.length} circular dependency cycle(s):`,
    );
    for (const cycle of result.cycles) {
      const cycleNames = cycle.map((p) => `"${p.pageName}"`).join(" → ");
      debugConsole.log(`  Cycle: ${cycleNames} → (back to start)`);
    }
    debugConsole.log(
      "  Circular dependencies will be handled with deferred instance resolution",
    );
  }

  if (result.errors.length > 0) {
    debugConsole.warning(
      `Found ${result.errors.length} missing dependency warning(s):`,
    );
    for (const error of result.errors) {
      debugConsole.warning(`  ${error}`);
    }
  }

  debugConsole.log(`Import order determined: ${result.order.length} page(s)`);
  for (let i = 0; i < result.order.length; i++) {
    const page = result.order[i];
    debugConsole.log(`  ${i + 1}. ${page.fileName} ("${page.pageName}")`);
  }

  return result;
}

/**
 * Data structure for importPagesInOrder request
 */
export interface ImportPagesInOrderData {
  jsonFiles: Array<{ fileName: string; jsonData: any }>;
  mainFileName?: string; // Optional: name of the main file (always creates copy, no prompt)
  collectionChoices?: {
    tokens: "new" | "existing";
    theme: "new" | "existing";
    layers: "new" | "existing";
  }; // Wizard selections for collection matching (if provided, skips prompts)
  skipUniqueNaming?: boolean; // If true, skip adding _<number> suffix to page names. Used for wizard imports.
  constructionIcon?: string; // If provided, prepend this icon to page name. Used for wizard imports.
}

/**
 * Orchestrates importing multiple pages in the correct dependency order
 * Handles circular dependencies with deferred resolution
 * Returns ResponseMessage with import summary
 */
export async function importPagesInOrder(
  data: ImportPagesInOrderData,
): Promise<ResponseMessage> {
  const { jsonFiles } = data;

  if (!jsonFiles || !Array.isArray(jsonFiles)) {
    return {
      type: "importPagesInOrder",
      success: false,
      error: true,
      message: "jsonFiles must be an array",
      data: {},
    };
  }

  debugConsole.log("=== Determining Import Order ===");
  const {
    order,
    cycles,
    errors: depErrors,
  } = await determineImportOrder(jsonFiles);

  if (depErrors.length > 0) {
    debugConsole.warning(
      `Found ${depErrors.length} dependency warning(s) - some dependencies may be missing`,
    );
  }

  if (cycles.length > 0) {
    debugConsole.log(
      `Detected ${cycles.length} circular dependency cycle(s) - will use deferred resolution`,
    );
  }

  // Pre-create collections if "new" is selected for any collection type
  const preCreatedCollections = new Map<string, VariableCollection>();
  debugConsole.log(
    `Checking collectionChoices: ${data.collectionChoices ? "exists" : "undefined"}`,
  );
  if (data.collectionChoices) {
    debugConsole.log("=== Pre-creating Collections ===");
    debugConsole.log(
      `Collection choices: tokens=${data.collectionChoices.tokens}, theme=${data.collectionChoices.theme}, layers=${data.collectionChoices.layers}`,
    );

    const COLLECTION_GUID_KEY = "recursica:collectionId";

    // Helper to find unique collection name
    const findUniqueCollectionName = async (
      baseName: string,
    ): Promise<string> => {
      const localCollections =
        await figma.variables.getLocalVariableCollectionsAsync();
      const existingNames = new Set(localCollections.map((c) => c.name));

      if (!existingNames.has(baseName)) {
        return baseName;
      }

      let counter = 1;
      let candidateName = `${baseName}_${counter}`;
      while (existingNames.has(candidateName)) {
        counter++;
        candidateName = `${baseName}_${counter}`;
      }

      return candidateName;
    };

    // Create collections for each type that needs "new"
    const collectionTypes = [
      { choice: data.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: data.collectionChoices.theme, normalizedName: "Theme" },
      { choice: data.collectionChoices.layers, normalizedName: "Layer" },
    ];

    for (const { choice, normalizedName } of collectionTypes) {
      if (choice === "new") {
        debugConsole.log(
          `Processing collection type: "${normalizedName}" (choice: "new") - will create new collection`,
        );

        // When "new" is selected, always create a new collection
        // Use findUniqueCollectionName to ensure uniqueness
        const uniqueName = await findUniqueCollectionName(normalizedName);
        const newCollection =
          figma.variables.createVariableCollection(uniqueName);

        // Store fixed GUID if it's a standard collection
        if (isStandardCollection(normalizedName)) {
          const fixedGuid = getFixedGuidForCollection(normalizedName);
          if (fixedGuid) {
            newCollection.setSharedPluginData(
              "recursica",
              COLLECTION_GUID_KEY,
              fixedGuid,
            );
            debugConsole.log(
              `  Stored fixed GUID: ${fixedGuid.substring(0, 8)}...`,
            );
          }
        }

        preCreatedCollections.set(normalizedName, newCollection);
        debugConsole.log(
          `✓ Pre-created collection: "${uniqueName}" (normalized: "${normalizedName}", id: ${newCollection.id.substring(0, 8)}...)`,
        );
      } else {
        debugConsole.log(
          `Skipping collection type: "${normalizedName}" (choice: "existing")`,
        );
      }
    }

    if (preCreatedCollections.size > 0) {
      debugConsole.log(
        `Pre-created ${preCreatedCollections.size} collection(s) for reuse across all imports`,
      );
    }
  }

  // Import pages in dependency order
  debugConsole.log("=== Importing Pages in Order ===");
  let imported = 0;
  let failed = 0;
  const allErrors: string[] = [...depErrors];
  const allDeferredInstances: any[] = [];
  const allCreatedEntityIds = {
    pageIds: [] as string[],
    collectionIds: [] as string[],
    variableIds: [] as string[],
  };
  const importedPages: Array<{ name: string; pageId: string }> = [];
  const allImportResults: PageImportResult[] = []; // Collect all importResult objects

  // Add pre-created collections to the created entities list
  if (preCreatedCollections.size > 0) {
    for (const collection of preCreatedCollections.values()) {
      allCreatedEntityIds.collectionIds.push(collection.id);
      debugConsole.log(
        `Tracking pre-created collection: "${collection.name}" (${collection.id.substring(0, 8)}...)`,
      );
    }
  }

  // Determine which page is the main page (last in order, or match by fileName if provided)
  const mainFileName = data.mainFileName;

  for (let i = 0; i < order.length; i++) {
    const page = order[i];
    // Determine if this is the main page
    const isMainPage = mainFileName
      ? page.fileName === mainFileName
      : i === order.length - 1; // Last page in order is main if no mainFileName specified
    debugConsole.log(
      `[${i + 1}/${order.length}] Importing ${page.fileName} ("${page.pageName}")${isMainPage ? " [MAIN]" : " [DEPENDENCY]"}...`,
    );

    try {
      // Only clear console for the first page import
      const clearConsole = i === 0;
      const result = await importPage({
        jsonData: page.jsonData,
        isMainPage,
        clearConsole,
        collectionChoices: data.collectionChoices,
        alwaysCreateCopy: true, // Wizard imports always create copies (no prompts)
        skipUniqueNaming: data.skipUniqueNaming ?? false,
        constructionIcon: data.constructionIcon || "",
        preCreatedCollections, // Pass pre-created collections for reuse
      });

      if (result.success) {
        imported++;
        // Collect deferred instances
        if (result.data?.deferredInstances) {
          const deferred = result.data.deferredInstances;
          if (Array.isArray(deferred)) {
            debugConsole.log(
              `  [DEBUG] Collected ${deferred.length} deferred instance(s) from ${page.fileName}`,
            );
            allDeferredInstances.push(...deferred);
          }
        } else {
          debugConsole.log(
            `  [DEBUG] No deferred instances in response for ${page.fileName}`,
          );
        }
        // Collect importResult from each page import
        if (result.data?.importResult) {
          const importResult = result.data.importResult as PageImportResult;
          allImportResults.push(importResult);

          // Also collect IDs for aggregation (used for backward compatibility in response)
          if (importResult.createdPageIds) {
            allCreatedEntityIds.pageIds.push(...importResult.createdPageIds);
          }
          if (importResult.createdCollectionIds) {
            allCreatedEntityIds.collectionIds.push(
              ...importResult.createdCollectionIds,
            );
          }
          if (importResult.createdVariableIds) {
            allCreatedEntityIds.variableIds.push(
              ...importResult.createdVariableIds,
            );
          }
          // Track imported page
          // Check both importResult.createdPageIds (for new pages) and pageId (for reused existing pages)
          const pageId =
            importResult.createdPageIds?.[0] || (result.data?.pageId as string);
          if (result.data?.pageName && pageId) {
            importedPages.push({
              name: result.data.pageName as string,
              pageId: pageId,
            });
          }
        }
      } else {
        failed++;
        allErrors.push(
          `Failed to import ${page.fileName}: ${result.message || "Unknown error"}`,
        );
      }
    } catch (error) {
      failed++;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      allErrors.push(`Failed to import ${page.fileName}: ${errorMessage}`);
    }
  }

  // Resolve all deferred instances after all pages are imported
  let deferredResolutionFailed = 0;
  if (allDeferredInstances.length > 0) {
    debugConsole.log(
      `=== Resolving ${allDeferredInstances.length} Deferred Instance(s) ===`,
    );
    try {
      // Build recognizedVariables map from all imported pages
      // We need this to apply child overrides with bound variables
      // Rebuild variable and collection tables from all JSON files
      debugConsole.log(
        `  Rebuilding variable and collection tables from imported JSON files...`,
      );

      // Import the necessary functions
      const {
        loadAndExpandJson,
        loadCollectionTable,
        loadVariableTable,
        matchAndCreateVariables,
      } = await import("./pageImportNew");

      // Collect all variable and collection tables from all imported JSON files
      const allVariableTables: any[] = [];
      const allCollectionTables: any[] = [];

      // Process all JSON files to build merged variable and collection tables
      for (const page of order) {
        try {
          const jsonResult = loadAndExpandJson(page.jsonData);
          if (jsonResult.success && jsonResult.expandedJsonData) {
            const expandedJsonData = jsonResult.expandedJsonData;

            // Load collection table
            const collectionTableResult = loadCollectionTable(expandedJsonData);
            if (
              collectionTableResult.success &&
              collectionTableResult.collectionTable
            ) {
              allCollectionTables.push(collectionTableResult.collectionTable);
            }

            // Load variable table
            const variableTableResult = loadVariableTable(expandedJsonData);
            if (
              variableTableResult.success &&
              variableTableResult.variableTable
            ) {
              allVariableTables.push(variableTableResult.variableTable);
            }
          }
        } catch (error) {
          debugConsole.warning(
            `  Could not load tables from ${page.fileName}: ${error}`,
          );
        }
      }

      // Merge all variable tables (use the first one as base, or create a merged one)
      // For now, we'll use the last variable table (should have all variables from all imports)
      // In practice, all imports should have the same variable table entries
      let mergedVariableTable: any = null;
      let mergedCollectionTable: any = null;

      if (allVariableTables.length > 0) {
        // Use the last variable table (should be the most complete)
        mergedVariableTable = allVariableTables[allVariableTables.length - 1];
        debugConsole.log(
          `  Using variable table with ${mergedVariableTable.getSize()} variable(s)`,
        );
      }

      if (allCollectionTables.length > 0) {
        // Use the last collection table
        mergedCollectionTable =
          allCollectionTables[allCollectionTables.length - 1];
        debugConsole.log(
          `  Using collection table with ${mergedCollectionTable.getSize()} collection(s)`,
        );
      }

      // Build recognizedCollections map keyed by collection table index
      // This is required because matchAndCreateVariables expects collections to be keyed by index
      const recognizedCollections = new Map<string, VariableCollection>();
      if (mergedCollectionTable) {
        // Get all local collections (they should already be created/matched from imports)
        const localCollections =
          await figma.variables.getLocalVariableCollectionsAsync();

        // Build a lookup map by normalized name for fast matching
        const collectionsByName = new Map<string, VariableCollection>();
        for (const collection of localCollections) {
          const normalizedName = normalizeCollectionName(collection.name);
          collectionsByName.set(normalizedName, collection);
        }

        // Iterate through collection table entries and match them to actual collections
        const collectionTableEntries = mergedCollectionTable.getTable();
        for (const [indexStr, entry] of Object.entries(
          collectionTableEntries,
        )) {
          const collectionEntry = entry as {
            collectionName: string;
            collectionId?: string;
            isLocal?: boolean;
            modes?: string[];
            collectionGuid?: string;
          };
          const normalizedName = normalizeCollectionName(
            collectionEntry.collectionName,
          );
          const collection = collectionsByName.get(normalizedName);

          if (collection) {
            // Store by collection table index (as string) for matchAndCreateVariables
            recognizedCollections.set(indexStr, collection);
            debugConsole.log(
              `  Matched collection table index ${indexStr} ("${collectionEntry.collectionName}") to collection "${collection.name}"`,
            );
          } else {
            debugConsole.warning(
              `  Could not find collection for table index ${indexStr} ("${collectionEntry.collectionName}")`,
            );
          }
        }
      }

      // Build recognizedVariables map using matchAndCreateVariables
      let recognizedVariables = new Map<string, Variable>();
      if (mergedVariableTable && mergedCollectionTable) {
        const { recognizedVariables: builtRecognizedVariables } =
          await matchAndCreateVariables(
            mergedVariableTable,
            mergedCollectionTable,
            recognizedCollections,
            [], // newlyCreatedCollections - empty since they're already created
          );
        recognizedVariables = builtRecognizedVariables;
        debugConsole.log(
          `  Built recognizedVariables map with ${recognizedVariables.size} variable(s)`,
        );
      } else {
        debugConsole.warning(
          `  Could not build recognizedVariables map - variable or collection table missing`,
        );
      }

      const resolveResult = await resolveDeferredNormalInstances(
        allDeferredInstances,
        data.constructionIcon || "",
        recognizedVariables,
        mergedVariableTable || null,
        mergedCollectionTable || null,
        recognizedCollections,
      );
      debugConsole.log(
        `  Resolved: ${resolveResult.resolved}, Failed: ${resolveResult.failed}`,
      );
      if (resolveResult.errors.length > 0) {
        allErrors.push(...resolveResult.errors);
        deferredResolutionFailed = resolveResult.failed;
      }
    } catch (error) {
      const errorMessage = `Failed to resolve deferred instances: ${error instanceof Error ? error.message : String(error)}`;
      allErrors.push(errorMessage);
      deferredResolutionFailed = allDeferredInstances.length; // Mark all as failed if resolution threw
    }
  }

  // Note: IDs are collected for logging/debugging purposes
  // They're stored in global importResult for cleanup operations

  // Get unique collection IDs for logging
  const uniqueCollectionIds = [...new Set(allCreatedEntityIds.collectionIds)];

  debugConsole.log("=== Import Summary ===");
  debugConsole.log(
    `  Imported: ${imported}, Failed: ${failed}, Deferred instances: ${allDeferredInstances.length}, Deferred resolution failed: ${deferredResolutionFailed}`,
  );
  debugConsole.log(
    `  Collections in allCreatedEntityIds: ${allCreatedEntityIds.collectionIds.length}, Unique: ${uniqueCollectionIds.length}`,
  );
  if (uniqueCollectionIds.length > 0) {
    debugConsole.log(`  Created ${uniqueCollectionIds.length} collection(s)`);
    for (const collectionId of uniqueCollectionIds) {
      try {
        const collection =
          await figma.variables.getVariableCollectionByIdAsync(collectionId);
        if (collection) {
          debugConsole.log(
            `    - "${collection.name}" (${collectionId.substring(0, 8)}...)`,
          );
        }
      } catch {
        // Collection might not exist, skip
      }
    }
  }

  // Import fails if page imports failed OR if deferred instance resolution failed
  const success = failed === 0 && deferredResolutionFailed === 0;
  const message = success
    ? `Successfully imported ${imported} page(s)${allDeferredInstances.length > 0 ? ` (${allDeferredInstances.length} deferred instance(s) resolved)` : ""}`
    : `Import completed with ${failed} failure(s). ${allErrors.join("; ")}`;

  // Store all importResult objects globally on figma.root
  // Since only one import can happen at a time, we can use a single global key
  // Sanitize importResults to remove logs and other large fields before storing
  const IMPORT_RESULT_KEY = "RecursicaImportResult";
  if (allImportResults.length > 0) {
    const sanitizedResults = allImportResults.map((ir) =>
      sanitizeImportResult(ir),
    );
    figma.root.setPluginData(
      IMPORT_RESULT_KEY,
      JSON.stringify(sanitizedResults),
    );
    debugConsole.log(
      `Stored ${sanitizedResults.length} sanitized importResult object(s) globally for cleanup/delete operations`,
    );
  }

  return {
    type: "importPagesInOrder",
    success,
    error: !success,
    message,
    data: {
      imported,
      failed,
      deferred: allDeferredInstances.length,
      errors: allErrors,
      importedPages,
    },
  };
}
