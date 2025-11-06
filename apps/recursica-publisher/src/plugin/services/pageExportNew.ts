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
import { debugConsole } from "./debugConsole";

export interface ExportPageData {
  pageIndex: number;
}

export interface ExportPageResponseData {
  filename: string;
  jsonData: string;
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
  if (node.children && Array.isArray(node.children)) {
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
): Promise<ResponseMessage> {
  // Clear debug console at the start
  await debugConsole.clear();
  await debugConsole.log("=== Starting Page Export ===");

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
    await debugConsole.log(
      `Selected page: "${selectedPage.name}" (index: ${pageIndex})`,
    );

    // Create variable table and collection table for storing unique variables and collections
    await debugConsole.log("Initializing variable and collection tables...");
    const variableTable = new VariableTable();
    const collectionTable = new CollectionTable();

    // Get available library variable collections
    await debugConsole.log("Fetching team library variable collections...");
    let libraries: any[] = [];
    try {
      const libraryCollections =
        await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      // Transform to include only the information we need
      libraries = libraryCollections.map((library) => ({
        libraryName: library.libraryName,
        key: library.key,
        name: library.name,
      }));
      await debugConsole.log(
        `Found ${libraries.length} library collection(s) in team library`,
      );
      if (libraries.length > 0) {
        for (const lib of libraries) {
          await debugConsole.log(`  - ${lib.name} (from ${lib.libraryName})`);
        }
      }
    } catch (error) {
      await debugConsole.warning(
        `Could not get library variable collections: ${error instanceof Error ? error.message : String(error)}`,
      );
      // Continue without library info if it fails
    }

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
      },
    );
    await debugConsole.log("Node extraction finished");

    const totalNodes = countTotalNodes(extractedPageData);
    const totalVariables = variableTable.getSize();
    const totalCollections = collectionTable.getSize();

    await debugConsole.log(`Extraction complete:`);
    await debugConsole.log(`  - Total nodes: ${totalNodes}`);
    await debugConsole.log(`  - Unique variables: ${totalVariables}`);
    await debugConsole.log(`  - Unique collections: ${totalCollections}`);

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

    // Create export data with metadata, collections table, variable table, libraries, and page data
    await debugConsole.log("Creating export data structure...");
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportFormatVersion: "2.5.0", // Updated version for collection GUID system and serialized collection table
        figmaApiVersion: figma.apiVersion,
        originalPageName: selectedPage.name,
        totalNodes: totalNodes,
        pluginVersion: "1.0.0",
      },
      collections: collectionTable.getSerializedTable(),
      variables: variableTable.getSerializedTable(),
      libraries: libraries,
      pageData: extractedPageData,
    };

    await debugConsole.log("Serializing to JSON...");
    const jsonString = JSON.stringify(exportData, null, 2);
    const jsonSizeKB = (jsonString.length / 1024).toFixed(2);
    const filename =
      selectedPage.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";

    await debugConsole.log(`JSON serialization complete: ${jsonSizeKB} KB`);
    await debugConsole.log(`Export file: ${filename}`);
    await debugConsole.log("=== Export Complete ===");

    const responseData: ExportPageResponseData = {
      filename,
      jsonData: jsonString,
      pageName: selectedPage.name,
      additionalPages: [], // Will be populated when publishing referenced component pages
    };

    return {
      type: "exportPage",
      success: true,
      error: false,
      message: "Page exported successfully",
      data: responseData as any,
    };
  } catch (error) {
    await debugConsole.error(
      `Export failed: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
    );
    if (error instanceof Error && error.stack) {
      await debugConsole.error(`Stack trace: ${error.stack}`);
    }
    console.error("Error exporting page:", error);
    return {
      type: "exportPage",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
