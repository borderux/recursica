/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../../types/messages";
import { retSuccess, retError } from "../../utils/response";
import type { DebugConsoleMessage } from "./debugConsole";
import { debugConsole } from "./debugConsole";
import {
  PRIMARY_IMPORT_KEY,
  IMPORT_RESULT_KEY,
  DIVIDER_PLUGIN_DATA_KEY,
  CONSTRUCTION_ICON,
  checkForExistingPrimaryImport,
} from "./singleComponentImportService";
import type {
  PrimaryImportMetadata,
  CheckForExistingPrimaryImportData,
} from "./singleComponentImportService";

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
  componentChoices?: Array<{
    guid: string;
    name: string;
    importedPageId: string;
    choice: "deprecate" | "keep" | "use_existing";
  }>;
}

export interface MergeImportGroupResponseData {
  pagesRenamed: number;
  debugLogs?: DebugConsoleMessage[];
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

    // Step 1: Get the main page and metadata natively
    const existingImport = await checkForExistingPrimaryImport(
      {} as CheckForExistingPrimaryImportData,
    );
    const existingImportData = existingImport.data as {
      exists: boolean;
      pageId?: string;
      metadata?: PrimaryImportMetadata;
    };

    if (
      !existingImport.success ||
      !existingImportData.exists ||
      !existingImportData.pageId
    ) {
      throw new Error("Active import not found or page ID missing");
    }

