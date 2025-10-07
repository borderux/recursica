import { syncVariables } from './syncVariables';
import { generateMetadata } from './generateMetadata';
import { detectFiletype } from '../filetype';
import { validateCollections } from './validateCollections';
import { getRemoteVariables } from './getRemoteVariables';
import { filterUnsyncedCollections } from './filterUnsyncedCollections';
import { saveEffectsInMetadata } from './saveEffectsInMetadata';

/**
 * Synchronizes variables between local variable collections and team library collections.
 *
 * This function performs the following operations:
 * 1. Retrieves local variable collections and available team library collections
 * 2. Infers the file type (themes or ui-kit) and theme name from local collections
 * 3. Validates that required collections exist in the team library based on file type
 * 4. Syncs variables between local and library collections
 * 5. Generates metadata based on the inferred file type and theme
 *
 * @async
 * @function syncMetadata
 * @returns {Promise<void>} A promise that resolves when all operations complete
 *
 * @example
 * // Basic usage
 * await syncMetadata();
 *
 * @throws {Error} May throw errors from underlying sync or metadata generation operations
 *
 * @since 1.0.0
 */
export async function syncMetadata(): Promise<void> {
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  saveEffectsInMetadata(localCollections);

  const unsyncedLocalCollections = filterUnsyncedCollections(localCollections);
  const { fileType, themeName } = await detectFiletype();

  if (unsyncedLocalCollections.length > 0) {
    const { collections, remoteVariables } = await getRemoteVariables(
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
    );
    // Validate collections
    const validation = validateCollections(collections, fileType);
    if (!validation.isValid) {
      return figma.ui.postMessage({
        type: validation.errorMessage,
      });
    }

    await syncVariables(unsyncedLocalCollections, remoteVariables);
    await generateMetadata(unsyncedLocalCollections, fileType, themeName);
  } else {
    figma.ui.postMessage({
      type: 'SYNC_VARIABLES_COMPLETE',
    });
    figma.ui.postMessage({
      type: 'GENERATE_METADATA_COMPLETE',
    });
  }
}
