import { Flex, Typography, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useNavigate } from 'react-router';

export function Introduction() {
  const navigate = useNavigate();

  const handleStartSync = () => {
    console.log('[Introduction] Start Sync button clicked');
    // Mark introduction as synchronized
    parent.postMessage(
      {
        pluginMessage: {
          type: 'MARK_INTRODUCTION_SYNCHRONIZED',
        },
        pluginId: '*',
      },
      '*'
    );
    navigate('/sync-tokens');
  };

  return (
    <Layout>
      <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
        <Typography variant='h6' textAlign='center'>
          Let&apos;s get started
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          This will help walk you through the Recursica files so the variables are synchronized
        </Typography>
        <Button label='Start Sync' onClick={handleStartSync} />
      </Flex>
    </Layout>
  );
}
