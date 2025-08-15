import { Flex, Typography, Icon } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';

export function Error() {
  return (
    <Layout>
      <Flex direction='column' gap={'size/spacer/1-5x'} align='center'>
        <Icon name='face_frown_outline' size={32} />

        <Typography
          variant='h6'
          textAlign='center'
          color='layers/layer-1/elements/text/color'
          opacity={0.84}
        >
          You’re in the wrong file
        </Typography>
      </Flex>
    </Layout>
  );
}
