// This plugin will copy a selected page to create a side-by-side comparison.
// It extracts the page data, recreates all nodes with proper positioning,
// and places the copied content to the right of the original content.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  width: 500,
  height: 500,
});

// Function to count total nodes recursively
function countTotalNodes(node: any): number {
  let count = 1; // Count the current node
  if (node.children && node.children.length > 0) {
    node.children.forEach((child: any) => {
      count += countTotalNodes(child);
    });
  }
  return count;
}

// Function to recursively extract all node data
async function extractNodeData(node: any): Promise<any> {
  const nodeData: any = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible,
    locked: node.locked,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    rotation: node.rotation,
    opacity: node.opacity,
    blendMode: node.blendMode,
    effects: node.effects,
    fills: node.fills
      ? node.fills.map((fill: any) => {
          const extractedFill = { ...fill };
          if (fill.boundVariables) {
            extractedFill.boundVariables = { ...fill.boundVariables };
          }
          return extractedFill;
        })
      : node.fills,
    strokes: node.strokes,
    strokeWeight: node.strokeWeight,
    strokeAlign: node.strokeAlign,
    strokeCap: node.strokeCap,
    strokeJoin: node.strokeJoin,
    dashPattern: node.dashPattern,
    cornerRadius: node.cornerRadius,
    characters: node.characters,
    fontSize: node.fontSize,
    fontName: node.fontName,
    textAlignHorizontal: node.textAlignHorizontal,
    textAlignVertical: node.textAlignVertical,
    letterSpacing: node.letterSpacing,
    lineHeight: node.lineHeight,
    textCase: node.textCase,
    textDecoration: node.textDecoration,
    textAutoResize: node.textAutoResize,
    layoutMode: node.layoutMode,
    primaryAxisSizingMode: node.primaryAxisSizingMode,
    counterAxisSizingMode: node.counterAxisSizingMode,
    primaryAxisAlignItems: node.primaryAxisAlignItems,
    counterAxisAlignItems: node.counterAxisAlignItems,
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    itemSpacing: node.itemSpacing,
    children: [],
  };

  // Log fills being extracted for debugging
  if (node.fills && node.fills.length > 0) {
    console.log(
      `Extracting fills from ${node.name} (${node.type}): ${JSON.stringify(node.fills)}`,
    );
  } else {
    console.log(
      `No fills found on ${node.name} (${node.type}), fills: ${JSON.stringify(node.fills)}`,
    );
  }

  // Handle main component for instances
  if (
    node.type === "INSTANCE" &&
    typeof node.getMainComponentAsync === "function"
  ) {
    try {
      const mainComponent = await node.getMainComponentAsync();
      if (mainComponent) {
        nodeData.mainComponent = {
          id: mainComponent.id,
          name: mainComponent.name,
          key: mainComponent.key,
          fills: mainComponent.fills,
          children: mainComponent.children.map((child: any) => {
            // Extract fills with bound variables preserved
            const fillsWithBoundVars = child.fills
              ? child.fills.map((fill: any) => {
                  const extractedFill = { ...fill };
                  if (fill.boundVariables) {
                    extractedFill.boundVariables = {
                      ...fill.boundVariables,
                    };
                  }
                  return extractedFill;
                })
              : [];

            return {
              id: child.id,
              fills: fillsWithBoundVars,
              strokes: child.strokes,
              strokeWeight: child.strokeWeight,
              strokeAlign: child.strokeAlign,
              strokeCap: child.strokeCap,
              strokeJoin: child.strokeJoin,
              dashPattern: child.dashPattern,
              name: child.name,
              type: child.type,
            };
          }),
        };
        console.log(
          `Found main component for instance ${node.name}:`,
          mainComponent,
        );
      }
    } catch (error) {
      console.log(`Error getting main component for ${node.name}:`, error);
    }
  }

  // Recursively extract children if they exist
  if (node.children && node.children.length > 0) {
    nodeData.children = await Promise.all(
      node.children.map((child: any) => extractNodeData(child)),
    );
  }

  return nodeData;
}

