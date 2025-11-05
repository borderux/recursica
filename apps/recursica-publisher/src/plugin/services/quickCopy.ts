/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ResponseMessage } from "../types/messages";
import { extractNodeData, countTotalNodes } from "./pageExportNew";
import { recreateNodeFromData } from "./pageImportNew";

/**
 * Service for quick copy operations
 */
export async function quickCopy(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: Record<string, unknown>,
): Promise<ResponseMessage> {
  try {
    // Load all pages first to access their children
    await figma.loadAllPagesAsync();

    // Get all pages in the document
    const pages = figma.root.children;
    console.log("Found " + pages.length + " pages in the document");

    // Randomly select a page to parse (using page 11 as in original code)
    const randomPageIndex = 11;
    const randomPage = pages[randomPageIndex];

    if (!randomPage) {
      return {
        type: "quickCopy",
        success: false,
        error: true,
        message: "No page found at index 11",
        data: {},
      };
    }

    // Extract complete page data with all nested children
    const extractedPageData = await extractNodeData(
      randomPage,
      new WeakSet(),
      {},
    );

    console.log(
      "Selected page: " + randomPage.name + " (index: " + randomPageIndex + ")",
    );

    // Parse the extracted page data to string and back to JSON
    const pageContentString = JSON.stringify(extractedPageData, null, 2);
    const parsedPageContent = JSON.parse(pageContentString);

    // Create a new page with the parsed content
    const newPageName = "Copy - " + parsedPageContent.name;
    const newPage = figma.createPage();
    newPage.name = newPageName;

    // Move the new page to the bottom of the document
    figma.root.appendChild(newPage);

    // Recreate all children from the extracted page data
    if (parsedPageContent.children && parsedPageContent.children.length > 0) {
      console.log(
        "Recreating " +
          parsedPageContent.children.length +
          " top-level children...",
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

      console.log("Original content rightmost edge: " + maxRight);

      // Recreate children sequentially to properly handle async font loading
      for (const childData of parsedPageContent.children) {
        await recreateNodeFromData(childData, newPage, null, null);
      }
      console.log("Successfully recreated page content with all children");
    } else {
      console.log("No children to recreate");
    }

    const totalNodes = countTotalNodes(parsedPageContent);

    return {
      type: "quickCopy",
      success: true,
      error: false,
      message: "Quick copy completed successfully",
      data: {
        pageName: parsedPageContent.name,
        newPageName: newPageName,
        totalNodes: totalNodes,
      },
    };
  } catch (error) {
    console.error("Error performing quick copy:", error);
    return {
      type: "quickCopy",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
