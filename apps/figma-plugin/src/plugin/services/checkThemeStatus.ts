import { retSuccess } from "../utils/response";
import type { PluginResponse } from "../types/messages";
import { checkRecursicaVarCollectionsExist } from "../utils/checkRecursicaVarCollectionsExist";

/**
 * Checks if the core Recursica variable collections exist in the current document.
 */
export async function checkThemeStatus(): Promise<PluginResponse> {
  const status = await checkRecursicaVarCollectionsExist();
  return retSuccess("checkThemeStatus", status);
}