    await figma.loadAllPagesAsync();
    const mainPage = (await figma.getNodeByIdAsync(
      existingImportData.pageId,
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

    // Step 2: Remove dividers
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

    // Step 3: Execute Component Merge Strategies
    debugConsole.log("Processing component merge strategies...");

    // Helper to build a stable map key for a component
    const getComponentKey = (comp: ComponentNode): string => {
      if (comp.parent?.type === "COMPONENT_SET") {
        return `${comp.parent.name}::${comp.name}`;
      }
      return comp.name;
    };

    if (data.componentChoices && data.componentChoices.length > 0) {
      for (const choice of data.componentChoices) {
        try {
          const newPage = (await figma.getNodeByIdAsync(
            choice.importedPageId,
          )) as PageNode | null;
          if (!newPage) {
            debugConsole.warning(
              `Component merge: new page ${choice.importedPageId} not found`,
            );
            continue;
          }

          if (choice.choice === "keep") {
            debugConsole.log(`Keeping component page: ${newPage.name}`);
            // No action needed, Step 4 will just rename it to canonical
            continue;
          }

          if (choice.choice === "deprecate") {
            debugConsole.log(
              `Deprecating all old versions and migrating to ${newPage.name}`,
            );

            // 1. Find ALL old versions
            const oldPages: PageNode[] = [];
            const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";
            const allPages = figma.root.children;

            for (const page of allPages) {
              if (page.type !== "PAGE" || page.id === newPage.id) continue;
              const metaJson = page.getPluginData(PAGE_METADATA_KEY);
              if (metaJson) {
                try {
                  const meta = JSON.parse(metaJson);
                  if (meta.id === choice.guid) {
                    oldPages.push(page);
                  }
                } catch {
                  // Ignore parse errors on old pages
                }
              }
            }

            if (oldPages.length === 0) {
              debugConsole.warning(
                `Component merge: no old pages found for ${choice.name} to deprecate`,
              );
              continue;
            }

            // 2. Rename old pages and track their IDs
            const oldPageIds = new Set(oldPages.map((p) => p.id));
            for (const oldPage of oldPages) {
              if (!oldPage.name.startsWith("[DEPRECATED]")) {
                oldPage.name = `[DEPRECATED] ${oldPage.name}`;
              }
              debugConsole.log(`Deprecated old page: ${oldPage.name}`);
            }

            // 3. Build map of new components
            const newMap = new Map<string, ComponentNode>();
            const newComponents = newPage.findAllWithCriteria({
              types: ["COMPONENT"],
            });
            for (const comp of newComponents) {
              newMap.set(getComponentKey(comp), comp);
            }

            // 4. Find and swap instances locally where possible
            // We search the entire file for instances pointing to components that live in any of the old pages
            let swapCount = 0;
            const allInstances = figma.root.findAllWithCriteria({
              types: ["INSTANCE"],
            });
            for (const instance of allInstances) {
              try {
                const mainComp = await instance.getMainComponentAsync();
                if (mainComp) {
                  // Check if the main component lives in an old page
                  let isOld = false;
                  let curr: BaseNode | null = mainComp;
                  while (curr) {
                    if (oldPageIds.has(curr.id)) {
                      isOld = true;
                      break;
                    }
                    curr = curr.parent;
                  }

                  if (isOld) {
                    const key = getComponentKey(mainComp);
                    const counterpart = newMap.get(key);
                    if (counterpart) {
                      instance.swapComponent(counterpart);
                      swapCount++;
                    }
                  }
                }
              } catch {
                // Ignore instances that fail to swap
              }
            }
            debugConsole.log(
              `Successfully swapped ${swapCount} instances to the new component`,
            );
            // Step 4 will naturally rename newPage to canonical
          }

          if (choice.choice === "use_existing") {
            // Find ALL existing versions to build a fallback map
            // We search for ANY page matching the metadata GUID since UI didn't specify target
            debugConsole.log(
              `Discarding update for ${newPage.name} and pointing dependencies to existing...`,
            );

            let targetOldPage: PageNode | null = null;
            const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";
            const allPages = figma.root.children;

            for (const page of allPages) {
              if (page.type !== "PAGE" || page.id === newPage.id) continue;
              const metaJson = page.getPluginData(PAGE_METADATA_KEY);
              if (metaJson) {
                try {
                  const meta = JSON.parse(metaJson);
                  if (meta.id === choice.guid) {
                    targetOldPage = page;
                    break;
                  }
                } catch {
                  // Ignore parse errors
                }
              }
            }

            if (targetOldPage) {
              // 1. Build map of old components
              const oldMap = new Map<string, ComponentNode>();
              const oldComponents = targetOldPage.findAllWithCriteria({
                types: ["COMPONENT"],
              });
              for (const comp of oldComponents) {
                oldMap.set(getComponentKey(comp), comp);
              }

              // 2. We only need to swap instances inside newly IMPORTED pages (since existing pages wouldn't point to the new ⚠️ page yet)
              let swapCount = 0;
              for (const importedChoice of data.componentChoices) {
                if (importedChoice.importedPageId === newPage.id) continue;

                try {
                  const importedPage = (await figma.getNodeByIdAsync(
                    importedChoice.importedPageId,
                  )) as PageNode | null;
                  if (importedPage) {
                    const instances = importedPage.findAllWithCriteria({
                      types: ["INSTANCE"],
                    });
                    for (const instance of instances) {
                      try {
                        const mainComp = await instance.getMainComponentAsync();
                        if (mainComp) {
                          // Is this instance pointing to the new page we're discarding?
                          let isNew = false;
                          let curr: BaseNode | null = mainComp;
                          while (curr) {
                            if (curr.id === newPage.id) {
                              isNew = true;
                              break;
                            }
                            curr = curr.parent;
                          }

                          if (isNew) {
                            const key = getComponentKey(mainComp);
                            const counterpart = oldMap.get(key);
                            if (counterpart) {
                              instance.swapComponent(counterpart);
                              swapCount++;
                            }
                          }
                        }
                      } catch {
                        // ignore
                      }
                    }
                  }
                } catch {
                  // ignore
                }
              }
              debugConsole.log(
                `Re-bound ${swapCount} dependent instances back to old existing component`,
              );
            } else {
              debugConsole.warning(
                `Could not find an existing page for GUID ${choice.guid} to fallback to!`,
              );
            }

            // 3. Delete the newly imported page securely
            try {
              if (figma.currentPage.id === newPage.id) {
                const safePage = allPages.find(
                  (p) => p.type === "PAGE" && p.id !== newPage.id,
                ) as PageNode | undefined;
                if (safePage) figma.currentPage = safePage;
              }
              newPage.remove();
              debugConsole.log(`Deleted discarded update page`);
            } catch (err) {
              debugConsole.warning(`Failed to delete discarded page: ${err}`);
            }
          }
        } catch (err) {
          debugConsole.error(
            `Strategy execution failed for ${choice.name}: ${err}`,
          );
        }
      }
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
        // Check if page has metadata (indicates it's part of an import)
        // OR check if it's in global importResult
        const pageMetadataJson = page.getPluginData(PAGE_METADATA_KEY);
        const hasMetadata = !!pageMetadataJson;

        // Also check global importResult
        const globalImportResultStr = figma.root.getPluginData(
          "RecursicaImportResult",
        );
        let isInImportResult = false;
        if (globalImportResultStr) {
          try {
            const importResults = JSON.parse(globalImportResultStr) as Array<{
              createdPageIds?: string[];
            }>;
            isInImportResult = importResults.some((ir) =>
              ir.createdPageIds?.includes(page.id),
            );
          } catch {
            // Failed to parse, continue
          }
        }

        if (hasMetadata || isInImportResult) {
          // Try to get page metadata to find component name and version
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

    // Rename pages and ensure metadata is set using fresh node references
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

        // Sanitize component name for metadata: keep alphanumeric, spaces, dashes, and underscores
        const sanitizedComponentName = componentName
          .replace(/[^\w\s-]/g, "")
          .trim();

        // IMPORTANT: Always use version from imported component metadata, NOT from existing page metadata.
        // The page metadata version should only be set FROM the imported component, never read from existing page metadata.
        // This prevents the version from being incorrectly incremented during publishing.
        const version = metadata.componentVersion;
        const componentGuid =
          pageInfo.pageMetadata.id || metadata.componentGuid;

        // Ensure page metadata is set/updated
        const pageMetadata = {
          _ver: 1,
          id: componentGuid,
          name: sanitizedComponentName,
          version: version,
          publishDate: new Date().toISOString(),
          history: {},
        };
        page.setPluginData(PAGE_METADATA_KEY, JSON.stringify(pageMetadata));
        debugConsole.log(
          `Set page metadata for "${sanitizedComponentName}": GUID=${componentGuid.substring(0, 8)}..., version=${version}`,
        );

        // Rename to the extracted new name (with icon removed), and trim whitespace to fix orphaned spaces
        const finalName = newName.trim();
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
        debugConsole.log("Cleared primary import metadata from main page");
      } catch (err) {
        debugConsole.warning(
          `Failed to clear primary import metadata: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    // Also clear the global import result to prevent checkForExistingPrimaryImport from finding it
    try {
      figma.root.setPluginData(IMPORT_RESULT_KEY, "");
      debugConsole.log("Cleared global import result");
    } catch (err) {
      debugConsole.warning(
        `Failed to clear global import result: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    for (const pageInfo of importPagesInfo) {
      try {
        // No need to clear UNDER_REVIEW_KEY - we use importResult now
        // Pages are identified by importResult.createdPageIds
        // Page node retrieval not needed for cleanup
      } catch (err) {
        debugConsole.warning(
          `Failed to clear under review metadata for page ${pageInfo.pageId}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    const responseData: MergeImportGroupResponseData = {
      pagesRenamed,
      debugLogs: debugConsole.getLogs(),
    };

    debugConsole.log(
      `=== Merge Complete ===\n  Renamed: ${pagesRenamed} component page(s) and cleared dividers`,
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
