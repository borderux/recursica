/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../../types/messages";
import { retSuccess, retError } from "../../utils/response";
import { debugConsole } from "./debugConsole";
import { importPagesInOrder } from "./dependencyResolver";
import type { SanitizedPageImportResult } from "./pageImportNew";
import { normalizeCollectionName } from "../../../const/CollectionConstants";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const PRIMARY_IMPORT_KEY = "RecursicaPrimaryImport";
export const UNDER_REVIEW_KEY = "RecursicaUnderReview";
export const IMPORT_RESULT_KEY = "RecursicaImportResult"; // Global key for storing importResult on figma.root
export const IMPORT_START_DIVIDER = "---";
export const IMPORT_END_DIVIDER = "---";
export const DIVIDER_PLUGIN_DATA_KEY = "RecursicaImportDivider";
export const DIVIDER_TYPE_START = "start";
export const DIVIDER_TYPE_END = "end";
export const CONSTRUCTION_ICON = "⚠️";

export interface PrimaryImportMetadata {
  componentGuid: string;
  componentVersion: number;
  componentName: string;
  importDate: string;
  wizardSelections: {
    dependencies: Array<{
      guid: string;
      name: string;
      useExisting: boolean;
    }>;
    tokensCollection: "new" | "existing";
    themeCollection: "new" | "existing";
    layersCollection: "new" | "existing";
  };
  variableSummary: {
    tokens: { existing: number; new: number };
    theme: { existing: number; new: number };
    layers: { existing: number; new: number };
  };
  createdCollections: Array<{
    collectionId: string;
    collectionName: string;
  }>;
  createdVariables: Array<{
    variableId: string;
    variableName: string;
    collectionId: string;
    collectionName: string;
  }>;
  importError?: string; // Optional error message if import failed
}

