/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PageImportResponse } from "../types/messages";

/**
 * Service for page import operations
 */

// Function to recursively recreate nodes from the extracted data
export async function recreateNodeFromData(
  nodeData: any,
  parentNode: any,
): Promise<any> {
  try {
    let newNode: any;

    // Create the appropriate node type
    switch (nodeData.type) {
      case "FRAME":
        newNode = figma.createFrame();
        break;
      case "RECTANGLE":
        newNode = figma.createRectangle();
        break;
      case "ELLIPSE":
        newNode = figma.createEllipse();
        break;
      case "TEXT":
        newNode = figma.createText();
        break;
      case "VECTOR":
        newNode = figma.createVector();
        break;
      case "STAR":
        newNode = figma.createStar();
        break;
      case "LINE":
        newNode = figma.createLine();
        break;
      case "COMPONENT":
        newNode = figma.createComponent();
        break;
      case "INSTANCE":
        // For instances, try to find the main component and create an instance
        console.log("Found instance node: " + nodeData.name);

        if (nodeData.mainComponent && nodeData.mainComponent.id) {
          try {
            // Try to find the main component by ID
            const mainComp = await figma.importComponentByKeyAsync(
              nodeData.mainComponent.key,
            );
            if (mainComp && mainComp.type === "COMPONENT") {
              newNode = mainComp.createInstance();
              console.log(
                "Created instance from main component: " +
                  nodeData.mainComponent.name,
              );

              // Apply the instance's own fills (not main component fills)
              if (nodeData.fills && nodeData.fills.length > 0) {
                try {
                  newNode.fills = nodeData.fills;
                } catch (error) {
                  console.log("Error applying instance fills: " + error);
                }
              }

              // Apply correct fills to instance children by matching names
              if (
                nodeData.mainComponent.children &&
                nodeData.mainComponent.children.length > 0 &&
                newNode.children &&
                newNode.children.length > 0
              ) {
                newNode.children.forEach((child: any) => {
                  const matchingChild = (nodeData.children as any[]).find(
                    (mcChild: any) => mcChild.name === child.name,
                  );

                  if (matchingChild) {
                    try {
                      // Apply the stored fills from the main component data
                      if (
                        matchingChild.fills &&
                        matchingChild.fills.length > 0
                      ) {
                        // const fillsWithBoundVariables = (
                        //   matchingChild.fills as any[]
                        // ).map((fill: any) => {
                        //   const newFill = Object.assign({}, fill);
                        //   if (fill?.boundVariables) {
                        //     // newFill.boundVariables = Object.assign(
                        //     //   {},
                        //     //   fill?.boundVariables,
                        //     // );
                        //   }
                        //   return newFill;
                        // });
                        // child.fills = fillsWithBoundVariables;
                      }

                      // Apply other properties
                      if (
                        matchingChild.strokes &&
                        matchingChild.strokes.length > 0
                      ) {
                        child.strokes = matchingChild.strokes;
                      }
                      if (matchingChild.strokeWeight !== undefined) {
                        child.strokeWeight = matchingChild.strokeWeight;
                      }
                      if (matchingChild.strokeAlign !== undefined) {
                        child.strokeAlign = matchingChild.strokeAlign;
                      }
                      if (matchingChild.strokeCap !== undefined) {
                        child.strokeCap = matchingChild.strokeCap;
                      }
                      if (matchingChild.strokeJoin !== undefined) {
                        child.strokeJoin = matchingChild.strokeJoin;
                      }
                      if (
                        matchingChild.dashPattern &&
                        matchingChild.dashPattern.length > 0
                      ) {
                        child.dashPattern = matchingChild.dashPattern;
                      }
                    } catch (childError) {
                      console.log(
                        "Error updating child " +
                          child.name +
                          ": " +
                          childError,
                      );
                    }
                  }
                });
              }
            } else {
              console.log("Main component not found, creating frame fallback");
              newNode = figma.createFrame();
            }
          } catch (error) {
            console.log(
              "Error creating instance: " + error + ", creating frame fallback",
            );
            newNode = figma.createFrame();
          }
        } else {
          console.log("No main component info, creating frame fallback");
          newNode = figma.createFrame();
        }
        break;
      case "GROUP":
        newNode = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        console.log(
          "Boolean operation found: " +
            nodeData.name +
            ", creating frame fallback",
        );
        newNode = figma.createFrame();
        break;
      case "POLYGON":
        newNode = figma.createPolygon();
        break;
      default:
        console.log(
          "Unsupported node type: " +
            nodeData.type +
            ", creating frame instead",
        );
        newNode = figma.createFrame();
        break;
    }

    // Set basic properties
    if (newNode) {
      newNode.name = nodeData.name || "Unnamed Node";
      newNode.x = nodeData.x || 0;
      newNode.y = nodeData.y || 0;
      newNode.resize(nodeData.width || 100, nodeData.height || 100);

      // Set visual properties if they exist
      if (nodeData.visible !== undefined) newNode.visible = nodeData.visible;
      if (nodeData.locked !== undefined) newNode.locked = nodeData.locked;
      if (nodeData.opacity !== undefined) newNode.opacity = nodeData.opacity;
      if (nodeData.rotation !== undefined) newNode.rotation = nodeData.rotation;
      if (nodeData.blendMode !== undefined)
        newNode.blendMode = nodeData.blendMode;

      // Set fills if they exist and are not empty (skip instances, they're handled separately)
      if (
        nodeData.type !== "INSTANCE" &&
        nodeData.fills &&
        nodeData.fills.length > 0
      ) {
        // Preserve bound variables when applying fills
        // const fillsWithBoundVariables = (nodeData.fills as any[]).map(
        //   (fill: any) => {
        //     const newFill = Object.assign({}, fill);
        //     if (fill?.boundVariables) {
        //       // newFill.boundVariables = Object.assign({}, fill?.boundVariables);
        //     }
        //     return newFill;
        //   },
        // );
        // newNode.fills = fillsWithBoundVariables;
      } else if (nodeData.type !== "INSTANCE") {
        // Check if Figma added default fills and remove them if original had no fills
        if (nodeData.fills && nodeData.fills.length === 0) {
          newNode.fills = [];
        }
      }

      // Set strokes if they exist
      if (nodeData.strokes && nodeData.strokes.length > 0) {
        newNode.strokes = nodeData.strokes;
      }

      // Set additional properties for better visual similarity
      if (nodeData.strokeWeight !== undefined) {
        newNode.strokeWeight = nodeData.strokeWeight;
      }
      if (nodeData.strokeAlign !== undefined) {
        newNode.strokeAlign = nodeData.strokeAlign;
      }
      if (nodeData.cornerRadius !== undefined) {
        newNode.cornerRadius = nodeData.cornerRadius;
      }
      if (nodeData.effects && nodeData.effects.length > 0) {
        newNode.effects = nodeData.effects;
      }

      // Set layout properties for frames, components, and instances
      if (
        nodeData.type === "FRAME" ||
        nodeData.type === "COMPONENT" ||
        nodeData.type === "INSTANCE"
      ) {
        if (nodeData.layoutMode) newNode.layoutMode = nodeData.layoutMode;
        if (nodeData.primaryAxisSizingMode)
          newNode.primaryAxisSizingMode = nodeData.primaryAxisSizingMode;
        if (nodeData.counterAxisSizingMode)
          newNode.counterAxisSizingMode = nodeData.counterAxisSizingMode;
        if (nodeData.primaryAxisAlignItems)
          newNode.primaryAxisAlignItems = nodeData.primaryAxisAlignItems;
        if (nodeData.counterAxisAlignItems)
          newNode.counterAxisAlignItems = nodeData.counterAxisAlignItems;
        if (nodeData.paddingLeft !== undefined)
          newNode.paddingLeft = nodeData.paddingLeft;
        if (nodeData.paddingRight !== undefined)
          newNode.paddingRight = nodeData.paddingRight;
        if (nodeData.paddingTop !== undefined)
          newNode.paddingTop = nodeData.paddingTop;
        if (nodeData.paddingBottom !== undefined)
          newNode.paddingBottom = nodeData.paddingBottom;
        if (nodeData.itemSpacing !== undefined)
          newNode.itemSpacing = nodeData.itemSpacing;
      }

      // Set vector and line properties
      if (nodeData.type === "VECTOR" || nodeData.type === "LINE") {
        if (nodeData.strokeCap) newNode.strokeCap = nodeData.strokeCap;
        if (nodeData.strokeJoin) newNode.strokeJoin = nodeData.strokeJoin;
        if (nodeData.dashPattern && nodeData.dashPattern.length > 0) {
          newNode.dashPattern = nodeData.dashPattern;
        }
      }

      // Set text properties for text nodes
      if (nodeData.type === "TEXT" && nodeData.characters) {
        try {
          // Load font first if available, otherwise use default
          if (nodeData.fontName) {
            try {
              await figma.loadFontAsync(nodeData.fontName);
              newNode.fontName = nodeData.fontName;
            } catch {
              // Load default font as fallback
              await figma.loadFontAsync({
                family: "Roboto",
                style: "Regular",
              });
              newNode.fontName = { family: "Roboto", style: "Regular" };
            }
          } else {
            // Load default font if no font specified
            await figma.loadFontAsync({
              family: "Roboto",
              style: "Regular",
            });
            newNode.fontName = { family: "Roboto", style: "Regular" };
          }

          // Set text content
          newNode.characters = nodeData.characters;
          // Set other text properties
          if (nodeData.fontSize) newNode.fontSize = nodeData.fontSize;
          if (nodeData.textAlignHorizontal)
            newNode.textAlignHorizontal = nodeData.textAlignHorizontal;
          if (nodeData.textAlignVertical)
            newNode.textAlignVertical = nodeData.textAlignVertical;
          if (nodeData.letterSpacing)
            newNode.letterSpacing = nodeData.letterSpacing;
          if (nodeData.lineHeight) newNode.lineHeight = nodeData.lineHeight;
          if (nodeData.textCase) newNode.textCase = nodeData.textCase;
          if (nodeData.textDecoration)
            newNode.textDecoration = nodeData.textDecoration;
          if (nodeData.textAutoResize)
            newNode.textAutoResize = nodeData.textAutoResize;
        } catch (error) {
          console.log("Error setting text properties: " + error);
          // Final fallback: just set the text with basic properties
          try {
            newNode.characters = nodeData.characters;
          } catch (textError) {
            console.log("Could not set text characters: " + textError);
          }
        }
      }

      // Recursively recreate children
      if (nodeData.children && nodeData.children.length > 0) {
        for (const childData of nodeData.children) {
          const childNode = await recreateNodeFromData(childData, newNode);
          if (childNode) {
            newNode.appendChild(childNode);
          }
        }
      }

      // Add the node to the parent
      parentNode.appendChild(newNode);
    }

    return newNode;
  } catch (error) {
    console.log(
      "Error recreating node " + (nodeData.name || nodeData.type) + ":",
      error,
    );
    return null;
  }
}

