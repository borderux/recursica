import { toPascalCase } from '@recursica/common';

export async function syncTokens() {
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  let fileType = 'icons';
  let themeName = '';
  if (localCollections.length > 0) {
    const tokensCollection = localCollections.find((collection) =>
      collection.name.toLowerCase().includes('tokens')
    );
    const themesCollection = localCollections.find((collection) =>
      collection.name.toLowerCase().includes('themes')
    );
    const uikitCollection = localCollections.find(
      (collection) =>
        collection.name.toLowerCase().includes('ui kit') ||
        collection.name.toLowerCase().includes('uikit')
    );

    if (tokensCollection) {
      fileType = 'tokens';
    } else if (themesCollection) {
      fileType = 'themes';
    } else if (uikitCollection) {
      fileType = 'ui-kit';
    }
  }

  // Check for "ID variables" collection and get theme value
  const idVariablesCollection = localCollections.find(
    (collection) => collection.name === 'ID variables'
  );

  if (idVariablesCollection) {
    // Find the theme variable in the ID variables collection
    for (const varId of idVariablesCollection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (variable && variable.name === 'theme') {
        // Get the first mode value (assuming it's a string)
        const firstMode = Object.values(variable.valuesByMode)[0];
        if (typeof firstMode === 'string') {
          themeName = firstMode;
        }
        break;
      }
    }
  }

  // Removed unnecessary console.log statement for production.
  const libraries = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

  if (fileType === 'themes') {
    const hasTokens = libraries.some((collection) =>
      collection.name.toLowerCase().includes('tokens')
    );
    if (!hasTokens) {
      return figma.ui.postMessage({
        type: 'NO_TOKENS_FOUND',
      });
    }
  }

  if (fileType === 'ui-kit') {
    const hasTokens = libraries.some((collection) =>
      collection.name.toLowerCase().includes('tokens')
    );
    const hasThemes = libraries.some((collection) =>
      collection.name.toLowerCase().includes('themes')
    );
    if (!hasTokens || !hasThemes) {
      figma.ui.postMessage({
        type: 'NO_TOKENS_OR_THEMES_FOUND',
      });
    }
  }

  if (libraries.length === 0) {
    figma.notify('No libraries connected to this project', {
      timeout: 5000,
    });
  }

  // Get all library variables in parallel
  const libraryVariablesPromises = libraries.map(async (library) => {
    const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(library.key);
    const actualVarsPromises = variables.map((variable) =>
      figma.variables.importVariableByKeyAsync(variable.key)
    );
    return Promise.all(actualVarsPromises);
  });

  const libraryVariablesArrays = await Promise.all(libraryVariablesPromises);
  const libraryVariables = libraryVariablesArrays.flat();
  const libraryVariablesMap = new Map(libraryVariables.map((v) => [v.name, v]));

  // Process local collections in parallel
  const localCollectionPromises = localCollections.map(async (collection) => {
    // Skip setting shared plugin data for "ID variables" collection
    if (collection.name === 'ID variables') {
      return Promise.resolve([]);
    }

    collection.setSharedPluginData('recursica', 'file-type', fileType);
    // Skip setting shared plugin data for "ID variables" collection
    if (collection.name === 'ID variables') {
      return Promise.resolve([]);
    }

    if (fileType === 'themes') {
      // Use themeName if available, otherwise fall back to figma.root.name
      const finalThemeName = themeName || toPascalCase(figma.root.name);
      collection.setSharedPluginData('recursica', 'theme-name', finalThemeName);
    }

    const variablePromises = collection.variableIds.map(async (varId) => {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (!variable) return null;

      const modePromises = Object.entries(variable.valuesByMode).map(async ([key, modeVal]) => {
        if (typeof modeVal === 'object' && modeVal !== null && 'type' in modeVal) {
          const refVar = await figma.variables.getVariableByIdAsync(modeVal.id);
          if (refVar) {
            const newSyncVar = libraryVariablesMap.get(refVar.name);
            if (refVar.remote && newSyncVar && newSyncVar.key !== refVar.key) {
              console.log(`syncing ${refVar.name} to ${newSyncVar.name}`);
              const newRefVal: VariableValue = {
                type: 'VARIABLE_ALIAS',
                id: newSyncVar.id,
              };
              variable.setValueForMode(key, newRefVal);
            }
          }
        }
      });
      await Promise.all(modePromises);
      return variable;
    });

    return Promise.all(variablePromises);
  });

  await Promise.all(localCollectionPromises);
  figma.ui.postMessage({
    type: 'SYNC_TOKENS_COMPLETE',
  });
}
