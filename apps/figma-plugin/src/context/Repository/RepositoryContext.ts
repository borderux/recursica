import { FilesStatus, RepositoryError, ValidationStatus } from '../../hooks';
import { Project } from '../../services/repository/BaseRepository';
import { createContext } from 'react';

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
  publishFiles: () => Promise<void>;

  /** Validate the project (check if the project has a valid config file) */
  validationStatus: ValidationStatus;

  /** Initialize the repository */
  initializeRepo: () => void;

  /** Reset the repository */
  resetRepository: () => Promise<boolean>;

  /** Current error state */
  error: RepositoryError | null;

  /** Clear the current error */
  clearError: () => void;
}

export const RepositoryContext = createContext<Repository | null>(null);
