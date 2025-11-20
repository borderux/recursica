import { Flex, Typography, Logo } from '@recursica/ui-kit-mantine';
import { useNavigate } from 'react-router';
import { useFigma } from '../../hooks';
import { Layout } from '../../components';
import { useEffect, useRef, useState } from 'react';

export function Home() {
  const { error, syncMetadata } = useFigma();
  const navigate = useNavigate();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Request sync metadata if not loaded
  useEffect(() => {
    console.log('[Home] Page loaded');
    // Request metadata if not already loaded
    if (syncMetadata === null) {
      console.log('[Home] Requesting sync metadata from plugin');
      parent.postMessage(
        {
          pluginMessage: {
            type: 'GET_SYNC_METADATA',
          },
          pluginId: '*',
        },
        '*'
      );
    }
  }, []);

  useEffect(() => {
    console.log('[Home] Sync metadata from global plugin storage:', syncMetadata);
    if (syncMetadata) {
      console.log('[Home] Tokens:', syncMetadata.tokens);
      console.log('[Home] Brand:', syncMetadata.brand);
      console.log('[Home] Icons:', syncMetadata.icons);
      console.log('[Home] UI Kit:', syncMetadata.uiKit);
    } else {
      console.log('[Home] No sync metadata found in global plugin storage');
    }
  }, [syncMetadata]);

  useEffect(() => {
    if (error) {
      navigate('/error');
      return;
    }

    // Ensure minimum 4 seconds display time
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, 4000 - elapsed);

    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, remaining);

    return () => clearTimeout(timer);
  }, [error, navigate]);

  useEffect(() => {
    if (!minTimeElapsed) {
      return;
    }

    // Use default empty metadata if not loaded yet
    const metadata = syncMetadata || {
      tokens: undefined,
      brand: undefined,
      icons: undefined,
      uiKit: undefined,
    };

    // Check if all files are synchronized
    const allSynced =
      metadata.tokens?.synchronized === true &&
      metadata.brand?.synchronized === true &&
      metadata.icons &&
      metadata.uiKit?.synchronized === true;

    if (allSynced) {
      console.log('[Home] All files synchronized, navigating to file-synced page');
      navigate('/file-synced');
      return;
    }

    // Determine which plugin page to navigate to based on sync status
    // Check workflow order: Tokens -> Brand -> Icons -> UI Kit
    // Each sync page will check file type on load and navigate to error if wrong
    if (!metadata.tokens || metadata.tokens.synchronized !== true) {
      console.log('[Home] Navigating to /sync-tokens');
      navigate('/sync-tokens');
      return;
    }
    if (!metadata.brand || metadata.brand.synchronized !== true) {
      console.log('[Home] Navigating to /sync-brand');
      navigate('/sync-brand');
      return;
    }
    if (!metadata.icons) {
      console.log('[Home] Navigating to /sync-icons');
      navigate('/sync-icons');
      return;
    }
    if (!metadata.uiKit || metadata.uiKit.synchronized !== true) {
      console.log('[Home] Navigating to /sync-ui-kit');
      navigate('/sync-ui-kit');
      return;
    }
  }, [minTimeElapsed, syncMetadata, navigate]);

  return (
    <Layout>
      <Flex direction='column' h='100%'>
        <Flex direction='column' align='center' justify='center' gap={4} flex={1}>
          <Logo />
          <Typography variant='h2'>Recursica</Typography>
        </Flex>
      </Flex>
    </Layout>
  );
}
