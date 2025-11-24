/**
 * Common utility for syncing variable references from source collections to target collections.
 *
 * This function updates VARIABLE_ALIAS references in source variables to point to the correct
 * variables in target collections. It supports multiple target collections (e.g., Tokens and Brand).
 *
 * @param sourceCollections - The collections containing variables that reference targets
 * @param targetCollections - Map of collection keys to their variable maps (name -> Variable)
 * @param targetCollectionKeys - Map of collection keys to their actual keys (for matching)
 * @param logPrefix - Prefix for log messages (e.g., "[syncBrandToTokens]")
 * @returns Promise that resolves when all references have been synced
 */
export async function syncVariableReferences(
  sourceCollections: VariableCollection[],
  targetCollections: Map<string, Map<string, Variable>>,
  targetCollectionKeys: Map<string, string>,
  logPrefix: string = '[syncVariableReferences]'
): Promise<void> {
  // Process all variables in source collections
  for (const collection of sourceCollections) {
    for (const varId of collection.variableIds) {
      const sourceVariable = await figma.variables.getVariableByIdAsync(varId);
      if (!sourceVariable) continue;

      // Check all mode values for VARIABLE_ALIAS references
      for (const [modeId, modeValue] of Object.entries(sourceVariable.valuesByMode)) {
        if (modeValue && typeof modeValue === 'object' && 'type' in modeValue) {
          const aliasValue = modeValue as VariableAlias;
          if (aliasValue.type === 'VARIABLE_ALIAS') {
            // Get the referenced variable
            const referencedVar = await figma.variables.getVariableByIdAsync(aliasValue.id);
            if (!referencedVar) continue;

            // Check if referenced variable belongs to any target collection
            const referencedCollection = await figma.variables.getVariableCollectionByIdAsync(
              referencedVar.variableCollectionId
            );
            if (!referencedCollection) continue;

            // Check each target collection to see if this reference matches
            for (const [targetKey, targetVariables] of targetCollections.entries()) {
              const storedKey = targetCollectionKeys.get(targetKey);
              if (!storedKey) continue;

              // Check if it's the target collection (by key or name pattern)
              const isTargetCollection =
                referencedCollection.key === storedKey ||
                (targetKey === 'tokens' &&
                  referencedCollection.name.toLowerCase().includes('token')) ||
                (targetKey === 'brand' &&
                  referencedCollection.name.toLowerCase().includes('theme'));

              if (isTargetCollection) {
                // Find the corresponding variable in the target collection by name
                const targetVar = targetVariables.get(referencedVar.name);
                if (targetVar) {
                  // Update the reference to point to the target variable
                  const newRefVal: VariableValue = {
                    type: 'VARIABLE_ALIAS',
                    id: targetVar.id,
                  };
                  sourceVariable.setValueForMode(modeId, newRefVal);
                  console.log(
                    `${logPrefix} Updated ${targetKey} reference: "${sourceVariable.name}" -> "${targetVar.name}"`
                  );
                }
                break; // Found matching collection, no need to check others
              }
            }
          }
        }
      }
    }
  }
}
