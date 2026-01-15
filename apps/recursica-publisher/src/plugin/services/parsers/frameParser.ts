/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FRAME_DEFAULTS, isDifferentFromDefault } from "./nodeDefaults";
import type { ParsedNodeData, ParserContext } from "./baseNodeParser";
import { debugConsole } from "../debugConsole";
import {
  getPageFromNode,
  getComponentMetadataFromPage,
} from "./instanceParser";
import type { InstanceTableEntry } from "./instanceTable";

/**
 * Parser for FRAME, COMPONENT, COMPONENT_SET, and INSTANCE node types
 * All of these node types support auto-layout properties
 */
export async function parseFrameProperties(
  node: any,
  _context: ParserContext,
): Promise<Partial<ParsedNodeData>> {
  const result: Partial<ParsedNodeData> = {};
  const handledKeys = new Set<string>();

  // For COMPONENT and COMPONENT_SET nodes, export component property definitions
  // This is needed to recreate components with the same properties during import
  // COMPONENT_SET nodes store component properties for variant components
  if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
    try {
      if ((node as any).componentPropertyDefinitions) {
        // Process componentPropertyDefinitions to convert INSTANCE_SWAP defaultValue
        // from component ID to _instanceRef in the instance table
        const processedProps = await processComponentPropertyDefinitions(
          node,
          (node as any).componentPropertyDefinitions,
          _context,
        );
        result.componentPropertyDefinitions = processedProps;
        handledKeys.add("componentPropertyDefinitions");
        debugConsole.log(
          `  [EXPORT] ✓ Exported componentPropertyDefinitions for ${node.type} node "${node.name || "Unnamed"}": ${Object.keys(processedProps).length} property(ies)`,
        );
      }
    } catch {
      // Property definitions might not be accessible
    }
  }

  // Layout properties
  if (
    node.layoutMode !== undefined &&
    isDifferentFromDefault(node.layoutMode, FRAME_DEFAULTS.layoutMode)
  ) {
    result.layoutMode = node.layoutMode;
    handledKeys.add("layoutMode");
  }
  // Special handling for component variants: check parent COMPONENT_SET if variant has default/undefined sizing mode
  // In Figma UI, variants may show sizing mode from the COMPONENT_SET parent
  // Note: "Fill Container" in the UI is represented by having width/minWidth/maxWidth bound to variables,
  // not by setting primaryAxisSizingMode to "FILL" (which is not a valid API value)
  let primaryAxisSizingModeToUse = node.primaryAxisSizingMode;
  if (node.type === "COMPONENT" && node.parent?.type === "COMPONENT_SET") {
    const componentSet = node.parent;
    // Get width and bound variables for comprehensive debugging
    const variantWidth = (node as any).width;
    const variantWidthBoundVar = (node as any).boundVariables?.width;
    const variantMinWidthBoundVar = (node as any).boundVariables?.minWidth;
    const variantMaxWidthBoundVar = (node as any).boundVariables?.maxWidth;
    const componentSetWidth = (componentSet as any).width;
    const componentSetWidthBoundVar = (componentSet as any).boundVariables
      ?.width;

    // If variant has default/undefined sizing mode, check parent COMPONENT_SET
    if (
      primaryAxisSizingModeToUse === undefined ||
      primaryAxisSizingModeToUse === FRAME_DEFAULTS.primaryAxisSizingMode
    ) {
      if (
        componentSet.primaryAxisSizingMode !== undefined &&
        componentSet.primaryAxisSizingMode !==
          FRAME_DEFAULTS.primaryAxisSizingMode
      ) {
        primaryAxisSizingModeToUse = componentSet.primaryAxisSizingMode;
        debugConsole.log(
          `[EXPORT DEBUG] Component variant "${node.name}" (ID: ${node.id.substring(0, 8)}...): Using parent COMPONENT_SET primaryAxisSizingMode = "${primaryAxisSizingModeToUse}" (variant had "${node.primaryAxisSizingMode}")`,
        );
      } else {
        debugConsole.log(
          `[EXPORT DEBUG] Component variant "${node.name}" (ID: ${node.id.substring(0, 8)}...): primaryAxisSizingMode = "${node.primaryAxisSizingMode}", layoutMode = "${node.layoutMode}", default = "${FRAME_DEFAULTS.primaryAxisSizingMode}", parent = "${componentSet.primaryAxisSizingMode}"`,
        );
      }
    } else {
      // Variant has non-default value - log comprehensive info including width and bound variables
      debugConsole.log(
        `[EXPORT DEBUG] Component variant "${node.name}" (ID: ${node.id.substring(0, 8)}...): primaryAxisSizingMode = "${node.primaryAxisSizingMode}", layoutMode = "${node.layoutMode}", width = ${variantWidth}, widthBoundVar = ${variantWidthBoundVar ? JSON.stringify(variantWidthBoundVar) : "none"}, minWidthBoundVar = ${variantMinWidthBoundVar ? JSON.stringify(variantMinWidthBoundVar) : "none"}, maxWidthBoundVar = ${variantMaxWidthBoundVar ? JSON.stringify(variantMaxWidthBoundVar) : "none"}, parent COMPONENT_SET: primaryAxisSizingMode = "${componentSet.primaryAxisSizingMode}", width = ${componentSetWidth}, widthBoundVar = ${componentSetWidthBoundVar ? JSON.stringify(componentSetWidthBoundVar) : "none"}`,
      );
    }
  }

  if (
    primaryAxisSizingModeToUse !== undefined &&
    isDifferentFromDefault(
      primaryAxisSizingModeToUse,
      FRAME_DEFAULTS.primaryAxisSizingMode,
    )
  ) {
    result.primaryAxisSizingMode = primaryAxisSizingModeToUse;
    handledKeys.add("primaryAxisSizingMode");
    if (node.type === "COMPONENT" && node.parent?.type === "COMPONENT_SET") {
      debugConsole.log(
        `[EXPORT DEBUG] Component variant "${node.name}" (ID: ${node.id.substring(0, 8)}...): Exporting primaryAxisSizingMode = "${primaryAxisSizingModeToUse}"`,
      );
    }
  } else if (
    node.type === "COMPONENT" &&
    node.parent?.type === "COMPONENT_SET"
  ) {
    debugConsole.log(
      `[EXPORT DEBUG] Component variant "${node.name}" (ID: ${node.id.substring(0, 8)}...): NOT exporting primaryAxisSizingMode (undefined or default)`,
    );
  }
  if (
    node.counterAxisSizingMode !== undefined &&
    isDifferentFromDefault(
      node.counterAxisSizingMode,
      FRAME_DEFAULTS.counterAxisSizingMode,
    )
  ) {
    result.counterAxisSizingMode = node.counterAxisSizingMode;
    handledKeys.add("counterAxisSizingMode");
  }
  if (
    node.primaryAxisAlignItems !== undefined &&
    isDifferentFromDefault(
      node.primaryAxisAlignItems,
      FRAME_DEFAULTS.primaryAxisAlignItems,
    )
  ) {
    result.primaryAxisAlignItems = node.primaryAxisAlignItems;
    handledKeys.add("primaryAxisAlignItems");
  }
  if (
    node.counterAxisAlignItems !== undefined &&
    isDifferentFromDefault(
      node.counterAxisAlignItems,
      FRAME_DEFAULTS.counterAxisAlignItems,
    )
  ) {
    result.counterAxisAlignItems = node.counterAxisAlignItems;
    handledKeys.add("counterAxisAlignItems");
  }
  if (
    node.paddingLeft !== undefined &&
    isDifferentFromDefault(node.paddingLeft, FRAME_DEFAULTS.paddingLeft)
  ) {
    result.paddingLeft = node.paddingLeft;
    handledKeys.add("paddingLeft");
  }
  if (
    node.paddingRight !== undefined &&
    isDifferentFromDefault(node.paddingRight, FRAME_DEFAULTS.paddingRight)
  ) {
    result.paddingRight = node.paddingRight;
    handledKeys.add("paddingRight");
  }
  if (
    node.paddingTop !== undefined &&
    isDifferentFromDefault(node.paddingTop, FRAME_DEFAULTS.paddingTop)
  ) {
    result.paddingTop = node.paddingTop;
    handledKeys.add("paddingTop");
  }
  if (
    node.paddingBottom !== undefined &&
    isDifferentFromDefault(node.paddingBottom, FRAME_DEFAULTS.paddingBottom)
  ) {
    result.paddingBottom = node.paddingBottom;
    handledKeys.add("paddingBottom");
  }
  if (
    node.itemSpacing !== undefined &&
    isDifferentFromDefault(node.itemSpacing, FRAME_DEFAULTS.itemSpacing)
  ) {
    result.itemSpacing = node.itemSpacing;
    handledKeys.add("itemSpacing");
  }
  if (
    node.counterAxisSpacing !== undefined &&
    isDifferentFromDefault(
      node.counterAxisSpacing,
      FRAME_DEFAULTS.counterAxisSpacing,
    )
  ) {
    result.counterAxisSpacing = node.counterAxisSpacing;
    handledKeys.add("counterAxisSpacing");
  }
  if (
    node.cornerRadius !== undefined &&
    isDifferentFromDefault(node.cornerRadius, FRAME_DEFAULTS.cornerRadius)
  ) {
    result.cornerRadius = node.cornerRadius;
    handledKeys.add("cornerRadius");
  }
  if (
    node.clipsContent !== undefined &&
    isDifferentFromDefault(node.clipsContent, FRAME_DEFAULTS.clipsContent)
  ) {
    result.clipsContent = node.clipsContent;
    handledKeys.add("clipsContent");
  }
  if (
    node.layoutWrap !== undefined &&
    isDifferentFromDefault(node.layoutWrap, FRAME_DEFAULTS.layoutWrap)
  ) {
    result.layoutWrap = node.layoutWrap;
    handledKeys.add("layoutWrap");
  }
  if (
    node.layoutGrow !== undefined &&
    isDifferentFromDefault(node.layoutGrow, FRAME_DEFAULTS.layoutGrow)
  ) {
    result.layoutGrow = node.layoutGrow;
    handledKeys.add("layoutGrow");
  }

  // Export layoutSizingHorizontal and layoutSizingVertical (these control "Fill Container" behavior)
  // These are shorthands that set multiple layout properties including layoutGrow, layoutAlign, etc.
  // Valid values: "FIXED", "HUG", "FILL"
  if ((node as any).layoutSizingHorizontal !== undefined) {
    result.layoutSizingHorizontal = (node as any).layoutSizingHorizontal;
    handledKeys.add("layoutSizingHorizontal");
  }
  if ((node as any).layoutSizingVertical !== undefined) {
    result.layoutSizingVertical = (node as any).layoutSizingVertical;
    handledKeys.add("layoutSizingVertical");
  }

  // Note: Unhandled keys are tracked centrally in extractNodeData

  return result;
}

