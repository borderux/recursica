export async function getAccessTokens() {
  const accessToken = await figma.clientStorage.getAsync('accessToken');
  const { platform, accessToken: accessTokenValue } = JSON.parse(accessToken || '{}');

  figma.ui.postMessage({
    type: 'GET_ACCESS_TOKEN',
    payload: {
      platform,
      accessToken: accessTokenValue,
    },
  });
}

export async function updateAccessTokens(platform: string, accessToken: string) {
  await figma.clientStorage.setAsync('accessToken', JSON.stringify({ platform, accessToken }));
  figma.notify('Access token updated');
}
