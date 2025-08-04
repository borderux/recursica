import { useMemo } from 'react';
import { useFigma } from './useFigma';
import { BaseRepository, GitLabRepository, GitHubRepository } from '../services/repository';

export function useRepositoryInstance() {
  const { repository } = useFigma();

  // Create repository instance based on platform
  const repositoryInstance = useMemo((): BaseRepository | null => {
    if (!repository || !repository.accessToken || !repository.platform) return null;
    const { accessToken, platform } = repository;

    switch (platform.toLowerCase()) {
      case 'gitlab':
        return new GitLabRepository(accessToken);
      case 'github':
        return new GitHubRepository(accessToken);
      default:
        return null;
    }
  }, [repository]);

  return {
    repositoryInstance,
    repository,
  };
}
