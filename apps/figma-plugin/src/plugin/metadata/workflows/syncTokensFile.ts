import { getSyncMetadata, updateSyncMetadata } from '../syncMetadataStorage';
import { saveEffectsInMetadata } from '../saveEffectsInMetadata';

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
    // Store metadata (always store, even if publish status is unknown)
    const tokensUpdate = {
      collectionKey: tokensCollection.key,
      needsConnection: true,
      synchronized: true, // Set to true on successful sync
    };
    console.log('[syncTokensFile] Updating sync metadata with tokens:', tokensUpdate);
    await updateSyncMetadata({
      tokens: tokensUpdate,
    });

    // Set collection metadata
    tokensCollection.setSharedPluginData('recursica', 'file-type', 'tokens');
    await saveEffectsInMetadata([tokensCollection]);

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
