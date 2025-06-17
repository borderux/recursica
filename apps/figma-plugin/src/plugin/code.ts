import packageInfo from '../../package.json' with { type: 'json' };
import { decodeProjectMetadataCollection } from './projectMetadataCollection';
import { getAccessTokens, updateAccessTokens } from './accessTokens';
import { getTeamLibrary } from './teamLibrary';
import { exportIcons } from './exportIcons';
const pluginVersion = packageInfo.version;

figma.showUI(__html__, {
  width: 370,
  height: 350,
  themeColors: true,
});
async function main() {
  const { projectId, projectType } = await decodeProjectMetadataCollection(pluginVersion);
  getAccessTokens();
  if (projectType === 'icons') {
    exportIcons();
  } else {
    getTeamLibrary(projectId, pluginVersion);
  }

  figma.ui.onmessage = async (e) => {
    if (e.type === 'UPDATE_ACCESS_TOKEN') {
      const { platform, accessToken } = e.payload;
      await updateAccessTokens(platform, accessToken);
    }
  };
}

setTimeout(main, 1000);
