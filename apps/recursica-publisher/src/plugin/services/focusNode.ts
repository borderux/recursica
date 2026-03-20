/**
 * Zooms the Figma viewport to focus on a specific node by ID.
 * Used to let users click a node path link and see it in the canvas.
 */

/// <reference types="@figma/plugin-typings" />

import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";

export interface FocusNodeData {
  nodeId: string;
}

export async function focusNode(data: FocusNodeData): Promise<ResponseMessage> {
  try {
    const { nodeId } = data;
    const node = await figma.getNodeByIdAsync(nodeId);

    if (!node) {
      return retError(
        "focusNode",
        `Node ${nodeId.substring(0, 8)}... not found`,
      );
    }

    // Select the node and zoom to it
    if ("type" in node && node.type !== "DOCUMENT" && node.type !== "PAGE") {
      figma.currentPage.selection = [node as SceneNode];
      figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
    }

    return retSuccess("focusNode", {
      nodeName: node.name,
    });
  } catch (error) {
    return retError(
      "focusNode",
      error instanceof Error ? error : String(error),
    );
  }
}