export interface CheckForExistingPrimaryImportResponseData {
  exists: boolean;
  pageId?: string;
  metadata?: PrimaryImportMetadata;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CheckForExistingPrimaryImportData {
  // No data needed - just checks all pages
}

/**
 * Checks for an existing primary import by looking for a page with RecursicaPrimaryImport plugin data
 * or any page marked as "under review"
 */
export async function checkForExistingPrimaryImport(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: CheckForExistingPrimaryImportData,
): Promise<ResponseMessage> {
  try {
    await figma.loadAllPagesAsync();
    const allPages = figma.root.children;

    for (const page of allPages) {
      if (page.type !== "PAGE") {
        continue;
      }

      // Check for primary import metadata
      const primaryImportData = page.getPluginData(PRIMARY_IMPORT_KEY);
      if (primaryImportData) {
        try {
          const metadata: PrimaryImportMetadata = JSON.parse(primaryImportData);
          const responseData: CheckForExistingPrimaryImportResponseData = {
            exists: true,
            pageId: page.id,
            metadata,
          };
          return retSuccess(
            "checkForExistingPrimaryImport",
            responseData as any,
          );
        } catch (parseError) {
          debugConsole.warning(
            `Failed to parse primary import metadata on page "${page.name}": ${parseError}`,
          );
          continue;
        }
      }

      // Also check for global importResult (indicates import in progress)
      const globalImportResultStr = figma.root.getPluginData(IMPORT_RESULT_KEY);
      if (globalImportResultStr) {
        // Found global importResult, try to get primary import metadata
        const primaryData = page.getPluginData(PRIMARY_IMPORT_KEY);
        if (primaryData) {
          try {
            const metadata: PrimaryImportMetadata = JSON.parse(primaryData);
            const responseData: CheckForExistingPrimaryImportResponseData = {
              exists: true,
              pageId: page.id,
              metadata,
            };
            return retSuccess(
              "checkForExistingPrimaryImport",
              responseData as any,
            );
          } catch {
            // Continue searching
          }
        }
      }
    }

    const responseData: CheckForExistingPrimaryImportResponseData = {
      exists: false,
    };
    return retSuccess("checkForExistingPrimaryImport", responseData as any);
  } catch (error) {
    console.error("Error checking for existing primary import:", error);
    return retError(
      "checkForExistingPrimaryImport",
      error instanceof Error ? error : "Unknown error occurred",
    );
  }
}

export interface CreateImportDividersResponseData {
  startDividerId: string;
  endDividerId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateImportDividersData {
  // No data needed
}

/**
 * Creates start and end divider pages for marking import boundaries
 */
export async function createImportDividers(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: CreateImportDividersData,
): Promise<ResponseMessage> {
  try {
    await figma.loadAllPagesAsync();

    // Check if dividers already exist (by plugin data)
    const existingStart = figma.root.children.find(
      (p) =>
        p.type === "PAGE" &&
        p.getPluginData(DIVIDER_PLUGIN_DATA_KEY) === DIVIDER_TYPE_START,
    ) as PageNode | undefined;
    const existingEnd = figma.root.children.find(
      (p) =>
        p.type === "PAGE" &&
        p.getPluginData(DIVIDER_PLUGIN_DATA_KEY) === DIVIDER_TYPE_END,
    ) as PageNode | undefined;

    if (existingStart && existingEnd) {
      // Dividers already exist, return their IDs
      const responseData: CreateImportDividersResponseData = {
        startDividerId: existingStart.id,
        endDividerId: existingEnd.id,
      };
      return retSuccess("createImportDividers", responseData as any);
    }

    // Create start divider
    const startDivider = figma.createPage();
    startDivider.name = IMPORT_START_DIVIDER;
    startDivider.setPluginData(DIVIDER_PLUGIN_DATA_KEY, DIVIDER_TYPE_START);
    // Dividers are identified by DIVIDER_PLUGIN_DATA_KEY and will be deleted based on importResult

    // Create end divider
    const endDivider = figma.createPage();
    endDivider.name = IMPORT_END_DIVIDER;
    endDivider.setPluginData(DIVIDER_PLUGIN_DATA_KEY, DIVIDER_TYPE_END);
    // Dividers are identified by DIVIDER_PLUGIN_DATA_KEY and will be deleted based on importResult

    // Position end divider after start divider
    const startIndex = figma.root.children.indexOf(startDivider);
    figma.root.insertChild(startIndex + 1, endDivider);

    debugConsole.log("Created import dividers");

    const responseData: CreateImportDividersResponseData = {
      startDividerId: startDivider.id,
      endDividerId: endDivider.id,
    };
    return retSuccess("createImportDividers", responseData as any);
  } catch (error) {
    console.error("Error creating import dividers:", error);
    return retError(
      "createImportDividers",
      error instanceof Error ? error : "Unknown error occurred",
    );
  }
}

export interface ImportSingleComponentWithWizardData {
  mainComponent: {
    guid: string;
    name: string;
    version: number;
    jsonData: any;
  };
  dependencies: Array<{
    guid: string;
    name: string;
    version: number;
    jsonData: any;
    useExisting: boolean;
  }>;
  wizardSelections: {
    dependencies: Array<{
      guid: string;
      name: string;
      useExisting: boolean;
    }>;
    tokensCollection: "new" | "existing";
    themeCollection: "new" | "existing";
    layersCollection: "new" | "existing";
  };
  variableSummary: {
    tokens: { existing: number; new: number };
    theme: { existing: number; new: number };
    layers: { existing: number; new: number };
  };
}

export interface ImportSingleComponentWithWizardResponseData {
  success: boolean;
  mainPageId?: string;
  importedPageIds?: string[];
  createdCollections?: Array<{ collectionId: string; collectionName: string }>;
  createdVariables?: Array<{
    variableId: string;
    variableName: string;
    collectionId: string;
    collectionName: string;
  }>;
}

/**
 * Main import orchestration function that imports a single component with its dependencies
 */
export async function importSingleComponentWithWizard(
  data: ImportSingleComponentWithWizardData,
): Promise<ResponseMessage> {
  try {
    debugConsole.log("=== Starting Single Component Import ===");

    // Step 1: Create start divider only (end divider will be created after pages)
    debugConsole.log("Creating start divider...");
    await figma.loadAllPagesAsync();

    // Check if start divider already exists
    let startDivider = figma.root.children.find(
      (p) =>
        p.type === "PAGE" &&
        p.getPluginData(DIVIDER_PLUGIN_DATA_KEY) === DIVIDER_TYPE_START,
    ) as PageNode | undefined;

    if (!startDivider) {
      startDivider = figma.createPage();
      startDivider.name = IMPORT_START_DIVIDER;
      startDivider.setPluginData(DIVIDER_PLUGIN_DATA_KEY, DIVIDER_TYPE_START);
      // Dividers are identified by DIVIDER_PLUGIN_DATA_KEY and will be deleted based on importResult
      debugConsole.log("Created start divider");
    }

    // Step 2: Prepare files to import
    // Filter dependencies to only those that should be imported (not using existing)
    const dependenciesToImport = data.dependencies.filter(
      (dep) => !dep.useExisting,
    );

    // Build import order: dependencies first, then main component
    const allFilesToImport = [
      ...dependenciesToImport.map((dep) => ({
        fileName: `${dep.name}.json`,
        jsonData: dep.jsonData,
      })),
      {
        fileName: `${data.mainComponent.name}.json`,
        jsonData: data.mainComponent.jsonData,
      },
    ];

    // Step 3: Import pages in order
    debugConsole.log(
      `Importing ${allFilesToImport.length} file(s) in dependency order...`,
    );
    const importResult = await importPagesInOrder({
      jsonFiles: allFilesToImport,
      mainFileName: `${data.mainComponent.name}.json`,
      collectionChoices: {
        tokens: data.wizardSelections.tokensCollection,
        theme: data.wizardSelections.themeCollection,
        layers: data.wizardSelections.layersCollection,
      },
      skipUniqueNaming: true, // Don't add _<number> suffix for wizard imports
      constructionIcon: CONSTRUCTION_ICON, // Add construction icon to page names
    });

    if (!importResult.success) {
      throw new Error(
        importResult.message || "Failed to import pages in order",
      );
    }

    // Step 4: Create end divider after all pages are imported
    await figma.loadAllPagesAsync();
    const allPagesAfterImport = figma.root.children;

    // Check if end divider already exists
    let endDividerAfterImport = allPagesAfterImport.find(
      (p) =>
        p.type === "PAGE" &&
        p.getPluginData(DIVIDER_PLUGIN_DATA_KEY) === DIVIDER_TYPE_END,
    ) as PageNode | undefined;

    if (!endDividerAfterImport) {
      endDividerAfterImport = figma.createPage();
      endDividerAfterImport.name = IMPORT_END_DIVIDER;
      endDividerAfterImport.setPluginData(
        DIVIDER_PLUGIN_DATA_KEY,
        DIVIDER_TYPE_END,
      );
      // Dividers are identified by DIVIDER_PLUGIN_DATA_KEY and will be deleted based on importResult

      // Position end divider after all imported pages (after start divider)
      // Find the last page that's not a divider
      let insertIndex = allPagesAfterImport.length;
      for (let i = allPagesAfterImport.length - 1; i >= 0; i--) {
        const page = allPagesAfterImport[i];
        if (
          page.type === "PAGE" &&
          page.getPluginData(DIVIDER_PLUGIN_DATA_KEY) !== DIVIDER_TYPE_START &&
          page.getPluginData(DIVIDER_PLUGIN_DATA_KEY) !== DIVIDER_TYPE_END
        ) {
          insertIndex = i + 1;
          break;
        }
      }
      figma.root.insertChild(insertIndex, endDividerAfterImport);
      debugConsole.log("Created end divider");
    }

    // Step 4.5: Add divider IDs to global importResult so they're included in cleanup
    // Dividers are part of the import process and should be tracked for cleanup
    const globalImportResultStr = figma.root.getPluginData(IMPORT_RESULT_KEY);
    if (globalImportResultStr) {
      try {
        const importResults = JSON.parse(
          globalImportResultStr,
        ) as SanitizedPageImportResult[];
        // Collect divider IDs (both start and end, whether newly created or existing)
        const dividerIds: string[] = [];
        if (startDivider) {
          dividerIds.push(startDivider.id);
        }
        if (endDividerAfterImport) {
          dividerIds.push(endDividerAfterImport.id);
        }

        if (dividerIds.length > 0) {
          // Add divider IDs to each importResult's createdPageIds
          for (const importResult of importResults) {
            // Ensure createdPageIds array exists
            if (!importResult.createdPageIds) {
              importResult.createdPageIds = [];
            }
            // Add divider IDs if not already present
            const existingPageIds = new Set(importResult.createdPageIds);
            for (const dividerId of dividerIds) {
              if (!existingPageIds.has(dividerId)) {
                importResult.createdPageIds.push(dividerId);
              }
            }
          }
          // Update global importResult with divider IDs included (already sanitized)
          figma.root.setPluginData(
            IMPORT_RESULT_KEY,
            JSON.stringify(importResults),
          );
          debugConsole.log(
            `Added ${dividerIds.length} divider ID(s) to global importResult: ${dividerIds.map((id) => id.substring(0, 8) + "...").join(", ")}`,
          );
        }
      } catch (error) {
        debugConsole.warning(
          `Failed to add divider IDs to importResult: ${error}`,
        );
      }
    } else {
      debugConsole.warning(
        "No global importResult found - dividers will not be tracked for cleanup",
      );
    }

    // Step 5: Get page IDs from import result
    debugConsole.log(
      `Import result data structure: ${JSON.stringify(Object.keys(importResult.data || {}))}`,
    );
    const importResultData = importResult.data as {
      importedPages?: Array<{ name: string; pageId: string }>;
    };
    // Note: importResult objects are now stored globally on figma.root for cleanup/delete operations
    // Individual importResult objects contain detailed information per page
    debugConsole.log(
      `Import completed. ImportResult objects are stored globally for cleanup/delete operations.`,
    );

    if (
      !importResultData?.importedPages ||
      importResultData.importedPages.length === 0
    ) {
      throw new Error("No pages were imported");
    }

    // Find the main page by GUID from page metadata (more reliable than name matching)
    // This avoids issues with special characters, encoding, or name changes
    const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";
    const targetGuid = data.mainComponent.guid;

    debugConsole.log(
      `Looking for main page by GUID: ${targetGuid.substring(0, 8)}...`,
    );

    let mainPageId: string | undefined;
    let mainPage: PageNode | null = null;

    // First, try to find by GUID in the imported pages
    for (const importedPage of importResultData.importedPages) {
      try {
        const page = (await figma.getNodeByIdAsync(
          importedPage.pageId,
        )) as PageNode | null;
        if (page && page.type === "PAGE") {
          const pageMetadataStr = page.getPluginData(PAGE_METADATA_KEY);
          if (pageMetadataStr) {
            try {
              const pageMetadata = JSON.parse(pageMetadataStr);
              if (pageMetadata.id === targetGuid) {
                mainPageId = importedPage.pageId;
                mainPage = page;
                debugConsole.log(
                  `Found main page by GUID: "${page.name}" (ID: ${importedPage.pageId.substring(0, 12)}...)`,
                );
                break;
              }
            } catch {
              // Invalid metadata, continue
            }
          }
        }
      } catch (err) {
        debugConsole.warning(
          `Error checking page ${importedPage.pageId}: ${err}`,
        );
      }
    }

    // Fallback: If not found by GUID, search all pages (in case page wasn't in importedPages list)
    if (!mainPageId) {
      debugConsole.log(
        "Main page not found in importedPages list, searching all pages by GUID...",
      );
      await figma.loadAllPagesAsync();
      const allPages = figma.root.children;
      for (const page of allPages) {
        if (page.type === "PAGE") {
          const pageMetadataStr = page.getPluginData(PAGE_METADATA_KEY);
          if (pageMetadataStr) {
            try {
              const pageMetadata = JSON.parse(pageMetadataStr);
              if (pageMetadata.id === targetGuid) {
                mainPageId = page.id;
                mainPage = page;
                debugConsole.log(
                  `Found main page by GUID in all pages: "${page.name}" (ID: ${page.id.substring(0, 12)}...)`,
                );
                break;
              }
            } catch {
              // Invalid metadata, continue
            }
          }
        }
      }
    }

    if (!mainPageId || !mainPage) {
      debugConsole.error(
        `Failed to find imported main page by GUID: ${targetGuid.substring(0, 8)}...`,
      );
      debugConsole.log("Imported pages were:");
      for (const importedPage of importResultData.importedPages) {
        debugConsole.log(
          `  - "${importedPage.name}" (ID: ${importedPage.pageId.substring(0, 12)}...)`,
        );
      }
      throw new Error("Failed to find imported main page ID");
    }

    // mainPage is already set from the GUID lookup above
    if (!mainPage || mainPage.type !== "PAGE") {
      throw new Error("Failed to get main page node");
    }

    // Mark all imported pages as "under review"
    for (const importedPage of importResultData.importedPages) {
      try {
        const page = (await figma.getNodeByIdAsync(
          importedPage.pageId,
        )) as PageNode | null;
        if (page && page.type === "PAGE") {
          // Pages are identified by importResult.createdPageIds, no need for UNDER_REVIEW_KEY

          // Ensure construction icon is on the name
          const baseName = page.name.replace(/_\d+$/, ""); // Remove _<number> suffix if present
          if (!baseName.startsWith(CONSTRUCTION_ICON)) {
            page.name = `${CONSTRUCTION_ICON} ${baseName}`;
          } else {
            // Already has icon, but might have _<number> suffix
            const nameWithoutIcon = baseName
              .replace(CONSTRUCTION_ICON, "")
              .trim();
            page.name = `${CONSTRUCTION_ICON} ${nameWithoutIcon}`;
          }
        }
      } catch (err) {
        debugConsole.warning(
          `Failed to process page ${importedPage.pageId}: ${err}`,
        );
      }
    }

    // Also mark REMOTES page as "under review" if it exists and was used during import
    // Also ensure it has the construction icon
    await figma.loadAllPagesAsync();
    const allPagesForMarking = figma.root.children;
    const remotesPage = allPagesForMarking.find(
      (p) =>
        p.type === "PAGE" &&
        (p.name === "REMOTES" || p.name === `${CONSTRUCTION_ICON} REMOTES`),
    ) as PageNode | undefined;
    if (remotesPage) {
      // REMOTES page is identified by importResult.createdPageIds if it was created, no need for UNDER_REVIEW_KEY
      // Ensure construction icon is on the name
      if (!remotesPage.name.startsWith(CONSTRUCTION_ICON)) {
        remotesPage.name = `${CONSTRUCTION_ICON} REMOTES`;
      }
      debugConsole.log("Ensured construction icon on REMOTES page");
    }

    // Double-check: Find any pages between dividers that might have been missed
    const startDividerCheck = allPagesForMarking.find(
      (p) =>
        p.type === "PAGE" &&
        p.getPluginData(DIVIDER_PLUGIN_DATA_KEY) === DIVIDER_TYPE_START,
    ) as PageNode | undefined;
    const endDividerCheck = allPagesForMarking.find(
      (p) =>
        p.type === "PAGE" &&
        p.getPluginData(DIVIDER_PLUGIN_DATA_KEY) === DIVIDER_TYPE_END,
    ) as PageNode | undefined;

    if (startDividerCheck && endDividerCheck) {
      const startIndex = allPagesForMarking.indexOf(startDividerCheck);
      const endIndex = allPagesForMarking.indexOf(endDividerCheck);

      // Mark any pages between dividers that aren't already marked
      for (let i = startIndex + 1; i < endIndex; i++) {
        const page = allPagesForMarking[i];
        if (page.type === "PAGE") {
          // Pages are identified by importResult.createdPageIds, no need for UNDER_REVIEW_KEY
          // Just log that we found a page between dividers
          debugConsole.log(
            `Found page "${page.name}" between dividers (will be identified by importResult)`,
          );
        }
      }
    }

    // Step 6: Collect created entities from import
    // Use the IDs directly from importResultData - no need to look them up
    // We'll look them up during cleanup if needed

    const createdCollections: Array<{
      collectionId: string;
      collectionName: string;
    }> = [];
    const createdVariables: Array<{
      variableId: string;
      variableName: string;
      collectionId: string;
      collectionName: string;
    }> = [];

    // Extract created collections - get them from global importResult
    const globalImportResultStrForCollections =
      figma.root.getPluginData(IMPORT_RESULT_KEY);
    const allCollectionIdsFromImport: string[] = [];
    const allVariableIdsFromImport: string[] = [];

    if (globalImportResultStrForCollections) {
      try {
        const importResults = JSON.parse(
          globalImportResultStrForCollections,
        ) as Array<{
          createdCollectionIds?: string[];
          createdVariableIds?: string[];
        }>;
        for (const ir of importResults) {
          if (ir.createdCollectionIds) {
            allCollectionIdsFromImport.push(...ir.createdCollectionIds);
          }
          if (ir.createdVariableIds) {
            allVariableIdsFromImport.push(...ir.createdVariableIds);
          }
        }
      } catch (error) {
        debugConsole.warning(
          `[EXTRACTION] Failed to parse global importResult: ${error}`,
        );
      }
    }

    debugConsole.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs from global importResult: ${allCollectionIdsFromImport.length}`,
    );
    if (allCollectionIdsFromImport.length > 0) {
      debugConsole.log(
        `[EXTRACTION] Collection IDs to process: ${allCollectionIdsFromImport.map((id) => id.substring(0, 8) + "...").join(", ")}`,
      );
      for (const collectionId of allCollectionIdsFromImport) {
        try {
          const collection =
            await figma.variables.getVariableCollectionByIdAsync(collectionId);
          if (collection) {
            createdCollections.push({
              collectionId: collection.id,
              collectionName: collection.name,
            });
            debugConsole.log(
              `[EXTRACTION] ✓ Extracted collection: "${collection.name}" (${collectionId.substring(0, 8)}...)`,
            );
          } else {
            // Collection not found - still track it by ID for cleanup
            // This can happen if collection was deleted or ID is invalid
            createdCollections.push({
              collectionId: collectionId,
              collectionName: `Unknown (${collectionId.substring(0, 8)}...)`,
            });
            debugConsole.warning(
              `[EXTRACTION] Collection ${collectionId.substring(0, 8)}... not found - will still track for cleanup`,
            );
          }
        } catch (err) {
          // Even if lookup fails, track the ID for cleanup
          createdCollections.push({
            collectionId: collectionId,
            collectionName: `Unknown (${collectionId.substring(0, 8)}...)`,
          });
          debugConsole.warning(
            `[EXTRACTION] Failed to get collection ${collectionId.substring(0, 8)}...: ${err} - will still track for cleanup`,
          );
        }
      }
    } else {
      debugConsole.warning(
        "[EXTRACTION] No collectionIds found in global importResult",
      );
    }
    debugConsole.log(
      `[EXTRACTION] Total collections extracted: ${createdCollections.length}`,
    );
    if (createdCollections.length > 0) {
      debugConsole.log(
        `[EXTRACTION] Extracted collections: ${createdCollections.map((c) => `"${c.collectionName}" (${c.collectionId.substring(0, 8)}...)`).join(", ")}`,
      );
    }

    // Extract created variables
    // Track ALL variables that were created, regardless of whether they're in new or existing collections
    // The cleanup logic will handle deleting collections (which deletes their variables) separately

    if (allVariableIdsFromImport.length > 0) {
      debugConsole.log(
        `[EXTRACTION] Processing ${allVariableIdsFromImport.length} variable ID(s)...`,
      );
      for (const variableId of allVariableIdsFromImport) {
        try {
          const variable =
            await figma.variables.getVariableByIdAsync(variableId);
          if (variable && variable.resolvedType) {
            // Track ALL variables, not just those in existing collections
            // Variables in newly created collections will be deleted when we delete the collection,
            // but we still track them in case the collection deletion fails
            const collection =
              await figma.variables.getVariableCollectionByIdAsync(
                variable.variableCollectionId,
              );
            if (collection) {
              createdVariables.push({
                variableId: variable.id,
                variableName: variable.name,
                collectionId: variable.variableCollectionId,
                collectionName: collection.name,
              });
            } else {
              // Collection not found - still track variable for cleanup
              createdVariables.push({
                variableId: variable.id,
                variableName: variable.name,
                collectionId: variable.variableCollectionId,
                collectionName: `Unknown (${variable.variableCollectionId.substring(0, 8)}...)`,
              });
            }
          }
        } catch (error) {
          debugConsole.warning(
            `Failed to get variable ${variableId}: ${error}`,
          );
        }
      }
      debugConsole.log(
        `[EXTRACTION] Total variables extracted: ${createdVariables.length}`,
      );
    } else {
      debugConsole.warning(
        "[EXTRACTION] No variableIds found in global importResult",
      );
    }

    // Step 6: Store primary import metadata on main page
    // Store metadata immediately after collecting entities so it's available even if import fails later

    // Fallback: If extraction failed but we have IDs, create entries with just IDs
    // This ensures cleanup can still work even if lookups failed
    if (
      createdCollections.length === 0 &&
      allCollectionIdsFromImport.length > 0
    ) {
      debugConsole.warning(
        "[EXTRACTION] Collection extraction failed, but IDs are available in global importResult - creating fallback entries",
      );
      for (const collectionId of allCollectionIdsFromImport) {
        createdCollections.push({
          collectionId: collectionId,
          collectionName: `Unknown (${collectionId.substring(0, 8)}...)`,
        });
      }
    }
    if (createdVariables.length === 0 && allVariableIdsFromImport.length > 0) {
      debugConsole.warning(
        "[EXTRACTION] Variable extraction failed, but IDs are available in global importResult - creating fallback entries",
      );
      for (const variableId of allVariableIdsFromImport) {
        createdVariables.push({
          variableId: variableId,
          variableName: `Unknown (${variableId.substring(0, 8)}...)`,
          collectionId: "unknown",
          collectionName: "Unknown",
        });
      }
    }

    const primaryImportMetadata: PrimaryImportMetadata = {
      componentGuid: data.mainComponent.guid,
      componentVersion: data.mainComponent.version,
      componentName: data.mainComponent.name,
      importDate: new Date().toISOString(),
      wizardSelections: data.wizardSelections,
      variableSummary: data.variableSummary,
      createdCollections,
      createdVariables,
      importError: undefined, // No error yet
    };

    debugConsole.log(
      `Storing metadata with ${createdCollections.length} collection(s) and ${createdVariables.length} variable(s)`,
    );
    mainPage.setPluginData(
      PRIMARY_IMPORT_KEY,
      JSON.stringify(primaryImportMetadata),
    );
    // Main page is identified by importResult.createdPageIds, no need for UNDER_REVIEW_KEY
    debugConsole.log("Stored primary import metadata on main page");

    // Step 7: Collect all imported page IDs from import result
    const importedPageIds: string[] = [];
    if (importResultData.importedPages) {
      importedPageIds.push(
        ...importResultData.importedPages.map((p) => p.pageId),
      );
    }

    debugConsole.log("=== Single Component Import Complete ===");

    // Store metadata before any potential errors
    // Update metadata with success status (no error)
    primaryImportMetadata.importError = undefined;
    debugConsole.log(
      `[METADATA] About to store metadata with ${createdCollections.length} collection(s) and ${createdVariables.length} variable(s)`,
    );
    if (createdCollections.length > 0) {
      debugConsole.log(
        `[METADATA] Collections to store: ${createdCollections.map((c) => `"${c.collectionName}" (${c.collectionId.substring(0, 8)}...)`).join(", ")}`,
      );
    }
    mainPage.setPluginData(
      PRIMARY_IMPORT_KEY,
      JSON.stringify(primaryImportMetadata),
    );
    debugConsole.log(
      `[METADATA] Stored metadata: ${createdCollections.length} collection(s), ${createdVariables.length} variable(s)`,
    );

    // Verify what we stored
    const storedMetadataJson = mainPage.getPluginData(PRIMARY_IMPORT_KEY);
    if (storedMetadataJson) {
      try {
        const storedMetadata: PrimaryImportMetadata =
          JSON.parse(storedMetadataJson);
        debugConsole.log(
          `[METADATA] Verification: Stored metadata has ${storedMetadata.createdCollections.length} collection(s) and ${storedMetadata.createdVariables.length} variable(s)`,
        );
      } catch {
        debugConsole.warning("[METADATA] Failed to verify stored metadata");
      }
    }

    // Note: mainPage is already validated at line 415, so it's guaranteed to be non-null here
    const responseData: ImportSingleComponentWithWizardResponseData = {
      success: true,
      mainPageId: mainPage!.id,
      importedPageIds,
      createdCollections,
      createdVariables,
    };

    return retSuccess("importSingleComponentWithWizard", responseData as any);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`Import failed: ${errorMessage}`);

    // Try to store metadata with error information if we have a main page
    try {
      await figma.loadAllPagesAsync();
      // Try to find the main page by looking for pages with PRIMARY_IMPORT_KEY
      const allPages = figma.root.children;
      let mainPageWithMetadata: PageNode | null = null;

      for (const page of allPages) {
        if (page.type !== "PAGE") continue;
        const primaryImportData = page.getPluginData(PRIMARY_IMPORT_KEY);
        if (primaryImportData) {
          try {
            const existingMetadata: PrimaryImportMetadata =
              JSON.parse(primaryImportData);
            // Check if this matches our import
            if (existingMetadata.componentGuid === data.mainComponent.guid) {
              mainPageWithMetadata = page;
              break;
            }
          } catch {
            // Invalid metadata, continue
          }
        }
      }

      // If we found existing metadata, update it with error
      if (mainPageWithMetadata) {
        const existingMetadataJson =
          mainPageWithMetadata.getPluginData(PRIMARY_IMPORT_KEY);
        if (existingMetadataJson) {
          try {
            const existingMetadata: PrimaryImportMetadata =
              JSON.parse(existingMetadataJson);
            debugConsole.log(
              `[CATCH] Found existing metadata with ${existingMetadata.createdCollections.length} collection(s) and ${existingMetadata.createdVariables.length} variable(s)`,
            );
            existingMetadata.importError = errorMessage;
            mainPageWithMetadata.setPluginData(
              PRIMARY_IMPORT_KEY,
              JSON.stringify(existingMetadata),
            );
            debugConsole.log(
              `[CATCH] Updated existing metadata with error. Collections: ${existingMetadata.createdCollections.length}, Variables: ${existingMetadata.createdVariables.length}`,
            );
          } catch (err) {
            debugConsole.warning(`[CATCH] Failed to update metadata: ${err}`);
          }
        }
      } else {
        // No existing metadata, try to create it with what we know
        // We need to collect created entities even on error
        debugConsole.log(
          "No existing metadata found, attempting to collect created entities for cleanup...",
        );

        // Find pages that are part of the import using global importResult
        const pagesUnderReview: PageNode[] = [];
        const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";
        const globalImportResultStrForCleanup =
          figma.root.getPluginData(IMPORT_RESULT_KEY);
        const importResultPageIds: string[] = [];
        if (globalImportResultStrForCleanup) {
          try {
            const importResults = JSON.parse(
              globalImportResultStrForCleanup,
            ) as Array<{
              createdPageIds?: string[];
            }>;
            for (const ir of importResults) {
              if (ir.createdPageIds) {
                importResultPageIds.push(...ir.createdPageIds);
              }
            }
          } catch {
            // Failed to parse, continue
          }
        }
        for (const page of allPages) {
          if (page.type !== "PAGE") continue;
          // Check if page is in importResult or has page metadata
          const hasPageMetadata = !!page.getPluginData(PAGE_METADATA_KEY);
          const isInImportResult = importResultPageIds.includes(page.id);
          if (hasPageMetadata || isInImportResult) {
            pagesUnderReview.push(page);
          }
        }

        // Collect created collections by finding collections that match our wizard selections
        const createdCollections: Array<{
          collectionId: string;
          collectionName: string;
        }> = [];
        if (data.wizardSelections) {
          const localCollections =
            await figma.variables.getLocalVariableCollectionsAsync();
          const collectionTypes = [
            {
              choice: data.wizardSelections.tokensCollection,
              normalizedName: "Tokens",
            },
            {
              choice: data.wizardSelections.themeCollection,
              normalizedName: "Theme",
            },
            {
              choice: data.wizardSelections.layersCollection,
              normalizedName: "Layer",
            },
          ];

          for (const { choice, normalizedName } of collectionTypes) {
            if (choice === "new") {
              // Find collections that match this normalized name
              const matchingCollections = localCollections.filter((c) => {
                const normalized = normalizeCollectionName(c.name);
                return normalized === normalizedName;
              });

              // If we find matching collections, add the most recent one (likely the one we created)
              if (matchingCollections.length > 0) {
                // Sort by creation time (newest first) - we'll take the first one
                // Actually, we can't easily determine creation time, so just take the first match
                const collection = matchingCollections[0];
                createdCollections.push({
                  collectionId: collection.id,
                  collectionName: collection.name,
                });
                debugConsole.log(
                  `Found created collection: "${collection.name}" (${collection.id.substring(0, 8)}...)`,
                );
              }
            }
          }
        }

        const createdVariables: Array<{
          variableId: string;
          variableName: string;
          collectionId: string;
          collectionName: string;
        }> = [];

        // If we have pages under review, store metadata on the first one
        if (pagesUnderReview.length > 0) {
          const fallbackMainPage = pagesUnderReview[0];

          const fallbackMetadata: PrimaryImportMetadata = {
            componentGuid: data.mainComponent.guid,
            componentVersion: data.mainComponent.version,
            componentName: data.mainComponent.name,
            importDate: new Date().toISOString(),
            wizardSelections: data.wizardSelections,
            variableSummary: data.variableSummary || {
              tokens: { existing: 0, new: 0 },
              theme: { existing: 0, new: 0 },
              layers: { existing: 0, new: 0 },
            },
            createdCollections,
            createdVariables,
            importError: errorMessage,
          };

          fallbackMainPage.setPluginData(
            PRIMARY_IMPORT_KEY,
            JSON.stringify(fallbackMetadata),
          );
          debugConsole.log(
            `Created fallback metadata with ${createdCollections.length} collection(s) and error information`,
          );
        }
      }
    } catch (metadataError) {
      debugConsole.warning(
        `Failed to store error metadata: ${metadataError instanceof Error ? metadataError.message : String(metadataError)}`,
      );
    }

    return retError(
      "importSingleComponentWithWizard",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

export interface DeleteImportGroupData {
  pageId: string; // The main page ID with primary import metadata
}

export interface DeleteImportGroupResponseData {
  success: boolean;
  deletedPages: number;
  deletedCollections: number;
  deletedVariables: number;
  deletedStyles: number;
}

/**
 * Deletes an import group including all pages, dividers, created variables, and created styles.
 * Collections are never deleted - only the variables we created are removed.
 */
export async function deleteImportGroup(
  data: DeleteImportGroupData,
): Promise<ResponseMessage> {
  try {
    debugConsole.log("=== Starting Import Group Deletion ===");

    // Step 1: Get the main page and its metadata
    await figma.loadAllPagesAsync();
    const mainPage = (await figma.getNodeByIdAsync(
      data.pageId,
    )) as PageNode | null;

    if (!mainPage || mainPage.type !== "PAGE") {
      throw new Error("Main page not found");
    }

    const primaryImportData = mainPage.getPluginData(PRIMARY_IMPORT_KEY);
    if (!primaryImportData) {
      throw new Error("Primary import metadata not found on page");
    }

    const metadata: PrimaryImportMetadata = JSON.parse(primaryImportData);

    debugConsole.log(
      `Found metadata: ${metadata.createdCollections.length} collection(s), ${metadata.createdVariables.length} variable(s) to delete`,
    );

    // Step 2: Find all pages to delete using importResult
    // This includes main component, dependencies, REMOTES page (if created), and dividers
    await figma.loadAllPagesAsync();
    const allPages = figma.root.children;
    const pagesToDelete: PageNode[] = [];
    const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";

    // Get global importResult to find pages to delete
    const globalImportResultStr = figma.root.getPluginData(IMPORT_RESULT_KEY);
    const importResultPageIds: string[] = [];
    if (globalImportResultStr) {
      try {
        const importResults = JSON.parse(globalImportResultStr) as Array<{
          createdPageIds?: string[];
        }>;
        for (const ir of importResults) {
          if (ir.createdPageIds) {
            importResultPageIds.push(...ir.createdPageIds);
          }
        }
        debugConsole.log(
          `Found ${importResultPageIds.length} page ID(s) in global importResult (includes dividers)`,
        );
      } catch (error) {
        debugConsole.warning(`Failed to parse global importResult: ${error}`);
      }
    }

    // If we have importResult, use it exclusively to find pages to delete
    if (importResultPageIds.length > 0) {
      for (const pageId of importResultPageIds) {
        try {
          const page = (await figma.getNodeByIdAsync(
            pageId,
          )) as PageNode | null;
          if (page && page.type === "PAGE") {
            pagesToDelete.push(page);
            debugConsole.log(
              `Found page to delete from importResult: "${page.name}" (${pageId.substring(0, 8)}...)`,
            );
          }
        } catch (error) {
          debugConsole.warning(
            `Could not get page ${pageId.substring(0, 8)}...: ${error}`,
          );
        }
      }
    } else {
      // Fallback: if no importResult, use PAGE_METADATA_KEY (legacy)
      debugConsole.log(
        "No importResult found, falling back to PAGE_METADATA_KEY for page identification",
      );
      for (const page of allPages) {
        if (page.type !== "PAGE") {
          continue;
        }
        const hasPageMetadata = !!page.getPluginData(PAGE_METADATA_KEY);
        if (hasPageMetadata) {
          pagesToDelete.push(page);
          debugConsole.log(`Found page to delete (legacy): "${page.name}"`);
        }
      }
    }

    // Step 4: Delete created variables (from both new and existing collections)
    // We never delete collections - only the variables we created
    debugConsole.log(
      `Deleting ${metadata.createdVariables.length} variable(s) we created...`,
    );
    let deletedVariablesCount = 0;
    for (const variableInfo of metadata.createdVariables) {
      try {
        const variable = await figma.variables.getVariableByIdAsync(
          variableInfo.variableId,
        );
        if (variable) {
          variable.remove();
          deletedVariablesCount++;
          debugConsole.log(
            `Deleted variable: ${variableInfo.variableName} from collection ${variableInfo.collectionName}`,
          );
        } else {
          debugConsole.warning(
            `Variable ${variableInfo.variableName} (${variableInfo.variableId}) not found - may have already been deleted`,
          );
        }
      } catch (error) {
        debugConsole.warning(
          `Failed to delete variable ${variableInfo.variableName}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Step 5: Delete created styles from global importResult
    debugConsole.log("Deleting created styles...");
    let deletedStylesCount = 0;
    const globalImportResultStrForStyles =
      figma.root.getPluginData(IMPORT_RESULT_KEY);
    if (globalImportResultStrForStyles) {
      try {
        const importResults = JSON.parse(
          globalImportResultStrForStyles,
        ) as Array<{
          createdStyleIds?: string[];
        }>;
        const allStyleIds = new Set<string>();
        for (const ir of importResults) {
          if (ir.createdStyleIds) {
            for (const styleId of ir.createdStyleIds) {
              allStyleIds.add(styleId);
            }
          }
        }
        debugConsole.log(
          `Found ${allStyleIds.size} style(s) to delete from global importResult`,
        );
        for (const styleId of allStyleIds) {
          try {
            const style = await figma.getStyleByIdAsync(styleId);
            if (style) {
              style.remove();
              deletedStylesCount++;
              debugConsole.log(
                `Deleted style: ${style.name} (${styleId.substring(0, 8)}...)`,
              );
            }
          } catch (error) {
            debugConsole.warning(
              `Failed to delete style ${styleId.substring(0, 8)}...: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }
      } catch (error) {
        debugConsole.warning(
          `Failed to parse global importResult for styles: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Step 6: Never delete collections - we only delete variables we created
    debugConsole.log(
      `Skipping deletion of ${metadata.createdCollections.length} collection(s) - collections are never deleted`,
    );

    // Step 6: Store page names before deletion (we can't access them after deletion)
    const pagesToDeleteWithNames = pagesToDelete.map((page) => ({
      page,
      name: page.name,
      id: page.id,
    }));

    // Step 7: Switch away from any pages we're about to delete
    const currentPage = figma.currentPage;
    const isCurrentPageInDeleteList = pagesToDeleteWithNames.some(
      (p) => p.id === currentPage.id,
    );

    if (isCurrentPageInDeleteList) {
      // Find a page that's not in the delete list to switch to
      await figma.loadAllPagesAsync();
      const allPages = figma.root.children;
      const safePage = allPages.find(
        (p) =>
          p.type === "PAGE" &&
          !pagesToDeleteWithNames.some((dp) => dp.id === p.id),
      ) as PageNode | undefined;

      if (safePage) {
        await figma.setCurrentPageAsync(safePage);
        debugConsole.log(
          `Switched away from page "${currentPage.name}" before deletion`,
        );
      } else {
        debugConsole.warning(
          "No safe page to switch to - all pages are being deleted",
        );
      }
    }

    // Step 8: Delete all pages in import group (including dividers)
    for (const { page, name } of pagesToDeleteWithNames) {
      try {
        // Verify page still exists before trying to delete
        let pageStillExists = false;
        try {
          await figma.loadAllPagesAsync();
          const allPages = figma.root.children;
          pageStillExists = allPages.some((p) => p.id === page.id);
        } catch {
          // Page doesn't exist, skip it
          pageStillExists = false;
        }

        if (!pageStillExists) {
          debugConsole.log(`Page "${name}" already deleted, skipping`);
          continue;
        }

        // Double-check we're not on this page before deleting
        if (figma.currentPage.id === page.id) {
          // Switch to a different page if we're still on this one
          await figma.loadAllPagesAsync();
          const allPages = figma.root.children;
          const safePage = allPages.find(
            (p) =>
              p.type === "PAGE" &&
              p.id !== page.id &&
              !pagesToDeleteWithNames.some((dp) => dp.id === p.id),
          ) as PageNode | undefined;

          if (safePage) {
            await figma.setCurrentPageAsync(safePage);
          }
        }

        page.remove();
        debugConsole.log(`Deleted page: "${name}"`);
      } catch (error) {
        debugConsole.warning(
          `Failed to delete page "${name}": ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    debugConsole.log("=== Import Group Deletion Complete ===");

    const responseData: DeleteImportGroupResponseData = {
      success: true,
      deletedPages: pagesToDelete.length,
      deletedCollections: 0, // Never delete collections
      deletedVariables: deletedVariablesCount,
      deletedStyles: deletedStylesCount,
    };

    return retSuccess("deleteImportGroup", responseData as any);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`Delete failed: ${errorMessage}`);
    return retError(
      "deleteImportGroup",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CleanupFailedImportData {
  // No data needed - finds pages using global importResult
}

export interface CleanupFailedImportResponseData {
  success: boolean;
  deletedPages: number;
  deletedCollections: number; // Always 0 - collections are never deleted
  deletedVariables: number;
  deletedStyles: number;
}

/**
 * Cleans up a failed import by finding all pages using global importResult
 * and deleting them. If a page with primary import metadata is found,
 * uses deleteImportGroup for full cleanup including variables and styles.
 * Otherwise, deletes pages identified by importResult.createdPageIds or PAGE_METADATA_KEY.
 * Collections are never deleted - only the variables we created are removed.
 */
export async function cleanupFailedImport(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: CleanupFailedImportData,
): Promise<ResponseMessage> {
  try {
    debugConsole.log("=== Cleaning up failed import ===");

    await figma.loadAllPagesAsync();
    const allPages = figma.root.children;

    const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";
    const CREATED_ENTITIES_KEY = "RecursicaCreatedEntities"; // Legacy key for backward compatibility

    // Check for global importResult (new system) - stored on figma.root
    const globalImportResultStr = figma.root.getPluginData(IMPORT_RESULT_KEY);
    const hasGlobalImportResult = !!globalImportResultStr;

    // Also check for legacy per-page createdEntities for backward compatibility
    let hasCreatedEntitiesPages = false;
    for (const page of allPages) {
      if (page.type !== "PAGE") {
        continue;
      }
      const createdEntitiesStr = page.getPluginData(CREATED_ENTITIES_KEY);
      if (createdEntitiesStr) {
        hasCreatedEntitiesPages = true;
        break;
      }
    }

    // If we found global importResult, use the new cleanup logic
    if (hasGlobalImportResult) {
      debugConsole.log(
        "Found global RecursicaImportResult, using importResult-based cleanup logic",
      );
    } else if (hasCreatedEntitiesPages) {
      debugConsole.log(
        "Found pages with RecursicaCreatedEntities (legacy), using createdEntities-based cleanup logic",
      );
    } else {
      // Try to find a page with primary import metadata (old system)
      let pageWithMetadata: PageNode | null = null;
      for (const page of allPages) {
        if (page.type !== "PAGE") {
          continue;
        }
        const primaryImportData = page.getPluginData(PRIMARY_IMPORT_KEY);
        if (primaryImportData) {
          pageWithMetadata = page;
          break;
        }
      }

      // If we found a page with old metadata, use deleteImportGroup for full cleanup
      if (pageWithMetadata) {
        debugConsole.log(
          "Found page with PRIMARY_IMPORT_KEY (old system), using deleteImportGroup",
        );
        return await deleteImportGroup({ pageId: pageWithMetadata.id });
      }

      // Otherwise, look for pages using global importResult or pages with PAGE_METADATA_KEY
      debugConsole.log(
        "No primary metadata found, looking for pages using global importResult or PAGE_METADATA_KEY",
      );
    }
    const pagesToDelete: Array<{ id: string; name: string }> = [];
    const allCollectionIds = new Set<string>();
    const allVariableIds = new Set<string>();

    // Collect created entities from global importResult (new system)
    let globalImportResults: Array<{
      createdPageIds?: string[];
      createdCollectionIds?: string[];
      createdVariableIds?: string[];
      createdStyleIds?: string[];
    }> = [];

    if (hasGlobalImportResult) {
      try {
        globalImportResults = JSON.parse(globalImportResultStr) as Array<{
          createdPageIds?: string[];
          createdCollectionIds?: string[];
          createdVariableIds?: string[];
          createdStyleIds?: string[];
        }>;

        debugConsole.log(
          `Found ${globalImportResults.length} importResult object(s) in global storage`,
        );

        for (const importResult of globalImportResults) {
          if (importResult.createdCollectionIds) {
            for (const collectionId of importResult.createdCollectionIds) {
              allCollectionIds.add(collectionId);
            }
          }
          if (importResult.createdVariableIds) {
            for (const variableId of importResult.createdVariableIds) {
              allVariableIds.add(variableId);
            }
          }
        }

        debugConsole.log(
          `Extracted ${allCollectionIds.size} collection ID(s) and ${allVariableIds.size} variable ID(s) from global importResult`,
        );
      } catch (error) {
        debugConsole.warning(`Failed to parse global importResult: ${error}`);
      }
    } else if (hasCreatedEntitiesPages) {
      // Fallback to legacy per-page createdEntities for backward compatibility
      debugConsole.log(
        `Scanning ${allPages.length} page(s) for legacy created entities...`,
      );

      for (const page of allPages) {
        if (page.type !== "PAGE") {
          continue;
        }
        const createdEntitiesStr = page.getPluginData(CREATED_ENTITIES_KEY);
        if (createdEntitiesStr) {
          try {
            const createdEntities = JSON.parse(createdEntitiesStr) as {
              pageIds?: string[];
              collectionIds?: string[];
              variableIds?: string[];
            };

            if (createdEntities.collectionIds) {
              for (const collectionId of createdEntities.collectionIds) {
                allCollectionIds.add(collectionId);
              }
            }
            if (createdEntities.variableIds) {
              for (const variableId of createdEntities.variableIds) {
                allVariableIds.add(variableId);
              }
            }
          } catch (error) {
            debugConsole.warning(
              `Failed to parse created entities from page "${page.name}": ${error}`,
            );
          }
        }
      }
    }

    // Now, find pages to delete
    debugConsole.log(
      `Scanning ${allPages.length} page(s) for pages to delete...`,
    );

    for (const page of allPages) {
      if (page.type !== "PAGE") {
        continue;
      }
      const pageMetadata = page.getPluginData(PAGE_METADATA_KEY);
      const createdEntitiesStr = page.getPluginData(CREATED_ENTITIES_KEY); // Legacy check
      const isInImportResult =
        hasGlobalImportResult &&
        globalImportResults.some((ir) => ir.createdPageIds?.includes(page.id));

      // Delete if global importResult exists and this page is in createdPageIds
      // OR if it has page metadata (fallback for legacy pages)

      // Log every page for debugging
      debugConsole.log(
        `  Checking page "${page.name}": hasMetadata=${!!pageMetadata}, isInImportResult=${isInImportResult}, hasLegacyCreatedEntities=${!!createdEntitiesStr}`,
      );

      if (isInImportResult || pageMetadata) {
        // Store page info before deletion
        pagesToDelete.push({ id: page.id, name: page.name });
        debugConsole.log(
          `Found page to delete: "${page.name}" (isInImportResult: ${isInImportResult}, hasMetadata: ${!!pageMetadata})`,
        );
      }
    }

    // If we have global importResult, also add any pages from createdPageIds
    if (hasGlobalImportResult && globalImportResults.length > 0) {
      debugConsole.log(
        `Checking global importResult for additional pages to delete...`,
      );
      for (const importResult of globalImportResults) {
        if (importResult.createdPageIds) {
          for (const pageId of importResult.createdPageIds) {
            // Only add if not already in pagesToDelete
            if (!pagesToDelete.some((p) => p.id === pageId)) {
              try {
                const additionalPage = (await figma.getNodeByIdAsync(
                  pageId,
                )) as PageNode | null;
                if (additionalPage && additionalPage.type === "PAGE") {
                  pagesToDelete.push({
                    id: additionalPage.id,
                    name: additionalPage.name,
                  });
                  debugConsole.log(
                    `  Added additional page from global importResult.createdPageIds: "${additionalPage.name}"`,
                  );
                }
              } catch (error) {
                debugConsole.warning(
                  `  Could not get page ${pageId.substring(0, 8)}...: ${error}`,
                );
              }
            }
          }
        }
      }
    } else if (hasCreatedEntitiesPages) {
      // Legacy: extract pageIds from per-page createdEntities
      for (const page of allPages) {
        if (page.type !== "PAGE") {
          continue;
        }
        const createdEntitiesStr = page.getPluginData(CREATED_ENTITIES_KEY);
        if (createdEntitiesStr) {
          try {
            const createdEntities = JSON.parse(createdEntitiesStr) as {
              pageIds?: string[];
            };
            if (createdEntities.pageIds) {
              for (const pageId of createdEntities.pageIds) {
                if (!pagesToDelete.some((p) => p.id === pageId)) {
                  try {
                    const additionalPage = (await figma.getNodeByIdAsync(
                      pageId,
                    )) as PageNode | null;
                    if (additionalPage && additionalPage.type === "PAGE") {
                      pagesToDelete.push({
                        id: additionalPage.id,
                        name: additionalPage.name,
                      });
                      debugConsole.log(
                        `  Added additional page from legacy createdEntities.pageIds: "${additionalPage.name}"`,
                      );
                    }
                  } catch (error) {
                    debugConsole.warning(
                      `  Could not get page ${pageId.substring(0, 8)}...: ${error}`,
                    );
                  }
                }
              }
            }
          } catch (error) {
            debugConsole.warning(
              `  Failed to parse legacy createdEntities from page "${page.name}": ${error}`,
            );
          }
        }
      }
    }

    debugConsole.log(
      `Cleanup summary: Found ${pagesToDelete.length} page(s) to delete, ${allCollectionIds.size} collection(s) to delete, ${allVariableIds.size} variable(s) to delete`,
    );

    // Switch away from any pages we're about to delete
    const currentPage = figma.currentPage;
    const isCurrentPageInDeleteList = pagesToDelete.some(
      (p) => p.id === currentPage.id,
    );

    if (isCurrentPageInDeleteList) {
      await figma.loadAllPagesAsync();
      const allPagesCheck = figma.root.children;
      const safePage = allPagesCheck.find(
        (p) => p.type === "PAGE" && !pagesToDelete.some((dp) => dp.id === p.id),
      ) as PageNode | undefined;

      if (safePage) {
        await figma.setCurrentPageAsync(safePage);
        debugConsole.log(
          `Switched away from page "${currentPage.name}" before deletion`,
        );
      }
    }

    // Delete all pages identified by importResult or PAGE_METADATA_KEY
    let deletedPagesCount = 0;
    for (const pageInfo of pagesToDelete) {
      try {
        // Get fresh page reference by ID
        await figma.loadAllPagesAsync();
        const page = (await figma.getNodeByIdAsync(
          pageInfo.id,
        )) as PageNode | null;

        if (!page || page.type !== "PAGE") {
          // Page already deleted or doesn't exist
          continue;
        }

        // Double-check we're not on this page
        if (figma.currentPage.id === page.id) {
          await figma.loadAllPagesAsync();
          const allPagesCheck = figma.root.children;
          const safePage = allPagesCheck.find(
            (p) =>
              p.type === "PAGE" &&
              p.id !== page.id &&
              !pagesToDelete.some((dp) => dp.id === p.id),
          ) as PageNode | undefined;

          if (safePage) {
            await figma.setCurrentPageAsync(safePage);
          }
        }

        page.remove();
        deletedPagesCount++;
        debugConsole.log(`Deleted page: "${pageInfo.name}"`);
      } catch (error) {
        debugConsole.warning(
          `Failed to delete page "${pageInfo.name}" (${pageInfo.id.substring(0, 8)}...): ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Delete variables and styles that were created during the import
    // We never delete collections - only the variables we created
    let deletedVariablesCount = 0;
    let deletedStylesCount = 0;

    // Delete all variables we created (from both new and existing collections)
    for (const variableId of allVariableIds) {
      try {
        const variable = await figma.variables.getVariableByIdAsync(variableId);
        if (variable) {
          variable.remove();
          deletedVariablesCount++;
          debugConsole.log(
            `Deleted variable: ${variable.name} (${variableId.substring(0, 8)}...)`,
          );
        }
      } catch (error) {
        debugConsole.warning(
          `Could not delete variable ${variableId.substring(0, 8)}...: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Delete created styles from global importResult
    if (hasGlobalImportResult) {
      try {
        const importResults = JSON.parse(globalImportResultStr) as Array<{
          createdStyleIds?: string[];
        }>;
        const allStyleIds = new Set<string>();
        for (const ir of importResults) {
          if (ir.createdStyleIds) {
            for (const styleId of ir.createdStyleIds) {
              allStyleIds.add(styleId);
            }
          }
        }
        debugConsole.log(
          `Found ${allStyleIds.size} style(s) to delete from global importResult`,
        );
        for (const styleId of allStyleIds) {
          try {
            const style = await figma.getStyleByIdAsync(styleId);
            if (style) {
              style.remove();
              deletedStylesCount++;
              debugConsole.log(
                `Deleted style: ${style.name} (${styleId.substring(0, 8)}...)`,
              );
            }
          } catch (error) {
            debugConsole.warning(
              `Failed to delete style ${styleId.substring(0, 8)}...: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }
      } catch (error) {
        debugConsole.warning(
          `Failed to parse global importResult for styles: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Never delete collections - we only delete variables we created
    debugConsole.log(
      `Skipping deletion of ${allCollectionIds.size} collection(s) - collections are never deleted`,
    );

    // Clear global importResult after cleanup
    if (hasGlobalImportResult) {
      figma.root.setPluginData(IMPORT_RESULT_KEY, "");
      debugConsole.log("Cleared global importResult after cleanup");
    }

    debugConsole.log("=== Failed Import Cleanup Complete ===");

    const responseData: CleanupFailedImportResponseData = {
      success: true,
      deletedPages: deletedPagesCount,
      deletedCollections: 0, // Never delete collections
      deletedVariables: deletedVariablesCount,
      deletedStyles: deletedStylesCount,
    };

    return retSuccess("cleanupFailedImport", responseData as any);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`Cleanup failed: ${errorMessage}`);
    return retError(
      "cleanupFailedImport",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

export interface ClearImportMetadataData {
  pageId: string; // The main page ID with primary import metadata
}

export interface ClearImportMetadataResponseData {
  success: boolean;
}

/**
 * Clears the import metadata from a page (removes "under review" and primary import metadata)
 * This is useful when a page was incorrectly marked as under review
 */
export async function clearImportMetadata(
  data: ClearImportMetadataData,
): Promise<ResponseMessage> {
  try {
    debugConsole.log("=== Clearing Import Metadata ===");

    // Get the main page
    await figma.loadAllPagesAsync();
    const mainPage = (await figma.getNodeByIdAsync(
      data.pageId,
    )) as PageNode | null;

    if (!mainPage || mainPage.type !== "PAGE") {
      throw new Error("Page not found");
    }

    // Clear primary import metadata
    mainPage.setPluginData(PRIMARY_IMPORT_KEY, "");

    // Clear global importResult (this signals import is complete)
    figma.root.setPluginData(IMPORT_RESULT_KEY, "");
    debugConsole.log("Cleared global importResult after clearing metadata");

    debugConsole.log("Cleared import metadata from page and related pages");

    const responseData: ClearImportMetadataResponseData = {
      success: true,
    };

    return retSuccess("clearImportMetadata", responseData as any);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    debugConsole.error(`Clear metadata failed: ${errorMessage}`);
    return retError(
      "clearImportMetadata",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}
