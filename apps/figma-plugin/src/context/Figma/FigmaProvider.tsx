import { useLayoutEffect, useState } from 'react';
import { FigmaContext, CurrentRepositoryContext } from './FigmaContext';
import type { RecursicaVariablesSchema } from '@recursica/schemas';

export interface TokensProvidersProps {
  children: React.ReactNode;
}

export function FigmaProvider({ children }: TokensProvidersProps) {
  const [repository, setRepository] = useState<CurrentRepositoryContext>({
    platform: 'gitlab',
    accessToken: '',
  });
  const [recursicaVariables, setRecursicaVariables] = useState<RecursicaVariablesSchema>();
  const [svgIcons, setSvgIcons] = useState<Record<string, string>>();

  useLayoutEffect(() => {
    window.onmessage = ({ data: { pluginMessage } }) => {
      if (!pluginMessage) return;
      const { type, payload } = pluginMessage;
      if (type === 'GET_ACCESS_TOKEN') {
        const { platform, accessToken } = payload;
        setRepository({
          platform,
          accessToken,
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

  const updateAccessToken = (platform: 'gitlab' | 'github', accessToken: string) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_ACCESS_TOKEN',
          payload: {
            platform,
            accessToken,
          },
        },
        pluginId: '*',
      },
      '*'
    );
    setRepository({
      platform,
      accessToken,
    });
  };

  const values = {
    repository: {
      platform: repository.platform,
      accessToken: repository.accessToken,
      updateAccessToken,
    },
    recursicaVariables,
    svgIcons,
    loading: !(recursicaVariables || svgIcons),
  };

  return <FigmaContext.Provider value={values}>{children}</FigmaContext.Provider>;
}
