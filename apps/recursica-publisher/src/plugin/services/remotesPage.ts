/* eslint-disable @typescript-eslint/no-explicit-any */
import { InstanceTable } from "./parsers/instanceTable";
import { VariableTable, CollectionTable } from "./parsers/variableTable";
import { debugConsole } from "./debugConsole";
import {
  recreateNodeFromData,
  restoreBoundVariablesForFills,
  normalizeStructureTypes,
} from "./pageImportNew";

/**
 * Finds or creates a unique frame name on a page
 * If a frame with the same name exists, appends an incrementing number
 */
async function findUniqueFrameName(
  page: PageNode,
  baseName: string,
): Promise<string> {
  const existingNames = new Set<string>();
  for (const child of page.children) {
    if (child.type === "FRAME" || child.type === "COMPONENT") {
      existingNames.add(child.name);
    }
  }

  if (!existingNames.has(baseName)) {
    return baseName;
  }

  let counter = 1;
  let candidateName = `${baseName}_${counter}`;
  while (existingNames.has(candidateName)) {
    counter++;
    candidateName = `${baseName}_${counter}`;
  }

  return candidateName;
}

/**
 * Ensures the REMOTES page exists
 */
async function ensureRemotesPage(): Promise<PageNode> {
  await figma.loadAllPagesAsync();
  const allPages = figma.root.children;
  let remotesPage = allPages.find((p) => p.name === "REMOTES");

  if (!remotesPage) {
    remotesPage = figma.createPage();
    remotesPage.name = "REMOTES";
    await debugConsole.log("Created REMOTES page");
  } else {
    await debugConsole.log("Found existing REMOTES page");
  }

  return remotesPage;
}

/**
 * Gets or creates the parent container frame that holds Title and Remote Instances
 */
async function getOrCreateParentContainer(
  remotesPage: PageNode,
): Promise<FrameNode> {
  let parentContainer = remotesPage.children.find(
    (child) =>
      child.type === "FRAME" && child.name === "Remote Instances Container",
  ) as FrameNode | null;

  if (!parentContainer) {
    parentContainer = figma.createFrame();
    parentContainer.name = "Remote Instances Container";
    parentContainer.layoutMode = "VERTICAL";
    parentContainer.paddingTop = 0;
    parentContainer.paddingBottom = 0;
    parentContainer.paddingLeft = 0;
    parentContainer.paddingRight = 0;
    parentContainer.itemSpacing = 0;
    parentContainer.fills = []; // Transparent background
    parentContainer.layoutSizingHorizontal = "HUG";
    parentContainer.layoutSizingVertical = "HUG";
    remotesPage.appendChild(parentContainer);
    await debugConsole.log("Created parent container frame for REMOTES page");
  }

  return parentContainer;
}

/**
 * Ensures the title frame exists in the parent container
 */
async function ensureTitleFrame(
  parentContainer: FrameNode,
): Promise<FrameNode> {
  let titleFrame = parentContainer.children.find(
    (child) => child.type === "FRAME" && child.name === "Title",
  ) as FrameNode | null;

  if (!titleFrame) {
    // Load fonts first
    const boldFont = { family: "Inter", style: "Bold" };
    const regularFont = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(boldFont);
    await figma.loadFontAsync(regularFont);

    // Create title text frame
    titleFrame = figma.createFrame();
    titleFrame.name = "Title";
    titleFrame.layoutMode = "VERTICAL";
    titleFrame.paddingTop = 20;
    titleFrame.paddingBottom = 20;
    titleFrame.paddingLeft = 20;
    titleFrame.paddingRight = 20;
    titleFrame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]; // White background
    titleFrame.layoutSizingHorizontal = "HUG";
    titleFrame.layoutSizingVertical = "HUG";

    const titleText = figma.createText();
    titleText.fontName = boldFont;
    titleText.characters = "REMOTE INSTANCES";
    titleText.fontSize = 14;
    titleText.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    titleFrame.appendChild(titleText);

    const descriptionText = figma.createText();
    descriptionText.fontName = regularFont;
    descriptionText.characters =
      "These are remotely connected component instances found in our different component pages.";
    descriptionText.fontSize = 12;
    descriptionText.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } },
    ];
    titleFrame.appendChild(descriptionText);

    // Insert at the beginning to ensure it's above the instances container
    parentContainer.insertChild(0, titleFrame);
    await debugConsole.log("Created title and description on REMOTES page");
  }

  return titleFrame;
}

/**
 * Gets or creates the container frame for remote instances
 */
