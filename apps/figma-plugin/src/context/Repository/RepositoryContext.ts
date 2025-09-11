import { RepositoryError } from '../../hooks';
import { Project, PullRequest } from '../../services/repository/BaseRepository';
import { createContext } from 'react';

export type PublishStatus = 'to-publish' | 'publishing' | 'published';

interface Repository {
  /** User projects/repositories */
  userProjects: Project[];
  /** Selected project/repository id */
  selectedProjectId: string | null;
  /** Selected project/repository */
  selectedProject: Project | undefined;
  /** Update the selected project/repository id */
  updateSelectedProjectId: (selectedProjectId: string | null) => void;

  /** Existing pull request object */
  existingPR: PullRequest | null;

  /** Current publish status */
  publishStatus: PublishStatus;

  /** Bundled JSON data for variable counts */
  bundledJson: string | null;

  /** Icons JSON data for icon counts */
  iconsJson: string | null;

  /** Publish files to the repository */
  publishFiles: () => Promise<void>;

  /** Reset the repository */
  resetRepository: () => void;

  /** Current error state */
  error: RepositoryError | null;

  /** Clear the current error */
  clearError: () => void;

  /** Refetch user projects */
  refetchUserProjects: () => void;
}

export const RepositoryContext = createContext<Repository | null>(null);
