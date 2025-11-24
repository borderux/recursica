/**
 * Global plugin metadata storage for tracking synchronization state across files.
 *
 * This metadata is stored in figma.clientStorage and persists across plugin sessions
 * and files, allowing us to track which files have been synced and their collection keys.
 */

export interface SyncMetadata {
  tokens?: {
    collectionKey: string;
    synchronized: boolean;
    variableNameToKey?: Record<string, string>; // Map of variable name -> variable key for importing
  };
  brand?: {
    collectionKey: string;
    synchronized: boolean;
    sampleVariableKey?: string; // Key of a variable to import to activate the collection
    variableNameToKey?: Record<string, string>; // Map of variable name -> variable key for importing
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
    await figma.clientStorage.setAsync(STORAGE_KEY, jsonString);
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
  // If a property is explicitly set to undefined, remove it from the merged result
  if ('tokens' in updates) {
    if (updates.tokens === undefined) {
      // Explicitly remove tokens entry
      delete merged.tokens;
    } else if (updates.tokens) {
      const existingTokens = existing?.tokens;
      // Create new object with only the fields we want - this strips out any old fields
      // like uniqueId or needsConnection that may exist in stored metadata
      merged.tokens = {
        collectionKey: updates.tokens.collectionKey || existingTokens?.collectionKey || '',
        synchronized:
          updates.tokens.synchronized !== undefined
            ? updates.tokens.synchronized
            : existingTokens?.synchronized || false,
      };

      // Handle variableNameToKey - use new value if provided, otherwise keep existing
      if (updates.tokens.variableNameToKey !== undefined) {
        merged.tokens.variableNameToKey = updates.tokens.variableNameToKey;
      } else if (existingTokens?.variableNameToKey !== undefined) {
        merged.tokens.variableNameToKey = existingTokens.variableNameToKey;
      }
    }
  }

  if ('brand' in updates) {
    if (updates.brand === undefined) {
      // Explicitly remove brand entry
      delete merged.brand;
    } else if (updates.brand) {
      const existingBrand = existing?.brand;
      const brandSynchronized =
        updates.brand.synchronized !== undefined
          ? updates.brand.synchronized
          : existingBrand?.synchronized || false;
      const brandData: {
        collectionKey: string;
        synchronized: boolean;
        sampleVariableKey?: string;
        variableNameToKey?: Record<string, string>;
      } = {
        collectionKey: updates.brand.collectionKey || existingBrand?.collectionKey || '',
        synchronized: brandSynchronized,
      };

      // Handle sampleVariableKey - use new value if provided, otherwise keep existing
      if (updates.brand.sampleVariableKey !== undefined) {
        brandData.sampleVariableKey = updates.brand.sampleVariableKey;
      } else if (existingBrand?.sampleVariableKey !== undefined) {
        brandData.sampleVariableKey = existingBrand.sampleVariableKey;
      }

      // Handle variableNameToKey - use new value if provided, otherwise keep existing
      if (updates.brand.variableNameToKey !== undefined) {
        brandData.variableNameToKey = updates.brand.variableNameToKey;
      } else if (existingBrand?.variableNameToKey !== undefined) {
        brandData.variableNameToKey = existingBrand.variableNameToKey;
      }

      merged.brand = brandData;
      console.log(
        '[updateSyncMetadata] Brand update - sampleVariableKey:',
        merged.brand.sampleVariableKey
      );
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
  }

  if ('icons' in updates) {
    if (updates.icons === undefined) {
      // Explicitly remove icons entry
      delete merged.icons;
    } else if (updates.icons) {
      merged.icons = {};
    }
  }

  if ('uiKit' in updates) {
    if (updates.uiKit === undefined) {
      // Explicitly remove uiKit entry
      delete merged.uiKit;
    } else if (updates.uiKit) {
      const existingUiKit = existing?.uiKit;
      merged.uiKit = {
        synchronized:
          updates.uiKit.synchronized !== undefined
            ? updates.uiKit.synchronized
            : existingUiKit?.synchronized || false,
      };
    }
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
