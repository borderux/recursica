import { Flex, Typography, Icon, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export function BrandSyncError() {
  const { error, filetype } = useFigma();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[BrandSyncError] Page loaded');
  }, []);

  // Show warning if not in Brand file
  const isWrongFile = filetype && filetype !== 'themes';

  const handleContinue = () => {
    console.log(
      '[BrandSyncError] Continue button clicked, navigating to sync-brand with ignore-error=true'
    );
    navigate('/sync-brand?ignore-error=true');
  };

  return (
    <Layout
      footer={!isWrongFile ? <Button label='Continue' onClick={handleContinue} /> : undefined}
    >
      <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
        <Icon name='face_frown_outline' size={48} color='layers/layer-1/elements/alert-text' />
        <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/alert-text'>
          {isWrongFile ? 'This does not appear to be the #2 Brand file' : 'Brand Sync Failed'}
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          {isWrongFile
            ? 'Please download the Brand page and run this plugin again'
            : error || 'An error occurred while syncing brand. Please try again.'}
        </Typography>
      </Flex>
    </Layout>
  );
}
