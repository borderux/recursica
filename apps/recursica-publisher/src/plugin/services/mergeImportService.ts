/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import { debugConsole } from "./debugConsole";
import {
  PRIMARY_IMPORT_KEY,
  UNDER_REVIEW_KEY,
  DIVIDER_PLUGIN_DATA_KEY,
  CONSTRUCTION_ICON,
} from "./singleComponentImportService";
import type { PrimaryImportMetadata } from "./singleComponentImportService";
import {
  FIXED_COLLECTION_GUIDS,
  VALID_COLLECTION_NAMES,
} from "../../const/CollectionConstants";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetLocalVariableCollectionsData {
  // No data needed
}

export interface GetCollectionGuidsData {
  collectionIds: string[];
}

export interface GetCollectionGuidsResponseData {
  collectionGuids: Array<{ collectionId: string; guid: string | null }>;
}

export interface GetLocalVariableCollectionsResponseData {
  collections: Array<{
    id: string;
    name: string;
    guid?: string;
  }>;
}

export interface MergeImportGroupData {
  pageId: string;
  collectionChoices: Array<{
    newCollectionId: string;
    newCollectionGuid: string | null;
    existingCollectionId: string | null;
    choice: "merge" | "keep";
  }>;
}

export interface MergeImportGroupResponseData {
  mergedCollections: number;
  keptCollections: number;
  pagesRenamed: number;
}

/**
 * Gets all local variable collections with GUIDs
 */
