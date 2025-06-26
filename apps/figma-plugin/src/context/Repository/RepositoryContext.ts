import { Project } from '../../services/repository/BaseRepository';
import { createContext } from 'react';
import { FilesStatus, ValidationStatus } from './RepositoryProvider';

interface Repository {
  /** User projects/repositories */
  userProjects: Project[];
  /** Selected project/repository id */
  selectedProjectId: string | undefined;
  /** Update the selected project/repository id */
  updateSelectedProjectId: (selectedProjectId: string) => void;

  /** Pull request link */
  prLink: string | null;

  /** Files status */
  filesStatus: FilesStatus;

  /** Publish files to the repository */
  publishFiles: () => void;

  /** Validate the project (check if the project has a valid config file) */
  validationStatus: ValidationStatus;

  /** Initialize the repository */
  initializeRepo: () => void;

  /** Reset the repository */
  resetRepository: () => Promise<boolean>;
}

export const RepositoryContext = createContext<Repository | null>(null);
