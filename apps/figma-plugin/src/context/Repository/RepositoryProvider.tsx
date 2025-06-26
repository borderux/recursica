import { useEffect, useMemo, useRef, useState } from 'react';
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

export enum ValidationStatus {
  Valid,
  Invalid,
  NotSelected,
}

export interface RepositoryError {
  message: string;
  details?: string;
  code?: string;
  timestamp: number;
}

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedProjectId, setselectedProjectId] = useState<string | undefined>(undefined);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [prLink, setPrLink] = useState<string | null>(null);
  const [filesStatus, setFilesStatus] = useState<FilesStatus>(INITIAL_FILES_STATUS);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>(
    ValidationStatus.NotSelected
  );
  const [error, setError] = useState<RepositoryError | null>(null);
  const initConfig = useRef<boolean>(false);

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

  // Error handling helper functions
  const setRepositoryError = (message: string, details?: string, code?: string) => {
    const error: RepositoryError = {
      message,
      details,
      code,
      timestamp: Date.now(),
    };
    setError(error);
    console.error('Repository Error:', error);
  };

  const clearError = () => {
    setError(null);
  };

  const isExpectedError = (error: unknown): boolean => {
    if (error instanceof Error) {
      // 404 errors are expected for missing files
      if (error.message.includes('404')) return true;
      // Network errors that might be temporary
      if (error.message.includes('Network Error') || error.message.includes('fetch')) return true;
    }

    // Check for axios errors
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number } };
      const status = axiosError.response.status;
      // 404 errors are expected for missing files
      if (status === 404) return true;
      // 409 conflicts are expected for existing PRs
      if (status === 409) return true;
      // 422 validation errors might be expected in some cases
      if (status === 422) return true;
    }

    return false;
  };

  const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response: {
          status: number;
          data?: { message?: string };
        };
      };
      const status = axiosError.response.status;
      switch (status) {
        case 401:
          return 'Authentication failed. Please check your access token.';
        case 403:
          return 'Access denied. You may not have permission to access this repository.';
        case 404:
          return 'Resource not found. The repository or file may not exist.';
        case 429:
          return 'Rate limit exceeded. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return axiosError.response.data?.message || `HTTP ${status} error occurred.`;
      }
    }

    if (error instanceof Error) {
      if (error.message.includes('Network Error')) {
        return 'Network connection error. Please check your internet connection.';
      }
      if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      }
      return error.message;
    }

    return 'An unexpected error occurred.';
  };

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

  // Auto-select project if there's only one available and no project is currently selected
  useEffect(() => {
    if (userProjects.length === 1 && !selectedProjectId) {
      updateSelectedProjectId(userProjects[0].id);
    }
  }, [userProjects, selectedProjectId]);

  const fetchUserInfo = async () => {
    if (!repositoryInstance) return;

    try {
      const data = await repositoryInstance.getUserInfo();
      setUserInfo(data);
      clearError(); // Clear any previous errors on success
    } catch (error) {
      if (!isExpectedError(error)) {
        setRepositoryError(
          'Failed to fetch user information',
          getErrorMessage(error),
          'USER_INFO_FETCH_ERROR'
        );
      }
    }
  };

  const getUserProjects = async () => {
    if (!repositoryInstance) return;
    try {
      const projects = await repositoryInstance.getUserProjects();
      setUserProjects(projects);
      clearError(); // Clear any previous errors on success
    } catch (error) {
      if (!isExpectedError(error)) {
        setRepositoryError(
          'Failed to fetch user projects',
          getErrorMessage(error),
          'PROJECTS_FETCH_ERROR'
        );
      }
    }
  };

  useEffect(() => {
    if (selectedProject) {
      validateProject();
    }
  }, [selectedProject]);

  const validateProject = async (): Promise<boolean> => {
    if (!repositoryInstance) return false;
    try {
      const config = await getConfig(selectedProject?.defaultBranch || '');
      setValidationStatus(
        config.project !== undefined ? ValidationStatus.Valid : ValidationStatus.Invalid
      );
      return config.project !== undefined;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        console.error('Project is not valid');
        setValidationStatus(ValidationStatus.Invalid);
        return false;
      }
      throw error;
    }
  };

  const initializeRepo = async () => {
    if (!repositoryInstance) return;
    initConfig.current = true;
  };

  const publishFiles = async (): Promise<void> => {
    clearError(); // Clear any previous errors

    if (!selectedProject) {
      setRepositoryError(
        'No project selected',
        'Please select a project before publishing files',
        'NO_PROJECT_SELECTED'
      );
      return;
    }

    if (!repositoryInstance) {
      setRepositoryError(
        'Repository not initialized',
        'Please check your repository connection',
        'REPOSITORY_NOT_INITIALIZED'
      );
      return;
    }

    if (!(variablesJson || svgIconsJson)) {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'GET_VARIABLES',
          },
          pluginId: '*',
        },
        '*'
      );
    } else {
      updateFilesStatus(variablesJson, svgIconsJson);
      try {
        await handlePublishFiles();
      } catch (error) {
        if (!isExpectedError(error)) {
          setRepositoryError(
            'Failed to publish files',
            getErrorMessage(error),
            'PUBLISH_FILES_ERROR'
          );
        }
      }
    }
  };

  const updateFilesStatus = (vars: string | null, icons: string | null) => {
    if (vars) {
      const bundledFileRaw = JSON.parse(vars);
      setFilesStatus((prev) => ({
        ...prev,
        tokens: {
          quantity: Object.keys(bundledFileRaw.tokens).length,
          status: FileStatus.Loading,
        },
        themes: {
          quantity: Object.keys(bundledFileRaw.themes).length,
          status: FileStatus.Loading,
        },
        uiKit: {
          quantity: Object.keys(bundledFileRaw.uiKit).length,
          status: FileStatus.Loading,
        },
      }));
    }
    if (icons) {
      const iconsFileRaw = JSON.parse(icons);
      setFilesStatus((prev) => ({
        ...prev,
        icons: { quantity: Object.keys(iconsFileRaw).length, status: FileStatus.Loading },
      }));
    }
  };

  useEffect(() => {
    if (variablesJson || svgIconsJson) {
      updateFilesStatus(variablesJson, svgIconsJson);
      handlePublishFiles();
    }
  }, [variablesJson, svgIconsJson]);

  const handlePublishFiles = async (): Promise<void> => {
    if (!selectedProject) {
      throw new Error('Selected project is not available');
    }

    const targetBranch = await createBranch(selectedProject);
    const config = await getConfig(targetBranch);
    const adapterFiles = await runAdapter(targetBranch, config);
    await commitFiles(targetBranch, adapterFiles, config);
  };

  const getConfig = async (targetBranch: string): Promise<RecursicaConfiguration> => {
    if (!repositoryInstance) throw new Error('Failed to get repository instance');
    if (!selectedProject) throw new Error('Failed to get selected project');
    if (initConfig.current) {
      return {
        project: {
          name: selectedProject.name,
          root: '',
        },
      };
    }
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
  ): Promise<void> => {
    if (!repositoryInstance || !selectedProjectId || !userInfo) {
      throw new Error('Repository instance, project ID, or user info not available');
    }

    if (!selectedProject) {
      throw new Error('Selected project is not available');
    }

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

    if (initConfig.current) {
      actions.push({
        action: 'create',
        file_path: 'recursica.json',
        content: JSON.stringify(config, null, 2),
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
        if (!selectedProject) {
          throw new Error('Selected project is not available during file processing');
        }
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
      if (error instanceof Error && error.message.includes('404')) {
        console.error('Adapter file not found');
        return [];
      }
      throw error;
    }

    // Load local icons or search for them in the repository
    let iconsJson = svgIconsJson;
    if (!iconsJson) {
      let iconsFilename = 'recursica-icons.json';
      if (rootPath) {
        iconsFilename = rootPath + '/' + iconsFilename;
      }
      if (typeof config.icons === 'object' && config.icons.include) {
        try {
          const iconsFileRaw = await repositoryInstance.getSingleFile(
            selectedProject,
            iconsFilename,
            targetBranch
          );
          iconsJson = JSON.stringify(iconsFileRaw);
          // Update files status with the number of icons
          setFilesStatus((prev) => ({
            ...prev,
            icons: { quantity: Object.keys(iconsFileRaw).length, status: FileStatus.Loading },
          }));
        } catch (error) {
          if (error instanceof Error && error.message.includes('404')) {
            iconsJson = '{}';
          }
          throw error;
        }
      }
    }

    // Load local variables or search for them in the repository
    let bundledJson = variablesJson;
    if (!bundledJson) {
      let bundledFilename = 'recursica-bundle.json';
      if (rootPath) {
        bundledFilename = rootPath + '/' + bundledFilename;
      }
      try {
        const bundledFileRaw = await repositoryInstance.getSingleFile<RecursicaVariablesSchema>(
          selectedProject,
          bundledFilename,
          targetBranch
        );
        bundledJson = JSON.stringify(bundledFileRaw);
        setFilesStatus((prev) => ({
          ...prev,
          tokens: {
            quantity: Object.keys(bundledFileRaw.tokens).length,
            status: FileStatus.Loading,
          },
          themes: {
            quantity: Object.keys(bundledFileRaw.themes).length,
            status: FileStatus.Loading,
          },
          uiKit: {
            quantity: Object.keys(bundledFileRaw.uiKit).length,
            status: FileStatus.Loading,
          },
        }));
      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
          bundledJson = '{}';
        }
        throw error;
      }
    }

    return new Promise<AdapterFile[]>((resolve, reject) => {
      const worker = new Worker(
        URL.createObjectURL(new Blob([adapterFile], { type: 'text/javascript' }))
      );

      // Set a timeout for the worker (5 minutes)
      const timeoutId = setTimeout(
        () => {
          worker.terminate();
          setFilesStatus((prev) => ({
            ...prev,
            adapter: { ...prev.adapter, status: FileStatus.Error },
          }));
          reject(new Error('Worker execution timed out after 5 minutes'));
        },
        5 * 60 * 1000
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
        clearTimeout(timeoutId); // Clear timeout on successful response
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
        clearTimeout(timeoutId); // Clear timeout on error
        console.error('❌ Error in worker:', error);
        setFilesStatus((prev) => ({
          ...prev,
          adapter: { ...prev.adapter, status: FileStatus.Error },
        }));
        reject(new Error(`Worker execution failed: ${error.message || 'Unknown worker error'}`));
      };

      // Handle worker message errors
      worker.onmessageerror = (error) => {
        clearTimeout(timeoutId); // Clear timeout on message error
        console.error('❌ Message error in worker:', error);
        setFilesStatus((prev) => ({
          ...prev,
          adapter: { ...prev.adapter, status: FileStatus.Error },
        }));
        reject(new Error(`Worker message error: Unable to process worker message`));
      };
    });
  };

  const updateSelectedProjectId = (projectId: string) => {
    setselectedProjectId(projectId);
    updateSelectedProject(projectId);
  };

  const resetRepository = async () => {
    setPrLink(null);
    setError(null); // Clear any existing errors
    initConfig.current = false;
    setFilesStatus(INITIAL_FILES_STATUS);
    return await validateProject();
  };

  const value = {
    selectedProjectId,
    updateSelectedProjectId,
    userProjects,
    prLink,
    publishFiles,
    filesStatus,
    validationStatus,
    initializeRepo,
    resetRepository,
    error,
    clearError,
  };

  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>;
}
