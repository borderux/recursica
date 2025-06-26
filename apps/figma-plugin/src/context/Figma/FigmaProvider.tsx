import { useEffect, useLayoutEffect, useState } from 'react';
import { FigmaContext, CurrentRepositoryContext } from './FigmaContext';
import type { RecursicaVariablesSchema } from '@recursica/schemas';

export interface TokensProvidersProps {
  children: React.ReactNode;
}

export function FigmaProvider({ children }: TokensProvidersProps) {
  const [repository, setRepository] = useState<CurrentRepositoryContext>({
    platform: undefined,
    accessToken: undefined,
    selectedProject: undefined,
  });
  const [recursicaVariables, setRecursicaVariables] = useState<RecursicaVariablesSchema>();
  const [svgIcons, setSvgIcons] = useState<Record<string, string>>();

  useLayoutEffect(() => {
    window.onmessage = ({ data: { pluginMessage } }) => {
      if (!pluginMessage) return;
      const { type, payload } = pluginMessage;
      if (type === 'GET_LOCAL_STORAGE') {
        const { accessToken, platform, selectedProject } = payload;
        setRepository({
          platform,
          accessToken,
          selectedProject,
        });
      }
      if (type === 'RECURSICA_VARIABLES') {
        setRecursicaVariables(payload);
      }
      if (type === 'SVG_ICONS') {
        setSvgIcons(payload);
      }
    };
    return () => {
      window.onmessage = null;
    };
  }, []);

  useEffect(() => {
    parent.postMessage(
      {
        pluginMessage: { type: 'GET_LOCAL_STORAGE' },
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
      selectedProject: undefined,
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
      selectedProject: undefined,
    });
  };

  const updateSelectedProject = (selectedProject: string) => {
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

  const values = {
    repository: {
      platform: repository.platform,
      accessToken: repository.accessToken,
      selectedProject: repository.selectedProject,
    },
    updateRepository: {
      updatePlatform,
      updateAccessToken,
      updateSelectedProject,
    },
    recursicaVariables,
    svgIcons,
    loading: !(recursicaVariables || svgIcons),
  };

  return <FigmaContext.Provider value={values}>{children}</FigmaContext.Provider>;
}
