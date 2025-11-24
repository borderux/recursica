import packageInfo from '../../package.json';
import { getLocalStorage, saveInStorage } from './authStorage';
import { getTeamLibrary } from './teamLibrary';
import { syncMetadata } from './metadata';
import { detectFiletype } from './filetype';
import { continueBrandSync, markBrandSynchronized } from './metadata/workflows/syncBrandFile';
import { continueUiKitSync, markUiKitSynchronized } from './metadata/workflows/syncUiKitFile';
import {
  getSyncMetadata,
  clearSyncMetadata,
  updateSyncMetadata,
} from './metadata/syncMetadataStorage';
const pluginVersion = packageInfo.version;

console.log('📦 Figma Plugin loaded with version:', pluginVersion);
console.log('📋 Plugin package info:', {
  name: packageInfo.name,
  version: packageInfo.version,
  description: packageInfo.description,
});

if (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test') {
  figma.showUI(__html__, {
    width: 370,
    height: 350,
  });
} else {
  const uiUrl = import.meta.env.VITE_RECURSICA_UI_URL;
  figma.showUI(`<script>window.location.href = '${uiUrl}'</script>`, {
    width: 370,
    height: 350,
  });
}

// DEBUG: Check what getAvailableLibraryVariableCollectionsAsync returns
(async () => {
  try {
    console.log('[main] DEBUG: Calling getAvailableLibraryVariableCollectionsAsync()...');
    const availableLibraries =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    console.log(
      '[main] DEBUG: getAvailableLibraryVariableCollectionsAsync() returned:',
      availableLibraries
    );
    console.log('[main] DEBUG: Count:', availableLibraries.length);
    console.log(
      '[main] DEBUG: Full details:',
      availableLibraries.map((lib) => ({
        name: lib.name,
        key: lib.key,
        libraryName: lib.libraryName,
      }))
    );

    // Check variable count for each library collection
    console.log('[main] DEBUG: Checking variable counts for each library...');
    for (const lib of availableLibraries) {
      try {
        const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(lib.key);
        console.log(
          `[main] DEBUG: Library "${lib.name}" (library key: ${lib.key}): ${variables.length} variables`
        );

        if (variables.length > 0) {
          console.log(
            `[main] DEBUG: First few variable keys for "${lib.name}":`,
            variables.slice(0, 3).map((v) => v.key)
          );

          // Import first variable to get the collection and compare keys
          try {
            const importedVar = await figma.variables.importVariableByKeyAsync(variables[0].key);
            const collection = await figma.variables.getVariableCollectionByIdAsync(
              importedVar.variableCollectionId
            );
            if (collection) {
              console.log(`[main] DEBUG: Key comparison for "${lib.name}":`);
              console.log(
                `[main] DEBUG:   - Library key (from getAvailableLibraryVariableCollectionsAsync): ${lib.key}`
              );
              console.log(
                `[main] DEBUG:   - Collection key (from getVariableCollectionByIdAsync): ${collection.key}`
              );
              console.log(`[main] DEBUG:   - Keys match: ${lib.key === collection.key}`);
              console.log(
                `[main] DEBUG:   - Collection has ${collection.variableIds.length} local variable IDs`
              );
            }
          } catch (error) {
            console.warn(
              `[main] DEBUG: Could not import variable to get collection for "${lib.name}":`,
              error
            );
          }
        } else {
          console.warn(
            `[main] DEBUG: Library "${lib.name}" has 0 variables - may not be fully published or accessible`
          );
        }
      } catch (error) {
        console.error(`[main] DEBUG: Error getting variables for library "${lib.name}":`, error);
      }
    }

    // Also check stored metadata keys
    try {
      const syncMetadata = await getSyncMetadata();
      if (syncMetadata) {
        console.log('[main] DEBUG: Stored metadata keys:');
        if (syncMetadata.tokens?.collectionKey) {
          console.log(`[main] DEBUG:   - Tokens stored key: ${syncMetadata.tokens.collectionKey}`);
        }
        if (syncMetadata.brand?.collectionKey) {
          console.log(`[main] DEBUG:   - Brand stored key: ${syncMetadata.brand.collectionKey}`);
        }
      }
    } catch (error) {
      console.warn('[main] DEBUG: Could not get stored metadata:', error);
    }

    // Also check local collections for comparison
    const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
    console.log(
      '[main] DEBUG: Local collections:',
      localCollections.map((col) => ({
        name: col.name,
        key: col.key,
        variableCount: col.variableIds.length,
      }))
    );
  } catch (error) {
    console.error('[main] DEBUG ERROR:', error);
  }
})();

