import { Flex, Typography, Button, Logo } from '@recursica/ui-kit-mantine';
import { NavLink, useNavigate } from 'react-router';
import { useFigma } from '../../hooks/useFigma';
import { Layout } from '../../components';
import { useEffect, useMemo } from 'react';

export function Home() {
  const { repository, syncStatus, filetype, error } = useFigma();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate('/error');
    }
  }, [error]);

  useEffect(() => {
    if (syncStatus.variablesSynced && syncStatus.metadataGenerated && filetype !== 'ui-kit') {
      navigate('/file-synced');
    }
  }, [syncStatus, navigate, filetype]);

  const isLoading = !repository || !syncStatus.variablesSynced || !syncStatus.metadataGenerated;

  const target = useMemo(() => {
    if (repository && repository.platform && repository.accessToken) {
      return '/publish';
    }
    return '/auth';
  }, [repository]);

  const getRedirect = useMemo(() => {
    if (filetype === 'ui-kit' || filetype === 'icons') {
      return {
        label: 'Connect repo',
        to: target,
      };
    }
    return {
      label: 'Next steps',
      to: '/file-synced',
    };
  }, [filetype, target]);

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
          {isLoading ? (
            <Typography
              variant='body-1/normal'
              textAlign='center'
              color='layers/layer-0/elements/text/color'
              opacity={0.84}
            >
              {getLoadingMessage}
            </Typography>
          ) : (
            <Button
              disabled={!filetype}
              component={NavLink}
              to={getRedirect.to}
              label={getRedirect.label}
              trailing='arrow_right_outline'
            />
          )}
        </Flex>
      </Flex>
    </Layout>
  );
}
