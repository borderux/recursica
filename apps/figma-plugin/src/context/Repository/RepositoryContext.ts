import { Project } from '../../services/repository/BaseRepository';
import { createContext } from 'react';

interface Repository {
  /** Repository access token */
  accessToken: string;
  /** Update the repository access token */
  updateAccessToken: (accessToken: string) => void;

  /** Repository platform */
  platform: string;
  /** Update the repository platform */
  updatePlatform: (platform: string) => void;

  /** User projects/repositories */
  userProjects: Project[];
  /** Selected project/repository id */
  selectedProjectId: string;
  /** Update the selected project/repository id */
  updateSelectedProjectId: (selectedProjectId: string) => void;

  /** Pull request link */
  prLink: string;

  /** Token collection source */
  tokenCollection: string;
  /** Update token collection source */
  updateTokenCollection: (tokenCollection: string) => void;

  /** Themes collections sources */
  themesCollections: string[];
  /** Update themes collections sources */
  updateThemesCollections: (themesCollections: string[]) => void;

  /** Fetch figma variables */
  fetchSources: () => void;

  /** Run the adapter */
  runAdapter: () => void;
  /** Adapter response */
  adapterResponse: string;

  /** Publish files to the repository */
  publishFiles: () => void;
}

export const RepositoryContext = createContext<Repository | null>(null);
