import { Button, Flex, Typography } from '@recursica/ui-kit';
import { useEffect, useState } from 'react';
import { apiService, pluginTokenToCode } from '../../services/auth';
import { useNavigate } from 'react-router';
import { useRepository } from '../../hooks/useRepository';

enum Status {
  NotAuthorized,
  AuthorizationTimeout,
  WaitingForAuthorization,
  Error,
}

interface PairedKeys {
  user_id: string;
  read_key: string;
  code: string;
}

export function Auth() {
  const [status, setStatus] = useState(Status.NotAuthorized);
  const { updateAccessToken } = useRepository();
  const navigate = useNavigate();
  const [pairedKeys, setPairedKeys] = useState<PairedKeys | null>(null);

  useEffect(() => {
    handleGetStarted();
  }, []);

  useEffect(() => {
    if (pairedKeys) {
      pollForToken(pairedKeys.user_id, pairedKeys.read_key, pairedKeys.code);
    }
  }, [pairedKeys]);

  const handleGetStarted = async () => {
    setStatus(Status.NotAuthorized);

    try {
      // Generate a user_id (you might want to get this from your auth system)
      const user_id = Math.random().toString(36).substring(2, 15);

      // Step 1: Generate keys using secure API service
      const { read_key, write_key, plugin_token } = await apiService.generateKeys(user_id);
      setStatus(Status.WaitingForAuthorization);
      const code = pluginTokenToCode(plugin_token);
      // Step 2: Get authorization URL using secure API service
      const { authUrl } = await apiService.authorize(user_id, read_key, write_key, code);

      // Step 3: Open the OAuth URL in a new tab
      window.open(authUrl, '_blank', 'width=600,height=700');

      setStatus(Status.WaitingForAuthorization);

      // Step 4: Enhanced polling with better error handling
      setPairedKeys({ user_id, read_key, code });
    } catch (error) {
      console.error('Error in OAuth flow:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Handle specific security errors
      if (errorMessage.includes('Unauthorized origin')) {
        setStatus(Status.Error);
      } else if (errorMessage.includes('Invalid API key')) {
        setStatus(Status.Error);
      } else if (errorMessage.includes('Rate limit exceeded')) {
        setStatus(Status.AuthorizationTimeout);
      } else {
        setStatus(Status.Error);
      }
    }
  };

  const pollForToken = async (user_id: string, read_key: string, code: string) => {
    const maxAttempts = 10; // Poll for up to 5 minutes
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setStatus(Status.AuthorizationTimeout);
        return;
      }

      try {
        const data = await apiService.getToken(user_id, read_key, code);

        if (data.status === 'authenticated') {
          updateAccessToken(data.access_token);
          navigate('/recursica/select-project');

          return;
        } else if (data.status === 'pending') {
          // Continue polling
          attempts++;
          setTimeout(poll, 5000); // Poll every 3 seconds
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
        attempts++;
        setTimeout(poll, 5000);
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 2000);
  };

  const handleRefresh = () => {
    if (pairedKeys) {
      setStatus(Status.WaitingForAuthorization);
      setPairedKeys(null);
      pollForToken(pairedKeys.user_id, pairedKeys.read_key, pairedKeys.code);
    }
  };

  return (
    <Flex direction='column' align='center' gap={16}>
      {status === Status.NotAuthorized && (
        <Typography variant='body-1/normal' textAlign='center'>
          Check your browser to connect to Recursica.
        </Typography>
      )}
      {(status === Status.WaitingForAuthorization || status === Status.AuthorizationTimeout) && (
        <>
          <Flex direction='column' align='center' gap={8}>
            <Typography variant='body-1/normal' textAlign='center'>
              We’re waiting on the authorization...
            </Typography>
            <Typography variant='body-2/normal' textAlign='center'>
              If you finished the authorization and it’s been longer than 30 seconds, click the
              &quot;refresh&quot; button.
            </Typography>
          </Flex>
          <Button
            onClick={handleRefresh}
            label='Refresh'
            loading={status !== Status.AuthorizationTimeout}
          />
        </>
      )}
      {status === Status.Error && (
        <Typography variant='body-1/normal' textAlign='center'>
          Seems like there was an error connecting
        </Typography>
      )}
    </Flex>
  );
}
