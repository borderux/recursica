import { getSyncMetadata, updateSyncMetadata } from '../syncMetadataStorage';
import { saveEffectsInMetadata } from '../saveEffectsInMetadata';
import { generateMetadata } from '../generateMetadata';
import { detectFiletype } from '../../filetype';
import { validateVariableReferences } from './validateVariableReferences';
import { getLibraryCollection } from './getLibraryCollection';
import { syncVariableReferences } from './syncVariableReferences';

/**
 * Syncs variable references in Brand collection to point to Tokens collection.
 *
 * @param brandCollection - The Brand/Theme collection to sync
 * @param tokensCollectionKey - The key of the Tokens collection
 * @param tokensLibraryVariables - Library variables from Tokens collection
 */
async function syncBrandToTokens(
  brandCollection: VariableCollection,
  tokensCollectionKey: string,
  tokensLibraryVariables: LibraryVariable[]
): Promise<void> {
  console.log('[syncBrandToTokens] Syncing Brand collection to Tokens');

  // Get all variables in Tokens collection from the library, indexed by name
  // Import all library variables to get their Variable objects
  const tokensVariables = new Map<string, Variable>();
  for (const libVar of tokensLibraryVariables) {
    try {
      const importedVar = await figma.variables.importVariableByKeyAsync(libVar.key);
      tokensVariables.set(importedVar.name, importedVar);
    } catch (error) {
      console.warn(`[syncBrandToTokens] Could not import variable with key ${libVar.key}:`, error);
    }
  }

  // Use common sync function
  const targetCollections = new Map<string, Map<string, Variable>>();
  targetCollections.set('tokens', tokensVariables);

  const targetCollectionKeys = new Map<string, string>();
  targetCollectionKeys.set('tokens', tokensCollectionKey);

  await syncVariableReferences(
    [brandCollection],
    targetCollections,
    targetCollectionKeys,
    '[syncBrandToTokens]'
  );
}

/**
 * Handles synchronization workflow for Brand/Themes file.
 *
 * Steps:
 * 1. Check global metadata for Tokens entry
 * 2. Verify Tokens collection is accessible
 * 3. Sync Brand variables to Tokens (fix references)
 * 4. Validate all referenced Tokens variables exist
 * 5. Store Brand metadata
 * 6. Set collection metadata
 * 7. Prompt user to go to UI Kit file
 */
