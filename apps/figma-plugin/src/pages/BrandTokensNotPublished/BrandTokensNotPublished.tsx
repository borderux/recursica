import { Flex, Typography, Icon } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useEffect } from 'react';

export function BrandTokensNotPublished() {
  useEffect(() => {
    console.log('[BrandTokensNotPublished] Page loaded');
  }, []);

  return (
    <Layout>
      <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
        <Icon name='face_frown_outline' size={48} color='layers/layer-1/elements/alert-text' />
        <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/alert-text'>
          Tokens File Not Published
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='left'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          Ensure you did the following steps: <br />-{' '}
          <a
            href='https://help.figma.com/hc/en-us/articles/360025508373-Publish-a-library'
            target='_blank'
            rel='noopener noreferrer'
          >
            Publish the #1 Tokens file as a library
          </a>{' '}
          <br />-{' '}
          <a
            href='https://help.figma.com/hc/en-us/articles/1500008731201-Add-or-remove-a-library-from-a-design-file'
            target='_blank'
            rel='noopener noreferrer'
          >
            Add the Tokens library to the this file
          </a>
          <br />
          - Run the plugin again in the Tokens file
          <br />
          <br />
          NOTE: You may need to close and reopen the file
          <br />
        </Typography>
      </Flex>
    </Layout>
  );
}
