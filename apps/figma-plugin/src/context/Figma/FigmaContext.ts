import { createContext } from 'react';
import type { RecursicaVariablesSchema, RecursicaIconsSchema } from '@recursica/schemas';
import { FileTypes } from '../../plugin/filetype';

export interface CurrentRepositoryContext {
  platform: 'gitlab' | 'github' | undefined;
  accessToken: string | undefined;
  selectedProject: string | null;
  agreedPublishChanges: boolean;
}

export interface IFigmaContext {
  repository?: CurrentRepositoryContext;
  updateRepository: {
    updatePlatform: (platform: 'gitlab' | 'github') => void;
    updateAccessToken: (accessToken: string) => void;
    updateSelectedProject: (selectedProject: string | null) => void;
  };
  recursicaVariables?: RecursicaVariablesSchema;
  svgIcons?: RecursicaIconsSchema;
  updateAgreedPublishChanges: (agreedPublishChanges: boolean) => void;
  loading: boolean;
  userId: string | undefined;
  syncStatus: {
    variablesSynced: boolean;
    metadataGenerated: boolean;
  };
  filetype: FileTypes | undefined;
  error: string | undefined;
  pluginVersion: string | undefined;
}

export const FigmaContext = createContext<IFigmaContext | null>(null);
