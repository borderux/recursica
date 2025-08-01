import { Anchor, Button, Dropdown, Flex, Logo, Typography } from '@recursica/ui-kit-mantine';
import { useEffect, useState, useRef } from 'react';
import { apiService, pluginTokenToCode } from '../../services/auth';
import { useNavigate } from 'react-router';
import { useFigma } from '../../hooks/useFigma';
import { Layout } from '../../components';

enum Status {
  SetupAccount,
  SelectProvider,
  WaitingForAuthorization,
  Error,
}

interface PairedKeys {
  userId: string;
  readKey: string;
  code: string;
}

export function Auth() {
  const [status, setStatus] = useState(Status.SetupAccount);
  const [pairedKeys, setPairedKeys] = useState<PairedKeys | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'github' | 'gitlab'>('github');
  const [canRetry, setCanRetry] = useState(false);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    updateRepository: { updateAccessToken, updatePlatform },
    userId,
  } = useFigma();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === Status.WaitingForAuthorization) {
      setCanRetry(false);
      retryTimeout.current = setTimeout(() => setCanRetry(true), 30000);
    } else {
      setCanRetry(false);
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }
    }
    return () => {
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }
    };
  }, [status]);

  useEffect(() => {
    if (pairedKeys) {
      pollForToken(pairedKeys.userId, pairedKeys.readKey, pairedKeys.code);
    }
  }, [pairedKeys]);

  const handleGetStarted = async () => {
    setStatus(Status.WaitingForAuthorization);

    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      // Step 1: Generate keys using secure API service
      const { readKey, writeKey, pluginToken } = await apiService.generateKeys(userId);
      setStatus(Status.WaitingForAuthorization);
      const code = pluginTokenToCode(pluginToken);
      // Step 2: Get authorization URL using secure API service
      const { authUrl } = await apiService.authorize(
        userId,
        readKey,
        writeKey,
        code,
        selectedProvider
      );

      // Step 3: Open the OAuth URL in a new tab
      window.open(authUrl, '_blank', 'width=600,height=700');

      setStatus(Status.WaitingForAuthorization);

      // Step 4: Enhanced polling with better error handling
      setPairedKeys({ userId, readKey, code });
    } catch (error) {
      console.error('Error in OAuth flow:', error);
      setStatus(Status.Error);
    }
  };

  const pollForToken = async (userId: string, readKey: string, code: string) => {
    const poll = async () => {
      try {
        const data = await apiService.getToken(userId, readKey, code);

        if (data.status === 'authenticated') {
          updateAccessToken(data.accessToken);
          navigate('/publish');

          return;
        } else if (data.status === 'pending') {
          // Continue polling
          setTimeout(poll, 5000); // Poll every 5 seconds
          return;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (errorMessage.includes('Authentication failed') || errorMessage.includes('expired')) {
          setStatus(Status.Error);
          return;
        }

        // For other errors, continue polling
        console.warn('Polling error (will retry):', error);
        setTimeout(poll, 5000); // Poll every 5 seconds
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 2000);
  };

  const handleReset = () => {
    if (pairedKeys) {
      setStatus(Status.SetupAccount);
      setPairedKeys(null);
    }
    navigate('/home');
  };

  const handleSelectProvider = (provider: 'gitlab' | 'github') => {
    updatePlatform(provider);
    handleGetStarted();
  };

  const getTitle = () => {
    switch (status) {
      case Status.SetupAccount:
        return 'Set up your account';
      case Status.SelectProvider:
        return 'Select your repo provider';
      case Status.WaitingForAuthorization:
        return 'Authorize your repo';
      case Status.Error:
        return 'Error';
    }
  };

  const getFooter = () => {
    switch (status) {
      case Status.SetupAccount:
        return {
          label: "I've done the steps",
          onClick: () => setStatus(Status.SelectProvider),
        };
      case Status.SelectProvider:
        return {
          label: 'Next',
          disabled: !selectedProvider,
          onClick: () => handleSelectProvider(selectedProvider),
        };
      case Status.WaitingForAuthorization:
        return {
          label: "It's taking too long",
          onClick: () => handleReset(),
          disabled: !canRetry,
        };
      case Status.Error:
        return {
          label: 'Try again',
          onClick: () => handleReset(),
        };
    }
  };

  return (
    <Layout
      footer={<Button {...getFooter()} />}
      header={
        <Flex align='center' gap={24} w='100%'>
          <Button
            size='small'
            variant='text'
            icon='arrow_left_outline'
            onClick={() => navigate('/home')}
            label='Back'
          />
          <Typography flex={1} variant='body-1/strong'>
            {getTitle()}
          </Typography>
          <Logo size='small' onClick={() => navigate('/home')} />
        </Flex>
      }
    >
      {status === Status.SetupAccount && (
        <Typography variant='body-1/normal' textAlign='center'>
          Go to the{' '}
          <Anchor underline='always' target='_blank' rel='noreferrer' href='https://recursica.com'>
            Recursica.com
          </Anchor>{' '}
          website and follow the instructions.
        </Typography>
      )}
      {status === Status.SelectProvider && (
        <Dropdown
          data={[
            { label: 'GitHub', value: 'github', icon: 'github_outline' },
            { label: 'GitLab', value: 'gitlab', icon: 'gitlab_outline' },
          ]}
          value={selectedProvider}
          onChange={(value) => setSelectedProvider(value as 'github' | 'gitlab')}
          label='Select your provider'
          showLabel={false}
          placeholder='Select your provider'
        />
      )}
      {status === Status.WaitingForAuthorization && (
        <Flex direction='column' align='center' gap={8}>
          <Typography variant='body-1/normal' textAlign='center'>
            We’re waiting on the authorization...
          </Typography>
        </Flex>
      )}
      {status === Status.Error && (
        <Typography variant='body-1/normal' textAlign='center'>
          Seems like there was an error connecting
        </Typography>
      )}
    </Layout>
  );
}
