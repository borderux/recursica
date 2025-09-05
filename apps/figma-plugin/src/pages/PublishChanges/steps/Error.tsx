import { useRepository } from '../../../hooks/useRepository';
import { Typography, Flex, Button, Box } from '@recursica/ui-kit-mantine';
import { useNavigate } from 'react-router';
import { Layout } from '../../../components/Layout/Layout';

export function Error() {
  const { error, clearError } = useRepository();
  const navigate = useNavigate();

  const handleBack = () => {
    clearError();
    navigate('/publish/select-project');
  };

  return (
    <Layout
      header={
        <Box w='100%'>
          <Typography textAlign='left' variant='body-1/strong'>
            Publish changes
          </Typography>
        </Box>
      }
      footer={
        <Flex justify={'center'} w='100%' gap={'size/spacer/default'}>
          <Button label='Back' onClick={handleBack} leading='arrow_left_outline' />
        </Flex>
      }
    >
      <Flex direction='column' gap={16} justify='center' align='center'>
        <Flex direction='column' gap={16} align='center'>
          <Typography variant='body-1/normal' color='layers/layer-0/elements/text/color'>
            {error?.message || 'An error occurred while publishing files'}
          </Typography>
          {error?.details && (
            <Typography
              variant='body-2/normal'
              color='layers/layer-0/elements/text/color'
              opacity={0.84}
            >
              {error.details}
            </Typography>
          )}
          {error?.code && (
            <Typography
              variant='body-2/normal'
              color='layers/layer-0/elements/text/color'
              opacity={0.84}
            >
              Error code: {error.code}
            </Typography>
          )}
        </Flex>
      </Flex>
    </Layout>
  );
}
