import { Flex, Typography, Icon } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useEffect } from 'react';

export function TokensSyncSuccess() {
  useEffect(() => {
    console.log('[TokensSyncSuccess] Page loaded');
  }, []);

  return (
    <Layout>
      <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
        <Icon name='check_circle_outline' size={48} color='layers/layer-1/elements/success-text' />
        <Typography variant='h6' textAlign='center'>
          Tokens Successfully Synced
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='left'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          Next steps:
          <br />-{' '}
          <a
            href='https://help.figma.com/hc/en-us/articles/360025508373-Publish-a-library'
            target='_blank'
            rel='noopener noreferrer'
          >
            Publish this file as a libraryBoo
          </a>
          <br />
          - Make sure to close this file
          <br />
          - Go to #2 Brand file and run the plugin again
          <br />
        </Typography>
      </Flex>
    </Layout>
  );
}
