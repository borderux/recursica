import { createContext } from 'react';
import type { RecursicaVariablesSchema, RecursicaIconsSchema } from '@recursica/schemas';

export interface CurrentRepositoryContext {
  platform: 'gitlab' | 'github';
  accessToken: string;
}

export interface IFigmaContext {
  repository?: CurrentRepositoryContext & {
    updateAccessToken: (platform: 'gitlab' | 'github', accessToken: string) => void;
  };
  recursicaVariables?: RecursicaVariablesSchema;
  svgIcons?: RecursicaIconsSchema;
  loading: boolean;
}

export const FigmaContext = createContext<IFigmaContext | null>(null);
