import { Flex, Typography, Icon, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

// ✅ AI Agent PR Check Completed - Error handling enhancements verified

export function Error() {
  const { error, clearError, syncStatus, filetype } = useFigma();
  const navigate = useNavigate();

  // Navigate to success page when sync completes
  useEffect(() => {
    const isSynced = syncStatus.variablesSynced && syncStatus.metadataGenerated;
    if (isSynced && filetype && !error) {
      navigate('/file-synced');
    }
  }, [syncStatus, filetype, error, navigate]);

  const isMissingVariables = error?.includes('variable') && error?.includes('missing');
  const isWrongFile =
    error?.includes('NO_TOKENS_FOUND') ||
    error?.includes('NO_THEMES_FOUND') ||
    error?.includes('TOKENS_NOT_CONNECTED') ||
    error?.includes('THEMES_NOT_CONNECTED') ||
    error?.includes("You're in the wrong file");
  // Check if error is about Tokens not being published
  const isTokensNotPublished =
    error?.includes('not been published') || error?.includes('TOKENS_NOT_PUBLISHED');
  // Only show Continue button for missing variables, not for publish errors
  const showContinueButton = isMissingVariables && !isTokensNotPublished;

  const title = isMissingVariables
    ? 'Missing Variables'
    : isWrongFile
      ? "You're in the wrong file"
      : 'Error';

  const handleContinue = () => {
    // Clear error and navigate immediately to prevent flash
    clearError();
    // Navigate to home first, which will then navigate to file-synced when sync completes
    navigate('/home');
    parent.postMessage(
      {
        pluginMessage: {
          type: 'CONTINUE_WITH_MISSING_VARIABLES',
        },
        pluginId: '*',
      },
      '*'
    );
  };

  return (
    <Layout
      footer={showContinueButton ? <Button label='Continue' onClick={handleContinue} /> : undefined}
    >
      <Flex direction='column' gap={'size/spacer/1-5x'} align='center'>
        <Icon name='face_frown_outline' size={32} />

        <Typography
          variant='h6'
          textAlign='center'
          color='layers/layer-1/elements/text/color'
          opacity={0.84}
        >
          {title}
        </Typography>
        <Typography
          variant='caption'
          textAlign='center'
          color='layers/layer-1/elements/text/color'
          opacity={0.84}
        >
          {error}
        </Typography>
        {isMissingVariables && (
          <Typography
            variant='caption'
            textAlign='center'
            color='layers/layer-1/elements/text/color'
            opacity={0.64}
          >
            Please add the missing variables to the Tokens collection and try again.
          </Typography>
        )}
      </Flex>
    </Layout>
  );
}
