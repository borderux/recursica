/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";
import { debugConsole } from "../../services/debugConsole";
import type { InstanceTableEntry } from "./instanceTable";
import { extractNodeData } from "../pageExportNew";

const COMPONENT_METADATA_KEY = "RecursicaPublishedMetadata";

/**
 * Gets the page node that contains the given node
 * Returns null if the page cannot be determined (e.g., for remote components)
 * Also returns diagnostic information about why the page couldn't be found
 */
function getPageFromNode(node: any): {
  page: any | null;
  reason: "found" | "detached" | "broken_chain" | "access_error";
} {
  let current: any = node;
  let hasParent = false;

  // Check if node is detached (no parent at all)
  try {
    hasParent = current.parent !== null && current.parent !== undefined;
    if (!hasParent) {
      return { page: null, reason: "detached" };
    }
  } catch {
    // Can't even check parent - likely detached
    return { page: null, reason: "detached" };
  }

  // Try to traverse parent chain
  while (current) {
    if (current.type === "PAGE") {
      return { page: current, reason: "found" };
    }
    try {
      const parent = current.parent;
      if (!parent) {
        // Parent chain ended without reaching PAGE
        return { page: null, reason: "broken_chain" };
      }
      current = parent;
    } catch (error) {
      // Parent access failed during traversal
      return { page: null, reason: "access_error" };
    }
  }

  // Reached end of chain without finding PAGE
  return { page: null, reason: "broken_chain" };
}

/**
 * Gets component metadata from a page node
 */
function getComponentMetadataFromPage(page: any): {
  id?: string;
  version?: number;
} | null {
  try {
    const metadataStr = page.getSharedPluginData(
      "recursica",
      COMPONENT_METADATA_KEY,
    );
    if (!metadataStr || metadataStr.trim() === "") {
      return null;
    }
    const metadata = JSON.parse(metadataStr);
    return {
      id: metadata.id,
      version: metadata.version,
    };
  } catch {
    return null;
  }
}

/**
 * Parser for INSTANCE node type
 * Handles mainComponent reference serialization using instance table
 */
