import type { ResponseMessage } from "../types/messages";

/**
 * Service for loading pages
 */
export async function loadPages(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: Record<string, unknown>,
): Promise<ResponseMessage> {
  try {
    await figma.loadAllPagesAsync();
    const pages = figma.root.children;
    const pageList = pages.map((page, index) => ({
      name: page.name,
      index: index,
    }));

    return {
      type: "loadPages",
      success: true,
      error: false,
      message: "Pages loaded successfully",
      data: {
        pages: pageList,
      },
    };
  } catch (error) {
    console.error("Error loading pages:", error);
    return {
      type: "loadPages",
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: {},
    };
  }
}
