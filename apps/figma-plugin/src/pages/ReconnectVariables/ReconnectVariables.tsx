import { useEffect, useState } from 'react';
import { useFigma } from '../../hooks/useFigma';
import { Flex, Typography, Button, Dropdown } from '@recursica/ui-kit';
import { Layout } from '../../components/';

export function ReconnectVariables() {
  const { librariesAvailable, getAvailableLibraries, syncVariables } = useFigma();
  const [selectedLibrary, setSelectedLibrary] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAvailableLibraries();
  }, [getAvailableLibraries]);

  const handleSync = async () => {
    setIsLoading(true);
    const libraryName = selectedLibrary === 'all' ? undefined : selectedLibrary;
    syncVariables(libraryName);
    // Note: In a real implementation, you might want to listen for SYNC_TOKENS_COMPLETE
    // to update the loading state
    setTimeout(() => setIsLoading(false), 2000); // Temporary loading state
  };

  const libraryOptions = [
    { value: 'all', label: 'All Libraries' },
    ...(librariesAvailable
      ? Object.keys(librariesAvailable).map((name) => ({ value: name, label: name }))
      : []),
  ];

  return (
    <Layout>
      <Typography variant='h2'>Reconnect Variables</Typography>
      <Typography variant='body-1/normal'>
        Select a library to sync variables with, or choose &ldquo;All Libraries&rdquo; to sync with
        all available libraries.
      </Typography>

      <Flex direction='column' gap={2}>
        <Typography variant='body-2/strong'>Select Library:</Typography>
        <Dropdown
          data={libraryOptions}
          value={selectedLibrary}
          onChange={(value) => setSelectedLibrary(value || 'all')}
          label='Library'
          showLabel={false}
          placeholder='Select a library'
        />
      </Flex>

      <Button
        onClick={handleSync}
        disabled={isLoading}
        label={isLoading ? 'Syncing...' : 'Sync Variables'}
        style={{ width: '100%' }}
      />

      {librariesAvailable && Object.keys(librariesAvailable).length === 0 && (
        <Typography variant='body-1/normal' color='color-on/background/medium-emphasis'>
          No libraries available. Make sure you have access to team libraries.
        </Typography>
      )}
    </Layout>
  );
}
