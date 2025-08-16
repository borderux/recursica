interface RemoteVariablesOutput {
  collections: Record<string, VariableCollection>;
  remoteVariables: Map<string, Variable>;
}

/**
 * Retrieves remote variables and collections from team library collections.
 *
 * This function fetches all variables from available library collections and creates
 * a mapping of collection keys to collections and variable names to variables.
 * It processes all libraries in parallel for efficiency and handles the import
 * of remote variables into the local workspace.
 *
 * @param libraries - Array of available library variable collections from team library
 * @returns Promise resolving to an object containing:
 *   - collections: Record mapping library keys to their VariableCollection objects
 *   - remoteVariables: Map of variable names to their Variable objects
 *
 * @example
 * const { collections, remoteVariables } = await getRemoteVariables(libraryCollections);
 * // Use collections to access collection metadata
 * // Use remoteVariables to sync with local variables
 */
export async function getRemoteVariables(
  libraries: LibraryVariableCollection[]
): Promise<RemoteVariablesOutput> {
  // Initialize storage for remote collections and variables
  const remoteCollections: Record<string, VariableCollection> = {};

  // Process all libraries in parallel for better performance
  const libraryVariablesPromises = libraries.map(async (library) => {
    // Get all variables from this specific library collection
    const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(library.key);

    // Import each variable and collect collection information
    const actualVarsPromises = variables.map(async (variable) => {
      // Import the remote variable into the local workspace
      const remoteVariable = await figma.variables.importVariableByKeyAsync(variable.key);

      // Store collection information if we haven't seen this collection before
      if (!remoteCollections[library.key]) {
        const remoteCollection = await figma.variables.getVariableCollectionByIdAsync(
          remoteVariable.variableCollectionId
        );
        if (remoteCollection) {
          remoteCollections[library.key] = remoteCollection;
        }
      }
      return remoteVariable;
    });

    return Promise.all(actualVarsPromises);
  });

  // Wait for all libraries to be processed and flatten the results
  const libraryVariablesArrays = await Promise.all(libraryVariablesPromises);
  const libraryVariables = libraryVariablesArrays.flat();

  // Create a Map for efficient variable lookup by name
  const libraryVariablesMap = new Map(libraryVariables.map((v) => [v.name, v]));

  return {
    collections: remoteCollections,
    remoteVariables: libraryVariablesMap,
  };
}
