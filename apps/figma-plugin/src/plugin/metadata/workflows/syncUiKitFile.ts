import { getSyncMetadata, updateSyncMetadata } from '../syncMetadataStorage';
import { saveEffectsInMetadata } from '../saveEffectsInMetadata';
import { generateMetadata } from '../generateMetadata';
import { validateVariableReferences } from './validateVariableReferences';
import { getLibraryCollection } from './getLibraryCollection';
import { syncVariableReferences } from './syncVariableReferences';

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
  tokensLibraryVariables: LibraryVariable[],
  brandCollectionKey: string,
  brandCollection: VariableCollection
): Promise<{
  tokensVariables: Map<string, Variable>;
  brandVariables: Map<string, Variable>;
}> {
  console.log('[syncUiKitToCollections] Syncing UI Kit collections to Tokens and Brand');

  // Get all variables in Tokens collection, indexed by name
  // Use library variables if available (all 124), otherwise fallback to locally imported ones
  const tokensVariables = new Map<string, Variable>();
  if (tokensLibraryVariables.length > 0) {
    // Import all library variables to get their Variable objects
    console.log(
      `[syncUiKitToCollections] Importing ${tokensLibraryVariables.length} Tokens variables from library...`
    );
    for (const libVar of tokensLibraryVariables) {
      try {
        const importedVar = await figma.variables.importVariableByKeyAsync(libVar.key);
        tokensVariables.set(importedVar.name, importedVar);
      } catch (error) {
        console.warn(
          `[syncUiKitToCollections] Could not import Tokens variable ${libVar.name}:`,
          error
        );
      }
    }
    console.log(
      `[syncUiKitToCollections] Successfully imported ${tokensVariables.size} Tokens variables`
    );
  } else {
    // Fallback to locally imported variables
    console.log(
      `[syncUiKitToCollections] No library variables, using local Tokens collection variables (${tokensCollection.variableIds.length} variables)`
    );
    for (const varId of tokensCollection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (variable) {
        tokensVariables.set(variable.name, variable);
      }
    }
  }

  // Get all Brand variables
  // After importing a sample variable, the collection should be "activated"
  // Try to get variables from the library API using the collection key
  const brandVariables = new Map<string, Variable>();

  // Try multiple keys: collection key, then stored key
  let libraryVariables: LibraryVariable[] = [];
  const keysToTry = [brandCollection.key, brandCollectionKey].filter(
    (key, index, arr) => arr.indexOf(key) === index
  ); // Remove duplicates

  for (const key of keysToTry) {
    try {
      libraryVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(key);
      if (libraryVariables.length > 0) {
        console.log(
          `[syncUiKitToCollections] Got ${libraryVariables.length} Brand variables from library API using key: ${key}`
        );
        break;
      }
    } catch (error) {
      console.log(`[syncUiKitToCollections] Key ${key} returned 0 variables or failed:`, error);
    }
  }

  if (libraryVariables.length > 0) {
    // Import all library variables to get their Variable objects
    console.log(`[syncUiKitToCollections] Importing ${libraryVariables.length} Brand variables...`);
    for (const libVar of libraryVariables) {
      try {
        const importedVar = await figma.variables.importVariableByKeyAsync(libVar.key);
        brandVariables.set(importedVar.name, importedVar);
      } catch (error) {
        console.warn(
          `[syncUiKitToCollections] Could not import Brand variable ${libVar.name}:`,
          error
        );
      }
    }
    console.log(
      `[syncUiKitToCollections] Successfully imported ${brandVariables.size} Brand variables`
    );
  } else {
    // Fallback to using collection's variableIds (local variables only)
    console.warn(
      `[syncUiKitToCollections] Library API returned 0 variables, using local collection variables (${brandCollection.variableIds.length} variables)`
    );
    for (const varId of brandCollection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (variable) {
        brandVariables.set(variable.name, variable);
      }
    }
  }

  console.log(
    `[syncUiKitToCollections] Total Brand variables available for sync: ${brandVariables.size}`
  );

  // Use common sync function for both Tokens and Brand
  const targetCollections = new Map<string, Map<string, Variable>>();
  targetCollections.set('tokens', tokensVariables);
  targetCollections.set('brand', brandVariables);

  const targetCollectionKeys = new Map<string, string>();
  targetCollectionKeys.set('tokens', tokensCollectionKey);
  targetCollectionKeys.set('brand', brandCollectionKey);

  await syncVariableReferences(
    uiKitCollections,
    targetCollections,
    targetCollectionKeys,
    '[syncUiKitToCollections]'
  );

  return {
    tokensVariables,
    brandVariables,
  };
}