/**
 * Processes componentPropertyDefinitions to convert INSTANCE_SWAP defaultValue
 * from component ID to _instanceRef in the instance table.
 *
 * For INSTANCE_SWAP properties, the defaultValue is a component ID.
 * We need to find the instance node within the component/component set that uses
 * that component, add it to the instance table, and replace the defaultValue with _instanceRef.
 */
async function processComponentPropertyDefinitions(
  componentOrSet: any,
  propertyDefinitions: ComponentPropertyDefinitions,
  context: ParserContext,
): Promise<any> {
  // Return type is 'any' because we modify defaultValue to be {_instanceRef: number}
  // instead of the original string/boolean, which is our JSON export format
  const processed: any = {};

  for (const [propId, propDef] of Object.entries(propertyDefinitions)) {
    // Check if this is an INSTANCE_SWAP property
    if (propDef.type === "INSTANCE_SWAP" && propDef.defaultValue) {
      const componentId = propDef.defaultValue as string;

      debugConsole.log(
        `  [EXPORT] Processing INSTANCE_SWAP property "${propId}" with defaultValue (component ID): ${componentId.substring(0, 8)}...`,
      );

      try {
        // Find the instance node within the component/component set that uses this component
        const instanceNode = await findInstanceByComponentId(
          componentOrSet,
          componentId,
        );

        if (!instanceNode) {
          debugConsole.warning(
            `  [EXPORT] Could not find instance node for INSTANCE_SWAP property "${propId}" with component ID ${componentId.substring(0, 8)}... - keeping original defaultValue`,
          );
          // Keep original property definition if we can't find the instance
          processed[propId] = propDef;
          continue;
        }

        // Get the main component from the instance to verify it matches
        const mainComponent = await instanceNode.getMainComponentAsync();
        if (!mainComponent || mainComponent.id !== componentId) {
          debugConsole.warning(
            `  [EXPORT] Instance node found but main component doesn't match for INSTANCE_SWAP property "${propId}" - keeping original defaultValue`,
          );
          processed[propId] = propDef;
          continue;
        }

        // Create instance table entry for this instance
        const instanceEntry = await createInstanceTableEntryForInstance(
          instanceNode,
          context,
        );

        if (!instanceEntry) {
          debugConsole.warning(
            `  [EXPORT] Could not create instance table entry for INSTANCE_SWAP property "${propId}" - keeping original defaultValue`,
          );
          processed[propId] = propDef;
          continue;
        }

        // Add to instance table and get index
        const instanceIndex = context.instanceTable.addInstance(instanceEntry);

        // Replace defaultValue with _instanceRef
        processed[propId] = {
          ...propDef,
          defaultValue: { _instanceRef: instanceIndex },
        };

        debugConsole.log(
          `  [EXPORT] ✓ Converted INSTANCE_SWAP property "${propId}" defaultValue from component ID to _instanceRef (index: ${instanceIndex})`,
        );
      } catch (error) {
        debugConsole.warning(
          `  [EXPORT] Error processing INSTANCE_SWAP property "${propId}": ${error instanceof Error ? error.message : String(error)} - keeping original defaultValue`,
        );
        // Keep original property definition on error
        processed[propId] = propDef;
      }
    } else {
      // Not an INSTANCE_SWAP property, keep as-is
      processed[propId] = propDef;
    }
  }

  return processed;
}

