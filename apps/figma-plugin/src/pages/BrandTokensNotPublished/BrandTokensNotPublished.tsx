import { Flex, Typography, Icon } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useEffect } from 'react';

export function BrandTokensNotPublished() {
  const { error } = useFigma();

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
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          {error ||
            'The Tokens file has not been published. Please publish the Tokens library and add it to the this file, then run the plugin again in the Tokens file.'}
        </Typography>
      </Flex>
    </Layout>
  );
}
