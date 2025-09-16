import type { ResetMetadataResponse } from "../types/messages";

/**
 * Service for resetting metadata in Figma variable collections
 */

export async function resetAllMetadata(): Promise<ResetMetadataResponse> {
  try {
    // Get all local variable collections
    const localCollections =
      await figma.variables.getLocalVariableCollectionsAsync();

    // Reset only the variables-synced metadata for each collection
    for (const collection of localCollections) {
      // Only reset the variables-synced tag, preserve file-type and theme-name
      console.log(
        "resetting variables-synced tag for collection " + collection.name,
      );
      collection.setSharedPluginData("recursica", "variables-synced", "");

      // Clear variables-synced metadata for each variable in the collection
      for (const variableId of collection.variableIds) {
        const variable = await figma.variables.getVariableByIdAsync(variableId);
        if (variable) {
          console.log(
            "resetting variables-synced tag for variable " + variable.name,
          );
          variable.setSharedPluginData("recursica", "variables-synced", "");
        }
      }
    }
    console.log(
      "Successfully reset variables-synced metadata for ",
      localCollections.length,
      " variable collections",
    );

    return {
      type: "reset-metadata-response",
      success: true,
      message:
        "Successfully reset variables-synced metadata for " +
        localCollections.length +
        " variable collections. File type and theme name have been preserved.",
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
