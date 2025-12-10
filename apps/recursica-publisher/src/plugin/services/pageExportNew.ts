/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseMessage } from "../types/messages";
import {
  parseBaseNodeProperties,
  type ParserContext,
} from "./parsers/baseNodeParser";
import { parseFrameProperties } from "./parsers/frameParser";
import { parseTextProperties } from "./parsers/textParser";
import { parseVectorProperties } from "./parsers/vectorParser";
import { parseShapeProperties } from "./parsers/shapeParser";
import { parseInstanceProperties } from "./parsers/instanceParser";
import { VariableTable, CollectionTable } from "./parsers/variableTable";
import { InstanceTable } from "./parsers/instanceTable";
import { StringTable } from "./parsers/stringTable";
import { debugConsole } from "./debugConsole";
import { compressJsonData } from "../utils/jsonCompression";
import { requestGuidFromUI } from "../utils/requestGuidFromUI";
import { pluginPrompt } from "../utils/pluginPrompt";
import type { InstanceTableEntry } from "./parsers/instanceTable";
import { getComponentName } from "../utils/getComponentName";

export interface ExportPageData {
  pageIndex: number;
}

export interface ExportPageResponseData {
  filename: string;
  pageData: any; // Parsed JSON object (was jsonData as string)
  pageName: string;
  additionalPages: ExportPageResponseData[];
}

/**
 * Service for page export operations (new implementation with type-specific parsers)
 */

// Function to count total nodes recursively
export function countTotalNodes(node: any): number {
  let count = 1; // Count the current node
  if (node.children && node.children.length > 0) {
    node.children.forEach((child: any) => {
      count += countTotalNodes(child);
    });
  }
  return count;
}

/**
 * Recursively extracts node data using type-specific parsers
 * Only serializes non-default values to reduce JSON size
 */
