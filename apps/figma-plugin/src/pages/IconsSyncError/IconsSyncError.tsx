import { Flex, Typography, Icon } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useEffect } from 'react';

export function IconsSyncError() {
  const { filetype } = useFigma();

  useEffect(() => {
    console.log('[IconsSyncError] Page loaded');
  }, []);

  // Show warning if not in Icons file
  const isWrongFile = filetype && filetype !== 'icons';

  return (
    <Layout>
      <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
        <Icon name='face_frown_outline' size={48} color='layers/layer-1/elements/alert-text' />
        <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/alert-text'>
          {isWrongFile ? 'This does not appear to be the #3 Icons file' : 'Icons Sync Failed'}
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          {isWrongFile
            ? 'Please download the Icons page and run this plugin again'
            : 'An error occurred while syncing icons. Please try again.'}
        </Typography>
      </Flex>
    </Layout>
  );
}
