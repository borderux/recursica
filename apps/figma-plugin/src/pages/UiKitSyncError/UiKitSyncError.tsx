import { Flex, Typography, Icon, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export function UiKitSyncError() {
  const { filetype, error, clearError } = useFigma();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[UiKitSyncError] Page loaded');
  }, []);

  // Show warning if not in UI Kit file
  const isWrongFile = filetype && filetype !== 'ui-kit';
  const isSyncError = !isWrongFile; // If not wrong file, it's a sync error

  const handleContinue = () => {
    console.log('[UiKitSyncError] Continue button clicked, marking UI Kit as synchronized');
    clearError(); // Clear error to prevent flash
    parent.postMessage(
      {
        pluginMessage: {
          type: 'MARK_UI_KIT_SYNCHRONIZED',
        },
        pluginId: '*',
      },
      '*'
    );
    navigate('/home?skip-splash=true');
  };

  return (
    <Layout footer={isSyncError ? <Button label='Continue' onClick={handleContinue} /> : undefined}>
      <Flex direction='column' h='100%' align='center' justify='center' gap={16}>
        <Icon name='face_frown_outline' size={48} color='layers/layer-1/elements/alert-text' />
        <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/alert-text'>
          {isWrongFile ? 'This does not appear to be the #4 UI Kit file' : 'UI Kit Sync Failed'}
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          {isWrongFile
            ? 'Please download the #4 UI Kit file and run this plugin again'
            : error || 'An error occurred while syncing UI Kit. Please try again.'}
        </Typography>
      </Flex>
    </Layout>
  );
}