/**
 * Finds a library collection by name using getAvailableLibraryVariableCollectionsAsync.
 * Returns the library key if found, or null if not found.
 */
async function findLibraryCollectionByName(
  targetName: string,
  namePattern: string
): Promise<string | null> {
  try {
    const availableLibraries =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const matchingLibrary = availableLibraries.find((lib) => {
      const name = lib.name.toLowerCase();
      return name.includes(namePattern.toLowerCase());
    });

    if (matchingLibrary) {
      console.log(
        `[findLibraryCollectionByName] Found library "${targetName}" by name: ${matchingLibrary.name}, key: ${matchingLibrary.key}`
      );
      return matchingLibrary.key;
    }
  } catch (error) {
    console.warn(`[findLibraryCollectionByName] Error searching for "${targetName}":`, error);
  }
  return null;
}

/**
 * Scans UI Kit collections to find referenced variable names from a target collection.
 * Returns a set of referenced variable names.
 */
async function findReferencedVariableNames(
  uiKitCollections: VariableCollection[],
  targetCollectionKey: string,
  targetCollectionName: string
): Promise<Set<string>> {
  const referencedNames = new Set<string>();

  for (const collection of uiKitCollections) {
    for (const varId of collection.variableIds) {
      const uiKitVariable = await figma.variables.getVariableByIdAsync(varId);
      if (!uiKitVariable) continue;

      // Check all mode values for VARIABLE_ALIAS references
      for (const [, modeValue] of Object.entries(uiKitVariable.valuesByMode)) {
        if (modeValue && typeof modeValue === 'object' && 'type' in modeValue) {
          const aliasValue = modeValue as VariableAlias;
          if (aliasValue.type === 'VARIABLE_ALIAS') {
            // Get the referenced variable
            const referencedVar = await figma.variables.getVariableByIdAsync(aliasValue.id);
            if (!referencedVar) continue;

            // Check if referenced variable belongs to target collection
            const referencedCollection = await figma.variables.getVariableCollectionByIdAsync(
              referencedVar.variableCollectionId
            );
            if (!referencedCollection) continue;

            // Check if it's the target collection (by key or name)
            const isTargetCollection =
              referencedCollection.key === targetCollectionKey ||
              referencedCollection.name.toLowerCase().includes(targetCollectionName.toLowerCase());

            if (isTargetCollection) {
              referencedNames.add(referencedVar.name);
            }
          }
        }
      }
    }
  }

  return referencedNames;
}

