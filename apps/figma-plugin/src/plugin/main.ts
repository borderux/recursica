import packageInfo from '../../package.json' with { type: 'json' };
import { getLocalStorage, saveInStorage } from './authStorage';
import { getTeamLibrary } from './teamLibrary';
import { syncMetadata } from './metadata';
import { detectFiletype } from './filetype';
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
  const grids = await figma.getLocalGridStylesAsync();
  console.log(grids);
}
main();

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
  if (e.type === 'UPDATE_AGREED_PUBLISH_CHANGES') {
    saveInStorage('agreedPublishChanges', e.payload);
  }
  if (e.type === 'GET_VARIABLES') {
    const { fileType } = await detectFiletype();
    if (fileType === 'ui-kit') {
      getTeamLibrary(pluginVersion);
    }
  }
  if (e.type === 'SYNC_TOKENS') {
    syncMetadata();
  }
  if (e.type === 'GET_FILETYPE') {
    try {
      const { fileType, themeName } = await detectFiletype();
      figma.ui.postMessage({
        type: 'FILETYPE_DETECTED',
        payload: {
          fileType,
          themeName,
          pluginVersion,
        },
      });
    } catch (error) {
      figma.ui.postMessage({
        type: 'FILETYPE_ERROR',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      });
    }
  }
  if (e.type === 'CLOSE_PLUGIN') {
    figma.closePlugin();
  }
};
