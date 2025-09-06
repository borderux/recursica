import { useState, useCallback, useEffect } from 'react';
import type { Project, UserInfo, BaseRepository } from '../services/repository';
import { useRepositoryError } from './useRepositoryError';
import { useRepositoryOperations } from './useRepositoryOperations';

export function useUserProjects(
  userInfo: UserInfo | null,
  repositoryInstance: BaseRepository | null
) {
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const { getUserProjects: getUserProjectsOp } = useRepositoryOperations();
  const { error, setRepositoryError, clearError, isExpectedError, getErrorMessage } =
    useRepositoryError();

  const fetchUserProjects = useCallback(
    async (userInfo: UserInfo | null, repositoryInstance: BaseRepository | null) => {
      if (!repositoryInstance || !userInfo) return;

      try {
        const projects = await getUserProjectsOp(repositoryInstance);
        setUserProjects(projects);
        clearError();
      } catch (error) {
        if (!isExpectedError(error)) {
          setRepositoryError(
            'Failed to fetch user projects',
            getErrorMessage(error),
            'PROJECTS_FETCH_ERROR'
          );
        }
      }
    },
    [getUserProjectsOp, setRepositoryError, clearError, isExpectedError, getErrorMessage]
  );

  // Auto-fetch when userInfo and repositoryInstance are available
  useEffect(() => {
    if (userInfo && repositoryInstance) {
      fetchUserProjects(userInfo, repositoryInstance);
    }
  }, [userInfo, repositoryInstance, fetchUserProjects]);

  return {
    userProjects,
    setUserProjects,
    fetchUserProjects,
    error,
  };
}
