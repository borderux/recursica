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
 */
function getPageFromNode(node: any): any | null {
  let current: any = node;
  while (current) {
    if (current.type === "PAGE") {
      return current;
    }
    try {
      current = current.parent;
    } catch (error) {
      // Parent access may fail for remote components
      return null;
    }
  }
  return null;
}

/**
 * Builds a file-path-like string by traversing up the parent chain
 * from an instance node. Stops at the top (PAGE node or null parent).
 * @param node - The instance node to start from
 * @returns A path string with parent names joined by "/" (e.g., "Frame1/Frame2/Container")
 */
function buildParentPath(node: any): string {
  const pathParts: string[] = [];
  let current: any = node.parent;

  try {
    while (current) {
      let nodeType: string | undefined;
      let nodeName: string | undefined;
      let nextParent: any;

      try {
        nodeType = current.type;
        nodeName = current.name;
        nextParent = current.parent;
      } catch (error) {
        break;
      }

      if (nodeType === "PAGE" || !nextParent) {
        break;
      }

      if (nodeName && nodeName.trim() !== "") {
        pathParts.unshift(nodeName);
      }

      current = nextParent;
    }
  } catch (error) {
    // Return what we have so far
  }

  return pathParts.join("/");
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
    try {
      const mainComponent = await node.getMainComponentAsync();
      if (!mainComponent) {
        return result;
      }

      const instanceName = node.name || "(unnamed)";
      const componentName = mainComponent.name || "(unnamed)";
      const isRemote = (mainComponent as any).remote === true;

      // Get pages for classification
      const instancePage = getPageFromNode(node);
      const componentPage = getPageFromNode(mainComponent);

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

      // Build paths
      const instanceParentPath = buildParentPath(node);
      let mainComponentParentPath: string | undefined;
      let componentSetName: string | undefined;

      try {
        let current: any = mainComponent.parent;
        const pathParts: string[] = [];
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

            if (nodeName && nodeName.trim() !== "") {
              pathParts.unshift(nodeName);
            }

            current = current.parent;
            depth++;
          } catch {
            break;
          }
        }

        mainComponentParentPath = pathParts.join("/");
      } catch {
        // Path building failed, continue without it
      }

      // Create instance table entry
      const entry: InstanceTableEntry = {
        instanceType,
        componentName,
        componentType: mainComponent.type,
        ...(componentSetName && { componentSetName }),
        ...(variantProperties && { variantProperties }),
        ...(componentProperties && { componentProperties }),
        ...(mainComponentParentPath && { _path: mainComponentParentPath }),
        ...(instanceParentPath && { _instancePath: instanceParentPath }),
      };

      // Add type-specific fields
      if (instanceType === "internal") {
        entry.componentNodeId = mainComponent.id;
        await debugConsole.log(
          `  Found INSTANCE: "${instanceName}" -> INTERNAL component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)`,
        );
      } else if (instanceType === "normal") {
        // Get component metadata from the component's page
        if (componentPage) {
          const metadata = getComponentMetadataFromPage(componentPage);
          if (metadata?.id && metadata.version !== undefined) {
            entry.componentGuid = metadata.id;
            entry.componentVersion = metadata.version;
            entry.componentPageName = componentPage.name;
          }
        }
        await debugConsole.log(
          `  Found INSTANCE: "${instanceName}" -> NORMAL component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)`,
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
    } catch (error) {
      console.log(
        "Error getting main component for " + (node.name || "unknown") + ":",
        error,
      );
    }
  }

  return result;
}
