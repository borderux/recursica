import { GenericVariables } from './exportToJSON';
import { VariableCastedValue } from './types';
import { rgbToHex } from './utils/rgbToHex';

export async function getTeamLibrary() {
  // Get the team library from the figma api
  const teamLibrary = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

  // Create a record of the libraries
  const libraries: Record<string, { value: string; name: string }[]> = {};
  for (const library of teamLibrary) {
    if (!libraries[library.libraryName]) libraries[library.libraryName] = [];
    libraries[library.libraryName].push({
      value: library.key,
      name: library.name,
    });
  }

  // Send the libraries to the main thread
  figma.ui.postMessage({
    type: 'TEAM_LIBRARIES',
    payload: libraries,
  });

  return libraries;
}

export async function getRemoteVariables(
  projectId: string,
  pluginVersion: string,
  tokenCollection: string,
  themesCollections: string[],
  uiKit: GenericVariables
) {
  // Get the team library from the figma api
  const libraries = await getTeamLibrary();
  // Decode the token collection
  const [tokens] = await decodeFileVariables(libraries[tokenCollection]);
  // Decode the themes collections
  const themes: Record<string, GenericVariables> = {};
  for (const theme of themesCollections) {
    const [themeValues, metadata] = await decodeFileVariables(libraries[theme]);
    const filetype = Object.values(
      metadata as Record<string, { name: string; value: string }>
    ).find((m) => m.name === 'project-type')?.value;
    // If the filetype is not themes, continue
    if (filetype !== 'themes') continue;
    // Get the theme name
    const themeName = Object.values(
      metadata as Record<string, { name: string; value: string }>
    ).find((m) => m.name === 'theme')?.value;
    // If the theme values or theme name is not found, continue
    if (!themeValues || !themeName) continue;
    // Add the theme to the themes object
    themes[themeName] = themeValues;
  }
  // Send the variables to the main thread
  const response = {
    type: 'RECURSICA_VARIABLES',
    payload: {
      projectId,
      pluginVersion,
      tokens,
      themes,
      uiKit,
    },
  };

  figma.ui.postMessage(response);
}

async function decodeFileVariables(
  fileCollections: { value: string; name: string }[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  const metadataCollection = fileCollections.find((f) => f.name === 'ID variables');
  if (!metadataCollection) {
    figma.notify('No metadata collection found');
    return [];
  }
  const metadataVariables = await decodeRemoteVariables(metadataCollection.value);

  const remainingCollections = fileCollections.filter((f) => f.name !== 'ID variables');

  const variables: GenericVariables = {};
  for (const variable of remainingCollections) {
    const variableData = await decodeRemoteVariables(variable.value);
    Object.assign(variables, variableData);
  }
  return [variables, metadataVariables];
}

// Decode the remote variables
export async function decodeRemoteVariables(collection: string) {
  const variables: GenericVariables = {};
  const tokenVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection);
  for (const variable of tokenVariables) {
    const {
      valuesByMode,
      name: variableName,
      resolvedType,
      description,
      variableCollectionId,
    } = await figma.variables.importVariableByKeyAsync(variable.key);

    const parentVariableCollection =
      await figma.variables.getVariableCollectionByIdAsync(variableCollectionId);

    if (!parentVariableCollection) continue;
    const { modes, name: collectionName } = parentVariableCollection;

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
