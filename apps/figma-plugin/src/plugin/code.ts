import { exportToJSON } from './exportToJSON';
import packageInfo from '../../package.json' with { type: 'json' };
import { decodeProjectMetadataCollection } from './projectMetadataCollection';
import { getAccessTokens, updateAccessTokens } from './accessTokens';
import { getTeamLibrary } from './teamLibrary';
const pluginVersion = packageInfo.version;

figma.showUI(__html__, {
  width: 370,
  height: 350,
  themeColors: true,
});
async function main() {
  const { projectId } = await decodeProjectMetadataCollection(pluginVersion);
  const localVariables = await exportToJSON();
  getAccessTokens();
  getTeamLibrary(projectId, pluginVersion, localVariables);

  figma.ui.onmessage = async (e) => {
    if (e.type === 'UPDATE_ACCESS_TOKEN') {
      const { platform, accessToken } = e.payload;
      await updateAccessTokens(platform, accessToken);
    }
  };
}

setTimeout(main, 1000);
