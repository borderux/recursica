import { exportToJSON } from './exportToJSON';
import {
  GenericVariables,
  processRemoteVariableCollection,
  combineObjects,
  importVariableByKey,
  getVariableCollectionById,
} from './shared';

// Collection names to detect project types (case-insensitive)
const COLLECTION_TYPE_MAPPING = {
  'ui kit': 'ui-kit',
  tokens: 'tokens',
  themes: 'themes',
} as const;

export async function getTeamLibrary(pluginVersion: string) {
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

  // Filter libraries that have collections matching our type mapping
  const validLibraries = Object.fromEntries(
    Object.entries(libraries).filter(([, collections]) => {
      return collections?.some((collection) => {
        const collectionName = collection.name.toLowerCase();
        return Object.keys(COLLECTION_TYPE_MAPPING).some((key) =>
          collectionName.includes(key.toLowerCase())
        );
      });
    })
  );

  // Process all libraries in parallel instead of sequentially
  const libraryPromises = Object.entries(validLibraries).map(async ([, collections]) => {
    const [variables, filetype, themeName] = await decodeFileVariables(collections);
    return { variables, filetype, themeName };
  });

  // Wait for all libraries to be processed
  const libraryResults = await Promise.all(libraryPromises);

  // Process results sequentially since we need to assign to tokens/themes
  let tokens: GenericVariables = {};
  const themes: Record<string, GenericVariables> = {};

  for (const { variables, filetype, themeName } of libraryResults) {
    if (filetype === 'tokens') {
      tokens = variables;
    } else if (filetype === 'themes') {
      if (themeName) {
        themes[themeName] = variables;
      }
    }
  }

  // Send the variables to the main thread - this now runs after ALL variables are collected
  const response = {
    type: 'RECURSICA_VARIABLES',
    payload: {
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
): Promise<[GenericVariables, string, string | undefined]> {
  // Run metadata and remaining collections in parallel
  const variableResults = await Promise.all(
    fileCollections.map((variable) => processRemoteVariableCollection(variable.value))
  );

  // Combine all variables
  const variables = combineObjects(variableResults);

  const tokenVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
    fileCollections[0].value
  );

  const importedVariable = await importVariableByKey(tokenVariables[0].key);
  const collection = await getVariableCollectionById(importedVariable!.variableCollectionId);

  if (fileCollections.length > 0) {
    return [
      variables,
      collection?.getSharedPluginData('recursica', 'file-type') || 'unknown',
      collection?.getSharedPluginData('recursica', 'theme-name') || undefined,
    ];
  }

  return [variables, 'icons', undefined];
}
