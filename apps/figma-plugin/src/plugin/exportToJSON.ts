import { PROJECT_METADATA_VARIABLE_COLLECTION } from './projectMetadataCollection';
import { toFontWeight } from './utils';
import { processVariableCollection } from './variables';

export interface fileMetadata {
  projectId: string;
  projectType: string;
  version: string;
  theme: string | undefined;
}
export type GenericVariables = {
  [key: string]: object;
};

function parseLineHeight(lineHeight: LineHeight) {
  if (lineHeight.unit === 'AUTO') {
    return {
      unit: 'AUTO',
    };
  }
  if (lineHeight.unit === 'PERCENT') {
    const value = lineHeight.value;
    const decimal = value % 1;
    const roundedValue = decimal > 0.9 ? Math.ceil(value) : value;
    return {
      unit: 'PERCENT',
      value: roundedValue,
    };
  }
  return {
    unit: lineHeight.unit,
    value: lineHeight.value,
  };
}
async function decodeVariableCollections() {
  const objectCollections = {};
  // Get local variable collections
  const rawVariables = await figma.variables.getLocalVariableCollectionsAsync();
  for (const variableCollection of rawVariables) {
    if (
      variableCollection.name.toLowerCase() === PROJECT_METADATA_VARIABLE_COLLECTION.toLowerCase()
    )
      continue;
    Object.assign(objectCollections, await processVariableCollection(variableCollection));
  }
  return objectCollections;
}

async function decodeTypographyStyles() {
  // Get local typographies
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
    };
  }
  return parsedTypographies;
}

async function decodeEffectStyles() {
  // Get local effects
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
    };
  }
  return parsedEffects;
}

export async function exportToJSON() {
  const variables = await decodeVariableCollections();
  const typographies = await decodeTypographyStyles();
  const effects = await decodeEffectStyles();

  const parsedCollections = Object.assign({}, variables, typographies, effects);

  return parsedCollections;
}
