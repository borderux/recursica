import { getSyncMetadata, updateSyncMetadata } from '../syncMetadataStorage';
import { saveEffectsInMetadata } from '../saveEffectsInMetadata';
import { generateMetadata } from '../generateMetadata';
import { detectFiletype } from '../../filetype';
import { validateVariableReferences } from './validateVariableReferences';

/**
 * Syncs variable references in Brand collection to point to Tokens collection.
 *
 * @param brandCollection - The Brand/Theme collection to sync
 * @param tokensCollectionKey - The key of the Tokens collection
 * @param tokensCollection - The Tokens collection object
 */
async function syncBrandToTokens(
  brandCollection: VariableCollection,
  tokensCollectionKey: string,
  tokensCollection: VariableCollection
): Promise<void> {
  console.log('[syncBrandToTokens] Syncing Brand collection to Tokens');

  // Get all variables in Tokens collection, indexed by name
  const tokensVariables = new Map<string, Variable>();
  for (const varId of tokensCollection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(varId);
    if (variable) {
      tokensVariables.set(variable.name, variable);
    }
  }

  // Process all variables in Brand collection
  for (const varId of brandCollection.variableIds) {
    const brandVariable = await figma.variables.getVariableByIdAsync(varId);
    if (!brandVariable) continue;

    // Check all mode values for VARIABLE_ALIAS references
    for (const [modeId, modeValue] of Object.entries(brandVariable.valuesByMode)) {
      if (modeValue && typeof modeValue === 'object' && 'type' in modeValue) {
        const aliasValue = modeValue as VariableAlias;
        if (aliasValue.type === 'VARIABLE_ALIAS') {
          // Get the referenced variable
          const referencedVar = await figma.variables.getVariableByIdAsync(aliasValue.id);
          if (!referencedVar) continue;

          // Check if referenced variable belongs to Tokens collection
          const referencedCollection = await figma.variables.getVariableCollectionByIdAsync(
            referencedVar.variableCollectionId
          );
          if (!referencedCollection) continue;

          // Check if it's a Tokens collection (by checking if name contains "token" or key matches)
          const isTokensCollection =
            referencedCollection.key === tokensCollectionKey ||
            referencedCollection.name.toLowerCase().includes('token');

          if (isTokensCollection) {
            // Find the corresponding variable in the new Tokens collection by name
            const newTokensVar = tokensVariables.get(referencedVar.name);
            if (newTokensVar) {
              // Update the reference to point to the new Tokens variable
              const newRefVal: VariableValue = {
                type: 'VARIABLE_ALIAS',
                id: newTokensVar.id,
              };
              brandVariable.setValueForMode(modeId, newRefVal);
              console.log(
                `[syncBrandToTokens] Updated reference: "${brandVariable.name}" -> "${newTokensVar.name}"`
              );
            }
          }
        }
      }
    }
  }
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

  const tokensCollectionKey = metadata.tokens.collectionKey;

  // Verify Tokens collection is accessible
  let tokensCollection: VariableCollection | null = null;
  try {
    // Try to get variables from the Tokens collection
    const tokensVariables =
      await figma.teamLibrary.getVariablesInLibraryCollectionAsync(tokensCollectionKey);

    if (tokensVariables.length === 0) {
      throw new Error('Tokens collection has no variables');
    }

    // Import first variable to get access to the collection
    const importedVariable = await figma.variables.importVariableByKeyAsync(tokensVariables[0].key);
    tokensCollection = await figma.variables.getVariableCollectionByIdAsync(
      importedVariable.variableCollectionId
    );
  } catch (error) {
    console.error('[syncBrandFile] Cannot access Tokens collection:', error);
    figma.ui.postMessage({
      type: 'TOKENS_NOT_ACCESSIBLE',
      payload: {
        message: 'Cannot access Tokens collection. Please add Tokens as a library in this file.',
      },
    });
    return;
  }

  if (!tokensCollection) {
    figma.ui.postMessage({
      type: 'TOKENS_NOT_ACCESSIBLE',
      payload: {
        message: 'Cannot access Tokens collection. Please add Tokens as a library in this file.',
      },
    });
    return;
  }

  // Sync Brand → Tokens (fix references)
  await syncBrandToTokens(brandCollection, tokensCollectionKey, tokensCollection);

  // Validate all referenced Tokens variables exist
  const validation = await validateVariableReferences(brandCollection, tokensCollection, 'tokens');

  if (!validation.isValid) {
    console.error(
      `[syncBrandFile] Missing variables in Tokens collection:`,
      validation.missingVariables
    );
    // Store the collection key before returning so continueBrandSync can use it
    await updateSyncMetadata({
      brand: {
        collectionKey: brandCollection.key,
        synchronized: false,
        published: true,
      },
    });
    figma.ui.postMessage({
      type: 'MISSING_VARIABLES',
      payload: {
        count: validation.missingVariables.length,
        collectionName: 'Tokens',
        missingVariables: validation.missingVariables, // For console logging in UI
        brandCollectionKey: brandCollection.key, // Store collection key for continue
      },
    });
    return;
  }

  // Find the library collection key if the collection is published
  // When checking from within the Brand file, the collection is LOCAL,
  // so we need to find it in the available library collections
  let libraryCollectionKey = brandCollection.key;
  try {
    const availableLibraries =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const matchingLibrary = availableLibraries.find((lib) => lib.key === brandCollection.key);
    if (matchingLibrary) {
      libraryCollectionKey = matchingLibrary.key;
      console.log(
        '[syncBrandFile] Found Brand collection in available libraries:',
        libraryCollectionKey
      );
    } else {
      console.warn(
        '[syncBrandFile] Brand collection not found in available libraries - may not be published'
      );
    }
  } catch (error) {
    console.warn('[syncBrandFile] Could not check library collections:', error);
  }

  try {
    // Store metadata - only update Brand, don't modify Tokens
    const brandUpdate = {
      collectionKey: libraryCollectionKey || brandCollection.key, // Use library collection key if found, otherwise use local key
      synchronized: true, // Set to true on successful sync
      published: true, // Assume published if we can access it
    };
    console.log('[syncBrandFile] Updating sync metadata with brand:', brandUpdate);
    console.log('[syncBrandFile] Brand update synchronized value:', brandUpdate.synchronized);

    await updateSyncMetadata({
      brand: brandUpdate,
    });

    // Verify the update was saved correctly
    const verifyMetadata = await getSyncMetadata();
    console.log('[syncBrandFile] Verified metadata after update:', verifyMetadata);
    console.log(
      '[syncBrandFile] Verified brand.synchronized:',
      verifyMetadata?.brand?.synchronized
    );
    if (verifyMetadata?.brand?.synchronized !== true) {
      console.error('[syncBrandFile] ERROR: Brand synchronized is not true after update!');
    }

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

  const tokensCollectionKey = syncMetadata.tokens.collectionKey;

  // Verify Tokens collection is accessible
  let tokensCollection: VariableCollection | null = null;
  try {
    const tokensVariables =
      await figma.teamLibrary.getVariablesInLibraryCollectionAsync(tokensCollectionKey);

    if (tokensVariables.length === 0) {
      throw new Error('Tokens collection has no variables');
    }

    const importedVariable = await figma.variables.importVariableByKeyAsync(tokensVariables[0].key);
    tokensCollection = await figma.variables.getVariableCollectionByIdAsync(
      importedVariable.variableCollectionId
    );
  } catch (error) {
    console.error('[continueBrandSync] Cannot access Tokens collection:', error);
    figma.ui.postMessage({
      type: 'TOKENS_NOT_ACCESSIBLE',
      payload: {
        message: 'Cannot access Tokens collection. Please add Tokens as a library in this file.',
      },
    });
    return;
  }

  if (!tokensCollection) {
    figma.ui.postMessage({
      type: 'TOKENS_NOT_ACCESSIBLE',
      payload: {
        message: 'Cannot access Tokens collection. Please add Tokens as a library in this file.',
      },
    });
    return;
  }

  // Sync Brand → Tokens (fix references) - already done, but safe to run again
  await syncBrandToTokens(brandCollection, tokensCollectionKey, tokensCollection);

  // Store metadata (skip validation) - only update Brand, don't modify Tokens
  try {
    const brandUpdate = {
      collectionKey: brandCollection.key,
      synchronized: true, // Set to true on successful sync
      published: true,
    };
    console.log('[continueBrandSync] Updating sync metadata with brand:', brandUpdate);
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
