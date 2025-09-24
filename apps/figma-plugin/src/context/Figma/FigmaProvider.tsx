import { useEffect, useLayoutEffect, useState } from 'react';
import { FigmaContext, CurrentRepositoryContext } from './FigmaContext';
import type { RecursicaVariablesSchema } from '@recursica/schemas';
import { FileTypes } from '../../plugin/filetype';
import { Typography, Box } from '@recursica/ui-kit-mantine';

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
      if (type === 'FILETYPE_DETECTED') {
        const { fileType, pluginVersion } = payload;
        setFiletype(fileType);
        setPluginVersion(pluginVersion);
      }
      if (type === 'FILETYPE_ERROR') {
        setError(payload.error);
      }
      if (
        type === 'NO_TOKENS_FOUND' ||
        type === 'TOKENS_NOT_CONNECTED' ||
        type === 'NO_TOKENS_OR_THEMES_FOUND' ||
        type === 'NO_VARIABLES_FOUND' ||
        type === 'NO_THEMES_FOUND' ||
        type === 'THEMES_NOT_CONNECTED'
      ) {
        setError(type);
      }
    };
    return () => {
      window.onmessage = null;
    };
  }, []);

  useEffect(() => {
    syncVariables();
    getFiletype();
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

  const syncVariables = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SYNC_TOKENS',
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
    filetype,
    error,
    pluginVersion,
    updateAgreedPublishChanges,
  };
  const SHOW_VERSION_BANNER = import.meta.env.VITE_SHOW_VERSION_BANNER === 'true';
  const shouldShowBanner = SHOW_VERSION_BANNER;

  return (
    <FigmaContext.Provider value={values}>
      {shouldShowBanner && pluginVersion && (
        <Box
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }}
          w='100%'
          bg='layers/layer-alternatives/warn/properties/surface'
          p='size/spacer/default'
        >
          <Typography
            variant='body-2/normal'
            textAlign='center'
            color='layers/layer-alternatives/warn/elements/text/color'
          >
            TESTING PLUGIN v{pluginVersion}
          </Typography>
        </Box>
      )}
      {children}
    </FigmaContext.Provider>
  );
}
