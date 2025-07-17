export async function syncTokens() {
  const libraries = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  if (libraries.length === 0) {
    figma.notify('No libraries connected to this project');
    return figma.ui.postMessage({
      type: 'SYNC_TOKENS_COMPLETE',
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

  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();

  // Process local collections in parallel
  const localCollectionPromises = localCollections.map(async (collection) => {
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
