import { Flex, Typography, Button, Logo } from '@recursica/ui-kit';
import { NavLink, useNavigate } from 'react-router';
import { useFigma } from '../../hooks/useFigma';
import { Layout } from '../../components';
import { useEffect, useMemo } from 'react';

export function Home() {
  const { repository, variablesSynced, filetype, error } = useFigma();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate('/error');
    }
  }, [error]);
  const isLoading = !repository || !variablesSynced;

  const target = useMemo(() => {
    if (repository && repository.platform && repository.accessToken) {
      return '/publish';
    }
    return '/auth';
  }, [repository]);

  const getRedirect = useMemo(() => {
    if (filetype === 'ui-kit') {
      return {
        label: 'Connect repo',
        to: target,
      };
    }
    return {
      label: 'Next steps',
      to: '/file-synced',
    };
  }, [filetype]);

  const getLoadingMessage = useMemo(() => {
    if (!variablesSynced) {
      return 'Connecting variables...';
    }
    if (!repository) {
      return 'Checking authentication...';
    }
    return 'Getting this ready for you...';
  }, [variablesSynced, repository]);

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