// Function to recursively recreate nodes from the extracted data
async function recreateNodeFromData(
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
        console.log(`Found instance node: ${nodeData.name}`);

        console.log(`Main component found`, nodeData.mainComponent);
        if (nodeData.mainComponent && nodeData.mainComponent.id) {
          try {
            // Try to find the main component by ID
            const mainComp = await figma.importComponentByKeyAsync(
              nodeData.mainComponent.key,
            );
            if (mainComp && mainComp.type === "COMPONENT") {
              newNode = mainComp.createInstance();
              console.log(
                `Created instance from main component: ${nodeData.mainComponent.name}`,
              );
              console.log(`New instance: ${newNode.name}`, newNode);

              // Apply the instance's own fills (not main component fills)
              if (nodeData.fills && nodeData.fills.length > 0) {
                console.log(
                  `Applying instance-specific fills to ${nodeData.name}`,
                );
                try {
                  newNode.fills = nodeData.fills;
                  console.log(`Successfully applied instance fills`);
                } catch (error) {
                  console.log(`Error applying instance fills: ${error}`);
                }
              }

              // Apply correct fills to instance children by matching names
              if (
                nodeData.mainComponent.children &&
                nodeData.mainComponent.children.length > 0 &&
                newNode.children &&
                newNode.children.length > 0
              ) {
                console.log(
                  `Updating fills for ${newNode.children.length} instance children`,
                );
                newNode.children.forEach((child: any, index: number) => {
                  // Find matching child in mainComponent data by name

                  const matchingChild = nodeData.children.find(
                    (mcChild: any) => mcChild.name === child.name,
                  );

                  if (matchingChild) {
                    console.log(`Updating fills for child: ${child.name}`);
                    console.log(`Matching child fills:`, matchingChild.fills);
                    try {
                      // Apply the stored fills from the main component data
                      if (
                        matchingChild.fills &&
                        matchingChild.fills.length > 0
                      ) {
                        // Preserve bound variables when copying fills

                        const fillsWithBoundVariables = matchingChild.fills.map(
                          (fill: any) => {
                            const newFill = { ...fill };

                            // Preserve bound variables if they exist
                            if (fill.boundVariables) {
                              newFill.boundVariables = {
                                ...fill.boundVariables,
                              };
                              console.log(
                                `Preserving bound variables for ${child.name}:`,
                                fill.boundVariables,
                              );
                            }

                            return newFill;
                          },
                        );

                        child.fills = fillsWithBoundVariables;
                        console.log(
                          `Applied fills with bound variables to ${child.name}`,
                        );
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
                      console.log(`Successfully updated child ${child.name}`);
                    } catch (childError) {
                      console.log(
                        `Error updating child ${child.name}: ${childError}`,
                      );
                    }
                  } else {
                    console.log(`No matching child found for ${child.name}`);
                  }
                });
              }
            } else {
              console.log(`Main component not found, creating frame fallback`);
              newNode = figma.createFrame();
            }
          } catch (error) {
            console.log(
              `Error creating instance: ${error}, creating frame fallback`,
            );
            newNode = figma.createFrame();
          }
        } else {
          console.log(`No main component info, creating frame fallback`);
          newNode = figma.createFrame();
        }
        break;
      case "GROUP":
        newNode = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        // Boolean operations need special handling, create frame as fallback
        console.log(
          `Boolean operation found: ${nodeData.name}, creating frame fallback`,
        );
        newNode = figma.createFrame();
        break;
      case "POLYGON":
        newNode = figma.createPolygon();
        break;
      default:
        console.log(
          `Unsupported node type: ${nodeData.type}, creating frame instead`,
        );
        newNode = figma.createFrame();
        break;
    }

    // Set basic properties
    if (newNode) {
      newNode.name = nodeData.name || "Unnamed Node";

      // Log what default fills Figma added
      console.log(
        `Node ${nodeData.name} created with default fills: ${JSON.stringify(newNode.fills)}`,
      );

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
        console.log(
          `Setting fills for ${nodeData.name}: ${JSON.stringify(nodeData.fills)}`,
        );

        // Preserve bound variables when applying fills
        const fillsWithBoundVariables = nodeData.fills.map((fill: any) => {
          const newFill = { ...fill };
          if (fill.boundVariables) {
            newFill.boundVariables = { ...fill.boundVariables };
            console.log(
              `Preserving bound variables for ${nodeData.name}:`,
              fill.boundVariables,
            );
          }
          return newFill;
        });

        newNode.fills = fillsWithBoundVariables;
      } else if (nodeData.type !== "INSTANCE") {
        // Check if Figma added default fills and remove them if original had no fills
        if (nodeData.fills && nodeData.fills.length === 0) {
          console.log(`Removing default fills for ${nodeData.name}`);
          newNode.fills = [];
        } else {
          console.log(
            `No fills to apply for ${nodeData.name}, original fills: ${JSON.stringify(nodeData.fills)}`,
          );
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
            } catch (fontError) {
              console.log(
                `Could not load font ${JSON.stringify(nodeData.fontName)}, using default`,
              );
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
          console.log(`Error setting text properties: ${error}`);
          // Final fallback: just set the text with basic properties
          try {
            newNode.characters = nodeData.characters;
          } catch (textError) {
            console.log(`Could not set text characters: ${textError}`);
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
      return newNode;
    }
  } catch (error) {
    console.log(
      `Error recreating node ${nodeData.name || nodeData.type}:`,
      error,
    );
    return null;
  }
}

// Handle UI messages
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case "load-pages":
        await handleLoadPages();
        break;
      case "export-page":
        await handleExportPage(msg.pageIndex);
        break;
      case "import-page":
        await handleImportPage(msg.jsonData);
        break;
      case "quick-copy":
        await handleQuickCopy();
        break;
      case "cancel":
        figma.closePlugin();
        break;
    }
  } catch (error) {
    console.error("Error handling message:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    figma.notify(`Error: ${errorMessage}`, { error: true });
  }
};

