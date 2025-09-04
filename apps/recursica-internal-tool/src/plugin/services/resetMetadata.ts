import type { ResetMetadataResponse } from "../types/messages";

/**
 * Service for resetting metadata in Figma variable collections
 */

export async function resetAllMetadata(): Promise<ResetMetadataResponse> {
  try {
    // Get all local variable collections
    const localCollections =
      await figma.variables.getLocalVariableCollectionsAsync();

    // Reset metadata for each collection
    for (const collection of localCollections) {
      // Clear collection metadata
      const keys = collection.getSharedPluginDataKeys("recursica");
      for (const key of keys) {
        console.log("resetting collection " + collection.name, key);
        collection.setSharedPluginData("recursica", key, "");
      }

      // Clear metadata for each variable in the collection
      for (const variableId of collection.variableIds) {
        const variable = await figma.variables.getVariableByIdAsync(variableId);
        if (variable) {
          const keys = variable.getSharedPluginDataKeys("recursica");
          for (const key of keys) {
            console.log("resetting variable " + variable.name, key);
            variable.setSharedPluginData("recursica", key, "");
          }
        }
      }
    }
    console.log(
      "Successfully reset metadata for ",
      localCollections.length,
      " variable collections",
    );

    return {
      type: "reset-metadata-response",
      success: true,
      message:
        "Successfully reset metadata for " +
        localCollections.length +
        " variable collections",
    };
  } catch (error) {
    console.error("Error resetting metadata:", error);

    return {
      type: "reset-metadata-response",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
