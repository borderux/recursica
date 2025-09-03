import { useCallback, useEffect, useMemo, useState } from 'react';
import { RepositoryContext } from './RepositoryContext';
import {
  useFigma,
  useFileData,
  useRepositoryInstance,
  useAdapterWorker,
  useRepositoryError,
  useRemoteFiles,
  useRepositoryOperations,
  useUserProjects,
  useUserInfo,
} from '../../hooks';
import type {
  RecursicaVariablesSchema,
  CollectionToken,
  VariableReferenceValue,
  Token,
} from '@recursica/schemas';
import { type PullRequest } from '../../services/repository';
import { PublishStatus } from './RepositoryContext';
import { isColorOrFloatToken } from '@recursica/common';

interface AdapterFile {
  path: string;
  content: string;
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

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [existingPR, setExistingPR] = useState<PullRequest | null>(null);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>('to-publish');

  const {
    repository,
    updateRepository: { updateSelectedProject },
    filetype,
  } = useFigma();

  const { repositoryInstance } = useRepositoryInstance();
  const { runAdapter } = useAdapterWorker();
  const { error, setRepositoryError, clearError, getErrorMessage } = useRepositoryError();

  // User data hooks with auto-fetching
  const { userInfo } = useUserInfo(repositoryInstance);
  const { userProjects } = useUserProjects(userInfo, repositoryInstance);

  const selectedProject = useMemo(() => {
    return userProjects.find((project) => project.id === selectedProjectId);
  }, [userProjects, selectedProjectId]);

  // Use custom hooks
  const { fileLoadingData, setRemoteVariablesJson, setRemoteIconsJson, clearRemoteData } =
    useFileData(selectedProject);

  const { createBranch, getConfig, commitFiles, getExistingPullRequest, createPullRequest } =
    useRepositoryOperations();

  // Use remote files hook
  useRemoteFiles(repositoryInstance, selectedProject, setRemoteVariablesJson, setRemoteIconsJson);

  const updateSelectedProjectId = useCallback(
    (projectId: string | null) => {
      setSelectedProjectId(projectId);
      updateSelectedProject(projectId);
    },
    [updateSelectedProject]
  );

  useEffect(() => {
    if (repository) {
      setSelectedProjectId(repository.selectedProject);
    }
  }, [repository]);

  // Auto-select project if there's only one available and no project is currently selected
  useEffect(() => {
    if (userProjects.length === 1 && !selectedProjectId) {
      updateSelectedProjectId(userProjects[0].id);
    }
  }, [userProjects, selectedProjectId, updateSelectedProjectId]);

  // Fetch existing PR when user info and project are available
  const fetchExistingPR = async () => {
    if (userInfo && selectedProject && repositoryInstance) {
      try {
        const targetBranch = `recursica-${userInfo.username}`;
        const existingPR = await getExistingPullRequest(
          repositoryInstance,
          selectedProject,
          targetBranch
        );
        console.log('getting existing PR', existingPR);
        if (existingPR) {
          setExistingPR(existingPR);
        }
      } catch (error) {
        console.error('Failed to fetch existing PR:', error);
      } finally {
        setPublishStatus('to-publish');
      }
    }
  };
  useEffect(() => {
    fetchExistingPR();
  }, [userInfo, selectedProject, repositoryInstance, getExistingPullRequest]);

  const publishFiles = async (): Promise<void> => {
    clearError(); // Clear any previous errors
    setPublishStatus('publishing');

    if (!selectedProject) {
      setRepositoryError(
        'No project selected',
        'Please select a project before publishing files',
        'NO_PROJECT_SELECTED'
      );
      setPublishStatus('to-publish');
      return;
    }

    if (!repositoryInstance) {
      setRepositoryError(
        'Repository not initialized',
        'Please check your repository connection',
        'REPOSITORY_NOT_INITIALIZED'
      );
      setPublishStatus('to-publish');
      return;
    }

    if (!(fileLoadingData.localBundledJson || fileLoadingData.localIconsJson)) {
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
      await handlePublishFiles();
    }
  };

  useEffect(() => {
    if (fileLoadingData.localBundledJson || fileLoadingData.localIconsJson) {
      handlePublishFiles();
    }
  }, [fileLoadingData.localBundledJson, fileLoadingData.localIconsJson]);

  const handlePublishFiles = async (): Promise<void> => {
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

    try {
      const targetBranch = await createBranch(
        repositoryInstance,
        selectedProject,
        userInfo?.username
      );
      const { config, shouldCreateInit } = await getConfig(
        repositoryInstance,
        selectedProject,
        targetBranch
      );

      // Run adapter with proper error handling
      let adapterFiles: AdapterFile[] = [];
      try {
        if (filetype === 'icons') {
          adapterFiles = [];
        } else {
          adapterFiles = await runAdapter(
            repositoryInstance,
            selectedProject,
            targetBranch,
            config,
            fileLoadingData
          );
        }
      } catch (error) {
        console.error('Adapter execution failed:', error);
        setRepositoryError(
          'Adapter execution failed',
          error instanceof Error ? error.message : 'Unknown adapter error',
          'ADAPTER_EXECUTION_ERROR'
        );
        throw error; // Re-throw to prevent further execution
      }

      // Generate CSS from bundled JSON only if no adapter files were created
      if (fileLoadingData.localBundledJson && adapterFiles.length === 0) {
        const cssContent = generateCSSFromBundledJson(fileLoadingData.localBundledJson);
        if (cssContent) {
          adapterFiles.push({
            path: 'recursica.css',
            content: cssContent,
          });
        }
      }

      await commitFiles(
        repositoryInstance,
        selectedProject,
        targetBranch,
        adapterFiles,
        config,
        {
          localBundledJson: fileLoadingData.localBundledJson,
          localIconsJson: fileLoadingData.localIconsJson,
          bundledFilename: fileLoadingData.bundledFilename,
          iconsFilename: fileLoadingData.iconsFilename,
        },
        shouldCreateInit
      );

      try {
        await createPullRequest(repositoryInstance, selectedProject, targetBranch);
      } catch (error) {
        console.error('Failed to create pull request:', error);
        // Don't fail the entire operation if PR creation fails
        // The files were still committed successfully
      }

      // Set status to published after successful completion
      setPublishStatus('published');
    } catch (error) {
      // Ensure any error is properly handled and UI is updated
      console.error('Publish files error:', error);
      setRepositoryError('Failed to publish files', getErrorMessage(error), 'PUBLISH_FILES_ERROR');
      setPublishStatus('to-publish');
      // Don't re-throw the error to prevent unhandled promise rejections
    }
  };

  const resetRepository = () => {
    fetchExistingPR();
    clearError(); // Clear any existing errors
    // Clear remote file data
    clearRemoteData();
  };

  const value = {
    selectedProjectId,
    updateSelectedProjectId,
    userProjects,
    existingPR,
    publishStatus,
    bundledJson: fileLoadingData.localBundledJson,
    iconsJson: fileLoadingData.localIconsJson,
    publishFiles,
    resetRepository,
    error,
    clearError,
    selectedProject,
  };

  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>;
}
