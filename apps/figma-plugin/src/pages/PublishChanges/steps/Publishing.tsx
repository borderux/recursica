import { useRepository } from '../../../hooks/useRepository';
import { Typography, Flex, Button, Icon, IconName, Box } from '@recursica/ui-kit-mantine';
import { useNavigate } from 'react-router';
import { Layout } from '../../../components/Layout/Layout';
import { FileStatus } from '../../../hooks';
import { Loader } from '@mantine/core';

export function Publishing() {
  const { prLink, filesStatus, resetRepository } = useRepository();
  const navigate = useNavigate();

  const getIcon = (status: FileStatus): IconName => {
    switch (status) {
      case FileStatus.Loading:
        return 'arrow_path_outline';
      case FileStatus.Done:
        return 'check_outline';
      case FileStatus.Error:
        return 'exclamation_circle_outline';
      case FileStatus.Pending:
        return 'clock_outline';
    }
  };

  const handleNext = async () => {
    await resetRepository();
    navigate('/publish/home');
  };

  if (!prLink) {
    return (
      <Layout
        header={
          <Box w='100%'>
            <Typography textAlign='left' variant='body-1/strong'>
              Publish changes
            </Typography>
          </Box>
        }
      >
        <Flex direction='column' gap={'size/spacer/default'} justify='center' align='center'>
          <Loader />
          <Typography variant='body-1/normal' color='layers/layer-0/elements/text/color'>
            Publishing...
          </Typography>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout
      header={
        <Box w='100%'>
          <Typography textAlign='left' variant='body-1/strong'>
            Publish changes
          </Typography>
        </Box>
      }
      footer={<Button label={'Okay'} onClick={handleNext} />}
    >
      <Flex direction='column' gap={16} justify='center' align='center'>
        <Flex direction='column' gap={8} w='100%'>
          {Object.entries(filesStatus)
            .filter(([, val]) => val.quantity > 0)
            .map(([key, value]) => (
              <Flex gap={8} key={key} align='center'>
                <Icon name={getIcon(value.status)} spin={value.status === FileStatus.Loading} />
                <Typography variant='body-2/normal' color='layers/layer-0/elements/text/color'>
                  {value.quantity > 0
                    ? `${parseInt(value.quantity).toLocaleString()} ${key}`
                    : `No ${key} found`}
                </Typography>
              </Flex>
            ))}
        </Flex>
      </Flex>
    </Layout>
  );
}
