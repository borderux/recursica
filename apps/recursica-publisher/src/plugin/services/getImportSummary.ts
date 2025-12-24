/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import type { NoData } from "./getCurrentUser";
import type { SanitizedPageImportResult } from "./pageImportNew";
import { DIVIDER_PLUGIN_DATA_KEY } from "./singleComponentImportService";

export interface ImportSummaryData {
  pagesCreated: Array<{
    pageId: string;
    pageName: string;
    componentGuid: string;
    componentPage: string;
  }>;
  pagesExisting: Array<{
    pageId: string;
    pageName: string;
    componentGuid: string;
    componentPage: string;
  }>;
  totalVariablesCreated: number;
  totalStylesCreated: number;
}

export interface GetImportSummaryResponseData {
  summary: ImportSummaryData;
}

/**
 * Gets the import summary from global storage
 * Fetches sanitized PageImportResult objects and aggregates them into a summary
 */
export async function getImportSummary(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    const IMPORT_RESULT_KEY = "RecursicaImportResult";
    const globalImportResultStr = figma.root.getPluginData(IMPORT_RESULT_KEY);

    if (!globalImportResultStr) {
      // No import result found - return empty summary
      const emptySummary: ImportSummaryData = {
        pagesCreated: [],
        pagesExisting: [],
        totalVariablesCreated: 0,
        totalStylesCreated: 0,
      };
      return retSuccess("getImportSummary", {
        summary: emptySummary,
      } as Record<string, unknown>);
    }

    const importResults = JSON.parse(
      globalImportResultStr,
    ) as SanitizedPageImportResult[];

    const pagesCreated: Array<{
      pageId: string;
      pageName: string;
      componentGuid: string;
      componentPage: string;
    }> = [];
    const pagesExisting: Array<{
      pageId: string;
      pageName: string;
      componentGuid: string;
      componentPage: string;
    }> = [];

    let totalVariablesCreated = 0;
    let totalStylesCreated = 0;

    // Process each import result
    for (const importResult of importResults) {
      // Count variables and styles created
      if (importResult.createdVariableIds) {
        totalVariablesCreated += importResult.createdVariableIds.length;
      }
      if (importResult.createdStyleIds) {
        totalStylesCreated += importResult.createdStyleIds.length;
      }

      // Get page information
      const createdPageIds = importResult.createdPageIds || [];
      const componentGuid = importResult.componentGuid;
      const componentPage = importResult.componentPage;

      // For each created page ID, try to get the page name
      for (const pageId of createdPageIds) {
        try {
          const page = (await figma.getNodeByIdAsync(
            pageId,
          )) as PageNode | null;
          if (page && page.type === "PAGE") {
            // Skip divider pages
            const dividerType = page.getPluginData(DIVIDER_PLUGIN_DATA_KEY);
            if (dividerType) {
              // This is a divider page, skip it
              continue;
            }
            pagesCreated.push({
              pageId,
              pageName: page.name,
              componentGuid,
              componentPage,
            });
          }
        } catch {
          // Page might not exist, skip
        }
      }

      // Check for existing pages (pages that were imported but not created)
      // We need to check if there are pages that match the component but weren't in createdPageIds
      // This is tricky - we'll need to look at dependentComponents or check all pages
      // For now, we'll focus on created pages only
    }

    // To find existing pages, we need to check pages that match componentGuid but aren't in createdPageIds
    // This requires checking all pages with metadata matching the componentGuid
    const PAGE_METADATA_KEY = "RecursicaPublishedMetadata";
    await figma.loadAllPagesAsync();
    const allPages = figma.root.children.filter(
      (p) => p.type === "PAGE",
    ) as PageNode[];

    const createdPageIdSet = new Set(pagesCreated.map((p) => p.pageId));
    const processedComponentGuids = new Set(
      importResults.map((ir) => ir.componentGuid),
    );

    for (const page of allPages) {
      try {
        const pageMetadataStr = page.getPluginData(PAGE_METADATA_KEY);
        if (pageMetadataStr) {
          const pageMetadata = JSON.parse(pageMetadataStr) as {
            id?: string;
          };
          if (
            pageMetadata.id &&
            processedComponentGuids.has(pageMetadata.id) &&
            !createdPageIdSet.has(page.id)
          ) {
            // This page matches a component GUID but wasn't created (so it existed)
            const matchingImportResult = importResults.find(
              (ir) => ir.componentGuid === pageMetadata.id,
            );
            if (matchingImportResult) {
              pagesExisting.push({
                pageId: page.id,
                pageName: page.name,
                componentGuid: matchingImportResult.componentGuid,
                componentPage: matchingImportResult.componentPage,
              });
            }
          }
        }
      } catch {
        // Invalid metadata, skip
      }
    }

    const summary: ImportSummaryData = {
      pagesCreated,
      pagesExisting,
      totalVariablesCreated,
      totalStylesCreated,
    };

    return retSuccess("getImportSummary", {
      summary,
    } as Record<string, unknown>);
  } catch (error) {
    return retError(
      "getImportSummary",
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}
