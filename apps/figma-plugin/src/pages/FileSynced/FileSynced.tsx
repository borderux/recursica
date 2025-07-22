import { Flex, Typography, Button } from '@recursica/ui-kit';
import { useFigma } from '../../hooks/useFigma';
import { Layout } from '../../components';
import { useMemo } from 'react';

export function FileSynced() {
  const { filetype } = useFigma();

  const getNextStepDescription = useMemo(() => {
    if (filetype === 'tokens') {
      return 'Move to brand files to continue your workflow';
    }
    if (filetype === 'themes') {
      return 'Move to UI kit to continue your workflow';
    }
    return 'You can now close the plugin and continue';
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
    <Layout footer={<Button label='Got it' trailing='arrow_right_outline' onClick={closePlugin} />}>
      <Flex direction='column' align='center' justify='center' gap={16}>
        <Typography
          variant='body-1/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
        >
          To publish your updates correctly, initialize the repo from the UI kit.
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          {getNextStepDescription}
        </Typography>
      </Flex>
    </Layout>
  );
}
