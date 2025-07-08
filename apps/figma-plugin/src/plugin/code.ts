import packageInfo from '../../package.json' with { type: 'json' };
import { decodeProjectMetadataCollection } from './projectMetadataCollection';
import { getLocalStorage, saveInStorage } from './authStorage';
import { getTeamLibrary } from './teamLibrary';
import { exportIcons } from './exportIcons';
const pluginVersion = packageInfo.version;

if (import.meta.env.MODE === 'development') {
  figma.showUI(__html__, {
    width: 370,
    height: 350,
  });
} else {
  const uiUrl = import.meta.env.VITE_RECURSICA_UI_URL;
  figma.showUI(`<script>window.location.href = '${uiUrl}'</script>`, {
    width: 370,
    height: 350,
  });
}
async function main() {
  const { projectId, projectType } = await decodeProjectMetadataCollection(pluginVersion);
  if (projectType === 'icons') {
    exportIcons();
  } else {
    getTeamLibrary(projectId, pluginVersion);
  }
}

async function syncTokens() {
  const libraries = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  const libraryVariables: Variable[] = [];
  for (const library of libraries) {
    const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(library.key);
    for (const variable of variables) {
      const actualVar = await figma.variables.importVariableByKeyAsync(variable.key);
      libraryVariables.push(actualVar);
    }
  }
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  for (const collection of [...localCollections]) {
    if (collection.name === 'ID variables') continue;
    for (const varId of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (!variable) continue;
      for (const [key, modeVal] of Object.entries(variable.valuesByMode)) {
        if (typeof modeVal === 'object' && modeVal !== null && 'type' in modeVal) {
          const refVar = await figma.variables.getVariableByIdAsync(modeVal.id);
          if (refVar) {
            const newSyncVar = libraryVariables.find((v) => v.name === refVar.name);
            if (newSyncVar) {
              const newRefVal: VariableValue = {
                type: 'VARIABLE_ALIAS',
                id: newSyncVar.id,
              };
              variable.setValueForMode(key, newRefVal);
            }
          }
        }
      }
    }
  }
}

syncTokens();

figma.ui.onmessage = async (e) => {
  if (e.type === 'GET_LOCAL_STORAGE') {
    getLocalStorage();
  }
  if (e.type === 'GET_CURRENT_USER') {
    figma.ui.postMessage({
      type: 'CURRENT_USER',
      payload: figma.currentUser?.id,
    });
  }
  if (e.type === 'UPDATE_ACCESS_TOKEN') {
    saveInStorage('accessToken', e.payload);
  }
  if (e.type === 'UPDATE_PLATFORM') {
    saveInStorage('platform', e.payload);
  }
  if (e.type === 'UPDATE_SELECTED_PROJECT') {
    saveInStorage('selectedProject', e.payload);
  }
  if (e.type === 'GET_VARIABLES') {
    main();
  }
};
