import { Flex, Typography, Icon } from '@recursica/ui-kit-mantine';
import { useFigma } from '../../hooks/useFigma';
import { Layout } from '../../components';
import { useMemo } from 'react';

export function FileSynced() {
  const { filetype } = useFigma();

  const getNextStepDescription = useMemo(() => {
    if (filetype === 'tokens') {
      return '#2 Brand file';
    }
    if (filetype === 'themes') {
      return '#4 UI kit file';
    }
    return 'You can now close the plugin and continue';
  }, [filetype]);

  return (
    <Layout header='default'>
      <Flex direction='column' align='center' justify='center' gap={16}>
        <Icon name='check_circle_outline' color='layers/layer-1/elements/success-text' />
        <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/success-text'>
          Nice! Move on from here.
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-1/elements/success-text'
        >
          Finally, go to <b>{getNextStepDescription}</b> file and run the plugin once more
        </Typography>
      </Flex>
    </Layout>
  );
}