export async function importPage(jsonData: any): Promise<PageImportResponse> {
  try {
    console.log("Importing page from JSON:", jsonData);

    // Validate JSON structure
    if (!jsonData.pageData || !jsonData.metadata) {
      return {
        type: "page-import-response",
        success: false,
        error: "Invalid JSON format. Expected pageData and metadata.",
      };
    }

    const pageData = jsonData.pageData;
    const metadata = jsonData.metadata;
    const sanitizedPageName = jsonData.metadata.originalPageName
      .replace(/[^\w\s-]/g, "") // Remove emojis and special characters except word chars, spaces, and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

    // Create a new page for the imported content
    const newPageName = "Imported - " + (sanitizedPageName || "Unknown");
    const newPage = figma.createPage();
    newPage.name = newPageName;
    figma.root.appendChild(newPage);

    console.log("Created new page: " + newPageName);
    console.log("Importing " + (metadata.totalNodes || "unknown") + " nodes");

    // Recreate the page content
    if (pageData.children && pageData.children.length > 0) {
      for (const childData of pageData.children) {
        await recreateNodeFromData(childData, newPage);
      }
      console.log("Successfully imported page content with all children");
    } else {
      console.log("No children to import");
    }

    return {
      type: "page-import-response",
      success: true,
      pageName: metadata.originalPageName,
      totalNodes: metadata.totalNodes || 0,
    };
  } catch (error) {
    console.error("Error importing page:", error);
    return {
      type: "page-import-response",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
