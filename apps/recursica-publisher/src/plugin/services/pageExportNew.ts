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
import { StyleTable } from "./parsers/styleTable";
import { ImageTable } from "./parsers/imageTable";
import { StringTable } from "./parsers/stringTable";
import { debugConsole } from "./debugConsole";
import { checkCancellation } from "../utils/cancellation";
import { compressJsonData } from "../utils/jsonCompression";
import { requestGuidFromUI } from "../utils/requestGuidFromUI";
import { pluginPrompt } from "../utils/pluginPrompt";
import type { InstanceTableEntry } from "./parsers/instanceTable";
import { getComponentName } from "../utils/getComponentName";

export interface ExportPageData {
  pageIndex: number;
  skipPrompts?: boolean; // If true, automatically include all referenced pages without prompting
  validateOnly?: boolean; // If true, only extract instances, collections, and variables for validation (no full export)
  clearConsole?: boolean; // If false, don't clear the console (default: true for initial exports, false for referenced pages)
}

export interface ReferencedPageInfo {
  pageId: string;
  pageName: string;
  pageIndex: number;
  hasMetadata: boolean;
  componentName?: string;
  localVersion?: number; // Version number from local page metadata (0 if no metadata)
}

export interface ValidationError {
  type: "externalReference" | "unknownCollection";
  message: string;
  componentName?: string;
  collectionName?: string;
  pageName: string;
}

export interface ValidationResult {
  hasErrors: boolean;
  errors: ValidationError[];
  externalReferences: Array<{
    componentName: string;
    pageName: string;
  }>;
  unknownCollections: Array<{
    collectionName: string;
    collectionId: string;
    pageName: string;
  }>;
  discoveredCollections: string[]; // Collection names discovered during validation
}

export interface ExportPageResponseData {
  filename: string;
  pageData: any; // Parsed JSON object (was jsonData as string)
  pageName: string;
  additionalPages: ExportPageResponseData[]; // Referenced pages exported along with main page (for wizard)
  discoveredReferencedPages?: ReferencedPageInfo[]; // Referenced pages discovered but not yet exported
  validationResult?: ValidationResult; // Validation results if validateOnly was true
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

// Function to count nodes with constraints exported
function countNodesWithConstraints(node: any): number {
  let count = 0;
  // Check if this node has constraints exported (using string table abbreviations)
  if (node.cnsHr !== undefined || node.cnsVr !== undefined) {
    count = 1;
  }
  // Also check for full property names (in case string table wasn't applied)
  if (
    node.constraintHorizontal !== undefined ||
    node.constraintVertical !== undefined
  ) {
    if (count === 0) count = 1;
  }
  // Recursively count children
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child && typeof child === "object") {
        count += countNodesWithConstraints(child);
      }
    }
  }
  return count;
}

/**
 * Lightweight function to extract only instances from a page (for discovery mode)
 * Traverses the page tree and only processes INSTANCE nodes to build the instance table
 * Much faster than full extraction since it skips all other node types
 */
