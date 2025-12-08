/* eslint-disable @typescript-eslint/no-explicit-any */
import { InstanceTable } from "./parsers/instanceTable";
import { debugConsole } from "./debugConsole";
import {
  importPage,
  resolveDeferredNormalInstances,
  loadAndExpandJson,
} from "./pageImportNew";
import type { ResponseMessage } from "../types/messages";
import {
  getFixedGuidForCollection,
  isStandardCollection,
} from "../../const/CollectionConstants";
import type { VariableCollection } from "@figma/plugin-typings";

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
        await debugConsole.warning(
          `Skipping ${fileName} - failed to expand JSON: ${jsonResult.error || "Unknown error"}`,
        );
        continue;
      }
      const expanded = jsonResult.expandedJsonData;

      // Extract metadata
      const metadata = expanded.metadata;
      if (!metadata || !metadata.name || !metadata.guid) {
        await debugConsole.warning(
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

      await debugConsole.log(
        `  ${fileName}: "${metadata.name}" depends on: ${dependencies.length > 0 ? dependencies.join(", ") : "none"}`,
      );
    } catch (error) {
      await debugConsole.error(
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
  await debugConsole.log("=== Building Dependency Graph ===");
  const pages = await buildDependencyGraph(jsonFiles);

  await debugConsole.log("=== Resolving Import Order ===");
  const result = resolveImportOrder(pages);

  if (result.cycles.length > 0) {
    await debugConsole.log(
      `Detected ${result.cycles.length} circular dependency cycle(s):`,
    );
    for (const cycle of result.cycles) {
      const cycleNames = cycle.map((p) => `"${p.pageName}"`).join(" → ");
      await debugConsole.log(`  Cycle: ${cycleNames} → (back to start)`);
    }
    await debugConsole.log(
      "  Circular dependencies will be handled with deferred instance resolution",
    );
  }

  if (result.errors.length > 0) {
    await debugConsole.warning(
      `Found ${result.errors.length} missing dependency warning(s):`,
    );
    for (const error of result.errors) {
      await debugConsole.warning(`  ${error}`);
    }
  }

  await debugConsole.log(
    `Import order determined: ${result.order.length} page(s)`,
  );
  for (let i = 0; i < result.order.length; i++) {
    const page = result.order[i];
    await debugConsole.log(`  ${i + 1}. ${page.fileName} ("${page.pageName}")`);
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

  await debugConsole.log("=== Determining Import Order ===");
  const {
    order,
    cycles,
    errors: depErrors,
  } = await determineImportOrder(jsonFiles);

  if (depErrors.length > 0) {
    await debugConsole.warning(
      `Found ${depErrors.length} dependency warning(s) - some dependencies may be missing`,
    );
  }

  if (cycles.length > 0) {
    await debugConsole.log(
      `Detected ${cycles.length} circular dependency cycle(s) - will use deferred resolution`,
    );
  }

  // Pre-create collections if "new" is selected for any collection type
  const preCreatedCollections = new Map<string, VariableCollection>();
  await debugConsole.log(
    `Checking collectionChoices: ${data.collectionChoices ? "exists" : "undefined"}`,
  );
  if (data.collectionChoices) {
    await debugConsole.log("=== Pre-creating Collections ===");
    await debugConsole.log(
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
        await debugConsole.log(
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
            await debugConsole.log(
              `  Stored fixed GUID: ${fixedGuid.substring(0, 8)}...`,
            );
          }
        }

        preCreatedCollections.set(normalizedName, newCollection);
        await debugConsole.log(
          `✓ Pre-created collection: "${uniqueName}" (normalized: "${normalizedName}", id: ${newCollection.id.substring(0, 8)}...)`,
        );
      } else {
        await debugConsole.log(
          `Skipping collection type: "${normalizedName}" (choice: "existing")`,
        );
      }
    }

    if (preCreatedCollections.size > 0) {
      await debugConsole.log(
        `Pre-created ${preCreatedCollections.size} collection(s) for reuse across all imports`,
      );
    }
  }

  // Import pages in dependency order
  await debugConsole.log("=== Importing Pages in Order ===");
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

  // Add pre-created collections to the created entities list
  if (preCreatedCollections.size > 0) {
    for (const collection of preCreatedCollections.values()) {
      allCreatedEntityIds.collectionIds.push(collection.id);
      await debugConsole.log(
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
    await debugConsole.log(
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
            allDeferredInstances.push(...deferred);
          }
        }
        // Collect created entity IDs
        if (result.data?.createdEntities) {
          const entities = result.data.createdEntities as {
            pageIds?: string[];
            collectionIds?: string[];
            variableIds?: string[];
          };
          if (entities.pageIds) {
            allCreatedEntityIds.pageIds.push(...entities.pageIds);
          }
          if (entities.collectionIds) {
            allCreatedEntityIds.collectionIds.push(...entities.collectionIds);
          }
          if (entities.variableIds) {
            allCreatedEntityIds.variableIds.push(...entities.variableIds);
          }
          // Track imported page
          // Check both createdEntities.pageIds (for new pages) and pageId (for reused existing pages)
          const pageId =
            entities.pageIds?.[0] || (result.data?.pageId as string);
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
  if (allDeferredInstances.length > 0) {
    await debugConsole.log(
      `=== Resolving ${allDeferredInstances.length} Deferred Instance(s) ===`,
    );
    try {
      const resolveResult =
        await resolveDeferredNormalInstances(allDeferredInstances);
      await debugConsole.log(
        `  Resolved: ${resolveResult.resolved}, Failed: ${resolveResult.failed}`,
      );
      if (resolveResult.errors.length > 0) {
        allErrors.push(...resolveResult.errors);
      }
    } catch (error) {
      allErrors.push(
        `Failed to resolve deferred instances: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  // Deduplicate collection IDs (in case pre-created collections were also added by individual imports)
  const uniqueCollectionIds = Array.from(
    new Set(allCreatedEntityIds.collectionIds),
  );
  const uniqueVariableIds = Array.from(
    new Set(allCreatedEntityIds.variableIds),
  );
  const uniquePageIds = Array.from(new Set(allCreatedEntityIds.pageIds));

  await debugConsole.log("=== Import Summary ===");
  await debugConsole.log(
    `  Imported: ${imported}, Failed: ${failed}, Deferred instances: ${allDeferredInstances.length}`,
  );
  await debugConsole.log(
    `  Collections in allCreatedEntityIds: ${allCreatedEntityIds.collectionIds.length}, Unique: ${uniqueCollectionIds.length}`,
  );
  if (uniqueCollectionIds.length > 0) {
    await debugConsole.log(
      `  Created ${uniqueCollectionIds.length} collection(s)`,
    );
    for (const collectionId of uniqueCollectionIds) {
      try {
        const collection =
          await figma.variables.getVariableCollectionByIdAsync(collectionId);
        if (collection) {
          await debugConsole.log(
            `    - "${collection.name}" (${collectionId.substring(0, 8)}...)`,
          );
        }
      } catch {
        // Collection might not exist, skip
      }
    }
  }

  const success = failed === 0;
  const message = success
    ? `Successfully imported ${imported} page(s)${allDeferredInstances.length > 0 ? ` (${allDeferredInstances.length} deferred instance(s) resolved)` : ""}`
    : `Import completed with ${failed} failure(s). ${allErrors.join("; ")}`;

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
      createdEntities: {
        pageIds: uniquePageIds,
        collectionIds: uniqueCollectionIds,
        variableIds: uniqueVariableIds,
      },
    },
  };
}
