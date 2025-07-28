import { useEffect, useCallback } from 'react';
import type { RecursicaVariablesSchema } from '@recursica/schemas';
import type { BaseRepository, Project } from '../services/repository';

export function useRemoteFiles(
  repositoryInstance: BaseRepository | null,
  selectedProject: Project | undefined,
  setRemoteVariablesJson: (data: string) => void,
  setRemoteIconsJson: (data: string) => void
) {
  const memoizedSetRemoteVariablesJson = useCallback(setRemoteVariablesJson, [
    setRemoteVariablesJson,
  ]);
  const memoizedSetRemoteIconsJson = useCallback(setRemoteIconsJson, [setRemoteIconsJson]);

  useEffect(() => {
    const fetchRemoteFiles = async () => {
      if (!repositoryInstance || !selectedProject) return;

      try {
        // Fetch remote icons
        const iconsFilename = 'recursica-icons.json';
        try {
          const iconsFileRaw = await repositoryInstance.getSingleFile(
            selectedProject,
            iconsFilename,
            selectedProject.defaultBranch
          );
          const remoteIconsJson = JSON.stringify(iconsFileRaw);
          memoizedSetRemoteIconsJson(remoteIconsJson);
        } catch (error) {
          if (error instanceof Error && error.message.includes('404')) {
            memoizedSetRemoteIconsJson('{}');
          } else {
            console.error('Error fetching remote icons:', error);
          }
        }

        // Fetch remote variables
        const bundledFilename = 'recursica-bundle.json';
        try {
          const bundledFileRaw = await repositoryInstance.getSingleFile<RecursicaVariablesSchema>(
            selectedProject,
            bundledFilename,
            selectedProject.defaultBranch
          );
          const remoteBundledJson = JSON.stringify(bundledFileRaw);
          memoizedSetRemoteVariablesJson(remoteBundledJson);
        } catch (error) {
          if (error instanceof Error && error.message.includes('404')) {
            memoizedSetRemoteVariablesJson('{}');
          } else {
            console.error('Error fetching remote variables:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching remote files:', error);
      }
    };

    fetchRemoteFiles();
  }, [
    repositoryInstance,
    selectedProject,
    memoizedSetRemoteVariablesJson,
    memoizedSetRemoteIconsJson,
  ]);
}