// Send sync metadata to UI when plugin loads
(async () => {
  try {
    const syncMetadata = await getSyncMetadata();
    console.log('[main] Loaded sync metadata on startup:', syncMetadata);
    figma.ui.postMessage({
      type: 'SYNC_METADATA_LOADED',
      payload: syncMetadata,
    });
  } catch (error) {
    console.warn('[main] Could not load sync metadata:', error);
    // Send null to indicate no metadata exists
    figma.ui.postMessage({
      type: 'SYNC_METADATA_LOADED',
      payload: null,
    });
  }
})();

figma.ui.onmessage = async (e) => {
  if (e.type === 'GET_LOCAL_STORAGE') {
    getLocalStorage();
  }
  if (e.type === 'GET_CURRENT_USER') {
    figma.ui.postMessage({
      type: 'CURRENT_USER',
      payload: figma.currentUser?.id,
    });
  }
  if (e.type === 'UPDATE_ACCESS_TOKEN') {
    saveInStorage('accessToken', e.payload);
  }
  if (e.type === 'UPDATE_PLATFORM') {
    saveInStorage('platform', e.payload);
  }
  if (e.type === 'UPDATE_SELECTED_PROJECT') {
    saveInStorage('selectedProject', e.payload);
  }
  if (e.type === 'UPDATE_AGREED_PUBLISH_CHANGES') {
    saveInStorage('agreedPublishChanges', e.payload);
  }
  if (e.type === 'GET_VARIABLES') {
    const { fileType } = await detectFiletype();
    if (fileType === 'ui-kit') {
      getTeamLibrary(pluginVersion);
    }
  }
  if (e.type === 'SYNC_TOKENS') {
    syncMetadata();
  }
  if (e.type === 'SYNC_BRAND') {
    syncMetadata();
  }
  if (e.type === 'SYNC_ICONS') {
    syncMetadata();
  }
  if (e.type === 'SYNC_UI_KIT') {
    syncMetadata();
  }
  if (e.type === 'SYNC_UI_KIT_IGNORE_ERROR') {
    continueUiKitSync();
  }
  if (e.type === 'GET_FILETYPE') {
    try {
      const { fileType, themeName } = await detectFiletype();
      // Also get sync metadata to determine workflow status
      const syncMetadata = await getSyncMetadata();
      figma.ui.postMessage({
        type: 'FILETYPE_DETECTED',
        payload: {
          fileType,
          themeName,
          pluginVersion,
        },
      });
      // Send sync metadata to UI
      figma.ui.postMessage({
        type: 'SYNC_METADATA_LOADED',
        payload: syncMetadata,
      });
    } catch (error) {
      figma.ui.postMessage({
        type: 'FILETYPE_ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      });
    }
  }
  if (e.type === 'GET_SYNC_METADATA') {
    const syncMetadata = await getSyncMetadata();
    figma.ui.postMessage({
      type: 'SYNC_METADATA_LOADED',
      payload: syncMetadata,
    });
  }
  if (e.type === 'CLEAR_SYNC_METADATA') {
    console.log('[main] Clearing sync metadata');
    await clearSyncMetadata();
    // Reload metadata and send to UI
    const syncMetadata = await getSyncMetadata();
    figma.ui.postMessage({
      type: 'SYNC_METADATA_LOADED',
      payload: syncMetadata,
    });
    figma.notify('Sync metadata cleared');
  }
  if (e.type === 'CLOSE_PLUGIN') {
    figma.closePlugin();
  }
  if (e.type === 'CONTINUE_WITH_MISSING_VARIABLES') {
    continueBrandSync();
  }
  if (e.type === 'SYNC_BRAND_IGNORE_ERROR') {
    continueBrandSync();
  }
  if (e.type === 'MARK_BRAND_SYNCHRONIZED') {
    markBrandSynchronized();
  }
  if (e.type === 'MARK_UI_KIT_SYNCHRONIZED') {
    markUiKitSynchronized();
  }
  if (e.type === 'MARK_INTRODUCTION_SYNCHRONIZED') {
    console.log('[main] Marking Introduction as synchronized');
    await updateSyncMetadata({
      introduction: {
        synchronized: true,
      },
    });
    // Reload metadata and send to UI
    const syncMetadata = await getSyncMetadata();
    figma.ui.postMessage({
      type: 'SYNC_METADATA_LOADED',
      payload: syncMetadata,
    });
  }
  if (e.type === 'NAVIGATE_TO_FILE') {
    const { fileId } = e.payload;
    if (fileId) {
      console.log('[main] File navigation requested. File ID:', fileId);
      // Note: Figma plugins cannot programmatically navigate to different files
      // The user will need to manually navigate to the Tokens file
      // The sync-tokens page will guide them if they're in the wrong file
      figma.notify('Please navigate to the Tokens file and run the plugin again.');
    }
  }
};
