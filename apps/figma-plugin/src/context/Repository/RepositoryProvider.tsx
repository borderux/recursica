import { useEffect, useMemo, useState } from 'react';
import { RepositoryContext } from './RepositoryContext';
import { useFigma } from '../../hooks/useFigma';
import type { RecursicaConfiguration } from '@recursica/schemas';
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

  const selectedProject = useMemo(() => {
    return userProjects.find((project) => project.id === selectedProjectId);
  }, [userProjects, selectedProjectId]);

  const { repository, recursicaVariables, svgIcons } = useFigma();

  const variablesJson = useMemo(() => {
    if (recursicaVariables) {
      return JSON.stringify(recursicaVariables, null, 2);
    }
    return null;
  }, [recursicaVariables]);

  const svgIconsJson = useMemo(() => {
    if (svgIcons) {
      return JSON.stringify(svgIcons, null, 2);
    }
    return null;
  }, [svgIcons]);

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
    if (!selectedProject) throw new Error('Failed to get selected project');
    if (!repositoryInstance) throw new Error('Failed to get repository instance');

    const targetBranch = await createBranch(selectedProject);
    const config = await getConfig(targetBranch);
    const adapterFiles = await runAdapter(targetBranch, config);
    const commitResult = await commitFiles(targetBranch, adapterFiles);

    return commitResult;
  };

  const getConfig = async (targetBranch: string): Promise<RecursicaConfiguration> => {
    if (!repositoryInstance) throw new Error('Failed to get repository instance');
    if (!selectedProject) throw new Error('Failed to get selected project');
    const configFile = await repositoryInstance.getSingleFile<RecursicaConfiguration>(
      selectedProject,
      'recursica.json',
      targetBranch
    );
    if (!configFile) throw new Error('Failed to get config file');
    return configFile;
  };

  const commitFiles = async (
    targetBranch: string,
    adapterFiles: AdapterFile[]
  ): Promise<boolean> => {
    if (!repositoryInstance || !selectedProjectId || !userInfo)
      throw new Error('Failed to commit files');

    try {
      if (!selectedProject) throw new Error('Failed to get selected project');
      const variablesFilename = 'recursica-bundle.json';
      const svgIconsFilename = 'recursica-icons.json';

      const actions: CommitAction[] = [];
      if (variablesJson) {
        const exists = await repositoryInstance.fileExists(
          selectedProject,
          variablesFilename,
          targetBranch
        );
        actions.push({
          action: exists ? 'update' : 'create',
          file_path: variablesFilename,
          content: variablesJson,
        });
      }

      if (svgIconsJson) {
        const exists = await repositoryInstance.fileExists(
          selectedProject,
          svgIconsFilename,
          targetBranch
        );
        actions.push({
          action: exists ? 'update' : 'create',
          file_path: svgIconsFilename,
          content: svgIconsJson,
        });
      }

      if (adapterFiles.length > 0) {
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
    return branch.name;
  };

  const runAdapter = async (
    targetBranch: string,
    config: RecursicaConfiguration
  ): Promise<AdapterFile[]> => {
    if (!repositoryInstance || !selectedProjectId || !selectedProject)
      throw new Error('Failed to run adapter');

    let adapterPath = 'adapter.js';
    if (typeof config.project === 'object' && config.project.adapter) {
      adapterPath = config.project.adapter;
    }
    if (!selectedProject || !targetBranch) throw new Error('Failed to create branch');

    const adapterFile = await repositoryInstance.getSingleFile(
      selectedProject,
      adapterPath,
      targetBranch
    );
    if (!adapterFile) return [];

    let iconsJson = svgIconsJson;
    if (!iconsJson) {
      const iconsFileRaw = await repositoryInstance.getSingleFile(
        selectedProject,
        'recursica-icons.json',
        targetBranch
      );
      iconsJson = JSON.stringify(iconsFileRaw);
    }

    let bundledJson = variablesJson;
    if (!bundledJson) {
      const bundledFileRaw = await repositoryInstance.getSingleFile(
        selectedProject,
        'recursica-bundle.json',
        targetBranch
      );
      bundledJson = JSON.stringify(bundledFileRaw);
    }
    return new Promise<AdapterFile[]>((resolve, reject) => {
      const worker = new Worker(
        URL.createObjectURL(new Blob([adapterFile], { type: 'text/javascript' }))
      );
      let rootPath = '';
      if (typeof config.project === 'object' && config.project.root) {
        rootPath = config.project.root;
      }
      worker.postMessage({
        bundledJson,
        srcPath: 'src',
        project: config.project,
        rootPath,
        iconsJson,
        overrides: config.overrides,
        iconsConfig: config.icons,
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
