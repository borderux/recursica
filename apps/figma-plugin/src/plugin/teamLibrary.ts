import { exportToJSON } from './exportToJSON';
import { GenericVariables, processRemoteVariableCollection, combineObjects } from './shared';

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
  console.log(response);
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
  const variables = combineObjects(variableResults);

  return [variables, metadataVariables];
}

// Decode the remote variables
export async function decodeRemoteVariables(collection: string) {
  return await processRemoteVariableCollection(collection);
}