async function getOrCreateInstancesContainer(
  parentContainer: FrameNode,
): Promise<FrameNode> {
  let instancesContainer = parentContainer.children.find(
    (child) => child.type === "FRAME" && child.name === "Remote Instances",
  ) as FrameNode | null;

  if (!instancesContainer) {
    instancesContainer = figma.createFrame();
    instancesContainer.name = "Remote Instances";
    instancesContainer.layoutMode = "VERTICAL";
    instancesContainer.paddingTop = 20;
    instancesContainer.paddingBottom = 20;
    instancesContainer.paddingLeft = 20;
    instancesContainer.paddingRight = 20;
    instancesContainer.itemSpacing = 24; // Space between instances
    instancesContainer.fills = []; // Transparent background
    instancesContainer.layoutSizingHorizontal = "HUG";
    instancesContainer.layoutSizingVertical = "HUG";
    parentContainer.appendChild(instancesContainer);
    await debugConsole.log("Created container frame for remote instances");
  }

  return instancesContainer;
}

/**
 * Creates remote instances on the REMOTES page
 * Returns a map of instance table index -> created component node
 */
export async function createRemoteInstances(
  instanceTable: InstanceTable,
  variableTable: VariableTable,
  collectionTable: CollectionTable,
  recognizedVariables: Map<string, Variable>,
  recognizedCollections: Map<string, VariableCollection>,
): Promise<Map<number, ComponentNode>> {
  const allInstances = instanceTable.getSerializedTable();
  const remoteInstances = Object.values(allInstances).filter(
    (entry: any) => entry.instanceType === "remote",
  );

  // Map of instance table index -> created component node
  const remoteComponentMap = new Map<number, ComponentNode>();

  if (remoteInstances.length === 0) {
    await debugConsole.log("No remote instances found");
    return remoteComponentMap;
  }

  await debugConsole.log(
    `Processing ${remoteInstances.length} remote instance(s)...`,
  );

  // Ensure REMOTES page exists
  const remotesPage = await ensureRemotesPage();

  // Get or create parent container frame
  const parentContainer = await getOrCreateParentContainer(remotesPage);

  // Ensure title frame exists in parent container
  await ensureTitleFrame(parentContainer);

  // Get or create container frame for instances
  const instancesContainer =
    await getOrCreateInstancesContainer(parentContainer);

  // Process each remote instance
  const nodeIdMapping = new Map<string, any>(); // For remote instances, we don't need ID mapping

  for (const [indexStr, entry] of Object.entries(allInstances)) {
    if (entry.instanceType !== "remote") {
      continue;
    }

    const instanceIndex = parseInt(indexStr, 10);
    await debugConsole.log(
      `Processing remote instance ${instanceIndex}: "${entry.componentName}"`,
    );

    if (!entry.structure) {
      await debugConsole.warning(
        `Remote instance "${entry.componentName}" missing structure data, skipping`,
      );
      continue;
    }

    // Normalize structure types: expand numeric types to strings recursively
    // This handles cases where the type enum wasn't expanded during JSON expansion
    normalizeStructureTypes(entry.structure);

    // Debug: Check what keys exist after normalization
    const hasChildren = entry.structure.children !== undefined;
    const hasChild = entry.structure.child !== undefined;
    const childrenCount = entry.structure.children
      ? entry.structure.children.length
      : entry.structure.child
        ? entry.structure.child.length
        : 0;
    await debugConsole.log(
      `  Structure type: ${entry.structure.type || "unknown"}, has children: ${childrenCount} (children key: ${hasChildren}, child key: ${hasChild})`,
    );

    // Generate frame name from path and component name
    let frameName = entry.componentName;
    if (entry.path && entry.path.length > 0) {
      const pathString = entry.path
        .filter((segment) => segment !== "")
        .join(" / ");
      if (pathString) {
        frameName = `${pathString} / ${entry.componentName}`;
      }
    }

    // Find unique name for the component
    const uniqueComponentName = await findUniqueFrameName(
      remotesPage,
      frameName,
    );
    if (uniqueComponentName !== frameName) {
      await debugConsole.log(
        `Component name conflict: "${frameName}" -> "${uniqueComponentName}"`,
      );
    }

    // Create a component from the structure
    // The structure should be a COMPONENT node, so we'll recreate it as a component
    try {
      // Check if the structure type is COMPONENT
      // Type should already be normalized above, but double-check
      if (entry.structure.type !== "COMPONENT") {
        await debugConsole.warning(
          `Remote instance "${entry.componentName}" structure is not a COMPONENT (type: ${entry.structure.type}), creating frame fallback`,
        );
        // Create a frame container as fallback
        const containerFrame = figma.createFrame();
        containerFrame.name = uniqueComponentName;
        const recreatedNode = await recreateNodeFromData(
          entry.structure,
          containerFrame,
          variableTable,
          collectionTable,
          null,
          recognizedVariables,
          nodeIdMapping,
          true, // isRemoteStructure: true
          null, // remoteComponentMap - not needed here
          null, // deferredInstances - not needed for remote instances
          null, // parentNodeData
          recognizedCollections,
        );
        if (recreatedNode) {
          containerFrame.appendChild(recreatedNode);
          instancesContainer.appendChild(containerFrame);
          await debugConsole.log(
            `✓ Created remote instance frame fallback: "${uniqueComponentName}"`,
          );
        } else {
          containerFrame.remove();
        }
        continue;
      }

      // Create the component node first and add it to the container
      // Components must be on a page before we can add children to them
      const componentNode = figma.createComponent();
      componentNode.name = uniqueComponentName;
      instancesContainer.appendChild(componentNode);
      await debugConsole.log(
        `  Created component node: "${uniqueComponentName}"`,
      );

      // Now recreate the structure's children and properties into the component
      // We need to apply all properties from the structure to the component
      // and recreate its children
      try {
        // Apply component property definitions FIRST (must be set before children are added)
        // Use addComponentProperty() method to add each property individually
        if (entry.structure.componentPropertyDefinitions) {
          const propDefs = entry.structure.componentPropertyDefinitions;
          let addedCount = 0;
          let failedCount = 0;

          for (const [propName, propDef] of Object.entries(propDefs)) {
            try {
              // propDef format: { type: number, defaultValue?: any }
              // Map type numbers to Figma API type strings
              const typeMap: Record<
                number,
                "TEXT" | "BOOLEAN" | "INSTANCE_SWAP" | "VARIANT"
              > = {
                2: "TEXT", // Text property
                25: "BOOLEAN", // Boolean property
                27: "INSTANCE_SWAP", // Instance swap property
                26: "VARIANT", // Variant property
              };

              const propType = typeMap[(propDef as any).type];
              if (!propType) {
                await debugConsole.warning(
                  `  Unknown property type ${(propDef as any).type} for property "${propName}" in component "${entry.componentName}"`,
                );
                failedCount++;
                continue;
              }

              const defaultValue = (propDef as any).defaultValue;
              // Property names in JSON may include IDs (e.g., "Show trailing icon#318:0")
              // Extract just the property name part (before the #)
              const cleanPropName = propName.split("#")[0];
              componentNode.addComponentProperty(
                cleanPropName,
                propType,
                defaultValue,
              );
              addedCount++;
            } catch (error) {
              await debugConsole.warning(
                `  Failed to add component property "${propName}" to "${entry.componentName}": ${error}`,
              );
              failedCount++;
            }
          }

          if (addedCount > 0) {
            await debugConsole.log(
              `  Added ${addedCount} component property definition(s) to "${entry.componentName}"${failedCount > 0 ? ` (${failedCount} failed)` : ""}`,
            );
          }
        }

        // Apply basic properties
        if (entry.structure.name !== undefined) {
          componentNode.name = entry.structure.name;
        }
        if (
          entry.structure.width !== undefined &&
          entry.structure.height !== undefined
        ) {
          componentNode.resize(entry.structure.width, entry.structure.height);
        }
        if (entry.structure.x !== undefined) {
          componentNode.x = entry.structure.x;
        }
        if (entry.structure.y !== undefined) {
          componentNode.y = entry.structure.y;
        }

        // Apply visual properties
        if (entry.structure.visible !== undefined) {
          componentNode.visible = entry.structure.visible;
        }
        if (entry.structure.opacity !== undefined) {
          componentNode.opacity = entry.structure.opacity;
        }
        if (entry.structure.rotation !== undefined) {
          componentNode.rotation = entry.structure.rotation;
        }
        if (entry.structure.blendMode !== undefined) {
          componentNode.blendMode = entry.structure.blendMode;
        }

        // Apply fills
        if (entry.structure.fills !== undefined) {
          try {
            let fills = entry.structure.fills;
            if (Array.isArray(fills)) {
              fills = fills.map((fill: any) => {
                if (fill && typeof fill === "object") {
                  // Create a copy without boundVariables (they may contain _varRef which is invalid)
                  const fillWithoutBoundVars = { ...fill };
                  delete fillWithoutBoundVars.boundVariables;
                  return fillWithoutBoundVars;
                }
                return fill;
              });
            }
            componentNode.fills = fills;

            // Restore bound variables for fills
            if (entry.structure.boundVariables?.fills && recognizedVariables) {
              await restoreBoundVariablesForFills(
                componentNode,
                entry.structure.boundVariables,
                "fills",
                recognizedVariables,
              );
            }
          } catch (error) {
            await debugConsole.warning(
              `Error setting fills for remote component "${entry.componentName}": ${error}`,
            );
          }
        }

        // Apply strokes
        if (entry.structure.strokes !== undefined) {
          try {
            componentNode.strokes = entry.structure.strokes;
          } catch (error) {
            await debugConsole.warning(
              `Error setting strokes for remote component "${entry.componentName}": ${error}`,
            );
          }
        }

        // Apply layout properties
        if (entry.structure.layoutMode !== undefined) {
          componentNode.layoutMode = entry.structure.layoutMode;
        }
        if (entry.structure.primaryAxisSizingMode !== undefined) {
          componentNode.primaryAxisSizingMode =
            entry.structure.primaryAxisSizingMode;
        }
        if (entry.structure.counterAxisSizingMode !== undefined) {
          componentNode.counterAxisSizingMode =
            entry.structure.counterAxisSizingMode;
        }
        if (entry.structure.paddingLeft !== undefined) {
          componentNode.paddingLeft = entry.structure.paddingLeft;
        }
        if (entry.structure.paddingRight !== undefined) {
          componentNode.paddingRight = entry.structure.paddingRight;
        }
        if (entry.structure.paddingTop !== undefined) {
          componentNode.paddingTop = entry.structure.paddingTop;
        }
        if (entry.structure.paddingBottom !== undefined) {
          componentNode.paddingBottom = entry.structure.paddingBottom;
        }
        if (entry.structure.itemSpacing !== undefined) {
          componentNode.itemSpacing = entry.structure.itemSpacing;
        }
        if (entry.structure.cornerRadius !== undefined) {
          componentNode.cornerRadius = entry.structure.cornerRadius;
        }

        // Recreate children
        // Handle both "child" (compressed) and "children" (expanded) keys
        // Debug: Log structure keys before accessing children
        await debugConsole.log(
          `  DEBUG: Structure keys: ${Object.keys(entry.structure).join(", ")}, has children: ${!!entry.structure.children}, has child: ${!!entry.structure.child}`,
        );
        const childrenArray =
          entry.structure.children ||
          (entry.structure.child ? entry.structure.child : null);
        await debugConsole.log(
          `  DEBUG: childrenArray exists: ${!!childrenArray}, isArray: ${Array.isArray(childrenArray)}, length: ${childrenArray ? childrenArray.length : 0}`,
        );
        if (
          childrenArray &&
          Array.isArray(childrenArray) &&
          childrenArray.length > 0
        ) {
          await debugConsole.log(
            `  Recreating ${childrenArray.length} child(ren) for component "${entry.componentName}"`,
          );
          for (let i = 0; i < childrenArray.length; i++) {
            const childData = childrenArray[i];
            await debugConsole.log(
              `  DEBUG: Processing child ${i + 1}/${childrenArray.length}: ${JSON.stringify({ name: childData?.name, type: childData?.type, hasTruncated: !!childData?._truncated })}`,
            );
            if (childData._truncated) {
              await debugConsole.log(
                `  Skipping truncated child: ${childData._reason || "Unknown"}`,
              );
              continue;
            }
            await debugConsole.log(
              `  Recreating child: "${childData.name || "Unnamed"}" (type: ${childData.type})`,
            );
            const childNode = await recreateNodeFromData(
              childData,
              componentNode,
              variableTable,
              collectionTable,
              null,
              recognizedVariables,
              nodeIdMapping,
              true, // isRemoteStructure: true
              null, // remoteComponentMap - not needed here
              null, // deferredInstances - not needed for remote instances
              null, // parentNodeData
              recognizedCollections,
            );
            if (childNode) {
              componentNode.appendChild(childNode);
              await debugConsole.log(
                `  ✓ Appended child "${childData.name || "Unnamed"}" to component "${entry.componentName}"`,
              );
            } else {
              await debugConsole.warning(
                `  ✗ Failed to create child "${childData.name || "Unnamed"}" (type: ${childData.type})`,
              );
            }
          }
        }

        remoteComponentMap.set(instanceIndex, componentNode);
        await debugConsole.log(
          `✓ Created remote component: "${uniqueComponentName}" (index ${instanceIndex})`,
        );
      } catch (error) {
        await debugConsole.warning(
          `Error populating remote component "${entry.componentName}": ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        componentNode.remove();
      }
    } catch (error) {
      await debugConsole.warning(
        `Error recreating remote instance "${entry.componentName}": ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  await debugConsole.log(
    `Remote instance processing complete: ${remoteComponentMap.size} component(s) created`,
  );

  return remoteComponentMap;
}