/**
 * Handles synchronization workflow for UI Kit file.
 *
 * Steps:
 * 1. Check global metadata for Tokens and Brand entries
 * 2. Find library collections by name (preferred) or use stored keys (fallback)
 * 3. Scan UI Kit to find referenced variable names
 * 4. Use stored variableNameToKey mapping to get keys for referenced variables
 * 5. Import only referenced variables
 * 6. Sync UI Kit variables to Tokens & Brand (fix references)
 * 7. Validate all referenced variables exist
 * 8. Update metadata (set synchronized = true)
 * 9. Set collection metadata
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

  // Find library collections by name first (preferred), fallback to stored keys
  let tokensCollectionKey = await findLibraryCollectionByName('Tokens', 'token');
  if (!tokensCollectionKey) {
    tokensCollectionKey = metadata.tokens.collectionKey;
    console.log(
      '[syncUiKitFile] Using stored Tokens key (library not found by name):',
      tokensCollectionKey
    );
  } else {
    console.log('[syncUiKitFile] Found Tokens library by name, using key:', tokensCollectionKey);
  }

  let brandCollectionKey = await findLibraryCollectionByName('Themes', 'theme');
  if (!brandCollectionKey) {
    brandCollectionKey = metadata.brand.collectionKey;
    console.log(
      '[syncUiKitFile] Using stored Brand key (library not found by name):',
      brandCollectionKey
    );
  } else {
    console.log('[syncUiKitFile] Found Brand library by name, using key:', brandCollectionKey);
  }

  // Verify Tokens collection is accessible using stored library key with fallbacks
  let tokensCollection: VariableCollection | null = null;
  let tokensLibraryVariables: LibraryVariable[] = [];
  try {
    console.log(
      '[syncUiKitFile] Attempting to access Tokens collection with key:',
      tokensCollectionKey
    );

    const result = await getLibraryCollection(tokensCollectionKey, 'tokens');

    if (!result || result.variables.length === 0) {
      throw new Error('Tokens collection has no variables or is not accessible');
    }

    // Store library variables for use in sync
    tokensLibraryVariables = result.variables;

    // Update stored key if we found a different one
    if (result.collectionKey !== tokensCollectionKey) {
      console.log('[syncUiKitFile] Updating stored Tokens key:', {
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

    console.log('[syncUiKitFile] Tokens variables from library:', tokensLibraryVariables.length);
    if (tokensLibraryVariables.length > 0) {
      console.log(
        '[syncUiKitFile] First few Tokens variable keys:',
        tokensLibraryVariables.slice(0, 5).map((v) => v.key)
      );
    }

    const importedVariable = await figma.variables.importVariableByKeyAsync(
      tokensLibraryVariables[0].key
    );
    tokensCollection = await figma.variables.getVariableCollectionByIdAsync(
      importedVariable.variableCollectionId
    );

    if (tokensCollection) {
      console.log('[syncUiKitFile] Successfully accessed Tokens collection:', {
        name: tokensCollection.name,
        key: tokensCollection.key,
        variableCount: tokensCollection.variableIds.length,
      });
    }
  } catch (error) {
    console.error('[syncUiKitFile] Cannot access Tokens collection:', error);
    figma.ui.postMessage({
      type: 'TOKENS_NOT_PUBLISHED',
      payload: {
        message:
          'The Tokens file has not been published, or the collection key is invalid. Please publish the Tokens file and run the plugin again in the Tokens file to get the published collection key.',
      },
    });
    return;
  }

  if (!tokensCollection) {
    figma.ui.postMessage({
      type: 'TOKENS_NOT_PUBLISHED',
      payload: {
        message:
          'The Tokens file has not been published, or the collection key is invalid. Please publish the Tokens file and run the plugin again in the Tokens file to get the published collection key.',
      },
    });
    return;
  }

  // Verify Brand collection is accessible using stored library key with fallbacks
  let brandCollection: VariableCollection | null = null;

  try {
    console.log(
      '[syncUiKitFile] Attempting to access Brand collection with key:',
      brandCollectionKey
    );
    console.log(
      '[syncUiKitFile] Sample variable key from metadata:',
      metadata.brand?.sampleVariableKey || 'NOT FOUND'
    );

    const result = await getLibraryCollection(
      brandCollectionKey,
      'themes',
      metadata.brand?.sampleVariableKey
    );

    if (!result) {
      throw new Error('Brand collection has no variables or is not accessible');
    }

    // If we have the collection directly (from import), use it
    if (result.collection) {
      console.log('[syncUiKitFile] Using collection from getLibraryCollection:', {
        name: result.collection.name,
        key: result.collection.key,
        variableCount: result.collection.variableIds.length,
      });
      brandCollection = result.collection;
      brandCollectionKey = result.collection.key;
    } else if (result.variables.length > 0) {
      // If we have variables from the API, import one to get the collection
      console.log('[syncUiKitFile] Brand variables from library:', result.variables.length);
      console.log(
        '[syncUiKitFile] First few Brand variable keys:',
        result.variables.slice(0, 5).map((v) => v.key)
      );

      const importedVariable = await figma.variables.importVariableByKeyAsync(
        result.variables[0].key
      );
      brandCollection = await figma.variables.getVariableCollectionByIdAsync(
        importedVariable.variableCollectionId
      );
    } else {
      throw new Error('Brand collection has no variables or is not accessible');
    }

    // Update stored key if we found a different one
    if (brandCollection && brandCollection.key !== brandCollectionKey) {
      console.log('[syncUiKitFile] Updating stored Brand key:', {
        old: brandCollectionKey,
        new: brandCollection.key,
      });
      await updateSyncMetadata({
        brand: {
          collectionKey: brandCollection.key,
          synchronized: metadata.brand?.synchronized || false,
        },
      });
      brandCollectionKey = brandCollection.key;
    }

    if (brandCollection) {
      console.log('[syncUiKitFile] Successfully accessed Brand collection:', {
        name: brandCollection.name,
        collectionKey: brandCollection.key,
        storedKey: brandCollectionKey,
        variableCount: brandCollection.variableIds.length,
      });
      console.log(
        '[syncUiKitFile] Key comparison - stored key:',
        brandCollectionKey,
        'collection key:',
        brandCollection.key
      );
    }
  } catch (error) {
    console.error('[syncUiKitFile] Cannot access Brand collection:', error);

    const errorMessage =
      'The Brand collection is not accessible. Please publish the Brand library and add it as library to this file, then run the plugin again.';

    // Clear Brand entry from metadata so user goes back to Brand file
    await updateSyncMetadata({
      brand: undefined, // Remove brand entry
    });
    figma.ui.postMessage({
      type: 'BRAND_NOT_PUBLISHED',
      payload: {
        message: errorMessage,
      },
    });
    return;
  }

  if (!brandCollection) {
    // Clear Brand entry from metadata so user goes back to Brand file
    await updateSyncMetadata({
      brand: undefined, // Remove brand entry
    });
    figma.ui.postMessage({
      type: 'BRAND_NOT_PUBLISHED',
      payload: {
        message:
          'The Brand file has not been published. Please publish the Brand file and run this plugin again in the Brand file.',
      },
    });
    return;
  }

  if (!tokensCollection) {
    figma.ui.postMessage({
      type: 'TOKENS_NOT_PUBLISHED',
      payload: {
        message:
          'The Tokens file has not been published, or the collection key is invalid. Please publish the Tokens file and run the plugin again in the Tokens file to get the published collection key.',
      },
    });
    return;
  }

  if (!brandCollection) {
    // Clear Brand entry from metadata so user goes back to Brand file
    await updateSyncMetadata({
      brand: undefined, // Remove brand entry
    });
    figma.ui.postMessage({
      type: 'BRAND_NOT_PUBLISHED',
      payload: {
        message:
          'The Brand file has not been published. Please publish the Brand file and run this plugin again in the Brand file.',
      },
    });
    return;
  }

  // Scan UI Kit for referenced variable names and import only those
  console.log('[syncUiKitFile] Scanning UI Kit for referenced variables...');
  const referencedTokensNames = await findReferencedVariableNames(
    uiKitCollections,
    tokensCollectionKey,
    'token'
  );
  const referencedBrandNames = await findReferencedVariableNames(
    uiKitCollections,
    brandCollectionKey,
    'theme'
  );

  console.log(
    `[syncUiKitFile] Found ${referencedTokensNames.size} referenced Tokens variables:`,
    Array.from(referencedTokensNames).sort()
  );
  console.log(
    `[syncUiKitFile] Found ${referencedBrandNames.size} referenced Brand variables:`,
    Array.from(referencedBrandNames).sort()
  );

  // Get keys for referenced variables from stored mappings
  // If mapping is missing (old sync), build it from library variables as fallback
  let tokensNameToKey = metadata.tokens?.variableNameToKey || {};
  if (Object.keys(tokensNameToKey).length === 0) {
    if (tokensLibraryVariables.length > 0) {
      console.warn(
        '[syncUiKitFile] ⚠️ Stored Tokens variableNameToKey mapping is missing. Building from library variables as fallback.'
      );
      console.warn(
        '[syncUiKitFile] ⚠️ For best results, please re-sync the Tokens file to store the mapping.'
      );
      tokensNameToKey = {};
      for (const libVar of tokensLibraryVariables) {
        tokensNameToKey[libVar.name] = libVar.key;
      }
      console.log(
        `[syncUiKitFile] Built Tokens mapping from ${Object.keys(tokensNameToKey).length} library variables`
      );
    } else {
      console.error(
        '[syncUiKitFile] ❌ Stored Tokens variableNameToKey mapping is missing and no library variables available. Please re-sync the Tokens file.'
      );
    }
  }

  let brandNameToKey = metadata.brand?.variableNameToKey || {};
  if (Object.keys(brandNameToKey).length === 0) {
    if (brandCollection) {
      console.warn(
        '[syncUiKitFile] ⚠️ Stored Brand variableNameToKey mapping is missing. Building from locally imported variables as fallback.'
      );
      console.warn(
        '[syncUiKitFile] ⚠️ For best results, please re-sync the Brand file to store the complete mapping.'
      );
      brandNameToKey = {};
      for (const varId of brandCollection.variableIds) {
        try {
          const variable = await figma.variables.getVariableByIdAsync(varId);
          if (variable) {
            brandNameToKey[variable.name] = variable.key;
          }
        } catch (error) {
          console.warn(`[syncUiKitFile] Could not get Brand variable ${varId}:`, error);
        }
      }
      console.log(
        `[syncUiKitFile] Built Brand mapping from ${Object.keys(brandNameToKey).length} collection variables (limited - only locally imported)`
      );
    } else {
      console.error(
        '[syncUiKitFile] ❌ Stored Brand variableNameToKey mapping is missing and no collection available. Please re-sync the Brand file.'
      );
    }
  }

  const referencedTokensKeys: string[] = [];
  for (const name of referencedTokensNames) {
    const key = tokensNameToKey[name];
    if (key) {
      referencedTokensKeys.push(key);
    } else {
      console.warn(`[syncUiKitFile] No key found for referenced Tokens variable: ${name}`);
    }
  }

  const referencedBrandKeys: string[] = [];
  for (const name of referencedBrandNames) {
    const key = brandNameToKey[name];
    if (key) {
      referencedBrandKeys.push(key);
    } else {
      console.warn(`[syncUiKitFile] No key found for referenced Brand variable: ${name}`);
    }
  }

  // Note: We don't need to import Tokens variables here because syncUiKitToCollections
  // will import all of them anyway. The early import was redundant.
  // We only need to import Brand variables early to "activate" the collection.

  console.log(
    `[syncUiKitFile] Importing ${referencedBrandKeys.length} referenced Brand variables...`
  );
  for (const key of referencedBrandKeys) {
    try {
      await figma.variables.importVariableByKeyAsync(key);
    } catch (error) {
      console.warn(`[syncUiKitFile] Could not import Brand variable with key ${key}:`, error);
    }
  }

  console.log('[syncUiKitFile] Finished importing referenced variables');

  // Always perform sync when user clicks Sync button
  // Sync UI Kit → Tokens & Brand (fix references)
  const { tokensVariables, brandVariables } = await syncUiKitToCollections(
    uiKitCollections,
    tokensCollectionKey,
    tokensCollection,
    tokensLibraryVariables, // Pass library variables to use all 124 instead of just locally imported ones
    brandCollectionKey, // Use stored library key
    brandCollection
  );

  // Validate all referenced variables exist
  // Use the variables maps from sync (contains all imported variables) instead of collection.variableIds
  const tokensValidation = await validateVariableReferences(
    uiKitCollections[0], // Validate first collection as representative
    tokensCollection,
    'tokens',
    tokensVariables // Pass the map with all 124 Tokens variables
  );

  const brandValidation = await validateVariableReferences(
    uiKitCollections[0], // Validate first collection as representative
    brandCollection,
    'brand',
    brandVariables // Pass the map with all Brand variables
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

  // Update metadata (set synchronized = false initially, will be set to true when user clicks Continue)
  const tokensUpdate = metadata.tokens
    ? {
        collectionKey: metadata.tokens.collectionKey,
        synchronized: metadata.tokens.synchronized ?? false,
        variableNameToKey: metadata.tokens.variableNameToKey,
      }
    : undefined;

  const brandUpdate = metadata.brand
    ? {
        collectionKey: metadata.brand.collectionKey,
        synchronized: metadata.brand.synchronized ?? false,
        sampleVariableKey: metadata.brand.sampleVariableKey,
        variableNameToKey: metadata.brand.variableNameToKey,
      }
    : undefined;

  // Store UI Kit synchronized status
  await updateSyncMetadata({
    tokens: tokensUpdate,
    brand: brandUpdate,
    uiKit: {
      synchronized: false, // Set to false initially, will be set to true when user clicks Continue
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
 * Continues the UI Kit file sync workflow by just writing metadata and completing.
 * This is called when the user clicks "Continue" on a missing variables error page.
 * It skips all sync logic and just marks UI Kit as synchronized.
 */
