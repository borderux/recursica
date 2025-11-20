import { useEffect, useLayoutEffect, useState } from 'react';
import { FigmaContext, CurrentRepositoryContext } from './FigmaContext';
import type { RecursicaVariablesSchema } from '@recursica/schemas';
import { FileTypes } from '../../plugin/filetype';

export interface TokensProvidersProps {
  children: React.ReactNode;
}

export function FigmaProvider({ children }: TokensProvidersProps) {
  const [repository, setRepository] = useState<CurrentRepositoryContext>({
    platform: undefined,
    accessToken: undefined,
    selectedProject: null,
    agreedPublishChanges: false,
  });
  const [recursicaVariables, setRecursicaVariables] = useState<RecursicaVariablesSchema>();
  const [svgIcons, setSvgIcons] = useState<Record<string, string>>();
  const [userId, setUserId] = useState<string | undefined>();
  const [syncStatus, setSyncStatus] = useState({
    variablesSynced: false,
    metadataGenerated: false,
  });
  const [syncMetadata, setSyncMetadata] = useState<{
    tokens?: { collectionKey: string; needsConnection: boolean; synchronized: boolean };
    brand?: { collectionKey: string; synchronized: boolean; published: boolean };
    icons?: {};
    uiKit?: { synchronized: boolean };
  } | null>(null);
  const [filetype, setFiletype] = useState<FileTypes | undefined>();
  const [pluginVersion, setPluginVersion] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  useLayoutEffect(() => {
    window.onmessage = ({ data: { pluginMessage } }) => {
      if (!pluginMessage) return;
      console.log('New message from the plugin sandbox: ', pluginMessage);
      const { type, payload } = pluginMessage;
      if (type === 'GET_LOCAL_STORAGE') {
        const { accessToken, platform, selectedProject, agreedPublishChanges } = payload;
        setRepository({
          platform,
          accessToken,
          selectedProject,
          agreedPublishChanges,
        });
      }
      if (type === 'RECURSICA_VARIABLES') {
        setRecursicaVariables(payload);
      }
      if (type === 'SVG_ICONS') {
        setSvgIcons(payload);
      }
      if (type === 'CURRENT_USER') {
        setUserId(payload);
      }
      if (type === 'SYNC_VARIABLES_COMPLETE') {
        setSyncStatus((prev) => ({
          ...prev,
          variablesSynced: true,
        }));
      }
      if (type === 'GENERATE_METADATA_COMPLETE') {
        setSyncStatus((prev) => ({
          ...prev,
          metadataGenerated: true,
        }));
      }
      // New sync workflow completion messages
      if (type === 'TOKENS_SYNC_COMPLETE' || type === 'TOKENS_SYNC_COMPLETE_WITH_WARNING') {
        setSyncStatus({
          variablesSynced: true,
          metadataGenerated: true,
        });
        setError(undefined); // Clear any errors when sync completes
      }
      if (type === 'TOKENS_SYNC_ERROR') {
        setError(payload.message || 'Failed to sync tokens');
      }
      if (type === 'BRAND_SYNC_COMPLETE') {
        setSyncStatus({
          variablesSynced: true,
          metadataGenerated: true,
        });
        setError(undefined); // Clear any errors when sync completes
      }
      if (type === 'BRAND_SYNC_ERROR') {
        setError(payload.message || 'Failed to sync brand');
      }
      if (type === 'UI_KIT_SYNC_COMPLETE') {
        setSyncStatus({
          variablesSynced: true,
          metadataGenerated: true,
        });
        setError(undefined); // Clear any errors when sync completes
      }
      if (type === 'ICONS_SYNC_COMPLETE') {
        setSyncStatus({
          variablesSynced: true,
          metadataGenerated: true,
        });
        setError(undefined); // Clear any errors when sync completes
      }
      if (type === 'FILETYPE_DETECTED') {
        const { fileType, pluginVersion } = payload;
        setFiletype(fileType);
        setPluginVersion(pluginVersion);
      }
      if (type === 'SYNC_METADATA_LOADED') {
        setSyncMetadata(payload);
      }
      if (type === 'FILETYPE_ERROR') {
        setError(payload.error);
      }
      if (type === 'MISSING_VARIABLES') {
        const { count, collectionName, missingVariables } = payload;
        console.error(
          `Missing ${count} variables in ${collectionName} collection:`,
          missingVariables
        );
        setError(
          `${count} variable${count > 1 ? 's' : ''} missing from ${collectionName} collection. Check console for details.`
        );
      }
      if (
        type === 'NO_TOKENS_FOUND' ||
        type === 'TOKENS_NOT_CONNECTED' ||
        type === 'NO_TOKENS_OR_THEMES_FOUND' ||
        type === 'NO_VARIABLES_FOUND' ||
        type === 'NO_THEMES_FOUND' ||
        type === 'THEMES_NOT_CONNECTED' ||
        type === 'TOKENS_NOT_FOUND' ||
        type === 'BRAND_NOT_FOUND' ||
        type === 'TOKENS_NOT_ACCESSIBLE' ||
        type === 'BRAND_NOT_ACCESSIBLE' ||
        type === 'TOKENS_COLLECTION_NOT_FOUND' ||
        type === 'BRAND_COLLECTION_NOT_FOUND' ||
        type === 'UI_KIT_COLLECTIONS_NOT_FOUND' ||
        type === 'ICONS_FILE_ERROR'
      ) {
        setError(type);
      }
    };
    return () => {
      window.onmessage = null;
    };
  }, []);

  useEffect(() => {
    getFiletype();
    // Don't auto-sync - wait for user to click sync button for Tokens file
    // For other files, sync will be triggered when needed
  }, []);

  useEffect(() => {
    // get the auth info from the plugin
    parent.postMessage(
      {
        pluginMessage: { type: 'GET_LOCAL_STORAGE' },
        pluginId: '*',
      },
      '*'
    );
    // get the current user
    parent.postMessage(
      {
        pluginMessage: { type: 'GET_CURRENT_USER' },
        pluginId: '*',
      },
      '*'
    );
  }, []);

  const updateAccessToken = (accessToken: string) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_ACCESS_TOKEN',
          payload: accessToken,
        },
        pluginId: '*',
      },
      '*'
    );
    setRepository((prev) => ({
      platform: prev.platform,
      accessToken,
      selectedProject: null,
      agreedPublishChanges: prev.agreedPublishChanges,
    }));
  };

  const updatePlatform = (platform: 'gitlab' | 'github') => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_PLATFORM',
          payload: platform,
        },
        pluginId: '*',
      },
      '*'
    );
    setRepository({
      platform,
      accessToken: undefined,
      selectedProject: null,
      agreedPublishChanges: false,
    });
  };

  const updateSelectedProject = (selectedProject: string | null) => {
    setRepository((prev) => ({
      ...prev,
      selectedProject,
    }));
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_SELECTED_PROJECT',
          payload: selectedProject,
        },
        pluginId: '*',
      },
      '*'
    );
  };

  const getFiletype = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'GET_FILETYPE',
        },
        pluginId: '*',
      },
      '*'
    );
  };

  const updateAgreedPublishChanges = (agreedPublishChanges: boolean) => {
    setRepository((prev) => ({
      ...prev,
      agreedPublishChanges,
    }));
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_AGREED_PUBLISH_CHANGES',
          payload: agreedPublishChanges,
        },
        pluginId: '*',
      },
      '*'
    );
  };

  const clearError = () => {
    setError(undefined);
  };

  const values = {
    repository,
    updateRepository: {
      updatePlatform,
      updateAccessToken,
      updateSelectedProject,
    },
    recursicaVariables,
    svgIcons,
    loading: !(recursicaVariables || svgIcons),
    userId,
    syncStatus,
    syncMetadata,
    filetype,
    error,
    pluginVersion,
    updateAgreedPublishChanges,
    clearError,
  };
  return <FigmaContext.Provider value={values}>{children}</FigmaContext.Provider>;
}