export async function getLocalVariableCollections(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: GetLocalVariableCollectionsData,
): Promise<ResponseMessage> {
  try {
    const COLLECTION_GUID_KEY = "recursica:collectionId";
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const responseData: GetLocalVariableCollectionsResponseData = {
      collections: collections.map((c) => {
        const guid = c.getSharedPluginData("recursica", COLLECTION_GUID_KEY);
        return {
          id: c.id,
          name: c.name,
          guid: guid || undefined,
        };
      }),
    };
    return retSuccess(
      "getLocalVariableCollections",
      responseData as unknown as Record<string, unknown>,
    );
  } catch (error) {
    return retError(
      "getLocalVariableCollections",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

/**
 * Gets GUIDs for specific collections
 */
export async function getCollectionGuids(
  data: GetCollectionGuidsData,
): Promise<ResponseMessage> {
  try {
    const COLLECTION_GUID_KEY = "recursica:collectionId";
    const collectionGuids: Array<{
      collectionId: string;
      guid: string | null;
    }> = [];

    for (const collectionId of data.collectionIds) {
      try {
        const collection =
          await figma.variables.getVariableCollectionByIdAsync(collectionId);
        if (collection) {
          const guid = collection.getSharedPluginData(
            "recursica",
            COLLECTION_GUID_KEY,
          );
          collectionGuids.push({
            collectionId,
            guid: guid || null,
          });
        } else {
          collectionGuids.push({
            collectionId,
            guid: null,
          });
        }
      } catch (err) {
        debugConsole.warning(
          `Failed to get GUID for collection ${collectionId}: ${err instanceof Error ? err.message : String(err)}`,
        );
        collectionGuids.push({
          collectionId,
          guid: null,
        });
      }
    }

    const responseData: GetCollectionGuidsResponseData = {
      collectionGuids,
    };
    return retSuccess(
      "getCollectionGuids",
      responseData as unknown as Record<string, unknown>,
    );
  } catch (error) {
    return retError(
      "getCollectionGuids",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

/**
 * Merges an import group by:
 * 1. Merging variables from new collections into existing ones (if requested)
 * 2. Removing dividers
 * 3. Removing construction icons from page names
 * 4. Renaming pages with version numbers
 */
export async function mergeImportGroup(
  data: MergeImportGroupData,
): Promise<ResponseMessage> {
  try {
    debugConsole.log("=== Starting Import Group Merge ===");

    // Step 1: Get the main page and metadata
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
      `Found metadata for component: ${metadata.componentName} (Version: ${metadata.componentVersion})`,
    );

    // Step 2: Merge collections
    let mergedCollections = 0;
    let keptCollections = 0;
    const COLLECTION_GUID_KEY = "recursica:collectionId";

    for (const choice of data.collectionChoices) {
      if (choice.choice === "merge") {
        try {
          const newCollection =
            await figma.variables.getVariableCollectionByIdAsync(
              choice.newCollectionId,
            );

          if (!newCollection) {
            debugConsole.warning(
              `New collection ${choice.newCollectionId} not found, skipping merge`,
            );
            continue;
          }

          // Find or get existing collection
          let existingCollection: VariableCollection | null = null;

          if (choice.existingCollectionId) {
            // Use provided existing collection ID
            existingCollection =
              await figma.variables.getVariableCollectionByIdAsync(
                choice.existingCollectionId,
              );
          } else {
            // No existing collection ID provided - get GUID from new collection and find by GUID
            const newCollectionGuid = newCollection.getSharedPluginData(
              "recursica",
              COLLECTION_GUID_KEY,
            );

            if (newCollectionGuid) {
              // Find existing collection by GUID
              const allCollections =
                await figma.variables.getLocalVariableCollectionsAsync();

              for (const collection of allCollections) {
                const guid = collection.getSharedPluginData(
                  "recursica",
                  COLLECTION_GUID_KEY,
                );
                if (
                  guid === newCollectionGuid &&
                  collection.id !== choice.newCollectionId
                ) {
                  existingCollection = collection;
                  break;
                }
              }

              // If not found and it's a standard collection GUID, find or create a standard collection
              if (
                !existingCollection &&
                (newCollectionGuid === FIXED_COLLECTION_GUIDS.LAYER ||
                  newCollectionGuid === FIXED_COLLECTION_GUIDS.TOKENS ||
                  newCollectionGuid === FIXED_COLLECTION_GUIDS.THEME)
              ) {
                let standardName: string;
                if (newCollectionGuid === FIXED_COLLECTION_GUIDS.LAYER) {
                  standardName = VALID_COLLECTION_NAMES.LAYER;
                } else if (
                  newCollectionGuid === FIXED_COLLECTION_GUIDS.TOKENS
                ) {
                  standardName = VALID_COLLECTION_NAMES.TOKENS;
                } else {
                  standardName = VALID_COLLECTION_NAMES.THEME;
                }

                // Try to find existing collection with correct name and GUID
                for (const collection of allCollections) {
                  const guid = collection.getSharedPluginData(
                    "recursica",
                    COLLECTION_GUID_KEY,
                  );
                  if (
                    guid === newCollectionGuid &&
                    collection.name === standardName &&
                    collection.id !== choice.newCollectionId
                  ) {
                    existingCollection = collection;
                    break;
                  }
                }

                // If still not found, create a new standard collection with correct name
                if (!existingCollection) {
                  existingCollection =
                    figma.variables.createVariableCollection(standardName);
                  existingCollection.setSharedPluginData(
                    "recursica",
                    COLLECTION_GUID_KEY,
                    newCollectionGuid,
                  );
                  debugConsole.log(
                    `Created new standard collection: "${standardName}"`,
                  );
                }
              }
            }
          }

          if (!existingCollection) {
            debugConsole.warning(
              `Could not find or create existing collection for merge, skipping`,
            );
            continue;
          }

          debugConsole.log(
            `Merging collection "${newCollection.name}" (${choice.newCollectionId.substring(0, 8)}...) into "${existingCollection.name}" (${existingCollection.id.substring(0, 8)}...)`,
          );

          // Get all variables from both collections
          const newVariablePromises = newCollection.variableIds.map((id) =>
            figma.variables.getVariableByIdAsync(id),
          );
          const newVariableObjects = await Promise.all(newVariablePromises);

          const existingVariablePromises = existingCollection.variableIds.map(
            (id) => figma.variables.getVariableByIdAsync(id),
          );
          const existingVariables = await Promise.all(existingVariablePromises);
          const existingVariableNames = new Set(
            existingVariables.filter((v) => v !== null).map((v) => v!.name),
          );

          // Copy each variable to the existing collection
          for (const variable of newVariableObjects) {
            if (!variable) continue;

            try {
              // Check if variable with same name exists in existing collection
              if (existingVariableNames.has(variable.name)) {
                // Variable exists, skip it (we can't update existing variables)
                debugConsole.warning(
                  `Variable "${variable.name}" already exists in collection "${existingCollection.name}", skipping`,
                );
                continue;
              }

              // Create a new variable in the existing collection
              const newVariable = figma.variables.createVariable(
                variable.name,
                existingCollection,
                variable.resolvedType,
              );

              // Copy variable values for each mode in the existing collection
              // Use the value from the new variable's first mode if the mode doesn't match
              for (const mode of existingCollection.modes) {
                const modeId = mode.modeId;
                let value = variable.valuesByMode[modeId];

                // If the new variable doesn't have a value for this mode,
                // try to use the value from the first mode of the new variable
                if (value === undefined && newCollection.modes.length > 0) {
                  const firstModeId = newCollection.modes[0].modeId;
                  value = variable.valuesByMode[firstModeId];
                }

                if (value !== undefined) {
                  newVariable.setValueForMode(modeId, value);
                }
              }

              debugConsole.log(
                `  ✓ Copied variable "${variable.name}" to collection "${existingCollection.name}"`,
              );
            } catch (err) {
              debugConsole.warning(
                `Failed to copy variable "${variable.name}": ${err instanceof Error ? err.message : String(err)}`,
              );
            }
          }

          // Delete the new collection (since we've merged its variables)
          newCollection.remove();
          mergedCollections++;
          debugConsole.log(
            `✓ Merged and deleted collection: ${newCollection.name}`,
          );
        } catch (err) {
          debugConsole.warning(
            `Failed to merge collection: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      } else {
        // Keep the collection as-is
        keptCollections++;
        debugConsole.log(`Kept collection: ${choice.newCollectionId}`);
      }
    }

    // Step 3: Remove dividers
    debugConsole.log("Removing dividers...");
    const allPages = figma.root.children;
    const dividersToDelete: PageNode[] = [];

    for (const page of allPages) {
      if (page.type !== "PAGE") continue;
      const dividerType = page.getPluginData(DIVIDER_PLUGIN_DATA_KEY);
      if (dividerType === "start" || dividerType === "end") {
        dividersToDelete.push(page);
      }
    }

    // Switch away from any divider pages before deleting
    const currentPage = figma.currentPage;
    if (dividersToDelete.some((p) => p.id === currentPage.id)) {
      // Switch to main page if current page is a divider
      if (mainPage && mainPage.id !== currentPage.id) {
        figma.currentPage = mainPage;
      } else {
        // Find any non-divider page
        const nonDivider = allPages.find(
          (p) =>
            p.type === "PAGE" && !dividersToDelete.some((d) => d.id === p.id),
        ) as PageNode | undefined;
        if (nonDivider) {
          figma.currentPage = nonDivider;
        }
      }
    }

    // Store divider names before deletion
    const dividerNames = dividersToDelete.map((d) => d.name);
    for (const divider of dividersToDelete) {
      try {
        divider.remove();
      } catch (err) {
        debugConsole.warning(
          `Failed to delete divider: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
    for (const name of dividerNames) {
      debugConsole.log(`Deleted divider: ${name}`);
    }

    // Step 4: Remove construction icons and rename pages with version numbers
    debugConsole.log("Removing construction icons and renaming pages...");
    await figma.loadAllPagesAsync();
    const pagesAfterDividerRemoval = figma.root.children;
    let pagesRenamed = 0;
    const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";

    // Find all pages that are part of this import (marked as under review)
    // Store page info before any operations to avoid accessing deleted nodes
    const importPagesInfo: Array<{
      pageId: string;
      pageName: string;
      pageMetadata: { id?: string; name?: string; version?: number };
    }> = [];

    for (const page of pagesAfterDividerRemoval) {
      if (page.type !== "PAGE") continue;
      try {
        const underReview = page.getPluginData(UNDER_REVIEW_KEY);
        if (underReview === "true") {
          // Try to get page metadata to find component name and version
          const pageMetadataJson = page.getPluginData(PAGE_METADATA_KEY);
          let pageMetadata: { id?: string; name?: string; version?: number } =
            {};
          if (pageMetadataJson) {
            try {
              pageMetadata = JSON.parse(pageMetadataJson);
            } catch {
              // Invalid metadata, continue
            }
          }

          importPagesInfo.push({
            pageId: page.id,
            pageName: page.name,
            pageMetadata,
          });
        }
      } catch (err) {
        // Page might have been deleted, skip
        debugConsole.warning(
          `Failed to process page: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    // Rename pages using fresh node references
    for (const pageInfo of importPagesInfo) {
      try {
        const page = (await figma.getNodeByIdAsync(
          pageInfo.pageId,
        )) as PageNode | null;
        if (!page || page.type !== "PAGE") {
          debugConsole.warning(
            `Page ${pageInfo.pageId} not found, skipping rename`,
          );
          continue;
        }

        // Remove construction icon
        let newName = page.name;
        if (newName.startsWith(CONSTRUCTION_ICON)) {
          newName = newName.substring(CONSTRUCTION_ICON.length).trim();
        }

        // Special handling for REMOTES page - just remove construction icon, don't add version
        if (newName === "REMOTES" || newName.includes("REMOTES")) {
          page.name = "REMOTES";
          pagesRenamed++;
          debugConsole.log(`Renamed page: "${page.name}" -> "REMOTES"`);
          continue;
        }

        // Use page metadata if available, otherwise fall back to main component metadata
        // Only use page metadata if it has a valid name (not empty and not just a GUID)
        const hasValidPageMetadata =
          pageInfo.pageMetadata.name &&
          pageInfo.pageMetadata.name.length > 0 &&
          !pageInfo.pageMetadata.name.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          );

        const componentName = hasValidPageMetadata
          ? pageInfo.pageMetadata.name!
          : metadata.componentName || newName;
        const version =
          pageInfo.pageMetadata.version !== undefined
            ? pageInfo.pageMetadata.version
            : metadata.componentVersion;

        // Rename to: ComponentName (VERSION: X)
        const finalName = `${componentName} (VERSION: ${version})`;
        page.name = finalName;
        pagesRenamed++;
        debugConsole.log(`Renamed page: "${newName}" -> "${finalName}"`);
      } catch (err) {
        debugConsole.warning(
          `Failed to rename page ${pageInfo.pageId}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    // Step 5: Clear import metadata (only from main page, keep page metadata)
    debugConsole.log("Clearing import metadata...");
    if (mainPage) {
      try {
        mainPage.setPluginData(PRIMARY_IMPORT_KEY, "");
      } catch (err) {
        debugConsole.warning(
          `Failed to clear primary import metadata: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
    for (const pageInfo of importPagesInfo) {
      try {
        const page = (await figma.getNodeByIdAsync(
          pageInfo.pageId,
        )) as PageNode | null;
        if (page && page.type === "PAGE") {
          page.setPluginData(UNDER_REVIEW_KEY, "");
        }
      } catch (err) {
        debugConsole.warning(
          `Failed to clear under review metadata for page ${pageInfo.pageId}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    const responseData: MergeImportGroupResponseData = {
      mergedCollections,
      keptCollections,
      pagesRenamed,
    };

    debugConsole.log(
      `=== Merge Complete ===\n  Merged: ${mergedCollections} collection(s)\n  Kept: ${keptCollections} collection(s)\n  Renamed: ${pagesRenamed} page(s)`,
    );

    return retSuccess(
      "mergeImportGroup",
      responseData as unknown as Record<string, unknown>,
    );
  } catch (error) {
    debugConsole.error(
      `Merge failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return retError(
      "mergeImportGroup",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}
