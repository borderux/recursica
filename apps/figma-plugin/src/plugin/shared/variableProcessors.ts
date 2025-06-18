import { toFontWeight } from '@recursica/common';
import type { FontFamilyToken, EffectToken } from '@recursica/schemas';
import { GenericVariables } from './types';
import { parseLineHeight, combineObjects, generateVariableId } from './dataTransformers';
import {
  processVariableMode,
  getVariableCollectionById,
  importVariableByKey,
} from './figmaApiHelpers';

/**
 * Processes local variable collections into GenericVariables format
 */
export async function processLocalVariableCollection(
  variableCollection: VariableCollection
): Promise<GenericVariables> {
  const variablePromises = variableCollection.variableIds.map(async (variableId) => {
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (!variable) return {};

    const { valuesByMode, name: variableName, resolvedType } = variable;
    const variableEntries: GenericVariables = {};

    const modePromises = Object.entries(valuesByMode).map(async ([modeId, rawValue]) => {
      const processedVariable = await processVariableMode(
        modeId,
        rawValue,
        variableName,
        resolvedType,
        variableCollection
      );

      if (processedVariable) {
        const id = generateVariableId(
          processedVariable.collection,
          processedVariable.mode,
          processedVariable.name
        );
        return { key: id, data: processedVariable };
      }
      return null;
    });

    const modeResults = await Promise.all(modePromises);
    modeResults.forEach((result) => {
      if (result) {
        variableEntries[result.key] = result.data;
      }
    });

    return variableEntries;
  });

  const variableResults = await Promise.all(variablePromises);
  return combineObjects(variableResults);
}

/**
 * Processes remote variable collection using team library
 */
export async function processRemoteVariableCollection(
  collection: string
): Promise<GenericVariables> {
  try {
    const tokenVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection);

    const variablePromises = tokenVariables.map(async (variable) => {
      const importedVariable = await importVariableByKey(variable.key);
      if (!importedVariable) return {};

      const {
        valuesByMode,
        name: variableName,
        resolvedType,
        variableCollectionId,
      } = importedVariable;

      const parentVariableCollection = await getVariableCollectionById(variableCollectionId);
      if (!parentVariableCollection) return {};

      const variableEntries: GenericVariables = {};

      const modePromises = Object.entries(valuesByMode).map(async ([modeId, rawValue]) => {
        const processedVariable = await processVariableMode(
          modeId,
          rawValue,
          variableName,
          resolvedType,
          parentVariableCollection
        );

        if (processedVariable) {
          const id = generateVariableId(
            processedVariable.collection,
            processedVariable.mode,
            processedVariable.name
          );
          return { key: id, data: processedVariable };
        }
        return null;
      });

      const modeResults = await Promise.all(modePromises);
      modeResults.forEach((result) => {
        if (result) {
          variableEntries[result.key] = result.data;
        }
      });

      return variableEntries;
    });

    const variableResults = await Promise.all(variablePromises);
    return combineObjects(variableResults);
  } catch (error) {
    console.warn(`Failed to process remote variable collection ${collection}:`, error);
    return {};
  }
}

/**
 * Processes local typography styles into GenericVariables format
 */
export async function processLocalTypographyStyles(): Promise<GenericVariables> {
  const parsedTypographies: GenericVariables = {};
  const rawTypographies = await figma.getLocalTextStylesAsync();

  for (const typography of rawTypographies) {
    const {
      name,
      fontName: { family: fontFamily, style: fontWeight },
      fontSize,
      lineHeight,
      letterSpacing,
      textCase,
      textDecoration,
    } = typography;

    parsedTypographies[name] = {
      variableName: name,
      fontFamily,
      fontSize,
      fontWeight: {
        value: toFontWeight(fontWeight),
        alias: fontWeight,
      },
      lineHeight: parseLineHeight(lineHeight),
      letterSpacing,
      textCase,
      textDecoration,
    } as FontFamilyToken;
  }

  return parsedTypographies;
}

/**
 * Processes local effect styles into GenericVariables format
 */
export async function processLocalEffectStyles(): Promise<GenericVariables> {
  const parsedEffects: GenericVariables = {};
  const rawEffects = await figma.getLocalEffectStylesAsync();

  for (const { name, effects } of rawEffects) {
    parsedEffects[name] = {
      variableName: name,
      effects: effects.map((eff) => ({
        type: eff.type,
        color: (eff as DropShadowEffect).color,
        offset: (eff as DropShadowEffect).offset,
        radius: 'radius' in eff ? eff.radius : 0,
        spread: (eff as DropShadowEffect).spread || 0,
      })),
    } as EffectToken;
  }

  return parsedEffects;
}
