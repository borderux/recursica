import { Flex } from '@/ui-kit/components/Flex/Flex';
import { Button, Typography, MultiSelect, Select } from '@/ui-kit';
import { useRepository } from '@/hooks/useRepository';
import { useFigma } from '@/hooks/useFigma';
import { NavLink } from 'react-router';

export function SelectSources() {
  const { libraries } = useFigma();
  const {
    tokenCollection,
    themesCollections,
    updateTokenCollection,
    updateThemesCollections,
    fetchSources,
  } = useRepository();
  const availableLibraries = Object.keys(libraries.availableLibraries ?? {})
    .filter((val) => {
      const collections = libraries?.availableLibraries?.[val];
      return collections?.some((collection) => collection.name === 'ID variables');
    })
    .map((library) => library);
  return (
    <Flex direction={'column'} align={'center'} gap={20}>
      <Typography>Select Sources</Typography>
      <Select
        label='Select a token collection source'
        data={availableLibraries ?? []}
        value={tokenCollection}
        onChange={(value) => {
          if (value) {
            updateTokenCollection(value);
          }
        }}
      />
      <MultiSelect
        label='Select a theme collection source'
        data={availableLibraries ?? []}
        value={themesCollections}
        onChange={(value) => {
          if (value) {
            updateThemesCollections(value);
          }
        }}
      />
      {tokenCollection && themesCollections && (
        <Button
          disabled={!tokenCollection || !themesCollections}
          onClick={fetchSources}
          component={NavLink}
          to='/figma/fetch-data'
          label='Fetch Data'
        />
      )}
    </Flex>
  );
}
