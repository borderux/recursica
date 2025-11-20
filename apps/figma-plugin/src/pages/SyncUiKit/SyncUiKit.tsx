import { Flex, Typography, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';

export function SyncUiKit() {
  const { syncStatus, filetype, error } = useFigma();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ignoreError = searchParams.get('ignore-error') === 'true';
  const [hasTriggeredSync, setHasTriggeredSync] = useState(false);

  useEffect(() => {
    console.log('[SyncUiKit] Page loaded', { ignoreError });
  }, [ignoreError]);

  // Check if not in UI Kit file (unless ignoring error)
  useEffect(() => {
    if (!ignoreError && filetype && filetype !== 'ui-kit') {
      console.log('[SyncUiKit] Not in UI Kit file, navigating to error page');
      navigate('/sync-ui-kit-error');
    }
  }, [filetype, navigate, ignoreError]);

  // If ignore-error is set, trigger sync immediately
  useEffect(() => {
    if (ignoreError && !hasTriggeredSync && filetype === 'ui-kit') {
      console.log('[SyncUiKit] ignore-error=true, triggering sync with error ignored');
      setHasTriggeredSync(true);
      parent.postMessage(
        {
          pluginMessage: {
            type: 'SYNC_UI_KIT_IGNORE_ERROR',
          },
          pluginId: '*',
        },
        '*'
      );
    }
  }, [ignoreError, hasTriggeredSync, filetype]);

  // Navigate to error page if there's an error (unless ignoring error)
  useEffect(() => {
    if (!ignoreError && error && filetype === 'ui-kit') {
      console.log('[SyncUiKit] Error detected, navigating to error page');
      navigate('/sync-ui-kit-error');
    }
  }, [error, filetype, navigate, ignoreError]);

  // Navigate to success page when sync completes
  useEffect(() => {
    const isSynced = syncStatus.variablesSynced && syncStatus.metadataGenerated;
    if (isSynced && filetype === 'ui-kit') {
      console.log('[SyncUiKit] Sync completed, navigating to success page');
      navigate('/file-synced');
    }
  }, [syncStatus, filetype, navigate]);

  const handleSync = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SYNC_UI_KIT',
        },
        pluginId: '*',
      },
      '*'
    );
  };

  return (
    <Layout>
      <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
        <Typography variant='h6' textAlign='center'>
          #4 UI Kit File
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          Press sync below to begin
        </Typography>
        <Button label='Sync' onClick={handleSync} />
      </Flex>
    </Layout>
  );
}
