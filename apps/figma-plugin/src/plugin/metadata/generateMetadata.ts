import { toPascalCase } from '@recursica/common';

/**
 * Generates and sets metadata on local variable collections.
 *
 * This function sets shared plugin data on collections including file type, sync status,
 * and theme name. It processes all collections in parallel for efficiency.
 *
 * Metadata set:
 * - 'file-type': The inferred file type (themes, ui-kit, tokens, icons)
 * - 'variables-synced': Set to 'true' to mark collection as synchronized
 * - 'theme-name': For theme collections, sets the theme name (falls back to root name if not provided)
 *
 * Note: The "ID variables" collection is skipped as it's a special system collection
 * that shouldn't have metadata applied.
 *
 * @param localCollections - Array of local collections to update with metadata
 * @param fileType - The inferred file type (themes, ui-kit, tokens, icons)
 * @param themeName - The theme name to set (for theme collections only)
 * @returns Promise that resolves when all metadata has been generated and set
 *
 * @example
 * await generateMetadata(collections, 'themes', 'DarkTheme');
 * // Collections now have metadata set and are marked as synced
 */
export async function generateMetadata(
  localCollections: VariableCollection[],
  fileType: string,
  themeName: string
) {
  // Process all collections in parallel for better performance
  const localCollectionPromises = localCollections.map(async (collection) => {
    // Set the file type metadata to help identify the project type
    collection.setSharedPluginData('recursica', 'file-type', fileType);

    // Mark this collection as synchronized to prevent future sync operations
    collection.setSharedPluginData('recursica', 'variables-synced', 'true');

    // For theme collections, set the theme name metadata
    if (fileType === 'themes') {
      // Clean the filename: remove special characters and numbers before converting to PascalCase
      const cleanedRootName = figma.root.name.replace(/[^a-zA-Z\s]/g, '').replace(/\d+/g, '');
      // Use themeName if available, otherwise fall back to figma.root.name
      // Convert to PascalCase for consistent naming convention
      const finalThemeName = themeName || toPascalCase(cleanedRootName);
      collection.setSharedPluginData('recursica', 'theme-name', finalThemeName);
    }
  });

  // Wait for all collections to be processed
  await Promise.all(localCollectionPromises);

  // Notify UI that metadata generation is complete
  figma.ui.postMessage({
    type: 'GENERATE_METADATA_COMPLETE',
  });
}
