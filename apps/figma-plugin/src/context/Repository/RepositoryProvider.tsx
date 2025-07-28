import { useEffect, useMemo, useRef, useState } from 'react';
import { RepositoryContext } from './RepositoryContext';
import { useFigma, useFileData, useRepositoryInstance, useAdapterWorker } from '../../hooks';
import type {
  RecursicaConfiguration,
  RecursicaVariablesSchema,
  CollectionToken,
  VariableReferenceValue,
  Token,
} from '@recursica/schemas';
import { type UserInfo, type Project, type CommitAction } from '../../services/repository';
import { isColorOrFloatToken } from '@recursica/common';

interface AdapterFile {
  path: string;
  content: string;
}

function cleanPath(path: string) {
  return path.replace(/^\/+/, '');
}

// Helper function to normalize variable names
function normalizeVariableName(name: string): string {
  return `recursica-${name.replace(/\//g, '-')}`;
}

// Helper function to get token name
function getTokenName(token: CollectionToken): string {
  if ('name' in token) {
    return token.name;
  }
  return 'unknown';
}

// Helper function to get token value
function getTokenValue(token: Token): string {
  if (typeof token.value === 'object' && token.value !== null && 'collection' in token.value) {
    // This is a reference
    const ref = token.value as VariableReferenceValue;
    return `var(--${normalizeVariableName(ref.name)})`;
  }

  // Direct value
  if (typeof token.value === 'string') {
    return token.value;
  }
  if (typeof token.value === 'number') {
    if (token.name.includes('opacity')) {
      return `${token.value / 100}`;
    }
    return `${token.value}px`;
  }
  if (typeof token.value === 'boolean') {
    return token.value ? 'true' : 'false';
  }

  return String(token.value);
}

