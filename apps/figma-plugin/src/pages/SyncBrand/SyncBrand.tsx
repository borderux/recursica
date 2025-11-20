import { Flex, Typography, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';

export function SyncBrand() {
  const { syncStatus, filetype, syncMetadata, error } = useFigma();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ignoreError = searchParams.get('ignore-error') === 'true';
  const [hasTriggeredSync, setHasTriggeredSync] = useState(false);

  useEffect(() => {
    console.log('[SyncBrand] Page loaded', { ignoreError });
  }, [ignoreError]);

  // Check if not in Brand file (unless ignoring error)
  useEffect(() => {
    if (!ignoreError && filetype && filetype !== 'themes') {
      console.log('[SyncBrand] Not in Brand file, navigating to error page');
      navigate('/sync-brand-error');
    }
  }, [filetype, navigate, ignoreError]);

  // Check if brand is already synced (unless ignoring error)
  useEffect(() => {
    if (!ignoreError && syncMetadata?.brand?.synchronized === true) {
      console.log('[SyncBrand] Brand already synced, navigating to success page');
      navigate('/sync-brand-success');
    }
  }, [syncMetadata, navigate, ignoreError]);

  // If ignore-error is set, trigger sync immediately
  useEffect(() => {
    if (ignoreError && !hasTriggeredSync && filetype === 'themes') {
      console.log('[SyncBrand] ignore-error=true, triggering sync with error ignored');
      setHasTriggeredSync(true);
      parent.postMessage(
        {
          pluginMessage: {
            type: 'SYNC_BRAND_IGNORE_ERROR',
          },
          pluginId: '*',
        },
        '*'
      );
    }
  }, [ignoreError, hasTriggeredSync, filetype]);

  // Navigate to error page if there's an error (unless ignoring error)
  useEffect(() => {
    if (!ignoreError && error && filetype === 'themes') {
      console.log('[SyncBrand] Error detected, navigating to error page');
      navigate('/sync-brand-error');
    }
  }, [error, filetype, navigate, ignoreError]);

  // Navigate to success page when sync completes
  useEffect(() => {
    const isSynced = syncStatus.variablesSynced && syncStatus.metadataGenerated;
    if (isSynced && filetype === 'themes') {
      console.log('[SyncBrand] Sync completed, navigating to success page');
      navigate('/sync-brand-success');
    }
  }, [syncStatus, filetype, navigate]);

  const handleSync = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SYNC_BRAND',
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
          #2 Brand File
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
