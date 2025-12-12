/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import { debugConsole } from "./debugConsole";
import { importPagesInOrder } from "./dependencyResolver";
import { normalizeCollectionName } from "../../const/CollectionConstants";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const PRIMARY_IMPORT_KEY = "RecursicaPrimaryImport";
export const UNDER_REVIEW_KEY = "RecursicaUnderReview";
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
          await debugConsole.warning(
            `Failed to parse primary import metadata on page "${page.name}": ${parseError}`,
          );
          continue;
        }
      }

      // Also check for "under review" status (in case primary import metadata is missing)
      const underReviewData = page.getPluginData(UNDER_REVIEW_KEY);
      if (underReviewData === "true") {
        // Found a page under review, try to get primary import metadata
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
        } else {
          // Page is under review but no primary import metadata - this shouldn't happen, but handle it
          await debugConsole.warning(
            `Found page "${page.name}" marked as under review but missing primary import metadata`,
          );
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
    startDivider.setPluginData(UNDER_REVIEW_KEY, "true"); // Mark as under review so it gets deleted

    // Create end divider
    const endDivider = figma.createPage();
    endDivider.name = IMPORT_END_DIVIDER;
    endDivider.setPluginData(DIVIDER_PLUGIN_DATA_KEY, DIVIDER_TYPE_END);
    endDivider.setPluginData(UNDER_REVIEW_KEY, "true"); // Mark as under review so it gets deleted

    // Position end divider after start divider
    const startIndex = figma.root.children.indexOf(startDivider);
    figma.root.insertChild(startIndex + 1, endDivider);

    await debugConsole.log("Created import dividers");

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
    await debugConsole.log("=== Starting Single Component Import ===");

    // Step 1: Create start divider only (end divider will be created after pages)
    await debugConsole.log("Creating start divider...");
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
      startDivider.setPluginData(UNDER_REVIEW_KEY, "true"); // Mark as under review so it gets deleted
      await debugConsole.log("Created start divider");
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
    await debugConsole.log(
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
      endDividerAfterImport.setPluginData(UNDER_REVIEW_KEY, "true"); // Mark as under review so it gets deleted

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
      await debugConsole.log("Created end divider");
    }

    // Step 5: Get page IDs from import result and mark them as "under review"
    await debugConsole.log(
      `Import result data structure: ${JSON.stringify(Object.keys(importResult.data || {}))}`,
    );
    const importResultData = importResult.data as {
      importedPages?: Array<{ name: string; pageId: string }>;
      createdEntities?: {
        collectionIds?: string[];
        variableIds?: string[];
        pageIds?: string[];
      };
    };
    await debugConsole.log(
      `Import result has createdEntities: ${!!importResultData?.createdEntities}`,
    );
    if (importResultData?.createdEntities) {
      await debugConsole.log(
        `  Collection IDs: ${importResultData.createdEntities.collectionIds?.length || 0}`,
      );
      await debugConsole.log(
        `  Variable IDs: ${importResultData.createdEntities.variableIds?.length || 0}`,
      );
      await debugConsole.log(
        `  Page IDs: ${importResultData.createdEntities.pageIds?.length || 0}`,
      );
    }

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

    await debugConsole.log(
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
                await debugConsole.log(
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
        await debugConsole.warning(
          `Error checking page ${importedPage.pageId}: ${err}`,
        );
      }
    }

    // Fallback: If not found by GUID, search all pages (in case page wasn't in importedPages list)
    if (!mainPageId) {
      await debugConsole.log(
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
                await debugConsole.log(
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
      await debugConsole.error(
        `Failed to find imported main page by GUID: ${targetGuid.substring(0, 8)}...`,
      );
      await debugConsole.log("Imported pages were:");
      for (const importedPage of importResultData.importedPages) {
        await debugConsole.log(
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
          // Set "under review" metadata
          page.setPluginData(UNDER_REVIEW_KEY, "true");

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
        await debugConsole.warning(
          `Failed to mark page ${importedPage.pageId} as under review: ${err}`,
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
      remotesPage.setPluginData(UNDER_REVIEW_KEY, "true");
      // Ensure construction icon is on the name
      if (!remotesPage.name.startsWith(CONSTRUCTION_ICON)) {
        remotesPage.name = `${CONSTRUCTION_ICON} REMOTES`;
      }
      await debugConsole.log(
        "Marked REMOTES page as under review and ensured construction icon",
      );
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
          const underReview = page.getPluginData(UNDER_REVIEW_KEY);
          if (underReview !== "true") {
            page.setPluginData(UNDER_REVIEW_KEY, "true");
            await debugConsole.log(
              `Marked page "${page.name}" as under review (found between dividers)`,
            );
          }
        }
      }
    }

    // Step 6: Collect created entities from import

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

    // Extract created collections
    await debugConsole.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${importResultData?.createdEntities?.collectionIds?.length || 0}`,
    );
    if (importResultData?.createdEntities?.collectionIds) {
      await debugConsole.log(
        `[EXTRACTION] Collection IDs to process: ${importResultData.createdEntities.collectionIds.map((id) => id.substring(0, 8) + "...").join(", ")}`,
      );
      for (const collectionId of importResultData.createdEntities
        .collectionIds) {
        try {
          const collection =
            await figma.variables.getVariableCollectionByIdAsync(collectionId);
          if (collection) {
            createdCollections.push({
              collectionId: collection.id,
              collectionName: collection.name,
            });
            await debugConsole.log(
              `[EXTRACTION] ✓ Extracted collection: "${collection.name}" (${collectionId.substring(0, 8)}...)`,
            );
          } else {
            await debugConsole.warning(
              `[EXTRACTION] Collection ${collectionId.substring(0, 8)}... not found`,
            );
          }
        } catch (err) {
          await debugConsole.warning(
            `[EXTRACTION] Failed to get collection ${collectionId.substring(0, 8)}...: ${err}`,
          );
        }
      }
    } else {
      await debugConsole.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities",
      );
    }
    await debugConsole.log(
      `[EXTRACTION] Total collections extracted: ${createdCollections.length}`,
    );
    if (createdCollections.length > 0) {
      await debugConsole.log(
        `[EXTRACTION] Extracted collections: ${createdCollections.map((c) => `"${c.collectionName}" (${c.collectionId.substring(0, 8)}...)`).join(", ")}`,
      );
    }

    // Extract created variables
    // Only track variables created in existing collections (not in newly created collections)
    // Variables in newly created collections will be deleted when we delete the collection
    const createdCollectionIds = new Set(
      createdCollections.map((c) => c.collectionId),
    );

    if (importResultData?.createdEntities?.variableIds) {
      for (const variableId of importResultData.createdEntities.variableIds) {
        try {
          const variable =
            await figma.variables.getVariableByIdAsync(variableId);
          if (variable && variable.resolvedType) {
            // Only track if variable is in an existing collection (not a newly created one)
            if (!createdCollectionIds.has(variable.variableCollectionId)) {
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
              }
            }
          }
        } catch (error) {
          await debugConsole.warning(
            `Failed to get variable ${variableId}: ${error}`,
          );
        }
      }
    }

    // Step 6: Store primary import metadata on main page
    // Store metadata immediately after collecting entities so it's available even if import fails later
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

    await debugConsole.log(
      `Storing metadata with ${createdCollections.length} collection(s) and ${createdVariables.length} variable(s)`,
    );
    mainPage.setPluginData(
      PRIMARY_IMPORT_KEY,
      JSON.stringify(primaryImportMetadata),
    );
    mainPage.setPluginData(UNDER_REVIEW_KEY, "true"); // Ensure main page is marked as under review
    await debugConsole.log(
      "Stored primary import metadata on main page and marked as under review",
    );

    // Step 7: Collect all imported page IDs from import result
    const importedPageIds: string[] = [];
    if (importResultData.importedPages) {
      importedPageIds.push(
        ...importResultData.importedPages.map((p) => p.pageId),
      );
    }

    await debugConsole.log("=== Single Component Import Complete ===");

    // Store metadata before any potential errors
    // Update metadata with success status (no error)
    primaryImportMetadata.importError = undefined;
    await debugConsole.log(
      `[METADATA] About to store metadata with ${createdCollections.length} collection(s) and ${createdVariables.length} variable(s)`,
    );
    if (createdCollections.length > 0) {
      await debugConsole.log(
        `[METADATA] Collections to store: ${createdCollections.map((c) => `"${c.collectionName}" (${c.collectionId.substring(0, 8)}...)`).join(", ")}`,
      );
    }
    mainPage.setPluginData(
      PRIMARY_IMPORT_KEY,
      JSON.stringify(primaryImportMetadata),
    );
    await debugConsole.log(
      `[METADATA] Stored metadata: ${createdCollections.length} collection(s), ${createdVariables.length} variable(s)`,
    );

    // Verify what we stored
    const storedMetadataJson = mainPage.getPluginData(PRIMARY_IMPORT_KEY);
    if (storedMetadataJson) {
      try {
        const storedMetadata: PrimaryImportMetadata =
          JSON.parse(storedMetadataJson);
        await debugConsole.log(
          `[METADATA] Verification: Stored metadata has ${storedMetadata.createdCollections.length} collection(s) and ${storedMetadata.createdVariables.length} variable(s)`,
        );
      } catch {
        await debugConsole.warning(
          "[METADATA] Failed to verify stored metadata",
        );
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
    await debugConsole.error(`Import failed: ${errorMessage}`);

    // Try to store metadata with error information if we have a main page
    try {
      await figma.loadAllPagesAsync();
      // Try to find the main page by looking for pages with UNDER_REVIEW_KEY
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
            await debugConsole.log(
              `[CATCH] Found existing metadata with ${existingMetadata.createdCollections.length} collection(s) and ${existingMetadata.createdVariables.length} variable(s)`,
            );
            existingMetadata.importError = errorMessage;
            mainPageWithMetadata.setPluginData(
              PRIMARY_IMPORT_KEY,
              JSON.stringify(existingMetadata),
            );
            await debugConsole.log(
              `[CATCH] Updated existing metadata with error. Collections: ${existingMetadata.createdCollections.length}, Variables: ${existingMetadata.createdVariables.length}`,
            );
          } catch (err) {
            await debugConsole.warning(
              `[CATCH] Failed to update metadata: ${err}`,
            );
          }
        }
      } else {
        // No existing metadata, try to create it with what we know
        // We need to collect created entities even on error
        await debugConsole.log(
          "No existing metadata found, attempting to collect created entities for cleanup...",
        );

        // Find pages marked as under review
        const pagesUnderReview: PageNode[] = [];
        for (const page of allPages) {
          if (page.type !== "PAGE") continue;
          const underReview = page.getPluginData(UNDER_REVIEW_KEY);
          if (underReview === "true") {
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
                await debugConsole.log(
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
          await debugConsole.log(
            `Created fallback metadata with ${createdCollections.length} collection(s) and error information`,
          );
        }
      }
    } catch (metadataError) {
      await debugConsole.warning(
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
}

/**
 * Deletes an import group including all pages, dividers, and created collections/variables
 */
export async function deleteImportGroup(
  data: DeleteImportGroupData,
): Promise<ResponseMessage> {
  try {
    await debugConsole.log("=== Starting Import Group Deletion ===");

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

    await debugConsole.log(
      `Found metadata: ${metadata.createdCollections.length} collection(s), ${metadata.createdVariables.length} variable(s) to delete`,
    );

    // Step 2: Find all pages marked as "under review" - delete any page with this metadata
    // This includes main component, dependencies, REMOTES page, and dividers
    await figma.loadAllPagesAsync();
    const allPages = figma.root.children;
    const pagesToDelete: PageNode[] = [];

    for (const page of allPages) {
      if (page.type !== "PAGE") {
        continue;
      }

      // Check if page is marked as "under review" - delete any page with this metadata
      const underReview = page.getPluginData(UNDER_REVIEW_KEY);
      if (underReview === "true") {
        pagesToDelete.push(page);
        await debugConsole.log(
          `Found page to delete: "${page.name}" (under review)`,
        );
      }
    }

    // Step 4: Delete created variables in existing collections
    await debugConsole.log(
      `Deleting ${metadata.createdVariables.length} variable(s) from existing collections...`,
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
          await debugConsole.log(
            `Deleted variable: ${variableInfo.variableName} from collection ${variableInfo.collectionName}`,
          );
        } else {
          await debugConsole.warning(
            `Variable ${variableInfo.variableName} (${variableInfo.variableId}) not found - may have already been deleted`,
          );
        }
      } catch (error) {
        await debugConsole.warning(
          `Failed to delete variable ${variableInfo.variableName}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Step 5: Delete created collections (this will also delete all variables in those collections)
    await debugConsole.log(
      `Deleting ${metadata.createdCollections.length} collection(s)...`,
    );
    let deletedCollectionsCount = 0;
    for (const collectionInfo of metadata.createdCollections) {
      try {
        const collection = await figma.variables.getVariableCollectionByIdAsync(
          collectionInfo.collectionId,
        );
        if (collection) {
          collection.remove();
          deletedCollectionsCount++;
          await debugConsole.log(
            `Deleted collection: ${collectionInfo.collectionName} (${collectionInfo.collectionId})`,
          );
        } else {
          await debugConsole.warning(
            `Collection ${collectionInfo.collectionName} (${collectionInfo.collectionId}) not found - may have already been deleted`,
          );
        }
      } catch (error) {
        await debugConsole.warning(
          `Failed to delete collection ${collectionInfo.collectionName}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

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
        await debugConsole.log(
          `Switched away from page "${currentPage.name}" before deletion`,
        );
      } else {
        await debugConsole.warning(
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
          await debugConsole.log(`Page "${name}" already deleted, skipping`);
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
        await debugConsole.log(`Deleted page: "${name}"`);
      } catch (error) {
        await debugConsole.warning(
          `Failed to delete page "${name}": ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    await debugConsole.log("=== Import Group Deletion Complete ===");

    const responseData: DeleteImportGroupResponseData = {
      success: true,
      deletedPages: pagesToDelete.length,
      deletedCollections: deletedCollectionsCount,
      deletedVariables: deletedVariablesCount,
    };

    return retSuccess("deleteImportGroup", responseData as any);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(`Delete failed: ${errorMessage}`);
    return retError(
      "deleteImportGroup",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CleanupFailedImportData {
  // No data needed - finds pages with UNDER_REVIEW_KEY
}

export interface CleanupFailedImportResponseData {
  success: boolean;
  deletedPages: number;
  deletedCollections: number;
  deletedVariables: number;
}

/**
 * Cleans up a failed import by finding all pages marked as "under review"
 * and deleting them. If a page with primary import metadata is found,
 * uses deleteImportGroup for full cleanup including collections/variables.
 * Otherwise, just deletes pages with UNDER_REVIEW_KEY.
 */
export async function cleanupFailedImport(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: CleanupFailedImportData,
): Promise<ResponseMessage> {
  try {
    await debugConsole.log("=== Cleaning up failed import ===");

    await figma.loadAllPagesAsync();
    const allPages = figma.root.children;

    // Try to find a page with primary import metadata
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

    // If we found a page with metadata, use deleteImportGroup for full cleanup
    if (pageWithMetadata) {
      await debugConsole.log(
        "Found page with metadata, using deleteImportGroup",
      );
      return await deleteImportGroup({ pageId: pageWithMetadata.id });
    }

    // Otherwise, just delete all pages with UNDER_REVIEW_KEY
    await debugConsole.log(
      "No metadata found, deleting pages with UNDER_REVIEW_KEY",
    );
    const pagesToDelete: Array<{ id: string; name: string }> = [];
    for (const page of allPages) {
      if (page.type !== "PAGE") {
        continue;
      }
      const underReview = page.getPluginData(UNDER_REVIEW_KEY);
      if (underReview === "true") {
        // Store page info before deletion
        pagesToDelete.push({ id: page.id, name: page.name });
      }
    }

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
        await debugConsole.log(
          `Switched away from page "${currentPage.name}" before deletion`,
        );
      }
    }

    // Delete all pages with UNDER_REVIEW_KEY
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
        await debugConsole.log(`Deleted page: "${pageInfo.name}"`);
      } catch (error) {
        await debugConsole.warning(
          `Failed to delete page "${pageInfo.name}" (${pageInfo.id.substring(0, 8)}...): ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    await debugConsole.log("=== Failed Import Cleanup Complete ===");

    const responseData: CleanupFailedImportResponseData = {
      success: true,
      deletedPages: deletedPagesCount,
      deletedCollections: 0, // Can't clean up without metadata
      deletedVariables: 0, // Can't clean up without metadata
    };

    return retSuccess("cleanupFailedImport", responseData as any);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(`Cleanup failed: ${errorMessage}`);
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
    await debugConsole.log("=== Clearing Import Metadata ===");

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

    // Clear "under review" metadata
    mainPage.setPluginData(UNDER_REVIEW_KEY, "");

    // Also clear "under review" from any other pages that might have it
    // (in case dependencies were also marked)
    const allPages = figma.root.children;
    for (const page of allPages) {
      if (page.type === "PAGE") {
        const underReview = page.getPluginData(UNDER_REVIEW_KEY);
        if (underReview === "true") {
          // Check if this page is related to the same import by checking for the same component GUID
          const primaryData = page.getPluginData(PRIMARY_IMPORT_KEY);
          if (primaryData) {
            try {
              // Parse to validate, but we'll clear it regardless
              JSON.parse(primaryData);
              // Clear the under review status
              page.setPluginData(UNDER_REVIEW_KEY, "");
            } catch {
              // Invalid metadata, clear it anyway
              page.setPluginData(UNDER_REVIEW_KEY, "");
            }
          } else {
            // No primary metadata but marked as under review - clear it
            page.setPluginData(UNDER_REVIEW_KEY, "");
          }
        }
      }
    }

    await debugConsole.log(
      "Cleared import metadata from page and related pages",
    );

    const responseData: ClearImportMetadataResponseData = {
      success: true,
    };

    return retSuccess("clearImportMetadata", responseData as any);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    await debugConsole.error(`Clear metadata failed: ${errorMessage}`);
    return retError(
      "clearImportMetadata",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}
