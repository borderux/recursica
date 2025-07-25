import {
  processLocalVariableCollection,
  processLocalTypographyStyles,
  processLocalEffectStyles,
  combineObjects,
} from './shared';

// Re-export types for backwards compatibility
export type { GenericVariables } from './shared';
async function decodeVariableCollections() {
  const objectCollections = {};
  // Get local variable collections
  const rawVariables = await figma.variables.getLocalVariableCollectionsAsync();
  for (const variableCollection of rawVariables) {
    Object.assign(objectCollections, await processLocalVariableCollection(variableCollection));
  }
  return objectCollections;
}

async function decodeTypographyStyles() {
  return await processLocalTypographyStyles();
}

async function decodeEffectStyles() {
  return await processLocalEffectStyles();
}

export async function exportToJSON() {
  const variables = await decodeVariableCollections();
  const typographies = await decodeTypographyStyles();
  const effects = await decodeEffectStyles();

  return combineObjects([variables, typographies, effects]);
}
