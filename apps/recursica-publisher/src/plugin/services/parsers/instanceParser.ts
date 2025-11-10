/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";
import { debugConsole } from "../../services/debugConsole";
import type { InstanceTableEntry } from "./instanceTable";
import { extractNodeData } from "../pageExportNew";
import { pluginPrompt } from "../../utils/pluginPrompt";

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
 * Note: Uses getPluginData (not getSharedPluginData) to match how metadata is stored
 */
function getComponentMetadataFromPage(page: any): {
  id?: string;
  version?: number;
} | null {
  try {
    // Metadata is stored using setPluginData (no namespace), not setSharedPluginData
    const metadataStr = page.getPluginData(COMPONENT_METADATA_KEY);
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
      // Detached instance - the main component is missing
      const instanceName = node.name || "(unnamed)";
      const instanceId = node.id;

      // Check if we've already handled this detached instance
      if (context.detachedComponentsHandled.has(instanceId)) {
        // Already prompted for this instance - treat as internal
        await debugConsole.log(
          `Treating detached instance "${instanceName}" as internal instance (already prompted)`,
        );
      } else {
        // First time seeing this detached instance - prompt user
        await debugConsole.warning(
          `Found detached instance: "${instanceName}" (main component is missing)`,
        );

        const message = `Found detached instance "${instanceName}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await pluginPrompt.prompt(message, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 300000, // 5 minutes
          });

          // User said Ok - mark as handled and treat as internal instance
          context.detachedComponentsHandled.add(instanceId);
          await debugConsole.log(
            `Treating detached instance "${instanceName}" as internal instance`,
          );
        } catch (error) {
          // User said Cancel or prompt was cancelled
          if (error instanceof Error && error.message === "User cancelled") {
            const errorMessage = `Export cancelled: Detached instance "${instanceName}" found. Please fix the instance before exporting.`;
            await debugConsole.error(errorMessage);
            // Try to scroll to the instance to help user find it
            try {
              await figma.viewport.scrollAndZoomIntoView([node]);
            } catch (scrollError) {
              console.warn("Could not scroll to instance:", scrollError);
            }
            throw new Error(errorMessage);
          } else {
            // Some other error occurred
            throw error;
          }
        }
      }

      // Extract the instance's own structure (since there's no main component)
      // We'll treat it as an internal instance with its current structure
      const instancePageResult = getPageFromNode(node);
      const instancePage = instancePageResult.page;

      if (!instancePage) {
        // Instance itself is detached from page - this is a problem
        const errorMessage = `Detached instance "${instanceName}" is not on any page. Cannot export.`;
        await debugConsole.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Extract variant properties and component properties if available
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

      // Create instance table entry as internal instance
      // We'll use the instance's own ID as the componentNodeId
      // During import, we'll need to handle this specially
      const entry: InstanceTableEntry = {
        instanceType: "internal",
        componentName: instanceName,
        componentNodeId: node.id, // Use instance's own ID
        ...(variantProperties && { variantProperties }),
        ...(componentProperties && { componentProperties }),
      };

      // Add instance to table and get reference
      const instanceIndex = context.instanceTable.addInstance(entry);
      result._instanceRef = instanceIndex;
      handledKeys.add("_instanceRef");

      await debugConsole.log(
        `  Exported detached INSTANCE: "${instanceName}" as internal instance (ID: ${node.id.substring(0, 8)}...)`,
      );

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
    // Special case: If component is remote BUT also exists on a local page with metadata,
    // treat it as "normal" so it shows up as a referenced file
    let instanceType: "internal" | "normal" | "remote";
    let effectiveComponentPage = componentPage; // Use this instead of reassigning componentPage

    if (isRemote) {
      // Component is from a library
      // Only treat as "normal" if the component also exists on a local page with metadata
      // (This can happen if the component was synced from a library but also exists locally)
      if (componentPage) {
        // Component exists on a local page - check for metadata
        const metadata = getComponentMetadataFromPage(componentPage);
        if (metadata?.id) {
          // Found a local page with metadata - treat as "normal" so it shows up as a referenced file
          instanceType = "normal";
          effectiveComponentPage = componentPage;
          await debugConsole.log(
            `  Component "${componentName}" is from library but also exists on local page "${componentPage.name}" with metadata. Treating as "normal" instance.`,
          );
        } else {
          // Component is on a local page but has no metadata - treat as "remote"
          instanceType = "remote";
          await debugConsole.log(
            `  Component "${componentName}" is from library and exists on local page "${componentPage.name}" but has no metadata. Treating as "remote" instance.`,
          );
        }
      } else {
        // Component is not on a local page - treat as "remote"
        instanceType = "remote";
        await debugConsole.log(
          `  Component "${componentName}" is from library and not on a local page. Treating as "remote" instance.`,
        );
      }
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
    } else if (componentPage && !instancePage) {
      // Component is on a page but instance page couldn't be determined
      // This is unusual but treat as normal
      instanceType = "normal";
    } else {
      // componentPage is null - check if it's a detached component
      if (!isRemote && componentPageResult.reason === "detached") {
        // Detached component - check if we've already handled this component
        const componentId = mainComponent.id;

        if (context.detachedComponentsHandled.has(componentId)) {
          // Already prompted for this component - treat as remote
          instanceType = "remote";
          await debugConsole.log(
            `Treating detached instance "${instanceName}" -> component "${componentName}" as remote instance (already prompted)`,
          );
        } else {
          // First time seeing this detached component - prompt user
          await debugConsole.warning(
            `Found detached instance: "${instanceName}" -> component "${componentName}" (component is not on any page)`,
          );

          // Try to scroll to the component to help user find it
          try {
            await figma.viewport.scrollAndZoomIntoView([mainComponent]);
          } catch (scrollError) {
            console.warn("Could not scroll to component:", scrollError);
          }

          // Prompt user
          const message = `Found detached instance "${instanceName}" attached to component "${componentName}". This should be fixed. Continue to publish?`;
          try {
            await pluginPrompt.prompt(message, {
              okLabel: "Ok",
              cancelLabel: "Cancel",
              timeoutMs: 300000, // 5 minutes
            });

            // User said Ok - mark as handled and treat as remote instance
            // This allows us to store the component structure and create it on REMOTES page
            context.detachedComponentsHandled.add(componentId);
            instanceType = "remote";
            await debugConsole.log(
              `Treating detached instance "${instanceName}" as remote instance (will be created on REMOTES page)`,
            );
          } catch (error) {
            // User said Cancel or prompt was cancelled
            if (error instanceof Error && error.message === "User cancelled") {
              const errorMessage = `Export cancelled: Detached instance "${instanceName}" found. The component "${componentName}" is not on any page. Please fix the instance before exporting.`;
              await debugConsole.error(errorMessage);
              throw new Error(errorMessage);
            } else {
              // Some other error occurred
              throw error;
            }
          }
        }
      } else {
        // componentPage is null but not detached - can't classify as normal or internal
        // If it's not remote, this is an error condition
        if (!isRemote) {
          await debugConsole.warning(
            `  Instance "${instanceName}" -> component "${componentName}": componentPage is null but component is not remote. Reason: ${componentPageResult.reason}. Cannot determine instance type.`,
          );
        }
        // Fallback: if we can't determine and it's not remote, assume normal
        // (This will be handled later when we try to set componentGuid)
        instanceType = "normal";
      }
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
      // Use effectiveComponentPage (which may have been found for remote components)
      const pageToUse = effectiveComponentPage || componentPage;
      if (pageToUse) {
        // Always set componentPageName for normal instances (needed for import)
        entry.componentPageName = pageToUse.name;

        const metadata = getComponentMetadataFromPage(pageToUse);
        if (metadata?.id && metadata.version !== undefined) {
          entry.componentGuid = metadata.id;
          entry.componentVersion = metadata.version;
          await debugConsole.log(
            `  Found INSTANCE: "${instanceName}" -> NORMAL component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...) at path [${(mainComponentParentPath || []).join(" → ")}]`,
          );
        } else {
          await debugConsole.warning(
            `  Instance "${instanceName}" -> component "${componentName}" is classified as normal but page "${pageToUse.name}" has no metadata. This instance will not be importable.`,
          );
        }
      } else {
        // componentPage is null - this shouldn't happen for normal instances
        // (Detached components should have been handled during classification)
        // Log detailed error information
        const mainComponentId = mainComponent.id;
        let reasonMessage = "";
        let actionMessage = "";

        switch (componentPageResult.reason) {
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

      // Check if this is a detached instance (component is not on any page)
      const isDetachedInstance = context.detachedComponentsHandled.has(
        mainComponent.id,
      );

      if (!isDetachedInstance) {
        // Only try to get library info for actual remote (library) components
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
        } catch (libError) {
          console.warn(
            `Error getting library info for remote component "${componentName}":`,
            libError,
          );
        }
      }

      // For remote instances (including detached), we need to store the full structure
      // This is necessary since we can't resolve the reference
      // We'll extract the component's structure recursively
      try {
        // Extract the main component's structure
        // Note: This might be expensive, but it's necessary for remote/detached components
        entry.structure = await extractNodeData(
          mainComponent,
          new WeakSet(),
          context,
        );
        if (isDetachedInstance) {
          await debugConsole.log(
            `  Extracted structure for detached component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)`,
          );
        }
      } catch (extractError) {
        console.warn(
          `Failed to extract structure for remote component "${componentName}":`,
          extractError,
        );
      }

      if (remoteLibraryName) {
        entry.remoteLibraryName = remoteLibraryName;
      }
      if (remoteLibraryKey) {
        entry.remoteLibraryKey = remoteLibraryKey;
      }

      // For detached instances, store the component ID to ensure unique keys
      // This prevents collisions when multiple detached components have the same name
      if (isDetachedInstance) {
        entry.componentNodeId = mainComponent.id;
      }

      await debugConsole.log(
        `  Found INSTANCE: "${instanceName}" -> REMOTE component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)${isDetachedInstance ? " [DETACHED]" : ""}`,
      );
    }

    // Add instance to table and get reference
    const instanceIndex = context.instanceTable.addInstance(entry);
    result._instanceRef = instanceIndex;

    handledKeys.add("_instanceRef");
  }

  return result;
}
