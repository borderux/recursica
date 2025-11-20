import { Flex, Typography, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export function SyncIcons() {
  const { syncStatus, filetype } = useFigma();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[SyncIcons] Page loaded');
  }, []);

  // Check if not in Icons file
  useEffect(() => {
    if (filetype && filetype !== 'icons') {
      console.log('[SyncIcons] Not in Icons file, navigating to error page');
      navigate('/sync-icons-error');
    }
  }, [filetype, navigate]);

  // Check if icons are already synced
  useEffect(() => {
    // Icons don't have a synchronized flag, just check if metadata exists
    // This will be handled by the Home page routing
  }, []);

  // Navigate to success page when sync completes
  useEffect(() => {
    const isSynced = syncStatus.variablesSynced && syncStatus.metadataGenerated;
    if (isSynced && filetype === 'icons') {
      console.log('[SyncIcons] Sync completed, navigating to success page');
      navigate('/sync-icons-success');
    }
  }, [syncStatus, filetype, navigate]);

  const handleSync = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SYNC_ICONS',
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
          #3 Icons File
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