/**
 * Finds an instance node within a component or component set that uses the specified component ID.
 * Searches recursively through all children.
 */
async function findInstanceByComponentId(
  parentNode: any,
  componentId: string,
): Promise<any | null> {
  // Search through all children recursively
  const searchChildren = async (node: any): Promise<any | null> => {
    if (!node || !node.children) {
      return null;
    }

    for (const child of node.children) {
      // Check if this child is an instance with the matching component
      if (child.type === "INSTANCE") {
        try {
          const mainComponent = await child.getMainComponentAsync();
          if (mainComponent && mainComponent.id === componentId) {
            return child;
          }
        } catch {
          // Ignore errors when getting main component
        }
      }

      // Recursively search children
      const found = await searchChildren(child);
      if (found) {
        return found;
      }
    }

    return null;
  };

  return searchChildren(parentNode);
}

/**
 * Creates an instance table entry for an instance node.
 * This is a simplified version that creates an "internal" instance entry.
 * For more complex scenarios (normal, remote), we'd need to use the full
 * instance parser logic, but for INSTANCE_SWAP within a component, internal is sufficient.
 */
async function createInstanceTableEntryForInstance(
  instanceNode: any,
  _context: ParserContext,
): Promise<InstanceTableEntry | null> {
  try {
    const mainComponent = await instanceNode.getMainComponentAsync();
    if (!mainComponent) {
      return null;
    }

    // Get pages for classification
    const instancePageResult = getPageFromNode(instanceNode);
    const instancePage = instancePageResult.page;
    const componentPageResult = getPageFromNode(mainComponent);
    let componentPage = componentPageResult.page;
    let pageFoundViaSearch = false; // Track if we found page via search (indicates parent traversal may not work)
    let foundComponentOnPage: any = null; // Store the component found on the page (for path building)

    // If componentPage is null, try to find it by searching pages or ID prefix
    // This handles cases where components inside COMPONENT_SET nodes can't traverse to their page
    // or when remote components exist on local pages but getPageFromNode returns null
    // In Figma, nodes on the same page share the same ID prefix (before the colon)
    if (!componentPage) {
      try {
        await figma.loadAllPagesAsync();
        const allPages = figma.root.children;

        // Try to find the component by searching pages
        let foundOnPage: any = null;
        let foundComponent: any = null;
        for (const page of allPages) {
          try {
            const component = page.findOne(
              (n: any) => n.id === mainComponent.id,
            );
            if (component) {
              foundOnPage = page;
              foundComponent = component; // Store the found component
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
              // Try to find component on this page
              try {
                foundComponent = foundOnPage.findOne(
                  (n: any) => n.id === mainComponent.id,
                );
              } catch {
                // Component search might fail
              }
              break;
            }
          }
        }

        if (foundOnPage) {
          componentPage = foundOnPage;
          foundComponentOnPage = foundComponent; // Store for later use
          pageFoundViaSearch = true; // Mark that we found page via search
          debugConsole.log(
            `  [EXPORT] Found page "${foundOnPage.name}" for component "${mainComponent.name}" using page search/ID prefix lookup (componentPage was null)`,
          );
          if (!foundComponent) {
            debugConsole.warning(
              `  [EXPORT] Found page "${foundOnPage.name}" but could not find component "${mainComponent.name}" (ID: ${mainComponent.id.substring(0, 8)}...) on page - will try recursive search by name`,
            );
            // Try recursive search to find the component by name (handles variants inside COMPONENT_SET)
            // Library components may have different IDs, so search by name instead
            // CRITICAL: If the original component is in a COMPONENT_SET, prefer matching that COMPONENT_SET
            try {
              const componentName = mainComponent.name;
              // Determine the original component's parent COMPONENT_SET name (if any)
              let originalComponentSetName: string | null = null;
              try {
                if (
                  mainComponent.parent &&
                  mainComponent.parent.type === "COMPONENT_SET"
                ) {
                  originalComponentSetName = mainComponent.parent.name;
                }
              } catch {
                // Can't access parent, that's okay
              }

              const recursiveSearchByName = (
                node: any,
                preferComponentSet: string | null = null,
              ): any => {
                // Check if this node matches by ID (first try - most reliable)
                if (node.id === mainComponent.id) {
                  return node;
                }
                // If this is a COMPONENT_SET, check its variants
                if (node.type === "COMPONENT_SET" && node.children) {
                  // If we have a preferred COMPONENT_SET name, only search in matching sets
                  if (preferComponentSet && node.name !== preferComponentSet) {
                    // Skip this COMPONENT_SET - not the one we're looking for
                    // Don't recurse into it either
                    return null;
                  }
                  // Search variants in this COMPONENT_SET
                  for (const variant of node.children) {
                    if (
                      variant.type === "COMPONENT" &&
                      variant.name === componentName
                    ) {
                      return variant;
                    }
                  }
                }
                // Check if this node matches by name and type (standalone components)
                // Only return standalone components if we're not looking for a variant in a COMPONENT_SET
                if (
                  node.type === "COMPONENT" &&
                  node.name === componentName &&
                  !preferComponentSet
                ) {
                  return node;
                }
                // Recursively search children
                if (node.children && Array.isArray(node.children)) {
                  // If we have a preferred COMPONENT_SET, ONLY search in that set
                  if (preferComponentSet) {
                    for (const child of node.children) {
                      if (
                        child.type === "COMPONENT_SET" &&
                        child.name === preferComponentSet
                      ) {
                        const result = recursiveSearchByName(
                          child,
                          preferComponentSet,
                        );
                        if (result) return result;
                      }
                      // Also recurse into FRAMEs and GROUPs (they might contain the preferred COMPONENT_SET)
                      if (child.type === "FRAME" || child.type === "GROUP") {
                        const result = recursiveSearchByName(
                          child,
                          preferComponentSet,
                        );
                        if (result) return result;
                      }
                    }
                  } else {
                    // No preferred set - search all children
                    for (const child of node.children) {
                      const result = recursiveSearchByName(
                        child,
                        preferComponentSet,
                      );
                      if (result) return result;
                    }
                  }
                }
                return null;
              };
              foundComponent = recursiveSearchByName(
                foundOnPage,
                originalComponentSetName,
              );
              if (foundComponent) {
                foundComponentOnPage = foundComponent;
                const foundInSet =
                  foundComponent.parent &&
                  foundComponent.parent.type === "COMPONENT_SET"
                    ? foundComponent.parent.name
                    : "standalone";
                const expectedSet = originalComponentSetName || "any";
                debugConsole.log(
                  `  [EXPORT] Found component "${mainComponent.name}" using recursive search by name (found ID: ${foundComponent.id.substring(0, 8)}..., original ID: ${mainComponent.id.substring(0, 8)}..., found in COMPONENT_SET: "${foundInSet}", expected: "${expectedSet}")`,
                );
                if (
                  originalComponentSetName &&
                  foundInSet !== originalComponentSetName
                ) {
                  debugConsole.warning(
                    `  [EXPORT] ⚠ Component found in wrong COMPONENT_SET! Expected "${originalComponentSetName}" but found in "${foundInSet}". This may cause incorrect path building.`,
                  );
                }
              } else {
                debugConsole.warning(
                  `  [EXPORT] Recursive search by name did not find component "${mainComponent.name}"${originalComponentSetName ? ` in COMPONENT_SET "${originalComponentSetName}"` : ""} on page "${foundOnPage.name}"`,
                );
              }
            } catch (error) {
              debugConsole.warning(
                `  [EXPORT] Recursive search failed: ${error instanceof Error ? error.message : String(error)}`,
              );
            }
          }
        } else {
          debugConsole.warning(
            `  [EXPORT] Could not find page for component "${mainComponent.name}" (ID: ${mainComponent.id.substring(0, 8)}...) - page search and ID prefix lookup both failed`,
          );
        }
      } catch (error) {
        // If page lookup fails, continue with componentPage as null
        debugConsole.warning(
          `  [EXPORT] Error during page lookup for component "${mainComponent.name}": ${error}`,
        );
      }
    }

    // Determine instance type using the same logic as instanceParser.ts
    // This handles the case where components with remote === true might actually
    // exist on a local page (should be treated as "normal", not "remote")
    const isRemote = mainComponent.remote === true;
    let instanceType: "internal" | "normal" | "remote";

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
        if (metadata?.id) {
          debugConsole.log(
            `  [EXPORT] Component "${mainComponent.name}" is from library but also exists on local page "${componentPage.name}" with metadata. Treating as "normal" instance for INSTANCE_SWAP.`,
          );
        } else {
          debugConsole.log(
            `  [EXPORT] Component "${mainComponent.name}" is from library and exists on local page "${componentPage.name}" (no metadata). Treating as "normal" instance for INSTANCE_SWAP - page should be published first.`,
          );
        }
      } else {
        // Component is not on a local page - truly external library, treat as "remote"
        instanceType = "remote";
        debugConsole.warning(
          `  [EXPORT] Component "${mainComponent.name}" is from library and not on a local page. Treating as "remote" instance for INSTANCE_SWAP. This may cause issues during import.`,
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
      // componentPage is null - fallback to normal
      instanceType = "normal";
      debugConsole.warning(
        `  [EXPORT] Could not determine page for component "${mainComponent.name}" in INSTANCE_SWAP. Treating as "normal" instance.`,
      );
    }

    // Extract variant and component properties
    let variantProperties: Record<string, string> | undefined;
    let componentProperties: Record<string, any> | undefined;

    try {
      if (typeof (instanceNode as any).getProperties === "function") {
        const props = await (instanceNode as any).getProperties();
        if (props) {
          variantProperties = props.variantProperties;
          componentProperties = props.componentProperties;
        }
      }
    } catch {
      // Properties might not be accessible
    }

    // Build path using node names and IDs (required for normal instances)
    // Note: We cannot use node IDs for normal instances because IDs differ across files/users
    // We handle:
    // 1. Empty names: Represented as empty strings in the array
    // 2. Duplicate names: Store them, validation during import will check multiple paths
    // 3. Path is stored as array to avoid separator conflicts
    let mainComponentParentPath: string[] | undefined;
    let mainComponentNodePath: string[] | undefined;
    let componentSetName: string | undefined;

    if (instanceType === "normal" || instanceType === "internal") {
      try {
        // If we found the page via search, parent traversal from mainComponent may not work
        // In this case, use the component we found earlier and traverse up from there
        if (pageFoundViaSearch && componentPage) {
          if (!foundComponentOnPage) {
            debugConsole.warning(
              `  [EXPORT] Page found via search but component not found - falling back to parent traversal for "${mainComponent.name}"`,
            );
          } else {
            debugConsole.log(
              `  [EXPORT] Building path from page root for component "${mainComponent.name}" (page found via search, parent traversal may not work)`,
            );
          }
        }

        if (pageFoundViaSearch && componentPage && foundComponentOnPage) {
          try {
            // Use the component we found when searching for the page
            const foundComponent = foundComponentOnPage;
            // Now traverse up from the found component to build the path
            // For variants, we want the path to the COMPONENT_SET, not the variant itself
            let current: any = foundComponent;
            const pathNames: string[] = [];
            const nodeIds: string[] = [];
            let depth = 0;
            const maxDepth = 20;

            // If the found component is a variant (COMPONENT), start from its parent (COMPONENT_SET)
            if (current.type === "COMPONENT" && current.parent) {
              current = current.parent;
              // Capture component set name
              if (current.type === "COMPONENT_SET" && !componentSetName) {
                componentSetName = current.name;
              }
            }

            // Traverse up to the page
            while (current && depth < maxDepth) {
              try {
                const nodeType = current.type;
                const nodeName = current.name;

                if (nodeType === "COMPONENT_SET" && !componentSetName) {
                  componentSetName = nodeName;
                }

                // Stop at PAGE - don't include PAGE in path
                if (nodeType === "PAGE") {
                  debugConsole.log(
                    `  [EXPORT] Reached PAGE at depth ${depth} for component "${mainComponent.name}" - stopping path traversal`,
                  );
                  break;
                }

                // Build both name path and node ID path
                // Include ALL parent nodes (FRAME, GROUP, COMPONENT_SET, etc.) except PAGE
                const pathSegment = nodeName || "";
                pathNames.unshift(pathSegment);
                nodeIds.unshift(current.id);

                debugConsole.log(
                  `  [EXPORT] Added path segment "${pathSegment}" (type: ${nodeType}, depth: ${depth}) for component "${mainComponent.name}"`,
                );

                // Move to parent node
                const nextParent = current.parent;
                if (!nextParent) {
                  debugConsole.warning(
                    `  [EXPORT] No parent found at depth ${depth} for component "${mainComponent.name}" - path may be incomplete`,
                  );
                  break;
                }
                current = nextParent;
                depth++;
              } catch (error) {
                // Error during path building - log and break
                debugConsole.warning(
                  `  [EXPORT] Error building path segment at depth ${depth} for component "${mainComponent.name}": ${error instanceof Error ? error.message : String(error)}`,
                );
                break;
              }
            }

            mainComponentParentPath = pathNames;
            mainComponentNodePath = nodeIds;

            if (mainComponentParentPath.length > 0) {
              debugConsole.log(
                `  [EXPORT] Built path from page root for component "${mainComponent.name}": [${mainComponentParentPath.join(" → ")}]`,
              );
              // If path only has COMPONENT_SET (1 segment), it might be missing the FRAME parent
              // This suggests the traversal stopped early - try parent traversal as fallback
              if (
                mainComponentParentPath.length === 1 &&
                componentSetName &&
                mainComponentParentPath[0] === componentSetName
              ) {
                debugConsole.warning(
                  `  [EXPORT] Path only contains COMPONENT_SET "${componentSetName}" - may be missing parent FRAME/GROUP. Trying parent traversal fallback...`,
                );
                // Fall through to parent traversal
                mainComponentParentPath = undefined;
                mainComponentNodePath = undefined;
              }
            } else {
              debugConsole.warning(
                `  [EXPORT] Built empty path for component "${mainComponent.name}" - component may be at page root`,
              );
            }
          } catch (error) {
            debugConsole.warning(
              `  [EXPORT] Error finding component on page for path building: ${error instanceof Error ? error.message : String(error)}`,
            );
            // Fall through to parent traversal
            mainComponentParentPath = undefined;
            mainComponentNodePath = undefined;
          }
        }

        // Use parent traversal if page-found-via-search path building failed or was incomplete
        if (!mainComponentParentPath || mainComponentParentPath.length === 0) {
          // Use parent traversal (works when component is accessible)
          let current: any = mainComponent.parent;
          const pathNames: string[] = [];
          const nodeIds: string[] = [];
          let depth = 0;
          const maxDepth = 20;

          while (current && depth < maxDepth) {
            try {
              const nodeType = current.type;
              const nodeName = current.name;

              if (nodeType === "COMPONENT_SET" && !componentSetName) {
                componentSetName = nodeName;
              }

              // Stop at PAGE - don't include PAGE in path
              if (nodeType === "PAGE") {
                debugConsole.log(
                  `  [EXPORT] Reached PAGE at depth ${depth} for component "${mainComponent.name}" - stopping path traversal`,
                );
                break;
              }

              // Build both name path and node ID path
              // Include all parent nodes (FRAME, GROUP, COMPONENT_SET, etc.) except PAGE
              const pathSegment = nodeName || "";
              pathNames.unshift(pathSegment);
              nodeIds.unshift(current.id); // Node IDs are guaranteed unique

              debugConsole.log(
                `  [EXPORT] Added path segment "${pathSegment}" (type: ${nodeType}, depth: ${depth}) for component "${mainComponent.name}"`,
              );

              // Move to parent node
              const nextParent = current.parent;
              if (!nextParent) {
                debugConsole.warning(
                  `  [EXPORT] No parent found at depth ${depth} for component "${mainComponent.name}" - path may be incomplete`,
                );
                break;
              }
              current = nextParent;
              depth++;
            } catch (error) {
              // Error during path building - log and break
              debugConsole.warning(
                `  [EXPORT] Error building path segment at depth ${depth} for component "${mainComponent.name}": ${error instanceof Error ? error.message : String(error)}`,
              );
              break;
            }
          }

          mainComponentParentPath = pathNames;
          mainComponentNodePath = nodeIds;

          // Debug: log the built path
          if (mainComponentParentPath.length > 0) {
            debugConsole.log(
              `  [EXPORT] Built path for component "${mainComponent.name}": [${mainComponentParentPath.join(" → ")}]`,
            );
          }
        }
      } catch (error) {
        // Path building failed, continue without it
        debugConsole.warning(
          `  [EXPORT] Could not build path for component "${mainComponent.name}" in INSTANCE_SWAP: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Build instance table entry based on type
    // Log the path that will be used in the entry
    if (instanceType === "normal" && mainComponentParentPath) {
      debugConsole.log(
        `  [EXPORT] Creating instance table entry for component "${mainComponent.name}" with path: [${mainComponentParentPath.join(" → ")}]`,
      );
    }

    const entry: InstanceTableEntry = {
      instanceType,
      componentName: mainComponent.name || "(unnamed)",
      ...(componentSetName && { componentSetName }),
      ...(instanceType === "internal" && { componentNodeId: mainComponent.id }),
      ...(instanceType === "normal" &&
        componentPage && {
          componentPageName: componentPage.name,
          ...(getComponentMetadataFromPage(componentPage)?.id && {
            componentGuid: getComponentMetadataFromPage(componentPage)!.id,
          }),
          ...(getComponentMetadataFromPage(componentPage)?.version !==
            undefined && {
            componentVersion:
              getComponentMetadataFromPage(componentPage)!.version,
          }),
          // Always include path for normal instances (even if empty array for page root)
          path: mainComponentParentPath || [],
          nodePath: mainComponentNodePath || [],
        }),
      ...(variantProperties && { variantProperties }),
      ...(componentProperties && { componentProperties }),
    };

    return entry;
  } catch (error) {
    debugConsole.warning(
      `Error creating instance table entry: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}
