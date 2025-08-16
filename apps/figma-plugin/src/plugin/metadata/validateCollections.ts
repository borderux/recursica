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
    const tokensCollections = Object.values(libraries).filter((collection) =>
      collection.name.toLowerCase().includes('tokens')
    );
    const tokensConnected = tokensCollections.every(
      (collection) => collection.getSharedPluginData('recursica', 'variables-synced') === 'true'
    );
    if (tokensCollections.length === 0) {
      return {
        isValid: false,
        errorMessage: 'NO_TOKENS_FOUND',
      };
    }
    if (!tokensConnected) {
      return {
        isValid: false,
        errorMessage: 'TOKENS_NOT_CONNECTED',
      };
    }
  }

  if (fileType === 'ui-kit') {
    const tokensCollections = Object.values(libraries).filter((collection) =>
      collection.name.toLowerCase().includes('tokens')
    );
    const tokensConnected = tokensCollections.every(
      (collection) => collection.getSharedPluginData('recursica', 'variables-synced') === 'true'
    );
    const themesCollections = Object.values(libraries).filter((collection) =>
      collection.name.toLowerCase().includes('themes')
    );
    const themesConnected = themesCollections.every(
      (collection) => collection.getSharedPluginData('recursica', 'variables-synced') === 'true'
    );
    if (tokensCollections.length === 0) {
      return {
        isValid: false,
        errorMessage: 'NO_TOKENS_FOUND',
      };
    }
    if (!tokensConnected) {
      return {
        isValid: false,
        errorMessage: 'TOKENS_NOT_CONNECTED',
      };
    }
    if (themesCollections.length === 0) {
      return {
        isValid: false,
        errorMessage: 'NO_THEMES_FOUND',
      };
    }
    if (!themesConnected) {
      return {
        isValid: false,
        errorMessage: 'THEMES_NOT_CONNECTED',
      };
    }
  }

  return { isValid: true };
}
