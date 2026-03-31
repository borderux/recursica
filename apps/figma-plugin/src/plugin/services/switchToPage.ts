import type { ResponseMessage } from "../types/messages";

export interface SwitchToPageData {
  pageId: string;
}

/**
 * Switches the current page in Figma to the specified page
 */
export async function switchToPage(
  data: SwitchToPageData,
): Promise<ResponseMessage> {
  try {
    const { pageId } = data;

    await figma.loadAllPagesAsync();
    const page = (await figma.getNodeByIdAsync(pageId)) as PageNode | null;

    if (!page || page.type !== "PAGE") {
      return {
        type: "switchToPage",
        success: false,
        error: true,
        message: `Page with ID ${pageId.substring(0, 8)}... not found`,
        data: {},
      };
    }

    await figma.setCurrentPageAsync(page);

    return {
      type: "switchToPage",
      success: true,
      error: false,
      message: `Switched to page "${page.name}"`,
      data: {
        pageName: page.name,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      type: "switchToPage",
      success: false,
      error: true,
      message: errorMessage,
      data: {},
    };
  }
}
