import type { PageListResponse, PageExportResponse } from "../types/messages";

/**
 * Service for page export operations
 */

// Function to count total nodes recursively
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function countTotalNodes(node: any): number {
  let count = 1; // Count the current node
  if (node.children && node.children.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    node.children.forEach((child: any) => {
      count += countTotalNodes(child);
    });
  }
  return count;
}

// Function to recursively extract all node data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractNodeData(node: any): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          // eslint-disable-line @typescript-eslint/no-explicit-any
          const extractedFill = Object.assign({}, fill);
          if (fill.boundVariables) {
            extractedFill.boundVariables = Object.assign(
              {},
              fill.boundVariables,
            );
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

  // Handle main component for instances
  if (
    node.type === "INSTANCE" &&
    typeof node.getMainComponentAsync === "function"
  ) {
    try {
      const mainComponent = node.getMainComponentAsync();
      if (mainComponent) {
        nodeData.mainComponent = {
          id: mainComponent.id,
          name: mainComponent.name,
          key: mainComponent.key,
          fills: mainComponent.fills,
          children: mainComponent.children.map((child: any) => {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            const fillsWithBoundVars = child.fills
              ? child.fills.map((fill: any) => {
                  // eslint-disable-line @typescript-eslint/no-explicit-any
                  const extractedFill = Object.assign({}, fill);
                  if (fill.boundVariables) {
                    extractedFill.boundVariables = Object.assign(
                      {},
                      fill.boundVariables,
                    );
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
      }
    } catch (error) {
      console.log("Error getting main component for " + node.name + ":", error);
    }
  }

  // Recursively extract children if they exist
  if (node.children && node.children.length > 0) {
    nodeData.children = node.children.map((child: any) => {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      return extractNodeData(child);
    });
  }

  return nodeData;
}

export async function loadPages(): Promise<PageListResponse> {
  try {
    await figma.loadAllPagesAsync();
    const pages = figma.root.children;
    const pageList = pages.map((page, index) => ({
      name: page.name,
      index: index,
    }));

    return {
      type: "pages-loaded",
      success: true,
      pages: pageList,
    };
  } catch (error) {
    console.error("Error loading pages:", error);
    return {
      type: "pages-loaded",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function exportPage(
  pageIndex: number,
): Promise<PageExportResponse> {
  try {
    await figma.loadAllPagesAsync();
    const pages = figma.root.children;

    if (pageIndex < 0 || pageIndex >= pages.length) {
      return {
        type: "page-export-response",
        success: false,
        error: "Invalid page selection",
      };
    }

    const selectedPage = pages[pageIndex];
    console.log("Exporting page: " + selectedPage.name);

    // Extract complete page data
    const extractedPageData = extractNodeData(selectedPage);

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
    const filename =
      selectedPage.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";

    return {
      type: "page-export-response",
      success: true,
      filename: filename,
      jsonData: jsonString,
      pageName: selectedPage.name,
    };
  } catch (error) {
    console.error("Error exporting page:", error);
    return {
      type: "page-export-response",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
