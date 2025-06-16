import { GenericVariables } from './exportToJSON';
import { VariableCastedValue } from '@recursica/common';
import { rgbToHex } from './utils';

export async function processVariableCollection({
  name: collectionName,
  modes,
  variableIds,
}: VariableCollection) {
  const variables: GenericVariables = {};

  for (const variableId of variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (!variable) continue;
    const { valuesByMode, name: variableName, resolvedType, description } = variable;

    for (const modeId in valuesByMode) {
      const mode = modes.find((md) => md.modeId === modeId);
      if (!mode) continue;

      const rawValue = valuesByMode[modeId];
      let value;
      if (typeof rawValue === 'object') {
        if ((rawValue as VariableAlias).type) {
          const referencedVariable = await figma.variables.getVariableByIdAsync(
            (rawValue as VariableAlias).id
          );
          const referencedCollection = await figma.variables.getVariableCollectionByIdAsync(
            referencedVariable!.variableCollectionId
          );
          value = {
            collection: referencedCollection!.name,
            name: referencedVariable!.name,
          };
        } else if (resolvedType === 'COLOR') {
          value = rgbToHex(rawValue as RGBA);
        }
      } else {
        value = rawValue as VariableCastedValue;
      }

      if (value !== undefined) {
        const idValue = `[${collectionName}][${mode.name}][${variableName}]`;
        const safeParsedIdValue = idValue.split(' ').join('-');
        variables[safeParsedIdValue] = {
          collection: collectionName,
          mode: mode.name,
          name: variableName,
          type: resolvedType.toLowerCase(),
          description: description,
          value,
        };
      }
    }
  }
  return variables;
}
