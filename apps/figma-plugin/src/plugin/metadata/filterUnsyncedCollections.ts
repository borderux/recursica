/**
 * Checks which local variable collections have not been marked as synced.
 *
 * This function filters the provided array of local variable collections and returns
 * those collections where the shared plugin data key 'variables-synced' (under the 'recursica' namespace)
 * is not set to the string 'true'.
 *
 * @param {VariableCollection[]} localCollections - The array of local variable collections to check.
 * @returns {VariableCollection[]} An array of collections that are not marked as synced.
 */
export function filterUnsyncedCollections(
  localCollections: VariableCollection[]
): VariableCollection[] {
  const unsynced = localCollections.filter(
    (collection) => collection.getSharedPluginData('recursica', 'variables-synced') !== 'true'
  );
  return unsynced;
}