export async function continueUiKitSync(): Promise<void> {
  console.log(
    '[continueUiKitSync] Continuing UI Kit file sync workflow (skipping sync, just writing metadata)'
  );

  // Get local collections to set metadata
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const uiKitCollections = localCollections.filter((collection) => {
    const metadataFileType = collection.getSharedPluginData('recursica', 'file-type');
    if (metadataFileType === 'ui-kit') {
      return true;
    }
    const name = collection.name.toLowerCase();
    return name.includes('ui kit') || name.includes('layer');
  });

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

  try {
    // Update metadata - preserve existing data, just mark UI Kit as synchronized
    const tokensUpdate = metadata.tokens
      ? {
          collectionKey: metadata.tokens.collectionKey,
          synchronized: metadata.tokens.synchronized ?? true,
          variableNameToKey: metadata.tokens.variableNameToKey,
        }
      : undefined;

    const brandUpdate = metadata.brand
      ? {
          collectionKey: metadata.brand.collectionKey,
          synchronized: metadata.brand.synchronized ?? true,
          sampleVariableKey: metadata.brand.sampleVariableKey,
          variableNameToKey: metadata.brand.variableNameToKey,
        }
      : undefined;

    console.log('[continueUiKitSync] Updating sync metadata (skipping sync)');
    await updateSyncMetadata({
      tokens: tokensUpdate,
      brand: brandUpdate, // Preserve Brand entry - do NOT clear it
      uiKit: {
        synchronized: true, // Set to true to mark as complete
      },
    });

    // Set collection metadata if we have collections
    if (uiKitCollections.length > 0) {
      for (const collection of uiKitCollections) {
        collection.setSharedPluginData('recursica', 'file-type', 'ui-kit');
      }
      await saveEffectsInMetadata(uiKitCollections);
      await generateMetadata(uiKitCollections, 'ui-kit', '');
    }

    // Notify completion
    figma.ui.postMessage({
      type: 'UI_KIT_SYNC_COMPLETE',
      payload: {
        message: 'All files synchronized successfully',
      },
    });

    console.log('[continueUiKitSync] UI Kit file sync complete (metadata written, sync skipped)');
  } catch (error) {
    console.error('[continueUiKitSync] Error writing metadata:', error);
    figma.ui.postMessage({
      type: 'UI_KIT_SYNC_ERROR',
      payload: {
        message: error instanceof Error ? error.message : 'Failed to update UI Kit metadata',
      },
    });
  }
}

