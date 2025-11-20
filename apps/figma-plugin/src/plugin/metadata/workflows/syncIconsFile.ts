import { updateSyncMetadata } from '../syncMetadataStorage';

/**
 * Handles workflow for Icons file.
 *
 * Icons files don't need variable synchronization or icon export during sync.
 * We just need to:
 * 1. Store the file ID in plugin metadata for later reference
 * 2. Send completion message to show success screen
 */
export async function syncIconsFile(): Promise<void> {
  console.log('[syncIconsFile] Starting Icons file workflow');

  // Store icons metadata (just mark that icons file has been synced)
  await updateSyncMetadata({
    icons: {},
  });

  console.log('[syncIconsFile] Icons file synced');

  // Send completion message
  figma.ui.postMessage({
    type: 'ICONS_SYNC_COMPLETE',
    payload: {
      message: 'Icons file registered successfully',
    },
  });

  console.log('[syncIconsFile] Icons file workflow complete');
}
