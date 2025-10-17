import { GridLayout } from '@recursica/schemas';
import { toFontWeight } from '../../../../packages/common/dist/parsers/toFontWeight';
import { exportToJSON } from './exportToJSON';
import {
  GenericVariables,
  processRemoteVariableCollection,
  combineObjects,
  importVariableByKey,
  getVariableCollectionById,
  parseLineHeight,
} from './shared';

function transformGridLayout(grid: LayoutGrid): GridLayout {
  if (grid.pattern === 'GRID') {
    return {
      alignment: '',
      count: 0,
      gap: 0,
      margin: 0,
      width: grid.sectionSize,
      pattern: grid.pattern,
    };
  }
  const output: GridLayout = {
    alignment: grid.alignment,
    count: grid.count,
    gap: grid.gutterSize,
    width: grid.sectionSize,
    pattern: grid.pattern,
  };
  if (grid.offset) {
    output.margin = grid.offset;
  }
  return output;
}

/**
 * Gets a variable collection node from a team library collection key.
 *
 * This function performs the following steps:
 * 1. Retrieves variables from the team library collection using the collection key
 * 2. Imports the first variable from that collection to get access to the local collection
 * 3. Fetches the actual variable collection node using the imported variable's collection ID
 *
 * This approach is necessary because team library collections are remote references,
 * and we need to import a variable to access the local collection node that contains
 * the shared plugin data metadata we need to read.
 *
 * @param collectionKey - The key of the team library collection
 * @returns Promise<VariableCollection | null> - The local variable collection node, or null if not found
 *
 * @example
 * const collection = await getCollectionNodeFromKey('collection-key-123');
 * const fileType = collection?.getSharedPluginData('recursica', 'file-type');
 */
async function getCollectionNodeFromKey(collectionKey: string): Promise<VariableCollection | null> {
  try {
    // Get variables from the team library collection
    const tokenVariables =
      await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collectionKey);

    if (tokenVariables.length === 0) {
      return null;
    }

    // Import the first variable to get access to the local collection
    const importedVariable = await importVariableByKey(tokenVariables[0].key);

    if (!importedVariable) {
      return null;
    }

    // Get the actual variable collection node using the imported variable's collection ID
    return await getVariableCollectionById(importedVariable.variableCollectionId);
  } catch (error) {
    console.warn(`Failed to get collection node from key ${collectionKey}:`, error);
    return null;
  }
}

// Collection names to detect project types (case-insensitive)
const COLLECTION_TYPE_MAPPING = {
  'ui kit': 'ui-kit',
  tokens: 'tokens',
  themes: 'themes',
} as const;

type Library = {
  value: string;
  name: string;
};

export async function getTeamLibrary(pluginVersion: string) {
  const uiKit = await exportToJSON();
  // Get the team library from the figma api
  const teamLibrary = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

  // Create a record of the libraries
  const libraries: Record<string, Library[]> = {};
  for (const library of teamLibrary) {
    if (!libraries[library.libraryName]) libraries[library.libraryName] = [];
    libraries[library.libraryName].push({
      value: library.key,
      name: library.name,
    });
  }

  // Filter libraries that have collections matching our type mapping
  const validLibraries: Record<string, Library[]> = {};
  for (const collections of Object.values(libraries)) {
    for (const collection of collections) {
      const remoteCollection = await getCollectionNodeFromKey(collection.value);
      const isValid = Object.keys(COLLECTION_TYPE_MAPPING).some((key) =>
        remoteCollection?.getSharedPluginData('recursica', 'file-type')?.includes(key.toLowerCase())
      );
      if (isValid) {
        if (!validLibraries[collection.name]) validLibraries[collection.name] = [];
        validLibraries[collection.name].push(collection);
      }
    }
  }

  // Process all libraries in parallel instead of sequentially
  const libraryPromises = Object.values(validLibraries).map(async (collections) => {
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
  // Filter out "ID variables" collections
  const filteredCollections = fileCollections.filter(
    (collection) => collection.name !== 'ID variables'
  );

  // Run metadata and remaining collections in parallel
  const variableResults = await Promise.all(
    filteredCollections.map((variable) => processRemoteVariableCollection(variable.value))
  );

  const variables = combineObjects(variableResults);

  const collection = await getCollectionNodeFromKey(fileCollections[0].value);
  const fileType = collection?.getSharedPluginData('recursica', 'file-type') || 'unknown';
  const themeName = collection?.getSharedPluginData('recursica', 'theme-name') || undefined;

  // Combine all variables
  const textStyleKeys = JSON.parse(
    collection?.getSharedPluginData('recursica', 'textStyles') || '[]'
  );
  const effectStyleKeys = JSON.parse(
    collection?.getSharedPluginData('recursica', 'effectStyles') || '[]'
  );
  const gridStyleKeys = JSON.parse(
    collection?.getSharedPluginData('recursica', 'gridStyles') || '[]'
  );
  const paintStyleKeys = JSON.parse(
    collection?.getSharedPluginData('recursica', 'paintStyles') || '[]'
  );

  /**
   * Processes style keys and adds them to variables object
   */
  async function processStyleKeys(
    styleKeys: string[],
    styleType: 'TEXT' | 'EFFECT' | 'GRID' | 'PAINT',
    category: 'Typography' | 'Effect' | 'Grid' | 'Paint'
  ): Promise<void> {
    if (styleKeys.length > 0) {
      for (const key of styleKeys) {
        let style: BaseStyle | null = null;
        try {
          style = await figma.importStyleByKeyAsync(key);
        } catch (error) {
          console.error(`Failed to import style ${key}:`, error);
          continue;
        }

        if (style && style.type === styleType) {
          const varIdentifier = `[${fileType}][${category}][${style.name}]`;
          switch (style.type) {
            case 'TEXT':
              variables[varIdentifier] = {
                variableName: style.name,
                fontFamily: style.fontName.family,
                fontSize: style.fontSize,
                fontWeight: {
                  value: toFontWeight(style.fontName.style),
                  alias: style.fontName.style,
                },
                lineHeight: parseLineHeight(style.lineHeight),
                letterSpacing: style.letterSpacing,
                textCase: style.textCase,
                textDecoration: style.textDecoration,
              };
              break;
            case 'EFFECT':
              variables[varIdentifier] = {
                variableName: style.name,
                effects: style.effects.map((eff) => ({
                  type: eff.type,
                  color: (eff as DropShadowEffect).color,
                  offset: (eff as DropShadowEffect).offset,
                  radius: 'radius' in eff ? eff.radius : 0,
                  spread: (eff as DropShadowEffect).spread || 0,
                })),
              };
              break;
            case 'GRID':
              variables[varIdentifier] = {
                type: style.type,
                name: style.name,
                description: style.description,
                layouts: style.layoutGrids.map((grid) => transformGridLayout(grid)),
              };
              break;
            case 'PAINT':
            default:
              variables[varIdentifier] = style;
              break;
          }
        }
      }
    }
  }

  await processStyleKeys(textStyleKeys, 'TEXT', 'Typography');
  await processStyleKeys(effectStyleKeys, 'EFFECT', 'Effect');
  await processStyleKeys(gridStyleKeys, 'GRID', 'Grid');
  await processStyleKeys(paintStyleKeys, 'PAINT', 'Paint');

  if (fileCollections.length > 0) {
    return [variables, fileType, themeName];
  }

  return [variables, 'icons', undefined];
}
