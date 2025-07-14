export async function syncTokens() {
  const libraries = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

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

  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();

  // Process local collections in parallel
  const localCollectionPromises = localCollections
    .filter((collection) => collection.name !== 'ID variables')
    .map(async (collection) => {
      const variablePromises = collection.variableIds.map(async (varId) => {
        const variable = await figma.variables.getVariableByIdAsync(varId);
        if (!variable) return null;

        const modePromises = Object.entries(variable.valuesByMode).map(async ([key, modeVal]) => {
          if (typeof modeVal === 'object' && modeVal !== null && 'type' in modeVal) {
            const refVar = await figma.variables.getVariableByIdAsync(modeVal.id);
            if (refVar) {
              const newSyncVar = libraryVariables.find((v) => v.name === refVar.name);
              if (newSyncVar) {
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