// Handle loading pages for the UI dropdown
async function handleLoadPages() {
  await figma.loadAllPagesAsync();
  const pages = figma.root.children;
  const pageList = pages.map((page, index) => ({
    name: page.name,
    index: index,
  }));

  figma.ui.postMessage({
    type: "pages-loaded",
    pages: pageList,
  });
}

// Handle exporting a page to JSON
async function handleExportPage(pageIndex: number) {
  await figma.loadAllPagesAsync();
  const pages = figma.root.children;

  if (pageIndex < 0 || pageIndex >= pages.length) {
    figma.notify("Invalid page selection", { error: true });
    return;
  }

  const selectedPage = pages[pageIndex];
  console.log(`Exporting page: ${selectedPage.name}`);

  // Extract complete page data
  const extractedPageData = await extractNodeData(selectedPage);

  // Create export data with metadata
  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      figmaVersion: figma.apiVersion,
      originalPageName: selectedPage.name,
      totalNodes: countTotalNodes(extractedPageData),
      pluginVersion: "1.0.0",
    },
    pageData: extractedPageData,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const filename = `${selectedPage.name.replace(/[^a-z0-9]/gi, "_")}_export.json`;

  // Send JSON to UI for download
  figma.ui.postMessage({
    type: "download-json",
    filename: filename,
    jsonData: jsonString,
  });

  figma.notify(`Successfully exported "${selectedPage.name}" to JSON`);
}

// Handle importing a page from JSON
async function handleImportPage(jsonData: any) {
  console.log("Importing page from JSON:", jsonData);

  // Validate JSON structure
  if (!jsonData.pageData || !jsonData.metadata) {
    figma.notify("Invalid JSON format. Expected pageData and metadata.", {
      error: true,
    });
    return;
  }

  const { pageData, metadata } = jsonData;

  // Create a new page for the imported content
  const newPageName = `Imported - ${metadata.originalPageName || "Unknown"}`;
  const newPage = figma.createPage();
  newPage.name = newPageName;
  figma.root.appendChild(newPage);

  console.log(`Created new page: ${newPageName}`);
  console.log(`Importing ${metadata.totalNodes || "unknown"} nodes`);

  // Recreate the page content
  if (pageData.children && pageData.children.length > 0) {
    for (const childData of pageData.children) {
      await recreateNodeFromData(childData, newPage);
    }
    console.log(`Successfully imported page content with all children`);
  } else {
    console.log(`No children to import`);
  }

  figma.notify(
    `Successfully imported "${metadata.originalPageName}" with ${metadata.totalNodes || 0} nodes`,
  );
}

