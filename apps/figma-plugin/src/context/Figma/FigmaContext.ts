import { createContext } from 'react';
import type { JsonContent } from '@recursica/common';

export interface CurrentRepositoryContext {
  platform: 'gitlab' | 'github';
  accessToken: string;
}

export interface IFigmaContext {
  repository?: CurrentRepositoryContext & {
    updateAccessToken: (platform: 'gitlab' | 'github', accessToken: string) => void;
  };
  recursicaVariables?: JsonContent;
  svgIcons?: Record<string, string>;
  loading: boolean;
}

export const FigmaContext = createContext<IFigmaContext | null>(null);