// Function to generate CSS from bundled JSON
function generateCSSFromBundledJson(bundledJson: string): string {
  try {
    const data: RecursicaVariablesSchema = JSON.parse(bundledJson);
    let css = '';

    // Generate CSS variables for tokens and uiKit in :root
    const rootVariables: string[] = [];

    // Process tokens
    Object.entries(data.tokens).forEach(([, token]) => {
      const tokenName = getTokenName(token);
      const variableName = normalizeVariableName(`${tokenName}`);
      if (isColorOrFloatToken(token)) {
        const value = getTokenValue(token);
        rootVariables.push(`  --${variableName}: ${value};`);
      }
    });

    // Process uiKit
    Object.entries(data.uiKit).forEach(([, token]) => {
      const tokenName = getTokenName(token);
      const variableName = normalizeVariableName(`${tokenName}`);
      if (isColorOrFloatToken(token)) {
        const value = getTokenValue(token);
        rootVariables.push(`  --${variableName}: ${value};`);
      }
    });

    // Add :root block
    if (rootVariables.length > 0) {
      css += ':root {\n';
      css += rootVariables.join('\n');
      css += '\n}\n\n';
    }

    // Generate theme classes
    Object.entries(data.themes).forEach(([themeName, themeTokens]) => {
      // Group tokens by mode
      const tokensByMode: Record<string, string[]> = {};

      Object.entries(themeTokens).forEach(([, token]) => {
        if (isColorOrFloatToken(token)) {
          const tokenName = getTokenName(token);
          const variableName = normalizeVariableName(`${tokenName}`);
          const value = getTokenValue(token);
          const mode = token.mode || 'default';

          if (!tokensByMode[mode]) {
            tokensByMode[mode] = [];
          }
          tokensByMode[mode].push(`  --${variableName}: ${value};`);
        }
      });

      // Create a CSS class for each mode
      Object.entries(tokensByMode).forEach(([mode, themeVariables]) => {
        if (themeVariables.length > 0) {
          // Clean theme name by removing spaces
          const cleanThemeName = themeName.replace(/\s+/g, '');
          const cleanModeName = mode.replace(/\s+/g, '');

          // Create class name: theme-mode (e.g., recursicaBrand-light, recursicaBrand-dark)
          const className =
            mode === 'default' ? cleanThemeName : `${cleanThemeName}-${cleanModeName}`;

          css += `.${className} {\n`;
          css += themeVariables.join('\n');
          css += '\n}\n\n';
        }
      });
    });

    return css;
  } catch (error) {
    console.error('Error generating CSS from bundled JSON:', error);
    return '';
  }
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
    updateRepository: { updateSelectedProject },
  } = useFigma();

  // Use custom hooks
  const { fileLoadingData, setRemoteVariablesJson, setRemoteIconsJson, clearRemoteData } =
    useFileData(selectedProject);
  const { repositoryInstance } = useRepositoryInstance();
  const { runAdapter } = useAdapterWorker();

  // Fetch remote files when repository is available
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
          setRemoteIconsJson(remoteIconsJson);
        } catch (error) {
          if (error instanceof Error && error.message.includes('404')) {
            setRemoteIconsJson('{}');
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
          setRemoteVariablesJson(remoteBundledJson);
        } catch (error) {
          if (error instanceof Error && error.message.includes('404')) {
            setRemoteVariablesJson('{}');
          } else {
            console.error('Error fetching remote variables:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching remote files:', error);
      }
    };

    fetchRemoteFiles();
  }, [repositoryInstance, selectedProject]);

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

    if (!(fileLoadingData.bundledJson || fileLoadingData.iconsJson)) {
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
      updateFilesStatus(fileLoadingData.bundledJson, fileLoadingData.iconsJson);
      try {
        await handlePublishFiles();
      } catch (error) {
        console.error('Publish files error:', error);
        // The error handling is now done in handlePublishFiles, but we ensure it's logged here too
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
    if (fileLoadingData.bundledJson || fileLoadingData.iconsJson) {
      updateFilesStatus(fileLoadingData.bundledJson, fileLoadingData.iconsJson);
      handlePublishFiles();
    }
  }, [fileLoadingData.bundledJson, fileLoadingData.iconsJson]);

  const handlePublishFiles = async (): Promise<void> => {
    if (!selectedProject) {
      throw new Error('Selected project is not available');
    }

    try {
      const targetBranch = await createBranch(selectedProject);
      const config = await getConfig(targetBranch);

      // Run adapter with proper error handling
      let adapterFiles: AdapterFile[] = [];
      try {
        if (!repositoryInstance) {
          throw new Error('Repository instance not available');
        }
        adapterFiles = await runAdapter(
          repositoryInstance,
          selectedProject,
          targetBranch,
          config,
          fileLoadingData,
          (status) => {
            if (status === 'loading') {
              setFilesStatus((prev) => ({
                ...prev,
                adapter: { quantity: 1, status: FileStatus.Loading },
              }));
            } else if (status === 'done') {
              setFilesStatus((prev) => ({
                ...prev,
                adapter: { ...prev.adapter, status: FileStatus.Done },
              }));
            } else if (status === 'error') {
              setFilesStatus((prev) => ({
                ...prev,
                adapter: { ...prev.adapter, status: FileStatus.Error },
              }));
            }
          }
        );
      } catch (error) {
        console.error('Adapter execution failed:', error);
        setRepositoryError(
          'Adapter execution failed',
          error instanceof Error ? error.message : 'Unknown adapter error',
          'ADAPTER_EXECUTION_ERROR'
        );
        // Update files status to show error immediately
        setFilesStatus((prev) => ({
          ...prev,
          adapter: { ...prev.adapter, status: FileStatus.Error },
        }));
        throw error; // Re-throw to prevent further execution
      }

      // Generate CSS from bundled JSON
      if (fileLoadingData.bundledJson) {
        const cssContent = generateCSSFromBundledJson(fileLoadingData.bundledJson);
        if (cssContent) {
          adapterFiles.push({
            path: 'recursica.css',
            content: cssContent,
          });
        }
      }

      await commitFiles(targetBranch, adapterFiles, config);
    } catch (error) {
      // Ensure any error is properly handled and UI is updated
      if (!isExpectedError(error)) {
        setRepositoryError(
          'Failed to publish files',
          getErrorMessage(error),
          'PUBLISH_FILES_ERROR'
        );
      }
      throw error;
    }
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
    let variablesFilename = fileLoadingData.bundledFilename;
    if (rootPath) {
      variablesFilename = rootPath + '/' + variablesFilename;
    }
    let svgIconsFilename = fileLoadingData.iconsFilename;
    if (rootPath) {
      svgIconsFilename = rootPath + '/' + svgIconsFilename;
    }

    const actions: CommitAction[] = [];
    if (fileLoadingData.bundledJson) {
      const exists = await repositoryInstance.fileExists(
        selectedProject,
        variablesFilename,
        targetBranch
      );
      actions.push({
        action: exists ? 'update' : 'create',
        file_path: variablesFilename,
        content: fileLoadingData.bundledJson,
      });
    }

    if (initConfig.current) {
      actions.push({
        action: 'create',
        file_path: 'recursica.json',
        content: JSON.stringify(config, null, 2),
      });
    }

    if (fileLoadingData.iconsJson) {
      const exists = await repositoryInstance.fileExists(
        selectedProject,
        svgIconsFilename,
        targetBranch
      );
      actions.push({
        action: exists ? 'update' : 'create',
        file_path: svgIconsFilename,
        content: fileLoadingData.iconsJson,
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

  const updateSelectedProjectId = (projectId: string) => {
    setselectedProjectId(projectId);
    updateSelectedProject(projectId);
  };

  const resetRepository = async () => {
    setPrLink(null);
    setError(null); // Clear any existing errors
    initConfig.current = false;
    setFilesStatus(INITIAL_FILES_STATUS);
    // Clear remote file data
    clearRemoteData();
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
