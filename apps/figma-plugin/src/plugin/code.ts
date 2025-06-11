import { exportToJSON } from './exportToJSON';
import packageInfo from '../../package.json' with { type: 'json' };
import { decodeProjectMetadataCollection } from './projectMetadataCollection';
import { getAccessTokens, updateAccessTokens } from './accessTokens';
import { getRemoteVariables, getTeamLibrary } from './teamLibrary';
const pluginVersion = packageInfo.version;

async function main() {
  figma.showUI(`<script>window.location.href ="http://localhost:5173"</script>`, {
    width: 450,
    height: 600,
    themeColors: true,
  });

  const { projectId } = await decodeProjectMetadataCollection(pluginVersion);
  const localVariables = await exportToJSON();
  getAccessTokens();
  getTeamLibrary();

  figma.ui.onmessage = async (e) => {
    if (e.type === 'UPDATE_ACCESS_TOKEN') {
      const { platform, accessToken } = e.payload;
      await updateAccessTokens(platform, accessToken);
    }
    if (e.type === 'FETCH_SOURCES') {
      const { tokenCollection, themesCollections } = e.payload;
      await getRemoteVariables(
        projectId,
        pluginVersion,
        tokenCollection,
        themesCollections,
        localVariables
      );
    }
  };
}

main();
