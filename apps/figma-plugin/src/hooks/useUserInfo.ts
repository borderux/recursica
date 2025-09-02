import { useState, useCallback, useEffect } from 'react';
import type { UserInfo, BaseRepository } from '../services/repository';
import { useRepositoryError } from './useRepositoryError';
import { useRepositoryOperations } from './useRepositoryOperations';

export function useUserInfo(repositoryInstance: BaseRepository | null) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { fetchUserInfo: fetchUserInfoOp } = useRepositoryOperations();
  const { error, setRepositoryError, clearError, isExpectedError, getErrorMessage } =
    useRepositoryError();

  const fetchUserInfo = useCallback(
    async (repositoryInstance: BaseRepository | null) => {
      if (!repositoryInstance) return;

      try {
        const userData = await fetchUserInfoOp(repositoryInstance);
        setUserInfo(userData);
        clearError();
      } catch (error) {
        if (!isExpectedError(error)) {
          setRepositoryError(
            'Failed to fetch user information',
            getErrorMessage(error),
            'USER_INFO_FETCH_ERROR'
          );
        }
      }
    },
    [fetchUserInfoOp, setRepositoryError, clearError, isExpectedError, getErrorMessage]
  );

  // Auto-fetch when repositoryInstance changes
  useEffect(() => {
    if (repositoryInstance) {
      fetchUserInfo(repositoryInstance);
    }
  }, [repositoryInstance, fetchUserInfo]);

  return {
    userInfo,
    setUserInfo,
    fetchUserInfo,
    error,
  };
}