export async function parseInstanceProperties(
  node: any,
  context: ParserContext,
): Promise<Partial<ParsedNodeData>> {
  const result: Partial<ParsedNodeData> = {};
  const handledKeys = new Set<string>();

  // Mark as instance
  result._isInstance = true;
  handledKeys.add("_isInstance");

  // Handle main component reference
  if (
    node.type === "INSTANCE" &&
    typeof node.getMainComponentAsync === "function"
  ) {
    const mainComponent = await node.getMainComponentAsync();
    if (!mainComponent) {
      return result;
    }

    const instanceName = node.name || "(unnamed)";
    const componentName = mainComponent.name || "(unnamed)";
    const isRemote = (mainComponent as any).remote === true;

    // Get pages for classification
    const instancePageResult = getPageFromNode(node);
    const instancePage = instancePageResult.page;
    const componentPageResult = getPageFromNode(mainComponent);
    const componentPage = componentPageResult.page;

    // Classify instance type
    let instanceType: "internal" | "normal" | "remote";
    if (isRemote) {
      instanceType = "remote";
    } else if (
      componentPage &&
      instancePage &&
      componentPage.id === instancePage.id
    ) {
      instanceType = "internal";
    } else if (
      componentPage &&
      instancePage &&
      componentPage.id !== instancePage.id
    ) {
      instanceType = "normal";
    } else {
      // Fallback: if we can't determine, assume normal
      instanceType = "normal";
    }

    // Extract variant properties and component properties
    let variantProperties: Record<string, string> | undefined;
    let componentProperties: Record<string, any> | undefined;
    try {
      if ((node as any).variantProperties) {
        variantProperties = (node as any).variantProperties;
      }
      if ((node as any).componentProperties) {
        componentProperties = (node as any).componentProperties;
      }
    } catch {
      // Properties might not be accessible
    }

    // Build path using node names
    // Note: We cannot use node IDs for normal instances because IDs differ across files/users
    // We handle:
    // 1. Empty names: Represented as empty strings in the array
    // 2. Duplicate names: Store them, validation during import will check multiple paths
    // 3. Path is stored as array to avoid separator conflicts
    let mainComponentParentPath: string[] | undefined;
    let componentSetName: string | undefined;

    try {
      let current: any = mainComponent.parent;
      const pathNames: string[] = [];
      let depth = 0;
      const maxDepth = 20;

      while (current && depth < maxDepth) {
        try {
          const nodeType = current.type;
          const nodeName = current.name;

          if (nodeType === "COMPONENT_SET" && !componentSetName) {
            componentSetName = nodeName;
          }

          if (nodeType === "PAGE") {
            break;
          }

          // Use node name for path, empty names are represented as empty strings
          // Store as array to avoid separator conflicts
          const pathSegment = nodeName || "";
          pathNames.unshift(pathSegment);

          current = current.parent;
          depth++;
        } catch {
          break;
        }
      }

      mainComponentParentPath = pathNames;
    } catch {
      // Path building failed, continue without it
    }

    // Create instance table entry
    // Note: componentType is not stored - instances always reference COMPONENT nodes
    const entry: InstanceTableEntry = {
      instanceType,
      componentName,
      ...(componentSetName && { componentSetName }),
      ...(variantProperties && { variantProperties }),
      ...(componentProperties && { componentProperties }),
      // Always include path for normal instances (even if empty array for page root)
      // For internal instances, we use componentNodeId instead (simpler since everything is on the same page)
      // For remote instances, path is optional (structure is used instead)
      ...(instanceType === "normal"
        ? { path: mainComponentParentPath || [] }
        : mainComponentParentPath &&
          mainComponentParentPath.length > 0 && {
            path: mainComponentParentPath,
          }),
    };

    // Add type-specific fields
    if (instanceType === "internal") {
      // For internal instances, store the component node ID
      // During import, we maintain a mapping of old ID -> new node to resolve this
      entry.componentNodeId = mainComponent.id;
      await debugConsole.log(
        `  Found INSTANCE: "${instanceName}" -> INTERNAL component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)`,
      );
    } else if (instanceType === "normal") {
      // Get component metadata from the component's page
      if (componentPage) {
        // Always set componentPageName for normal instances (needed for import)
        entry.componentPageName = componentPage.name;

        const metadata = getComponentMetadataFromPage(componentPage);
        if (metadata?.id && metadata.version !== undefined) {
          entry.componentGuid = metadata.id;
          entry.componentVersion = metadata.version;
        }
      } else {
        // componentPage is null - this is a hard failure for normal instances
        // Get diagnostic information based on why page couldn't be found
        const mainComponentId = mainComponent.id;
        let reasonMessage = "";
        let actionMessage = "";

        switch (componentPageResult.reason) {
          case "detached":
            reasonMessage =
              "The component is detached (not placed on any page)";
            actionMessage =
              "Please place the component on a page before exporting.";
            break;
          case "broken_chain":
            reasonMessage =
              "The component's parent chain is broken and cannot be traversed to find the page";
            actionMessage =
              "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            reasonMessage =
              "Cannot access the component's parent chain (access error)";
            actionMessage =
              "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            reasonMessage = "Cannot determine which page the component is on";
            actionMessage =
              "Please ensure the component is properly placed on a page.";
        }

        // Try to scroll to the component to help user find it
        try {
          await figma.viewport.scrollAndZoomIntoView([mainComponent]);
        } catch (scrollError) {
          // If scrolling fails, component might not be accessible
          console.warn("Could not scroll to component:", scrollError);
        }

        const errorMessage = `Normal instance "${instanceName}" -> component "${componentName}" (ID: ${mainComponentId}) has no componentPage. ${reasonMessage}. ${actionMessage} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", errorMessage);
        await debugConsole.error(errorMessage);
        const error = new Error(errorMessage);
        console.error("Throwing error:", error);
        throw error;
      }
      // path is REQUIRED for normal instances to locate the specific component on the referenced page
      // Path is stored as array of node names (cannot use IDs as they differ across files/users)
      // Empty names are represented as empty strings in the array
      // Duplicate names are allowed but require validation during import
      // If mainComponentParentPath is empty array, the component is at the page root
      // This is valid - during import, empty array means search page's direct children
      if (mainComponentParentPath === undefined) {
        // Path building failed - this is a problem for normal instances
        console.warn(
          `Failed to build path for normal instance "${instanceName}" -> component "${componentName}". Path is required for resolution.`,
        );
      }
      const pathDisplay =
        mainComponentParentPath && mainComponentParentPath.length > 0
          ? ` at path [${mainComponentParentPath.join(" → ")}]`
          : " at page root";
      await debugConsole.log(
        `  Found INSTANCE: "${instanceName}" -> NORMAL component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)${pathDisplay}`,
      );
    } else if (instanceType === "remote") {
      // Try to get library information
      let remoteLibraryName: string | undefined;
      let remoteLibraryKey: string | undefined;

      try {
        // Try getPublishStatusAsync
        if (
          typeof (mainComponent as any).getPublishStatusAsync === "function"
        ) {
          try {
            const publishStatus = await (
              mainComponent as any
            ).getPublishStatusAsync();
            if (publishStatus && typeof publishStatus === "object") {
              if ((publishStatus as any).libraryName) {
                remoteLibraryName = (publishStatus as any).libraryName;
              }
              if ((publishStatus as any).libraryKey) {
                remoteLibraryKey = (publishStatus as any).libraryKey;
              }
            }
          } catch {
            // getPublishStatusAsync might not be available
          }
        }

        // Try searching team libraries
        try {
          const teamLibraryApi = figma.teamLibrary as any;
          if (
            typeof teamLibraryApi?.getAvailableLibraryComponentSetsAsync ===
            "function"
          ) {
            const componentSets =
              await teamLibraryApi.getAvailableLibraryComponentSetsAsync();
            if (componentSets && Array.isArray(componentSets)) {
              for (const componentSet of componentSets) {
                if (
                  componentSet.key === (mainComponent as any).key ||
                  componentSet.name === mainComponent.name
                ) {
                  if (componentSet.libraryName) {
                    remoteLibraryName = componentSet.libraryName;
                  }
                  if (componentSet.libraryKey) {
                    remoteLibraryKey = componentSet.libraryKey;
                  }
                  break;
                }
              }
            }
          }
        } catch {
          // Library lookup might fail
        }

        // For remote instances, we need to store the full structure
        // This is a fallback since we can't resolve the reference
        // We'll extract the component's structure recursively
        try {
          // Extract the main component's structure
          // Note: This might be expensive, but it's necessary for remote components
          entry.structure = await extractNodeData(
            mainComponent,
            new WeakSet(),
            context,
          );
        } catch (extractError) {
          console.warn(
            `Failed to extract structure for remote component "${componentName}":`,
            extractError,
          );
        }
      } catch (libError) {
        console.warn(
          `Error getting library info for remote component "${componentName}":`,
          libError,
        );
      }

      if (remoteLibraryName) {
        entry.remoteLibraryName = remoteLibraryName;
      }
      if (remoteLibraryKey) {
        entry.remoteLibraryKey = remoteLibraryKey;
      }

      await debugConsole.log(
        `  Found INSTANCE: "${instanceName}" -> REMOTE component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)`,
      );
    }

    // Add instance to table and get reference
    const instanceIndex = context.instanceTable.addInstance(entry);
    result._instanceRef = instanceIndex;

    handledKeys.add("_instanceRef");
  }

  return result;
}
