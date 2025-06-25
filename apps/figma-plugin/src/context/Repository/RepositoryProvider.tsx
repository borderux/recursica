import { useEffect, useMemo, useState } from 'react';
import { RepositoryContext } from './RepositoryContext';
import { useFigma } from '../../hooks/useFigma';
import type { RecursicaConfiguration, RecursicaVariablesSchema } from '@recursica/schemas';
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

function cleanPath(path: string) {
  return path.replace(/^\/+/, '');
}

export enum FileStatus {
  Error,
  Pending,
  Loading,
  Done,
}

export interface Status {
  quantity: number;
  status: FileStatus;
}

export interface FilesStatus {
  icons: Status;
  uiKit: Status;
  tokens: Status;
  themes: Status;
  adapter: Status;
}

const INITIAL_FILES_STATUS: FilesStatus = {
  icons: { quantity: 0, status: FileStatus.Pending },
  uiKit: { quantity: 0, status: FileStatus.Pending },
  tokens: { quantity: 0, status: FileStatus.Pending },
  themes: { quantity: 0, status: FileStatus.Pending },
  adapter: { quantity: 0, status: FileStatus.Pending },
};

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedProjectId, setselectedProjectId] = useState<string | undefined>(undefined);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [prLink, setPrLink] = useState<string | null>(null);
  const [filesStatus, setFilesStatus] = useState<FilesStatus>(INITIAL_FILES_STATUS);

  const selectedProject = useMemo(() => {
    return userProjects.find((project) => project.id === selectedProjectId);
  }, [userProjects, selectedProjectId]);

  const {
    repository,
    recursicaVariables,
    svgIcons,
    updateRepository: { updateSelectedProject },
  } = useFigma();

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

  useEffect(() => {
    if (repository) {
      setselectedProjectId(repository.selectedProject);
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
    setPrLink(null);
    setFilesStatus(INITIAL_FILES_STATUS);

    const targetBranch = await createBranch(selectedProject);
    const config = await getConfig(targetBranch);
    const adapterFiles = await runAdapter(targetBranch, config);
    const commitResult = await commitFiles(targetBranch, adapterFiles, config);

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
    adapterFiles: AdapterFile[],
    config: RecursicaConfiguration
  ): Promise<boolean> => {
    if (!repositoryInstance || !selectedProjectId || !userInfo)
      throw new Error('Failed to commit files');

    try {
      if (!selectedProject) throw new Error('Failed to get selected project');
      let rootPath = '';
      if (typeof config.project === 'object' && config.project.root) {
        rootPath = config.project.root;
      }
      let variablesFilename = 'recursica-bundle.json';
      if (rootPath) {
        variablesFilename = rootPath + '/' + variablesFilename;
      }
      let svgIconsFilename = 'recursica-icons.json';
      if (rootPath) {
        svgIconsFilename = rootPath + '/' + svgIconsFilename;
      }

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

      setFilesStatus((prev) => ({
        ...prev,
        icons: { ...prev.icons, status: FileStatus.Done },
        uiKit: { ...prev.uiKit, status: FileStatus.Done },
        tokens: { ...prev.tokens, status: FileStatus.Done },
        themes: { ...prev.themes, status: FileStatus.Done },
      }));

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

    let rootPath = '';
    if (typeof config.project === 'object' && config.project.root) {
      rootPath = config.project.root;
    }

    let adapterPath = 'adapter.js';
    if (rootPath) {
      adapterPath = rootPath + '/' + adapterPath;
    }
    if (typeof config.project === 'object' && config.project.adapter) {
      adapterPath = config.project.adapter;
    }
    if (!selectedProject || !targetBranch) throw new Error('Failed to create branch');

    let adapterFile = null;
    try {
      adapterFile = await repositoryInstance.getSingleFile(
        selectedProject,
        adapterPath,
        targetBranch
      );
      setFilesStatus((prev) => ({
        ...prev,
        adapter: { quantity: 1, status: FileStatus.Loading },
      }));
    } catch (error) {
      setFilesStatus((prev) => ({
        ...prev,
        adapter: { quantity: 1, status: FileStatus.Error },
      }));
      console.error('Failed to get adapter file:', error);
      return [];
    }

    // Load local icons or search for them in the repository
    let iconsJson = svgIconsJson;
    if (!iconsJson) {
      let iconsFilename = 'recursica-icons.json';
      if (rootPath) {
        iconsFilename = rootPath + '/' + iconsFilename;
      }
      if (typeof config.icons === 'object' && config.icons.include) {
        const iconsFileRaw = await repositoryInstance.getSingleFile(
          selectedProject,
          iconsFilename,
          targetBranch
        );
        iconsJson = JSON.stringify(iconsFileRaw);
      }
    }
    // Update files status with the number of icons
    setFilesStatus((prev) => ({
      ...prev,
      icons: { quantity: Object.keys(iconsJson || {}).length, status: FileStatus.Loading },
    }));

    // Load local variables or search for them in the repository
    let bundledJson = variablesJson;
    if (!bundledJson) {
      let bundledFilename = 'recursica-bundle.json';
      if (rootPath) {
        bundledFilename = rootPath + '/' + bundledFilename;
      }
      const bundledFileRaw = await repositoryInstance.getSingleFile(
        selectedProject,
        bundledFilename,
        targetBranch
      );
      bundledJson = JSON.stringify(bundledFileRaw);
    }
    const parsedVariables: RecursicaVariablesSchema = JSON.parse(bundledJson || '{}');
    setFilesStatus((prev) => ({
      ...prev,
      uiKit: { quantity: Object.keys(parsedVariables.uiKit).length, status: FileStatus.Loading },
      tokens: { quantity: Object.keys(parsedVariables.tokens).length, status: FileStatus.Loading },
      themes: { quantity: Object.keys(parsedVariables.themes).length, status: FileStatus.Loading },
    }));

    return new Promise<AdapterFile[]>((resolve, reject) => {
      const worker = new Worker(
        URL.createObjectURL(new Blob([adapterFile], { type: 'text/javascript' }))
      );
      worker.postMessage({
        bundledJson,
        srcPath: rootPath + '/src',
        project: config.project,
        rootPath,
        iconsJson,
        overrides: config.overrides,
        iconsConfig: config.icons,
      });

      // Listener for messages coming FROM the worker
      worker.onmessage = (event) => {
        console.log('✅ Response received from worker:', event.data);

        setFilesStatus((prev) => ({
          ...prev,
          adapter: { ...prev.adapter, status: FileStatus.Done },
        }));
        const {
          recursicaTokens,
          vanillaExtractThemes,
          mantineTheme,
          uiKitObject,
          recursicaObject,
          colorsType,
          iconsObject,
          prettierignore,
        } = event.data;
        const newAdapterFiles: AdapterFile[] = [];

        if (recursicaTokens) {
          newAdapterFiles.push({
            path: recursicaTokens.path,
            content: recursicaTokens.content,
          });
        }

        if (prettierignore) {
          newAdapterFiles.push({
            path: prettierignore.path,
            content: prettierignore.content,
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

  const updateSelectedProjectId = (projectId: string) => {
    setselectedProjectId(projectId);
    updateSelectedProject(projectId);
  };

  const value = {
    selectedProjectId,
    updateSelectedProjectId,
    userProjects,
    prLink,
    publishFiles,
    filesStatus,
  };

  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>;
}
