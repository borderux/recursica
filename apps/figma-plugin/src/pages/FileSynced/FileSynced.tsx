import { Flex, Typography, Icon, Button } from '@recursica/ui-kit-mantine';
import { useFigma } from '../../hooks/useFigma';
import { Layout } from '../../components';
import { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router';

export function FileSynced() {
  const { repository } = useFigma();
  const navigate = useNavigate();

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

  const handleResync = () => {
    console.log('[FileSynced] Resync Files button clicked');

    // Clear sync metadata
    parent.postMessage(
      {
        pluginMessage: {
          type: 'CLEAR_SYNC_METADATA',
        },
        pluginId: '*',
      },
      '*'
    );

    // Navigate to home page, which will route to the appropriate sync page
    navigate('/home');
  };

  return (
    <Layout
      header='default'
      footer={
        <Flex direction='column' gap={8} w='100%'>
          <Button component={NavLink} to={target} label='Connect Git repository' />
          <Button variant='text' label='Resync Files' onClick={handleResync} />
        </Flex>
      }
    >
      <Flex direction='column' align='center' justify='center' gap={16}>
        <Icon name='check_circle_outline' color='layers/layer-1/elements/success-text' />
        <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/success-text'>
          All files synchronized!
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-1/elements/success-text'
        >
          All your design files have been successfully synchronized.
        </Typography>
      </Flex>
    </Layout>
  );
}
