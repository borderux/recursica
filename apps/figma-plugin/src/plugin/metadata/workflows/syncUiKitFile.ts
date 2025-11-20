import { getSyncMetadata, updateSyncMetadata } from '../syncMetadataStorage';
import { saveEffectsInMetadata } from '../saveEffectsInMetadata';
import { generateMetadata } from '../generateMetadata';
import { validateVariableReferences } from './validateVariableReferences';

/**
 * Syncs variable references in UI Kit collections to point to Tokens and Brand collections.
 *
 * @param uiKitCollections - The UI Kit collections to sync
 * @param tokensCollectionKey - The key of the Tokens collection
 * @param tokensCollection - The Tokens collection object
 * @param brandCollectionKey - The key of the Brand collection
 * @param brandCollection - The Brand collection object
 */
async function syncUiKitToCollections(
  uiKitCollections: VariableCollection[],
  tokensCollectionKey: string,
  tokensCollection: VariableCollection,
  brandCollectionKey: string,
  brandCollection: VariableCollection
): Promise<void> {
  console.log('[syncUiKitToCollections] Syncing UI Kit collections to Tokens and Brand');

  // Get all variables in Tokens and Brand collections, indexed by name
  const tokensVariables = new Map<string, Variable>();
  for (const varId of tokensCollection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(varId);
    if (variable) {
      tokensVariables.set(variable.name, variable);
    }
  }

  const brandVariables = new Map<string, Variable>();
  for (const varId of brandCollection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(varId);
    if (variable) {
      brandVariables.set(variable.name, variable);
    }
  }

  // Process all variables in UI Kit collections
  for (const collection of uiKitCollections) {
    for (const varId of collection.variableIds) {
      const uiKitVariable = await figma.variables.getVariableByIdAsync(varId);
      if (!uiKitVariable) continue;

      // Check all mode values for VARIABLE_ALIAS references
      for (const [modeId, modeValue] of Object.entries(uiKitVariable.valuesByMode)) {
        if (modeValue && typeof modeValue === 'object' && 'type' in modeValue) {
          const aliasValue = modeValue as VariableAlias;
          if (aliasValue.type === 'VARIABLE_ALIAS') {
            // Get the referenced variable
            const referencedVar = await figma.variables.getVariableByIdAsync(aliasValue.id);
            if (!referencedVar) continue;

            // Check if referenced variable belongs to Tokens or Brand collection
            const referencedCollection = await figma.variables.getVariableCollectionByIdAsync(
              referencedVar.variableCollectionId
            );
            if (!referencedCollection) continue;

            // Check if it's Tokens collection
            const isTokensCollection =
              referencedCollection.key === tokensCollectionKey ||
              referencedCollection.name.toLowerCase().includes('token');

            // Check if it's Brand collection
            const isBrandCollection =
              referencedCollection.key === brandCollectionKey ||
              referencedCollection.name.toLowerCase().includes('theme');

            if (isTokensCollection) {
              // Find the corresponding variable in the new Tokens collection by name
              const newTokensVar = tokensVariables.get(referencedVar.name);
              if (newTokensVar) {
                // Update the reference to point to the new Tokens variable
                const newRefVal: VariableValue = {
                  type: 'VARIABLE_ALIAS',
                  id: newTokensVar.id,
                };
                uiKitVariable.setValueForMode(modeId, newRefVal);
                console.log(
                  `[syncUiKitToCollections] Updated Tokens reference: "${uiKitVariable.name}" -> "${newTokensVar.name}"`
                );
              }
            } else if (isBrandCollection) {
              // Find the corresponding variable in the new Brand collection by name
              const newBrandVar = brandVariables.get(referencedVar.name);
              if (newBrandVar) {
                // Update the reference to point to the new Brand variable
                const newRefVal: VariableValue = {
                  type: 'VARIABLE_ALIAS',
                  id: newBrandVar.id,
                };
                uiKitVariable.setValueForMode(modeId, newRefVal);
                console.log(
                  `[syncUiKitToCollections] Updated Brand reference: "${uiKitVariable.name}" -> "${newBrandVar.name}"`
                );
              }
            }
          }
        }
      }
    }
  }
}

