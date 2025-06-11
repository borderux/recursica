import { createContext } from 'react';
import { VariableJSONCollection } from '@/plugin/types';

export interface CurrentRepositoryContext {
  platform: 'gitlab' | 'github';
  accessToken: string;
}

export interface IFigmaContext {
  repository?: CurrentRepositoryContext & {
    updateAccessToken: (platform: 'gitlab' | 'github', accessToken: string) => void;
  };
  libraries: {
    availableLibraries?: Record<string, { value: string; name: string }[]>;
    recursicaVariables?: VariableJSONCollection;
  };
}

export const FigmaContext = createContext<IFigmaContext | null>(null);
