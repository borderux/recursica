import { Flex, Typography, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

export function SyncUiKit() {
  const { syncStatus, filetype, error, syncMetadata } = useFigma();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    console.log('[SyncUiKit] Page loaded');
  }, []);

  // Check if not in UI Kit file
  useEffect(() => {
    if (filetype && filetype !== 'ui-kit') {
      console.log('[SyncUiKit] Not in UI Kit file, navigating to error page');
      navigate('/sync-ui-kit-error');
    }
  }, [filetype, navigate]);

  // Check if UI Kit is already synced
  useEffect(() => {
    if (syncMetadata?.uiKit?.synchronized === true) {
      // Check if all files are synchronized - if so, go to file-synced page
      const tokensSynced = syncMetadata?.tokens?.synchronized === true;
      const brandSynced = syncMetadata?.brand?.synchronized === true;
      const iconsSynced = syncMetadata?.icons !== undefined;
      const uiKitSynced = syncMetadata?.uiKit?.synchronized === true;
      const allSynced = tokensSynced && brandSynced && iconsSynced && uiKitSynced;

      if (allSynced) {
        console.log('[SyncUiKit] All files synchronized, navigating to file-synced page');
        navigate('/file-synced', { replace: true });
      }
    }
  }, [syncMetadata, navigate]);

  // Navigate to error page if there's an error
  useEffect(() => {
    if (error && filetype === 'ui-kit') {
      setIsSyncing(false); // Stop loading on error
      // Check if error is about Brand not being published or not accessible
      const isBrandNotPublished =
        error.includes('Brand file has not been published') ||
        error.includes('Brand library collection is not accessible') ||
        error.includes('import at least one variable from the Brand library') ||
        error.includes('BRAND_NOT_PUBLISHED');
      if (isBrandNotPublished) {
        console.log(
          '[SyncUiKit] Brand not published/accessible error detected, navigating to brand not published page'
        );
        navigate('/sync-ui-kit-brand-not-published');
      } else {
        console.log('[SyncUiKit] Error detected, navigating to error page');
        navigate('/sync-ui-kit-error');
      }
    }
  }, [error, filetype, navigate]);

  // Navigate to success page when sync completes
  useEffect(() => {
    const isSynced = syncStatus.variablesSynced && syncStatus.metadataGenerated;
    if (isSynced && filetype === 'ui-kit') {
      setIsSyncing(false); // Stop loading on completion
      console.log('[SyncUiKit] Sync completed, navigating to success page');
      navigate('/file-synced');
    }
  }, [syncStatus, filetype, navigate]);

  const handleSync = () => {
    setIsSyncing(true);
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
          textAlign='left'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          Before you begin <br />- Make sure the Brand library is{' '}
          <a
            href='https://help.figma.com/hc/en-us/articles/360025508373-Publish-a-library'
            target='_blank'
            rel='noopener noreferrer'
          >
            published
          </a>{' '}
          <br />-{' '}
          <a
            href='https://help.figma.com/hc/en-us/articles/1500008731201-Add-or-remove-a-library-from-a-design-file'
            target='_blank'
            rel='noopener noreferrer'
          >
            Add the Brand library to the this file
          </a>{' '}
          <br />
          - Make sure the Icons library is published <br />- Press sync below to begin <br />
        </Typography>
        <Button
          label={isSyncing ? 'Syncing...' : 'Sync'}
          onClick={handleSync}
          disabled={isSyncing}
        />
      </Flex>
    </Layout>
  );
}