/**
 * Handles synchronization workflow for UI Kit file.
 *
 * Steps:
 * 1. Check global metadata for Tokens and Brand entries
 * 2. Verify both collections are accessible
 * 3. Check sync status
 * 4. Sync UI Kit variables to Tokens & Brand (fix references)
 * 5. Validate all referenced variables exist
 * 6. Update metadata (set synchronized = true)
 * 7. Set collection metadata
 */
export async function syncUiKitFile(uiKitCollections: VariableCollection[]): Promise<void> {
  console.log('[syncUiKitFile] Starting UI Kit file sync workflow');

  // Check global metadata for Tokens and Brand entries
  const metadata = await getSyncMetadata();
  if (!metadata?.tokens?.collectionKey) {
    console.error('[syncUiKitFile] Tokens entry not found in metadata');
    figma.ui.postMessage({
      type: 'TOKENS_NOT_FOUND',
      payload: {
        message: 'Please run the plugin in your Tokens file first',
      },
    });
    return;
  }

  if (!metadata?.brand?.collectionKey) {
    console.error('[syncUiKitFile] Brand entry not found in metadata');
    figma.ui.postMessage({
      type: 'BRAND_NOT_FOUND',
      payload: {
        message: 'Please run the plugin in your Brand file first',
      },
    });
    return;
  }

  const tokensCollectionKey = metadata.tokens.collectionKey;
  const brandCollectionKey = metadata.brand.collectionKey;

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
    console.error('[syncUiKitFile] Cannot access Tokens collection:', error);
    figma.ui.postMessage({
      type: 'TOKENS_NOT_ACCESSIBLE',
      payload: {
        message: 'Cannot access Tokens collection. Please add Tokens as a library.',
      },
    });
    return;
  }

  // Verify Brand collection is accessible
  // First, try to find the collection in available library collections
  // The stored key might be a local key, so we need to find the library key
  let actualBrandCollectionKey = brandCollectionKey;
  let brandCollection: VariableCollection | null = null;

  try {
    // Try to find the Brand collection in available library collections
    const availableLibraries =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

    // First, try to find by the stored key
    let matchingLibrary = availableLibraries.find((lib) => lib.key === brandCollectionKey);

    // If not found by key, try to find by name (Theme or Themes)
    if (!matchingLibrary) {
      console.log('[syncUiKitFile] Brand collection not found by key, searching by name...');
      matchingLibrary = availableLibraries.find((lib) => {
        const name = lib.name.toLowerCase();
        return name === 'theme' || name === 'themes' || name.includes('theme');
      });
    }

    if (matchingLibrary) {
      actualBrandCollectionKey = matchingLibrary.key;
      console.log(
        '[syncUiKitFile] Found Brand collection in libraries:',
        actualBrandCollectionKey,
        matchingLibrary.name
      );
    } else {
      console.warn('[syncUiKitFile] Brand collection not found in available libraries');
      figma.ui.postMessage({
        type: 'BRAND_NOT_ACCESSIBLE',
        payload: {
          message:
            'Brand collection not found. Please ensure the Brand file is published and added as a library.',
        },
      });
      return;
    }

    // Now try to get variables using the library collection key
    const brandVariables =
      await figma.teamLibrary.getVariablesInLibraryCollectionAsync(actualBrandCollectionKey);

    // If collection has no variables, it might not be published or accessible
    if (brandVariables.length === 0) {
      console.warn(
        '[syncUiKitFile] Brand collection has no variables - may not be published or accessible'
      );
      figma.ui.postMessage({
        type: 'BRAND_NOT_ACCESSIBLE',
        payload: {
          message:
            'Brand collection has no variables. Please ensure the Brand file is published and added as a library.',
        },
      });
      return;
    }

    const importedVariable = await figma.variables.importVariableByKeyAsync(brandVariables[0].key);
    brandCollection = await figma.variables.getVariableCollectionByIdAsync(
      importedVariable.variableCollectionId
    );
  } catch (error) {
    console.error('[syncUiKitFile] Cannot access Brand collection:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Provide more specific error message based on the error
    let userMessage = 'Cannot access Brand collection. Please add Brand as a library.';
    if (errorMessage.includes('not found') || errorMessage.includes('not accessible')) {
      userMessage =
        'Brand collection not found. Please ensure the Brand file is published and added as a library.';
    }

    figma.ui.postMessage({
      type: 'BRAND_NOT_ACCESSIBLE',
      payload: {
        message: userMessage,
      },
    });
    return;
  }

  if (!tokensCollection || !brandCollection) {
    return;
  }

  // Always perform sync when user clicks Sync button
  // Sync UI Kit → Tokens & Brand (fix references)
  await syncUiKitToCollections(
    uiKitCollections,
    tokensCollectionKey,
    tokensCollection,
    brandCollectionKey,
    brandCollection
  );

  // Validate all referenced variables exist
  const tokensValidation = await validateVariableReferences(
    uiKitCollections[0], // Validate first collection as representative
    tokensCollection,
    'tokens'
  );

  const brandValidation = await validateVariableReferences(
    uiKitCollections[0], // Validate first collection as representative
    brandCollection,
    'brand'
  );

  if (!tokensValidation.isValid) {
    console.error(
      `[syncUiKitFile] Missing variables in Tokens collection:`,
      tokensValidation.missingVariables
    );
    figma.ui.postMessage({
      type: 'MISSING_VARIABLES',
      payload: {
        count: tokensValidation.missingVariables.length,
        collectionName: 'Tokens',
        missingVariables: tokensValidation.missingVariables,
      },
    });
    return;
  }

  if (!brandValidation.isValid) {
    console.error(
      `[syncUiKitFile] Missing variables in Brand collection:`,
      brandValidation.missingVariables
    );
    figma.ui.postMessage({
      type: 'MISSING_VARIABLES',
      payload: {
        count: brandValidation.missingVariables.length,
        collectionName: 'Brand',
        missingVariables: brandValidation.missingVariables,
      },
    });
    return;
  }

  // Update metadata (set synchronized = true)
  const tokensUpdate = metadata.tokens
    ? {
        collectionKey: metadata.tokens.collectionKey,
        needsConnection: metadata.tokens.needsConnection,
        synchronized: true,
      }
    : undefined;

  const brandUpdate = metadata.brand
    ? {
        collectionKey: metadata.brand.collectionKey,
        synchronized: true,
        published: metadata.brand.published,
      }
    : undefined;

  // Store UI Kit synchronized status
  await updateSyncMetadata({
    tokens: tokensUpdate,
    brand: brandUpdate,
    uiKit: {
      synchronized: true, // Set to true on successful sync
    },
  });

  // Set collection metadata
  for (const collection of uiKitCollections) {
    collection.setSharedPluginData('recursica', 'file-type', 'ui-kit');
  }
  await saveEffectsInMetadata(uiKitCollections);
  await generateMetadata(uiKitCollections, 'ui-kit', '');

  // Notify completion
  figma.ui.postMessage({
    type: 'UI_KIT_SYNC_COMPLETE',
    payload: {
      message: 'All files synchronized successfully',
    },
  });

  console.log('[syncUiKitFile] UI Kit file sync complete');
}

