/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";
import { debugConsole } from "../../services/debugConsole";
import type { InstanceTableEntry } from "./instanceTable";
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
        debugConsole.log(
          `Treating detached instance "${instanceName}" as internal instance (already prompted)`,
        );
      } else {
        // First time seeing this detached instance - prompt user
        debugConsole.warning(
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
          debugConsole.log(
            `Treating detached instance "${instanceName}" as internal instance`,
          );
        } catch (error) {
          // User said Cancel or prompt was cancelled
          if (error instanceof Error && error.message === "User cancelled") {
            const errorMessage = `Export cancelled: Detached instance "${instanceName}" found. Please fix the instance before exporting.`;
            debugConsole.error(errorMessage);
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
        debugConsole.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Extract variant properties and component properties if available
      let variantProperties: Record<string, string> | undefined;
      let componentProperties: Record<string, any> | undefined;
      try {
        // Try getProperties() first (recommended way to get instance properties)
        if (typeof (node as any).getProperties === "function") {
          try {
            const props = await (node as any).getProperties();
            if (props) {
              if (props.variantProperties) {
                variantProperties = props.variantProperties;
              }
              if (props.componentProperties) {
                componentProperties = props.componentProperties;
              }
            }
          } catch (getPropsError) {
            // getProperties() might not be available or might fail
            debugConsole.log(
              `  Detached instance "${instanceName}" -> getProperties() not available or failed: ${getPropsError}`,
            );
          }
        }
        // Fallback: try direct property access
        if (!variantProperties && (node as any).variantProperties) {
          variantProperties = (node as any).variantProperties;
        }
        if (!componentProperties && (node as any).componentProperties) {
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

      debugConsole.log(
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
    let componentPage = componentPageResult.page;

    // If componentPage is null and component is marked as remote, try to find it by ID prefix
    // This handles cases where components inside COMPONENT_SET nodes can't traverse to their page
    // In Figma, nodes on the same page share the same ID prefix (before the colon)
    if (!componentPage && isRemote) {
      try {
        await figma.loadAllPagesAsync();
        const allPages = figma.root.children;

        // Try to find the component by searching pages
        let foundOnPage: any = null;
        for (const page of allPages) {
          try {
            const component = page.findOne(
              (n: any) => n.id === mainComponent.id,
            );
            if (component) {
              foundOnPage = page;
              break;
            }
          } catch {
            // Search might fail, continue
          }
        }

        // If not found by search, try matching by ID prefix
        if (!foundOnPage) {
          const componentIdPrefix = mainComponent.id.split(":")[0];
          for (const page of allPages) {
            const pageIdPrefix = page.id.split(":")[0];
            if (componentIdPrefix === pageIdPrefix) {
              foundOnPage = page;
              break;
            }
          }
        }

        if (foundOnPage) {
          // Update componentPage to the found page so it gets treated as normal
          componentPage = foundOnPage;
        }
      } catch {
        // If page lookup fails, continue with componentPage as null
      }
    }

    // Classify instance type
    // Special case: If component is remote BUT also exists on a local page with metadata,
    // treat it as "normal" so it shows up as a referenced file
    let instanceType: "internal" | "normal" | "remote";
    let effectiveComponentPage = componentPage; // Use this instead of reassigning componentPage

    if (isRemote) {
      // Component is from a library
      // If component exists on a local page (same file), treat as "normal" even without metadata
      // This allows components from other files in the same project to be used
      // Only truly external library components (not on any local page) should be "remote"
      if (componentPage) {
        // Component exists on a local page - treat as "normal" so it can be referenced
        // Metadata check is for determining if we can properly reference it, but doesn't make it "remote"
        const metadata = getComponentMetadataFromPage(componentPage);
        instanceType = "normal";
        effectiveComponentPage = componentPage;
        if (metadata?.id) {
          debugConsole.log(
            `  Component "${componentName}" is from library but also exists on local page "${componentPage.name}" with metadata. Treating as "normal" instance.`,
          );
        } else {
          debugConsole.log(
            `  Component "${componentName}" is from library and exists on local page "${componentPage.name}" (no metadata). Treating as "normal" instance - page should be published first.`,
          );
        }
      } else {
        // Component is not on a local page - truly external library, treat as "remote"
        instanceType = "remote";
        debugConsole.log(
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
          debugConsole.log(
            `Treating detached instance "${instanceName}" -> component "${componentName}" as remote instance (already prompted)`,
          );
        } else {
          // First time seeing this detached component - prompt user
          debugConsole.warning(
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
            debugConsole.log(
              `Treating detached instance "${instanceName}" as remote instance (will be created on REMOTES page)`,
            );
          } catch (error) {
            // User said Cancel or prompt was cancelled
            if (error instanceof Error && error.message === "User cancelled") {
              const errorMessage = `Export cancelled: Detached instance "${instanceName}" found. The component "${componentName}" is not on any page. Please fix the instance before exporting.`;
              debugConsole.error(errorMessage);
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
          debugConsole.warning(
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
      // Try multiple ways to get variant properties
      if ((node as any).variantProperties) {
        variantProperties = (node as any).variantProperties;
        debugConsole.log(
          `  Instance "${instanceName}" -> variantProperties from instance: ${JSON.stringify(variantProperties)}`,
        );
      }

      // Also try getProperties() if available (some Figma API versions use this)
      // This is the recommended way to get both variant and component properties
      if (typeof (node as any).getProperties === "function") {
        try {
          const props = await (node as any).getProperties();
          if (props) {
            // Get variant properties from getProperties()
            if (props.variantProperties) {
              debugConsole.log(
                `  Instance "${instanceName}" -> variantProperties from getProperties(): ${JSON.stringify(props.variantProperties)}`,
              );
              // Use getProperties() result if it's different/more complete
              if (
                props.variantProperties &&
                Object.keys(props.variantProperties).length > 0
              ) {
                variantProperties = props.variantProperties;
              }
            }
            // Get component properties from getProperties() - this is the reliable way
            if (props.componentProperties) {
              // Use getProperties() result for component properties (more reliable than direct access)
              componentProperties = props.componentProperties;
            }
          }
        } catch (getPropsError) {
          // getProperties() might not be available or might fail
          debugConsole.log(
            `  Instance "${instanceName}" -> getProperties() not available or failed: ${getPropsError}`,
          );
        }
      }

      // Fallback: try direct property access if getProperties() didn't work or wasn't available
      if (!componentProperties && (node as any).componentProperties) {
        componentProperties = (node as any).componentProperties;
      }

      // If the main component is part of a component set, check if we can get variant properties from there
      // Sometimes the instance's variantProperties might be incomplete
      if (
        mainComponent.parent &&
        mainComponent.parent.type === "COMPONENT_SET"
      ) {
        const componentSet = mainComponent.parent;
        // Check if the main component has variant properties that we're missing
        // The component name might encode variant information (e.g., "Content=Icon")
        // But we should also check the component set's variant properties
        try {
          // Get the component set's property definitions to see what variant properties exist
          const componentSetProps = (componentSet as any)
            .componentPropertyDefinitions;
          if (componentSetProps) {
            debugConsole.log(
              `  Component set "${componentSet.name}" has property definitions: ${JSON.stringify(Object.keys(componentSetProps))}`,
            );
          }

          // Parse variant properties from component name (e.g., "Content=Icon" -> {"Content": "Icon"})
          // Component names in component sets often encode variant information
          // Format can be: "Property=Value" or "Property1=Value1, Property2=Value2"
          const nameBasedVariantProps: Record<string, string> = {};

          // First, try to split by comma to handle multiple properties
          const propertyPairs = componentName
            .split(",")
            .map((p: string) => p.trim());

          for (const pair of propertyPairs) {
            const nameParts = pair.split("=").map((p: string) => p.trim());
            if (nameParts.length >= 2) {
              const propertyName = nameParts[0];
              const propertyValue = nameParts.slice(1).join("=").trim(); // Join in case value contains "="

              // Check if this property exists in the component set's property definitions
              if (componentSetProps && componentSetProps[propertyName]) {
                nameBasedVariantProps[propertyName] = propertyValue;
              }
            }
          }

          if (Object.keys(nameBasedVariantProps).length > 0) {
            debugConsole.log(
              `  Parsed variant properties from component name "${componentName}": ${JSON.stringify(nameBasedVariantProps)}`,
            );
          }

          // Priority order for variant properties:
          // 1. Instance's variantProperties (most accurate - reflects user's current selection)
          // 2. Component name parsing (fallback if instance properties are missing)
          // 3. Main component's variantProperties (last resort)

          if (variantProperties && Object.keys(variantProperties).length > 0) {
            // Instance has variant properties - use them as the source of truth
            // This reflects the actual variant state the user has set in Figma
            debugConsole.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(variantProperties)}`,
            );
          } else if (Object.keys(nameBasedVariantProps).length > 0) {
            // No instance variant properties, but we parsed from component name - use those
            variantProperties = nameBasedVariantProps;
            debugConsole.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(variantProperties)}`,
            );
          } else {
            // Fallback: if we couldn't parse from name, check main component's variant properties
            if ((mainComponent as any).variantProperties) {
              const mainComponentVariantProps = (mainComponent as any)
                .variantProperties;
              debugConsole.log(
                `  Main component "${componentName}" has variantProperties: ${JSON.stringify(mainComponentVariantProps)}`,
              );
              variantProperties = mainComponentVariantProps;
            }
          }
        } catch (error) {
          debugConsole.warning(
            `  Could not get variant properties from component set: ${error}`,
          );
        }
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

          // Debug: log path building for components in Icons page
          if (
            componentSetName === "arrow-top-right-on-square" ||
            componentName === "arrow-top-right-on-square"
          ) {
            debugConsole.log(
              `  [PATH BUILD] Added segment: "${pathSegment}" (type: ${nodeType}) to path for component "${componentName}"`,
            );
          }

          current = current.parent;
          depth++;
        } catch (error) {
          // Debug: log errors during path building
          if (
            componentSetName === "arrow-top-right-on-square" ||
            componentName === "arrow-top-right-on-square"
          ) {
            debugConsole.warning(
              `  [PATH BUILD] Error building path for "${componentName}": ${error}`,
            );
          }
          break;
        }
      }

      mainComponentParentPath = pathNames;

      // Debug: log final path for components in Icons page
      if (
        componentSetName === "arrow-top-right-on-square" ||
        componentName === "arrow-top-right-on-square"
      ) {
        debugConsole.log(
          `  [PATH BUILD] Final path for component "${componentName}": [${pathNames.join(" → ")}]`,
        );
      }
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
      debugConsole.log(
        `  Found INSTANCE: "${instanceName}" -> INTERNAL component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)`,
      );

      // DEBUG: Check boundVariables on internal instances (for "Selection colors" etc.)
      const instanceBoundVars = (node as any).boundVariables;
      const mainComponentBoundVars = (mainComponent as any).boundVariables;
      if (instanceBoundVars && typeof instanceBoundVars === "object") {
        const boundVarKeys = Object.keys(instanceBoundVars);
        debugConsole.log(
          `  DEBUG: Internal instance "${instanceName}" -> boundVariables keys: ${boundVarKeys.length > 0 ? boundVarKeys.join(", ") : "none"}`,
        );
        // Log each bound variable key and its type
        for (const key of boundVarKeys) {
          const boundVar = instanceBoundVars[key];
          const boundVarType = boundVar?.type || typeof boundVar;
          debugConsole.log(
            `  DEBUG:   boundVariables.${key}: type=${boundVarType}, value=${JSON.stringify(boundVar)}`,
          );
        }
        // Check for specific properties that might be "Selection colors"
        const potentialSelectionColorKeys = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor",
        ];
        for (const potentialKey of potentialSelectionColorKeys) {
          if (instanceBoundVars[potentialKey] !== undefined) {
            debugConsole.log(
              `  DEBUG:   Found potential "Selection colors" property: boundVariables.${potentialKey} = ${JSON.stringify(instanceBoundVars[potentialKey])}`,
            );
          }
        }
      } else {
        debugConsole.log(
          `  DEBUG: Internal instance "${instanceName}" -> No boundVariables found on instance node`,
        );
      }
      if (
        mainComponentBoundVars &&
        typeof mainComponentBoundVars === "object"
      ) {
        const mainBoundVarKeys = Object.keys(mainComponentBoundVars);
        debugConsole.log(
          `  DEBUG: Main component "${componentName}" -> boundVariables keys: ${mainBoundVarKeys.length > 0 ? mainBoundVarKeys.join(", ") : "none"}`,
        );
      }

      // DEBUG: Check backgrounds property for bound variables (for "Selection colors")
      const instanceBackgrounds = (node as any).backgrounds;
      if (instanceBackgrounds && Array.isArray(instanceBackgrounds)) {
        debugConsole.log(
          `  DEBUG: Internal instance "${instanceName}" -> backgrounds array length: ${instanceBackgrounds.length}`,
        );
        for (let i = 0; i < instanceBackgrounds.length; i++) {
          const bg = instanceBackgrounds[i];
          if (bg && typeof bg === "object") {
            // Log the entire background object structure
            debugConsole.log(
              `  DEBUG:   backgrounds[${i}] structure: ${JSON.stringify(Object.keys(bg))}`,
            );
            if (bg.boundVariables) {
              const bgBoundVarKeys = Object.keys(bg.boundVariables);
              debugConsole.log(
                `  DEBUG:   backgrounds[${i}].boundVariables keys: ${bgBoundVarKeys.length > 0 ? bgBoundVarKeys.join(", ") : "none"}`,
              );
              for (const key of bgBoundVarKeys) {
                const bgBoundVar = bg.boundVariables[key];
                debugConsole.log(
                  `  DEBUG:     backgrounds[${i}].boundVariables.${key}: ${JSON.stringify(bgBoundVar)}`,
                );
              }
            }
            // Check if the background itself has a color property that might be bound
            if (bg.color) {
              debugConsole.log(
                `  DEBUG:   backgrounds[${i}].color: ${JSON.stringify(bg.color)}`,
              );
            }
          }
        }
      }

      // DEBUG: List all enumerable properties on internal instance to find "Selection colors" or similar
      // Filter out functions, internal properties, and common properties we already handle
      const instanceAllProps = Object.keys(node).filter(
        (key) =>
          !key.startsWith("_") &&
          key !== "parent" &&
          key !== "removed" &&
          typeof (node as any)[key] !== "function" &&
          key !== "type" &&
          key !== "id" &&
          key !== "name" &&
          key !== "boundVariables" &&
          key !== "backgrounds" &&
          key !== "fills",
      );
      const mainComponentAllProps = Object.keys(mainComponent).filter(
        (key) =>
          !key.startsWith("_") &&
          key !== "parent" &&
          key !== "removed" &&
          typeof (mainComponent as any)[key] !== "function" &&
          key !== "type" &&
          key !== "id" &&
          key !== "name" &&
          key !== "boundVariables" &&
          key !== "backgrounds" &&
          key !== "fills",
      );

      // Find properties that might be related to selection colors
      const selectionRelatedProps = [
        ...new Set([...instanceAllProps, ...mainComponentAllProps]),
      ].filter(
        (key) =>
          key.toLowerCase().includes("selection") ||
          key.toLowerCase().includes("select") ||
          (key.toLowerCase().includes("color") &&
            !key.toLowerCase().includes("fill") &&
            !key.toLowerCase().includes("stroke")),
      );

      if (selectionRelatedProps.length > 0) {
        debugConsole.log(
          `  DEBUG: Found selection/color-related properties: ${selectionRelatedProps.join(", ")}`,
        );
        // Log values for these properties
        for (const key of selectionRelatedProps) {
          try {
            if (instanceAllProps.includes(key)) {
              const value = (node as any)[key];
              debugConsole.log(
                `  DEBUG:   Instance.${key}: ${JSON.stringify(value)}`,
              );
            }
            if (mainComponentAllProps.includes(key)) {
              const value = (mainComponent as any)[key];
              debugConsole.log(
                `  DEBUG:   MainComponent.${key}: ${JSON.stringify(value)}`,
              );
            }
          } catch (e) {
            // Skip properties that can't be accessed
          }
        }
      } else {
        debugConsole.log(
          `  DEBUG: No selection/color-related properties found on instance or main component`,
        );
      }
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
          debugConsole.log(
            `  Found INSTANCE: "${instanceName}" -> NORMAL component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...) at path [${(mainComponentParentPath || []).join(" → ")}]`,
          );
        } else {
          debugConsole.warning(
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
        debugConsole.error(errorMessage);
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
      debugConsole.log(
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

      // Add remote-specific fields to entry BEFORE checking table (needed for key generation)
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

      // Check if this remote instance already exists in the table BEFORE extracting structure
      // This prevents duplicate structure extraction for the same remote component
      const existingIndex = context.instanceTable.getInstanceIndex(entry);
      if (existingIndex !== -1) {
        // Instance already exists - reuse it without extracting structure again
        debugConsole.log(
          `  Found INSTANCE: "${instanceName}" -> REMOTE component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)${isDetachedInstance ? " [DETACHED]" : ""}`,
        );
        // Skip structure extraction and go directly to adding to table
        // (addInstance will return the existing index)
      } else {
        // Instance doesn't exist yet - extract structure
        // For remote instances (including detached), we need to store the full structure
        // This is necessary since we can't resolve the reference
        // IMPORTANT: Extract from the instance node itself (not mainComponent) to preserve
        // size overrides and other instance-specific properties. The instance may have been
        // resized or have different child sizes due to constraints.
        try {
          // Extract base properties from the instance (preserves size overrides)
          const { parseBaseNodeProperties } = await import("./baseNodeParser");
          const baseProps = await parseBaseNodeProperties(node, context);

          // Extract frame properties from the instance
          const { parseFrameProperties } = await import("./frameParser");
          const frameProps = await parseFrameProperties(node, context);

          // Build the structure manually to avoid circular references
          // We'll extract children directly from the instance (which have the correct sizes)
          // IMPORTANT: Set type to COMPONENT AFTER spreading baseProps, since baseProps includes type: "INSTANCE"
          const structure: any = {
            ...baseProps,
            ...frameProps,
            type: "COMPONENT", // Convert to COMPONENT type for recreation (must be after baseProps to override)
          };

          // Extract children from the instance (preserves size overrides and constraints)
          // For nested instances, we need to extract their full structure too (not just references)
          if (
            node.children &&
            Array.isArray(node.children) &&
            node.children.length > 0
          ) {
            const childContext: Partial<ParserContext> = {
              ...context,
              depth: (context.depth || 0) + 1,
            };
            const { extractNodeData } = await import("../pageExportNew");
            const children: any[] = [];
            for (const child of node.children) {
              try {
                // For nested instances, we want the full structure, not a reference
                // So we extract from the child directly, treating it as a regular node
                // (not as an instance that should be processed by parseInstanceProperties)
                let childData;
                if (child.type === "INSTANCE") {
                  // For nested instances, extract their structure too (recursively)
                  // Get the main component and extract from it, but use the instance's size
                  try {
                    const nestedMainComponent = await (
                      child as any
                    ).getMainComponentAsync();
                    if (nestedMainComponent) {
                      // Extract from main component but preserve instance size
                      const nestedBaseProps = await parseBaseNodeProperties(
                        child,
                        context,
                      );
                      const nestedFrameProps = await parseFrameProperties(
                        child,
                        context,
                      );
                      const nestedStructure = await extractNodeData(
                        nestedMainComponent,
                        new WeakSet(),
                        childContext,
                      );
                      // Override with instance's actual properties (size, position, etc.)
                      childData = {
                        ...nestedStructure,
                        ...nestedBaseProps,
                        ...nestedFrameProps,
                        type: "COMPONENT", // Convert to COMPONENT
                      };
                    } else {
                      // Fallback: extract from child directly
                      childData = await extractNodeData(
                        child,
                        new WeakSet(),
                        childContext,
                      );
                      if (childData.type === "INSTANCE") {
                        childData.type = "COMPONENT";
                      }
                      delete childData._instanceRef;
                    }
                  } catch {
                    // Fallback: extract from child directly
                    childData = await extractNodeData(
                      child,
                      new WeakSet(),
                      childContext,
                    );
                    if (childData.type === "INSTANCE") {
                      childData.type = "COMPONENT";
                    }
                    delete childData._instanceRef;
                  }
                } else {
                  // Regular child - extract normally
                  childData = await extractNodeData(
                    child,
                    new WeakSet(),
                    childContext,
                  );

                  // DEBUG: Check if child has boundVariables for backgrounds (for "Selection colors")
                  // This is important for remote components where "Selection colors" might be bound
                  // on the main component's child but not visible on the instance's child
                  const childBoundVars = (child as any).boundVariables;
                  if (childBoundVars && typeof childBoundVars === "object") {
                    const childBoundVarKeys = Object.keys(childBoundVars);
                    if (childBoundVarKeys.length > 0) {
                      debugConsole.log(
                        `  DEBUG: Child "${child.name || "Unnamed"}" -> boundVariables keys: ${childBoundVarKeys.join(", ")}`,
                      );
                      // Check specifically for backgrounds
                      if (childBoundVars.backgrounds !== undefined) {
                        debugConsole.log(
                          `  DEBUG:   Child "${child.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(childBoundVars.backgrounds)}`,
                        );
                      }
                    }
                  }

                  // Also check the main component's corresponding child for bound variables
                  // "Selection colors" might be bound on the main component's child
                  if (
                    mainComponent.children &&
                    Array.isArray(mainComponent.children)
                  ) {
                    const mainComponentChild = mainComponent.children.find(
                      (mcChild: any) => mcChild.name === child.name,
                    );
                    if (mainComponentChild) {
                      const mainChildBoundVars = (mainComponentChild as any)
                        .boundVariables;
                      if (
                        mainChildBoundVars &&
                        typeof mainChildBoundVars === "object"
                      ) {
                        const mainChildBoundVarKeys =
                          Object.keys(mainChildBoundVars);
                        if (mainChildBoundVarKeys.length > 0) {
                          debugConsole.log(
                            `  DEBUG: Main component child "${mainComponentChild.name || "Unnamed"}" -> boundVariables keys: ${mainChildBoundVarKeys.join(", ")}`,
                          );
                          // Check specifically for backgrounds
                          if (mainChildBoundVars.backgrounds !== undefined) {
                            debugConsole.log(
                              `  DEBUG:   Main component child "${mainComponentChild.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(mainChildBoundVars.backgrounds)}`,
                            );
                            // If instance child doesn't have boundVariables.backgrounds but main component child does,
                            // we should preserve it in the extracted childData
                            if (
                              !childBoundVars ||
                              !childBoundVars.backgrounds
                            ) {
                              debugConsole.log(
                                `  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component`,
                              );
                              // Extract and merge boundVariables from main component child
                              const { extractBoundVariables } = await import(
                                "./boundVariableParser"
                              );
                              const mainChildBoundVarsExtracted =
                                await extractBoundVariables(
                                  mainChildBoundVars,
                                  context.variableTable,
                                  context.collectionTable,
                                );
                              // Merge into childData's boundVariables
                              if (!childData.boundVariables) {
                                childData.boundVariables = {};
                              }
                              if (mainChildBoundVarsExtracted.backgrounds) {
                                childData.boundVariables.backgrounds =
                                  mainChildBoundVarsExtracted.backgrounds;
                                debugConsole.log(
                                  `  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child`,
                                );
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                children.push(childData);
              } catch (childError) {
                console.warn(
                  `Failed to extract child "${child.name || "Unnamed"}" for remote component "${componentName}":`,
                  childError,
                );
                // Continue with other children even if one fails
              }
            }
            structure.children = children;
          }

          // Ensure structure is set
          if (!structure) {
            throw new Error("Failed to build structure for remote instance");
          }

          // CRITICAL: Handle fills and bound variables for the instance node
          // The instance may have boundVariables.fills even if it doesn't override fills
          // In that case, we need to get fills from the main component but preserve the instance's boundVariables
          try {
            // Check if instance has boundVariables for fills
            const instanceBoundVars = (node as any).boundVariables;

            // DEBUG: Log all boundVariables keys to see what properties are bound
            if (instanceBoundVars && typeof instanceBoundVars === "object") {
              const boundVarKeys = Object.keys(instanceBoundVars);
              debugConsole.log(
                `  DEBUG: Instance "${instanceName}" -> boundVariables keys: ${boundVarKeys.length > 0 ? boundVarKeys.join(", ") : "none"}`,
              );
              // Log each bound variable key and its type
              for (const key of boundVarKeys) {
                const boundVar = instanceBoundVars[key];
                const boundVarType = boundVar?.type || typeof boundVar;
                debugConsole.log(
                  `  DEBUG:   boundVariables.${key}: type=${boundVarType}, value=${JSON.stringify(boundVar)}`,
                );

                // DEBUG: Check for nested structures that might contain variable 57 (avatar/color/initials-ghost)
                // This helps us find where "Selection colors" might be stored
                if (
                  boundVar &&
                  typeof boundVar === "object" &&
                  !Array.isArray(boundVar)
                ) {
                  const nestedKeys = Object.keys(boundVar);
                  if (nestedKeys.length > 0) {
                    debugConsole.log(
                      `  DEBUG:     boundVariables.${key} has nested keys: ${nestedKeys.join(", ")}`,
                    );
                    // Check if any nested value is a VARIABLE_ALIAS that might be variable 57
                    for (const nestedKey of nestedKeys) {
                      const nestedValue = boundVar[nestedKey];
                      if (
                        nestedValue &&
                        typeof nestedValue === "object" &&
                        nestedValue.type === "VARIABLE_ALIAS"
                      ) {
                        debugConsole.log(
                          `  DEBUG:       boundVariables.${key}.${nestedKey}: VARIABLE_ALIAS id=${nestedValue.id}`,
                        );
                      }
                    }
                  }
                }
              }

              // DEBUG: Check for specific properties that might be "Selection colors"
              // "Selection colors" might be stored as boundVariables.backgrounds, boundVariables.selectionColor, etc.
              const potentialSelectionColorKeys = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor",
              ];
              for (const potentialKey of potentialSelectionColorKeys) {
                if (instanceBoundVars[potentialKey] !== undefined) {
                  debugConsole.log(
                    `  DEBUG:   Found potential "Selection colors" property: boundVariables.${potentialKey} = ${JSON.stringify(instanceBoundVars[potentialKey])}`,
                  );
                }
              }
            } else {
              debugConsole.log(
                `  DEBUG: Instance "${instanceName}" -> No boundVariables found on instance node`,
              );
            }

            const hasInstanceFillsBoundVar =
              instanceBoundVars &&
              instanceBoundVars.fills !== undefined &&
              instanceBoundVars.fills !== null;

            // Check if structure already has fills
            const structureHasFills =
              structure.fills !== undefined &&
              Array.isArray(structure.fills) &&
              structure.fills.length > 0;

            // Check if instance node has explicit fills
            const instanceHasFills =
              (node as any).fills !== undefined &&
              Array.isArray((node as any).fills) &&
              (node as any).fills.length > 0;

            // Check if main component has fills
            const mainComponentHasFills =
              mainComponent.fills !== undefined &&
              Array.isArray(mainComponent.fills) &&
              mainComponent.fills.length > 0;

            debugConsole.log(
              `  DEBUG: Instance "${instanceName}" -> fills check: instanceHasFills=${instanceHasFills}, structureHasFills=${structureHasFills}, mainComponentHasFills=${mainComponentHasFills}, hasInstanceFillsBoundVar=${!!hasInstanceFillsBoundVar}`,
            );

            // If instance has boundVariables.fills but structure doesn't have fills,
            // we need to get fills from either the instance or main component
            if (hasInstanceFillsBoundVar && !structureHasFills) {
              debugConsole.log(
                `  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills`,
              );
              try {
                // First try instance node's fills (if it has explicit fills)
                if (instanceHasFills) {
                  const { serializeFills } = await import(
                    "./boundVariableParser"
                  );
                  const instanceFills = await serializeFills(
                    (node as any).fills,
                    context.variableTable,
                    context.collectionTable,
                  );
                  structure.fills = instanceFills;
                  debugConsole.log(
                    `  DEBUG: Got ${instanceFills.length} fill(s) from instance node`,
                  );
                } else if (mainComponentHasFills) {
                  // Fallback: get fills from main component (instance inherits fills)
                  const { serializeFills } = await import(
                    "./boundVariableParser"
                  );
                  const mainComponentFills = await serializeFills(
                    mainComponent.fills,
                    context.variableTable,
                    context.collectionTable,
                  );
                  structure.fills = mainComponentFills;
                  debugConsole.log(
                    `  DEBUG: Got ${mainComponentFills.length} fill(s) from main component`,
                  );
                } else {
                  debugConsole.warning(
                    `  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills`,
                  );
                }
              } catch (fillsError) {
                debugConsole.warning(`  Failed to get fills: ${fillsError}`);
              }
            }

            // DEBUG: Check for selectionColor or other properties that might be bound to variables
            // but not stored in boundVariables
            const instanceSelectionColor = (node as any).selectionColor;
            const mainComponentSelectionColor = (mainComponent as any)
              .selectionColor;
            if (instanceSelectionColor !== undefined) {
              debugConsole.log(
                `  DEBUG: Instance "${instanceName}" -> selectionColor: ${JSON.stringify(instanceSelectionColor)}`,
              );
            }
            if (mainComponentSelectionColor !== undefined) {
              debugConsole.log(
                `  DEBUG: Main component "${componentName}" -> selectionColor: ${JSON.stringify(mainComponentSelectionColor)}`,
              );
            }

            // DEBUG: List all enumerable properties on instance to find "Selection colors" or similar
            // Filter out functions, internal properties, and common properties we already handle
            const instanceAllProps = Object.keys(node).filter(
              (key) =>
                !key.startsWith("_") &&
                key !== "parent" &&
                key !== "removed" &&
                typeof (node as any)[key] !== "function" &&
                key !== "type" &&
                key !== "id" &&
                key !== "name",
            );
            const mainComponentAllProps = Object.keys(mainComponent).filter(
              (key) =>
                !key.startsWith("_") &&
                key !== "parent" &&
                key !== "removed" &&
                typeof (mainComponent as any)[key] !== "function" &&
                key !== "type" &&
                key !== "id" &&
                key !== "name",
            );

            // Find properties that might be related to selection colors
            const selectionRelatedProps = [
              ...new Set([...instanceAllProps, ...mainComponentAllProps]),
            ].filter(
              (key) =>
                key.toLowerCase().includes("selection") ||
                key.toLowerCase().includes("select") ||
                (key.toLowerCase().includes("color") &&
                  !key.toLowerCase().includes("fill") &&
                  !key.toLowerCase().includes("stroke")),
            );

            if (selectionRelatedProps.length > 0) {
              debugConsole.log(
                `  DEBUG: Found selection/color-related properties: ${selectionRelatedProps.join(", ")}`,
              );
              // Log values for these properties
              for (const key of selectionRelatedProps) {
                try {
                  if (instanceAllProps.includes(key)) {
                    const value = (node as any)[key];
                    debugConsole.log(
                      `  DEBUG:   Instance.${key}: ${JSON.stringify(value)}`,
                    );
                  }
                  if (mainComponentAllProps.includes(key)) {
                    const value = (mainComponent as any)[key];
                    debugConsole.log(
                      `  DEBUG:   MainComponent.${key}: ${JSON.stringify(value)}`,
                    );
                  }
                } catch (e) {
                  // Skip properties that can't be accessed
                }
              }
            } else {
              debugConsole.log(
                `  DEBUG: No selection/color-related properties found on instance or main component`,
              );
            }

            // Check main component's boundVariables (may have properties like selectionColor that instance inherits)
            const mainComponentBoundVars = (mainComponent as any)
              .boundVariables;
            if (
              mainComponentBoundVars &&
              typeof mainComponentBoundVars === "object"
            ) {
              const mainBoundVarKeys = Object.keys(mainComponentBoundVars);
              if (mainBoundVarKeys.length > 0) {
                debugConsole.log(
                  `  DEBUG: Main component "${componentName}" -> boundVariables keys: ${mainBoundVarKeys.join(", ")}`,
                );
                // ISSUE #2: Special logging for selectionColor
                if (mainBoundVarKeys.includes("selectionColor")) {
                  debugConsole.log(
                    `[ISSUE #2 EXPORT] Main component "${componentName}" HAS selectionColor in boundVariables: ${JSON.stringify(mainComponentBoundVars.selectionColor)}`,
                  );
                } else {
                  debugConsole.log(
                    `[ISSUE #2 EXPORT] Main component "${componentName}" does NOT have selectionColor in boundVariables (has: ${mainBoundVarKeys.join(", ")})`,
                  );
                }
                // Log each bound variable key
                for (const key of mainBoundVarKeys) {
                  const boundVar = mainComponentBoundVars[key];
                  const boundVarType = boundVar?.type || typeof boundVar;
                  debugConsole.log(
                    `  DEBUG:   Main component boundVariables.${key}: type=${boundVarType}, value=${JSON.stringify(boundVar)}`,
                  );
                }
              } else {
                // ISSUE #2: Log when main component has no boundVariables
                debugConsole.log(
                  `[ISSUE #2 EXPORT] Main component "${componentName}" has no boundVariables`,
                );
              }
            } else {
              // ISSUE #2: Log when main component boundVariables is null/undefined
              debugConsole.log(
                `[ISSUE #2 EXPORT] Main component "${componentName}" boundVariables is null/undefined`,
              );
            }

            // Always preserve ALL boundVariables from the instance if they exist
            // This is critical - the instance may have boundVariables for fills, selectionColor, or other properties
            // that need to be preserved even if the structure already has some boundVariables from baseProps
            if (
              instanceBoundVars &&
              Object.keys(instanceBoundVars).length > 0
            ) {
              debugConsole.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(instanceBoundVars).length} key(s))`,
              );
              // Extract boundVariables from instance node
              const { extractBoundVariables } = await import(
                "./boundVariableParser"
              );
              const instanceBoundVarsExtracted = await extractBoundVariables(
                instanceBoundVars,
                context.variableTable,
                context.collectionTable,
              );

              // Merge instance's boundVariables into structure's boundVariables
              // Structure may already have boundVariables from baseProps, so we merge rather than replace
              if (!structure.boundVariables) {
                structure.boundVariables = {};
              }

              // Preserve ALL boundVariables from instance (fills, selectionColor, width, height, etc.)
              // Instance's boundVariables take precedence over baseProps since they reflect the actual instance state
              for (const [key, value] of Object.entries(
                instanceBoundVarsExtracted,
              )) {
                if (value !== undefined) {
                  // Check if structure already has this boundVariable (from baseProps)
                  if (structure.boundVariables[key] !== undefined) {
                    debugConsole.log(
                      `  DEBUG: Structure already has boundVariables.${key} from baseProps, but instance also has it - using instance's boundVariables.${key}`,
                    );
                  }
                  structure.boundVariables[key] = value;
                  debugConsole.log(
                    `  DEBUG: Set boundVariables.${key} in structure: ${JSON.stringify(value)}`,
                  );
                }
              }

              // Special handling for fills - log separately for clarity
              if (instanceBoundVarsExtracted.fills !== undefined) {
                debugConsole.log(
                  `  DEBUG: ✓ Preserved boundVariables.fills from instance`,
                );
              } else if (hasInstanceFillsBoundVar) {
                debugConsole.warning(
                  `  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it`,
                );
              }

              // Special handling for backgrounds - "Selection colors" might be stored here
              if (instanceBoundVarsExtracted.backgrounds !== undefined) {
                debugConsole.log(
                  `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(instanceBoundVarsExtracted.backgrounds)}`,
                );
              } else if (
                instanceBoundVars &&
                instanceBoundVars.backgrounds !== undefined
              ) {
                debugConsole.warning(
                  `  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it`,
                );
              }
            }

            // Also preserve boundVariables from main component if instance doesn't override them
            // This is important for properties like selectionColor that may be bound on the main component
            // but not explicitly overridden on the instance
            if (
              mainComponentBoundVars &&
              Object.keys(mainComponentBoundVars).length > 0
            ) {
              debugConsole.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(mainComponentBoundVars).length} key(s))`,
              );
              const { extractBoundVariables } = await import(
                "./boundVariableParser"
              );
              const mainComponentBoundVarsExtracted =
                await extractBoundVariables(
                  mainComponentBoundVars,
                  context.variableTable,
                  context.collectionTable,
                );

              // Merge main component's boundVariables into structure's boundVariables
              // Only add properties that aren't already set (instance takes precedence)
              if (!structure.boundVariables) {
                structure.boundVariables = {};
              }

              for (const [key, value] of Object.entries(
                mainComponentBoundVarsExtracted,
              )) {
                if (value !== undefined) {
                  // Only add if instance doesn't have this boundVariable (main component is fallback)
                  if (structure.boundVariables[key] === undefined) {
                    structure.boundVariables[key] = value;
                    // ISSUE #2: Special logging for selectionColor
                    if (key === "selectionColor") {
                      debugConsole.log(
                        `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${componentName}" to instance "${instanceName}": ${JSON.stringify(value)}`,
                      );
                    } else {
                      debugConsole.log(
                        `  DEBUG: Added boundVariables.${key} from main component (not in instance): ${JSON.stringify(value)}`,
                      );
                    }
                  } else {
                    // ISSUE #2: Special logging for selectionColor
                    if (key === "selectionColor") {
                      debugConsole.log(
                        `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${componentName}" (instance "${instanceName}" already has it)`,
                      );
                    } else {
                      debugConsole.log(
                        `  DEBUG: Skipped boundVariables.${key} from main component (instance already has it)`,
                      );
                    }
                  }
                }
              }
            }

            // Final debug: log what we have in the structure
            debugConsole.log(
              `  DEBUG: Final structure for "${componentName}": hasFills=${!!structure.fills}, fillsCount=${structure.fills?.length || 0}, hasBoundVars=${!!structure.boundVariables}, boundVarsKeys=${structure.boundVariables ? Object.keys(structure.boundVariables).join(", ") : "none"}`,
            );
            if (structure.boundVariables?.fills) {
              debugConsole.log(
                `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(structure.boundVariables.fills)}`,
              );
            }
          } catch (boundVarError) {
            debugConsole.warning(
              `  Failed to handle bound variables for fills: ${boundVarError}`,
            );
            // Continue anyway - structure is still valid without bound variables
          }

          entry.structure = structure;

          if (isDetachedInstance) {
            debugConsole.log(
              `  Extracted structure for detached component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)`,
            );
          } else {
            debugConsole.log(
              `  Extracted structure from instance for remote component "${componentName}" (preserving size overrides: ${node.width}x${node.height})`,
            );
          }

          debugConsole.log(
            `  Found INSTANCE: "${instanceName}" -> REMOTE component "${componentName}" (ID: ${mainComponent.id.substring(0, 8)}...)${isDetachedInstance ? " [DETACHED]" : ""}`,
          );
        } catch (extractError) {
          const errorMessage = `Failed to extract structure for remote component "${componentName}": ${extractError instanceof Error ? extractError.message : String(extractError)}`;
          console.error(errorMessage, extractError);
          debugConsole.error(errorMessage);
          // Don't set structure if extraction failed - this will cause import to skip it
          // which is better than importing incorrect data
        }
      }
    }

    // ISSUE #2: For normal instances, check main component's boundVariables and merge them
    // This is important for properties like selectionColor that may be bound on the main component
    // but not explicitly overridden on the instance
    if (instanceType === "normal" && mainComponent) {
      // Debug: Check if instance has children (it shouldn't for normal instances)
      if (
        node.children &&
        Array.isArray(node.children) &&
        node.children.length > 0
      ) {
        debugConsole.log(
          `[DEBUG] Normal instance "${instanceName}" has ${node.children.length} child(ren) (unexpected for normal instance):`,
        );
        for (let i = 0; i < Math.min(node.children.length, 5); i++) {
          const child = node.children[i];
          if (child) {
            const childName = (child as any).name || `Child ${i}`;
            const childType = (child as any).type || "UNKNOWN";
            const childBoundVars = (child as any).boundVariables;
            const childFills = (child as any).fills;
            debugConsole.log(
              `[DEBUG]   Child ${i}: "${childName}" (${childType}) - hasBoundVars=${!!childBoundVars}, hasFills=${!!childFills}`,
            );
            if (childBoundVars) {
              const childBoundVarKeys = Object.keys(childBoundVars);
              debugConsole.log(
                `[DEBUG]     boundVariables: ${childBoundVarKeys.join(", ")}`,
              );
            }
          }
        }
      }

      // Debug: Check main component's children for bound variables
      // Also compare with instance children to detect overrides
      if (
        mainComponent.children &&
        Array.isArray(mainComponent.children) &&
        mainComponent.children.length > 0
      ) {
        debugConsole.log(
          `[DEBUG] Main component "${componentName}" has ${mainComponent.children.length} child(ren):`,
        );
        for (let i = 0; i < Math.min(mainComponent.children.length, 5); i++) {
          const mainChild = mainComponent.children[i];
          if (mainChild) {
            const mainChildName = (mainChild as any).name || `Child ${i}`;
            const mainChildType = (mainChild as any).type || "UNKNOWN";
            const mainChildBoundVars = (mainChild as any).boundVariables;
            const mainChildFills = (mainChild as any).fills;
            debugConsole.log(
              `[DEBUG]   Main component child ${i}: "${mainChildName}" (${mainChildType}) - hasBoundVars=${!!mainChildBoundVars}, hasFills=${!!mainChildFills}`,
            );
            if (mainChildBoundVars) {
              const mainChildBoundVarKeys = Object.keys(mainChildBoundVars);
              debugConsole.log(
                `[DEBUG]     boundVariables: ${mainChildBoundVarKeys.join(", ")}`,
              );
              if (mainChildBoundVars.fills) {
                debugConsole.log(
                  `[DEBUG]     boundVariables.fills: ${JSON.stringify(mainChildBoundVars.fills)}`,
                );
              }
            }
            if (
              mainChildFills &&
              Array.isArray(mainChildFills) &&
              mainChildFills.length > 0
            ) {
              const firstFill = mainChildFills[0];
              if (firstFill && typeof firstFill === "object") {
                debugConsole.log(
                  `[DEBUG]     fills[0]: type=${firstFill.type}, color=${JSON.stringify((firstFill as any).color)}`,
                );
              }
            }

            // Check if instance has a matching child with different bound variables (instance override)
            if (
              node.children &&
              Array.isArray(node.children) &&
              i < node.children.length
            ) {
              const instanceChild = node.children[i];
              if (
                instanceChild &&
                (instanceChild as any).name === mainChildName
              ) {
                const instanceChildBoundVars = (instanceChild as any)
                  .boundVariables;
                const instanceChildBoundVarKeys = instanceChildBoundVars
                  ? Object.keys(instanceChildBoundVars)
                  : [];
                const mainChildBoundVarKeys = mainChildBoundVars
                  ? Object.keys(mainChildBoundVars)
                  : [];

                // Check if instance child has bound variables that main component child doesn't have
                const instanceOnlyBoundVars = instanceChildBoundVarKeys.filter(
                  (key) => !mainChildBoundVarKeys.includes(key),
                );
                if (instanceOnlyBoundVars.length > 0) {
                  debugConsole.log(
                    `[DEBUG] Instance "${instanceName}" child "${mainChildName}" has instance override bound variables: ${instanceOnlyBoundVars.join(", ")} (will be exported with instance children)`,
                  );
                  for (const key of instanceOnlyBoundVars) {
                    debugConsole.log(
                      `[DEBUG]   Instance child boundVariables.${key}: ${JSON.stringify(instanceChildBoundVars[key])}`,
                    );
                  }
                }
              }
            }
          }
        }
      }

      try {
        const mainComponentBoundVars = (mainComponent as any).boundVariables;
        if (
          mainComponentBoundVars &&
          typeof mainComponentBoundVars === "object"
        ) {
          const mainBoundVarKeys = Object.keys(mainComponentBoundVars);
          if (mainBoundVarKeys.length > 0) {
            debugConsole.log(
              `[ISSUE #2 EXPORT] Normal instance "${instanceName}" -> checking main component "${componentName}" boundVariables (${mainBoundVarKeys.length} key(s))`,
            );
            // ISSUE #2: Special logging for selectionColor
            if (mainBoundVarKeys.includes("selectionColor")) {
              debugConsole.log(
                `[ISSUE #2 EXPORT] Main component "${componentName}" HAS selectionColor in boundVariables: ${JSON.stringify(mainComponentBoundVars.selectionColor)}`,
              );
            } else {
              debugConsole.log(
                `[ISSUE #2 EXPORT] Main component "${componentName}" does NOT have selectionColor in boundVariables (has: ${mainBoundVarKeys.join(", ")})`,
              );
            }

            // Extract boundVariables from main component
            const { extractBoundVariables } = await import(
              "./boundVariableParser"
            );
            const mainComponentBoundVarsExtracted = await extractBoundVariables(
              mainComponentBoundVars,
              context.variableTable,
              context.collectionTable,
            );

            // Merge main component's boundVariables into result's boundVariables
            // Only add properties that aren't already set (instance takes precedence)
            if (!result.boundVariables) {
              result.boundVariables = {};
            }

            for (const [key, value] of Object.entries(
              mainComponentBoundVarsExtracted,
            )) {
              if (value !== undefined) {
                // Only add if instance doesn't have this boundVariable (main component is fallback)
                if (result.boundVariables[key] === undefined) {
                  result.boundVariables[key] = value;
                  // ISSUE #2: Special logging for selectionColor
                  if (key === "selectionColor") {
                    debugConsole.log(
                      `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${componentName}" to normal instance "${instanceName}": ${JSON.stringify(value)}`,
                    );
                  } else {
                    debugConsole.log(
                      `  DEBUG: Added boundVariables.${key} from main component to normal instance: ${JSON.stringify(value)}`,
                    );
                  }
                } else {
                  // ISSUE #2: Special logging for selectionColor
                  if (key === "selectionColor") {
                    debugConsole.log(
                      `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${componentName}" (normal instance "${instanceName}" already has it)`,
                    );
                  }
                }
              }
            }
          } else {
            debugConsole.log(
              `[ISSUE #2 EXPORT] Main component "${componentName}" has no boundVariables`,
            );
          }
        } else {
          debugConsole.log(
            `[ISSUE #2 EXPORT] Main component "${componentName}" boundVariables is null/undefined`,
          );
        }
      } catch (error) {
        debugConsole.warning(
          `[ISSUE #2 EXPORT] Error checking main component boundVariables for normal instance "${instanceName}": ${error}`,
        );
      }
    }

    // Add instance to table and get reference
    const instanceIndex = context.instanceTable.addInstance(entry);
    result._instanceRef = instanceIndex;

    handledKeys.add("_instanceRef");
  }

  return result;
}
