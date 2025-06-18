import type { LineHeight as SchemaLineHeight } from '@recursica/schemas';

/**
 * Parses Figma LineHeight object into a standardized format
 */
export function parseLineHeight(figmaLineHeight: LineHeight): SchemaLineHeight {
  if (figmaLineHeight.unit === 'AUTO') {
    return {
      unit: 'AUTO',
      value: 0, // Default value for AUTO line height
    };
  }
  if (figmaLineHeight.unit === 'PERCENT') {
    const value = figmaLineHeight.value;
    const decimal = value % 1;
    const roundedValue = decimal > 0.9 ? Math.ceil(value) : value;
    return {
      unit: 'PERCENT',
      value: roundedValue,
    };
  }
  return {
    unit: figmaLineHeight.unit,
    value: figmaLineHeight.value,
  };
}

/**
 * Generates a safe, unique ID for a variable based on collection, mode, and name
 */
export function generateVariableId(
  collectionName: string,
  modeName: string,
  variableName: string
): string {
  const idValue = `[${collectionName}][${modeName}][${variableName}]`;
  return idValue.split(' ').join('-');
}

/**
 * Processes multiple items in parallel using Promise.all
 */
export async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  return Promise.all(items.map(processor));
}

/**
 * Combines multiple objects into a single object
 */
export function combineObjects<T extends Record<string, unknown>>(objects: T[]): T {
  const combined = {} as T;
  objects.forEach((obj) => {
    Object.assign(combined, obj);
  });
  return combined;
}