/**
 * Continues the UI Kit file sync workflow, skipping validation.
 * This is called when the user chooses to continue despite missing variables.
 */
export async function continueUiKitSync(): Promise<void> {
  console.log('[continueUiKitSync] Continuing UI Kit file sync workflow (skipping validation)');

  // Get local collections
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  if (localCollections.length === 0) {
    console.error('[continueUiKitSync] No local collections found');
    figma.ui.postMessage({
      type: 'UI_KIT_COLLECTIONS_NOT_FOUND',
      payload: {
        message: 'No variable collections found in this file',
      },
    });
    return;
  }

  // Find UI Kit collections (check metadata first, then name pattern)
  const uiKitCollections = localCollections.filter((collection) => {
    const metadataFileType = collection.getSharedPluginData('recursica', 'file-type');
    if (metadataFileType === 'ui-kit') {
      return true;
    }
    const name = collection.name.toLowerCase();
    return name.includes('ui kit') || name.includes('layer');
  });

  if (uiKitCollections.length === 0) {
    console.error('[continueUiKitSync] UI Kit collections not found');
    figma.ui.postMessage({
      type: 'UI_KIT_COLLECTIONS_NOT_FOUND',
      payload: {
        message: 'Cannot find UI Kit collections',
      },
    });
    return;
  }

  console.log(
    '[continueUiKitSync] Using UI Kit collections:',
    uiKitCollections.map((c) => c.name)
  );

  // Check global metadata for Tokens and Brand entries
  const metadata = await getSyncMetadata();
  if (!metadata?.tokens?.collectionKey) {
    console.error('[continueUiKitSync] Tokens entry not found in metadata');
    figma.ui.postMessage({
      type: 'TOKENS_NOT_FOUND',
      payload: {
        message: 'Please run the plugin in your Tokens file first',
      },
    });
    return;
  }

  if (!metadata?.brand?.collectionKey) {
    console.error('[continueUiKitSync] Brand entry not found in metadata');
    figma.ui.postMessage({
      type: 'BRAND_NOT_FOUND',
      payload: {
        message: 'Please run the plugin in your Brand file first',
      },
    });
    return;
  }

  const tokensCollectionKey = metadata.tokens.collectionKey;
  const brandCollectionKey = metadata.brand.collectionKey;

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
    console.error('[continueUiKitSync] Cannot access Tokens collection:', error);
    figma.ui.postMessage({
      type: 'TOKENS_NOT_ACCESSIBLE',
      payload: {
        message: 'Cannot access Tokens collection. Please add Tokens as a library.',
      },
    });
    return;
  }

  // Verify Brand collection is accessible
  let actualBrandCollectionKey = brandCollectionKey;
  let brandCollection: VariableCollection | null = null;

  try {
    const availableLibraries =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

    let matchingLibrary = availableLibraries.find((lib) => lib.key === brandCollectionKey);

    if (!matchingLibrary) {
      matchingLibrary = availableLibraries.find((lib) => {
        const name = lib.name.toLowerCase();
        return name === 'theme' || name === 'themes' || name.includes('theme');
      });
    }

    if (matchingLibrary) {
      actualBrandCollectionKey = matchingLibrary.key;
      const brandVariables =
        await figma.teamLibrary.getVariablesInLibraryCollectionAsync(actualBrandCollectionKey);
      if (brandVariables.length === 0) {
        throw new Error('Brand collection has no variables');
      }
      const importedVariable = await figma.variables.importVariableByKeyAsync(
        brandVariables[0].key
      );
      brandCollection = await figma.variables.getVariableCollectionByIdAsync(
        importedVariable.variableCollectionId
      );
    }
  } catch (error) {
    console.error('[continueUiKitSync] Cannot access Brand collection:', error);
    figma.ui.postMessage({
      type: 'BRAND_NOT_ACCESSIBLE',
      payload: {
        message: 'Cannot access Brand collection. Please add Brand as a library.',
      },
    });
    return;
  }

  if (!tokensCollection || !brandCollection) {
    return;
  }

  // Sync UI Kit → Tokens & Brand (fix references) - skip validation
  await syncUiKitToCollections(
    uiKitCollections,
    tokensCollectionKey,
    tokensCollection,
    actualBrandCollectionKey,
    brandCollection
  );

  // Update metadata (skip validation)
  const tokensUpdate = metadata.tokens
    ? {
        collectionKey: metadata.tokens.collectionKey,
        needsConnection: metadata.tokens.needsConnection,
        synchronized: true,
      }
    : undefined;

  const brandUpdate = metadata.brand
    ? {
        collectionKey: metadata.brand.collectionKey,
        synchronized: true,
        published: metadata.brand.published,
      }
    : undefined;

  try {
    // Store UI Kit synchronized status
    console.log('[continueUiKitSync] Updating sync metadata');
    await updateSyncMetadata({
      tokens: tokensUpdate,
      brand: brandUpdate,
      uiKit: {
        synchronized: true, // Set to true on successful sync
      },
    });

    // Set collection metadata
    for (const collection of uiKitCollections) {
      collection.setSharedPluginData('recursica', 'file-type', 'ui-kit');
    }
    await saveEffectsInMetadata(uiKitCollections);
    await generateMetadata(uiKitCollections, 'ui-kit', '');

    // Notify completion
    figma.ui.postMessage({
      type: 'UI_KIT_SYNC_COMPLETE',
      payload: {
        message: 'All files synchronized successfully',
      },
    });

    console.log('[continueUiKitSync] UI Kit file sync complete (validation skipped)');
  } catch (error) {
    console.error('[continueUiKitSync] Error during sync:', error);
    figma.ui.postMessage({
      type: 'UI_KIT_SYNC_ERROR',
      payload: {
        message:
          error instanceof Error ? error.message : 'Failed to sync UI Kit (validation skipped)',
      },
    });
  }
}
