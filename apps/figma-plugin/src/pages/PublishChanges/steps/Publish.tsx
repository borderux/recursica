import { useRepository } from '../../../hooks/useRepository';
import { Typography, Flex, Button, Box, Icon, Checkbox } from '@recursica/ui-kit-mantine';
import { Navigate, useNavigate } from 'react-router';
import { Layout } from '../../../components/Layout/Layout';
import { useFigma } from '../../../hooks/useFigma';
import { getPlatformIcon } from './SelectProject';
import { useState } from 'react';

export function Publish() {
  const { publishFiles, clearError, selectedProject } = useRepository();
  const { repository, updateAgreedPublishChanges } = useFigma();
  const [showAgreeScreen, setShowAgreeScreen] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (repository?.agreedPublishChanges) {
      handleConfirm();
    } else {
      handleAgree();
    }
  };

  const handleAgree = () => {
    setShowAgreeScreen(true);
  };

  const handleConfirm = async () => {
    clearError(); // Clear any previous errors
    try {
      navigate('/publish/publishing');
      await publishFiles();
    } catch (error) {
      console.error('Failed to publish files:', error);
      navigate('/publish/error');
    }
  };

  if (!selectedProject) {
    return <Navigate to='/publish/select-project' />;
  }

  if (showAgreeScreen) {
    return (
      <Layout
        header='default'
        footer={
          <Flex
            direction='column'
            align='center'
            justify={'center'}
            w='100%'
            gap={'size/spacer/2x'}
          >
            <Checkbox
              label="Don't show this again"
              onChange={(e) => updateAgreedPublishChanges(e.target.checked)}
              checked={repository?.agreedPublishChanges}
            />
            <Button label='Publish changes' onClick={handleConfirm} />
          </Flex>
        }
      >
        <Typography
          variant='body-1/normal'
          textAlign='center'
          color='layers/layer-1/elements/text/color'
        >
          Publishing creates a new branch in your repo with the latest style updates for your code.
        </Typography>
      </Layout>
    );
  }

  return (
    <Layout
      wrapperProps={{
        justify: 'flex-start',
      }}
      header={
        <Box w='100%'>
          <Typography textAlign='left' variant='body-1/strong'>
            Publish changes
          </Typography>
        </Box>
      }
      footer={
        <Flex justify={'center'} w='100%' gap={'size/spacer/default'}>
          <Button label='Publish changes' onClick={handleContinue} />
        </Flex>
      }
    >
      <Flex direction='column' gap={'size/spacer/3x'} justify='center' align='center'>
        <Flex w='100%' gap={'size/spacer/default'} direction='column'>
          <Flex gap={8} align='center'>
            <Typography variant='body-2/normal' color='form/label/color/default-color'>
              Project
            </Typography>
            <Icon
              name='pencil_square_outline'
              onClick={() => navigate('/publish/select-project')}
              color='layers/layer-1/elements/interactive/color'
            />
          </Flex>
          <Flex gap={8} align='center'>
            <Icon
              name={getPlatformIcon(repository?.platform)}
              color='form/label/color/default-color'
            />
            <Typography variant='body-2/normal' color='form/label/color/default-color'>
              {selectedProject.owner.name}/{selectedProject.name}
            </Typography>
          </Flex>
        </Flex>
        <Box
          style={{ borderRadius: 16 }}
          bc='layers/layer-2/properties/border-color'
          bw={1}
          bs='solid'
          p={'size/spacer/2x'}
        >
          <Typography
            variant='caption'
            color='layers/layer-1/elements/text/color'
            opacity={0.84}
            textAlign='center'
          >
            Nothing has been published yet
            <br />
            <br />
            Don&apos;t just stare at it. Publish your latest Figma file changes to your code.
          </Typography>
        </Box>
      </Flex>
    </Layout>
  );
}
