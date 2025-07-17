export class PluginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PluginError';
    figma.notify(message);
    figma.closePlugin();
  }
}

export type ProjectTypes = 'ui-kit' | 'themes' | 'tokens' | 'icons';

// Collection names to detect project types (case-insensitive)
const COLLECTION_TYPE_MAPPING = {
  'ui kit': 'ui-kit',
  tokens: 'tokens',
  themes: 'themes',
} as const;

export type ProjectMetadata = {
  projectId: string;
  theme?: string;
  projectType: ProjectTypes;
};

export async function decodeProjectMetadataCollection(version: string): Promise<ProjectMetadata> {
  const projectData: Partial<ProjectMetadata> = {};

  // Get local variable collections
  const rawVariables = await figma.variables.getLocalVariableCollectionsAsync();

  // Find collection that matches our type mapping
  const metadataVariables = rawVariables.find((vars) => {
    const collectionName = vars.name.toLowerCase();
    return Object.keys(COLLECTION_TYPE_MAPPING).some((key) =>
      collectionName.includes(key.toLowerCase())
    );
  });

  // If no matching collection found, default to icons
  if (!metadataVariables) {
    const defaultMetadata: ProjectMetadata = {
      projectId: 'default',
      projectType: 'icons',
    };

    figma.ui.postMessage({
      type: 'METADATA',
      payload: {
        projectId: defaultMetadata.projectId,
        projectType: defaultMetadata.projectType,
        pluginVersion: version,
      },
    });

    return defaultMetadata;
  }

  // Determine project type from collection name
  const collectionName = metadataVariables.name.toLowerCase();
  for (const [key, projectType] of Object.entries(COLLECTION_TYPE_MAPPING)) {
    if (collectionName.includes(key.toLowerCase())) {
      projectData.projectType = projectType;
      break;
    }
  }

  // Extract metadata from the collection
  for (const varId of metadataVariables.variableIds) {
    const varValue = await figma.variables.getVariableByIdAsync(varId);
    if (!varValue) continue;
    const { valuesByMode, name } = varValue;
    const realValue = valuesByMode[metadataVariables.defaultModeId];
    if (typeof realValue !== 'string') continue;
    if (name === 'project-id') projectData.projectId = realValue;
    if (name === 'theme') projectData.theme = realValue;
  }

  // Set default project ID if not found
  if (!projectData.projectId) {
    projectData.projectId = 'default';
  }

  // Validate required fields based on project type
  if (projectData.projectType === 'themes' && !projectData.theme) {
    throw new PluginError('Missing theme name in metadata');
  }

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
