import { Flex, Title, Button, Typography, TextInput, Select } from '@/ui-kit';
import { useFigma } from '@/hooks/useFigma';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export function RepositoryConnection(): JSX.Element {
  const { repository } = useFigma();
  if (!repository) return <Typography>Loading...</Typography>;
  const { updateAccessToken, accessToken } = repository;

  const [inputAccessToken, setInputAccessToken] = useState(accessToken);
  const [platform, setPlatform] = useState<string>(repository.platform || 'gitlab');
  const navigate = useNavigate();

  useEffect(() => {
    setInputAccessToken(accessToken);
  }, [accessToken]);

  const handleAccessTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAccessToken(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputAccessToken) return;
    updateAccessToken(platform as 'gitlab' | 'github', inputAccessToken);
    navigate('/recursica/select-project');
  };

  const handlePlatformChange = (value: string | null) => {
    setPlatform(value || 'gitlab');
  };

  return (
    <Flex flex={1} direction={'column'} gap={'md'} p={'sm'}>
      <form onSubmit={handleSubmit}>
        <Flex direction='column' gap='sm'>
          <Title order={4}>Please visit this URL and enter the code:</Title>
          <Select
            label='Platform'
            data={['gitlab', 'github']}
            value={platform}
            onChange={handlePlatformChange}
          />
          <TextInput
            label='Access token'
            value={inputAccessToken}
            onChange={handleAccessTokenChange}
          />
          <Button label='Save' type='submit' />
        </Flex>
      </form>
    </Flex>
  );
}
