export async function getLocalStorage() {
  const accessToken = await getLocalStorageValue('accessToken');
  const platform = await getLocalStorageValue('platform');
  const selectedProject = await getLocalStorageValue('selectedProject');
  const agreedPublishChanges = await getLocalStorageValue('agreedPublishChanges');

  figma.ui.postMessage({
    type: 'GET_LOCAL_STORAGE',
    payload: {
      accessToken,
      platform,
      selectedProject,
      agreedPublishChanges,
    },
  });
}

async function getLocalStorageValue(key: string) {
  return figma.clientStorage.getAsync(key);
}

export async function saveInStorage(key: string, value: string) {
  await figma.clientStorage.setAsync(key, value);
  if (key === 'accessToken') {
    await figma.clientStorage.deleteAsync('selectedProject');
    figma.notify(`Access token updated`);
  }
  if (key === 'platform') {
    await figma.clientStorage.deleteAsync('selectedProject');
    await figma.clientStorage.deleteAsync('accessToken');
    figma.notify(`Platform updated`);
  }
  if (key === 'selectedProject') {
    figma.notify(`Selected project updated`);
  }
}
