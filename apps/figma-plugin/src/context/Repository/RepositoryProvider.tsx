import { useEffect, useMemo, useRef, useState } from 'react';
import { RepositoryContext } from './RepositoryContext';
import { useFigma } from '../../hooks/useFigma';
import {
  BaseRepository,
  GitLabRepository,
  GitHubRepository,
  type UserInfo,
  type Project,
  type CommitAction,
} from '../../services/repository';

interface AdapterFile {
  path: string;
  content: string;
}

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = useState('');
  const [platform, setPlatform] = useState('');
  const [selectedProjectId, setselectedProjectId] = useState('');
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [filesPublished, setFilesPublished] = useState<boolean>(false);
  const [prLink, setPrLink] = useState<string>('');

  const selectedTargetBranch = useRef<string | undefined>(undefined);

  const selectedProject = useMemo(() => {
    return userProjects.find((project) => project.id === selectedProjectId);
  }, [userProjects, selectedProjectId]);

  const { repository, recursicaVariables } = useFigma();

  const variablesJson = useMemo(() => {
    if (recursicaVariables) {
      return JSON.stringify(recursicaVariables, null, 2);
    }
    return null;
  }, [recursicaVariables]);

  // Create repository instance based on platform
  const repositoryInstance = useMemo((): BaseRepository | null => {
    if (!accessToken || !platform) return null;

    switch (platform.toLowerCase()) {
      case 'gitlab':
        return new GitLabRepository(accessToken);
      case 'github':
        return new GitHubRepository(accessToken);
      default:
        return null;
    }
  }, [accessToken, platform]);

  useEffect(() => {
    if (repository) {
      setAccessToken(repository.accessToken);
      setPlatform(repository.platform);
    }
  }, [repository]);

  useEffect(() => {
    if (repositoryInstance) {
      fetchUserInfo();
    }
  }, [repositoryInstance]);

  useEffect(() => {
    if (userInfo && repositoryInstance) {
      getUserProjects();
    }
  }, [userInfo, repositoryInstance]);

  const fetchUserInfo = async () => {
    if (!repositoryInstance) return;

    try {
      const data = await repositoryInstance.getUserInfo();
      setUserInfo(data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const getUserProjects = async () => {
    if (!repositoryInstance) return;

    try {
      const projects = await repositoryInstance.getUserProjects();
      setUserProjects(projects);
    } catch (error) {
      console.error('Failed to fetch user projects:', error);
    }
  };

  const publishFiles = async (): Promise<boolean> => {
    if (!repositoryInstance || !selectedProjectId || !userInfo || !variablesJson) return false;

    const adapterFiles = await runAdapter();

    try {
      if (!selectedTargetBranch.current) throw new Error('Failed to create branch');
      const targetBranch = selectedTargetBranch.current;

      if (!selectedProject) throw new Error('Failed to get selected project');
      const variablesFilename = 'recursica-bundle.json';

      const exists = await repositoryInstance.fileExists(
        selectedProject,
        variablesFilename,
        targetBranch
      );
      const actions: CommitAction[] = [
        {
          action: exists ? 'update' : 'create',
          file_path: variablesFilename,
          content: variablesJson,
        },
      ];

      for (const file of adapterFiles) {
        if (!selectedProject) return false;
        const exists = await repositoryInstance.fileExists(
          selectedProject,
          file.path,
          targetBranch
        );
        actions.push({
          action: exists ? 'update' : 'create',
          file_path: file.path,
          content: file.content,
        });
      }

      await repositoryInstance.commitFiles(
        selectedProject,
        targetBranch,
        `Files committed by Recursica\n${variablesFilename}`,
        actions
      );

      try {
        const pullRequest = await repositoryInstance.createPullRequest(
          selectedProject,
          targetBranch,
          selectedProject.defaultBranch,
          'New recursica tokens release'
        );
        setPrLink(pullRequest.url);
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
      }

      setFilesPublished(true);
      return true;
    } catch (error) {
      console.error('Failed to publish files:', error);
      return false;
    }
  };

  const createBranch = async (project: Project) => {
    if (!repositoryInstance) throw new Error('Failed to create branch');
    const branch = await repositoryInstance.createBranch(
      project,
      `recursica-${userInfo?.username}-${Date.now()}`,
      project.defaultBranch
    );
    selectedTargetBranch.current = branch.name;
    return branch.name;
  };

  const runAdapter = async (): Promise<AdapterFile[]> => {
    if (!repositoryInstance || !selectedProjectId || !selectedProject)
      throw new Error('Failed to run adapter');

    const targetBranch = await createBranch(selectedProject);
    const adapterFilename = 'recursica/adapter.js';
    if (!selectedProject || !targetBranch) throw new Error('Failed to create branch');

    const fileContent = await repositoryInstance.getSingleFile(
      selectedProject,
      adapterFilename,
      targetBranch
    );

    const configFile = await repositoryInstance.getSingleFile(
      selectedProject,
      'recursica.json',
      targetBranch
    );

    return new Promise<AdapterFile[]>((resolve, reject) => {
      const config = JSON.parse(configFile.content);
      const worker = new Worker(
        URL.createObjectURL(new Blob([fileContent.content], { type: 'text/javascript' }))
      );
      worker.postMessage({
        bundledJson: variablesJson,
        srcPath: 'src',
        project: config.project,
        iconsJson: '',
        overrides: config.overrides,
        iconsConfig: config.iconsConfig,
      });

      // Listener for messages coming FROM the worker
      worker.onmessage = (event) => {
        console.log('✅ Response received from worker:', event.data);
        const {
          recursicaTokens,
          vanillaExtractThemes,
          mantineTheme,
          uiKitObject,
          recursicaObject,
          colorsType,
          iconsObject,
        } = event.data;
        const newAdapterFiles: AdapterFile[] = [];

        if (recursicaTokens) {
          newAdapterFiles.push({
            path: recursicaTokens.path,
            content: recursicaTokens.content,
          });
        }

        const {
          availableThemes,
          themeContract,
          themesFileContent,
          vanillaExtractThemes: subThemes,
        } = vanillaExtractThemes;
        if (availableThemes) {
          newAdapterFiles.push({
            path: availableThemes.path,
            content: availableThemes.content,
          });
        }
        if (themeContract) {
          newAdapterFiles.push({
            path: themeContract.path,
            content: themeContract.content,
          });
        }
        if (themesFileContent) {
          newAdapterFiles.push({
            path: themesFileContent.path,
            content: themesFileContent.content,
          });
        }
        for (const theme of subThemes) {
          newAdapterFiles.push({
            path: theme.path,
            content: theme.content,
          });
        }

        if (mantineTheme.mantineTheme) {
          newAdapterFiles.push({
            path: mantineTheme.mantineTheme.path,
            content: mantineTheme.mantineTheme.content,
          });
        }
        if (mantineTheme.postCss) {
          newAdapterFiles.push({
            path: mantineTheme.postCss.path,
            content: mantineTheme.postCss.content,
          });
        }

        if (uiKitObject) {
          newAdapterFiles.push({
            path: uiKitObject.path,
            content: uiKitObject.content,
          });
        }

        if (recursicaObject) {
          newAdapterFiles.push({
            path: recursicaObject.path,
            content: recursicaObject.content,
          });
        }

        if (colorsType) {
          newAdapterFiles.push({
            path: colorsType.path,
            content: colorsType.content,
          });
        }

        if (iconsObject) {
          newAdapterFiles.push({
            path: iconsObject.iconExports.path,
            content: iconsObject.iconExports.content,
          });
          newAdapterFiles.push({
            path: iconsObject.iconResourceMap.path,
            content: iconsObject.iconResourceMap.content,
          });
          for (const icon of iconsObject.exportedIcons) {
            newAdapterFiles.push({
              path: icon.path,
              content: icon.content,
            });
          }
        }
        resolve(newAdapterFiles);
      };

      // Listener for any errors that might occur inside the worker
      worker.onerror = (error) => {
        console.error('❌ Error in worker:', error);
        reject(error);
      };
    });
  };

  const value = {
    accessToken,
    platform,
    selectedProject,
    selectedProjectId,
    updateAccessToken: setAccessToken,
    updatePlatform: setPlatform,
    updateSelectedProjectId: setselectedProjectId,
    userProjects,
    filesPublished,
    prLink,
    publishFiles,
  };

  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>;
}
