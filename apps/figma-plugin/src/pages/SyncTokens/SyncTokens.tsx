import { Flex, Typography, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export function SyncTokens() {
  const { syncStatus, filetype, syncMetadata, error } = useFigma();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[SyncTokens] Page loaded');
  }, []);

  // Check if tokens are already synced
  useEffect(() => {
    if (syncMetadata?.tokens?.synchronized === true) {
      // Check if all files are synchronized - if so, go to file-synced page
      const tokensSynced = syncMetadata?.tokens?.synchronized === true;
      const brandSynced = syncMetadata?.brand?.synchronized === true;
      const iconsSynced = syncMetadata?.icons !== undefined;
      const uiKitSynced = syncMetadata?.uiKit?.synchronized === true;
      const allSynced = tokensSynced && brandSynced && iconsSynced && uiKitSynced;

      if (allSynced) {
        console.log('[SyncTokens] All files synchronized, navigating to file-synced page');
        navigate('/file-synced', { replace: true });
      } else {
        console.log('[SyncTokens] Tokens already synced, navigating to success page');
        navigate('/sync-tokens-success');
      }
    }
  }, [syncMetadata, navigate]);

  // Navigate to error page if there's an error
  useEffect(() => {
    if (error && filetype === 'tokens') {
      console.log('[SyncTokens] Error detected, navigating to error page');
      navigate('/sync-tokens-error');
    }
  }, [error, filetype, navigate]);

  // Navigate to success page when sync completes
  useEffect(() => {
    const isSynced = syncStatus.variablesSynced && syncStatus.metadataGenerated;
    if (isSynced && filetype === 'tokens') {
      console.log('[SyncTokens] Sync completed, navigating to success page');
      navigate('/sync-tokens-success');
    }
  }, [syncStatus, filetype, navigate]);

  const handleSync = () => {
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

  // Show error if not in Tokens file
  if (filetype && filetype !== 'tokens') {
    return (
      <Layout>
        <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
          <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/alert-text'>
            This does not appear to be the #1 Tokens file
          </Typography>
          <Typography
            variant='body-2/normal'
            textAlign='center'
            color='layers/layer-0/elements/text/color'
            opacity={0.84}
          >
            Please go to the Tokens page and run this plugin again
          </Typography>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
        <Typography variant='h6' textAlign='center'>
          #1 Recursica Tokens
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          Press sync below to start
        </Typography>
        <Button label='Sync' onClick={handleSync} />
      </Flex>
    </Layout>
  );
}
