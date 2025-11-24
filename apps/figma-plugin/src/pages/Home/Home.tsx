import { Flex, Typography, Logo } from '@recursica/ui-kit-mantine';
import { useNavigate, useSearchParams, useLocation } from 'react-router';
import { useFigma } from '../../hooks';
import { Layout } from '../../components';
import { useEffect, useRef, useState } from 'react';

export function Home() {
  const { error, syncMetadata } = useFigma();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const skipSplash = searchParams.get('skip-splash') === 'true';
  const [minTimeElapsed, setMinTimeElapsed] = useState(skipSplash);
  const startTimeRef = useRef<number>(Date.now());

  // Request sync metadata if not loaded, or refresh if skip-splash is present
  useEffect(() => {
    console.log('[Home] Page loaded', { skipSplash });
    // Always request fresh metadata when skip-splash is present (coming from Continue button)
    if (skipSplash || syncMetadata === null) {
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
  }, [skipSplash]);

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

    // Skip delay if skip-splash param is present
    if (skipSplash) {
      setMinTimeElapsed(true);
      return;
    }

    // Ensure minimum 4 seconds display time
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, 4000 - elapsed);

    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, remaining);

    return () => clearTimeout(timer);
  }, [error, navigate, skipSplash]);

  useEffect(() => {
    if (!minTimeElapsed) {
      return;
    }

    // When skip-splash is present, wait for metadata to be loaded before routing
    if (skipSplash && syncMetadata === null) {
      console.log('[Home] Waiting for metadata to load (skip-splash mode)');
      return;
    }

    // If no metadata exists at all, navigate to Introduction page
    if (syncMetadata === null) {
      console.log('[Home] No metadata found, navigating to Introduction');
      navigate('/introduction');
      return;
    }

    // Use default empty metadata if not loaded yet
    const metadata = syncMetadata || {
      introduction: undefined,
      tokens: undefined,
      brand: undefined,
      icons: undefined,
      uiKit: undefined,
    };

    // Check if introduction is not synchronized or doesn't exist - if so, go to Introduction
    const introductionSynced = metadata.introduction?.synchronized === true;
    if (!introductionSynced) {
      console.log('[Home] Introduction not synchronized, navigating to Introduction');
      navigate('/introduction');
      return;
    }

    // Check if all files are synchronized
    const tokensSynced = metadata.tokens?.synchronized === true;
    const brandSynced = metadata.brand?.synchronized === true;
    const iconsSynced = metadata.icons !== undefined;
    const uiKitSynced = metadata.uiKit?.synchronized === true;

    const allSynced = tokensSynced && brandSynced && iconsSynced && uiKitSynced;

    if (allSynced) {
      // Only navigate if we're not already on the file-synced page
      if (location.pathname !== '/file-synced') {
        console.log('[Home] All files synchronized, navigating to file-synced page');
        navigate('/file-synced', { replace: true });
      }
      return;
    }

    // Navigate to the first stage that is missing or not synchronized
    // Check in order: Tokens -> Brand -> Icons -> UI Kit
    // Each sync page will check file type on load and navigate to error if wrong

    // #1 Tokens: missing entry or not synchronized
    if (!metadata.tokens || metadata.tokens.synchronized !== true) {
      console.log('[Home] Tokens missing or not synchronized, navigating to /sync-tokens');
      navigate('/sync-tokens');
      return;
    }

    // #2 Brand: missing entry or not synchronized
    if (!metadata.brand || metadata.brand.synchronized !== true) {
      console.log('[Home] Brand missing or not synchronized, navigating to /sync-brand');
      navigate('/sync-brand');
      return;
    }

    // #3 Icons: missing entry
    if (!metadata.icons) {
      console.log('[Home] Icons missing, navigating to /sync-icons');
      navigate('/sync-icons');
      return;
    }

    // #4 UI Kit: missing entry or not synchronized
    if (!metadata.uiKit || metadata.uiKit.synchronized !== true) {
      console.log('[Home] UI Kit missing or not synchronized, navigating to /sync-ui-kit');
      navigate('/sync-ui-kit');
      return;
    }
  }, [minTimeElapsed, syncMetadata, navigate, skipSplash]);

  return (
    <Layout>
      <Flex direction='column' h='100%'>
        {!skipSplash && (
          <Flex direction='column' align='center' justify='center' gap={4} flex={1}>
            <Logo />
            <Typography variant='h2'>Recursica</Typography>
          </Flex>
        )}
      </Flex>
    </Layout>
  );
}
