import { getSyncMetadata, updateSyncMetadata } from '../syncMetadataStorage';
// import { saveEffectsInMetadata } from '../saveEffectsInMetadata'; // COMMENTED OUT: May mark file as modified

/**
 * Handles synchronization workflow for Tokens file.
 *
 * Steps:
 * 1. Check global metadata for existing sync status
 * 2. Check if Tokens collection is published
 * 3. Store collection key in global metadata
 * 4. Set collection metadata (file-type, styles)
 * 5. Prompt user to go to Brand file
 */
export async function syncTokensFile(tokensCollection: VariableCollection): Promise<void> {
  console.log('[syncTokensFile] Starting Tokens file sync workflow');

  // Check global metadata
  const metadata = await getSyncMetadata();
  const tokensEntry = metadata?.tokens;

  // If already synced, show message and return
  if (tokensEntry?.synchronized === true) {
    console.log('[syncTokensFile] Tokens already synchronized');
    figma.ui.postMessage({
      type: 'TOKENS_ALREADY_SYNCED',
    });
    return;
  }

  try {
    console.log('[syncTokensFile] Local collection key:', tokensCollection.key);
    console.log('[syncTokensFile] Local collection name:', tokensCollection.name);
    console.log('[syncTokensFile] Collection variable count:', tokensCollection.variableIds.length);

    // Build name-to-key mapping for all variables in the collection
    const variableNameToKey: Record<string, string> = {};
    for (const varId of tokensCollection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (variable) {
        variableNameToKey[variable.name] = variable.key;
      }
    }
    console.log(
      `[syncTokensFile] Built name-to-key mapping for ${Object.keys(variableNameToKey).length} variables`
    );

    // Store the local collection key and variable mapping
    // NOTE: When a file is published, the local collection key should work when accessed from other files
    // using getVariablesInLibraryCollectionAsync(). If it returns 0 variables, it means the file
    // hasn't been published or the collection isn't accessible as a library.
    const tokensUpdate = {
      collectionKey: tokensCollection.key, // Local key - should work if published
      synchronized: true, // Set to true on successful sync
      variableNameToKey, // Store mapping for importing referenced variables
    };
    console.log('[syncTokensFile] Updating sync metadata with tokens (local key):', tokensUpdate);
    console.log(
      '[syncTokensFile] IMPORTANT: The Tokens file must be published for this key to work from other files.'
    );
    await updateSyncMetadata({
      tokens: tokensUpdate,
    });

    // COMMENTED OUT: saveEffectsInMetadata may also mark file as modified
    // await saveEffectsInMetadata([tokensCollection]);

    // Notify completion - navigate to success page
    figma.ui.postMessage({
      type: 'TOKENS_SYNC_COMPLETE',
      payload: {
        message: 'Tokens synced successfully',
      },
    });

    console.log('[syncTokensFile] Tokens file sync complete');
  } catch (error) {
    console.error('[syncTokensFile] Error during sync:', error);
    figma.ui.postMessage({
      type: 'TOKENS_SYNC_ERROR',
      payload: {
        message: error instanceof Error ? error.message : 'Failed to sync tokens',
      },
    });
  }
}
