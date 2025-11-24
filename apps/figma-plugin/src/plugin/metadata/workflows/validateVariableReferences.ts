/**
 * Validates that all variable references in a source collection exist in the target collection.
 *
 * @param sourceCollection - The collection containing variables that reference target
 * @param targetCollection - The collection that should contain the referenced variables
 * @param targetCollectionName - Name for error messages
 * @param targetVariablesMap - Optional map of target variables (if provided, uses this instead of collection.variableIds)
 * @returns Object with validation result, missing variable names, and mapping of missing variables to their source references
 */
export async function validateVariableReferences(
  sourceCollection: VariableCollection,
  targetCollection: VariableCollection,
  targetCollectionName: string,
  targetVariablesMap?: Map<string, Variable>
): Promise<{
  isValid: boolean;
  missingVariables: string[];
  missingVariablesWithReferences: Map<string, string[]>; // Map of missing variable name -> array of source variable names that reference it
}> {
  const missingVariables = new Set<string>();
  const missingVariablesWithReferences = new Map<string, string[]>();

  // Get all variables in target collection, indexed by name
  // Use provided map if available (contains all library variables), otherwise use collection.variableIds (only locally imported)
  let targetVariables: Map<string, Variable>;
  if (targetVariablesMap) {
    targetVariables = targetVariablesMap;
  } else {
    targetVariables = new Map<string, Variable>();
    for (const varId of targetCollection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (variable) {
        targetVariables.set(variable.name, variable);
      }
    }
  }

  // Check all variables in source collection
  for (const varId of sourceCollection.variableIds) {
    const sourceVariable = await figma.variables.getVariableByIdAsync(varId);
    if (!sourceVariable) continue;

    // Check all mode values for VARIABLE_ALIAS references
    for (const [, modeValue] of Object.entries(sourceVariable.valuesByMode)) {
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
            referencedCollection.key === targetCollection.key ||
            referencedCollection.name.toLowerCase().includes(targetCollectionName.toLowerCase());

          if (isTargetCollection) {
            // Verify variable exists in target collection by name
            if (!targetVariables.has(referencedVar.name)) {
              missingVariables.add(referencedVar.name);
              // Track which source variable references this missing variable
              const existingRefs = missingVariablesWithReferences.get(referencedVar.name) || [];
              if (!existingRefs.includes(sourceVariable.name)) {
                existingRefs.push(sourceVariable.name);
                missingVariablesWithReferences.set(referencedVar.name, existingRefs);
              }
            }
          }
        }
      }
    }
  }

  const missingArray = Array.from(missingVariables);
  if (missingArray.length > 0) {
    console.log(`[validateVariableReferences] Missing variables:`, missingArray.sort());
  }

  return {
    isValid: missingArray.length === 0,
    missingVariables: missingArray,
    missingVariablesWithReferences,
  };
}
