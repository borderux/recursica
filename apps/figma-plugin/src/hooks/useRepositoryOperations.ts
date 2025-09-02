import { useCallback } from 'react';
import type { RecursicaConfiguration } from '@recursica/schemas';
import type {
  BaseRepository,
  Project,
  UserInfo,
  CommitAction,
  PullRequest,
} from '../services/repository';

interface AdapterFile {
  path: string;
  content: string;
}

function cleanPath(path: string) {
  return path.replace(/^\/+/, '');
}

export function useRepositoryOperations() {
  const fetchUserInfo = useCallback(
    async (repositoryInstance: BaseRepository | null): Promise<UserInfo | null> => {
      if (!repositoryInstance) return null;

      try {
        const data = await repositoryInstance.getUserInfo();
        return data;
      } catch (error) {
        console.error('Failed to fetch user information:', error);
        throw error;
      }
    },
    []
  );

  const getUserProjects = useCallback(
    async (repositoryInstance: BaseRepository | null): Promise<Project[]> => {
      if (!repositoryInstance) return [];

      try {
        const projects = await repositoryInstance.getUserProjects();
        return projects;
      } catch (error) {
        console.error('Failed to fetch user projects:', error);
        throw error;
      }
    },
    []
  );

  const createBranch = useCallback(
    async (
      repositoryInstance: BaseRepository | null,
      project: Project,
      username: string | undefined
    ): Promise<string> => {
      if (!repositoryInstance) {
        throw new Error('Repository instance not available');
      }

      try {
        const branch = await repositoryInstance.createBranch(
          project,
          `recursica-${username || 'user'}`,
          project.defaultBranch
        );
        return branch.name;
      } catch (error) {
        console.error('Failed to create branch:', error);
        throw error;
      }
    },
    []
  );

  const getConfig = useCallback(
    async (
      repositoryInstance: BaseRepository | null,
      selectedProject: Project | undefined,
      targetBranch: string
    ): Promise<{ config: RecursicaConfiguration; shouldCreateInit: boolean }> => {
      if (!repositoryInstance) throw new Error('Failed to get repository instance');
      if (!selectedProject) throw new Error('Failed to get selected project');

      try {
        const configFile = await repositoryInstance.getSingleFile<RecursicaConfiguration>(
          selectedProject,
          'recursica.json',
          targetBranch
        );
        if (configFile && configFile.project !== undefined) {
          return { config: configFile, shouldCreateInit: false };
        }
      } catch {
        // Config file doesn't exist or is invalid, we need to create it
      }

      // Create default config
      const defaultConfig = {
        project: {
          name: selectedProject.name,
          root: '',
        },
      };
      return { config: defaultConfig, shouldCreateInit: true };
    },
    []
  );

  const commitFiles = useCallback(
    async (
      repositoryInstance: BaseRepository | null,
      selectedProject: Project | undefined,
      targetBranch: string,
      adapterFiles: AdapterFile[],
      config: RecursicaConfiguration,
      fileLoadingData: {
        localBundledJson: string | null;
        localIconsJson: string | null;
        bundledFilename: string;
        iconsFilename: string;
      },
      shouldCreateInit: boolean
    ): Promise<void> => {
      if (!repositoryInstance || !selectedProject) {
        throw new Error('Repository instance or project not available');
      }

      let rootPath = '';
      if (typeof config.project === 'object' && config.project.root) {
        rootPath = config.project.root;
      }

      let variablesFilename = fileLoadingData.bundledFilename;
      if (rootPath) {
        variablesFilename = rootPath + '/' + variablesFilename;
      }

      let svgIconsFilename = fileLoadingData.iconsFilename;
      if (rootPath) {
        svgIconsFilename = rootPath + '/' + svgIconsFilename;
      }

      const actions: CommitAction[] = [];

      if (fileLoadingData.localBundledJson) {
        const exists = await repositoryInstance.fileExists(
          selectedProject,
          variablesFilename,
          targetBranch
        );
        actions.push({
          action: exists ? 'update' : 'create',
          file_path: variablesFilename,
          content: fileLoadingData.localBundledJson,
        });
      }

      if (shouldCreateInit) {
        actions.push({
          action: 'create',
          file_path: 'recursica.json',
          content: JSON.stringify(config, null, 2),
        });
      }

      if (fileLoadingData.localIconsJson) {
        const exists = await repositoryInstance.fileExists(
          selectedProject,
          svgIconsFilename,
          targetBranch
        );
        actions.push({
          action: exists ? 'update' : 'create',
          file_path: svgIconsFilename,
          content: fileLoadingData.localIconsJson,
        });
      }

      if (adapterFiles.length > 0) {
        for (const file of adapterFiles) {
          const exists = await repositoryInstance.fileExists(
            selectedProject,
            cleanPath(file.path),
            targetBranch
          );
          actions.push({
            action: exists ? 'update' : 'create',
            file_path: cleanPath(file.path),
            content: file.content,
          });
        }
      }

      await repositoryInstance.commitFiles(
        selectedProject,
        targetBranch,
        `Files committed by Recursica\n${variablesFilename}`,
        actions
      );
    },
    []
  );

  const getExistingPullRequest = useCallback(
    async (
      repositoryInstance: BaseRepository | null,
      selectedProject: Project | undefined,
      targetBranch: string
    ): Promise<PullRequest | null> => {
      if (!repositoryInstance || !selectedProject) return null;

      try {
        const pullRequest = await repositoryInstance.getExistingPullRequest(
          selectedProject,
          targetBranch,
          selectedProject.defaultBranch
        );
        return pullRequest;
      } catch (error) {
        console.error('Failed to get existing pull request:', error);
        return null;
      }
    },
    []
  );

  const createPullRequest = useCallback(
    async (
      repositoryInstance: BaseRepository | null,
      selectedProject: Project | undefined,
      targetBranch: string
    ): Promise<string | null> => {
      if (!repositoryInstance || !selectedProject) return null;

      try {
        const pullRequest = await repositoryInstance.createPullRequest(
          selectedProject,
          targetBranch,
          selectedProject.defaultBranch,
          'New recursica tokens release'
        );
        return pullRequest.url;
      } catch (error) {
        console.error('Failed to create pull request, trying to find existing one:', error);

        // Check if there's already an open PR/MR for this branch
        const hasOpenPR = await repositoryInstance.hasOpenPullRequest(
          selectedProject,
          targetBranch,
          selectedProject.defaultBranch
        );

        if (hasOpenPR) {
          console.log('Pull request already exists for this branch');
        }
        return null;
      }
    },
    []
  );

  return {
    fetchUserInfo,
    getUserProjects,
    createBranch,
    getConfig,
    commitFiles,
    getExistingPullRequest,
    createPullRequest,
  };
}