export async function extractNodeData(
  node: any,
  visited = new WeakSet<any>(),
  context: Partial<ParserContext> = {},
): Promise<any> {
  if (!node || typeof node !== "object") {
    return node;
  }

  // Check node count limit
  const maxNodes = context.maxNodes ?? 10000;
  const currentNodeCount = context.nodeCount ?? 0;
  if (currentNodeCount >= maxNodes) {
    await debugConsole.warning(
      `Maximum node count (${maxNodes}) reached. Export truncated.`,
    );
    return {
      _truncated: true,
      _reason: `Maximum node count (${maxNodes}) reached`,
      _nodeCount: currentNodeCount,
    };
  }

  // Increment node count
  const updatedContext: ParserContext = {
    visited: context.visited ?? new WeakSet(),
    depth: context.depth ?? 0,
    maxDepth: context.maxDepth ?? 100,
    nodeCount: currentNodeCount + 1,
    maxNodes,
    unhandledKeys: new Set<string>(),
    variableTable: context.variableTable!,
    collectionTable: context.collectionTable!,
    instanceTable: context.instanceTable!,
    detachedComponentsHandled: context.detachedComponentsHandled ?? new Set(),
    exportedIds: context.exportedIds ?? new Map<string, string>(),
  };

  // Handle circular references
  if (visited.has(node)) {
    return "[Circular Reference]";
  }

  visited.add(node);
  updatedContext.visited = visited;

  const nodeData: any = {};

  // Parse base properties (common to all nodes)
  const baseProps = await parseBaseNodeProperties(node, updatedContext);
  Object.assign(nodeData, baseProps);

  // Validate ID uniqueness
  if (nodeData.id && updatedContext.exportedIds) {
    const existingName = updatedContext.exportedIds.get(nodeData.id);
    if (existingName !== undefined) {
      const currentNodeName = nodeData.name || "Unnamed";
      if (existingName !== currentNodeName) {
        const errorMessage = `Duplicate ID detected during export: ID "${nodeData.id.substring(0, 8)}..." is used by both "${existingName}" and "${currentNodeName}". Each node must have a unique ID.`;
        await debugConsole.error(errorMessage);
        throw new Error(errorMessage);
      }
      // Same ID and same name - this is the same node being encountered again
      // This shouldn't happen due to visited WeakSet, but log a warning if it does
      await debugConsole.warning(
        `Node "${currentNodeName}" (ID: ${nodeData.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`,
      );
    } else {
      // First time seeing this ID - record it
      updatedContext.exportedIds.set(nodeData.id, nodeData.name || "Unnamed");
    }
  }

  // Parse type-specific properties
  const nodeType = node.type;
  if (nodeType) {
    switch (nodeType) {
      case "FRAME":
      case "COMPONENT": {
        const frameProps = await parseFrameProperties(node, updatedContext);
        Object.assign(nodeData, frameProps);
        break;
      }

      case "INSTANCE": {
        const instanceProps = await parseInstanceProperties(
          node,
          updatedContext,
        );
        Object.assign(nodeData, instanceProps);
        // Instances also have frame properties
        const instanceFrameProps = await parseFrameProperties(
          node,
          updatedContext,
        );
        Object.assign(nodeData, instanceFrameProps);
        break;
      }

      case "TEXT": {
        const textProps = await parseTextProperties(node, updatedContext);
        Object.assign(nodeData, textProps);
        break;
      }

      case "VECTOR":
      case "LINE": {
        const vectorProps = await parseVectorProperties(node, updatedContext);
        Object.assign(nodeData, vectorProps);
        break;
      }

      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const shapeProps = await parseShapeProperties(node, updatedContext);
        Object.assign(nodeData, shapeProps);
        break;
      }

      default:
        // For unknown types, just track that we don't have a parser
        updatedContext.unhandledKeys.add("_unknownType");
        break;
    }
  }

  // After all parsers have run, check for any remaining unhandled keys from the node
  // Get all property names from the node
  const allNodeKeys = Object.getOwnPropertyNames(node);
  const handledKeys = new Set<string>([
    "type",
    "id",
    "name",
    "x",
    "y",
    "width",
    "height",
    "visible",
    "locked",
    "opacity",
    "rotation",
    "blendMode",
    "effects",
    "fills",
    "strokes",
    "strokeWeight",
    "strokeAlign",
    "strokeCap",
    "strokeJoin",
    "dashPattern",
    "boundVariables",
    "children",
    "parent",
    "removed",
    "isAsset",
    "detachedInfo",
    "stuckNodes",
    "attachedConnectors",
    "componentPropertyReferences",
    "componentPropertyDefinitions",
    "variableConsumptionMap",
    "resolvedVariableModes",
    "inferredVariables",
    "constructor",
    "toString",
    "valueOf",
  ]);

  // Add type-specific handled keys
  if (
    nodeType === "FRAME" ||
    nodeType === "COMPONENT" ||
    nodeType === "INSTANCE"
  ) {
    handledKeys.add("layoutMode");
    handledKeys.add("primaryAxisSizingMode");
    handledKeys.add("counterAxisSizingMode");
    handledKeys.add("primaryAxisAlignItems");
    handledKeys.add("counterAxisAlignItems");
    handledKeys.add("paddingLeft");
    handledKeys.add("paddingRight");
    handledKeys.add("paddingTop");
    handledKeys.add("paddingBottom");
    handledKeys.add("itemSpacing");
    handledKeys.add("cornerRadius");
    handledKeys.add("clipsContent");
    handledKeys.add("layoutWrap");
    handledKeys.add("layoutGrow");
  }
  if (nodeType === "TEXT") {
    handledKeys.add("characters");
    handledKeys.add("fontName");
    handledKeys.add("fontSize");
    handledKeys.add("textAlignHorizontal");
    handledKeys.add("textAlignVertical");
    handledKeys.add("letterSpacing");
    handledKeys.add("lineHeight");
    handledKeys.add("textCase");
    handledKeys.add("textDecoration");
    handledKeys.add("textAutoResize");
    handledKeys.add("paragraphSpacing");
    handledKeys.add("paragraphIndent");
    handledKeys.add("listOptions");
  }
  if (nodeType === "VECTOR" || nodeType === "LINE") {
    handledKeys.add("fillGeometry");
    handledKeys.add("strokeGeometry");
  }
  if (
    nodeType === "RECTANGLE" ||
    nodeType === "ELLIPSE" ||
    nodeType === "STAR" ||
    nodeType === "POLYGON"
  ) {
    handledKeys.add("pointCount");
    handledKeys.add("innerRadius");
    handledKeys.add("arcData");
  }
  if (nodeType === "INSTANCE") {
    handledKeys.add("mainComponent");
    handledKeys.add("componentProperties");
  }

  // Find unhandled keys
  for (const key of allNodeKeys) {
    // Skip functions and internal properties
    if (typeof node[key] === "function") {
      continue;
    }
    if (!handledKeys.has(key)) {
      updatedContext.unhandledKeys.add(key);
    }
  }

  // Add unhandled keys to the result
  if (updatedContext.unhandledKeys.size > 0) {
    nodeData._unhandledKeys = Array.from(updatedContext.unhandledKeys).sort();
  }

  // Handle children recursively
  // Skip children for normal instances - they should be resolved from the referenced component, not recreated from structure
  const isNormalInstance =
    nodeData._instanceRef !== undefined &&
    updatedContext.instanceTable &&
    nodeType === "INSTANCE";
  let shouldSkipChildren = false;
  if (isNormalInstance) {
    const instanceEntry = updatedContext.instanceTable.getInstanceByIndex(
      nodeData._instanceRef,
    );
    if (instanceEntry && instanceEntry.instanceType === "normal") {
      shouldSkipChildren = true;
      await debugConsole.log(
        `  Skipping children extraction for normal instance "${nodeData.name || "Unnamed"}" - will be resolved from referenced component`,
      );
    }
  }

  if (!shouldSkipChildren && node.children && Array.isArray(node.children)) {
    const maxDepth = updatedContext.maxDepth;
    if (updatedContext.depth >= maxDepth) {
      // Too deep - just store the count instead of recursing
      nodeData.children = {
        _truncated: true,
        _reason: `Maximum depth (${maxDepth}) reached`,
        _count: node.children.length,
      };
    } else {
      // Check if we've hit the node limit before processing children
      if (updatedContext.nodeCount >= maxNodes) {
        nodeData.children = {
          _truncated: true,
          _reason: `Maximum node count (${maxNodes}) reached`,
          _count: node.children.length,
          _processed: 0,
        };
      } else {
        // Process children with increased depth
        const childContext: Partial<ParserContext> = {
          ...updatedContext,
          depth: updatedContext.depth + 1,
        };
        const processedChildren: any[] = [];
        let truncated = false;
        for (const child of node.children) {
          // Check node count before each child
          if (childContext.nodeCount! >= maxNodes) {
            nodeData.children = {
              _truncated: true,
              _reason: `Maximum node count (${maxNodes}) reached during children processing`,
              _processed: processedChildren.length,
              _total: node.children.length,
              children: processedChildren,
            };
            truncated = true;
            break;
          }
          const childData = await extractNodeData(child, visited, childContext);
          processedChildren.push(childData);
          // Update context node count from child processing
          if (childContext.nodeCount) {
            updatedContext.nodeCount = childContext.nodeCount;
          }
        }
        if (!truncated) {
          nodeData.children = processedChildren;
        }
      }
    }
  }

  return nodeData;
}

