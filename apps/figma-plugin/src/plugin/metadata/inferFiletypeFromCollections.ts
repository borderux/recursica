/**
 * Infers the file type and theme name from local variable collections.
 *
 * This function analyzes collection names to determine the project type and extracts
 * theme information. It uses pattern matching on collection names to classify the file.
 *
 * File type detection priority:
 * 1. 'tokens' - if any collection contains 'tokens' in the name
 * 2. 'themes' - if any collection contains 'themes' in the name
 * 3. 'ui-kit' - if any collection contains 'ui kit' or 'uikit' in the name
 * 4. 'icons' - default fallback if no other patterns match
 *
 * Theme name extraction:
 * - Looks for an "ID variables" collection
 * - Searches for a variable named 'theme' within that collection
 * - Extracts the first mode value as the theme name
 *
 * @param localCollections - Array of local variable collections to analyze
 * @returns Promise resolving to an object containing:
 *   - fileType: The inferred file type ('themes', 'ui-kit', 'tokens', 'icons')
 *   - themeName: The extracted theme name (empty string if not found)
 *
 * @example
 * const { fileType, themeName } = await inferFiletypeFromCollections(collections);
 * // fileType: 'themes', themeName: 'DarkTheme'
 */
export async function inferFiletypeFromCollections(localCollections: VariableCollection[]) {
  let fileType = 'icons';
  let themeName = '';

  if (localCollections.length > 0) {
    // Look for collections that indicate the project type
    // Priority order: tokens > themes > ui-kit > icons (default)
    const tokensCollection = localCollections.find((collection) =>
      collection.name.toLowerCase().includes('tokens')
    );
    const themesCollection = localCollections.find((collection) =>
      collection.name.toLowerCase().includes('themes')
    );
    const uikitCollection = localCollections.find(
      (collection) =>
        collection.name.toLowerCase().includes('ui kit') ||
        collection.name.toLowerCase().includes('uikit')
    );

    // Determine file type based on collection names found
    if (tokensCollection) {
      fileType = 'tokens';
    } else if (themesCollection) {
      fileType = 'themes';
    } else if (uikitCollection) {
      fileType = 'ui-kit';
    }
  }

  // Extract theme name from the "ID variables" collection if it exists
  // This collection typically contains metadata about the project
  const idVariablesCollection = localCollections.find(
    (collection) => collection.name === 'ID variables'
  );

  if (idVariablesCollection) {
    // Search through all variables in the ID variables collection
    for (const varId of idVariablesCollection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      // Look for a variable specifically named 'theme'
      if (variable && variable.name === 'theme') {
        // Extract the theme name from the first mode value
        // Assuming the theme name is stored as a string value
        const firstMode = Object.values(variable.valuesByMode)[0];
        if (typeof firstMode === 'string') {
          themeName = firstMode;
        }
        break; // Found the theme variable, no need to continue searching
      }
    }
  }

  return { fileType, themeName };
}
