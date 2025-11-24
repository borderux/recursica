import { Flex, Typography, Icon, Button } from '@recursica/ui-kit-mantine';
import { Layout } from '../../components';
import { useFigma } from '../../hooks';
import { NavLink } from 'react-router';
import { useMemo } from 'react';

export function SyncComplete() {
  const { repository } = useFigma();

  const target = useMemo(() => {
    if (repository && repository.platform && repository.accessToken) {
      if (repository.selectedProject) {
        return '/publish/home';
      } else {
        return '/publish/select-project';
      }
    }
    return '/auth';
  }, [repository]);

  return (
    <Layout
      header='default'
      footer={<Button component={NavLink} to={target} label='Connect Git repository' />}
    >
      <Flex direction='column' align='center' justify='center' gap={16}>
        <Icon name='check_circle_outline' size={48} color='layers/layer-1/elements/success-text' />
        <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/success-text'>
          All Files Synchronized!
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-1/elements/success-text'
        >
          All your design files have been successfully synchronized. You&apos;re ready to connect
          your Git repository and start publishing changes.
        </Typography>
      </Flex>
    </Layout>
  );
}