export async function exportPage(
  data: ExportPageData,
  processedPages: Set<string> = new Set(),
  isRecursive: boolean = false,
): Promise<ResponseMessage> {
  // Clear debug console only on initial call, not recursive calls
  if (!isRecursive) {
    await debugConsole.clear();
    await debugConsole.log("=== Starting Page Export ===");
  }

  try {
    const pageIndex = data.pageIndex;

    if (pageIndex === undefined || typeof pageIndex !== "number") {
      await debugConsole.error(
        "Invalid page selection: pageIndex is undefined or not a number",
      );
      return {
        type: "exportPage",
        success: false,
        error: true,
        message: "Invalid page selection",
        data: {},
      };
    }

    await debugConsole.log(`Loading all pages...`);
    await figma.loadAllPagesAsync();
    const pages = figma.root.children;
    await debugConsole.log(`Loaded ${pages.length} page(s)`);

    if (pageIndex < 0 || pageIndex >= pages.length) {
      await debugConsole.error(
        `Invalid page index: ${pageIndex} (valid range: 0-${pages.length - 1})`,
      );
      return {
        type: "exportPage",
        success: false,
        error: true,
        message: "Invalid page selection",
        data: {},
      };
    }

    const selectedPage = pages[pageIndex];
    const selectedPageId = selectedPage.id;

    // Check if this page has already been processed
    if (processedPages.has(selectedPageId)) {
      await debugConsole.log(
        `Page "${selectedPage.name}" has already been processed, skipping...`,
      );
      // Return empty response for already processed pages
      return {
        type: "exportPage",
        success: false,
        error: true,
        message: "Page already processed",
        data: {},
      };
    }

    // Mark this page as processed
    processedPages.add(selectedPageId);

    await debugConsole.log(
      `Selected page: "${selectedPage.name}" (index: ${pageIndex})`,
    );

    // Create variable table, collection table, and instance table for storing unique references
    await debugConsole.log(
      "Initializing variable, collection, and instance tables...",
    );
    const variableTable = new VariableTable();
    const collectionTable = new CollectionTable();
    const instanceTable = new InstanceTable();

    // Extract complete page data with limits to prevent hanging
    await debugConsole.log("Extracting node data from page...");
    await debugConsole.log(
      `Starting recursive node extraction (max nodes: 10000)...`,
    );
    await debugConsole.log(
      "Collections will be discovered as variables are processed:",
    );
    const extractedPageData = await extractNodeData(
      selectedPage as any,
      new WeakSet(),
      {
        variableTable,
        collectionTable,
        instanceTable,
      },
    );
    await debugConsole.log("Node extraction finished");

    const totalNodes = countTotalNodes(extractedPageData);
    const totalVariables = variableTable.getSize();
    const totalCollections = collectionTable.getSize();

    const totalInstances = instanceTable.getSize();
    await debugConsole.log(`Extraction complete:`);
    await debugConsole.log(`  - Total nodes: ${totalNodes}`);
    await debugConsole.log(`  - Unique variables: ${totalVariables}`);
    await debugConsole.log(`  - Unique collections: ${totalCollections}`);
    await debugConsole.log(`  - Unique instances: ${totalInstances}`);

    if (totalCollections > 0) {
      await debugConsole.log("Collections found:");
      const collections = collectionTable.getTable();
      for (const [idx, entry] of Object.values(collections).entries()) {
        const guidInfo = entry.collectionGuid
          ? ` (GUID: ${entry.collectionGuid.substring(0, 8)}...)`
          : "";
        await debugConsole.log(
          `  ${idx}: ${entry.collectionName}${guidInfo} - ${entry.modes.length} mode(s)`,
        );
      }
    }

    // Handle referenced normal component pages
    await debugConsole.log("Checking for referenced component pages...");
    const additionalPages: ExportPageResponseData[] = [];
    const instanceTableEntries = instanceTable.getSerializedTable();
    const normalInstances = Object.values(instanceTableEntries).filter(
      (entry): entry is InstanceTableEntry => entry.instanceType === "normal",
    );

    if (normalInstances.length > 0) {
      await debugConsole.log(
        `Found ${normalInstances.length} normal instance(s) to check`,
      );

      // Get unique referenced pages (only those not already processed)
      // Use page ID as key to ensure uniqueness, not page name
      const referencedPages = new Map<string, any>(); // page ID -> page node
      for (const entry of normalInstances) {
        if (entry.componentPageName) {
          const page = pages.find((p) => p.name === entry.componentPageName);
          if (page && !processedPages.has(page.id)) {
            // Only add if not already in the map (by ID) and not already processed
            if (!referencedPages.has(page.id)) {
              referencedPages.set(page.id, page);
            }
          } else if (!page) {
            // Page not found - hard failure
            const errorMessage = `Normal instance references component "${entry.componentName || "(unnamed)"}" on page "${entry.componentPageName}", but that page was not found. Cannot export.`;
            await debugConsole.error(errorMessage);
            throw new Error(errorMessage);
          }
        } else {
          // componentPageName is missing - hard failure
          const errorMessage = `Normal instance references component "${entry.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          await debugConsole.error(errorMessage);
          throw new Error(errorMessage);
        }
      }

      await debugConsole.log(
        `Found ${referencedPages.size} unique referenced page(s)`,
      );

      // Process each referenced page
      for (const [pageId, referencedPage] of referencedPages.entries()) {
        const pageName = referencedPage.name;

        // Double-check that this page hasn't been processed (shouldn't happen, but safety check)
        if (processedPages.has(pageId)) {
          await debugConsole.log(`Skipping "${pageName}" - already processed`);
          continue;
        }
        // Check if page has metadata
        const pageMetadataStr = referencedPage.getPluginData(
          "RecursicaPublishedMetadata",
        );
        let hasMetadata = false;
        if (pageMetadataStr) {
          try {
            const pageMetadata = JSON.parse(pageMetadataStr);
            hasMetadata = !!(
              pageMetadata.id && pageMetadata.version !== undefined
            );
          } catch {
            // Invalid metadata, treat as no metadata
          }
        }

        // Prompt user
        const message = `Do you want to also publish referenced component "${pageName}"?`;
        try {
          await pluginPrompt.prompt(message, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 300000, // 5 minutes
          });

          // User said Yes - export the referenced page
          await debugConsole.log(`Exporting referenced page: "${pageName}"`);
          const referencedPageIndex = pages.findIndex(
            (p) => p.id === referencedPage.id,
          );
          if (referencedPageIndex === -1) {
            await debugConsole.error(
              `Could not find page index for "${pageName}"`,
            );
            throw new Error(`Could not find page index for "${pageName}"`);
          }

          // Recursively export the referenced page (pass along processedPages set)
          const referencedExportResponse = await exportPage(
            {
              pageIndex: referencedPageIndex,
            },
            processedPages, // Pass the same set to track all processed pages
            true, // Mark as recursive call
          );

          if (
            referencedExportResponse.success &&
            referencedExportResponse.data
          ) {
            const referencedExportData =
              referencedExportResponse.data as unknown as ExportPageResponseData;
            additionalPages.push(referencedExportData);
            await debugConsole.log(
              `Successfully exported referenced page: "${pageName}"`,
            );
          } else {
            throw new Error(
              `Failed to export referenced page "${pageName}": ${referencedExportResponse.message}`,
            );
          }
        } catch (error) {
          // User said No or prompt was cancelled
          if (error instanceof Error && error.message === "User cancelled") {
            if (!hasMetadata) {
              // No metadata and user said No - cancel export
              await debugConsole.error(
                `Export cancelled: Referenced page "${pageName}" has no metadata and user declined to publish it.`,
              );
              throw new Error(
                `Cannot continue export: Referenced component "${pageName}" has no metadata. Please publish it first or choose to publish it now.`,
              );
            } else {
              // Has metadata, user said No - continue with existing metadata
              await debugConsole.log(
                `User declined to publish "${pageName}", but page has existing metadata. Continuing with existing metadata.`,
              );
            }
          } else {
            // Some other error occurred
            throw error;
          }
        }
      }
    }

    // Create string table for compression
    await debugConsole.log("Creating string table...");
    const stringTable = new StringTable();

    // Get or generate page metadata (GUID and version)
    await debugConsole.log("Getting page metadata...");
    const pageMetadataStr = selectedPage.getPluginData(
      "RecursicaPublishedMetadata",
    );
    let pageGuid = "";
    let pageVersion = 0;

    if (pageMetadataStr) {
      try {
        const pageMetadata = JSON.parse(pageMetadataStr);
        pageGuid = pageMetadata.id || "";
        pageVersion = pageMetadata.version || 0;
      } catch {
        await debugConsole.warning(
          "Failed to parse page metadata, generating new GUID",
        );
      }
    }

    // If no GUID exists, generate one and store it
    if (!pageGuid) {
      await debugConsole.log("Generating new GUID for page...");
      pageGuid = await requestGuidFromUI();
      // Store the GUID in page metadata (create minimal metadata if it doesn't exist)
      const newMetadata = {
        _ver: 1,
        id: pageGuid,
        name: selectedPage.name,
        version: pageVersion,
        publishDate: new Date().toISOString(),
        history: {},
      };
      selectedPage.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(newMetadata),
      );
    }

    // Create export data with metadata, collections table, variable table, instance table, and page data
    // All data uses full key names at this point
    await debugConsole.log("Creating export data structure...");
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: pageGuid,
        version: pageVersion,
        name: selectedPage.name,
        pluginVersion: "1.0.0",
      },
      stringTable: stringTable.getSerializedTable(),
      collections: collectionTable.getSerializedTable(),
      variables: variableTable.getSerializedTable(),
      instances: instanceTable.getSerializedTable(),
      pageData: extractedPageData,
    };

    // Compress the entire JSON at the very last stage
    await debugConsole.log("Compressing JSON data...");
    const compressedExportData = compressJsonData(exportData, stringTable);

    await debugConsole.log("Serializing to JSON...");
    const jsonString = JSON.stringify(compressedExportData, null, 2);
    const jsonSizeKB = (jsonString.length / 1024).toFixed(2);
    // Clean component name and create filename
    const cleanedName = getComponentName(selectedPage.name).trim();
    const filename = cleanedName.replace(/\s+/g, "_") + ".figma.json";

    await debugConsole.log(`JSON serialization complete: ${jsonSizeKB} KB`);
    await debugConsole.log(`Export file: ${filename}`);
    await debugConsole.log("=== Export Complete ===");

    // Parse the JSON string back to object for easier manipulation
    const parsedPageData = JSON.parse(jsonString);

    const responseData: ExportPageResponseData = {
      filename,
      pageData: parsedPageData,
      pageName: selectedPage.name,
      additionalPages, // Populated with referenced component pages
    };

    return {
      type: "exportPage",
      success: true,
      error: false,
      message: "Page exported successfully",
      data: responseData as any,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", error);
    console.error("Error message:", errorMessage);
    await debugConsole.error(`Export failed: ${errorMessage}`);
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack);
      await debugConsole.error(`Stack trace: ${error.stack}`);
    }
    const errorResponse = {
      type: "exportPage" as const,
      success: false,
      error: true,
      message: errorMessage,
      data: {},
    };
    console.error("Returning error response:", errorResponse);
    return errorResponse;
  }
}
