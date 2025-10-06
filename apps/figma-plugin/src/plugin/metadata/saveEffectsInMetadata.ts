/**
 * Updates shared plugin data for a collection if the new data differs from the current data
 */
function updateStyleDataIfChanged(
  collection: VariableCollection,
  styleKeys: string[],
  dataKey: 'textStyles' | 'effectStyles' | 'gridStyles' | 'paintStyles',
  logName: string
): void {
  if (styleKeys.length > 0) {
    const currentData = collection.getSharedPluginData('recursica', dataKey);
    const newData = JSON.stringify(styleKeys);
    if (currentData !== newData) {
      console.log(`saving ${logName}`, styleKeys);
      collection.setSharedPluginData('recursica', dataKey, newData);
    }
  }
}

export async function saveEffectsInMetadata(localCollections: VariableCollection[]) {
  const textStyles = await figma.getLocalEffectStylesAsync();
  const textStylesKeys: string[] = [];
  for (const style of textStyles) {
    textStylesKeys.push(style.key);
  }

  const effectStyles = await figma.getLocalEffectStylesAsync();
  const effectStylesKeys: string[] = [];
  for (const style of effectStyles) {
    effectStylesKeys.push(style.key);
  }

  const gridStyles = await figma.getLocalGridStylesAsync();
  const gridStylesKeys: string[] = [];
  for (const style of gridStyles) {
    gridStylesKeys.push(style.key);
  }

  const paintStyles = await figma.getLocalPaintStylesAsync();
  const paintStylesKeys: string[] = [];
  for (const style of paintStyles) {
    paintStylesKeys.push(style.key);
  }

  for (const collection of localCollections) {
    updateStyleDataIfChanged(collection, textStylesKeys, 'textStyles', 'textStyles');
    updateStyleDataIfChanged(collection, effectStylesKeys, 'effectStyles', 'effectStyles');
    updateStyleDataIfChanged(collection, gridStylesKeys, 'gridStyles', 'gridStyles');
    updateStyleDataIfChanged(collection, paintStylesKeys, 'paintStyles', 'paintStyles');
  }
}
