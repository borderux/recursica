export class PluginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PluginError';
    figma.notify(message);
    figma.closePlugin();
  }
}

export type ProjectTypes = 'ui-kit' | 'themes' | 'tokens' | 'icons';

export type ProjectMetadata = {
  projectId: string;
  projectType: ProjectTypes;
};

export async function decodeProjectMetadataCollection(version: string): Promise<string> {
  // Get local variable collections
  const rawVariables = await figma.variables.getLocalVariableCollectionsAsync();
  const fileType = rawVariables[0].getSharedPluginData('recursica', 'file-type');

  figma.ui.postMessage({
    type: 'METADATA',
    payload: {
      projectType: fileType,
      pluginVersion: version,
    },
  });

  return fileType;
}