export async function syncBrandFile(brandCollection: VariableCollection): Promise<void> {
  console.log('[syncBrandFile] Starting Brand file sync workflow');

  // Check global metadata for Tokens entry
  const metadata = await getSyncMetadata();
  if (!metadata?.tokens?.collectionKey) {
    console.error('[syncBrandFile] Tokens entry not found in metadata');
    figma.ui.postMessage({
      type: 'TOKENS_NOT_FOUND',
      payload: {
        message: 'Please run the plugin in your Tokens file first',
      },
    });
    return;
  }

  let tokensCollectionKey = metadata.tokens.collectionKey;
  console.log('[syncBrandFile] Stored Tokens collection key:', tokensCollectionKey);

  // Try to access Tokens collection using the stored key
  // If it fails, try to find it by unique ID in available libraries and update the stored key
  let tokensCollection: VariableCollection | null = null;
  let tokensVariables: LibraryVariable[] = [];

  try {
    console.log('[syncBrandFile] Attempting to access Tokens collection with stored key...');
    console.log('[syncBrandFile] Collection key:', tokensCollectionKey);

    // Use utility function with fallback logic
    const result = await getLibraryCollection(tokensCollectionKey, 'tokens');

    if (!result || result.variables.length === 0) {
      throw new Error('Tokens collection has no variables or is not accessible');
    }

    // Update stored key if we found a different one
    if (result.collectionKey !== tokensCollectionKey) {
      console.log('[syncBrandFile] Updating stored Tokens key:', {
        old: tokensCollectionKey,
        new: result.collectionKey,
      });
      await updateSyncMetadata({
        tokens: {
          collectionKey: result.collectionKey,
          synchronized: metadata.tokens?.synchronized || false,
        },
      });
      tokensCollectionKey = result.collectionKey;
    }

    tokensVariables = result.variables;
    console.log(
      '[syncBrandFile] Successfully accessed Tokens collection. Variables count:',
      tokensVariables.length
    );

    // Import first variable to get access to the collection
    const importedVariable = await figma.variables.importVariableByKeyAsync(tokensVariables[0].key);
    tokensCollection = await figma.variables.getVariableCollectionByIdAsync(
      importedVariable.variableCollectionId
    );
  } catch (error) {
    // If the stored key doesn't work, the Tokens file is not published
    console.error(
      '[syncBrandFile] Cannot access Tokens collection with stored key:',
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      '[syncBrandFile] This means the Tokens file has not been published, or the key is invalid.'
    );

    // Clear Tokens entry from metadata so user goes back to Tokens file
    await updateSyncMetadata({
      tokens: undefined, // Remove tokens entry
    });
    figma.ui.postMessage({
      type: 'TOKENS_NOT_PUBLISHED',
      payload: {
        message:
          'The Tokens file has not been published. Please publish the Tokens file and then run the plugin again in the Tokens file.',
      },
    });
    return;
  }

  if (!tokensCollection) {
    // Clear Tokens entry from metadata so user goes back to Tokens file
    await updateSyncMetadata({
      tokens: undefined, // Remove tokens entry
    });
    figma.ui.postMessage({
      type: 'TOKENS_NOT_PUBLISHED',
      payload: {
        message:
          'The Tokens file has not been published. Please publish the Tokens file and then run the plugin again in the Tokens file.',
      },
    });
    return;
  }

  // Sync Brand → Tokens (fix references)
  await syncBrandToTokens(brandCollection, tokensCollectionKey, tokensVariables);

  // Store metadata - only update Brand, don't modify Tokens
  // Try to get the library key for this collection from available libraries
  // The library key is what we need to access the collection from other files
  let brandCollectionKey = brandCollection.key; // Default to local key

  try {
    const availableLibraries =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    // Find the library that matches our local collection
    // We can match by trying to import a variable and checking the collection
    for (const lib of availableLibraries) {
      try {
        const libVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(lib.key);
        if (libVariables.length > 0) {
          const importedVar = await figma.variables.importVariableByKeyAsync(libVariables[0].key);
          const libCollection = await figma.variables.getVariableCollectionByIdAsync(
            importedVar.variableCollectionId
          );
          // If the collection key matches, use the library key
          if (libCollection && libCollection.key === brandCollection.key) {
            console.log('[syncBrandFile] Found matching library key for Brand collection:', {
              localKey: brandCollection.key,
              libraryKey: lib.key,
            });
            brandCollectionKey = lib.key; // Use library key instead of local key
            break;
          }
        }
      } catch {
        // Continue to next library
        continue;
      }
    }
  } catch {
    console.warn('[syncBrandFile] Could not find library key, using local collection key');
  }

  // Build name-to-key mapping for all variables in the collection
  const variableNameToKey: Record<string, string> = {};
  for (const varId of brandCollection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(varId);
    if (variable) {
      variableNameToKey[variable.name] = variable.key;
    }
  }
  console.log(
    `[syncBrandFile] Built name-to-key mapping for ${Object.keys(variableNameToKey).length} variables`
  );

  // Get a sample variable key from the Brand collection to use for activation in other files
  let sampleVariableKey: string | undefined;
  console.log(
    '[syncBrandFile] Brand collection variable count:',
    brandCollection.variableIds.length
  );
  if (brandCollection.variableIds.length > 0) {
    try {
      const sampleVariable = await figma.variables.getVariableByIdAsync(
        brandCollection.variableIds[0]
      );
      if (sampleVariable) {
        sampleVariableKey = sampleVariable.key;
        console.log(
          '[syncBrandFile] Got sample variable key for Brand collection:',
          sampleVariableKey
        );
        console.log('[syncBrandFile] Sample variable name:', sampleVariable.name);
      } else {
        console.warn('[syncBrandFile] Sample variable is null');
      }
    } catch (error) {
      console.warn('[syncBrandFile] Could not get sample variable key:', error);
    }
  } else {
    console.warn('[syncBrandFile] Brand collection has no variables to get sample key from');
  }

  const brandUpdate = {
    collectionKey: brandCollectionKey, // Store library key if found, otherwise local key
    synchronized: false, // Set to false initially, will be set to true when user clicks Continue
    sampleVariableKey, // Store a variable key to use for activation
    variableNameToKey, // Store mapping for importing referenced variables
  };
  console.log('[syncBrandFile] Updating sync metadata with brand');
  console.log('[syncBrandFile] Brand update synchronized value:', brandUpdate.synchronized);
  console.log(
    '[syncBrandFile] Brand update sampleVariableKey value:',
    brandUpdate.sampleVariableKey
  );

  await updateSyncMetadata({
    brand: brandUpdate,
  });

  // Validate all referenced Tokens variables exist
  const validation = await validateVariableReferences(brandCollection, tokensCollection, 'tokens');

  if (!validation.isValid) {
    // Format missing variables with their reference names
    const missingWithRefs = Array.from(validation.missingVariablesWithReferences.entries())
      .map(([missingVar, refs]) => `${missingVar} (referenced by: ${refs.join(', ')})`)
      .sort();

    console.error(
      `[syncBrandFile] Missing ${validation.missingVariables.length} variable(s) in Tokens collection:`,
      missingWithRefs
    );
    // Note: Missing variables are logged but do not prevent sync from completing
  } else {
    console.log(
      '[syncBrandFile] ✅ Validation passed: All Brand variables reference valid Tokens variables'
    );
  }

  try {
    // Set collection metadata
    const { themeName } = await detectFiletype();
    brandCollection.setSharedPluginData('recursica', 'file-type', 'themes');
    await saveEffectsInMetadata([brandCollection]);
    await generateMetadata([brandCollection], 'themes', themeName);

    // Update metadata to mark Brand as synchronized
    const currentMetadata = await getSyncMetadata();
    if (currentMetadata?.brand) {
      await updateSyncMetadata({
        brand: {
          collectionKey: currentMetadata.brand.collectionKey,
          synchronized: true, // Set to true on successful sync
          sampleVariableKey: currentMetadata.brand.sampleVariableKey,
          variableNameToKey: currentMetadata.brand.variableNameToKey,
        },
      });
      console.log('[syncBrandFile] Updated Brand metadata: synchronized = true');
    }

    // Notify completion
    figma.ui.postMessage({
      type: 'BRAND_SYNC_COMPLETE',
      payload: {
        message: 'Brand synced successfully',
      },
    });

    console.log('[syncBrandFile] Brand file sync complete');
  } catch (error) {
    console.error('[syncBrandFile] Error during sync:', error);
    figma.ui.postMessage({
      type: 'BRAND_SYNC_ERROR',
      payload: {
        message: error instanceof Error ? error.message : 'Failed to sync brand',
      },
    });
  }
}

