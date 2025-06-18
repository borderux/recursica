export interface FileMetadata {
  projectId: string;
  projectType: string;
  version: string;
  theme: string | undefined;
}

export type GenericVariables = Record<string, object>;

export interface LibraryCollection {
  value: string;
  name: string;
}

export interface ProcessedLibrary {
  variables: GenericVariables;
  metadata: GenericVariables;
  filetype: string | undefined;
}
