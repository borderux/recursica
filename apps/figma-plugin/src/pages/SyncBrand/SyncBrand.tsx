import { Flex, Typography, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

export function SyncBrand() {
  const { syncStatus, filetype, syncMetadata, error } = useFigma();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    console.log('[SyncBrand] Page loaded');
  }, []);

  // Check if not in Brand file
  useEffect(() => {
    if (filetype && filetype !== 'themes') {
      console.log('[SyncBrand] Not in Brand file, navigating to error page');
      navigate('/sync-brand-error');
    }
  }, [filetype, navigate]);

  // Check if brand is already synced
  useEffect(() => {
    if (syncMetadata?.brand?.synchronized === true) {
      // Check if all files are synchronized - if so, go to file-synced page
      const tokensSynced = syncMetadata?.tokens?.synchronized === true;
      const brandSynced = syncMetadata?.brand?.synchronized === true;
      const iconsSynced = syncMetadata?.icons !== undefined;
      const uiKitSynced = syncMetadata?.uiKit?.synchronized === true;
      const allSynced = tokensSynced && brandSynced && iconsSynced && uiKitSynced;

      if (allSynced) {
        console.log('[SyncBrand] All files synchronized, navigating to file-synced page');
        navigate('/file-synced', { replace: true });
      } else {
        console.log('[SyncBrand] Brand already synced, navigating to success page');
        navigate('/sync-brand-success');
      }
    }
  }, [syncMetadata, navigate]);

  // Navigate to error page if there's an error
  useEffect(() => {
    if (error && filetype === 'themes') {
      setIsSyncing(false); // Stop loading on error
      // Check if error is about Tokens not being published
      const isTokensNotPublished =
        error.includes('not been published') || error.includes('TOKENS_NOT_PUBLISHED');
      if (isTokensNotPublished) {
        console.log(
          '[SyncBrand] Tokens not published error detected, navigating to tokens not published page'
        );
        navigate('/sync-brand-tokens-not-published');
      } else {
        console.log('[SyncBrand] Error detected, navigating to error page');
        navigate('/sync-brand-error');
      }
    }
  }, [error, filetype, navigate]);

  // Navigate to success page when sync completes
  useEffect(() => {
    const isSynced = syncStatus.variablesSynced && syncStatus.metadataGenerated;
    if (isSynced && filetype === 'themes') {
      setIsSyncing(false); // Stop loading on completion
      console.log('[SyncBrand] Sync completed, navigating to success page');
      navigate('/sync-brand-success');
    }
  }, [syncStatus, filetype, navigate]);

  const handleSync = () => {
    setIsSyncing(true);
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
          textAlign='left'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          Before you begin <br />- Make sure the Tokens library is{' '}
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
            Add the Tokens library to the this file
          </a>{' '}
          <br />
          - Press sync below to begin <br />
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
