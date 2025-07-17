import { Flex, Typography, Button, Logo } from '@recursica/ui-kit';
import { NavLink } from 'react-router';
import { useFigma } from '../../hooks/useFigma';
import { Layout } from '../../components';
import { useMemo } from 'react';

export function Home() {
  const { repository } = useFigma();

  const target = useMemo(() => {
    if (repository && repository.platform && repository.accessToken) {
      return '/publish';
    }
    return '/auth';
  }, [repository]);

  return (
    <Layout>
      <Flex direction='column' h='100%'>
        <Flex direction='column' align='center' justify='center' gap={4} flex={1}>
          <Logo />
          <Typography variant='h2'>Recursica</Typography>
        </Flex>
        {!repository ? (
          <Typography
            variant='body-1/normal'
            textAlign='center'
            color='layers/layer-0/elements/text/color'
          >
            Getting this ready for you...
          </Typography>
        ) : (
          <Button
            component={NavLink}
            to={target}
            label='Get started'
            trailing='arrow_right_outline'
          />
        )}
      </Flex>
    </Layout>
  );
}
