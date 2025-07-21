import { Flex, Typography, Button, Logo } from '@recursica/ui-kit';
import { useFigma } from '../../hooks/useFigma';
import { Layout } from '../../components';
import { useMemo } from 'react';

export function FileSynced() {
  const { filetype } = useFigma();

  const getNextStep = useMemo(() => {
    if (filetype === 'tokens') {
      return {
        label: 'Continue to Brand Files',
        description: 'Move to brand files to continue your workflow',
      };
    }
    if (filetype === 'themes') {
      return {
        label: 'Continue to UI Kit',
        description: 'Move to UI kit to continue your workflow',
      };
    }
    return {
      label: 'Continue',
      description: 'You can now close the plugin and continue',
    };
  }, [filetype]);

  const closePlugin = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'CLOSE_PLUGIN',
        },
        pluginId: '*',
      },
      '*'
    );
  };

  return (
    <Layout>
      <Flex direction='column' h='100%'>
        <Flex direction='column' align='center' justify='center' gap={4} flex={1}>
          <Logo />
          <Typography variant='h2'>Success!</Typography>
          <Typography
            variant='body-1/normal'
            textAlign='center'
            color='layers/layer-0/elements/text/color'
            opacity={0.84}
          >
            The plugin ran correctly. Metadata was added and variables were reconnected.
          </Typography>
          <Typography
            variant='body-2/normal'
            textAlign='center'
            color='layers/layer-0/elements/text/color'
            opacity={0.64}
          >
            {getNextStep.description}
          </Typography>
        </Flex>
        <Flex gap={2} justify='center'>
          <Button label={getNextStep.label} trailing='arrow_right_outline' onClick={closePlugin} />
        </Flex>
      </Flex>
    </Layout>
  );
}
