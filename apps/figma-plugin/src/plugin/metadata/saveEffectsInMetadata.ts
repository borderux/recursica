/**
 * Updates shared plugin data for a collection if the new data differs from the current data
 *
 * @param collection - The variable collection to update
 * @param styleKeys - Array of style keys to save
 * @param dataKey - The plugin data key to store the styles under
 * @param logName - Name for logging purposes
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
  if (styleKeys.length === 0) {
    collection.setSharedPluginData('recursica', dataKey, '');
  }
}

/**
 * Saves effect styles, text styles, grid styles, and paint styles metadata to local collections
 * This function retrieves all local styles from Figma and stores their keys in the shared plugin data
 * of the provided variable collections for persistence across plugin sessions.
 *
 * @param localCollections - Array of variable collections to update with style metadata
 */
export async function saveEffectsInMetadata(localCollections: VariableCollection[]) {
  const textStyles = await figma.getLocalTextStylesAsync();
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
