/**
 * Utility function to get a library variable collection with fallback logic.
 *
 * Fallback strategy:
 * 1. Try getVariablesInLibraryCollectionAsync with stored key
 * 2. Search available libraries by metadata (file-type)
 * 3. Search available libraries by name pattern
 * 4. If 0 variables and sampleVariableKey provided, import it to activate the collection
 * 5. Final fallback: try stored key again
 *
 * @param storedKey - The stored collection key from global metadata
 * @param targetFileType - The expected file type ('tokens' or 'themes')
 * @param sampleVariableKey - Optional variable key to import to activate the collection
 * @returns Promise resolving to collection key, variables, and optionally the collection itself
 */
export async function getLibraryCollection(
  storedKey: string,
  targetFileType: 'tokens' | 'themes',
  sampleVariableKey?: string
): Promise<{
  collectionKey: string;
  variables: LibraryVariable[];
  collection?: VariableCollection;
} | null> {
  // Step 1: Try with stored key
  try {
    const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(storedKey);
    if (variables.length > 0) {
      console.log(`[getLibraryCollection] Found ${targetFileType} collection using stored key`);
      return { collectionKey: storedKey, variables };
    }
    // If stored key returns 0 variables, continue to fallbacks
    console.log(
      `[getLibraryCollection] Stored key returned 0 variables for ${targetFileType}, trying fallbacks`
    );
  } catch (_error) {
    console.log(
      `[getLibraryCollection] Stored key did not work for ${targetFileType}, trying fallbacks`
    );
  }

  // Step 2: Search available libraries by metadata
  try {
    const availableLibraries =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

    console.log(
      `[getLibraryCollection] Searching ${availableLibraries.length} available libraries by metadata for ${targetFileType}`
    );

    for (const lib of availableLibraries) {
      try {
        // Import a variable to get the collection and check its metadata
        const testVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(lib.key);
        if (testVariables.length > 0) {
          const importedVar = await figma.variables.importVariableByKeyAsync(testVariables[0].key);
          const collection = await figma.variables.getVariableCollectionByIdAsync(
            importedVar.variableCollectionId
          );

          if (collection) {
            const fileType = collection.getSharedPluginData('recursica', 'file-type');
            console.log(
              `[getLibraryCollection] Checking library "${lib.name}" (library key: ${lib.key}, collection key: ${collection.key}): file-type="${fileType}", target="${targetFileType}"`
            );
            if (fileType === targetFileType) {
              console.log(
                `[getLibraryCollection] Found ${targetFileType} collection by metadata:`,
                lib.name
              );
              console.log(
                `[getLibraryCollection] Key comparison - library key: ${lib.key}, collection key: ${collection.key}, stored key: ${storedKey}`
              );
              return { collectionKey: lib.key, variables: testVariables };
            }
          }
        } else {
          console.warn(
            `[getLibraryCollection] Library "${lib.name}" has 0 variables, skipping - may not be fully published`
          );
        }
      } catch (error) {
        console.log(`[getLibraryCollection] Error checking library "${lib.name}":`, error);
        // Continue to next library
        continue;
      }
    }
    console.log(`[getLibraryCollection] No ${targetFileType} collection found by metadata`);
  } catch (error) {
    console.log(
      `[getLibraryCollection] Could not search by metadata for ${targetFileType}:`,
      error
    );
  }

  // Step 3: Search by name
  try {
    const availableLibraries =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

    console.log(
      `[getLibraryCollection] Searching ${availableLibraries.length} available libraries by name for ${targetFileType}`
    );
    const namePattern = targetFileType === 'tokens' ? 'token' : 'theme';
    const matchingLibrary = availableLibraries.find((lib) =>
      lib.name.toLowerCase().includes(namePattern)
    );

    if (matchingLibrary) {
      console.log(
        `[getLibraryCollection] Found library matching name pattern "${namePattern}": "${matchingLibrary.name}"`
      );
      console.log(
        `[getLibraryCollection] Attempting to get variables using library key: ${matchingLibrary.key}`
      );

      let variables: LibraryVariable[] = [];
      try {
        variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          matchingLibrary.key
        );
        console.log(
          `[getLibraryCollection] Library "${matchingLibrary.name}" has ${variables.length} variables (first attempt)`
        );
      } catch (error) {
        console.warn(`[getLibraryCollection] First attempt to get variables failed:`, error);
      }

      // If we got 0 variables, this is a known Figma API limitation:
      // getVariablesInLibraryCollectionAsync only returns variables that have been imported/used in the file.
      // If the library is available but not "activated" (no variables imported), it returns 0.
      // The UI may show variables exist, but the API can't access them until at least one is imported.
      if (variables.length === 0) {
        console.log(
          `[getLibraryCollection] Got 0 variables - library collection not yet "activated" in this file`
        );
        console.log(
          `[getLibraryCollection] Library key: ${matchingLibrary.key}, stored key: ${storedKey}`
        );

        // Try to programmatically activate the collection by importing a sample variable
        if (sampleVariableKey) {
          console.log(
            `[getLibraryCollection] Attempting to activate collection by importing sample variable: ${sampleVariableKey}`
          );
          try {
            const importedVar = await figma.variables.importVariableByKeyAsync(sampleVariableKey);
            console.log(
              `[getLibraryCollection] Successfully imported variable "${importedVar.name}" to activate collection`
            );

            // Get the collection from the imported variable
            const activatedCollection = await figma.variables.getVariableCollectionByIdAsync(
              importedVar.variableCollectionId
            );

            if (activatedCollection) {
              console.log(`[getLibraryCollection] Got collection from imported variable:`, {
                name: activatedCollection.name,
                key: activatedCollection.key,
                variableCount: activatedCollection.variableIds.length,
              });

              // After importing, try getting variables again - sometimes it takes a moment
              // Try multiple times with the collection key and library key
              let activatedVariables: LibraryVariable[] = [];

              // First try with collection key
              try {
                activatedVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
                  activatedCollection.key
                );
                console.log(
                  `[getLibraryCollection] After import, collection key returned ${activatedVariables.length} variables`
                );
              } catch (error) {
                console.log(`[getLibraryCollection] Collection key failed:`, error);
              }

              // If that didn't work, try library key
              if (
                activatedVariables.length === 0 &&
                matchingLibrary.key !== activatedCollection.key
              ) {
                try {
                  activatedVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
                    matchingLibrary.key
                  );
                  console.log(
                    `[getLibraryCollection] After import, library key returned ${activatedVariables.length} variables`
                  );
                } catch (error) {
                  console.log(`[getLibraryCollection] Library key failed:`, error);
                }
              }

              // If still 0, check if the collection is now in local collections
              // After importing, the collection should be accessible locally
              if (activatedVariables.length === 0) {
                console.log(`[getLibraryCollection] Checking local collections after import...`);
                try {
                  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
                  const localCollection = localCollections.find(
                    (col) => col.key === activatedCollection.key
                  );

                  if (localCollection) {
                    console.log(
                      `[getLibraryCollection] Found collection in local collections with ${localCollection.variableIds.length} variables`
                    );
                    // Try getting library variables using the local collection's key
                    activatedVariables =
                      await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
                        localCollection.key
                      );
                    console.log(
                      `[getLibraryCollection] Local collection key returned ${activatedVariables.length} library variables`
                    );
                  }
                } catch (error) {
                  console.log(`[getLibraryCollection] Error checking local collections:`, error);
                }
              }

              if (activatedVariables.length > 0) {
                console.log(
                  `[getLibraryCollection] Collection activated! Got ${activatedVariables.length} variables`
                );
                return {
                  collectionKey: activatedCollection.key,
                  variables: activatedVariables,
                  collection: activatedCollection,
                };
              } else {
                // This is a known Figma API limitation - even after importing a variable,
                // getVariablesInLibraryCollectionAsync may not return all variables immediately
                // However, we have the collection, so we can work with it
                // The sync functions can use the collection's variableIds directly
                console.warn(
                  `[getLibraryCollection] Still 0 variables from API after import - Figma API limitation`
                );
                console.log(
                  `[getLibraryCollection] However, we have the collection with ${activatedCollection.variableIds.length} local variables`
                );
                console.log(`[getLibraryCollection] Returning collection for sync to use directly`);
                // Return the collection we have - the sync can use it even without library variables
                return {
                  collectionKey: activatedCollection.key,
                  variables: [],
                  collection: activatedCollection,
                };
              }
            } else {
              console.warn(
                `[getLibraryCollection] Could not get collection from imported variable`
              );
            }
          } catch (error) {
            console.warn(
              `[getLibraryCollection] Failed to import sample variable to activate collection:`,
              error
            );
          }
        } else {
          console.log(
            `[getLibraryCollection] No sample variable key provided - cannot programmatically activate collection`
          );
        }

        console.log(
          `[getLibraryCollection] This is a Figma API limitation - variables must be imported first to access them`
        );
        console.log(
          `[getLibraryCollection] The UI shows variables exist, but API returns 0 until collection is activated`
        );

        // Check if any variables from this collection are already imported locally
        // If so, we can use those to "activate" the collection
        try {
          const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
          console.log(
            `[getLibraryCollection] Checking ${localCollections.length} local collections for imported variables`
          );

          for (const localCol of localCollections) {
            // Check if this local collection is from the library by comparing keys or metadata
            const fileType = localCol.getSharedPluginData('recursica', 'file-type');
            if (fileType === targetFileType && localCol.variableIds.length > 0) {
              console.log(
                `[getLibraryCollection] Found local collection "${localCol.name}" with ${localCol.variableIds.length} imported variables`
              );

              // Try to get library variables using the local collection's key
              // This might work if the collection has been "activated" by importing variables
              try {
                const activatedVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
                  localCol.key
                );
                if (activatedVars.length > 0) {
                  console.log(
                    `[getLibraryCollection] Successfully got ${activatedVars.length} variables using local collection key`
                  );
                  return { collectionKey: localCol.key, variables: activatedVars };
                }
              } catch {
                // Continue to next collection
              }
            }
          }
        } catch (error) {
          console.log(`[getLibraryCollection] Error checking local collections:`, error);
        }
      }

      if (variables.length > 0) {
        // Import a variable to get the collection and check its key
        const importedVar = await figma.variables.importVariableByKeyAsync(variables[0].key);
        const collection = await figma.variables.getVariableCollectionByIdAsync(
          importedVar.variableCollectionId
        );
        if (collection) {
          console.log(
            `[getLibraryCollection] Key comparison - library key: ${matchingLibrary.key}, collection key: ${collection.key}, stored key: ${storedKey}`
          );
        }
        console.log(
          `[getLibraryCollection] Found ${targetFileType} collection by name:`,
          matchingLibrary.name
        );
        return { collectionKey: matchingLibrary.key, variables };
      } else {
        console.warn(
          `[getLibraryCollection] Library "${matchingLibrary.name}" found by name but has 0 variables - may not be fully published or accessible`
        );
        console.warn(
          `[getLibraryCollection] UI shows 342 variables but API returns 0 - library may need to be explicitly added to file`
        );
      }
    } else {
      console.log(`[getLibraryCollection] No library found matching name pattern "${namePattern}"`);
      console.log(
        `[getLibraryCollection] Available library names:`,
        availableLibraries.map((lib) => lib.name)
      );
    }
  } catch (error) {
    console.log(`[getLibraryCollection] Could not search by name for ${targetFileType}:`, error);
  }

  // Step 4: Final fallback - try stored key again (in case it works now)
  try {
    const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(storedKey);
    if (variables.length > 0) {
      console.log(
        `[getLibraryCollection] Using stored key as final fallback for ${targetFileType}`
      );
      return { collectionKey: storedKey, variables };
    }
  } catch (_error) {
    // Final attempt failed
  }

  return null;
}
