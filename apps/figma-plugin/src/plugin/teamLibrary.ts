import { exportToJSON, GenericVariables } from './exportToJSON';
import { VariableCastedValue } from '@recursica/schemas';
import { rgbToHex } from '@recursica/common';

export async function getTeamLibrary(projectId: string, pluginVersion: string) {
  const uiKit = await exportToJSON();
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

  const validLibraries = Object.keys(libraries).filter((val) => {
    const collections = libraries?.[val];
    return collections?.some((collection) => collection.name === 'ID variables');
  });

  // Process all libraries in parallel instead of sequentially
  const libraryPromises = validLibraries.map(async (library) => {
    const collections = libraries?.[library];
    const [variables, metadata] = await decodeFileVariables(collections);
    const filetype = Object.values(
      metadata as Record<string, { name: string; value: string }>
    ).find((m) => m.name === 'project-type')?.value;

    return { variables, metadata, filetype };
  });

  // Wait for all libraries to be processed
  const libraryResults = await Promise.all(libraryPromises);

  // Process results sequentially since we need to assign to tokens/themes
  let tokens: GenericVariables = {};
  const themes: Record<string, GenericVariables> = {};

  for (const { variables, metadata, filetype } of libraryResults) {
    if (filetype === 'tokens') {
      tokens = variables;
    } else if (filetype === 'themes') {
      const themeName = Object.values(
        metadata as Record<string, { name: string; value: string }>
      ).find((m) => m.name === 'theme')?.value;
      if (themeName) {
        themes[themeName] = variables;
      }
    }
  }

  // Send the variables to the main thread - this now runs after ALL variables are collected
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

  return libraries;
}

async function decodeFileVariables(
  fileCollections: { value: string; name: string }[]
): Promise<[GenericVariables, GenericVariables]> {
  const metadataCollection = fileCollections.find((f) => f.name === 'ID variables');
  if (!metadataCollection) {
    figma.notify('No metadata collection found');
    return [{} as GenericVariables, {} as GenericVariables];
  }

  const remainingCollections = fileCollections.filter((f) => f.name !== 'ID variables');

  // Run metadata and remaining collections in parallel
  const [metadataVariables, ...variableResults] = await Promise.all([
    decodeRemoteVariables(metadataCollection.value),
    ...remainingCollections.map((variable) => decodeRemoteVariables(variable.value)),
  ]);

  // Combine all variables
  const variables: GenericVariables = {};
  variableResults.forEach((variableData) => {
    Object.assign(variables, variableData);
  });

  return [variables, metadataVariables];
}

// Decode the remote variables
export async function decodeRemoteVariables(collection: string) {
  const variables: GenericVariables = {};
  const tokenVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection);

  // Process all variables in parallel instead of sequentially
  const variablePromises = tokenVariables.map(async (variable) => {
    const {
      valuesByMode,
      name: variableName,
      resolvedType,
      description,
      variableCollectionId,
    } = await figma.variables.importVariableByKeyAsync(variable.key);

    const parentVariableCollection =
      await figma.variables.getVariableCollectionByIdAsync(variableCollectionId);

    if (!parentVariableCollection) return {};

    const { modes, name: collectionName } = parentVariableCollection;
    const variableEntries: GenericVariables = {};

    // Process all modes in parallel
    const modePromises = Object.entries(valuesByMode).map(async ([modeId, rawValue]) => {
      const mode = modes.find((md) => md.modeId === modeId);
      if (!mode) return null;

      let value;
      if (typeof rawValue === 'object') {
        if ((rawValue as VariableAlias).type) {
          const [referencedVariable, referencedCollection] = await Promise.all([
            figma.variables.getVariableByIdAsync((rawValue as VariableAlias).id),
            figma.variables
              .getVariableByIdAsync((rawValue as VariableAlias).id)
              .then((variable) =>
                variable
                  ? figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId)
                  : null
              ),
          ]);

          if (referencedVariable && referencedCollection) {
            value = {
              collection: referencedCollection.name,
              name: referencedVariable.name,
            };
          }
        } else if (resolvedType === 'COLOR') {
          value = rgbToHex(rawValue as RGBA);
        }
      } else {
        value = rawValue as VariableCastedValue;
      }

      if (value !== undefined) {
        const idValue = `[${collectionName}][${mode.name}][${variableName}]`;
        const safeParsedIdValue = idValue.split(' ').join('-');
        return {
          key: safeParsedIdValue,
          data: {
            collection: collectionName,
            mode: mode.name,
            name: variableName,
            type: resolvedType.toLowerCase(),
            description: description,
            value,
          },
        };
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

  // Wait for all variables to be processed
  const variableResults = await Promise.all(variablePromises);

  // Combine all results
  variableResults.forEach((variableData) => {
    Object.assign(variables, variableData);
  });

  return variables;
}
