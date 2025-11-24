import { detectFiletype } from '../filetype';
import { syncTokensFile } from './workflows/syncTokensFile';
import { syncBrandFile } from './workflows/syncBrandFile';
import { syncUiKitFile } from './workflows/syncUiKitFile';
import { syncIconsFile } from './workflows/syncIconsFile';

/**
 * Synchronizes variables between local variable collections and team library collections.
 *
 * This function routes to the appropriate workflow based on file type:
 * - Tokens file: Stores collection key, checks publish status
 * - Brand file: Syncs to Tokens, validates references
 * - UI Kit file: Syncs to Tokens and Brand, validates references
 * - Icons file: No sync needed (separate workflow)
 *
 * @async
 * @function syncMetadata
 * @returns {Promise<void>} A promise that resolves when all operations complete
 *
 * @example
 * // Basic usage
 * await syncMetadata();
 *
 * @throws {Error} May throw errors from underlying sync operations
 *
 * @since 1.0.0
 */
export async function syncMetadata(): Promise<void> {
  console.log('[syncMetadata] Starting sync workflow');

  // Detect file type first (icons files don't have collections)
  const { fileType } = await detectFiletype();
  console.log('[syncMetadata] Detected file type:', fileType);

  // Icons files don't have variable collections, handle them separately
  if (fileType === 'icons') {
    await syncIconsFile();
    return;
  }

  // Get local collections for other file types
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  if (localCollections.length === 0) {
    console.warn('[syncMetadata] No local collections found');
    return;
  }

  // Route to appropriate workflow based on file type
  if (fileType === 'tokens') {
    // Find Tokens collection (name contains "tokens")
    const tokensCollection = localCollections.find((collection) =>
      collection.name.toLowerCase().includes('tokens')
    );

    if (!tokensCollection) {
      console.error('[syncMetadata] Tokens collection not found');
      figma.ui.postMessage({
        type: 'TOKENS_COLLECTION_NOT_FOUND',
      });
      return;
    }

    // syncTokensFile will handle storing metadata and setting synchronized = false
    await syncTokensFile(tokensCollection);
  } else if (fileType === 'themes') {
    // Find Brand/Theme collection (check metadata first, then name pattern)
    const brandCollection = localCollections.find((collection) => {
      const metadataFileType = collection.getSharedPluginData('recursica', 'file-type');
      if (metadataFileType === 'themes') {
        return true;
      }
      const name = collection.name.toLowerCase();
      return name.includes('theme') || name.includes('themes');
    });

    if (!brandCollection) {
      console.error('[syncMetadata] Brand/Theme collection not found');
      figma.ui.postMessage({
        type: 'BRAND_COLLECTION_NOT_FOUND',
      });
      return;
    }

    // syncBrandFile will handle storing metadata and setting synchronized = false
    await syncBrandFile(brandCollection);
  } else if (fileType === 'ui-kit') {
    // Find UI Kit collections (check metadata first, then name pattern)
    // If detection identified it as ui-kit but metadata is wrong, fix the metadata
    const uiKitCollections = localCollections.filter((collection) => {
      const metadataFileType = collection.getSharedPluginData('recursica', 'file-type');
      const name = collection.name.toLowerCase();
      const nameMatches = name === 'layer' || name.includes('ui kit') || name.includes('uikit');

      // If name matches but metadata is wrong, fix it
      if (nameMatches && metadataFileType !== 'ui-kit') {
        console.log(
          `[syncMetadata] Fixing incorrect metadata on collection "${collection.name}": ${metadataFileType || '(none)'} -> ui-kit`
        );
        collection.setSharedPluginData('recursica', 'file-type', 'ui-kit');
        return true;
      }

      // Return true if metadata matches or name matches
      if (metadataFileType === 'ui-kit') {
        return true;
      }
      return nameMatches;
    });

    if (uiKitCollections.length === 0) {
      console.error('[syncMetadata] UI Kit collections not found');
      figma.ui.postMessage({
        type: 'UI_KIT_COLLECTIONS_NOT_FOUND',
      });
      return;
    }

    await syncUiKitFile(uiKitCollections);
  } else {
    console.error('[syncMetadata] Unknown file type:', fileType);
    figma.ui.postMessage({
      type: 'UNKNOWN_FILE_TYPE',
    });
  }
}