async function extractInstancesOnly(
  node: any,
  instanceTable: InstanceTable,
  visited: WeakSet<any> = new WeakSet(),
): Promise<void> {
  if (!node || typeof node !== "object") {
    return;
  }

  // Handle circular references
  if (visited.has(node)) {
    return;
  }
  visited.add(node);

  // If this is an INSTANCE node, parse it to add to instance table
  if (node.type === "INSTANCE") {
    const context: Partial<ParserContext> = {
      visited: new WeakSet(),
      depth: 0,
      maxDepth: 100,
      nodeCount: 0,
      maxNodes: 10000,
      unhandledKeys: new Set<string>(),
      variableTable: new VariableTable(), // Not used, but required by parser
      collectionTable: new CollectionTable(), // Not used, but required by parser
      instanceTable: instanceTable, // This is what we're building
      styleTable: new StyleTable(), // Not used, but required by parser
      imageTable: new ImageTable(), // Not used, but required by parser
      detachedComponentsHandled: new Set(),
      exportedIds: new Map<string, string>(),
    };

    // Parse instance properties to add to instance table
    await parseInstanceProperties(node, context as ParserContext);
  }

  // Recursively process children
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      await extractInstancesOnly(child, instanceTable, visited);
    }
  }
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
    debugConsole.warning(
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
    styleTable: context.styleTable!,
    imageTable: context.imageTable!,
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

  // Note: ID uniqueness is now ensured in parseBaseNodeProperties()
  // No additional validation needed here since parseBaseNodeProperties handles uniqueness

  // Parse type-specific properties
  const nodeType = node.type;
  if (nodeType) {
    switch (nodeType) {
      case "FRAME":
      case "COMPONENT":
      case "COMPONENT_SET": {
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
    nodeType === "COMPONENT_SET" ||
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
    handledKeys.add("counterAxisSpacing");
    handledKeys.add("cornerRadius");
    handledKeys.add("clipsContent");
    handledKeys.add("layoutWrap");
    handledKeys.add("layoutGrow");
    handledKeys.add("layoutSizingHorizontal");
    handledKeys.add("layoutSizingVertical");
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
  // Note: Instances can have children with overrides (e.g., bound variables on child nodes)
  // We need to export these children to capture the overrides, even for normal instances
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
  processedPages: Set<string> = new Set(),
  isRecursive: boolean = false,
  discoveredPages: Set<string> = new Set(), // Track discovered pages to avoid infinite loops during discovery
  requestId?: string, // Optional request ID for cancellation support
): Promise<ResponseMessage> {
  // Check for cancellation at the start
  checkCancellation(requestId);
  // Clear debug console only on initial call, not recursive calls
  // Also respect clearConsole parameter if provided
  const shouldClearConsole = data.clearConsole !== false && !isRecursive;
  if (shouldClearConsole) {
    debugConsole.clear();
    debugConsole.log("=== Starting Page Export ===");
  } else if (!isRecursive) {
    // Don't clear, but still log the start
    debugConsole.log("=== Starting Page Export ===");
  }

  try {
    const pageIndex = data.pageIndex;

    if (pageIndex === undefined || typeof pageIndex !== "number") {
      debugConsole.error(
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

    checkCancellation(requestId);
    debugConsole.log(`Loading all pages...`);
    await figma.loadAllPagesAsync();
    checkCancellation(requestId);
    const pages = figma.root.children;
    debugConsole.log(`Loaded ${pages.length} page(s)`);

    if (pageIndex < 0 || pageIndex >= pages.length) {
      debugConsole.error(
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

    // Check if this page has already been processed (for actual exports)
    // or discovered (for discovery phase when skipPrompts is true)
    if (data.skipPrompts) {
      // During discovery phase, use discoveredPages set to avoid infinite loops
      if (discoveredPages.has(selectedPageId)) {
        debugConsole.log(
          `Page "${selectedPage.name}" already discovered, skipping discovery...`,
        );
        // Return empty response but with any discovered pages we might have
        return {
          type: "exportPage",
          success: true,
          error: false,
          message: "Page already discovered",
          data: {
            filename: "",
            pageData: {},
            pageName: selectedPage.name,
            additionalPages: [],
            discoveredReferencedPages: [],
          } as unknown as Record<string, unknown>,
        };
      }
      // Mark as discovered (not processed, since we're not exporting)
      discoveredPages.add(selectedPageId);
    } else {
      // During actual export, use processedPages set
      if (processedPages.has(selectedPageId)) {
        debugConsole.log(
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
      // Mark this page as processed (actually exported)
      processedPages.add(selectedPageId);
    }

    debugConsole.log(
      `Selected page: "${selectedPage.name}" (index: ${pageIndex})`,
    );

    // Create variable table, collection table, instance table, style table, and image table for storing unique references
    debugConsole.log(
      "Initializing variable, collection, instance, style, and image tables...",
    );
    let variableTable = new VariableTable();
    let collectionTable = new CollectionTable();
    let instanceTable = new InstanceTable();
    let styleTable = new StyleTable();
    let imageTable = new ImageTable();

    let extractedPageData: any;

    // If skipPrompts is true and this is the initial call (not recursive), do lightweight discovery
    // Only extract instances to find referenced pages, skip full node extraction
    if (data.skipPrompts && !isRecursive) {
      debugConsole.log(
        "=== Discovery Mode: Extracting instances only (lightweight) ===",
      );
      debugConsole.log("Traversing page to find instance references...");

      // Only extract instances - much faster than full extraction
      await extractInstancesOnly(selectedPage as any, instanceTable);
      checkCancellation(requestId);

      debugConsole.log("Instance extraction finished");
      // Create minimal page data structure for discovery mode
      extractedPageData = {
        type: "PAGE",
        name: selectedPage.name,
        id: selectedPage.id,
        children: [], // Empty - we don't need the full structure for discovery
      };
    } else {
      // Full extraction mode (for actual exports or recursive calls)
      debugConsole.log("Extracting node data from page...");
      debugConsole.log(
        `Starting recursive node extraction (max nodes: 10000)...`,
      );
      debugConsole.log(
        "Collections will be discovered as variables are processed:",
      );
      const exportedIds = new Map<string, string>();
      debugConsole.log(
        `[EXPORT] Starting ID uniqueness tracking (initial map size: ${exportedIds.size})`,
      );

      extractedPageData = await extractNodeData(
        selectedPage as any,
        new WeakSet(),
        {
          variableTable,
          collectionTable,
          instanceTable,
          styleTable,
          imageTable,
          exportedIds,
        },
      );

      debugConsole.log(
        `[EXPORT] Finished ID uniqueness tracking (final map size: ${exportedIds.size})`,
      );
      checkCancellation(requestId);
      debugConsole.log("Node extraction finished");
    }

    // Count and log extraction stats
    let totalNodes = 0;
    let totalVariables = 0;
    let totalCollections = 0;
    let totalInstances = 0;
    let nodesWithConstraints = 0;

    if (!(data.skipPrompts && !isRecursive)) {
      // Full extraction mode - calculate all stats
      totalNodes = countTotalNodes(extractedPageData);
      totalVariables = variableTable.getSize();
      totalCollections = collectionTable.getSize();
      totalInstances = instanceTable.getSize();
      nodesWithConstraints = countNodesWithConstraints(extractedPageData);
      debugConsole.log(`Extraction complete:`);
      debugConsole.log(`  - Total nodes: ${totalNodes}`);
      debugConsole.log(`  - Unique variables: ${totalVariables}`);
      debugConsole.log(`  - Unique collections: ${totalCollections}`);
      debugConsole.log(`  - Unique instances: ${totalInstances}`);
      debugConsole.log(
        `  - Nodes with constraints exported: ${nodesWithConstraints}`,
      );
    } else {
      // Discovery mode - only log instance count
      totalInstances = instanceTable.getSize();
      debugConsole.log(`Discovery complete:`);
      debugConsole.log(`  - Unique instances found: ${totalInstances}`);
    }

    // Check for remote instances - not supported during publishing
    const instanceTableEntries = instanceTable.getSerializedTable();

    // Create a map of instance index to entry for remote instances
    const remoteInstanceMap = new Map<number, InstanceTableEntry>();
    for (const [indexStr, entry] of Object.entries(instanceTableEntries)) {
      if (entry.instanceType === "remote") {
        const index = parseInt(indexStr, 10);
        remoteInstanceMap.set(index, entry);
      }
    }

    // If validateOnly mode, perform validation and return early
    if (data.validateOnly) {
      debugConsole.log("=== Validation Mode ===");

      // Get known collections (local collections + standard remote collections)
      const localCollections =
        await figma.variables.getLocalVariableCollectionsAsync();
      const knownCollectionIds = new Set<string>();
      const knownCollectionNames = new Set<string>();

      // Add all local collections
      for (const collection of localCollections) {
        knownCollectionIds.add(collection.id);
        knownCollectionNames.add(collection.name);
      }

      // Add standard remote collection names (case-sensitive)
      knownCollectionNames.add("Token");
      knownCollectionNames.add("Tokens");
      knownCollectionNames.add("Theme");
      knownCollectionNames.add("Themes");

      // Check for external references (remote instances)
      const externalReferences: Array<{
        componentName: string;
        pageName: string;
      }> = [];
      const validationErrors: ValidationError[] = [];

      for (const entry of remoteInstanceMap.values()) {
        const componentName = entry.componentName || "(unnamed)";
        externalReferences.push({
          componentName,
          pageName: selectedPage.name,
        });
        validationErrors.push({
          type: "externalReference",
          message: `External reference found: "${componentName}" references a component from another file`,
          componentName,
          pageName: selectedPage.name,
        });
      }

      // Check for unknown collections
      const unknownCollections: Array<{
        collectionName: string;
        collectionId: string;
        pageName: string;
      }> = [];
      const collections = collectionTable.getTable();

      for (const entry of Object.values(collections)) {
        // Local collections are always known (they're in knownCollectionIds)
        if (entry.isLocal) {
          if (!knownCollectionIds.has(entry.collectionId)) {
            // This shouldn't happen, but check anyway
            unknownCollections.push({
              collectionName: entry.collectionName,
              collectionId: entry.collectionId,
              pageName: selectedPage.name,
            });
            validationErrors.push({
              type: "unknownCollection",
              message: `Unknown local collection: "${entry.collectionName}"`,
              collectionName: entry.collectionName,
              pageName: selectedPage.name,
            });
          }
        } else {
          // Remote/team-bound collections must have specific names
          if (!knownCollectionNames.has(entry.collectionName)) {
            unknownCollections.push({
              collectionName: entry.collectionName,
              collectionId: entry.collectionId,
              pageName: selectedPage.name,
            });
            validationErrors.push({
              type: "unknownCollection",
              message: `Unknown remote collection: "${entry.collectionName}". Remote collections must be named "Token", "Tokens", "Theme", or "Themes"`,
              collectionName: entry.collectionName,
              pageName: selectedPage.name,
            });
          }
        }
      }

      // Get discovered collection names
      const discoveredCollections = Object.values(collections).map(
        (entry) => entry.collectionName,
      );

      const validationResult: ValidationResult = {
        hasErrors: validationErrors.length > 0,
        errors: validationErrors,
        externalReferences,
        unknownCollections,
        discoveredCollections,
      };

      debugConsole.log(`Validation complete:`);
      debugConsole.log(`  - External references: ${externalReferences.length}`);
      debugConsole.log(`  - Unknown collections: ${unknownCollections.length}`);
      debugConsole.log(`  - Has errors: ${validationResult.hasErrors}`);

      return {
        type: "exportPage",
        success: true,
        error: false,
        message: "Validation complete",
        data: {
          filename: "",
          pageData: {},
          pageName: selectedPage.name,
          additionalPages: [],
          validationResult,
        } as unknown as Record<string, unknown>,
      };
    }

    if (remoteInstanceMap.size > 0) {
      debugConsole.error(
        `Found ${remoteInstanceMap.size} remote instance(s) - remote instances are not supported during publishing`,
      );

      // Helper function to find all locations where a remote instance is used in the page
      // Note: extractedPageData is the page node itself, so we need to search its children
      const findInstanceLocations = (
        node: any,
        targetInstanceIndex: number,
        currentPath: string[] = [],
        isPageNode: boolean = false,
      ): Array<{ path: string[]; nodeName: string }> => {
        const locations: Array<{ path: string[]; nodeName: string }> = [];

        if (!node || typeof node !== "object") {
          return locations;
        }

        // Skip the page node itself - start from its children
        // The page node type should be "PAGE" or we can check if it's the root
        if (isPageNode || node.type === "PAGE") {
          const children = node.children || node.child;
          if (Array.isArray(children)) {
            for (const child of children) {
              if (child && typeof child === "object") {
                locations.push(
                  ...findInstanceLocations(
                    child,
                    targetInstanceIndex,
                    [],
                    false,
                  ),
                );
              }
            }
          }
          return locations;
        }

        // Get the node name for this level
        const nodeName = node.name || "";

        // Check if this node is an instance reference to our target
        if (
          typeof node._instanceRef === "number" &&
          node._instanceRef === targetInstanceIndex
        ) {
          // Found the instance - currentPath is the path to the parent, nodeName is the instance
          const instanceName = nodeName || "(unnamed)";
          const fullPath =
            currentPath.length > 0
              ? [...currentPath, instanceName]
              : [instanceName];
          locations.push({
            path: fullPath,
            nodeName: instanceName,
          });
          // Don't recurse into instance children - the instance is the target, not its structure
          return locations;
        }

        // Build path for children: include this node's name if it exists
        const childPath = nodeName ? [...currentPath, nodeName] : currentPath;

        // Recursively search children (only if this isn't an instance)
        const children = node.children || node.child;
        if (Array.isArray(children)) {
          for (const child of children) {
            if (child && typeof child === "object") {
              locations.push(
                ...findInstanceLocations(
                  child,
                  targetInstanceIndex,
                  childPath,
                  false,
                ),
              );
            }
          }
        }

        return locations;
      };

      // Build detailed error message with component names and instance locations
      const remoteInstanceDetails: string[] = [];
      let detailIndex = 1;
      for (const [instanceIndex, entry] of remoteInstanceMap.entries()) {
        const componentName = entry.componentName || "(unnamed)";
        const componentSetName = entry.componentSetName;

        // Find where this instance is used in the page
        // Start from the page node (extractedPageData is the page itself)
        const locations = findInstanceLocations(
          extractedPageData,
          instanceIndex,
          [],
          true,
        );

        let locationInfo = "";
        if (locations.length > 0) {
          const locationStrings = locations.map((loc) => {
            const pathStr =
              loc.path.length > 0 ? loc.path.join(" → ") : "page root";
            return `"${loc.nodeName}" at ${pathStr}`;
          });
          locationInfo = `\n   Location(s): ${locationStrings.join(", ")}`;
        } else {
          locationInfo =
            "\n   Location: (unable to determine - instance may be deeply nested)";
        }

        // Include component set name if it's a variant
        const componentInfo = componentSetName
          ? `Component: "${componentName}" (from component set "${componentSetName}")`
          : `Component: "${componentName}"`;

        // Include library info if available
        const libraryInfo = entry.remoteLibraryName
          ? `\n   Library: ${entry.remoteLibraryName}`
          : "";

        remoteInstanceDetails.push(
          `${detailIndex}. ${componentInfo}${libraryInfo}${locationInfo}`,
        );
        detailIndex++;
      }

      const errorMessage = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.\n\nFound ${remoteInstanceMap.size} remote instance(s):\n${remoteInstanceDetails.join("\n\n")}\n\nTo fix this:\n1. Locate each remote instance component listed above using the path(s) shown\n2. Replace it with a local component or remove it\n3. Try publishing again`;

      debugConsole.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (totalCollections > 0) {
      debugConsole.log("Collections found:");
      const collections = collectionTable.getTable();
      for (const [idx, entry] of Object.values(collections).entries()) {
        const guidInfo = entry.collectionGuid
          ? ` (GUID: ${entry.collectionGuid.substring(0, 8)}...)`
          : "";
        debugConsole.log(
          `  ${idx}: ${entry.collectionName}${guidInfo} - ${entry.modes.length} mode(s)`,
        );
      }
    }

    // If skipPrompts is true (discovery mode), skip validation during discovery
    // Validation will be done during full export after user selects pages
    let aggregatedValidationResult: ValidationResult | undefined;
    if (data.skipPrompts && !isRecursive) {
      debugConsole.log(
        "Discovery mode: Skipping validation (will be done during full export)",
      );
      // Don't run validation during discovery - it's expensive and not needed
      // Validation will happen during the full export phase
    } else if (data.skipPrompts && isRecursive) {
      // During recursive discovery, we still want to find referenced pages
      // but we don't need validation here either
      debugConsole.log("Recursive discovery: Finding referenced pages only");
    }

    // Handle referenced normal component pages
    debugConsole.log("Checking for referenced component pages...");
    const additionalPages: ExportPageResponseData[] = [];
    // Collect discovered referenced pages info (for wizard to ask user)
    const discoveredReferencedPages: ReferencedPageInfo[] = [];
    const normalInstances = Object.values(instanceTableEntries).filter(
      (entry): entry is InstanceTableEntry => entry.instanceType === "normal",
    );

    if (normalInstances.length > 0) {
      debugConsole.log(
        `Found ${normalInstances.length} normal instance(s) to check`,
      );

      // Debug: Log all available pages
      debugConsole.log(
        `Available pages: ${pages.map((p) => `"${p.name}"`).join(", ")}`,
      );

      // Validate that all normal instances have componentGuid
      for (const entry of normalInstances) {
        if (!entry.componentGuid || entry.componentGuid.length === 0) {
          const errorMessage = `Normal instance references component "${entry.componentName || "(unnamed)"}" on page "${entry.componentPageName || "(unknown page)"}", but has no componentGuid. Cannot export. Please publish page "${entry.componentPageName || "(unknown page)"}" first to assign it a GUID.`;
          debugConsole.error(errorMessage);
          throw new Error(errorMessage);
        }
      }

      // Get unique referenced pages (only those not already processed)
      // Use page ID as key to ensure uniqueness, not page name
      const referencedPages = new Map<string, any>(); // page ID -> page node
      for (const entry of normalInstances) {
        if (entry.componentPageName) {
          debugConsole.log(
            `Checking instance "${entry.componentName || "(unnamed)"}" -> page "${entry.componentPageName}"`,
          );
          const page = pages.find((p) => p.name === entry.componentPageName);
          if (page && !processedPages.has(page.id)) {
            // Only add if not already in the map (by ID) and not already processed
            if (!referencedPages.has(page.id)) {
              referencedPages.set(page.id, page);
              debugConsole.log(
                `✓ Found referenced page "${page.name}" (ID: ${page.id.substring(0, 8)}...)`,
              );
            }
          } else if (!page) {
            // Page not found - hard failure as requested
            const errorMessage = `Normal instance references component "${entry.componentName || "(unnamed)"}" on page "${entry.componentPageName}", but that page was not found. Cannot export. Available pages: ${pages.map((p) => `"${p.name}"`).join(", ")}`;
            debugConsole.error(errorMessage);
            throw new Error(errorMessage);
          } else {
            debugConsole.log(
              `Page "${entry.componentPageName}" already processed or not needed`,
            );
          }
        } else {
          // componentPageName is missing - hard failure
          const errorMessage = `Normal instance references component "${entry.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          debugConsole.error(errorMessage);
          throw new Error(errorMessage);
        }
      }

      debugConsole.log(
        `Found ${referencedPages.size} unique referenced page(s)`,
      );

      // Process each referenced page
      for (const [pageId, referencedPage] of referencedPages.entries()) {
        checkCancellation(requestId);
        const pageName = referencedPage.name;

        // Double-check that this page hasn't been processed (shouldn't happen, but safety check)
        if (processedPages.has(pageId)) {
          debugConsole.log(`Skipping "${pageName}" - already processed`);
          continue;
        }
        // Check if page has metadata and get local version
        const pageMetadataStr = referencedPage.getPluginData(
          "RecursicaPublishedMetadata",
        );
        let hasMetadata = false;
        let localVersion = 0;
        if (pageMetadataStr) {
          try {
            const pageMetadata = JSON.parse(pageMetadataStr);
            hasMetadata = !!(
              pageMetadata.id && pageMetadata.version !== undefined
            );
            localVersion = pageMetadata.version || 0;
          } catch {
            // Invalid metadata, treat as no metadata
          }
        }

        const referencedPageIndex = pages.findIndex(
          (p) => p.id === referencedPage.id,
        );
        if (referencedPageIndex === -1) {
          debugConsole.error(`Could not find page index for "${pageName}"`);
          throw new Error(`Could not find page index for "${pageName}"`);
        }

        // Find component name from instance table
        const instanceEntry = Array.from(normalInstances).find(
          (entry) => entry.componentPageName === pageName,
        );
        const componentName = instanceEntry?.componentName;

        // If skipPrompts is true, collect info but don't export (wizard will handle)
        // Otherwise, prompt the user
        if (data.skipPrompts) {
          // Just collect the info - wizard will ask user and export selected pages
          // Don't include the original page in discovered pages (it's the one being published)
          if (pageId === selectedPageId) {
            debugConsole.log(
              `Skipping "${pageName}" - this is the original page being published`,
            );
          } else {
            // Check if we already have this page (avoid duplicates)
            const existingPage = discoveredReferencedPages.find(
              (p) => p.pageId === pageId,
            );
            if (!existingPage) {
              discoveredReferencedPages.push({
                pageId,
                pageName,
                pageIndex: referencedPageIndex,
                hasMetadata,
                componentName,
                localVersion,
              });
              debugConsole.log(
                `Discovered referenced page: "${pageName}" (local version: ${localVersion}) (will be handled by wizard)`,
              );
            }
          }

          // Skip validation and recursive discovery during lightweight discovery mode
          // These are expensive operations that will be done during full export
          if (!isRecursive) {
            debugConsole.log(
              `Discovery mode: Skipping validation and recursive discovery for "${pageName}" (will be done during full export)`,
            );
          } else {
            // During recursive discovery (if we get here), we still want to find direct references
            // but skip validation and further recursion to keep it fast
            debugConsole.log(
              `Recursive discovery: Skipping validation for "${pageName}"`,
            );
          }
        } else {
          // Prompt user
          const message = `Do you want to also publish referenced component "${pageName}"?`;
          try {
            await pluginPrompt.prompt(message, {
              okLabel: "Yes",
              cancelLabel: "No",
              timeoutMs: 300000, // 5 minutes
            });

            // User said Yes - export the referenced page
            debugConsole.log(`Exporting referenced page: "${pageName}"`);
            const referencedPageIndex = pages.findIndex(
              (p) => p.id === referencedPage.id,
            );
            if (referencedPageIndex === -1) {
              debugConsole.error(`Could not find page index for "${pageName}"`);
              throw new Error(`Could not find page index for "${pageName}"`);
            }

            // Recursively export the referenced page (pass along processedPages set)
            checkCancellation(requestId);
            const referencedExportResponse = await exportPage(
              {
                pageIndex: referencedPageIndex,
              },
              processedPages, // Pass the same set to track all processed pages
              true, // Mark as recursive call
              discoveredPages, // Pass discovered pages set (empty during actual export)
              requestId, // Pass requestId for cancellation
            );

            if (
              referencedExportResponse.success &&
              referencedExportResponse.data
            ) {
              const referencedExportData =
                referencedExportResponse.data as unknown as ExportPageResponseData;
              additionalPages.push(referencedExportData);
              debugConsole.log(
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
                debugConsole.error(
                  `Export cancelled: Referenced page "${pageName}" has no metadata and user declined to publish it.`,
                );
                throw new Error(
                  `Cannot continue export: Referenced component "${pageName}" has no metadata. Please publish it first or choose to publish it now.`,
                );
              } else {
                // Has metadata, user said No - continue with existing metadata
                debugConsole.log(
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
    }

    // Create string table for compression
    debugConsole.log("Creating string table...");
    const stringTable = new StringTable();

    // Get or generate page metadata (GUID and version)
    debugConsole.log("Getting page metadata...");
    const pageMetadataStr = selectedPage.getPluginData(
      "RecursicaPublishedMetadata",
    );
    let pageGuid = "";
    let pageVersion = 0;
    let pageDescription: string | undefined;
    let pageUrl: string | undefined;

    if (pageMetadataStr) {
      try {
        const pageMetadata = JSON.parse(pageMetadataStr);
        pageGuid = pageMetadata.id || "";
        pageVersion = pageMetadata.version || 0;
        pageDescription = pageMetadata.description;
        pageUrl = pageMetadata.url;
      } catch {
        debugConsole.warning(
          "Failed to parse page metadata, generating new GUID",
        );
      }
    }

    // If no GUID exists, generate one and store it
    if (!pageGuid) {
      debugConsole.log("Generating new GUID for page...");
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

    // If in discovery mode (skipPrompts and not recursive), do lightweight discovery first
    // Then do full export of main page + all discovered pages
    if (data.skipPrompts && !isRecursive) {
      debugConsole.log("=== Discovery Phase Complete ===");
      debugConsole.log(
        `Found ${discoveredReferencedPages.length} referenced page(s)`,
      );
      debugConsole.log("=== Starting Full Export of All Pages ===");

      // Now do full extraction of the main page (re-extract with full extraction)
      debugConsole.log("Doing full extraction of main page...");

      // Re-extract with full extraction (not just instances)
      const fullVariableTable = new VariableTable();
      const fullCollectionTable = new CollectionTable();
      const fullInstanceTable = new InstanceTable();
      const fullStyleTable = new StyleTable();
      const fullImageTable = new ImageTable();
      const fullExportedIds = new Map<string, string>();

      debugConsole.log(
        `[EXPORT] Starting full extraction ID uniqueness tracking (initial map size: ${fullExportedIds.size})`,
      );

      const fullExtractedPageData = await extractNodeData(
        selectedPage as any,
        new WeakSet(),
        {
          variableTable: fullVariableTable,
          collectionTable: fullCollectionTable,
          instanceTable: fullInstanceTable,
          styleTable: fullStyleTable,
          imageTable: fullImageTable,
          exportedIds: fullExportedIds,
        },
      );

      debugConsole.log(
        `[EXPORT] Finished full extraction ID uniqueness tracking (final map size: ${fullExportedIds.size})`,
      );
      checkCancellation(requestId);

      // Update the tables with the full extraction results
      variableTable = fullVariableTable;
      collectionTable = fullCollectionTable;
      instanceTable = fullInstanceTable;
      styleTable = fullStyleTable;
      imageTable = fullImageTable;
      extractedPageData = fullExtractedPageData;

      // Now export all discovered referenced pages
      const discoveredPagesToExport = discoveredReferencedPages.filter(
        (p) => p.pageId !== selectedPageId,
      );

      debugConsole.log(
        `Exporting ${discoveredPagesToExport.length} discovered referenced page(s)...`,
      );
      for (const discoveredPage of discoveredPagesToExport) {
        checkCancellation(requestId);
        debugConsole.log(
          `Exporting referenced page: "${discoveredPage.pageName}"...`,
        );

        // Do full export of this referenced page
        // Use skipPrompts: true but isRecursive: true so it does full export, not discovery
        const referencedPageExportResponse = await exportPage(
          {
            pageIndex: discoveredPage.pageIndex,
            skipPrompts: true, // Export without prompting (isRecursive=true means full export, not discovery)
          },
          processedPages, // Track processed pages
          true, // Mark as recursive call (this makes it do full export, not discovery)
          discoveredPages,
          requestId,
        );

        if (
          referencedPageExportResponse.success &&
          referencedPageExportResponse.data
        ) {
          const referencedPageData =
            referencedPageExportResponse.data as unknown as ExportPageResponseData;
          additionalPages.push(referencedPageData);
          debugConsole.log(
            `✓ Successfully exported: "${discoveredPage.pageName}"`,
          );
        } else {
          debugConsole.warning(
            `Failed to export "${discoveredPage.pageName}": ${referencedPageExportResponse.message}`,
          );
        }
      }

      debugConsole.log(
        `=== Full Export Complete: ${additionalPages.length + 1} page(s) exported ===`,
      );

      // Continue with normal export flow to build JSON
    }

    // Full export mode - build complete JSON structure
    // Create export data with metadata, collections table, variable table, instance table, and page data
    // All data uses full key names at this point
    debugConsole.log("Creating export data structure...");

    // Ensure pageGuid is set (should never be empty at this point, but validate to be safe)
    if (!pageGuid || pageGuid.length === 0) {
      const errorMessage = `Cannot export page "${selectedPage.name}": page has no GUID. This should not happen - GUID should have been generated earlier.`;
      debugConsole.error(errorMessage);
      throw new Error(errorMessage);
    }

    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: pageGuid,
        version: pageVersion,
        name: selectedPage.name,
        pluginVersion: "1.0.0",
        ...(pageDescription !== undefined && { description: pageDescription }),
        ...(pageUrl !== undefined && { url: pageUrl }),
      },
      stringTable: stringTable.getSerializedTable(),
      collections: collectionTable.getSerializedTable(),
      variables: variableTable.getSerializedTable(),
      instances: instanceTable.getSerializedTable(),
      styles: styleTable.getSerializedTable(),
      images: imageTable.getSerializedTable(),
      pageData: extractedPageData,
    };

    // Compress the entire JSON at the very last stage
    debugConsole.log("Compressing JSON data...");
    const compressedExportData = compressJsonData(exportData, stringTable);

    debugConsole.log("Serializing to JSON...");
    const jsonString = JSON.stringify(compressedExportData, null, 2);
    const jsonSizeKB = (jsonString.length / 1024).toFixed(2);
    // Clean component name and create filename
    const cleanedName = getComponentName(selectedPage.name).trim();
    const filename = cleanedName.replace(/\s+/g, "_") + ".figma.json";

    debugConsole.log(`JSON serialization complete: ${jsonSizeKB} KB`);
    debugConsole.log(`Export file: ${filename}`);
    debugConsole.log("=== Export Complete ===");

    // Parse the JSON string back to object for easier manipulation
    const parsedPageData = JSON.parse(jsonString);

    const responseData: ExportPageResponseData = {
      filename,
      pageData: parsedPageData,
      pageName: selectedPage.name,
      additionalPages, // Populated with referenced component pages (for wizard)
      discoveredReferencedPages:
        discoveredReferencedPages.length > 0
          ? // Filter out the original page - it shouldn't be in the discovered list since it's the one being published
            discoveredReferencedPages.filter((p) => p.pageId !== selectedPageId)
          : undefined, // Only include if there are discovered pages
      validationResult: aggregatedValidationResult, // Include aggregated validation results if in discovery mode
    };

    // Include debug logs in response
    const debugLogs = debugConsole.getLogs();
    const responseDataWithLogs = {
      ...responseData,
      ...(debugLogs.length > 0 && { debugLogs }),
    };

    return {
      type: "exportPage",
      success: true,
      error: false,
      message: "Page exported successfully",
      data: responseDataWithLogs as any,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", error);
    console.error("Error message:", errorMessage);
    debugConsole.error(`Export failed: ${errorMessage}`);
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack);
      debugConsole.error(`Stack trace: ${error.stack}`);
    }
    // Include debug logs in error response
    const debugLogs = debugConsole.getLogs();
    const errorResponse = {
      type: "exportPage" as const,
      success: false,
      error: true,
      message: errorMessage,
      data: {
        ...(debugLogs.length > 0 && { debugLogs }),
      },
    };
    console.error("Returning error response:", errorResponse);
    return errorResponse;
  }
}
