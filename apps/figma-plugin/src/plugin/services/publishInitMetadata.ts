/// <reference types="@figma/plugin-typings" />
import type { ResponseMessage } from "../types/messages";
import { retSuccess, retError } from "../utils/response";
import { INIT_METADATA_KEY } from "./getComponentMetadata";
import type { NoData } from "./getCurrentUser";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface GetPublishInitStatusResponseData {
  initialized: boolean;
}

export interface SetPublishInitStatusData {
  initialized: boolean;
}

export type SetPublishInitStatusResponseData = Record<string, never>;

/**
 * Service for getting the publish initialization status
 */
export async function getPublishInitStatus(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: NoData,
): Promise<ResponseMessage> {
  try {
    const initStatusStr = figma.root.getPluginData(INIT_METADATA_KEY);
    const initialized = initStatusStr === "true";

    const responseData: GetPublishInitStatusResponseData = {
      initialized,
    };

    return retSuccess("getPublishInitStatus", responseData as any);
  } catch (error) {
    console.error("Error getting publish init status:", error);
    return retError(
      "getPublishInitStatus",
      error instanceof Error ? error : "Unknown error occurred",
    );
  }
}

/**
 * Service for setting the publish initialization status
 */
export async function setPublishInitStatus(
  data: SetPublishInitStatusData,
): Promise<ResponseMessage> {
  try {
    const initialized = data.initialized ?? true;
    figma.root.setPluginData(INIT_METADATA_KEY, initialized ? "true" : "false");

    const responseData: SetPublishInitStatusResponseData = {};

    return retSuccess("setPublishInitStatus", responseData as any);
  } catch (error) {
    console.error("Error setting publish init status:", error);
    return retError(
      "setPublishInitStatus",
      error instanceof Error ? error : "Unknown error occurred",
    );
  }
}
