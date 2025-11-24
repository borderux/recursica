import { Flex, Typography, Icon } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useEffect } from 'react';

export function UiKitBrandNotPublished() {
  const { error } = useFigma();

  useEffect(() => {
    console.log('[UiKitBrandNotPublished] Page loaded');
  }, []);

  return (
    <Layout footer={undefined}>
      <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
        <Icon name='face_frown_outline' size={48} color='layers/layer-1/elements/alert-text' />
        <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/alert-text'>
          Brand File Not Published
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          {error ||
            'The Brand collection is not accessible. Please publish the Brand library and add it as library to this file, then run the plugin again.'}
        </Typography>
      </Flex>
    </Layout>
  );
}