/**
 * Marks UI Kit as synchronized in metadata.
 * Called when user clicks Continue on the error page.
 */
export async function markUiKitSynchronized(): Promise<void> {
  console.log('[markUiKitSynchronized] Marking UI Kit as synchronized');
  const metadata = await getSyncMetadata();

  if (!metadata?.tokens || !metadata?.brand) {
    console.error('[markUiKitSynchronized] Tokens or Brand entry not found in metadata');
    return;
  }

  await updateSyncMetadata({
    tokens: {
      collectionKey: metadata.tokens.collectionKey,
      synchronized: metadata.tokens.synchronized ?? true,
      variableNameToKey: metadata.tokens.variableNameToKey,
    },
    brand: {
      collectionKey: metadata.brand.collectionKey,
      synchronized: metadata.brand.synchronized ?? true,
      sampleVariableKey: metadata.brand.sampleVariableKey,
      variableNameToKey: metadata.brand.variableNameToKey,
    },
    uiKit: {
      synchronized: true,
    },
  });

  // Send updated metadata to UI
  const updatedMetadata = await getSyncMetadata();
  figma.ui.postMessage({
    type: 'SYNC_METADATA_LOADED',
    payload: updatedMetadata,
  });

  console.log('[markUiKitSynchronized] UI Kit marked as synchronized');
}
