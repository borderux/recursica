import packageInfo from '../../package.json' with { type: 'json' };
import { decodeProjectMetadataCollection } from './projectMetadataCollection';
import { getLocalStorage, saveInStorage } from './authStorage';
import { getTeamLibrary } from './teamLibrary';
import { exportIcons } from './exportIcons';
import { syncTokens } from './syncTokens';
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
  if (e.type === 'SYNC_TOKENS') {
    syncTokens();
  }
};
