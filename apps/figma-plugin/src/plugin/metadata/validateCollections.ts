/**
 * Validates that required collections exist in the team library based on file type.
 *
 * @param libraries - Available team library variable collections
 * @param fileType - The inferred file type ('themes', 'ui-kit', etc.)
 * @returns Object containing validation result and any error message
 */
export function validateCollections(
  libraries: Record<string, VariableCollection>,
  fileType: string
): { isValid: boolean; errorMessage?: string } {
  if (fileType === 'themes') {
    const tokensCollections = Object.values(libraries).filter(
      (collection) => collection.getSharedPluginData('recursica', 'file-type') === 'tokens'
    );
    if (tokensCollections.length === 0) {
      return {
        isValid: false,
        errorMessage: 'NO_TOKENS_FOUND',
      };
    }
  }

  if (fileType === 'ui-kit') {
    const tokensCollections = Object.values(libraries).filter(
      (collection) => collection.getSharedPluginData('recursica', 'file-type') === 'tokens'
    );
    const themesCollections = Object.values(libraries).filter(
      (collection) => collection.getSharedPluginData('recursica', 'file-type') === 'themes'
    );
    if (tokensCollections.length === 0) {
      return {
        isValid: false,
        errorMessage: 'NO_TOKENS_FOUND',
      };
    }
    if (themesCollections.length === 0) {
      return {
        isValid: false,
        errorMessage: 'NO_THEMES_FOUND',
      };
    }
  }

  return { isValid: true };
}
