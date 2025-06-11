export class PluginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PluginError';
    figma.notify(message);
    figma.closePlugin();
  }
}

const projectTypes = <const>['ui-kit', 'themes', 'tokens', 'icons'];
export type ProjectTypes = (typeof projectTypes)[number];
export const PROJECT_METADATA_VARIABLE_COLLECTION = 'ID variables';

function isProjectType(value: string): value is ProjectTypes {
  return projectTypes.includes(value as ProjectTypes);
}

export type ProjectMetadata = {
  projectId: string;
  theme?: string;
  projectType: ProjectTypes;
};

export async function decodeProjectMetadataCollection(version: string): Promise<ProjectMetadata> {
  const projectData: Partial<ProjectMetadata> = {};
  // Get local variable collections
  const rawVariables = await figma.variables.getLocalVariableCollectionsAsync();
  const metadataVariables = rawVariables.find(
    (vars) => vars.name.toLowerCase() === PROJECT_METADATA_VARIABLE_COLLECTION.toLowerCase()
  );
  if (!metadataVariables)
    throw new PluginError('Cannot execute the plugin because the metadata collection is missing.');

  for (const varId of metadataVariables.variableIds) {
    const varValue = await figma.variables.getVariableByIdAsync(varId);
    if (!varValue) continue;
    const { valuesByMode, name } = varValue;
    const realValue = valuesByMode[metadataVariables.defaultModeId];
    if (typeof realValue !== 'string') continue;
    if (name === 'project-id') projectData.projectId = realValue;
    if (name === 'theme') projectData.theme = realValue;
    if (name === 'project-type') {
      if (!isProjectType(realValue))
        throw new PluginError(`Project type invalid, must be ${projectTypes.join(',')}.`);

      projectData.projectType = realValue as ProjectTypes;
    }
  }
  if (!projectData.projectId) throw new PluginError('Missing project id in metadata');
  if (projectData.projectType === 'themes' && !projectData.theme)
    throw new PluginError('Missing theme name in metadata');
  if (!projectData.projectType) throw new PluginError('Missing project type in metadata');

  figma.ui.postMessage({
    type: 'METADATA',
    payload: {
      projectId: projectData.projectId,
      projectType: projectData.projectType,
      theme: projectData.theme,
      pluginVersion: version,
    },
  });
  return projectData as ProjectMetadata;
}
