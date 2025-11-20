/**
 * Global plugin metadata storage for tracking synchronization state across files.
 *
 * This metadata is stored in figma.clientStorage and persists across plugin sessions
 * and files, allowing us to track which files have been synced and their collection keys.
 */

export interface SyncMetadata {
  tokens?: {
    collectionKey: string;
    needsConnection: boolean;
    synchronized: boolean;
  };
  brand?: {
    collectionKey: string;
    synchronized: boolean;
    published: boolean;
  };
  icons?: {};
  uiKit?: {
    synchronized: boolean;
  };
}

const STORAGE_KEY = 'recursica-sync-metadata';

/**
 * Gets the current sync metadata from global plugin storage.
 *
 * @returns Promise resolving to the sync metadata object, or null if not set
 */
export async function getSyncMetadata(): Promise<SyncMetadata | null> {
  try {
    const data = await figma.clientStorage.getAsync(STORAGE_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data as string) as SyncMetadata;
  } catch (error) {
    console.error('[getSyncMetadata] Error reading sync metadata:', error);
    return null;
  }
}

/**
 * Saves sync metadata to global plugin storage.
 *
 * @param metadata - The sync metadata object to save
 */
export async function saveSyncMetadata(metadata: SyncMetadata): Promise<void> {
  try {
    const jsonString = JSON.stringify(metadata);
    console.log('[saveSyncMetadata] Writing to global plugin storage:');
    console.log('[saveSyncMetadata] Storage key:', STORAGE_KEY);
    console.log('[saveSyncMetadata] Metadata object:', metadata);
    console.log('[saveSyncMetadata] JSON string:', jsonString);
    await figma.clientStorage.setAsync(STORAGE_KEY, jsonString);

    // Verify what was written
    const verifyData = await figma.clientStorage.getAsync(STORAGE_KEY);
    console.log('[saveSyncMetadata] Verified written data:', verifyData);
    if (verifyData) {
      const parsed = JSON.parse(verifyData as string);
      console.log('[saveSyncMetadata] Parsed verified data:', parsed);
    }
  } catch (error) {
    console.error('[saveSyncMetadata] Error saving sync metadata:', error);
    throw error;
  }
}

/**
 * Updates sync metadata by merging with existing data.
 *
 * @param updates - Partial metadata object to merge with existing data
 */
export async function updateSyncMetadata(updates: Partial<SyncMetadata>): Promise<void> {
  const existing = await getSyncMetadata();
  const merged: SyncMetadata = {};

  // Merge top-level properties from existing
  if (existing) {
    if (existing.tokens) {
      merged.tokens = existing.tokens;
    }
    if (existing.brand) {
      merged.brand = existing.brand;
    }
    if (existing.icons) {
      merged.icons = existing.icons;
    }
    if (existing.uiKit) {
      merged.uiKit = existing.uiKit;
    }
  }

  // Apply updates - deep merge nested objects
  if (updates.tokens) {
    const existingTokens = existing?.tokens;
    merged.tokens = {
      collectionKey: updates.tokens.collectionKey || existingTokens?.collectionKey || '',
      needsConnection:
        updates.tokens.needsConnection !== undefined
          ? updates.tokens.needsConnection
          : existingTokens?.needsConnection || false,
      synchronized:
        updates.tokens.synchronized !== undefined
          ? updates.tokens.synchronized
          : existingTokens?.synchronized || false,
    };
  }

  if (updates.brand) {
    const existingBrand = existing?.brand;
    const brandSynchronized =
      updates.brand.synchronized !== undefined
        ? updates.brand.synchronized
        : existingBrand?.synchronized || false;
    merged.brand = {
      collectionKey: updates.brand.collectionKey || existingBrand?.collectionKey || '',
      synchronized: brandSynchronized,
      published:
        updates.brand.published !== undefined
          ? updates.brand.published
          : existingBrand?.published || false,
    };
    console.log('[updateSyncMetadata] Brand update - synchronized value:', brandSynchronized);
    console.log(
      '[updateSyncMetadata] Brand update - updates.brand.synchronized:',
      updates.brand.synchronized
    );
    console.log(
      '[updateSyncMetadata] Brand update - existingBrand?.synchronized:',
      existingBrand?.synchronized
    );
  }

  if (updates.icons) {
    merged.icons = {};
  }

  if (updates.uiKit) {
    const existingUiKit = existing?.uiKit;
    merged.uiKit = {
      synchronized:
        updates.uiKit.synchronized !== undefined
          ? updates.uiKit.synchronized
          : existingUiKit?.synchronized || false,
    };
  }

  await saveSyncMetadata(merged);
}

/**
 * Clears all sync metadata (useful for reset/testing).
 */
export async function clearSyncMetadata(): Promise<void> {
  await figma.clientStorage.deleteAsync(STORAGE_KEY);
  console.log('[clearSyncMetadata] Cleared sync metadata');
}
