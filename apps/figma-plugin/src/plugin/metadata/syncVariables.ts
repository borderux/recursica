/**
 * Synchronizes variables between local collections and remote variables.
 *
 * This function updates local variable references to point to the latest remote variables
 * when they have changed. It processes all collections and variables in parallel for efficiency.
 *
 * The sync process:
 * 1. Iterates through all local collections
 * 2. For each variable in a collection, checks all its mode values
 * 3. If a mode value references another variable (VARIABLE_ALIAS), updates it to point to the latest remote version
 * 4. Only updates variables that are remote and have different keys (indicating they've changed)
 *
 * @param localCollections - Array of local variable collections to sync
 * @param remoteVariables - Map of remote variable names to their Variable objects
 * @returns Promise that resolves when all variables have been synchronized
 *
 * @example
 * await syncVariables(localCollections, remoteVariablesMap);
 * // All local variables now reference the latest remote versions
 */
export async function syncVariables(
  localCollections: VariableCollection[],
  remoteVariables: Map<string, Variable>
) {
  // Process local collections in parallel for better performance
  const localCollectionPromises = localCollections.map(async (collection) => {
    // Process all variables in the collection in parallel
    const variablePromises = collection.variableIds.map(async (varId) => {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (!variable) return null;

      // Check all modes of the variable for variable references (VARIABLE_ALIAS)
      const modePromises = Object.entries(variable.valuesByMode).map(async ([key, modeVal]) => {
        // Check if this mode value references another variable
        if (typeof modeVal === 'object' && modeVal !== null && 'type' in modeVal) {
          const refVar = await figma.variables.getVariableByIdAsync(modeVal.id);
          if (refVar) {
            // Look for a newer version of this referenced variable in remote variables
            const newSyncVar = remoteVariables.get(refVar.name);
            // Only update if: variable is remote, newer version exists, and keys are different
            if (refVar.remote && newSyncVar && newSyncVar.key !== refVar.key) {
              console.log(`syncing ${refVar.name} to ${newSyncVar.name}`);
              // Create new variable alias pointing to the updated remote variable
              const newRefVal: VariableValue = {
                type: 'VARIABLE_ALIAS',
                id: newSyncVar.id,
              };
              // Get the collection for the new variable (needed for context)
              figma.variables.getVariableCollectionByIdAsync(newSyncVar.variableCollectionId);
              // Update the variable's mode value to reference the new remote variable
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

  // Wait for all collections to be processed
  await Promise.all(localCollectionPromises);

  // Notify UI that variable synchronization is complete
  figma.ui.postMessage({
    type: 'SYNC_VARIABLES_COMPLETE',
  });
}
