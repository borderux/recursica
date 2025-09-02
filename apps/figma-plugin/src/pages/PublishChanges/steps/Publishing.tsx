import { useRepository } from '../../../hooks/useRepository';
import { Typography, Flex, Button, Icon, Box } from '@recursica/ui-kit-mantine';
import { useNavigate } from 'react-router';
import { Layout } from '../../../components/Layout/Layout';
import { Divider, Loader } from '@mantine/core';

export function Publishing() {
  const { publishStatus, bundledJson, iconsJson, resetRepository } = useRepository();
  const navigate = useNavigate();

  const getVariableCounts = () => {
    const counts: Record<string, number> = {
      uiKit: 0,
      themes: 0,
      tokens: 0,
      icons: 0,
    };

    // Count variables from bundled JSON
    if (bundledJson) {
      try {
        const data = JSON.parse(bundledJson);
        counts.tokens = Object.keys(data.tokens || {}).length;
        counts.themes = Object.keys(data.themes || {}).length;
        counts.uiKit = Object.keys(data.uiKit || {}).length;
      } catch (error) {
        console.error('Error parsing bundled JSON:', error);
      }
    }

    // Count icons from icons JSON
    if (iconsJson) {
      try {
        const iconsData = JSON.parse(iconsJson);
        counts.icons = Object.keys(iconsData || {}).length;
      } catch (error) {
        console.error('Error parsing icons JSON:', error);
      }
    }

    return counts;
  };

  const handleNext = async () => {
    await resetRepository();
    navigate('/publish/home');
  };

  if (publishStatus !== 'published') {
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
        <Flex direction='column' gap={'size/spacer/1-5x'} w='100%'>
          {Object.entries(getVariableCounts())
            .filter(([, count]) => count > 0)
            .map(([variableType, count], index) => (
              <>
                {index > 0 && <Divider />}
                <Flex gap={'size/spacer/2x'} key={variableType} align='center'>
                  <Icon name='check_outline' color={'layers/layer-1/elements/success-text'} />
                  <Typography variant='body-2/normal' color='layers/layer-1/elements/success-text'>
                    {count} {variableType === 'uiKit' ? 'UI Kit' : variableType}
                  </Typography>

                  <Typography
                    flex={1}
                    textAlign='right'
                    variant='body-2/normal'
                    color='layers/layer-1/elements/success-text'
                  >
                    Published
                  </Typography>
                </Flex>
              </>
            ))}
        </Flex>
      </Flex>
    </Layout>
  );
}
