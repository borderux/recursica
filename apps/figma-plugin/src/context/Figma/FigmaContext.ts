import { createContext } from 'react';
import type { JsonContent } from '@repo/shared-interfaces';

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
    recursicaVariables?: JsonContent;
  };
}

export const FigmaContext = createContext<IFigmaContext | null>(null);
