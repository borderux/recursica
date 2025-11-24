import { Flex, Typography, Icon } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useEffect } from 'react';

export function TokensSyncError() {
  const { error } = useFigma();

  useEffect(() => {
    console.log('[TokensSyncError] Page loaded');
  }, []);

  return (
    <Layout>
      <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
        <Icon name='face_frown_outline' size={48} color='layers/layer-1/elements/alert-text' />
        <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/alert-text'>
          Tokens Sync Failed
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          {error || 'An error occurred while syncing tokens. Please try again.'}
        </Typography>
      </Flex>
    </Layout>
  );
}
