import type { ResponseMessage } from "../types/messages";
import type { NoData } from "./getCurrentUser";

export interface LoadPagesResponseData {
  pages: Array<{ name: string; index: number }>;
}

/**
 * Service for loading pages
 */
export async function loadPages(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    await figma.loadAllPagesAsync();
    const pages = figma.root.children;
    const pageList = pages.map((page, index) => ({
      name: page.name,
      index: index,
    }));

    const responseData: LoadPagesResponseData = {
      pages: pageList,
    };

    return {
      type: "loadPages",
      success: true,
      error: false,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: responseData as any,
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