// Handle quick copy (original functionality)
async function handleQuickCopy() {
  // Load all pages first to access their children
  await figma.loadAllPagesAsync();

  figma.variables
    .getVariableByIdAsync(
      "VariableID:53e8ee61842b6a01aa9dc2ecb8c3eca5a8bb6f62/1761:883",
    )
    .then((variable) => {
      console.log("fill bound variable:", variable);
    });

  // Get all pages in the document
  const pages = figma.root.children;
  console.log(`Found ${pages.length} pages in the document`);

  // Randomly select a page to parse
  const randomPageIndex = Math.floor(Math.random() * pages.length);
  const randomPage = pages[11];

  // Extract complete page data with all nested children
  const extractedPageData = await extractNodeData(randomPage);

  console.log(
    `Randomly selected page: ${randomPage.name} (index: ${randomPageIndex})`,
  );
  console.log(`Extracted page data:`, extractedPageData);

  // Parse the extracted page data to string and back to JSON
  const pageContentString = JSON.stringify(extractedPageData, null, 2);
  const parsedPageContent = JSON.parse(pageContentString);

  console.log(
    `Parsed page content length: ${pageContentString.length} characters`,
    pageContentString,
  );
  console.log(`Parsed content preview:`, parsedPageContent);

  // Create a new page with the parsed content
  const newPageName = `Copy - ${parsedPageContent.name}`;
  const newPage = figma.createPage();
  newPage.name = newPageName;

  // Move the new page to the bottom of the document
  figma.root.appendChild(newPage);

  // Recreate all children from the extracted page data
  if (parsedPageContent.children && parsedPageContent.children.length > 0) {
    console.log(
      `Recreating ${parsedPageContent.children.length} top-level children...`,
    );

    // Calculate the offset to position copied content to the right
    // Find the rightmost edge of the original content
    let maxRight = 0;
    function findMaxRight(nodes: any[]): void {
      nodes.forEach((node: any) => {
        const rightEdge = (node.x || 0) + (node.width || 0);
        if (rightEdge > maxRight) {
          maxRight = rightEdge;
        }
        // Recursively check children
        if (node.children && node.children.length > 0) {
          findMaxRight(node.children);
        }
      });
    }

    findMaxRight(parsedPageContent.children);

    console.log(`Original content rightmost edge: ${maxRight}`);

    // Recreate children sequentially to properly handle async font loading
    for (const childData of parsedPageContent.children) {
      await recreateNodeFromData(childData, newPage);
    }
    console.log(`Successfully recreated page content with all children`);
  } else {
    console.log(`No children to recreate`);
  }

  console.log(`Selected page: ${JSON.stringify(parsedPageContent, null, 2)}`);

  // Store the complete page data for later recreation
  const pageDataToStore = {
    pageName: parsedPageContent.name,
    pageData: parsedPageContent,
    timestamp: new Date().toISOString(),
    totalNodes: countTotalNodes(parsedPageContent),
    totalChildren: parsedPageContent.children
      ? parsedPageContent.children.length
      : 0,
  };

  console.log(`Stored complete page data for recreation:`, pageDataToStore);
  console.log(`Total nodes in page: ${pageDataToStore.totalNodes}`);
  console.log(`Total top-level children: ${pageDataToStore.totalChildren}`);

  console.log(`Created new page: ${newPageName}`);

  // Store all pages data (including the new ones)
  const allPages = figma.root.children;
  console.log(`Total pages after creation: ${allPages.length}`);

  // Notify completion
  figma.notify(
    `Successfully copied page "${pageDataToStore.pageName}" to the right with ${pageDataToStore.totalNodes} total nodes. Original content remains on the left.`,
  );
}