/**
 * Continues the Brand file sync workflow, skipping validation.
 * This is called when the user chooses to continue despite missing variables.
 */
export async function continueBrandSync(): Promise<void> {
  console.log('[continueBrandSync] Continuing Brand file sync workflow (skipping validation)');

  // Get local collections
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  if (localCollections.length === 0) {
    console.error('[continueBrandSync] No local collections found');
    figma.ui.postMessage({
      type: 'BRAND_COLLECTION_NOT_FOUND',
      payload: {
        message: 'No variable collections found in this file',
      },
    });
    return;
  }

  // Check if we have a stored brand collection key from metadata
  const metadata = await getSyncMetadata();
  let brandCollection: VariableCollection | null = null;

  if (metadata?.brand?.collectionKey) {
    // Try to find collection by stored key
    brandCollection =
      localCollections.find((collection) => collection.key === metadata.brand!.collectionKey) ||
      null;
  }

  // If not found by key, find by name pattern (theme or themes)
  if (!brandCollection) {
    brandCollection =
      localCollections.find((collection) => {
        const metadataFileType = collection.getSharedPluginData('recursica', 'file-type');
        if (metadataFileType === 'themes') {
          return true;
        }
        const name = collection.name.toLowerCase();
        return name.includes('theme') || name.includes('themes');
      }) || null;
  }

  // If still not found, use the first collection (fallback)
  if (!brandCollection && localCollections.length > 0) {
    console.warn(
      '[continueBrandSync] Using first collection as fallback:',
      localCollections[0].name
    );
    brandCollection = localCollections[0];
  }

  if (!brandCollection) {
    console.error('[continueBrandSync] Cannot find Brand collection');
    figma.ui.postMessage({
      type: 'BRAND_COLLECTION_NOT_FOUND',
      payload: {
        message: 'Cannot find Brand/Theme collection',
      },
    });
    return;
  }

  console.log('[continueBrandSync] Using Brand collection:', brandCollection.name);

  // Check global metadata for Tokens entry
  const syncMetadata = await getSyncMetadata();
  if (!syncMetadata?.tokens?.collectionKey) {
    console.error('[continueBrandSync] Tokens entry not found in metadata');
    figma.ui.postMessage({
      type: 'TOKENS_NOT_FOUND',
      payload: {
        message: 'Please run the plugin in your Tokens file first',
      },
    });
    return;
  }

  let tokensCollectionKey = syncMetadata.tokens.collectionKey;

  // Try to access Tokens collection using the stored key
  // If it fails, search for it by unique ID in available libraries
  let tokensCollection: VariableCollection | null = null;
  let tokensVariables: LibraryVariable[] = [];

  try {
    // Use utility function with fallback logic
    const result = await getLibraryCollection(tokensCollectionKey, 'tokens');

    if (!result || result.variables.length === 0) {
      throw new Error('Tokens collection has no variables or is not accessible');
    }

    // Update stored key if we found a different one
    if (result.collectionKey !== tokensCollectionKey) {
      await updateSyncMetadata({
        tokens: {
          collectionKey: result.collectionKey,
          synchronized: syncMetadata.tokens?.synchronized || false,
        },
      });
      tokensCollectionKey = result.collectionKey;
    }

    tokensVariables = result.variables;

    // Import first variable to get access to the collection
    const importedVariable = await figma.variables.importVariableByKeyAsync(tokensVariables[0].key);
    tokensCollection = await figma.variables.getVariableCollectionByIdAsync(
      importedVariable.variableCollectionId
    );
  } catch (error) {
    // If the stored key doesn't work, the Tokens file is not published
    console.error(
      '[continueBrandSync] Cannot access Tokens collection with stored key:',
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      '[continueBrandSync] This means the Tokens file has not been published, or the key is invalid.'
    );

    // Clear Tokens entry from metadata so user goes back to Tokens file
    await updateSyncMetadata({
      tokens: undefined, // Remove tokens entry
    });
    figma.ui.postMessage({
      type: 'TOKENS_NOT_PUBLISHED',
      payload: {
        message:
          'The Tokens file has not been published. Please publish the Tokens file and then run the plugin again in the Tokens file.',
      },
    });
    return;
  }

  if (!tokensCollection) {
    // Clear Tokens entry from metadata so user goes back to Tokens file
    await updateSyncMetadata({
      tokens: undefined, // Remove tokens entry
    });
    figma.ui.postMessage({
      type: 'TOKENS_NOT_PUBLISHED',
      payload: {
        message:
          'The Tokens file has not been published. Please publish the Tokens file and then run the plugin again in the Tokens file.',
      },
    });
    return;
  }

  // Sync Brand → Tokens (fix references) - already done, but safe to run again
  await syncBrandToTokens(brandCollection, tokensCollectionKey, tokensVariables);

  // Store metadata (skip validation) - only update Brand, don't modify Tokens
  try {
    // Get a sample variable key from the Brand collection to use for activation in other files
    let sampleVariableKey: string | undefined;
    console.log(
      '[continueBrandSync] Brand collection variable count:',
      brandCollection.variableIds.length
    );
    if (brandCollection.variableIds.length > 0) {
      try {
        const sampleVariable = await figma.variables.getVariableByIdAsync(
          brandCollection.variableIds[0]
        );
        if (sampleVariable) {
          sampleVariableKey = sampleVariable.key;
          console.log(
            '[continueBrandSync] Got sample variable key for Brand collection:',
            sampleVariableKey
          );
          console.log('[continueBrandSync] Sample variable name:', sampleVariable.name);
        } else {
          console.warn('[continueBrandSync] Sample variable is null');
        }
      } catch (error) {
        console.warn('[continueBrandSync] Could not get sample variable key:', error);
      }
    } else {
      console.warn('[continueBrandSync] Brand collection has no variables to get sample key from');
    }

    // Try to get the library key for this collection from available libraries
    let brandCollectionKey = brandCollection.key; // Default to local key
    try {
      const availableLibraries =
        await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      // Find the library that matches our local collection
      for (const lib of availableLibraries) {
        try {
          const libVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
            lib.key
          );
          if (libVariables.length > 0) {
            const importedVar = await figma.variables.importVariableByKeyAsync(libVariables[0].key);
            const libCollection = await figma.variables.getVariableCollectionByIdAsync(
              importedVar.variableCollectionId
            );
            // If the collection key matches, use the library key
            if (libCollection && libCollection.key === brandCollection.key) {
              console.log('[continueBrandSync] Found matching library key for Brand collection:', {
                localKey: brandCollection.key,
                libraryKey: lib.key,
              });
              brandCollectionKey = lib.key; // Use library key instead of local key
              break;
            }
          }
        } catch {
          // Continue to next library
          continue;
        }
      }
    } catch {
      console.warn('[continueBrandSync] Could not find library key, using local collection key');
    }

    // Build name-to-key mapping for all variables in the collection
    const variableNameToKey: Record<string, string> = {};
    for (const varId of brandCollection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (variable) {
        variableNameToKey[variable.name] = variable.key;
      }
    }
    console.log(
      `[continueBrandSync] Built name-to-key mapping for ${Object.keys(variableNameToKey).length} variables`
    );

    const brandUpdate = {
      collectionKey: brandCollectionKey, // Store library key if found, otherwise local key
      synchronized: true, // Set to true on successful sync
      sampleVariableKey, // Store a variable key to use for activation
      variableNameToKey, // Store mapping for importing referenced variables
    };
    console.log('[continueBrandSync] Updating sync metadata with brand');
    console.log(
      '[continueBrandSync] Brand update sampleVariableKey value:',
      brandUpdate.sampleVariableKey
    );
    await updateSyncMetadata({
      brand: brandUpdate,
    });

    // Set collection metadata
    const { themeName } = await detectFiletype();
    brandCollection.setSharedPluginData('recursica', 'file-type', 'themes');
    await saveEffectsInMetadata([brandCollection]);
    await generateMetadata([brandCollection], 'themes', themeName);

    // Notify completion
    figma.ui.postMessage({
      type: 'BRAND_SYNC_COMPLETE',
      payload: {
        message: 'Brand synced successfully',
      },
    });

    console.log('[continueBrandSync] Brand file sync complete (validation skipped)');
  } catch (error) {
    console.error('[continueBrandSync] Error during sync:', error);
    figma.ui.postMessage({
      type: 'BRAND_SYNC_ERROR',
      payload: {
        message: error instanceof Error ? error.message : 'Failed to sync brand',
      },
    });
  }
}

/**
 * Marks Brand as synchronized in metadata.
 * Called when user clicks Continue on the error page.
 */
export async function markBrandSynchronized(): Promise<void> {
  console.log('[markBrandSynchronized] Marking Brand as synchronized');
  const metadata = await getSyncMetadata();

  if (!metadata?.brand) {
    console.error('[markBrandSynchronized] Brand entry not found in metadata');
    return;
  }

  await updateSyncMetadata({
    brand: {
      collectionKey: metadata.brand.collectionKey,
      synchronized: true,
      sampleVariableKey: metadata.brand.sampleVariableKey,
      variableNameToKey: metadata.brand.variableNameToKey,
    },
  });

  // Send updated metadata to UI
  const updatedMetadata = await getSyncMetadata();
  figma.ui.postMessage({
    type: 'SYNC_METADATA_LOADED',
    payload: updatedMetadata,
  });

  console.log('[markBrandSynchronized] Brand marked as synchronized');
}
