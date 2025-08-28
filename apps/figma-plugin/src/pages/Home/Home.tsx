import { Flex, Typography, Logo } from '@recursica/ui-kit-mantine';
import { useNavigate } from 'react-router';
import { useFigma } from '../../hooks';
import { Layout } from '../../components';
import { useEffect, useMemo } from 'react';

export function Home() {
  const { repository, syncStatus, error, filetype } = useFigma();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate('/error');
    }
  }, [error]);

  useEffect(() => {
    const isSynced = syncStatus.variablesSynced && syncStatus.metadataGenerated;
    if (isSynced && filetype) {
      navigate('/file-synced');
    }
  }, [syncStatus, navigate, filetype]);

  const isLoading = !repository || !syncStatus.variablesSynced || !syncStatus.metadataGenerated;

  const getLoadingMessage = useMemo(() => {
    if (!syncStatus.variablesSynced) {
      return 'Connecting variables...';
    }
    if (!syncStatus.metadataGenerated) {
      return 'Syncing metadata...';
    }
    if (!repository) {
      return 'Checking authentication...';
    }
    return 'Getting this ready for you...';
  }, [syncStatus.variablesSynced, syncStatus.metadataGenerated, repository]);

  return (
    <Layout>
      <Flex direction='column' h='100%'>
        <Flex direction='column' align='center' justify='center' gap={4} flex={1}>
          <Logo />
          <Typography variant='h2'>Recursica</Typography>
        </Flex>
        <Flex gap={2} justify='center'>
          {isLoading && (
            <Typography
              variant='body-1/normal'
              textAlign='center'
              color='layers/layer-0/elements/text/color'
              opacity={0.84}
            >
              {getLoadingMessage}
            </Typography>
          )}
        </Flex>
      </Flex>
    </Layout>
  );
}
