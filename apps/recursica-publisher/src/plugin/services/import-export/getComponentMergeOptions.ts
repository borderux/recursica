/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../../types/messages";
import { retSuccess, retError } from "../../utils/response";
import { debugConsole } from "./debugConsole";
import { IMPORT_RESULT_KEY } from "./singleComponentImportService";
import type { SanitizedPageImportResult } from "./pageImportNew";

export interface ComponentMergeOption {
  guid: string;
  name: string;
  importedPageId: string;
  existingVersions: Array<{
    pageId: string;
    name: string;
    version: number;
    instanceCount: number;
  }>;
}

export interface GetComponentMergeOptionsResponseData {
  components: ComponentMergeOption[];
}

export async function getComponentMergeOptions(): Promise<ResponseMessage> {
  try {
    debugConsole.log("Getting component merge options...");
    await figma.loadAllPagesAsync();

    // 1. Get all imported pages from the global import result
    const globalImportResultStr = figma.root.getPluginData(IMPORT_RESULT_KEY);
    if (!globalImportResultStr) {
      return retSuccess("getComponentMergeOptions", { components: [] });
    }

    const importResults = JSON.parse(
      globalImportResultStr,
    ) as SanitizedPageImportResult[];

    // Extract all newly created page IDs across the entire import batch
    const importedPageIds = new Set<string>();
    for (const ir of importResults) {
      if (ir.createdPageIds) {
        for (const id of ir.createdPageIds) {
          importedPageIds.add(id);
        }
      }
    }

    const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";
    const allPages = figma.root.children;
    const mergeOptions: ComponentMergeOption[] = [];

    // Analyze each newly imported page
    for (const pageId of importedPageIds) {
      try {
        const importedPage = (await figma.getNodeByIdAsync(
          pageId,
        )) as PageNode | null;
        if (!importedPage || importedPage.type !== "PAGE") continue;

        const metadataStr = importedPage.getPluginData(PAGE_METADATA_KEY);
        if (!metadataStr) continue;

        const metadata = JSON.parse(metadataStr);
        const guid = metadata.id;
        if (!guid) continue;

        const option: ComponentMergeOption = {
          guid,
          name: importedPage.name, // Usually has ⚠️ prefix
          importedPageId: pageId,
          existingVersions: [],
        };

        // Find all OTHER pages with this exact GUID
        for (const oldPage of allPages) {
          if (oldPage.type !== "PAGE" || importedPageIds.has(oldPage.id)) {
            continue;
          }

          const oldMetadataStr = oldPage.getPluginData(PAGE_METADATA_KEY);
          if (!oldMetadataStr) continue;

          try {
            const oldMetadata = JSON.parse(oldMetadataStr);
            if (oldMetadata.id === guid) {
              // Found an old version! Count its instances across the entire document.
              // We do this by finding all components inside this old page, and seeing how many instances point to them.

              const componentsInOldPage = new Set<string>();
              const findComponents = (node: SceneNode | PageNode) => {
                if (
                  node.type === "COMPONENT" ||
                  node.type === "COMPONENT_SET"
                ) {
                  componentsInOldPage.add(node.id);
                }
                if ("children" in node) {
                  for (const child of node.children) {
                    findComponents(child);
                  }
                }
              };
              findComponents(oldPage);

              let instanceCount = 0;
              if (componentsInOldPage.size > 0) {
                // Warning: This could be slow in massive documents!
                // Warning: This could be slow in massive documents!
                const instances = figma.root.findAllWithCriteria({
                  types: ["INSTANCE"],
                });

                const checkPromises = instances.map(async (n) => {
                  try {
                    const mainComp = await n.getMainComponentAsync();
                    if (mainComp) {
                      if (componentsInOldPage.has(mainComp.id)) return true;
                      if (
                        mainComp.parent &&
                        mainComp.parent.type === "COMPONENT_SET" &&
                        componentsInOldPage.has(mainComp.parent.id)
                      ) {
                        return true;
                      }
                    }
                  } catch {
                    // Ignore errors
                  }
                  return false;
                });

                const results = await Promise.all(checkPromises);
                instanceCount = results.filter((r) => r).length;
              }

              option.existingVersions.push({
                pageId: oldPage.id,
                name: oldPage.name,
                version: oldMetadata.version || 0,
                instanceCount,
              });
            }
          } catch {
            // Ignore parse errors on old pages
          }
        }

        // Only add to merge options if there is actually a conflict (1+ existing versions found)
        // Wait, what if there are no existing versions? We still need to ask the user "Keep" or "Discard" maybe?
        // Actually, if it's completely new, there's no conflict. The user shouldn't be asked to Deprecate it.
        // We'll pass it to UI anyway so the UI knows it was imported (we can just auto-hide it or show it as "New").
        mergeOptions.push(option);
      } catch (err) {
        debugConsole.warning(
          `Failed to process imported page ${pageId} for merge options: ${err}`,
        );
      }
    }

    debugConsole.log(
      `Calculated merge options for ${mergeOptions.length} imported components`,
    );
    return retSuccess("getComponentMergeOptions", { components: mergeOptions });
  } catch (error) {
    console.error("Error computing component merge options:", error);
    return retError(
      "getComponentMergeOptions",
      error instanceof Error ? error : "Unknown error occurred",
    );
  }
}
