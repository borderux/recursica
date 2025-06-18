import { rgbToHex } from '@recursica/common';
import type { VariableCastedValue, VariableReferenceValue } from '@recursica/schemas';
import type { Token } from '@recursica/schemas';

/**
 * Resolves a variable alias to its referenced variable information
 */
export async function resolveVariableAlias(
  alias: VariableAlias
): Promise<VariableReferenceValue | null> {
  try {
    const [referencedVariable, referencedCollection] = await Promise.all([
      figma.variables.getVariableByIdAsync(alias.id),
      figma.variables
        .getVariableByIdAsync(alias.id)
        .then((variable) =>
          variable
            ? figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId)
            : null
        ),
    ]);

    if (referencedVariable && referencedCollection) {
      return {
        collection: referencedCollection.name,
        name: referencedVariable.name,
      };
    }
  } catch (error) {
    console.warn('Failed to resolve variable alias:', error);
  }
  return null;
}

/**
 * Processes a raw variable value based on its type
 */
export async function processVariableValue(
  rawValue: unknown,
  resolvedType: string
): Promise<string | number | boolean | VariableReferenceValue | null> {
  if (typeof rawValue === 'object' && rawValue !== null) {
    // Handle variable alias
    if ('type' in rawValue && (rawValue as VariableAlias).type) {
      return await resolveVariableAlias(rawValue as VariableAlias);
    }
    // Handle color values
    else if (resolvedType === 'COLOR') {
      return rgbToHex(rawValue as RGBA);
    }
  }

  // Handle primitive values
  return rawValue as VariableCastedValue;
}

/**
 * Processes a variable mode into a ProcessedVariable object
 */
export async function processVariableMode(
  modeId: string,
  rawValue: unknown,
  variableName: string,
  resolvedType: string,
  parentCollection: VariableCollection
): Promise<Token | null> {
  const mode = parentCollection.modes.find((md) => md.modeId === modeId);
  if (!mode) return null;

  const value = await processVariableValue(rawValue, resolvedType);
  if (value === null) return null;

  return {
    collection: parentCollection.name,
    mode: mode.name,
    name: variableName,
    type: resolvedType.toLowerCase(),
    value,
  };
}

/**
 * Gets a variable collection by ID with error handling
 */
export async function getVariableCollectionById(
  collectionId: string
): Promise<VariableCollection | null> {
  try {
    return await figma.variables.getVariableCollectionByIdAsync(collectionId);
  } catch (error) {
    console.warn(`Failed to get variable collection ${collectionId}:`, error);
    return null;
  }
}

/**
 * Imports a variable by key with error handling
 */
export async function importVariableByKey(key: string): Promise<Variable | null> {
  try {
    return await figma.variables.importVariableByKeyAsync(key);
  } catch (error) {
    console.warn(`Failed to import variable ${key}:`, error);
    return null;
  }
}
